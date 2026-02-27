import { useEffect, useState } from "react";
import axios from "axios";
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import LogoutButton from '../components/ui/LogoutButton';

const LabAnalyticsDashboard = () => {
  const [faultStatus, setFaultStatus] = useState({});
  const [labFaults, setLabFaults] = useState([]);
  const [equipmentCondition, setEquipmentCondition] = useState({});
  const [technicianWorkload, setTechnicianWorkload] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const [
          faultStatusRes,
          labFaultsRes,
          equipmentConditionRes,
          technicianWorkloadRes
        ] = await Promise.all([
          axios.get("http://localhost:5000/api/analytics/fault-status"),
          axios.get("http://localhost:5000/api/analytics/lab-faults"),
          axios.get("http://localhost:5000/api/analytics/equipment-condition"),
          axios.get("http://localhost:5000/api/analytics/technician-workload"),
        ]);

        // Convert fault status array to object
        const statusMap = {};
        faultStatusRes.data.statusCount.forEach(item => {
          statusMap[item._id?.toLowerCase() || "unknown"] = item.count;
        });

        // Convert equipment condition to object
        const conditionMap = {};
        equipmentConditionRes.data.equipmentCondition.forEach(item => {
          conditionMap[item._id] = item.count;
        });

        setFaultStatus(statusMap);
        setLabFaults(labFaultsRes.data.labFaults);
        setEquipmentCondition(conditionMap);
        setTechnicianWorkload(technicianWorkloadRes.data.technicianWorkload);
        setLoading(false);
      } catch (err) {
        console.error("❌ Failed to fetch analytics:", err);
      }
    };

    fetchAnalytics();
  }, []);

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-canvas to-neutral-100">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-ink">📊 Lab Analytics Dashboard</h1>
            <p className="text-neutral-600 mt-1">Comprehensive insights into lab operations and performance</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={() => window.location.reload()}>
              Refresh Data
            </Button>
            <LogoutButton />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600 mx-auto"></div>
            <p className="text-neutral-600 mt-4 text-lg">Loading analytics...</p>
          </div>
        ) : (
          <>
            {/* Fault Status Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {["pending", "in_progress", "resolved"].map((status) => (
                <Card key={status}>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-brand-600 mb-2">
                      {faultStatus[status] || 0}
                    </div>
                    <div className="text-neutral-600 capitalize text-lg">
                      {status.replace("_", " ")} Faults
                    </div>
                    <div className="mt-2 text-sm text-neutral-500">
                      {status === 'pending' && 'Awaiting assignment'}
                      {status === 'in_progress' && 'Currently being worked on'}
                      {status === 'resolved' && 'Successfully completed'}
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Lab-wise Faults */}
            <Card>
              <h3 className="text-xl font-semibold text-ink mb-4">🏢 Lab-wise Fault Distribution</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-neutral-100 text-neutral-700">
                    <tr>
                      <th className="p-3 text-left">Lab</th>
                      <th className="p-3 text-left">Total Faults</th>
                      <th className="p-3 text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200">
                    {labFaults.map((lab) => (
                      <tr key={lab._id} className="hover:bg-neutral-50">
                        <td className="p-3 font-medium">{lab._id}</td>
                        <td className="p-3 text-2xl font-bold text-brand-600">{lab.count}</td>
                        <td className="p-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            lab.count > 10 ? 'bg-red-100 text-red-700' :
                            lab.count > 5 ? 'bg-yellow-100 text-yellow-700' :
                            'bg-green-100 text-green-700'
                          }`}>
                            {lab.count > 10 ? 'High' : lab.count > 5 ? 'Medium' : 'Low'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            {/* Equipment Condition
            <Card>
              <h3 className="text-xl font-semibold text-ink mb-4">🔍 Equipment Condition Overview</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {["Good", "Moderate", "Faulty"].map((cond) => (
                  <div key={cond} className="text-center">
                    <div className={`text-4xl font-bold mb-2 ${
                      cond === 'Good' ? 'text-green-600' :
                      cond === 'Moderate' ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {equipmentCondition[cond] || 0}
                    </div>
                    <div className="text-neutral-600 text-lg">{cond} Condition</div>
                    <div className="mt-2 text-sm text-neutral-500">
                      {cond === 'Good' && 'Fully functional equipment'}
                      {cond === 'Moderate' && 'Requires maintenance soon'}
                      {cond === 'Faulty' && 'Needs immediate attention'}
                    </div>
                  </div>
                ))}
              </div>
            </Card> */}

            {/* Technician Workload */}
            <Card>
              <h3 className="text-xl font-semibold text-ink mb-4">👨‍🔧 Technician Workload Distribution</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-neutral-100 text-neutral-700">
                    <tr>
                      <th className="p-3 text-left">Technician</th>
                      <th className="p-3 text-left">Assigned Faults</th>
                      <th className="p-3 text-left">Workload Level</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200">
                    {technicianWorkload.map((tech, idx) => (
                      <tr key={idx} className="hover:bg-neutral-50">
                        <td className="p-3 font-medium">{tech.technicianName}</td>
                        <td className="p-3 text-2xl font-bold text-brand-600">{tech.totalFaults}</td>
                        <td className="p-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            tech.totalFaults > 8 ? 'bg-red-100 text-red-700' :
                            tech.totalFaults > 4 ? 'bg-yellow-100 text-yellow-700' :
                            'bg-green-100 text-green-700'
                          }`}>
                            {tech.totalFaults > 8 ? 'High' : tech.totalFaults > 4 ? 'Medium' : 'Low'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

export default LabAnalyticsDashboard;
