// const express = require("express");
// const cors = require("cors");
// const cookieParser = require("cookie-parser");
// const bodyParser = require("body-parser");
// const mongoose = require("mongoose");
// const dbConfig = require("./config/db.config");
// const mlRoutes = require("./routes/ml.routes");



// const morgan = require("morgan");


// const app = express();
// const PORT = process.env.PORT || 5000;

// app.use(morgan("dev"));

// const swaggerUi = require("swagger-ui-express");
// const YAML = require("yamljs");
// const swaggerDocument = YAML.load("./swagger.yaml");
// app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// // Database connection
// mongoose.connect(dbConfig.url, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// })
//   .then(() => console.log("✅ Connected to MongoDB"))
//   .catch((err) => console.error("❌ MongoDB connection error:", err));

// // Middlewares
// app.use(cors());
// app.use(cookieParser());
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

// // Routes
// app.use("/api/users", require("./routes/user.routes"));           // 👤 user (student, technician, lab_incharge)
// app.use("/api/equipment", require("./routes/equipment.routes")); // 🛠️ lab equipment
// app.use("/api/faults", require("./routes/fault.routes"));        // 🚨 fault reporting
// app.use("/api/analytics", require("./routes/analytics.routes")); // 📊 dashboard charts
// //app.use("/api/chatbot", require("./routes/chatbot.routes"));
// app.use("/api/predict", require("./routes/prediction.routes"));
// app.use("/api/kmeans", require("./routes/kmeans.routes"));
// app.use("/api/report", require("./routes/report.routes"));
// app.use("/api/ml", mlRoutes);

// // Default route
// app.get("/", (req, res) => {
//   res.send("💡 LabCare Backend API is Running!");
// });

// // Start server
// app.listen(PORT, () => {
//   console.log(`🚀 Server started on http://localhost:${PORT}`);
// });


// const express = require("express");
// const cors = require("cors");
// const cookieParser = require("cookie-parser");
// const bodyParser = require("body-parser");
// const mongoose = require("mongoose");
// const dbConfig = require("./config/db.config");
// const mlRoutes = require("./routes/ml.routes"); // ✅ fixed require

// const morgan = require("morgan");
// const swaggerUi = require("swagger-ui-express");
// const YAML = require("yamljs");
// const swaggerDocument = YAML.load("./swagger.yaml");

// const app = express();
// const PORT = process.env.PORT || 5000;

// app.use(morgan("dev"));
// app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// // Database connection
// mongoose.connect(dbConfig.url, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// })
//   .then(() => console.log("✅ Connected to MongoDB"))
//   .catch((err) => console.error("❌ MongoDB connection error:", err));

// // Middlewares
// app.use(cors());
// app.use(cookieParser());
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

// // Routes
// app.use("/api/users", require("./routes/user.routes"));
// app.use("/api/equipment", require("./routes/equipment.routes"));
// app.use("/api/faults", require("./routes/fault.routes"));
// app.use("/api/analytics", require("./routes/analytics.routes"));
// //app.use("/api/chatbot", require("./routes/chatbot.routes"));
// app.use("/api/predict", require("./routes/prediction.routes"));
// app.use("/api/kmeans", require("./routes/kmeans.routes"));
// app.use("/api/report", require("./routes/report.routes"));
// //app.use("/api/ml", mlRoutes); // ✅ your ML routes
// app.use("/api/ml", require("./routes/ml.routes"));


// // Default route
// app.get("/", (req, res) => {
//   res.send("💡 LabCare Backend API is Running!");
// });

// // Start server
// app.listen(PORT, () => {
//   console.log(`🚀 Server started on http://localhost:${PORT}`);
// });

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const morgan = require("morgan");
const YAML = require("yamljs");
const swaggerUi = require("swagger-ui-express");

const dbConfig = require("./config/db.config"); // should export { url: "mongodb://..." }

const swaggerDocument = YAML.load("./swagger.yaml");

const app = express();
const PORT = process.env.PORT || 5000;

// ----------------- MIDDLEWARES -----------------
app.use(morgan("dev"));
app.use(cors());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ----------------- SWAGGER DOCS -----------------
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// ----------------- ROUTES -----------------
app.use("/api/users", require("./routes/user.routes"));
app.use("/api/equipment", require("./routes/equipment.routes"));
app.use("/api/faults", require("./routes/fault.routes"));
app.use("/api/analytics", require("./routes/analytics.routes"));
app.use("/api/predict", require("./routes/prediction.routes"));
app.use("/api/kmeans", require("./routes/kmeans.routes"));
app.use("/api/report", require("./routes/report.routes"));
app.use("/api/ml", require("./routes/ml.routes")); // ML routes
app.use("/api/inventory", require("./routes/inventory.routes"));
app.use("/api/repairs", require("./routes/repairs.routes"));
app.use("/api/admin", require("./routes/admin.routes"));

// ----------------- DEFAULT ROUTE -----------------
app.get("/", (req, res) => {
  res.send("💡 LabCare Backend API is Running!");
});

// ----------------- DATABASE CONNECTION -----------------
mongoose
  .connect(dbConfig.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ Connected to MongoDB");

    // Start server only after DB is connected
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1); // stop app if DB fails
  });

// ----------------- OPTIONAL: Graceful shutdown -----------------
process.on("SIGINT", async () => {
  console.log("\n🛑 Shutting down gracefully...");
  await mongoose.disconnect();
  process.exit(0);
});
