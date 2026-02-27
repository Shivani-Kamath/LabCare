// src/components/PredictionForm.jsx
import { useState } from "react";
import axios from "axios";

const PredictionForm = () => {
  const [age, setAge] = useState("");
  const [faultCount, setFaultCount] = useState("");
  const [type, setType] = useState("PC");
  const [prediction, setPrediction] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/predict/fault", {
        type,
        age: parseInt(age),
        faultCount: parseInt(faultCount),
      });
      setPrediction(res.data.predictedFault);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-4 shadow rounded bg-white w-full max-w-md">
      <h2 className="text-xl font-bold mb-2">Predict Fault Type</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input type="number" placeholder="Equipment Age (Years)" value={age} onChange={(e) => setAge(e.target.value)} className="input" required />
        <input type="number" placeholder="Number of Past Faults" value={faultCount} onChange={(e) => setFaultCount(e.target.value)} className="input" required />
        <select value={type} onChange={(e) => setType(e.target.value)} className="input">
          <option value="PC">PC</option>
          <option value="Monitor">Monitor</option>
          <option value="Keyboard">Keyboard</option>
          <option value="Mouse">Mouse</option>
        </select>
        <button type="submit" className="btn">Predict</button>
        {prediction && <p className="mt-2 text-green-600 font-medium">Predicted Fault: {prediction}</p>}
      </form>
    </div>
  );
};

export default PredictionForm;
