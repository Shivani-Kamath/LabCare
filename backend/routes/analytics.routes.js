const express = require("express");
const router = express.Router();
const analyticsController = require("../controllers/analytics.controller");

// 📊 Route: Count faults by status
router.get("/fault-status", analyticsController.getFaultStatusCount);

// 🧪 Route: Faults per lab
router.get("/lab-faults", analyticsController.getFaultsPerLab);

// 💻 Route: Equipment condition breakdown
router.get("/equipment-condition", analyticsController.getEquipmentConditionStats);

// 🧑‍🔧 Route: Technician workload (faults assigned)
router.get("/technician-workload", analyticsController.getTechnicianWorkload);

module.exports = router;
