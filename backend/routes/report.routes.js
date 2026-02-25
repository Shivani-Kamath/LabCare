// const express = require("express");
// const router = express.Router();
// const { generateLabSummary } = require("../controllers/report.controller");

// router.get("/lab-summary/:labName", generateLabSummary);
// module.exports = router;

// // STEP 3: Update fault model to auto-generate equipmentId if not present
// // File: models/equipment.js

// const mongoose = require("mongoose");
// const { v4: uuidv4 } = require("uuid");

// const equipmentSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   equipmentId: {
//     type: String,
//     default: uuidv4,
//     unique: true,
//   },
//   labName: { type: String, required: true },
//   purchaseDate: { type: String, required: true },
//   condition: {
//     type: String,
//     enum: ["good", "damaged", "working"],
//     required: true,
//   },
// });

const express = require("express");
const router = express.Router();
const { generateLabSummary } = require("../controllers/report.controller");

router.get("/lab-summary/:labName", generateLabSummary);

module.exports = router;
