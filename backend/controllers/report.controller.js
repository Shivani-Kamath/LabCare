const Fault = require("../models/fault");
const Equipment = require("../models/equipment");

exports.generateLabSummary = async (req, res) => {
  const labName = req.params.labName;

  try {
    // Fetch all equipment in the lab
    const equipmentList = await Equipment.find({ labName });

    // Count total equipment by condition
    const totalEquipments = equipmentList.length;
    const workingEquipments = equipmentList.filter(eq => eq.condition === "working").length;
    const damagedEquipments = equipmentList.filter(eq => eq.condition === "damaged").length;
    const goodEquipments = equipmentList.filter(eq => eq.condition === "good").length;

    // Fetch all faults related to that lab
    const faults = await Fault.find({ labName });

    // Count faults by status
    const totalFaults = faults.length;
    const resolvedFaults = faults.filter(f => f.status === "resolved").length;
    const pendingFaults = faults.filter(f => f.status === "pending").length;
    const inProgressFaults = faults.filter(f => f.status === "in_progress").length;

    // Response
    res.status(200).json({
      labName,
      equipmentStats: {
        totalEquipments,
        workingEquipments,
        goodEquipments,
        damagedEquipments
      },
      faultStats: {
        totalFaults,
        pendingFaults,
        inProgressFaults,
        resolvedFaults
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
