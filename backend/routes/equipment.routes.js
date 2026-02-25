const express = require("express");
const router = express.Router();
const equipmentController = require("../controllers/equipment.controller");

router.post("/", equipmentController.addEquipment);
router.get("/", equipmentController.getAllEquipment);
router.get("/:id", equipmentController.getEquipmentById);
router.put("/:id", equipmentController.updateEquipment);
router.delete("/:id", equipmentController.deleteEquipment);

// per-lab endpoints
router.get("/lab/:labNumber", equipmentController.getEquipmentByLab);
router.post("/lab/:labNumber", equipmentController.addEquipmentToLab);

module.exports = router;
