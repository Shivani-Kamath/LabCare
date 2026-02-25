// const kmeans = require("ml-kmeans");

// // controllers/kmeans.controller.js

// exports.analyzeData = async (req, res) => {
//   // Dummy KMeans response (replace with real logic later)
//   res.json({
//     message: "KMeans analysis completed",
//     clusters: [
//       { lab: "Lab A", usagePattern: "Heavy" },
//       { lab: "Lab B", usagePattern: "Moderate" },
//       { lab: "Lab C", usagePattern: "Low" }
//     ]
//   });
// };

const { exec } = require('child_process');
const path = require('path');

const runKMeansAnalysis = (req, res) => {
  exec('python3 ai/kmeans_cluster.py', (err) => {
    if (err) return res.status(500).json({ error: err.message });

    res.json({
      result_csv: '/visuals/kmeans_result.csv',
      chart: '/visuals/kmeans_output.png',
    });
  });
};

module.exports = { runKMeansAnalysis };
