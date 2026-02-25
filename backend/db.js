const mongoose = require("mongoose");
const dbConfig = require("./config/db.config");

// Connect to MongoDB
mongoose.connect(dbConfig.url, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;

db.on("error", (err) => {
  console.error("❌ Error connecting to MongoDB:", err);
});

db.once("open", () => {
  console.log("✅ Connected to MongoDB successfully.");
});

module.exports = db;
