import { useEffect, useState } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import LogoutButton from '../components/ui/LogoutButton';

const API = 'http://localhost:5000/api';

const AdminDashboard = () => {
  const [tab, setTab] = useState('students');
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ full_name: '', email: '', role: 'student', password: '' });
  const [range, setRange] = useState({ startUSN: '', endUSN: '', defaultPassword: 'batch1' });
  const [repairData, setRepairData] = useState([]);
  const [dateRange, setDateRange] = useState({ startDate: '', endDate: '' });
  const [analyticsData, setAnalyticsData] = useState({ labWise: [], totalCost: 0 });

  const load = async (role) => {
    const res = await fetch(`${API}/users?role=${role}`);
    const j = await res.json();
    setUsers(j.users || []);
  };

  useEffect(() => { 
    load(tab === 'students' ? 'student' : tab === 'technicians' ? 'technician' : 'lab_incharge'); 
    if (tab === 'analytics') {
      loadRepairData();
    }
  }, [tab]);

  const loadRepairData = async () => {
    try {
      const res = await fetch(`${API}/repairs`);
      const data = await res.json();
      const repairs = data.data || data.repairs || data || [];
      setRepairData(repairs);
      
      // Calculate lab-wise costs
      const labWise = {};
      let totalCost = 0;
      
      // Filter by date range if provided
      let filteredRepairs = repairs;
      if (dateRange.startDate || dateRange.endDate) {
        filteredRepairs = repairs.filter(repair => {
          const repairDate = new Date(repair.dateSent || repair.repairDate || repair.createdAt);
          const startOk = !dateRange.startDate || repairDate >= new Date(dateRange.startDate);
          const endOk = !dateRange.endDate || repairDate <= new Date(dateRange.endDate + 'T23:59:59');
          return startOk && endOk;
        });
      }
      
      filteredRepairs.forEach(repair => {
        const lab = repair.labName || 'Unknown';
        const cost = (repair.cost || 0) + (repair.technicianAmount || 0);
        if (!labWise[lab]) {
          labWise[lab] = { lab, count: 0, cost: 0 };
        }
        labWise[lab].count++;
        labWise[lab].cost += cost;
        totalCost += cost;
      });
      
      setAnalyticsData({
        labWise: Object.values(labWise),
        totalCost
      });
    } catch (err) {
      console.error('Failed to load repair data:', err);
    }
  };

  const addUser = async (roleOverride) => {
    const body = { ...form, role: roleOverride || form.role };
    const res = await fetch(`${API}/admin/users`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    if (res.ok) load(tab === 'students' ? 'student' : tab === 'technicians' ? 'technician' : 'lab_incharge');
  };
  const delUser = async (id) => {
    await fetch(`${API}/admin/users/${id}`, { method: 'DELETE' });
    load(tab === 'students' ? 'student' : tab === 'technicians' ? 'technician' : 'lab_incharge');
  };
  const bulk = async () => {
    await fetch(`${API}/admin/students/bulk`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(range) });
    load('student');
  };
  const archiveOrDelete = async (action) => {
    await fetch(`${API}/admin/students/archive-or-delete`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...range, action }) });
    load('student');
  };
  const exportToCSV = () => {
    const csvContent = [
      ['Lab', 'Repair Count', 'Total Cost (₹)'],
      ...analyticsData.labWise.map(item => [item.lab, item.count, item.cost.toFixed(2)]),
      ['TOTAL', analyticsData.labWise.reduce((sum, item) => sum + item.count, 0), analyticsData.totalCost.toFixed(2)]
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `repair-analytics-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const exportToPDF = () => {
    // Simple PDF generation using window.print
    const printWindow = window.open('', '_blank');
    const content = `
      <html>
        <head><title>Repair Analytics Report</title></head>
        <body>
          <h1>Lab Repair Analytics Report</h1>
          <h2>Generated on: ${new Date().toLocaleDateString()}</h2>
          <table border="1" style="width:100%; border-collapse: collapse;">
            <tr><th>Lab</th><th>Repair Count</th><th>Total Cost (₹)</th></tr>
            ${analyticsData.labWise.map(item => 
              `<tr><td>${item.lab}</td><td>${item.count}</td><td>${item.cost}</td></tr>`
            ).join('')}
            <tr><td><strong>TOTAL</strong></td><td></td><td><strong>${analyticsData.totalCost}</strong></td></tr>
          </table>
        </body>
      </html>
    `;
    printWindow.document.write(content);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-canvas to-neutral-100">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-ink">👑 Admin Dashboard</h1>
            <p className="text-neutral-600 mt-1">Manage users and system settings</p>
          </div>
          <LogoutButton />
        </div>

        {/* Tab Navigation */}
        <Card className="p-0">
          <div className="flex border-b border-neutral-200">
            {[
              { id: 'students', label: 'Students', icon: '🎓' },
              { id: 'technicians', label: 'Technicians', icon: '🔧' },
              { id: 'staff', label: 'Lab Staff', icon: '👨‍🏫' },
              { id: 'analytics', label: 'Analytics', icon: '📊' }
            ].map(tabItem => (
              <button
                key={tabItem.id}
                onClick={() => setTab(tabItem.id)}
                className={`flex-1 px-6 py-4 text-left font-medium transition-colors ${
                  tab === tabItem.id
                    ? 'text-brand-600 border-b-2 border-brand-600 bg-brand-50'
                    : 'text-neutral-600 hover:text-ink hover:bg-neutral-50'
                }`}
              >
                <span className="mr-2">{tabItem.icon}</span>
                {tabItem.label}
              </button>
            ))}
          </div>
        </Card>

        {/* Content */}
        {tab === 'students' && (
          <div className="space-y-6">
            <Card>
              <h3 className="text-xl font-semibold text-ink mb-4">📚 Student Management</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="lc-label">Start USN</label>
                  <input 
                    className="lc-input" 
                    placeholder="e.g., 1MS21CS001" 
                    value={range.startUSN} 
                    onChange={e=>setRange({...range,startUSN:e.target.value})} 
                  />
                </div>
                <div>
                  <label className="lc-label">End USN</label>
                  <input 
                    className="lc-input" 
                    placeholder="e.g., 1MS21CS100" 
                    value={range.endUSN} 
                    onChange={e=>setRange({...range,endUSN:e.target.value})} 
                  />
                </div>
                <div>
                  <label className="lc-label">Default Password</label>
                  <input 
                    className="lc-input" 
                    placeholder="Default password" 
                    value={range.defaultPassword} 
                    onChange={e=>setRange({...range,defaultPassword:e.target.value})} 
                  />
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button onClick={bulk} className="bg-green-600 hover:bg-green-700">
                  Create Students
                </Button>
                <Button onClick={()=>archiveOrDelete('archive')} variant="ghost" className="text-yellow-600 hover:text-yellow-700">
                  Archive Range
                </Button>
                <Button onClick={()=>archiveOrDelete('delete')} variant="ghost" className="text-red-600 hover:text-red-700">
                  Delete Range
                </Button>
              </div>
            </Card>
            <UserList users={users} onDelete={delUser} />
          </div>
        )}

        {tab === 'technicians' && (
          <div className="space-y-6">
            <Card>
              <h3 className="text-xl font-semibold text-ink mb-4">🔧 Technician Management</h3>
              <UserForm form={form} setForm={setForm} role="technician" defaultPassword="technician" onAdd={addUser} />
            </Card>
            <UserList users={users} onDelete={delUser} />
          </div>
        )}

        {tab === 'staff' && (
          <div className="space-y-6">
            <Card>
              <h3 className="text-xl font-semibold text-ink mb-4">👨‍🏫 Lab Staff Management</h3>
              <UserForm form={form} setForm={setForm} role="lab_incharge" defaultPassword="labstaff" onAdd={addUser} />
            </Card>
            <UserList users={users} onDelete={delUser} />
          </div>
        )}

        {tab === 'analytics' && (
          <div className="space-y-6">
            <Card>
              <h3 className="text-xl font-semibold text-ink mb-4">📊 Repair Analytics</h3>
              
              {/* Date Range Filter */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="lc-label">Start Date</label>
                  <input 
                    type="date"
                    className="lc-input" 
                    value={dateRange.startDate} 
                    onChange={e => setDateRange({...dateRange, startDate: e.target.value})} 
                  />
                </div>
                <div>
                  <label className="lc-label">End Date</label>
                  <input 
                    type="date"
                    className="lc-input" 
                    value={dateRange.endDate} 
                    onChange={e => setDateRange({...dateRange, endDate: e.target.value})} 
                  />
                </div>
                <div className="flex items-end">
                  <Button onClick={loadRepairData} className="w-full">
                    Apply Filter
                  </Button>
                </div>
              </div>

              {/* Export Buttons */}
              <div className="flex gap-3 mb-6">
                <Button onClick={exportToCSV} className="bg-green-600 hover:bg-green-700">
                  📄 Export CSV
                </Button>
                <Button onClick={exportToPDF} className="bg-red-600 hover:bg-red-700">
                  📄 Export PDF
                </Button>
              </div>

              {/* Total Cost Summary */}
              <div className="bg-brand-50 p-4 rounded-lg mb-6">
                <h4 className="text-lg font-semibold text-ink mb-2">College-wide Repair Cost Summary</h4>
                <div className="text-3xl font-bold text-brand-600">₹{analyticsData.totalCost.toLocaleString()}</div>
                <p className="text-neutral-600">Total repair costs across all labs</p>
              </div>

              {/* Lab-wise Report */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-neutral-100 text-neutral-700">
                    <tr>
                      <th className="p-3 text-left">Lab</th>
                      <th className="p-3 text-left">Repair Count</th>
                      <th className="p-3 text-left">Total Cost (₹)</th>
                      <th className="p-3 text-left">Average Cost (₹)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200">
                    {analyticsData.labWise.map((item, index) => (
                      <tr key={index} className="hover:bg-neutral-50">
                        <td className="p-3 font-medium">{item.lab}</td>
                        <td className="p-3 text-neutral-600">{item.count}</td>
                        <td className="p-3 font-semibold text-brand-600">₹{item.cost.toLocaleString()}</td>
                        <td className="p-3 text-neutral-600">₹{item.count > 0 ? (item.cost / item.count).toFixed(2) : '0'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {analyticsData.labWise.length === 0 && (
                  <div className="text-center py-8 text-neutral-500">
                    No repair data available
                  </div>
                )}
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

const UserForm = ({ form, setForm, role, defaultPassword, onAdd }) => (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
    <div>
      <label className="lc-label">Full Name</label>
      <input 
        className="lc-input" 
        placeholder="Enter full name" 
        value={form.full_name} 
        onChange={e=>setForm({...form,full_name:e.target.value})} 
      />
    </div>
    <div>
      <label className="lc-label">Email {role === 'technician' && '(Required)'}</label>
      <input 
        className="lc-input" 
        placeholder="Enter email" 
        value={form.email} 
        onChange={e=>setForm({...form,email:e.target.value})} 
      />
    </div>
    <div>
      <label className="lc-label">Password</label>
      <input 
        className="lc-input" 
        placeholder="Enter password" 
        value={form.password} 
        onChange={e=>setForm({...form,password:e.target.value||defaultPassword})} 
      />
    </div>
    <div>
      <Button onClick={()=>onAdd(role)} className="w-full">
        Add {role === 'lab_incharge' ? 'Lab Staff' : role}
      </Button>
    </div>
  </div>
);

const UserList = ({ users, onDelete }) => (
  <Card>
    <h3 className="text-lg font-semibold text-ink mb-4">👥 User List</h3>
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-neutral-100 text-neutral-700">
          <tr>
            <th className="p-3 text-left">Name</th>
            <th className="p-3 text-left">Email</th>
            <th className="p-3 text-left">Role</th>
            <th className="p-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-200">
          {users.map(u => (
            <tr key={u._id} className="hover:bg-neutral-50">
              <td className="p-3 font-medium">{u.full_name}</td>
              <td className="p-3 text-neutral-600">{u.email || '—'}</td>
              <td className="p-3">
                <span className="px-2 py-1 bg-brand-100 text-brand-700 rounded-full text-xs font-medium">
                  {u.role}
                </span>
              </td>
              <td className="p-3">
                <Button 
                  variant="ghost" 
                  onClick={()=>onDelete(u._id)} 
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {users.length === 0 && (
        <div className="text-center py-8 text-neutral-500">
          No users found
        </div>
      )}
    </div>
  </Card>
);

export default AdminDashboard;


