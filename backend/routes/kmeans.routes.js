// const express = require("express");
// const router = express.Router();
// const kmeansController = require("../controllers/kmeans.controller");

// router.get("/analyze", kmeansController.analyzeData); // ✅ GET route

// module.exports = router;

const express = require('express');
const router = express.Router();
const { runKMeansAnalysis } = require('../controllers/kmeans.controller');

router.get('/analyze', runKMeansAnalysis);

module.exports = router;
