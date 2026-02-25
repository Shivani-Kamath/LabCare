


// const Equipment = require("../models/equipment");
// const Fault = require("../models/fault");
// const { predictFault } = require("../ml/randomForest"); // your existing ML logic

// // Predict faults for selected equipment
// exports.predictSystemFaultHandler = async (req, res) => {
//   try {
//     const { componentIds } = req.body; // Expecting an array of equipment _id strings

//     if (!componentIds || !Array.isArray(componentIds) || componentIds.length === 0) {
//       return res.status(400).json({ error: "componentIds array is required" });
//     }

//     // Fetch selected equipment from DB
//     const equipments = await Equipment.find({ _id: { $in: componentIds } });

//     const results = [];

//     for (const eq of equipments) {
//       const faults = await Fault.find({ equipmentId: eq._id });
//       const ageInYears = Math.floor(
//         (new Date() - new Date(eq.purchaseDate)) / (1000 * 60 * 60 * 24 * 365)
//       );
//       const faultCount = faults.length;

//       // Call your Random Forest predictor
//       const prediction = predictFault({ ageInYears, faultCount, condition: eq.condition });

//       results.push({
//         component: eq.name,
//         faulty: prediction.faulty,
//         action: prediction.advice || "—",
//         time_to_action: prediction.time_to_action || "within 1 month",
//         priority_score: prediction.priority_score || faultCount + ageInYears,
//       });
//     }

//     res.json(results);
//   } catch (err) {
//     console.error("❌ Prediction error:", err);
//     res.status(500).json({ error: err.message });
//   }
// };


// backend/controllers/ml.controller.js
const { spawn } = require("child_process");
const path = require("path");
const mongoose = require("mongoose");
const Equipment = require("../models/equipment");
const Fault = require("../models/fault");
const User = require("../models/user");
const { buildDatasetCSV } = require("../ml/dataExtractor");

const ML_DIR = path.join(__dirname, "..", "ml");
const TRAIN_PY = path.join(ML_DIR, "train_model.py");
const PREDICT_PY = path.join(ML_DIR, "predict.py");

exports.trainFaultModel = async (req, res) => {
  try {
    const csv = await buildDatasetCSV();
    const py = spawn("python", [TRAIN_PY, csv], { cwd: ML_DIR });

    let out = "", err = "";
    py.stdout.on("data", d => out += d.toString());
    py.stderr.on("data", d => err += d.toString());

    py.on("close", code => {
      if (code !== 0) {
        console.error("Train error:", err);
        return res.status(500).json({ error: "Training failed", details: err });
      }
      return res.json({ message: "Model trained", details: out });
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
};

function getSeverity(score) {
  if (score >= 14) return "Critical";
  if (score >= 10) return "High";
  if (score >= 6) return "Medium";
  return "Low";
}

exports.predictSystemFaultHandler = async (req, res) => {
  try {
    const { componentIds } = req.body;
    if (!componentIds || !Array.isArray(componentIds) || componentIds.length === 0)
      return res.status(400).json({ error: "componentIds array is required" });

    // convert to ObjectIds
    const oids = componentIds.map(id => new mongoose.Types.ObjectId(id));

    // fetch equipments
    const equipments = await Equipment.find({ _id: { $in: oids } });

    // precompute faults aggregation
    const faultsAgg = await Fault.aggregate([
      { $match: { equipmentId: { $in: oids } } },
      { $group: { _id: "$equipmentId", count: { $sum: 1 }, resolved: { $sum: { $cond: [ { $eq: [ "$status", "Resolved" ] }, 1, 0 ] } } } }
    ]);

    const faultMap = {};
    faultsAgg.forEach(f => { 
      faultMap[String(f._id)] = { faultCount: f.count || 0, resolvedCount: f.resolved || 0 }; 
    });

    // prefetch last faults to avoid N+1 query
    const lastFaultsRaw = await Fault.find({ equipmentId: { $in: oids } })
      .sort({ createdAt: -1 })
      .lean();

    const lastFaultMap = {};
    lastFaultsRaw.forEach(f => {
      if (!lastFaultMap[f.equipmentId]) lastFaultMap[f.equipmentId] = f;
    });

    // build input for python
    const inputForPy = equipments.map(eq => {
      const fm = faultMap[String(eq._id)] || { faultCount: 0, resolvedCount: 0 };
      const faultCount = fm.faultCount;
      const resolvedRatio = faultCount === 0 ? 0 : (fm.resolvedCount / faultCount);

      const lastFault = lastFaultMap[String(eq._id)];
      const lastFaultDays = lastFault ? Math.floor((Date.now() - new Date(lastFault.createdAt).getTime())/(1000*60*60*24)) : 9999;

      let ageMonths = 0;
      try {
        const pd = new Date(eq.purchaseDate);
        ageMonths = Math.max(0, Math.floor((Date.now()-pd.getTime())/(1000*60*60*24*30)));
      } catch { ageMonths = 0; }

      const condition = String(eq.condition || "average");
      const conditionCode = ["good","working"].includes(condition.toLowerCase()) ? 0 : (condition.toLowerCase()==="average" ? 1 : 2);

      return {
        equipmentId: String(eq._id),
        name: eq.name || "Unknown",
        labName: eq.labName || "Unknown",
        purchaseDate: eq.purchaseDate ? new Date(eq.purchaseDate).toISOString().split('T')[0] : "",
        ageMonths,
        condition,
        conditionCode,
        faultCount,
        lastFaultDays,
        resolvedRatio,
        reportedByLabInchargeRatio: 0
      };
    });

    // call python predictor
    const py = spawn("python", [PREDICT_PY], { cwd: ML_DIR });
    let out = "", err = "";
    py.stdout.on("data", d => out += d.toString());
    py.stderr.on("data", d => err += d.toString());

    py.on("close", async (code) => {
      if (code !== 0) {
        console.error("Predict error:", err);
        return res.status(500).json({ error: "Prediction failed", details: err });
      }

      let pyResults = [];
      try { pyResults = JSON.parse(out); } catch (e) {
        console.error("JSON parse error:", e, out);
        return res.status(500).json({ error: "Prediction parse error", details: e.message });
      }

      // suggest technician (least loaded)
      const techs = await User.find({ role: "technician" });
      let techSuggestion = null;
      if (techs.length > 0) {
        const techIds = techs.map(t => t._id);
        const loads = await Fault.aggregate([
          { $match: { assignedTo: { $in: techIds } } },
          { $group: { _id: "$assignedTo", count: { $sum: 1 } } }
        ]);
        const loadMap = {};
        loads.forEach(l => loadMap[String(l._id)] = l.count);
        techSuggestion = techs.reduce((a,b) => {
          const la = loadMap[String(a._id)] || 0;
          const lb = loadMap[String(b._id)] || 0;
          return la <= lb ? a : b;
        }, techs[0]);
      }

      // compute cascade risk per lab among selected equipments
      const labCounts = {};
      for (const eq of equipments) {
        const lab = eq.labName || "Unknown";
        labCounts[lab] = labCounts[lab] || { total:0, risky:0 };
        labCounts[lab].total += 1;
        const fm = faultMap[String(eq._id)] || { faultCount: 0 };
        if (fm.faultCount >= 2) labCounts[lab].risky += 1;
      }

      const final = pyResults.map(r => {
        const lab = r.labName || "Unknown";
        const labInfo = labCounts[lab] || { total: 1, risky: 0 };
        const cascadeRisk = labInfo.total === 0 ? 0 : +(labInfo.risky / labInfo.total).toFixed(2);
        return {
          ...r,
          suggestedTechnician: techSuggestion ? { _id: techSuggestion._id, full_name: techSuggestion.full_name } : null,
          cascadeRisk,
          severity: getSeverity(r.priority_score)
        };
      });

      return res.json(final);
    });

    // write JSON to python stdin
    py.stdin.write(JSON.stringify(inputForPy));
    py.stdin.end();

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
};
