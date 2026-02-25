

// const express = require("express");
// const { predictSystemFaultHandler } = require("../controllers/ml.controller");

// const router = express.Router();

// // POST /api/ml/predict
// router.post("/predict", predictSystemFaultHandler);

// module.exports = router;

// backend/routes/ml.routes.js
// const express = require("express");
// const controller = require("../controllers/ml.controller");
// const router = express.Router();

// router.post("/train", controller.trainFaultModel); // POST /api/ml/train
// router.post("/predict-system-fault", controller.predictSystemFaultHandler); // POST /api/ml/predict-system-fault

// module.exports = router;

const express = require("express");
const router = express.Router();
const mlController = require("../controllers/ml.controller");

// Train model
router.post("/train", mlController.trainFaultModel);

// Predict faults ✅ make sure route matches frontend
router.post("/predict-fault", mlController.predictSystemFaultHandler);

module.exports = router;
