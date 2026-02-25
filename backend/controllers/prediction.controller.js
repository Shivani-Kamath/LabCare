const predictFault = require("../ai/faultPredictor");

exports.predict = (req, res) => {
  const { age, faultCount, type } = req.body;

  console.log("📩 Received prediction input:", req.body);

  if (!age || !faultCount || !type) {
    return res.status(400).json({ error: "Missing fields: age, faultCount, or type" });
  }

  try {
    const prediction = predictFault({
      age: parseInt(age),
      faultCount: parseInt(faultCount),
      type,
    });
    console.log("✅ Prediction result:", prediction);
    res.status(200).json({ prediction });
  } catch (err) {
    console.error("❌ Prediction error:", err);
    res.status(500).json({ error: "Prediction failed" });
  }
};
