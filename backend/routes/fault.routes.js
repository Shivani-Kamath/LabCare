// const express = require("express");
// const router = express.Router();
// const faultController = require("../controllers/fault.controller");

// // POST: Report a fault
// router.post("/", faultController.reportFault);

// // GET: All faults
// router.get("/", faultController.getAllFaults);

// // PUT: Update fault
// router.put("/assign/:id", faultController.assignFaultToTechnician);
// //router.put("/:id", faultController.updateFault);

// // DELETE: Delete fault
// router.delete("/:id", faultController.deleteFault);

// // Update fault status (e.g., resolved or pending)
// router.put("/status/:id", faultController.updateFaultStatus);



// module.exports = router; // ✅ THIS is important!




const express = require("express");
const router = express.Router();
const {
  reportFault,
  getAllFaults,
  updateFault,
  deleteFault,
  assignFaultToTechnician,
  autoAssignFault,
  updateFaultStatus
} = require("../controllers/fault.controller");

router.post("/", reportFault);
router.get("/", getAllFaults);
router.put("/assign/:id", assignFaultToTechnician);
router.put("/auto-assign/:id", autoAssignFault); // 🔹 K-Means auto assignment
router.put("/status/:id", updateFaultStatus);
router.put("/:id", updateFault);
router.delete("/:id", deleteFault);

module.exports = router;
