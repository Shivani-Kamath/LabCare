// const mongoose = require("mongoose");
// const Fault = require("../models/fault");
// const User = require("../models/user");
// const Equipment = require("../models/equipment");
// const { sendMail } = require("../utils/mailer");

// // ➕ Report a new fault
// exports.reportFault = async (req, res) => {
//   try {
//     const { equipmentId, reportedBy, labName, issueDescription } = req.body;

//     if (!equipmentId || !reportedBy || !labName || !issueDescription) {
//       return res.status(400).json({ error: "All fields are required" });
//     }

//     // Validate equipment
//     if (!mongoose.Types.ObjectId.isValid(equipmentId)) {
//       return res.status(400).json({ error: "Invalid equipment ID" });
//     }

//     const validEquipment = await Equipment.findById(equipmentId);
//     if (!validEquipment) {
//       return res.status(400).json({ error: "Selected equipment does not exist" });
//     }

//     const fault = await Fault.create({ equipmentId, reportedBy, labName, issueDescription });
//     res.status(201).json({ message: "Fault reported", fault });
//   } catch (error) {
//     console.error("❌ Report fault error:", error);
//     res.status(400).json({ error: error.message });
//   }
// };

// // 📃 Get all faults
// exports.getAllFaults = async (req, res) => {
//   try {
//     const faults = await Fault.find()
//       .populate("reportedBy", "full_name email")
//       .populate("assignedTo", "full_name email")
//       .populate("equipmentId", "name");

//     res.status(200).json({ faults });
//   } catch (error) {
//     console.error("❌ Get faults error:", error);
//     res.status(500).json({ error: error.message });
//   }
// };

// // ✏️ Update fault fields (generic)
// exports.updateFault = async (req, res) => {
//   try {
//     const updated = await Fault.findByIdAndUpdate(req.params.id, req.body, { new: true });
//     res.status(200).json({ message: "Fault updated", updated });
//   } catch (error) {
//     console.error("❌ Update fault error:", error);
//     res.status(400).json({ error: error.message });
//   }
// };

// // ❌ Delete a fault
// exports.deleteFault = async (req, res) => {
//   try {
//     await Fault.findByIdAndDelete(req.params.id);
//     res.status(200).json({ message: "Fault deleted" });
//   } catch (error) {
//     console.error("❌ Delete fault error:", error);
//     res.status(500).json({ error: error.message });
//   }
// };

// // 🧑‍🔧 Assign technician to fault
// exports.assignFaultToTechnician = async (req, res) => {
//   try {
//     const fault = await Fault.findById(req.params.id);
//     if (!fault) return res.status(404).json({ error: "Fault not found" });

//     const { technicianId } = req.body;
//     fault.assignedTo = technicianId;
//     fault.status = "in_progress";

//     await fault.save();
//     res.status(200).json({ message: "Fault assigned to technician", fault });
//   } catch (err) {
//     console.error("❌ Assign fault error:", err);
//     res.status(500).json({ error: "Error assigning fault", details: err.message });
//   }
// };

// // 🔧 Technician updates fault status (with remarks + notifications)
// exports.updateFaultStatus = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { status, remarks } = req.body;

//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(400).json({ error: "Invalid Fault ID" });
//     }

//     if (!status) {
//       return res.status(400).json({ error: "Status is required" });
//     }

//     const updateFields = { status };
//     if (remarks !== undefined) updateFields.remarks = remarks;

//     const fault = await Fault.findByIdAndUpdate(id, updateFields, { new: true })
//       .populate("reportedBy")
//       .populate("assignedTo")
//       .populate("equipmentId", "name");

//     if (!fault) return res.status(404).json({ error: "Fault not found" });

//     // ✅ Send email to student
//     try {
//       if (fault.reportedBy?.email) {
//         await sendMail({
//           to: fault.reportedBy.email,
//           subject: `Your Fault Is ${status}`,
//           text: `Your reported fault for "${fault.equipmentId?.name || "equipment"}" is now marked as "${status}".`
//         });
//       }

//       // ✅ Send email to Lab Incharge(s)
//       const incharges = await User.find({ role: "lab_incharge" });
//       for (const incharge of incharges) {
//         if (incharge.email) {
//           await sendMail({
//             to: incharge.email,
//             subject: `Fault in ${fault.labName} updated`,
//             text: `Fault "${fault.issueDescription}" in ${fault.labName} is updated to "${status}". Remarks: ${remarks || "None"}`
//           });
//         }
//       }

//     } catch (mailErr) {
//       console.warn("⚠️ Email sending failed:", mailErr.message);
//     }

//     res.status(200).json({ message: "Status updated", fault });

//   } catch (err) {
//     console.error("❌ Update fault status error:", err);
//     res.status(500).json({ error: err.message });
//   }
// };

const mongoose = require("mongoose");
const Fault = require("../models/fault");
const User = require("../models/user");
const Equipment = require("../models/equipment");
const { sendEmail } = require("../utils/mailer");

// ➕ Report a new fault
exports.reportFault = async (req, res) => {
  try {
    const { equipmentId, reportedBy, labName, issueDescription } = req.body;

    if (!equipmentId || !reportedBy || !labName || !issueDescription) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (!mongoose.Types.ObjectId.isValid(equipmentId)) {
      return res.status(400).json({ error: "Invalid equipment ID" });
    }

    const validEquipment = await Equipment.findById(equipmentId);
    if (!validEquipment) {
      return res.status(400).json({ error: "Selected equipment does not exist" });
    }

    const fault = await Fault.create({ equipmentId, reportedBy, labName, issueDescription });
    res.status(201).json({ message: "Fault reported", fault });
  } catch (error) {
    console.error("❌ Report fault error:", error);
    res.status(400).json({ error: error.message });
  }
};

// 📃 Get all faults
exports.getAllFaults = async (req, res) => {
  try {
    const faults = await Fault.find()
      .populate("reportedBy", "full_name email")
      .populate("assignedTo", "full_name email")
      .populate("equipmentId", "name");

    res.status(200).json({ faults });
  } catch (error) {
    console.error("❌ Get faults error:", error);
    res.status(500).json({ error: error.message });
  }
};

// ✏️ Update fault fields (generic)
exports.updateFault = async (req, res) => {
  try {
    const updated = await Fault.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ message: "Fault updated", updated });
  } catch (error) {
    console.error("❌ Update fault error:", error);
    res.status(400).json({ error: error.message });
  }
};

// ❌ Delete a fault
exports.deleteFault = async (req, res) => {
  try {
    await Fault.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Fault deleted" });
  } catch (error) {
    console.error("❌ Delete fault error:", error);
    res.status(500).json({ error: error.message });
  }
};

// 🧑‍🔧 Assign technician manually
exports.assignFaultToTechnician = async (req, res) => {
  try {
    const fault = await Fault.findById(req.params.id);
    if (!fault) return res.status(404).json({ error: "Fault not found" });

    const { technicianId } = req.body;
    fault.assignedTo = technicianId;
    fault.status = "in_progress";
    await fault.save();

    res.status(200).json({ message: "Fault assigned to technician", fault });
  } catch (err) {
    console.error("❌ Assign fault error:", err);
    res.status(500).json({ error: "Error assigning fault", details: err.message });
  }
};

// 🔹 Auto-assign technician (K-Means style workload balancer)
exports.autoAssignFault = async (req, res) => {
  try {
    const fault = await Fault.findById(req.params.id);
    if (!fault) return res.status(404).json({ error: "Fault not found" });

    const technicians = await User.find({ role: "technician" });

    const workloads = await Promise.all(
      technicians.map(async (tech) => {
        const count = await Fault.countDocuments({
          assignedTo: tech._id,
          status: { $ne: "Resolved" },
        });
        return { tech, count };
      })
    );

    workloads.sort((a, b) => a.count - b.count);
    const selectedTech = workloads[0].tech;

    fault.assignedTo = selectedTech._id;
    fault.status = "in_progress";
    await fault.save();

    res.status(200).json({
      message: `Fault auto-assigned to ${selectedTech.full_name}`,
      fault,
    });
  } catch (err) {
    console.error("❌ Auto-assign error:", err);
    res.status(500).json({ error: err.message });
  }
};

// 🔧 Technician updates status + remarks + notifications
exports.updateFaultStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, remarks } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid Fault ID" });
    }
    if (!status) return res.status(400).json({ error: "Status is required" });

    const updateFields = { status };
    if (remarks !== undefined) updateFields.remarks = remarks;

    const fault = await Fault.findByIdAndUpdate(id, updateFields, { new: true })
      .populate("reportedBy")
      .populate("assignedTo")
      .populate("equipmentId", "name");

    if (!fault) return res.status(404).json({ error: "Fault not found" });

    // ✅ Email notifications
    try {
      if (fault.assignedTo?.email) {
        await sendEmail(
          fault.assignedTo.email,
          'Lab Issue Alert',
          `<p>Issue in ${fault.labName} for "${fault.equipmentId?.name || 'equipment'}" is now "${status}". Remarks: ${remarks || 'None'}</p>`
        );
      }
    } catch (mailErr) {
      console.warn("⚠️ Email sending failed:", mailErr.message);
    }

    res.status(200).json({ message: "Status updated", fault });
  } catch (err) {
    console.error("❌ Update fault status error:", err);
    res.status(500).json({ error: err.message });
  }
};
