// // routes/chatbotRoutes.js
// const express = require("express");
// const router = express.Router();
// const { chat } = require("../controllers/chatbot.controller");

// router.post("/", chat);

// module.exports = router;


// backend/routes/chatbot.routes.js
// const express = require("express");
// const router = express.Router();
// const chatbotController = require("../controllers/chatbot.controller");

// // POST /api/chatbot
// router.post("/", chatbotController.chat);

// module.exports = router;


const express = require("express");
const { chat } = require("../controllers/chatController");

const router = express.Router();

// POST /api/chatbot
router.post("/", chat);

module.exports = router;

