import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import LogoutButton from '../components/ui/LogoutButton';

const TechnicianDashboard = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [assignedFaults, setAssignedFaults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lowStockCount, setLowStockCount] = useState(0);
  const [showRepairModal, setShowRepairModal] = useState(false);
  const [selectedFault, setSelectedFault] = useState(null);
  const [repairCost, setRepairCost] = useState('');
  const [technicianAmount, setTechnicianAmount] = useState('');
  const [repairDescription, setRepairDescription] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchAssignedFaults();
    fetchLowStock();
  }, []);

  const fetchAssignedFaults = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/faults");
      const allFaults = res.data.faults;
      const filtered = allFaults.filter(
        (fault) => fault.assignedTo?._id === user._id
      );
      setAssignedFaults(filtered);
    } catch (err) {
      console.error("❌ Error fetching faults:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (faultId, status, remarks) => {
    try {
      await axios.put(`http://localhost:5000/api/faults/status/${faultId}`, {
        status,
        remarks,
      });
      alert("✅ Status updated");
      fetchAssignedFaults(); // Refresh
    } catch (err) {
      console.error("❌ Failed to update status:", err);
      alert("Error updating fault status");
    }
  };

  const handleReceivedClick = (fault) => {
    setSelectedFault(fault);
    setShowRepairModal(true);
  };

  const handleRepairSubmit = async () => {
    if ((!repairCost && !technicianAmount) || !repairDescription) {
      alert("Please enter at least one amount (cost or technician) and description");
      return;
    }

    try {
      const repairDate = new Date();
      const equipmentName = selectedFault.equipmentId?.name || 'Unknown Equipment';
      
      // Update fault status to received with repair details
      await axios.put(`http://localhost:5000/api/faults/status/${selectedFault._id}`, {
        status: 'Received',
        remarks: repairDescription
      });

      // Send repair data to admin with correct field names matching the repair model
      await axios.post('http://localhost:5000/api/repairs', {
        componentName: equipmentName,
        description: repairDescription,
        dateSent: repairDate.toISOString(),
        cost: repairCost === '' ? 0 : parseFloat(repairCost),
        technicianAmount: technicianAmount === '' ? 0 : parseFloat(technicianAmount),
        status: 'received',
        dateReceived: repairDate.toISOString(),
        // Additional fields for analytics
        labName: selectedFault.labName,
        faultId: selectedFault._id,
        equipmentId: selectedFault.equipmentId?._id,
        technicianId: user._id,
        repairDate: repairDate.toISOString(),
        notes: `Repair completed by ${user.full_name || user.email} for ${equipmentName} in ${selectedFault.labName}`
      });

      alert("✅ Repair details saved and sent to admin");
      setShowRepairModal(false);
      setRepairCost('');
      setRepairDescription('');
      setTechnicianAmount('');
      setSelectedFault(null);
      fetchAssignedFaults();
    } catch (err) {
      console.error("❌ Failed to save repair details:", err);
      alert(err.response?.data?.error || "Error saving repair details");
    }
  };

  const fetchLowStock = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/inventory?lowStock=true");
      setLowStockCount(res.data?.count || (res.data?.data?.length ?? 0));
    } catch (e) {
      // ignore indicator errors
    }
  };

  const logout = () => { localStorage.clear(); navigate('/'); };

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-canvas to-neutral-100">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-ink">🔧 Technician Dashboard</h1>
            <p className="text-neutral-600 mt-1">Manage assigned faults and inventory</p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={() => navigate('/technician/inventory')}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              📦 Inventory
              {lowStockCount > 0 && (
                <span className="ml-2 inline-flex items-center justify-center px-2 py-0.5 text-xs font-semibold bg-yellow-200 text-yellow-900 rounded-full">
                  Low: {lowStockCount}
                </span>
              )}
            </Button>
            <Button
              onClick={() => navigate('/technician/repairs')}
              className="bg-blue-600 hover:bg-blue-700"
            >
              🔧 Repairs
            </Button>
            <LogoutButton />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <div className="text-center">
              <div className="text-3xl font-bold text-brand-600">{assignedFaults.length}</div>
              <div className="text-neutral-600">Assigned Faults</div>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-600">
                {assignedFaults.filter(f => f.status === 'in_progress').length}
              </div>
              <div className="text-neutral-600">In Progress</div>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {assignedFaults.filter(f => f.status === 'Resolved').length}
              </div>
              <div className="text-neutral-600">Resolved</div>
            </div>
          </Card>
        </div>

        {/* Faults Table */}
        <Card>
          <h3 className="text-xl font-semibold text-ink mb-4">🎯 Assigned Faults</h3>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600 mx-auto"></div>
              <p className="text-neutral-600 mt-2">Loading faults...</p>
            </div>
          ) : assignedFaults.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="text-lg font-semibold text-ink mb-2">No faults assigned</h3>
              <p className="text-neutral-600">You're all caught up! New faults will appear here when assigned.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-neutral-100 text-neutral-700">
                  <tr>
                    <th className="p-3 text-left">Equipment</th>
                    <th className="p-3 text-left">Lab</th>
                    <th className="p-3 text-left">Reported By</th>
                    <th className="p-3 text-left">Status</th>
                    <th className="p-3 text-left">Remarks</th>
                    <th className="p-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  {assignedFaults.map((fault) => (
                    <tr key={fault._id} className="hover:bg-neutral-50">
                      <td className="p-3 font-medium">{fault.equipmentId?.name || "N/A"}</td>
                      <td className="p-3 text-neutral-600">{fault.labName}</td>
                      <td className="p-3 text-neutral-600">{fault.reportedBy?.full_name || "Unknown"}</td>
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
                      <td className="p-3 text-neutral-600">{fault.remarks || "—"}</td>
                      <td className="p-3">
                        <StatusUpdateForm 
                          fault={fault} 
                          onUpdate={handleStatusUpdate} 
                          onReceivedClick={handleReceivedClick}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {/* Repair Cost Modal */}
        {showRepairModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-md">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-ink">Repair Details</h3>
                <Button 
                  variant="ghost" 
                  onClick={() => {
                    setShowRepairModal(false);
                    setRepairCost('');
                    setRepairDescription('');
                    setSelectedFault(null);
                  }}
                  className="text-neutral-500 hover:text-neutral-700"
                >
                  ✕
                </Button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="lc-label">Equipment</label>
                  <p className="text-sm text-neutral-600">
                    {selectedFault?.equipmentId?.name || 'N/A'} - {selectedFault?.labName}
                  </p>
                </div>
                
                <div>
                  <label className="lc-label">Repair Cost (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={repairCost}
                    onChange={(e) => setRepairCost(e.target.value)}
                    className="lc-input"
                    placeholder="Enter repair cost"
                    required
                  />
                </div>
                <div>
                  <label className="lc-label">Technician Amount (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={technicianAmount}
                    onChange={(e) => setTechnicianAmount(e.target.value)}
                    className="lc-input"
                    placeholder="Enter labor amount"
                  />
                </div>
                
                <div>
                  <label className="lc-label">Repair Description</label>
                  <textarea
                    value={repairDescription}
                    onChange={(e) => setRepairDescription(e.target.value)}
                    className="lc-input min-h-[100px] resize-none"
                    placeholder="Describe what was repaired..."
                    required
                  />
                </div>
                
                <div className="flex gap-3">
                  <Button
                    onClick={handleRepairSubmit}
                    className="flex-1"
                  >
                    Save & Send to Admin
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setShowRepairModal(false);
                      setRepairCost('');
                      setRepairDescription('');
                      setSelectedFault(null);
                    }}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

const StatusUpdateForm = ({ fault, onUpdate, onReceivedClick }) => {
  const [status, setStatus] = useState(fault.status);
  const [remarks, setRemarks] = useState(fault.remarks || "");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!status) return alert("Please select a status");
    onUpdate(fault._id, status, remarks);
  };

  return (
    <div className="space-y-2 min-w-[200px]">
      <form onSubmit={handleSubmit} className="space-y-2">
        <select
          className="lc-input text-sm"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          required
        >
          <option value="in_progress">In Progress</option>
          <option value="Resolved">Resolved</option>
        </select>
        <input
          className="lc-input text-sm"
          placeholder="Add remarks..."
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
        />
        <Button
          type="submit"
          className="w-full text-sm py-2"
        >
          Update
        </Button>
      </form>
      
      {status === "Resolved" && (
        <Button
          onClick={() => onReceivedClick(fault)}
          className="w-full text-sm py-2 bg-green-600 hover:bg-green-700"
        >
          Mark as Received
        </Button>
      )}
    </div>
  );
};

export default TechnicianDashboard;