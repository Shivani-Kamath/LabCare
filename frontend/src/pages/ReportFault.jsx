import React, { useState, useEffect } from "react";
import axios from "axios";

const ReportFault = () => {
  const [equipment, setEquipment] = useState([]);
  const [selectedEquipment, setSelectedEquipment] = useState("");
  const [issueDescription, setIssueDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Fetch equipment list
  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/equipment");
        setEquipment(res.data);
      } catch (err) {
        console.error("Error fetching equipment", err);
      }
    };
    fetchEquipment();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedEquipment || !issueDescription) {
      setMessage("Please select equipment and describe the issue.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const token = localStorage.getItem("token"); // Student must be logged in

      const res = await axios.post(
        "http://localhost:5000/api/faults",
        {
          equipmentId: selectedEquipment, // ✅ Correct MongoDB ObjectId
          issueDescription,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage("✅ Fault reported successfully!");
      setSelectedEquipment("");
      setIssueDescription("");
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to report fault.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-2xl">
      <h2 className="text-xl font-bold mb-4">Report a Fault</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Equipment Dropdown */}
        <div>
          <label className="block mb-1 font-medium">Select Equipment</label>
          <select
            value={selectedEquipment}
            onChange={(e) => setSelectedEquipment(e.target.value)}
            className="w-full border p-2 rounded-lg"
          >
            <option value="">🔧 Select Equipment</option>
            {equipment.map((eq) => (
              <option key={eq._id} value={eq._id}>
                {eq.name} ({eq.labName})
              </option>
            ))}
          </select>
        </div>

        {/* Issue Description */}
        <div>
          <label className="block mb-1 font-medium">Issue Description</label>
          <textarea
            value={issueDescription}
            onChange={(e) => setIssueDescription(e.target.value)}
            className="w-full border p-2 rounded-lg"
            rows="3"
            placeholder="Describe the issue here..."
          ></textarea>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-red-600 text-white p-2 rounded-lg hover:bg-red-700"
        >
          {loading ? "Reporting..." : "🚨 Report Fault"}
        </button>
      </form>

      {message && (
        <p className="mt-4 text-center font-medium text-gray-700">{message}</p>
      )}
    </div>
  );
};

export default ReportFault;
