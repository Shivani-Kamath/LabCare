import { useEffect, useState } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import LogoutButton from '../components/ui/LogoutButton';

const API_BASE = 'http://localhost:5000/api';

const RepairsPage = () => {
  const [repairs, setRepairs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const today = new Date().toISOString().slice(0, 10);
  const [form, setForm] = useState({ componentName: '', dateSent: today, description: '', repairShop: '', labName: '' });
  const [filters, setFilters] = useState({ component: 'all', from: '', to: '' });
  const [componentsList, setComponentsList] = useState([]);
  const [receiveModal, setReceiveModal] = useState({ open: false, id: null, cost: '', technicianAmount: '', notes: '' });

  const fetchRepairs = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await fetch(`${API_BASE}/repairs`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to load repairs');
      setRepairs(json.data || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRepairs();
    fetchComponents();
  }, []);

  const openReceive = (id) => setReceiveModal({ open: true, id, cost: '', technicianAmount: '', notes: '' });
  const submitReceive = async () => {
    const payload = {
      cost: receiveModal.cost === '' ? undefined : Number(receiveModal.cost),
      technicianAmount: receiveModal.technicianAmount === '' ? undefined : Number(receiveModal.technicianAmount),
      notes: receiveModal.notes || undefined
    };
    await fetch(`${API_BASE}/repairs/${receiveModal.id}/receive`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    setReceiveModal({ open: false, id: null, cost: '', technicianAmount: '', notes: '' });
    fetchRepairs();
  };

  const createRepair = async (e) => {
    e.preventDefault();
    const res = await fetch(`${API_BASE}/repairs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        dateSent: form.dateSent || new Date().toISOString()
      })
    });
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      alert(j.error || 'Failed to create repair');
      return;
    }
    setForm({ componentName: '', dateSent: today, description: '', repairShop: '', labName: '' });
    fetchRepairs();
  };

  const uniqueComponents = Array.from(new Set(repairs.map(r => r.componentName))).sort();
  const filteredRepairs = repairs.filter(r => {
    const compOk = filters.component === 'all' || r.componentName === filters.component;
    const sent = new Date(r.dateSent);
    const fromOk = !filters.from || sent >= new Date(filters.from);
    const toOk = !filters.to || sent <= new Date(filters.to);
    return compOk && fromOk && toOk;
  });

  const fetchComponents = async () => {
    try {
      const res = await fetch(`${API_BASE}/inventory`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to load components');
      const names = (json.data || []).map(i => i.name).filter(Boolean).sort();
      setComponentsList(names);
    } catch (e) {
      // leave list empty on error
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-canvas to-neutral-100">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-ink">🔧 Repairs Management</h1>
            <p className="text-neutral-600 mt-1">Track and manage component repairs</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={fetchRepairs}>
              Refresh
            </Button>
            <LogoutButton />
          </div>
        </div>

        {/* Filters */}
        <Card>
          <h3 className="text-lg font-semibold text-ink mb-4">🔍 Filters</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="lc-label">Component</label>
              <select
                className="lc-input"
                value={filters.component}
                onChange={e => setFilters({ ...filters, component: e.target.value })}
              >
                <option value="all">All components</option>
                {uniqueComponents.map(name => (
                  <option key={name} value={name}>{name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="lc-label">From Date</label>
              <input
                type="date"
                className="lc-input"
                value={filters.from}
                onChange={e => setFilters({ ...filters, from: e.target.value })}
              />
            </div>
            <div>
              <label className="lc-label">To Date</label>
              <input
                type="date"
                className="lc-input"
                value={filters.to}
                onChange={e => setFilters({ ...filters, to: e.target.value })}
              />
            </div>
            <div className="flex items-end">
              <Button
                onClick={() => setFilters({ component: 'all', from: '', to: '' })}
                variant="ghost"
                className="w-full"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </Card>

        {/* Create Repair Form */}
        <Card>
          <h3 className="text-lg font-semibold text-ink mb-4">➕ Create New Repair</h3>
          <form onSubmit={createRepair} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div>
                <label className="lc-label">Component</label>
                <select
                  className="lc-input"
                  value={form.componentName}
                  onChange={e => setForm({ ...form, componentName: e.target.value })}
                  required
                >
                  <option value="" disabled>Select component</option>
                  {componentsList.map(name => (
                    <option key={name} value={name}>{name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="lc-label">Date Sent</label>
                <input type="date" className="lc-input" value={form.dateSent} readOnly />
              </div>
              <div>
                <label className="lc-label">Repair Shop</label>
                <input 
                  className="lc-input" 
                  placeholder="Enter repair shop name" 
                  value={form.repairShop} 
                  onChange={e => setForm({ ...form, repairShop: e.target.value })} 
                  required 
                />
              </div>
              <div>
                <label className="lc-label">Lab Name</label>
                <input
                  className="lc-input"
                  placeholder="e.g., CS Lab 1"
                  value={form.labName}
                  onChange={e => setForm({ ...form, labName: e.target.value })}
                  required
                />
              </div>
              <div className="flex items-end">
                <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                  Create Repair
                </Button>
              </div>
            </div>
            <div>
              <label className="lc-label">Description</label>
              <textarea 
                className="lc-input" 
                placeholder="Enter repair description (min 10 chars)" 
                value={form.description} 
                onChange={e => setForm({ ...form, description: e.target.value })} 
                required 
                rows={3}
              />
            </div>
          </form>
        </Card>

        {/* Repairs Table */}
        <Card>
          <h3 className="text-lg font-semibold text-ink mb-4">📋 Repairs List</h3>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600 mx-auto"></div>
              <p className="text-neutral-600 mt-2">Loading repairs...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <div className="text-red-600 text-lg">❌ {error}</div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-neutral-100 text-neutral-700">
                  <tr>
                    <th className="p-3 text-left">Component</th>
                    <th className="p-3 text-left">Status</th>
                    <th className="p-3 text-left">Repair Shop</th>
                    <th className="p-3 text-left">Date Sent</th>
                    <th className="p-3 text-left">Description</th>
                    <th className="p-3 text-left">Tech Amt (₹)</th>
                    <th className="p-3 text-left">Cost (₹)</th>
                    <th className="p-3 text-left">Total (₹)</th>
                    <th className="p-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  {filteredRepairs.map(r => (
                    <tr key={r._id} className="hover:bg-neutral-50">
                      <td className="p-3 font-medium">{r.componentName}</td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          r.status === 'received' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {r.status}
                        </span>
                      </td>
                      <td className="p-3 text-neutral-600">{r.repairShop}</td>
                      <td className="p-3 text-neutral-600">{new Date(r.dateSent).toLocaleDateString()}</td>
                      <td className="p-3 text-neutral-600 max-w-xs truncate">{r.description}</td>
                      <td className="p-3 text-neutral-600">{(r.technicianAmount || 0).toLocaleString()}</td>
                      <td className="p-3 text-neutral-600">{(r.cost || 0).toLocaleString()}</td>
                      <td className="p-3 font-semibold">{(((r.technicianAmount||0) + (r.cost||0)) || 0).toLocaleString()}</td>
                      <td className="p-3">
                        {r.status !== 'received' && (
                          <Button 
                            onClick={() => openReceive(r._id)} 
                            className="bg-blue-600 hover:bg-blue-700 text-xs py-1 px-2"
                          >
                            Mark Received
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredRepairs.length === 0 && (
                <div className="text-center py-8 text-neutral-500">
                  No repairs found
                </div>
              )}
            </div>
          )}
        </Card>

        {/* Receive Modal */}
        {receiveModal.open && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-ink">Enter Repair Amounts</h3>
                <button onClick={() => setReceiveModal({ open: false, id: null, cost: '', technicianAmount: '', notes: '' })} className="text-neutral-600 hover:text-ink">✕</button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="lc-label">Parts/Component Cost (₹)</label>
                  <input type="number" min="0" step="0.01" className="lc-input" value={receiveModal.cost} onChange={e=>setReceiveModal({ ...receiveModal, cost: e.target.value })} placeholder="0" />
                </div>
                <div>
                  <label className="lc-label">Technician Labor Amount (₹)</label>
                  <input type="number" min="0" step="0.01" className="lc-input" value={receiveModal.technicianAmount} onChange={e=>setReceiveModal({ ...receiveModal, technicianAmount: e.target.value })} placeholder="0" />
                </div>
                <div>
                  <label className="lc-label">Notes (optional)</label>
                  <textarea className="lc-input" rows={3} value={receiveModal.notes} onChange={e=>setReceiveModal({ ...receiveModal, notes: e.target.value })} />
                </div>
                <div className="flex gap-3">
                  <Button onClick={submitReceive} className="flex-1">Save</Button>
                  <Button variant="ghost" onClick={() => setReceiveModal({ open: false, id: null, cost: '', technicianAmount: '', notes: '' })} className="flex-1">Cancel</Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RepairsPage;