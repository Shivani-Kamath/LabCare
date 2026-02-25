const express = require("express");
const router = express.Router();
const controller = require("../controllers/prediction.controller");

router.post("/fault", controller.predict);

module.exports = router;
