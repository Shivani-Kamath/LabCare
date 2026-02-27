// Add lab selection and logout button placeholder if not present
// import { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// const LabInchargeDashboard = () => {
//   const [faults, setFaults] = useState([]);
//   const [technicians, setTechnicians] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     setLoading(true);
//     try {
//       const [faultsRes, techRes] = await Promise.all([
//         axios.get("http://localhost:5000/api/faults"),
//         axios.get("http://localhost:5000/api/users?role=technician"),
//       ]);

//       setFaults(faultsRes.data.faults || faultsRes.data);
//       setTechnicians(techRes.data.users || techRes.data);
//     } catch (err) {
//       console.error("❌ Fetch error:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleAssign = async (faultId, technicianId) => {
//     try {
//       await axios.put(`http://localhost:5000/api/faults/assign/${faultId}`, {
//         technicianId,
//       });
//       alert("✅ Technician Assigned");
//       fetchData();
//     } catch (err) {
//       console.error("❌ Assignment error:", err);
//       alert("Failed to assign technician");
//     }
//   };

//   return (
//     <div className="p-6 min-h-screen bg-gradient-to-br from-yellow-50 to-pink-100">
//       <div className="max-w-6xl mx-auto bg-white p-6 rounded-xl shadow-xl">
//         <div className="flex justify-between items-center mb-6">
//           <h2 className="text-2xl font-bold">🏫 Lab Incharge Dashboard</h2>
//           <div className="flex gap-3">
//             <button
//               onClick={() => navigate("/labincharge/predict")}
//               className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
//             >
//               🔍 Predict Fault
//             </button>
//             <button
//               onClick={() => navigate("/labincharge/analytics")}
//               className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
//             >
//               📊 View Analytics
//             </button>
//           </div>
//         </div>

//         {loading ? (
//           <p>Loading...</p>
//         ) : (
//           <table className="w-full border text-sm">
//             <thead className="bg-gray-100">
//               <tr>
//                 <th className="p-2 border">Equipment</th>
//                 <th className="p-2 border">Lab</th>
//                 <th className="p-2 border">Status</th>
//                 <th className="p-2 border">Reported By</th>
//                 <th className="p-2 border">Technician</th>
//                 <th className="p-2 border">Assign</th>
//               </tr>
//             </thead>
//             <tbody>
//               {faults.map((fault) => (
//                 <tr key={fault._id}>
//                   <td className="p-2 border">{fault.equipmentId?.name || "N/A"}</td>
//                   <td className="p-2 border">{fault.labName}</td>
//                   <td className="p-2 border">
//                     <span
//                       className={`px-2 py-1 rounded-full text-white text-xs ${
//                         fault.status === "Resolved"
//                           ? "bg-green-500"
//                           : "bg-yellow-500"
//                       }`}
//                     >
//                       {fault.status}
//                     </span>
//                   </td>
//                   <td className="p-2 border">{fault.reportedBy?.full_name || "—"}</td>
//                   <td className="p-2 border">
//                     {fault.assignedTo?.full_name || "Not Assigned"}
//                   </td>
//                   <td className="p-2 border">
//                     <AssignForm
//                       faultId={fault._id}
//                       currentId={fault.assignedTo?._id}
//                       technicians={technicians}
//                       onAssign={handleAssign}
//                     />
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}
//       </div>
//     </div>
//   );
// };

// const AssignForm = ({ faultId, currentId, technicians, onAssign }) => {
//   const [selected, setSelected] = useState(currentId || "");

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (!selected) return;
//     onAssign(faultId, selected);
//   };

//   return (
//     <form onSubmit={handleSubmit} className="flex items-center gap-2">
//       <select
//         className="border px-2 py-1 rounded"
//         value={selected}
//         onChange={(e) => setSelected(e.target.value)}
//         required
//       >
//         <option value="">-- Select Technician --</option>
//         {technicians.map((tech) => (
//           <option key={tech._id} value={tech._id}>
//             {tech.full_name}
//           </option>
//         ))}
//       </select>
//       <button
//         type="submit"
//         className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 text-xs"
//       >
//         Assign
//       </button>
//     </form>
//   );
// };

// export default LabInchargeDashboard;





// import { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// const LabInchargeDashboard = () => {
//   const [faults, setFaults] = useState([]);
//   const [technicians, setTechnicians] = useState([]);
//   const [equipment, setEquipment] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchFaultsAndTechs();
//     fetchEquipment();
//   }, []);

//   const fetchFaultsAndTechs = async () => {
//     setLoading(true);
//     try {
//       const [faultsRes, techRes] = await Promise.all([
//         axios.get("http://localhost:5000/api/faults"),
//         axios.get("http://localhost:5000/api/users?role=technician"),
//       ]);
//       setFaults(faultsRes.data.faults || faultsRes.data || []);
//       setTechnicians(techRes.data.users || techRes.data || []);
//     } catch (err) {
//       console.error("❌ Fetch error:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchEquipment = async () => {
//     try {
//       const res = await axios.get("http://localhost:5000/api/equipment");
//       setEquipment(res.data.equipment || res.data || []);
//     } catch (err) {
//       console.error("❌ Equipment fetch error:", err);
//       setEquipment([]);
//     }
//   };

//   const handleAssign = async (faultId, technicianId) => {
//     if (!faultId || !technicianId) return;
//     try {
//       await axios.put(`http://localhost:5000/api/faults/assign/${faultId}`, { technicianId });
//       alert("✅ Technician Assigned");
//       fetchFaultsAndTechs();
//     } catch (err) {
//       console.error(err);
//       alert("❌ Assignment failed");
//     }
//   };

//   const handleAutoAssign = async (faultId) => {
//     if (!faultId) return alert("❌ Fault ID not found");
//     try {
//       const res = await axios.put(`http://localhost:5000/api/faults/auto-assign/${faultId}`);
//       alert(res.data.message || "✅ Auto-assigned technician!");
//       fetchFaultsAndTechs();
//     } catch (err) {
//       console.error(err);
//       if (err.response?.status === 404) {
//         alert("❌ Fault not found in database. Cannot auto-assign.");
//       } else if (err.response?.status === 400) {
//         alert(err.response.data.error || "❌ Fault already assigned");
//       } else {
//         alert("❌ Auto-assign failed");
//       }
//     }
//   };

//   return (
//     <div className="p-6 min-h-screen bg-gradient-to-br from-yellow-50 to-pink-100">
//       <div className="max-w-6xl mx-auto bg-white p-6 rounded-xl shadow-xl">
//         <h2 className="text-2xl font-bold mb-4">🏫 Lab Incharge Dashboard</h2>

//         {/* --- Equipment List --- */}
//         <h3 className="text-lg font-semibold mb-2">📋 Equipment List</h3>
//         <table className="w-full border text-sm mb-6">
//           <thead className="bg-gray-100">
//             <tr>
//               <th className="p-2 border">Name</th>
//               <th className="p-2 border">Lab</th>
//               <th className="p-2 border">Purchase Date</th>
//               <th className="p-2 border">Condition</th>
//             </tr>
//           </thead>
//           <tbody>
//             {equipment.length > 0 ? equipment.map((eq) => (
//               <tr key={eq._id}>
//                 <td className="p-2 border">{eq.name}</td>
//                 <td className="p-2 border">{eq.labName}</td>
//                 <td className="p-2 border">{new Date(eq.purchaseDate).toLocaleDateString()}</td>
//                 <td className="p-2 border">{eq.condition}</td>
//               </tr>
//             )) : (
//               <tr>
//                 <td colSpan="4" className="text-center p-2 border">No equipment found</td>
//               </tr>
//             )}
//           </tbody>
//         </table>

//         {/* --- Faults Table --- */}
//         <h3 className="text-lg font-semibold mb-2">⚡ Faults</h3>
//         {loading ? <p>Loading...</p> : (
//           <table className="w-full border text-sm">
//             <thead className="bg-gray-100">
//               <tr>
//                 <th className="p-2 border">Equipment</th>
//                 <th className="p-2 border">Lab</th>
//                 <th className="p-2 border">Status</th>
//                 <th className="p-2 border">Reported By</th>
//                 <th className="p-2 border">Technician</th>
//                 <th className="p-2 border">Assign</th>
//               </tr>
//             </thead>
//             <tbody>
//               {faults.length > 0 ? faults.map((fault) => (
//                 <tr key={fault._id}>
//                   <td className="p-2 border">{fault.equipmentId?.name || "N/A"}</td>
//                   <td className="p-2 border">{fault.labName}</td>
//                   <td className="p-2 border">
//                     <span className={`px-2 py-1 rounded-full text-white text-xs ${fault.status==="Resolved" ? "bg-green-500" : "bg-yellow-500"}`}>
//                       {fault.status}
//                     </span>
//                   </td>
//                   <td className="p-2 border">{fault.reportedBy?.full_name || "—"}</td>
//                   <td className="p-2 border">{fault.assignedTo?.full_name || "Not Assigned"}</td>
//                   <td className="p-2 border flex gap-2">
//                     <AssignForm faultId={fault._id} currentId={fault.assignedTo?._id} technicians={technicians} onAssign={handleAssign} />
                    
//                     {!fault.assignedTo && (
//                       <button
//                         onClick={() => handleAutoAssign(fault._id)}
//                         className="bg-purple-500 text-white px-2 py-1 rounded hover:bg-purple-600 text-xs"
//                       >
//                         Auto-Assign
//                       </button>
//                     )}
//                   </td>
//                 </tr>
//               )) : (
//                 <tr>
//                   <td colSpan="6" className="text-center p-2 border">No faults found</td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         )}
//       </div>
//     </div>
//   );
// };

// const AssignForm = ({ faultId, currentId, technicians, onAssign }) => {
//   const [selected, setSelected] = useState(currentId || "");

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (!selected) return;
//     onAssign(faultId, selected);
//   };

//   return (
//     <form onSubmit={handleSubmit} className="flex items-center gap-2">
//       <select className="border px-2 py-1 rounded" value={selected} onChange={(e) => setSelected(e.target.value)} required>
//         <option value="">-- Select Technician --</option>
//         {technicians.map((tech) => (
//           <option key={tech._id} value={tech._id}>{tech.full_name}</option>
//         ))}
//       </select>
//       <button type="submit" className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 text-xs">Assign</button>
//     </form>
//   );
// };

// export default LabInchargeDashboard;




// import { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// const LabInchargeDashboard = () => {
//   const [faults, setFaults] = useState([]);
//   const [technicians, setTechnicians] = useState([]);
//   const [equipment, setEquipment] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchFaultsAndTechs();
//     fetchEquipment();
//   }, []);

//   // Fetch faults + technicians
//   const fetchFaultsAndTechs = async () => {
//     setLoading(true);
//     try {
//       const [faultsRes, techRes] = await Promise.all([
//         axios.get("http://localhost:5000/api/faults"),
//         axios.get("http://localhost:5000/api/users?role=technician"),
//       ]);

//       setFaults(faultsRes.data.faults || faultsRes.data || []);
//       setTechnicians(techRes.data.users || techRes.data || []);
//     } catch (err) {
//       console.error("❌ Fetch error:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fetch equipment list
//   const fetchEquipment = async () => {
//     try {
//       const res = await axios.get("http://localhost:5000/api/equipment");
//       setEquipment(res.data.equipment || res.data || []);
//     } catch (err) {
//       console.error("❌ Equipment fetch error:", err);
//       setEquipment([]);
//     }
//   };

//   // Assign fault to technician
//   const handleAssign = async (faultId, technicianId) => {
//     try {
//       await axios.put(`http://localhost:5000/api/faults/assign/${faultId}`, {
//         technicianId,
//       });
//       alert("✅ Technician Assigned");
//       fetchFaultsAndTechs();
//     } catch (err) {
//       console.error("❌ Assignment error:", err);
//       alert("Failed to assign technician");
//     }
//   };

//   // Add new equipment
//   const handleAddEquipment = async (newEquipment) => {
//     try {
//       await axios.post("http://localhost:5000/api/equipment", newEquipment);
//       alert("✅ Equipment Added");
//       fetchEquipment();
//     } catch (err) {
//       console.error("❌ Equipment add error:", err);
//       alert("Failed to add equipment");
//     }
//   };

//   return (
//     <div className="p-6 min-h-screen bg-gradient-to-br from-yellow-50 to-pink-100">
//       <div className="max-w-6xl mx-auto bg-white p-6 rounded-xl shadow-xl">
//         {/* Header */}
//         <div className="flex justify-between items-center mb-6">
//           <h2 className="text-2xl font-bold">🏫 Lab Incharge Dashboard</h2>
//           <div className="flex gap-3">
//             <button
//               onClick={() => navigate("/labincharge/predict")}
//               className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
//             >
//               🔍 Predict Fault
//             </button>
//             <button
//               onClick={() => navigate("/labincharge/analytics")}
//               className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
//             >
//               📊 View Analytics
//             </button>
//           </div>
//         </div>

//         {/* --- ADD EQUIPMENT --- */}
//         <div className="mb-8">
//           <h3 className="text-lg font-semibold mb-2">➕ Add Equipment</h3>
//           <AddEquipmentForm onAdd={handleAddEquipment} />
//         </div>

//         {/* --- EQUIPMENT LIST --- */}
//         <div className="mb-8">
//           <h3 className="text-lg font-semibold mb-2">📋 Equipment List</h3>
//           <table className="w-full border text-sm mb-6">
//             <thead className="bg-gray-100">
//               <tr>
//                 <th className="p-2 border">Name</th>
//                 <th className="p-2 border">Lab</th>
//                 <th className="p-2 border">Purchase Date</th>
//                 <th className="p-2 border">Condition</th>
//               </tr>
//             </thead>
//             <tbody>
//               {equipment && equipment.length > 0 ? (
//                 equipment.map((eq) => (
//                   <tr key={eq._id}>
//                     <td className="p-2 border">{eq.name}</td>
//                     <td className="p-2 border">{eq.labName}</td>
//                     <td className="p-2 border">
//                       {eq.purchaseDate
//                         ? new Date(eq.purchaseDate).toLocaleDateString()
//                         : "—"}
//                     </td>
//                     <td className="p-2 border">{eq.condition}</td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td className="p-2 border text-center" colSpan="4">
//                     No equipment found
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>

//         {/* --- FAULTS TABLE --- */}
//         <h3 className="text-lg font-semibold mb-2">⚡ Faults</h3>
//         {loading ? (
//           <p>Loading...</p>
//         ) : (
//           <table className="w-full border text-sm">
//             <thead className="bg-gray-100">
//               <tr>
//                 <th className="p-2 border">Equipment</th>
//                 <th className="p-2 border">Lab</th>
//                 <th className="p-2 border">Status</th>
//                 <th className="p-2 border">Reported By</th>
//                 <th className="p-2 border">Technician</th>
//                 <th className="p-2 border">Assign</th>
//               </tr>
//             </thead>
//             <tbody>
//               {faults && faults.length > 0 ? (
//                 faults.map((fault) => (
//                   <tr key={fault._id}>
//                     <td className="p-2 border">
//                       {fault.equipmentId?.name || "N/A"}
//                     </td>
//                     <td className="p-2 border">{fault.labName}</td>
//                     <td className="p-2 border">
//                       <span
//                         className={`px-2 py-1 rounded-full text-white text-xs ${
//                           fault.status === "Resolved"
//                             ? "bg-green-500"
//                             : "bg-yellow-500"
//                         }`}
//                       >
//                         {fault.status}
//                       </span>
//                     </td>
//                     <td className="p-2 border">
//                       {fault.reportedBy?.full_name || "—"}
//                     </td>
//                     <td className="p-2 border">
//                       {fault.assignedTo?.full_name || "Not Assigned"}
//                     </td>
//                     <td className="p-2 border">
//                       <AssignForm
//                         faultId={fault._id}
//                         currentId={fault.assignedTo?._id}
//                         technicians={technicians}
//                         onAssign={handleAssign}
//                       />
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td className="p-2 border text-center" colSpan="6">
//                     No faults found
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         )}
//       </div>
//     </div>
//   );
// };

// // --- ADD EQUIPMENT FORM ---
// const AddEquipmentForm = ({ onAdd }) => {
//   const [form, setForm] = useState({
//     name: "",
//     labName: "",
//     purchaseDate: "",
//     condition: "",
//   });

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (!form.name || !form.labName || !form.purchaseDate || !form.condition) {
//       alert("⚠️ Please fill all fields");
//       return;
//     }
//     onAdd(form);
//     setForm({ name: "", labName: "", purchaseDate: "", condition: "" });
//   };

//   return (
//     <form
//       onSubmit={handleSubmit}
//       className="flex flex-wrap gap-3 items-center bg-gray-50 p-4 rounded-lg shadow"
//     >
//       <input
//         type="text"
//         name="name"
//         value={form.name}
//         onChange={handleChange}
//         placeholder="Equipment Name"
//         className="border p-2 rounded w-40"
//         required
//       />
//       <input
//         type="text"
//         name="labName"
//         value={form.labName}
//         onChange={handleChange}
//         placeholder="Lab Name"
//         className="border p-2 rounded w-40"
//         required
//       />
//       <input
//         type="date"
//         name="purchaseDate"
//         value={form.purchaseDate}
//         onChange={handleChange}
//         className="border p-2 rounded w-40"
//         required
//       />
//       <select
//         name="condition"
//         value={form.condition}
//         onChange={handleChange}
//         className="border p-2 rounded w-40"
//         required
//       >
//         <option value="">Condition</option>
//         <option value="good">Good</option>
//         <option value="fair">Fair</option>
//         <option value="poor">Poor</option>

//       </select>
//       <button
//         type="submit"
//         className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
//       >
//         Add
//       </button>
//     </form>
//   );
// };

// // --- ASSIGN FORM ---
// const AssignForm = ({ faultId, currentId, technicians, onAssign }) => {
//   const [selected, setSelected] = useState(currentId || "");

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (!selected) return;
//     onAssign(faultId, selected);
//   };

//   return (
//     <form onSubmit={handleSubmit} className="flex items-center gap-2">
//       <select
//         className="border px-2 py-1 rounded"
//         value={selected}
//         onChange={(e) => setSelected(e.target.value)}
//         required
//       >
//         <option value="">-- Select Technician --</option>
//         {technicians.map((tech) => (
//           <option key={tech._id} value={tech._id}>
//             {tech.full_name}
//           </option>
//         ))}
//       </select>
//       <button
//         type="submit"
//         className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 text-xs"
//       >
//         Assign
//       </button>
//     </form>
//   );
// };

// export default LabInchargeDashboard;


// import { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// const LabInchargeDashboard = () => {
//   const [faults, setFaults] = useState([]);
//   const [technicians, setTechnicians] = useState([]);
//   const [equipment, setEquipment] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchFaultsAndTechs();
//     fetchEquipment();
//   }, []);

//   // Fetch faults + technicians
//   const fetchFaultsAndTechs = async () => {
//     setLoading(true);
//     try {
//       const [faultsRes, techRes] = await Promise.all([
//         axios.get("http://localhost:5000/api/faults"),
//         axios.get("http://localhost:5000/api/users?role=technician"),
//       ]);

//       setFaults(faultsRes.data.faults || faultsRes.data || []);
//       setTechnicians(techRes.data.users || techRes.data || []);
//     } catch (err) {
//       console.error("❌ Fetch error:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fetch equipment list
//   const fetchEquipment = async () => {
//     try {
//       const res = await axios.get("http://localhost:5000/api/equipment");
//       setEquipment(res.data.equipment || res.data || []);
//     } catch (err) {
//       console.error("❌ Equipment fetch error:", err);
//       setEquipment([]);
//     }
//   };

//   // Assign fault to technician
//   const handleAssign = async (faultId, technicianId) => {
//     try {
//       await axios.put(`http://localhost:5000/api/faults/assign/${faultId}`, {
//         technicianId,
//       });
//       alert("✅ Technician Assigned");
//       fetchFaultsAndTechs();
//     } catch (err) {
//       console.error("❌ Assignment error:", err);
//       alert("Failed to assign technician");
//     }
//   };

//   // Add new equipment
//   const handleAddEquipment = async (newEquipment) => {
//     try {
//       await axios.post("http://localhost:5000/api/equipment", newEquipment);
//       alert("✅ Equipment Added");
//       fetchEquipment();
//     } catch (err) {
//       console.error("❌ Equipment add error:", err);
//       alert("Failed to add equipment");
//     }
//   };

//   return (
//     <div className="p-6 min-h-screen bg-gradient-to-br from-yellow-50 to-pink-100">
//       <div className="max-w-6xl mx-auto bg-white p-6 rounded-xl shadow-xl">
//         {/* Header */}
//         <div className="flex justify-between items-center mb-6">
//           <h2 className="text-2xl font-bold">🏫 Lab Incharge Dashboard</h2>
//           <div className="flex gap-3">
//             <button
//               onClick={() => navigate("/labincharge/image-predictor")}
//               className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
//             >
//               🔍 Image Predictor
//             </button>
//             <button
//               onClick={() => navigate("/labincharge/analytics")}
//               className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
//             >
//               📊 View Analytics
//             </button>
//           </div>
//         </div>

//         {/* --- ADD EQUIPMENT --- */}
//         <div className="mb-8">
//           <h3 className="text-lg font-semibold mb-2">➕ Add Equipment</h3>
//           <AddEquipmentForm onAdd={handleAddEquipment} />
//         </div>

//         {/* --- EQUIPMENT LIST --- */}
//         <div className="mb-8">
//           <h3 className="text-lg font-semibold mb-2">📋 Equipment List</h3>
//           <table className="w-full border text-sm mb-6">
//             <thead className="bg-gray-100">
//               <tr>
//                 <th className="p-2 border">Name</th>
//                 <th className="p-2 border">Lab</th>
//                 <th className="p-2 border">Purchase Date</th>
//                 <th className="p-2 border">Condition</th>
//               </tr>
//             </thead>
//             <tbody>
//               {equipment && equipment.length > 0 ? (
//                 equipment.map((eq) => (
//                   <tr key={eq._id}>
//                     <td className="p-2 border">{eq.name}</td>
//                     <td className="p-2 border">{eq.labName}</td>
//                     <td className="p-2 border">
//                       {eq.purchaseDate
//                         ? new Date(eq.purchaseDate).toLocaleDateString()
//                         : "—"}
//                     </td>
//                     <td className="p-2 border">{eq.condition}</td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td className="p-2 border text-center" colSpan="4">
//                     No equipment found
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>

//         {/* --- FAULTS TABLE --- */}
//         <h3 className="text-lg font-semibold mb-2">⚡ Faults</h3>
//         {loading ? (
//           <p>Loading...</p>
//         ) : (
//           <table className="w-full border text-sm">
//             <thead className="bg-gray-100">
//               <tr>
//                 <th className="p-2 border">Equipment</th>
//                 <th className="p-2 border">Lab</th>
//                 <th className="p-2 border">Status</th>
//                 <th className="p-2 border">Reported By</th>
//                 <th className="p-2 border">Technician</th>
//                 <th className="p-2 border">Assign</th>
//               </tr>
//             </thead>
//             <tbody>
//               {faults && faults.length > 0 ? (
//                 faults.map((fault) => (
//                   <tr key={fault._id}>
//                     <td className="p-2 border">
//                       {fault.equipmentId?.name || "N/A"}
//                     </td>
//                     <td className="p-2 border">{fault.labName}</td>
//                     <td className="p-2 border">
//                       <span
//                         className={`px-2 py-1 rounded-full text-white text-xs ${
//                           fault.status === "Resolved"
//                             ? "bg-green-500"
//                             : "bg-yellow-500"
//                         }`}
//                       >
//                         {fault.status}
//                       </span>
//                     </td>
//                     <td className="p-2 border">
//                       {fault.reportedBy?.full_name || "—"}
//                     </td>
//                     <td className="p-2 border">
//                       {fault.assignedTo?.full_name || "Not Assigned"}
//                     </td>
//                     <td className="p-2 border">
//                       <AssignForm
//                         faultId={fault._id}
//                         currentId={fault.assignedTo?._id}
//                         technicians={technicians}
//                         onAssign={handleAssign}
//                       />
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td className="p-2 border text-center" colSpan="6">
//                     No faults found
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         )}
//       </div>
//     </div>
//   );
// };

// // --- ADD EQUIPMENT FORM ---
// const AddEquipmentForm = ({ onAdd }) => {
//   const [form, setForm] = useState({
//     name: "",
//     labName: "",
//     purchaseDate: "",
//     condition: "",
//   });

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (!form.name || !form.labName || !form.purchaseDate || !form.condition) {
//       alert("⚠️ Please fill all fields");
//       return;
//     }
//     onAdd(form);
//     setForm({ name: "", labName: "", purchaseDate: "", condition: "" });
//   };

//   return (
//     <form
//       onSubmit={handleSubmit}
//       className="flex flex-wrap gap-3 items-center bg-gray-50 p-4 rounded-lg shadow"
//     >
//       <input
//         type="text"
//         name="name"
//         value={form.name}
//         onChange={handleChange}
//         placeholder="Equipment Name"
//         className="border p-2 rounded w-40"
//         required
//       />
//       <input
//         type="text"
//         name="labName"
//         value={form.labName}
//         onChange={handleChange}
//         placeholder="Lab Name"
//         className="border p-2 rounded w-40"
//         required
//       />
//       <input
//         type="date"
//         name="purchaseDate"
//         value={form.purchaseDate}
//         onChange={handleChange}
//         className="border p-2 rounded w-40"
//         required
//       />
//       <select
//         name="condition"
//         value={form.condition}
//         onChange={handleChange}
//         className="border p-2 rounded w-40"
//         required
//       >
//         <option value="">Condition</option>
//         <option value="good">Good</option>
//         <option value="fair">Fair</option>
//         <option value="poor">Poor</option>
//       </select>
//       <button
//         type="submit"
//         className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
//       >
//         Add
//       </button>
//     </form>
//   );
// };

// // --- ASSIGN FORM ---
// const AssignForm = ({ faultId, currentId, technicians, onAssign }) => {
//   const [selected, setSelected] = useState(currentId || "");

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (!selected) return;
//     onAssign(faultId, selected);
//   };

//   return (
//     <form onSubmit={handleSubmit} className="flex items-center gap-2">
//       <select
//         className="border px-2 py-1 rounded"
//         value={selected}
//         onChange={(e) => setSelected(e.target.value)}
//         required
//       >
//         <option value="">-- Select Technician --</option>
//         {technicians.map((tech) => (
//           <option key={tech._id} value={tech._id}>
//             {tech.full_name}
//           </option>
//         ))}
//       </select>
//       <button
//         type="submit"
//         className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 text-xs"
//       >
//         Assign
//       </button>
//     </form>
//   );
// };

// export default LabInchargeDashboard;


import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import LogoutButton from '../components/ui/LogoutButton';

const LabInchargeDashboard = () => {
  const [faults, setFaults] = useState([]);
  const [selectedLab, setSelectedLab] = useState(''); // '', 'Lab1'..'Lab5'
  const [technicians, setTechnicians] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchFaultsAndTechs();
    fetchEquipment();
  }, []);

  // refetch equipment whenever lab selection changes (including "All")
  useEffect(() => {
    fetchEquipment();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedLab]);

  // Fetch faults + technicians
  const fetchFaultsAndTechs = async () => {
    setLoading(true);
    try {
      const [faultsRes, techRes] = await Promise.all([
        axios.get("http://localhost:5000/api/faults"),
        axios.get("http://localhost:5000/api/users?role=technician"),
      ]);

      setFaults(faultsRes.data.faults || faultsRes.data || []);
      setTechnicians(techRes.data.users || techRes.data || []);
    } catch (err) {
      console.error("❌ Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch equipment list
  const fetchEquipment = async () => {
    try {
      if (!selectedLab) {
        // Load all equipment when "All" selected
        const res = await axios.get("http://localhost:5000/api/equipment");
        setEquipment(res.data.equipment || res.data || []);
      } else {
        const labNumber = selectedLab.toLowerCase();
        const res = await axios.get(`http://localhost:5000/api/equipment/lab/${labNumber}`);
        setEquipment(res.data.equipment || res.data || []);
      }
    } catch (err) {
      console.error("❌ Equipment fetch error:", err);
      setEquipment([]);
    }
  };

  // Assign fault to technician
  const handleAssign = async (faultId, technicianId) => {
    try {
      await axios.put(`http://localhost:5000/api/faults/assign/${faultId}`, {
        technicianId,
      });
      alert("✅ Technician Assigned");
      fetchFaultsAndTechs();
    } catch (err) {
      console.error("❌ Assignment error:", err);
      alert("Failed to assign technician");
    }
  };

  // Auto-assign fault
  const handleAutoAssign = async (faultId) => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/faults/auto-assign/${faultId}`
      );
      alert(`✅ ${res.data.message}`);
      fetchFaultsAndTechs();
    } catch (err) {
      console.error("❌ Auto-assign error:", err);
      alert("Failed to auto-assign technician");
    }
  };

  // Add new equipment
  const handleAddEquipment = async (payload) => {
    try {
      if (!selectedLab) return alert('Select a lab first');
      const labNumber = selectedLab.toLowerCase();
      await axios.post(`http://localhost:5000/api/equipment/lab/${labNumber}`, payload);
      alert("✅ Equipment Added");
      fetchEquipment();
    } catch (err) {
      console.error("❌ Equipment add error:", err);
      alert(err.response?.data?.error || "Failed to add equipment");
    }
  };

  const labs = ['Lab1', 'Lab2', 'Lab3', 'Lab4', 'Lab5'];
  const filteredFaults = selectedLab ? faults.filter(f => f.labName === selectedLab) : faults;
  const logout = () => { localStorage.clear(); navigate('/'); };

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-canvas to-neutral-100">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-ink">🏫 Lab Incharge Dashboard</h1>
            <p className="text-neutral-600 mt-1">Manage lab equipment, faults, and assignments</p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={() => navigate("/labincharge/predict")}
              className="bg-brand-600 hover:bg-brand-700"
            >
              ⚡ Predict Fault
            </Button>
            <Button
              onClick={() => navigate("/labincharge/analytics")}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              📊 Analytics
            </Button>
            <LogoutButton />
          </div>
        </div>

        {/* Lab filter buttons */}
        <Card>
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-medium text-neutral-700">Filter by Lab:</span>
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={() => setSelectedLab('')}
                variant={selectedLab === '' ? 'primary' : 'ghost'}
                className={selectedLab === '' ? '' : 'text-neutral-600 hover:text-ink'}
              >
                All Labs
              </Button>
              {labs.map(lab => (
                <Button
                  key={lab}
                  onClick={() => setSelectedLab(lab)}
                  variant={selectedLab === lab ? 'primary' : 'ghost'}
                  className={selectedLab === lab ? '' : 'text-neutral-600 hover:text-ink'}
                >
                  {lab}
                </Button>
              ))}
            </div>
          </div>
        </Card>

        {/* Add Equipment Section */}
        {selectedLab && (
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-ink">➕ Add Equipment to {selectedLab}</h3>
              <span className="text-sm text-neutral-500 bg-neutral-100 px-3 py-1 rounded-full">
                Selected: {selectedLab}
              </span>
            </div>
            <AddEquipmentForm onAdd={handleAddEquipment} selectedLab={selectedLab} onAdded={fetchEquipment} />
          </Card>
        )}

        {/* Equipment List */}
        <Card>
          <h3 className="text-xl font-semibold text-ink mb-4">
            📋 Equipment List {selectedLab ? `(${selectedLab})` : '(All Labs)'}
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-neutral-100 text-neutral-700">
                <tr>
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Lab</th>
                  <th className="p-3 text-left">Purchase Date</th>
                  <th className="p-3 text-left">Condition</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {equipment && equipment.length > 0 ? (
                  equipment.map((eq) => (
                    <tr key={eq._id} className="hover:bg-neutral-50">
                      <td className="p-3 font-medium">{eq.name}</td>
                      <td className="p-3 text-neutral-600">{eq.labName}</td>
                      <td className="p-3 text-neutral-600">
                        {eq.purchaseDate
                          ? new Date(eq.purchaseDate).toLocaleDateString()
                          : "—"}
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          eq.condition === 'good' ? 'bg-green-100 text-green-700' :
                          eq.condition === 'fair' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {eq.condition}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="p-8 text-center text-neutral-500" colSpan="4">
                      {selectedLab ? `No equipment found for ${selectedLab}` : 'No equipment found'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Faults Table */}
        <Card>
          <h3 className="text-xl font-semibold text-ink mb-4">
            ⚡ Faults {selectedLab ? `(${selectedLab})` : '(All Labs)'}
          </h3>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600 mx-auto"></div>
              <p className="text-neutral-600 mt-2">Loading faults...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-neutral-100 text-neutral-700">
                  <tr>
                    <th className="p-3 text-left">Equipment</th>
                    <th className="p-3 text-left">Lab</th>
                    <th className="p-3 text-left">Status</th>
                    <th className="p-3 text-left">Reported By</th>
                    <th className="p-3 text-left">Technician</th>
                    <th className="p-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  {filteredFaults && filteredFaults.length > 0 ? (
                    filteredFaults.map((fault) => (
                      <tr key={fault._id} className="hover:bg-neutral-50">
                        <td className="p-3 font-medium">
                          {fault.equipmentId?.name || "N/A"}
                        </td>
                        <td className="p-3 text-neutral-600">{fault.labName}</td>
                        <td className="p-3">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              fault.status === "Resolved"
                                ? "bg-green-100 text-green-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {fault.status}
                          </span>
                        </td>
                        <td className="p-3 text-neutral-600">
                          {fault.reportedBy?.full_name || "—"}
                        </td>
                        <td className="p-3 text-neutral-600">
                          {fault.assignedTo?.full_name || "Not Assigned"}
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            {/* Manual Assign */}
                            <AssignForm
                              faultId={fault._id}
                              currentId={fault.assignedTo?._id}
                              technicians={technicians}
                              onAssign={handleAssign}
                            />

                            {/* Auto-Assign Button */}
                            {!fault.assignedTo && (
                              <Button
                                onClick={() => handleAutoAssign(fault._id)}
                                className="bg-purple-600 hover:bg-purple-700 text-xs py-1 px-2"
                              >
                                ⚡ Auto
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td className="p-8 text-center text-neutral-500" colSpan="6">
                        {selectedLab ? `No faults found for ${selectedLab}` : 'No faults found'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

// --- ADD EQUIPMENT FORM ---
const AddEquipmentForm = ({ onAdd, selectedLab, onAdded }) => {
  const [form, setForm] = useState({
    name: "",
    quantity: 1,
    purchaseDate: "",
    condition: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.purchaseDate || !form.condition) {
      alert("⚠️ Please fill all fields");
      return;
    }
    onAdd({ ...form });
    setForm({ name: "", quantity: 1, purchaseDate: "", condition: "" });
    onAdded?.();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="lc-label">Equipment Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Enter equipment name"
            className="lc-input"
            required
          />
        </div>
        <div>
          <label className="lc-label">Quantity</label>
          <input 
            type="number" 
            name="quantity" 
            min={1} 
            value={form.quantity} 
            onChange={handleChange} 
            className="lc-input" 
            placeholder="Qty" 
          />
        </div>
        <div>
          <label className="lc-label">Purchase Date</label>
          <input
            type="date"
            name="purchaseDate"
            value={form.purchaseDate}
            onChange={handleChange}
            className="lc-input"
            required
          />
        </div>
        <div>
          <label className="lc-label">Condition</label>
          <select
            name="condition"
            value={form.condition}
            onChange={handleChange}
            className="lc-input"
            required
          >
            <option value="">Select condition</option>
            <option value="good">Good</option>
            <option value="fair">Fair</option>
            <option value="poor">Poor</option>
          </select>
        </div>
      </div>
      <div className="flex justify-end">
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
          Add Equipment
        </Button>
      </div>
    </form>
  );
};

// --- ASSIGN FORM ---
const AssignForm = ({ faultId, currentId, technicians, onAssign }) => {
  const [selected, setSelected] = useState(currentId || "");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selected) return;
    onAssign(faultId, selected);
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 min-w-[200px]">
      <select
        className="lc-input text-sm flex-1"
        value={selected}
        onChange={(e) => setSelected(e.target.value)}
        required
      >
        <option value="">Select Technician</option>
        {technicians.map((tech) => (
          <option key={tech._id} value={tech._id}>
            {tech.full_name}
          </option>
        ))}
      </select>
      <Button
        type="submit"
        className="bg-blue-500 hover:bg-blue-600 text-xs py-1 px-2"
      >
        Assign
      </Button>
    </form>
  );
};

export default LabInchargeDashboard;
