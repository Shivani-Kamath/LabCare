// src/components/PredictionForm.jsx
import { useState } from "react";
import axios from "axios";

const PredictionForm = () => {
  const [age, setAge] = useState("");
  const [faultCount, setFaultCount] = useState("");
  const [type, setType] = useState("PC");
  const [prediction, setPrediction] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPrediction("");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/api/predict/fault", {
        age: parseInt(age),
        faultCount: parseInt(faultCount),
        type,
      });
      setPrediction(res.data.prediction);
    } catch (err) {
      console.error("Prediction failed", err);
      setPrediction("Error predicting");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md max-w-md mx-auto mt-10">
      <h2 className="text-xl font-semibold mb-4 text-center text-gray-800">🧠 Fault Prediction</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="number"
          placeholder="Equipment Age (in years)"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          required
          className="w-full p-2 border border-gray-300 rounded"
        />
        <input
          type="number"
          placeholder="Total Fault Count"
          value={faultCount}
          onChange={(e) => setFaultCount(e.target.value)}
          required
          className="w-full p-2 border border-gray-300 rounded"
        />
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        >
          <option value="PC">PC</option>
          <option value="Projector">Projector</option>
          <option value="Printer">Printer</option>
        </select>
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
        >
          {loading ? "Predicting..." : "Predict"}
        </button>
      </form>
      {prediction && (
        <div className="mt-6 text-lg text-center text-gray-700">
          <strong>Prediction:</strong> {prediction}
        </div>
      )}
    </div>
  );
};

export default PredictionForm;
