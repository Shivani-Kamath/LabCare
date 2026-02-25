const mongoose = require("mongoose");

const equipmentSchema = new mongoose.Schema({
  equipmentId: {
    type: String,
    unique: true,
    default: () => `EQ-${Date.now()}`
  },
  name: {
    type: String,
    required: true
  },
  labNumber: {
    type: String,
    enum: ["lab1", "lab2", "lab3", "lab4", "lab5"],
    required: false,
    index: true
  },
  labName: {
    type: String,
    required: true
  },
  purchaseDate: {
    type: String,
    required: true
  },
  condition: {
    type: String,
    enum: ["good", "fair", "poor"], // Match your controller or frontend values
    required: true
  }
});

module.exports = mongoose.model("Equipment", equipmentSchema);
