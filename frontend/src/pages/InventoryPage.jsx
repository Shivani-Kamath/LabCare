import { useEffect, useState } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import LogoutButton from '../components/ui/LogoutButton';

const API_BASE = 'http://localhost:5000/api';

const InventoryPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const lowStockItems = items.filter(i => i.isLowStock || (i.quantity ?? 0) <= (i.minThreshold ?? 5));

  const fetchItems = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await fetch(`${API_BASE}/inventory`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to load inventory');
      setItems(json.data || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchItems(); }, []);

  const updateQty = async (id, action) => {
    await fetch(`${API_BASE}/inventory/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, quantity: 1 })
    });
    fetchItems();
  };

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-canvas to-neutral-100">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-ink">🧪 Inventory</h2>
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={fetchItems}>Refresh</Button>
            <LogoutButton />
          </div>
        </div>
        <Card>
        {lowStockItems.length > 0 && (
          <div className="mb-4 rounded-lg border border-yellow-300 bg-yellow-50 text-yellow-800 p-3">
            ⚠ Low stock for: {lowStockItems.map(i => i.name).join(', ')}
          </div>
        )}
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : (
          <table className="w-full table-auto text-sm">
            <thead className="bg-neutral-100 text-neutral-700">
              <tr>
                <th className="p-2 text-left">Name</th>
                <th className="p-2 text-left">Category</th>
                <th className="p-2 text-left">Quantity</th>
                <th className="p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {items.map(item => (
                <tr key={item._id}>
                  <td className="p-2">{item.name}</td>
                  <td className="p-2">{item.category}</td>
                  <td className="p-2">{item.quantity}</td>
                  <td className="p-2 space-x-2">
                    <Button variant="ghost" onClick={() => updateQty(item._id, 'remove')} className="px-3 py-1">-1</Button>
                    <Button onClick={() => updateQty(item._id, 'add')} className="px-3 py-1">+1</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        </Card>
      </div>
    </div>
  );
};

export default InventoryPage;