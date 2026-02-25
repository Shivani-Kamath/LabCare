const Fault = require("../models/fault");
const Equipment = require("../models/equipment");
const User = require("../models/user");

// 📊 Count faults by status (Pending, Resolved, etc.)
exports.getFaultStatusCount = async (req, res) => {
  try {
    const counts = await Fault.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);
    res.status(200).json({ statusCount: counts });
  } catch (error) {
    console.error("Error in getFaultStatusCount:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// 🧪 Count number of faults per lab
exports.getFaultsPerLab = async (req, res) => {
  try {
    const result = await Fault.aggregate([
      { $group: { _id: "$labName", count: { $sum: 1 } } }
    ]);
    res.status(200).json({ labFaults: result });
  } catch (error) {
    console.error("Error in getFaultsPerLab:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// 💻 Breakdown of equipment by condition (e.g., Working, Faulty)
exports.getEquipmentConditionStats = async (req, res) => {
  try {
    const conditionStats = await Equipment.aggregate([
      { $group: { _id: "$condition", count: { $sum: 1 } } }
    ]);
    res.status(200).json({ equipmentCondition: conditionStats });
  } catch (error) {
    console.error("Error in getEquipmentConditionStats:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// 🧑‍🔧 Technician workload — how many faults each is handling
// exports.getTechnicianWorkload = async (req, res) => {
//   try {
//     const workload = await Fault.aggregate([
//       { $match: { assignedTo: { $ne: null } } },
//       { $group: { _id: "$assignedTo", totalFaults: { $sum: 1 } } }
//     ]);

//     // Populate assigned technician info (name, email, role)
//     const populated = await User.populate(workload, {
//       path: "_id",
//       select: "full_name email role"
//     });

//     res.status(200).json({ technicianWorkload: populated });
//   } catch (error) {
//     console.error("Error in getTechnicianWorkload:", error.message);
//     res.status(500).json({ error: error.message });
//   }
// };


module.exports.getTechnicianWorkload = async (req, res) => {
  try {
    const workload = await Fault.aggregate([
      { $match: { assignedTo: { $ne: null } } },
      {
        $group: {
          _id: "$assignedTo",
          totalFaults: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "technician"
        }
      },
      {
        $unwind: "$technician"
      },
      {
        $project: {
          technicianName: "$technician.full_name",
          totalFaults: 1
        }
      }
    ]);

    res.status(200).json({ technicianWorkload: workload });
  } catch (error) {
    res.status(500).json({ error: "Error fetching technician workload", details: error });
  }
};
