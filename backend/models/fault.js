const mongoose = require("mongoose");

const faultSchema = new mongoose.Schema({
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  equipmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Equipment",
    required: true
  },
  labName: {
    type: String,
    required: true
  },
  issueDescription: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ["pending", "in_progress", "resolved"],
    default: "pending"
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null
  },
  remarks: {
    type: String,
    default: ""
  }
}, { timestamps: true });

// ✅ Prevent OverwriteModelError
module.exports = mongoose.models.Fault || mongoose.model("Fault", faultSchema);
