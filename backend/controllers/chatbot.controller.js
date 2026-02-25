// // const natural = require("natural");
// // const stringSimilarity = require("string-similarity");
// // const tokenizer = new natural.WordTokenizer();

// // const responses = [
// //   {
// //     intent: "report fault",
// //     phrases: ["report a fault", "raise a complaint", "log an issue"],
// //     reply: "🛠️ To report a fault, go to the Faults section and click 'Report New Fault'."
// //   },
// //   {
// //     intent: "equipment list",
// //     phrases: ["equipment available", "list of equipment", "show inventory", "available equipment"],
// //     reply: "📋 You can check available equipment in the Equipment section."
// //   },
// //   {
// //     intent: "fault status",
// //     phrases: ["fault status", "check status", "progress of issue", "see my complaint status"],
// //     reply: "📊 You can check the status of your faults in the Dashboard or Faults section."
// //   },
// //   {
// //     intent: "lab incharge",
// //     phrases: ["who is the lab incharge", "lab incharge name", "incharge of lab"],
// //     reply: "👨‍🏫 You can check the Users page or ask your admin to find your lab incharge."
// //   },
// //   {
// //     intent: "monitor issue",
// //     phrases: ["monitor flickering", "my monitor is flickering", "monitor not working", "screen blinking"],
// //     reply: "🔧 Monitor flickering? Check the cables, refresh rate, and try restarting the system."
// //   },
// //   {
// //     intent: "mouse issue",
// //     phrases: ["mouse not working", "mouse is stuck", "can't move mouse"],
// //     reply: "🖱️ Mouse issue? Try reconnecting it, checking battery (if wireless), or using another port."
// //   },
// //   {
// //     intent: "keyboard issue",
// //     phrases: ["keyboard not working", "can't type", "keyboard unresponsive"],
// //     reply: "⌨️ Keyboard problem? Try unplugging and replugging, restarting the system, or checking language/input settings."
// //   },
// //   {
// //     intent: "help",
// //     phrases: ["help", "how to use", "guide", "i need help"],
// //     reply: "💡 I can assist you with reporting faults, checking equipment, and understanding roles. Try: 'How do I report a fault?'"
// //   }
// // ];

// // exports.chat = (req, res) => {
// //   const message = req.body.message?.toLowerCase().trim();
// //   if (!message) {
// //     return res.json({ reply: "❗Please enter a valid question." });
// //   }

// //   let bestMatch = {
// //     score: 0,
// //     reply: "🤖 Sorry, I couldn't understand. Try asking about faults, equipment, or lab roles."
// //   };

// //   responses.forEach(({ phrases, reply }) => {
// //     phrases.forEach((phrase) => {
// //       const similarity = stringSimilarity.compareTwoStrings(message, phrase);
// //       if (similarity > bestMatch.score && similarity > 0.4) {
// //         bestMatch = { score: similarity, reply };
// //       }
// //     });
// //   });

// //   res.json({ reply: bestMatch.reply });
// // };



// // backend/controllers/chatbot.controller.js
// // const stringSimilarity = require("string-similarity");
// // const { intents, troubleshooting } = require("../utils/chatbotData");

// // // In-memory conversation context
// // let sessionContext = {}; // { userId: { lastIntent: 'mouse_issue', step: 0 } }

// // exports.chat = (req, res) => {
// //   const message = req.body.message?.toLowerCase().trim();
// //   const userId = req.body.userId || "default"; // Replace with auth userId later if needed

// //   if (!message) {
// //     return res.json({ reply: "❗ Please enter a valid question." });
// //   }

// //   // Check if user is in troubleshooting flow
// //   if (sessionContext[userId]?.lastIntent && troubleshooting[sessionContext[userId].lastIntent]) {
// //     const currentIntent = sessionContext[userId].lastIntent;
// //     let step = sessionContext[userId].step || 0;

// //     if (message.includes("next") || message.includes("done")) {
// //       step++;
// //     }

// //     if (step < troubleshooting[currentIntent].length) {
// //       const reply = troubleshooting[currentIntent][step];
// //       sessionContext[userId].step = step;
// //       return res.json({ reply });
// //     } else {
// //       sessionContext[userId] = {}; // reset context
// //       return res.json({
// //         reply: "✅ Troubleshooting completed. If the issue persists, please report a fault."
// //       });
// //     }
// //   }

// //   // Match intents with similarity
// //   let bestMatch = {
// //     score: 0,
// //     intent: null,
// //     reply: "🤖 Sorry, I couldn't understand. Try asking about faults, equipment, or lab roles."
// //   };

// //   intents.forEach(({ phrases, intent, reply }) => {
// //     phrases.forEach((phrase) => {
// //       const similarity = stringSimilarity.compareTwoStrings(message, phrase);
// //       if (similarity > bestMatch.score && similarity > 0.4) {
// //         bestMatch = { score: similarity, intent, reply };
// //       }
// //     });
// //   });

// //   // Save context if troubleshooting intent detected
// //   if (troubleshooting[bestMatch.intent]) {
// //     sessionContext[userId] = { lastIntent: bestMatch.intent, step: 0 };
// //   }

// //   return res.json({ reply: bestMatch.reply });
// // };







// // const axios = require("axios");
// // const { troubleshooting } = require("../utils/chatbotData");

// // let sessionContext = {};

// // exports.chat = async (req, res) => {
// //   const message = req.body.message?.toLowerCase().trim();
// //   const userId = req.body.userId || "default";

// //   if (!message) {
// //     return res.json({ reply: "❗ Please enter a valid question." });
// //   }

// //   // If in troubleshooting flow
// //   if (sessionContext[userId]?.lastIntent && troubleshooting[sessionContext[userId].lastIntent]) {
// //     const currentIntent = sessionContext[userId].lastIntent;
// //     let step = sessionContext[userId].step || 0;

// //     if (message.includes("next") || message.includes("done")) {
// //       step++;
// //     }

// //     if (step < troubleshooting[currentIntent].length) {
// //       const reply = troubleshooting[currentIntent][step];
// //       sessionContext[userId].step = step;
// //       return res.json({ reply });
// //     } else {
// //       sessionContext[userId] = {};
// //       return res.json({ reply: "✅ Troubleshooting completed. If the issue persists, please report a fault." });
// //     }
// //   }

// //   // Call Flask NLP service
// //   try {
// //     const response = await axios.post("http://localhost:5001/predict_intent", { message });
// //     const { intent, reply } = response.data;

// //     // If troubleshooting intent, save context
// //     if (troubleshooting[intent]) {
// //       sessionContext[userId] = { lastIntent: intent, step: 0 };
// //     }

// //     return res.json({ reply });
// //   } catch (err) {
// //     console.error(err);
// //     return res.json({ reply: "⚠️ NLP service unavailable. Please try again later." });
// //   }
// // };



// const axios = require("axios");
// const { troubleshooting } = require("../utils/chatbotData");

// let sessionContext = {};

// exports.chat = async (req, res) => {
//   const message = req.body.message?.toLowerCase().trim();
//   const userId = req.body.userId || "default";

//   if (!message) {
//     return res.json({ reply: "❗ Please enter a valid question." });
//   }

//   // 🔹 1. Greetings / thanks / goodbye
//   const greetings = ["hi", "hello", "hey", "good day", "hey there"];
//   const goodbyes = ["bye", "goodbye", "see you later", "catch you later"];
//   const thanks = ["thanks", "thank you", "much appreciated", "thanks a lot"];

//   if (greetings.includes(message)) {
//     sessionContext[userId] = {};
//     return res.json({ reply: "👋 Hello! How can I assist you today?" });
//   }
//   if (goodbyes.includes(message)) {
//     sessionContext[userId] = {};
//     return res.json({ reply: "👋 Goodbye! Have a great day." });
//   }
//   if (thanks.includes(message)) {
//     sessionContext[userId] = {};
//     return res.json({ reply: "😊 You're welcome! Happy to help." });
//   }

//   // 🔹 2. Check if message matches a troubleshooting intent (start fresh)
//   const newIntent = Object.keys(troubleshooting).find((intent) =>
//     message.includes(intent.split("_")[0]) // crude matching: e.g., "mouse" in "mouse_issue"
//   );

//   if (newIntent) {
//     sessionContext[userId] = { lastIntent: newIntent, step: 0 };
//     const allSteps = troubleshooting[newIntent].join("\n");
//     return res.json({ reply: allSteps });
//   }

//   // 🔹 3. Continue previous troubleshooting flow (step-wise)
//   if (sessionContext[userId]?.lastIntent && troubleshooting[sessionContext[userId].lastIntent]) {
//     const currentIntent = sessionContext[userId].lastIntent;
//     let step = sessionContext[userId].step || 0;

//     if (message.includes("next") || message.includes("done")) step++;

//     const steps = troubleshooting[currentIntent].slice(step);
//     if (steps.length > 0) {
//       sessionContext[userId].step = step + steps.length;
//       return res.json({ reply: steps.join("\n") });
//     } else {
//       sessionContext[userId] = {};
//       return res.json({ reply: "✅ Troubleshooting completed. If the issue persists, please report a fault." });
//     }
//   }

//   // 🔹 4. NLP service fallback
//   try {
//     const response = await axios.post("http://localhost:5001/predict_intent", { message });
//     const { intent, reply } = response.data;

//     if (troubleshooting[intent]) {
//       sessionContext[userId] = { lastIntent: intent, step: 0 };
//       const allSteps = troubleshooting[intent].join("\n");
//       return res.json({ reply: allSteps });
//     }

//     sessionContext[userId] = {};
//     return res.json({ reply });
//   } catch (err) {
//     console.error(err);
//     return res.json({ reply: "⚠️ NLP service unavailable. Please try again later." });
//   }
// };



// const { intents } = require("../utils/intents");

// // Simple in-memory session store (keyed by user)
// const sessions = {};

// exports.chat = (req, res) => {
//   const { message, userId } = req.body; // userId can be session ID, or email, etc.
//   if (!message || !userId) {
//     return res.json({ reply: "❗ Please provide message and userId." });
//   }

//   // Initialize session if first message
//   if (!sessions[userId]) sessions[userId] = {};

//   const userSession = sessions[userId];

//   // Check if user is confirming completion of previous step
//   const confirmationWords = ["done", "ok", "okay", "resolved"];
//   if (confirmationWords.includes(message.toLowerCase())) {
//     if (userSession.currentSteps && userSession.currentStepIndex !== undefined) {
//       userSession.currentStepIndex++;
//     }
//   }

//   // Find intent
//   const matchedIntent = intents.find(intent =>
//     intent.patterns.some(pattern => pattern.toLowerCase() === message.toLowerCase())
//   );

//   if (matchedIntent) {
//     // Start step-by-step flow
//     userSession.currentSteps = matchedIntent.responses; // full steps array
//     userSession.currentStepIndex = 0;
//   }

//   // Send next step
//   if (userSession.currentSteps && userSession.currentStepIndex < userSession.currentSteps.length) {
//     const nextStep = userSession.currentSteps[userSession.currentStepIndex];
//     return res.json({ reply: nextStep });
//   } else {
//     // Flow finished
//     userSession.currentSteps = null;
//     userSession.currentStepIndex = null;
//     return res.json({ reply: "✅ All steps completed or no instructions found for this message." });
//   }
// };


// const { intents } = require("../utils/intents");

// // Simple in-memory session store (keyed by user)
// const sessions = {};

// exports.chat = (req, res) => {
//   const { message, userId } = req.body; // userId can be session ID, or email, etc.
//   if (!message || !userId) {
//     return res.json({ reply: "❗ Please provide message and userId." });
//   }

//   // Initialize session if first message
//   if (!sessions[userId]) sessions[userId] = {};

//   const userSession = sessions[userId];
//   const userMessage = message.toLowerCase().trim();

//   // Check if user confirms completion of previous step
//   const confirmationWords = ["done", "ok", "okay", "resolved", "fixed"];
//   if (confirmationWords.includes(userMessage)) {
//     if (userSession.currentSteps && userSession.currentStepIndex !== undefined) {
//       userSession.currentStepIndex++;

//       // Check if there are more steps left
//       if (userSession.currentStepIndex < userSession.currentSteps.length) {
//         return res.json({ reply: userSession.currentSteps[userSession.currentStepIndex] });
//       } else {
//         // Steps finished
//         userSession.currentSteps = null;
//         userSession.currentStepIndex = null;
//         return res.json({ reply: "🎉 Great! Issue marked as resolved. Do you have any other problem?" });
//       }
//     } else {
//       // No current steps, user typed resolved unexpectedly
//       return res.json({ reply: "✅ Got it! If you have another issue, please type it now." });
//     }
//   }

//   // Find intent
//   const matchedIntent = intents.find(intent =>
//     intent.patterns.some(pattern => pattern.toLowerCase() === userMessage)
//   );

//   if (matchedIntent) {
//     // Start step-by-step flow
//     userSession.currentSteps = matchedIntent.responses;
//     userSession.currentStepIndex = 0;
//     return res.json({ reply: userSession.currentSteps[userSession.currentStepIndex] });
//   }

//   // If message doesn't match any intent
//   return res.json({ reply: "🤔 Sorry, I didn't understand that. Can you rephrase or describe your issue?" });
// };


// const { intents } = require("../utils/intents");

// const sessions = {};

// exports.chat = (req, res) => {
//   const { message, userId } = req.body;
//   if (!message || !userId) {
//     return res.json({ reply: "❗ Please provide message and userId." });
//   }

//   const userMessage = message.toLowerCase().trim();

//   // Initialize session
//   if (!sessions[userId]) sessions[userId] = {};
//   const session = sessions[userId];

//   // Confirmation keywords
//   const confirmationWords = ["done", "ok", "okay", "resolved", "fixed"];

//   // Handle step confirmation
//   if (confirmationWords.includes(userMessage)) {
//     if (session.currentSteps && typeof session.currentStepIndex === "number") {
//       session.currentStepIndex++;
//       if (session.currentStepIndex < session.currentSteps.length) {
//         return res.json({ reply: session.currentSteps[session.currentStepIndex] });
//       } else {
//         // All steps completed
//         session.currentSteps = null;
//         session.currentStepIndex = null;
//         session.lastIntent = null;
//         return res.json({ reply: "🎉 Great! Issue marked as resolved. Do you have any other problem?" });
//       }
//     } else {
//       return res.json({ reply: "✅ Got it! If you have another issue, please type it now." });
//     }
//   }

//   // Match intent
//   const matchedIntent = intents.find(intent =>
//     intent.patterns.some(pattern => userMessage.includes(pattern.toLowerCase()))
//   );

//   if (matchedIntent) {
//     // Reset steps only if new intent or no current steps
//     if (session.lastIntent !== matchedIntent.intent) {
//       session.currentSteps = matchedIntent.responses;
//       session.currentStepIndex = 0;
//       session.lastIntent = matchedIntent.intent;
//     }
//     return res.json({ reply: session.currentSteps[session.currentStepIndex] });
//   }

//   // Unknown fallback
//   return res.json({ reply: "🤔 Sorry, I didn't understand that. Can you rephrase or describe your issue?" });
// };



// const { intents } = require("../utils/intents");

// const sessions = {};

// exports.chat = (req, res) => {
//   const { message, userId } = req.body;
//   if (!message || !userId) {
//     return res.json({ reply: "❗ Please provide message and userId." });
//   }

//   const userMessage = message.toLowerCase().trim();

//   // Initialize session
//   if (!sessions[userId]) sessions[userId] = {};
//   const session = sessions[userId];

//   // Confirmation keywords
//   const confirmationWords = ["done", "ok", "okay", "resolved", "fixed"];

//   // ✅ First handle confirmation before matching intents
//   if (session.currentIntent && confirmationWords.includes(userMessage)) {
//     session.currentStepIndex++;

//     if (session.currentStepIndex < session.currentSteps.length) {
//       return res.json({ reply: session.currentSteps[session.currentStepIndex] });
//     } else {
//       // Flow finished
//       session.currentSteps = null;
//       session.currentStepIndex = null;
//       session.currentIntent = null;
//       return res.json({ reply: "✅ Troubleshooting completed. If the issue persists, please report a fault or type another issue." });
//     }
//   }

//   // Match intent
//   const matchedIntent = intents.find(intent =>
//     intent.patterns.some(pattern => userMessage.includes(pattern.toLowerCase()))
//   );

//   if (matchedIntent) {
//     // Start new flow only if it’s a new intent
//     if (session.currentIntent !== matchedIntent.intent) {
//       session.currentIntent = matchedIntent.intent;
//       session.currentSteps = matchedIntent.responses;
//       session.currentStepIndex = 0;
//     }

//     return res.json({ reply: session.currentSteps[session.currentStepIndex] });
//   }

//   // Fallback if message doesn’t match any intent
//   return res.json({ reply: "🤔 Sorry, I didn't understand that. Can you rephrase or describe your issue?" });
// };


// // backend/controllers/chatController.js
// const { intents, troubleshooting } = require("../utils/chatbotData");

// // Simple in-memory session store
// const sessions = {};

// exports.chat = (req, res) => {
//   const { message, userId } = req.body;
//   if (!message || !userId) {
//     return res.json({ reply: "❗ Please provide message and userId." });
//   }

//   if (!sessions[userId]) sessions[userId] = {};
//   const userSession = sessions[userId];

//   const msg = message.toLowerCase().trim();

//   // 1️⃣ Check if user marked issue as resolved
//   const resolvedWords = ["resolved", "done", "fixed", "ok"];
//   if (resolvedWords.includes(msg)) {
//     userSession.currentSteps = null;
//     userSession.currentStepIndex = null;
//     return res.json({ reply: "✅ Troubleshooting completed. If the issue persists, please report a fault." });
//   }

//   // 2️⃣ Find matching intent
//   let matchedIntent = null;

//   for (const intent of intents) {
//     if (intent.phrases.some(p => p.toLowerCase() === msg)) {
//       matchedIntent = intent;
//       break;
//     }
//   }

//   // 3️⃣ If intent has step-by-step troubleshooting, start steps
//   if (matchedIntent && troubleshooting[matchedIntent.intent]) {
//     userSession.currentSteps = troubleshooting[matchedIntent.intent];
//     userSession.currentStepIndex = 0;
//     return res.json({ reply: userSession.currentSteps[userSession.currentStepIndex] });
//   }

//   // 4️⃣ Continue current troubleshooting steps if session active
//   if (userSession.currentSteps) {
//     userSession.currentStepIndex++;
//     if (userSession.currentStepIndex < userSession.currentSteps.length) {
//       return res.json({ reply: userSession.currentSteps[userSession.currentStepIndex] });
//     } else {
//       userSession.currentSteps = null;
//       userSession.currentStepIndex = null;
//       return res.json({ reply: "✅ Troubleshooting completed. If the issue persists, please report a fault." });
//     }
//   }

//   // 5️⃣ Fallback reply
//   if (matchedIntent) {
//     return res.json({ reply: matchedIntent.reply });
//   }

//   return res.json({ reply: "❓ Sorry, I didn't understand. You can type 'help' to see available commands." });
// };




// // backend/controllers/chatController.js
// const axios = require("axios");

// // Simple in-memory session store
// const sessions = {};

// exports.chat = async (req, res) => {
//   const { message, userId } = req.body;
//   if (!message || !userId) {
//     return res.json({ reply: "❗ Please provide message and userId." });
//   }

//   if (!sessions[userId]) sessions[userId] = {};
//   const userSession = sessions[userId];

//   try {
//     // Send the message to the Python chatbot
//     const response = await axios.post("http://127.0.0.1:5001/chat", {
//       message,
//       userId
//     });

//     // Python bot reply
//     const botReply = response.data.reply;

//     return res.json({ reply: botReply });
//   } catch (error) {
//     console.error("Error contacting Python chatbot:", error.message);
//     return res.json({ reply: "❌ Unable to reach chatbot. Please try again later." });
//   }
// };


const axios = require("axios");

// Simple in-memory session store
const sessions = {};

exports.chat = async (req, res) => {
  const { message, userId } = req.body;

  if (!message || !userId) {
    return res.json({ reply: "❗ Please provide message and userId." });
  }

  try {
    // Send to Python NLP chatbot running at port 5001
    const response = await axios.post("http://127.0.0.1:5001/chat", {
      message,
      userId,
    });

    return res.json({ reply: response.data.reply });
  } catch (err) {
    console.error("❌ Error connecting to Python chatbot:", err.message);
    return res.json({ reply: "Error connecting to chatbot server." });
  }
};
