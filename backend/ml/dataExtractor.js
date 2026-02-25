// backend/ml/dataExtractor.js
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const Equipment = require("../models/equipment");
const Fault = require("../models/fault");
const User = require("../models/user");
const dbConfig = require("../config/db.config");

const OUT_CSV = path.join(__dirname, "equipment_faults_dataset.csv");
const conditionMap = { good: 0, working: 0, average: 1, poor: 2 };

async function connectDB() {
  return mongoose.connect(dbConfig.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}

async function buildDatasetCSV() {
  await connectDB();
  const equipments = await Equipment.find({});
  const header = [
    "equipmentId","name","labName","purchaseDate",
    "ageMonths","conditionCode","faultCount",
    "lastFaultDays","resolvedRatio","reportedByLabInchargeRatio"
  ];
  const rows = [header.join(",")];

  for (const eq of equipments) {
    const faults = await Fault.find({ equipmentId: eq._id });
    const faultCount = faults.length;

    let lastFaultDays = 9999;
    if (faults.length > 0) {
      const last = faults.reduce((a,b) => new Date(a.createdAt) > new Date(b.createdAt) ? a : b);
      lastFaultDays = Math.floor((Date.now() - new Date(last.createdAt).getTime())/(1000*60*60*24));
    }

    const resolvedCount = faults.filter(f => String(f.status).toLowerCase() === "resolved").length;
    const resolvedRatio = faultCount === 0 ? 0 : (resolvedCount / faultCount);

    let reportedByLabInchargeRatio = 0;
    if (faults.length > 0) {
      const reporterIds = faults.map(f => f.reportedBy).filter(Boolean);
      if (reporterIds.length > 0) {
        const users = await User.find({ _id: { $in: reporterIds } }, "role");
        const labInc = users.filter(u => u.role === "lab_incharge").length;
        reportedByLabInchargeRatio = labInc / reporterIds.length;
      }
    }

    let ageMonths = 0;
    try {
      const pd = new Date(eq.purchaseDate);
      ageMonths = Math.max(0, Math.floor((Date.now() - pd.getTime())/(1000*60*60*24*30)));
    } catch (e) {
      ageMonths = 0;
    }

    const cond = String(eq.condition || "average").toLowerCase();
    const conditionCode = conditionMap[cond] ?? 1;

    const row = [
      String(eq._id),
      (eq.name || "").replace(/,/g, ""),
      (eq.labName || "").replace(/,/g, ""),
      (eq.purchaseDate ? new Date(eq.purchaseDate).toISOString().split('T')[0] : ""),
      ageMonths,
      conditionCode,
      faultCount,
      lastFaultDays,
      Number(resolvedRatio.toFixed(3)),
      Number(reportedByLabInchargeRatio.toFixed(3))
    ];
    rows.push(row.join(","));
  }

  fs.writeFileSync(OUT_CSV, rows.join("\n"));
  console.log("✅ CSV written to", OUT_CSV);
  await mongoose.disconnect();
  return OUT_CSV;
}

module.exports = { buildDatasetCSV };

if (require.main === module) {
  buildDatasetCSV().catch(err => { console.error(err); process.exit(1); });
}
