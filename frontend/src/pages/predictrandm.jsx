


// import { useEffect, useState } from "react";
// import axios from "axios";

// const PredictRandM = () => {
//   const [equipmentList, setEquipmentList] = useState([]);
//   const [selectedEquipment, setSelectedEquipment] = useState([]);
//   const [prediction, setPrediction] = useState(null);
//   const [loading, setLoading] = useState(false);

//   // Fetch all equipment
//   useEffect(() => {
//     fetchEquipment();
//   }, []);

//   const fetchEquipment = async () => {
//     try {
//       const res = await axios.get("http://localhost:5000/api/equipment");
//       setEquipmentList(res.data.equipment || res.data);
//     } catch (err) {
//       console.error("❌ Equipment fetch failed:", err);
//     }
//   };

//   const handleCheckboxChange = (e, eq) => {
//     if (e.target.checked) {
//       setSelectedEquipment([...selectedEquipment, eq]);
//     } else {
//       setSelectedEquipment(selectedEquipment.filter(item => item._id !== eq._id));
//     }
//   };

//   const handlePredict = async () => {
//     if (selectedEquipment.length === 0) {
//       alert("⚠️ Please select at least one equipment");
//       return;
//     }

//     setLoading(true);

//     try {
//       // ✅ Send only _id array to backend
//       const payload = {
//         componentIds: selectedEquipment.map(eq => eq._id),
//       };

//       const res = await axios.post("http://localhost:5000/api/ml/predict", payload);
//       setPrediction(res.data);
//     } catch (err) {
//       console.error("❌ Prediction error:", err);
//       alert("❌ Failed to predict faults");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="p-6 min-h-screen bg-gradient-to-br from-green-50 to-blue-100">
//       <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-xl mb-10">
//         <h2 className="text-2xl font-bold mb-4">⚡ Predict Equipment Faults</h2>
//         <p className="mb-4 text-gray-600">
//           Select the components you want to analyze for potential faults.
//         </p>

//         <div className="mb-6">
//           {equipmentList.length === 0 ? (
//             <p>Loading equipment...</p>
//           ) : (
//             equipmentList.map(eq => (
//               <div key={eq._id} className="flex items-center mb-2">
//                 <input
//                   type="checkbox"
//                   id={eq._id}
//                   className="mr-2"
//                   onChange={(e) => handleCheckboxChange(e, eq)}
//                 />
//                 <label htmlFor={eq._id}>
//                   {eq.name} ({eq.labName}) — Condition: {eq.condition}
//                 </label>
//               </div>
//             ))
//           )}
//         </div>

//         <button
//           onClick={handlePredict}
//           disabled={loading}
//           className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg disabled:bg-gray-400"
//         >
//           {loading ? "Predicting..." : "Predict Fault"}
//         </button>

//         {/* Prediction Result */}
//         {prediction && (
//           <div className="mt-8 bg-gray-50 p-6 rounded-lg shadow-md">
//             <h3 className="text-xl font-semibold mb-4">Prediction Result</h3>
//             {prediction.length === 0 ? (
//               <p>No prediction data available</p>
//             ) : (
//               prediction.map((res, index) => (
//                 <div key={index} className="mb-4 border-b pb-2">
//                   <p><strong>Component:</strong> {res.component}</p>
//                   <p><strong>Faulty:</strong> {res.faulty ? "Yes" : "No"}</p>
//                   <p><strong>Action:</strong> {res.action}</p>
//                   <p><strong>Time to Action:</strong> {res.time_to_action}</p>
//                   <p><strong>Priority Score:</strong> {res.priority_score}</p>
//                 </div>
//               ))
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default PredictRandM;

// import { useEffect, useState } from "react";
// import axios from "axios";

// const PredictRandM = () => {
//   const [equipmentList, setEquipmentList] = useState([]);
//   const [selectedEquipment, setSelectedEquipment] = useState([]);
//   const [prediction, setPrediction] = useState(null);
//   const [loading, setLoading] = useState(false);

//   // Fetch all equipment on mount
//   useEffect(() => {
//     fetchEquipment();
//   }, []);

//   const fetchEquipment = async () => {
//     try {
//       const res = await axios.get("http://localhost:5000/api/equipment");
//       setEquipmentList(res.data.equipment || res.data);
//     } catch (err) {
//       console.error("❌ Equipment fetch failed:", err);
//     }
//   };

//   const handleCheckboxChange = (e, eq) => {
//     if (e.target.checked) {
//       setSelectedEquipment([...selectedEquipment, eq]);
//     } else {
//       setSelectedEquipment(selectedEquipment.filter((item) => item._id !== eq._id));
//     }
//   };

//   const handlePredict = async () => {
//     if (selectedEquipment.length === 0) {
//       alert("⚠️ Please select at least one equipment");
//       return;
//     }

//     setLoading(true);

//     try {
//       const payload = {
//         componentIds: selectedEquipment.map((eq) => eq._id),
//       };

//       const res = await axios.post("http://localhost:5000/api/ml/predict", payload);
//       setPrediction(res.data);
//     } catch (err) {
//       console.error("❌ Prediction error:", err);
//       alert("❌ Failed to predict faults");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Determine card styles based on fault status and priority
//   const getCardStyles = (res) => {
//     if (!res.faulty) return "bg-green-50 border-green-400";
//     if (res.priority_score > 10) return "bg-red-50 border-red-500";
//     return "bg-yellow-50 border-yellow-400";
//   };

//   return (
//     <div className="p-6 min-h-screen bg-gradient-to-br from-green-50 to-blue-100">
//       <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-xl mb-10">
//         <h2 className="text-2xl font-bold mb-4">⚡ Predict Equipment Faults</h2>
//         <p className="mb-4 text-gray-600">
//           Select the components you want to analyze for potential faults.
//         </p>

//         {/* Equipment Selection */}
//         <div className="mb-6">
//           {equipmentList.length === 0 ? (
//             <p>Loading equipment...</p>
//           ) : (
//             equipmentList.map((eq) => (
//               <div key={eq._id} className="flex items-center mb-2">
//                 <input
//                   type="checkbox"
//                   id={eq._id}
//                   className="mr-2"
//                   onChange={(e) => handleCheckboxChange(e, eq)}
//                 />
//                 <label htmlFor={eq._id}>
//                   {eq.name} ({eq.labName}) — Condition: {eq.condition}
//                 </label>
//               </div>
//             ))
//           )}
//         </div>

//         {/* Predict Button */}
//         <button
//           onClick={handlePredict}
//           disabled={loading}
//           className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg disabled:bg-gray-400"
//         >
//           {loading ? "Predicting..." : "Predict Fault"}
//         </button>

//         {/* Prediction Results */}
//         {prediction && (
//           <div className="mt-8 grid gap-6 grid-cols-1 md:grid-cols-2">
//             {prediction.length === 0 ? (
//               <p>No prediction data available</p>
//             ) : (
//               prediction.map((res, index) => (
//                 <div
//                   key={index}
//                   className={`p-4 rounded-lg shadow-md border ${getCardStyles(res)}`}
//                 >
//                   <h3 className="text-lg font-bold mb-2">
//                     {res.component} ({res.labName || "N/A"})
//                   </h3>
//                   <p>
//                     <strong>Status:</strong>{" "}
//                     <span
//                       className={`font-semibold ${
//                         res.faulty ? "text-red-600" : "text-green-600"
//                       }`}
//                     >
//                       {res.faulty ? "⚠️ Faulty" : "✅ OK"}
//                     </span>
//                   </p>
//                   <p>
//                     <strong>Action:</strong> {res.action || "No action needed"}
//                   </p>
//                   <p>
//                     <strong>Time to Action:</strong> {res.time_to_action || "—"}
//                   </p>
//                   <p>
//                     <strong>Priority Score:</strong> {res.priority_score || "—"}
//                   </p>
//                   {res.ageInYears !== undefined && (
//                     <p>
//                       <strong>Age:</strong> {res.ageInYears} yrs
//                     </p>
//                   )}
//                   {res.faultCount !== undefined && (
//                     <p>
//                       <strong>Past Faults:</strong> {res.faultCount}
//                     </p>
//                   )}
//                   {res.severity && (
//                     <p>
//                       <strong>Severity:</strong>{" "}
//                       <span
//                         className={`font-semibold ${
//                           res.severity === "High"
//                             ? "text-red-600"
//                             : res.severity === "Medium"
//                             ? "text-yellow-600"
//                             : "text-green-600"
//                         }`}
//                       >
//                         {res.severity}
//                       </span>
//                     </p>
//                   )}
//                 </div>
//               ))
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default PredictRandM;

import { useEffect, useState } from "react";
import { predictDevices, trainModel } from "../api/predictApi";
import axios from "axios";

const PredictRandM = () => {
  const [equipmentList, setEquipmentList] = useState([]);
  const [selectedEquipment, setSelectedEquipment] = useState(new Set());
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [training, setTraining] = useState(false);

  useEffect(() => { fetchEquipment(); }, []);

  const fetchEquipment = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/equipment");
      setEquipmentList(res.data.equipment || res.data);
    } catch (e) { console.error("Fetch equipment failed:", e); }
  };

  const toggleSelect = (id) => {
    setSelectedEquipment(prev => {
      const copy = new Set(prev);
      if (copy.has(id)) copy.delete(id);
      else copy.add(id);
      return copy;
    });
  };

  const handlePredict = async () => {
    if (selectedEquipment.size === 0) {
      alert("Select devices first");
      return;
    }
    setLoading(true);
    try {
      const ids = Array.from(selectedEquipment);
      const res = await predictDevices(ids); // Make sure this calls /api/ml/predict-fault
      setResults(res);
    } catch (e) {
      console.error("Prediction failed:", e);
      alert("Prediction failed");
    } finally {
      setLoading(false);
    }
  };

  const handleTrain = async () => {
    setTraining(true);
    try {
      const r = await trainModel(); // Make sure this calls /api/ml/train
      alert("Training started / completed");
      console.log(r);
    } catch (e) {
      console.error("Training failed:", e);
      alert("Training failed");
    } finally {
      setTraining(false);
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded shadow">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold">⚡ Predict Equipment Faults</h1>
          <div className="flex gap-2">
            <button onClick={handleTrain} className="px-3 py-1 bg-indigo-600 text-white rounded">
              {training ? "Training..." : "Retrain Model"}
            </button>
            <button onClick={handlePredict} className="px-3 py-1 bg-blue-600 text-white rounded">
              {loading ? "Predicting..." : "Predict Selected"}
            </button>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-sm text-gray-600">
            Select devices to run prediction (purchase date & faults shown):
          </p>
          <div className="mt-3 space-y-2">
            {equipmentList.map(eq => (
              <label key={eq._id} className="flex items-center gap-3 p-2 border rounded">
                <input
                  type="checkbox"
                  checked={selectedEquipment.has(eq._id)}
                  onChange={() => toggleSelect(eq._id)}
                />
                <div>
                  <div className="font-medium">
                    {eq.name} <span className="text-xs text-gray-500">({eq.labName})</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    Purchase: {eq.purchaseDate ? new Date(eq.purchaseDate).toLocaleDateString() : "N/A"} • Condition: {eq.condition || "N/A"}
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {results.length > 0 && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {results.map(r => (
              <div
                key={r.equipmentId}
                className={`p-4 border rounded shadow ${r.predictedReplace ? "bg-red-50 border-red-300" : "bg-white"}`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold">
                      {r.component || r.name} <span className="text-sm text-gray-500">({r.labName})</span>
                    </h3>
                    <div className="text-xs text-gray-600">
                      Purchased: {r.purchaseDate || "N/A"} • Age (months): {r.ageMonths || 0}
                    </div>
                    <div className="text-xs text-gray-600">
                      Past faults: {r.faultCount || 0}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold">
                      {r.predictedReplace ? "⚠️ Replace" : "✅ Monitor"}
                    </div>
                    <div className="text-xs text-gray-500">
                      Priority: {r.priority_score || "N/A"}
                    </div>
                  </div>
                </div>

                <div className="mt-3 text-sm">
                  <div><strong>Probability:</strong> {(r.probability ? (r.probability*100).toFixed(1) : 0)}%</div>
                  <div><strong>Action:</strong> {r.action || "N/A"}</div>
                  <div><strong>ETA to failure:</strong> {r.estimated_time_to_failure_months || "N/A"} month(s)</div>
                  <div><strong>Confidence:</strong> {r.confidence || "N/A"}</div>
                  {/* {r.suggestedTechnician && (
                    <div><strong>Suggested Tech:</strong> {r.suggestedTechnician.full_name}</div>
                  )} */}
                  <div><strong>Cascade Risk:</strong> {r.cascadeRisk || 0}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PredictRandM;
