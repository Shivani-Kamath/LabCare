import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import LogoutButton from "../components/ui/LogoutButton";

const StudentDashboard = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const navigate = useNavigate();

  const [equipmentList, setEquipmentList] = useState([]);
  const [equipmentInLab, setEquipmentInLab] = useState([]);
  const [selectedLabNum, setSelectedLabNum] = useState("");
  const [selectedEquipment, setSelectedEquipment] = useState("");
  const [description, setDescription] = useState("");
  const [myFaults, setMyFaults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchEquipment();
    fetchMyFaults();
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        setSelectedEquipment("");
        if (!selectedLabNum) { 
          setEquipmentInLab([]); 
          return; 
        }
        const labKey = `lab${selectedLabNum}`.toLowerCase();
        const res = await axios.get(`http://localhost:5000/api/equipment/lab/${labKey}`);
        const list = res.data.equipment || res.data || [];
        setEquipmentInLab(list);
      } catch {
        setEquipmentInLab([]);
      }
    };
    load();
  }, [selectedLabNum]);

  const fetchEquipment = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/equipment");
      const equipmentArray = res.data.equipment || res.data;
      setEquipmentList(equipmentArray);
    } catch (err) {
      console.error("❌ Equipment fetch failed:", err);
    }
  };

  const fetchMyFaults = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/faults");
      const allFaults = res.data.faults || res.data;
      const studentFaults = allFaults.filter(
        (fault) => fault.reportedBy?._id === user._id
      );
      setMyFaults(studentFaults);
    } catch (err) {
      console.error("❌ Failed to fetch faults:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const reportingEquipmentId = selectedEquipment;
    const reportingLabName = selectedLabNum ? `Lab${selectedLabNum}` : "";
    
    if (!reportingEquipmentId || !description || !reportingLabName || !user?._id) {
      alert("⚠️ Please fill all fields and ensure you're logged in");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        equipmentId: reportingEquipmentId,
        reportedBy: user._id,
        labName: reportingLabName,
        issueDescription: description,
      };
      console.log("Submitting fault:", payload);
      await axios.post("http://localhost:5000/api/faults", payload);
      alert("✅ Fault reported successfully");
      setDescription("");
      setSelectedEquipment("");
      fetchMyFaults();
    } catch (err) {
      console.error("❌ Fault report error:", err);
      alert("❌ Failed to report fault");
    } finally {
      setLoading(false);
    }
  };

  const totalFaults = myFaults.length;
  const resolvedFaults = myFaults.filter(f => f.status === "Resolved").length;
  const pendingFaults = myFaults.filter(f => f.status !== "Resolved").length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-neutral-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-4xl font-bold text-ink mb-2">🎓 Student Dashboard</h1>
            <p className="text-lg text-neutral-600">Welcome back, <span className="font-semibold text-brand-600">{user.full_name || 'Student'}</span>!</p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <Button 
              onClick={() => navigate("/student/chatbot")}
              className="bg-purple-600 hover:bg-purple-700 shadow-md"
            >
              💬 Chat with Bot
            </Button>
            <LogoutButton />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700 mb-1">Total Reports</p>
                <p className="text-3xl font-bold text-blue-900">{totalFaults}</p>
              </div>
              <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center">
                <span className="text-2xl">📋</span>
              </div>
            </div>
          </Card>
          <Card className="p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-700 mb-1">Pending</p>
                <p className="text-3xl font-bold text-yellow-900">{pendingFaults}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-200 rounded-full flex items-center justify-center">
                <span className="text-2xl">⏳</span>
              </div>
            </div>
          </Card>
          <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700 mb-1">Resolved</p>
                <p className="text-3xl font-bold text-green-900">{resolvedFaults}</p>
              </div>
              <div className="w-12 h-12 bg-green-200 rounded-full flex items-center justify-center">
                <span className="text-2xl">✅</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Fault Reporting Form */}
        <Card className="p-6 md:p-8 shadow-lg border-2 border-brand-100">
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-xl">🚨</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-ink">Report Equipment Fault</h2>
                <p className="text-neutral-600">Report any issues you encounter with lab equipment</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="lc-label flex items-center gap-2">
                  <span className="text-lg">🏢</span>
                  Select Lab
                </label>
                <select
                  className="lc-input mt-1"
                  value={selectedLabNum}
                  onChange={(e) => setSelectedLabNum(e.target.value)}
                >
                  <option value="">Choose Lab</option>
                  <option value="1">Lab 1</option>
                  <option value="2">Lab 2</option>
                  <option value="3">Lab 3</option>
                  <option value="4">Lab 4</option>
                  <option value="5">Lab 5</option>
                </select>
              </div>

              <div>
                <label className="lc-label flex items-center gap-2">
                  <span className="text-lg">🔧</span>
                  Equipment ID
                </label>
                <select
                  className="lc-input mt-1"
                  value={selectedEquipment}
                  onChange={(e) => setSelectedEquipment(e.target.value)}
                  required
                >
                  <option value="">Select Equipment</option>
                  {equipmentInLab.map((eq) => (
                    <option key={eq._id} value={eq._id}>
                      {eq.name} ({eq.equipmentId})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="lc-label flex items-center gap-2">
                <span className="text-lg">📝</span>
                Issue Description
              </label>
              <textarea
                className="lc-input mt-1 min-h-[140px] resize-none"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Please describe the issue in detail. Include what happened, when it occurred, and any error messages you saw..."
                required
              />
            </div>

            <div className="flex justify-end pt-2">
              <Button 
                type="submit" 
                disabled={loading}
                className="px-8 py-3 bg-red-600 hover:bg-red-700 shadow-md text-lg"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin">⏳</span>
                    Reporting...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    🚨 Report Fault
                  </span>
                )}
              </Button>
            </div>
          </form>
        </Card>

        {/* My Reported Faults */}
        <Card className="p-6 md:p-8 shadow-lg">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-brand-100 rounded-full flex items-center justify-center">
                  <span className="text-xl">📊</span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-ink">My Reported Faults</h2>
                  <p className="text-neutral-600">Track the status of your reported issues</p>
                </div>
              </div>
              {totalFaults > 0 && (
                <span className="px-4 py-2 bg-brand-100 text-brand-700 rounded-full text-sm font-semibold">
                  {totalFaults} {totalFaults === 1 ? 'Report' : 'Reports'}
                </span>
              )}
            </div>
          </div>

          <div className="space-y-4">
            {myFaults.length > 0 ? (
              myFaults.map((fault) => (
                <div 
                  key={fault._id} 
                  className="border-2 border-neutral-200 rounded-xl p-5 bg-white hover:shadow-md transition-shadow duration-200 hover:border-brand-200"
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-lg font-semibold text-ink">
                          {fault.equipmentId?.name || `Equipment #${fault.equipmentId}`}
                        </h4>
                        <span className="px-2 py-1 bg-neutral-100 text-neutral-600 rounded-full text-xs font-medium">
                          {fault.labName}
                        </span>
                      </div>
                      <p className="text-neutral-700 mb-3 leading-relaxed">{fault.issueDescription}</p>
                      <div className="flex flex-wrap gap-4 text-sm text-neutral-600">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Assigned to:</span>
                          <span className={fault.assignedTo?.full_name ? "text-brand-600 font-semibold" : "text-neutral-400"}>
                            {fault.assignedTo?.full_name || "Not Assigned"}
                          </span>
                        </div>
                        {fault.remarks && (
                          <div className="flex items-center gap-2">
                            <span className="font-medium">Remarks:</span>
                            <span className="text-neutral-700">{fault.remarks}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      <span
                        className={`px-4 py-2 rounded-full text-sm font-semibold inline-block ${
                          fault.status === "Resolved"
                            ? "bg-green-100 text-green-800 border-2 border-green-200"
                            : fault.status === "In Progress"
                            ? "bg-yellow-100 text-yellow-800 border-2 border-yellow-200"
                            : "bg-red-100 text-red-800 border-2 border-red-200"
                        }`}
                      >
                        {fault.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-16 text-neutral-500">
                <div className="w-24 h-24 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-12 h-12 text-neutral-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p className="text-lg font-medium text-neutral-600 mb-2">No faults reported yet</p>
                <p className="text-sm">Report an issue using the form above to see it here</p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default StudentDashboard;
