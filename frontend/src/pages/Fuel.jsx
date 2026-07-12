import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, Fuel } from 'lucide-react';
import DataTable from '../components/tables/DataTable';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import { fuelAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { formatDate, formatCurrency, formatNumber } from '../utils/helpers';
import { dummyVehicles } from '../utils/dummy';
import toast from 'react-hot-toast';

const emptyForm = {
  vehicleId: '', date: new Date().toISOString().split('T')[0],
  liters: '', costPerLiter: '', odometer: '', station: '', tripId: '',
};

const FuelPage = () => {
  const { canCreate, canEdit, canDelete } = useAuth();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fuelAPI.getAll().then(d => { setLogs(d); setLoading(false); });
  }, []);

  const openCreate = () => { setSelected(null); setForm(emptyForm); setModalOpen(true); };
  const openEdit = (r) => { setSelected(r); setForm({ ...r }); setModalOpen(true); };

  const handleSave = async () => {
    if (!form.vehicleId || !form.liters || !form.costPerLiter) {
      toast.error('Vehicle, liters and cost per liter are required'); return;
    }
    setSaving(true);
    try {
      const vehicle = dummyVehicles.find(v => v.id === form.vehicleId);
      const totalCost = Number(form.liters) * Number(form.costPerLiter);
      const enriched = {
        ...form,
        vehicle: vehicle?.regNumber || '',
        liters: Number(form.liters),
        costPerLiter: Number(form.costPerLiter),
        totalCost: Math.round(totalCost),
        odometer: Number(form.odometer),
      };
      if (selected) {
        await fuelAPI.update(selected.id, enriched);
        setLogs(l => l.map(x => x.id === selected.id ? { ...x, ...enriched } : x));
        toast.success('Fuel log updated');
      } else {
        const created = await fuelAPI.create(enriched);
        setLogs(l => [{ ...enriched, id: created.id || `FL${Date.now()}` }, ...l]);
        toast.success('Fuel log added');
      }
      setModalOpen(false);
    } catch { toast.error('Something went wrong'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (log) => {
    if (!confirm('Delete this fuel log?')) return;
    await fuelAPI.delete(log.id);
    setLogs(l => l.filter(x => x.id !== log.id));
    toast.success('Log deleted');
  };

  const totalFuel = logs.reduce((s, l) => s + (l.liters || 0), 0);
  const totalCost = logs.reduce((s, l) => s + (l.totalCost || 0), 0);
  const avgCPL = logs.length > 0 ? logs.reduce((s, l) => s + (l.costPerLiter || 0), 0) / logs.length : 0;

  const columns = [
    { key: 'id', label: 'Log ID', render: v => <span className="font-mono text-xs font-semibold" style={{ color: '#875A7B' }}>{v}</span> },
    { key: 'vehicle', label: 'Vehicle', render: v => <span className="font-mono text-xs">{v}</span> },
    { key: 'date', label: 'Date', render: v => <span className="text-xs">{formatDate(v)}</span> },
    { key: 'liters', label: 'Liters', render: v => <span className="text-xs font-semibold">{v}L</span> },
    { key: 'costPerLiter', label: '₹/Liter', render: v => <span className="text-xs">₹{v}</span> },
    { key: 'totalCost', label: 'Total Cost', render: v => <span className="text-xs font-medium" style={{ color: '#875A7B' }}>{formatCurrency(v)}</span> },
    { key: 'odometer', label: 'Odometer', render: v => <span className="text-xs">{formatNumber(v)} km</span> },
    { key: 'station', label: 'Fuel Station', render: v => <span className="text-xs">{v}</span> },
    {
      key: 'actions', label: 'Actions', sortable: false,
      render: (_, row) => (
        <div className="flex items-center gap-1">
          {canEdit('fuel') && <motion.button whileHover={{ scale: 1.1 }} onClick={() => openEdit(row)} className="p-1.5 btn-ghost rounded-lg">
            <Edit2 size={13} style={{ color: '#875A7B' }} />
          </motion.button>}
          {canDelete('fuel') && <motion.button whileHover={{ scale: 1.1 }} onClick={() => handleDelete(row)} className="p-1.5 btn-ghost rounded-lg">
            <Trash2 size={13} className="text-red-500" />
          </motion.button>}
        </div>
      )
    },
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Fuel Logs</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>{logs.length} fuel entries</p>
        </div>
        {canCreate('fuel') && <Button variant="primary" icon={Plus} onClick={openCreate}>Add Fuel Log</Button>}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {[
          { label: 'Total Fuel', value: `${formatNumber(Math.round(totalFuel))} L`, color: '#3B82F6' },
          { label: 'Total Cost', value: formatCurrency(totalCost), color: '#875A7B' },
          { label: 'Avg ₹/Liter', value: `₹${avgCPL.toFixed(2)}`, color: '#22C55E' },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }} className="card p-4">
            <div className="text-xl font-bold" style={{ color: s.color }}>{s.value}</div>
            <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{s.label}</div>
          </motion.div>
        ))}
      </div>

      <DataTable
        data={logs} columns={columns} loading={loading}
        searchKeys={['vehicle', 'station', 'id']}
        searchPlaceholder="Search fuel logs..."
        emptyMessage="No fuel logs found."
      />

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}
        title={selected ? 'Edit Fuel Log' : 'Add Fuel Log'}>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Vehicle *</label>
              <select className="input" value={form.vehicleId} onChange={e => setForm(f => ({ ...f, vehicleId: e.target.value }))}>
                <option value="">Select vehicle...</option>
                {dummyVehicles.map(v => <option key={v.id} value={v.id}>{v.regNumber} — {v.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Date</label>
              <input type="date" className="input" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Liters *</label>
              <input type="number" className="input" placeholder="120" value={form.liters}
                onChange={e => setForm(f => ({ ...f, liters: e.target.value }))} />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Cost/Liter (₹) *</label>
              <input type="number" step="0.1" className="input" placeholder="92.5" value={form.costPerLiter}
                onChange={e => setForm(f => ({ ...f, costPerLiter: e.target.value }))} />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Odometer (km)</label>
              <input type="number" className="input" placeholder="45000" value={form.odometer}
                onChange={e => setForm(f => ({ ...f, odometer: e.target.value }))} />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Fuel Station</label>
              <input className="input" placeholder="HPCL Mumbai" value={form.station}
                onChange={e => setForm(f => ({ ...f, station: e.target.value }))} />
            </div>
            {form.liters && form.costPerLiter && (
              <div className="col-span-2 p-3 rounded-xl" style={{ background: 'var(--bg-surface-2)' }}>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Calculated Total Cost</p>
                <p className="text-lg font-bold mt-0.5" style={{ color: '#875A7B' }}>
                  {formatCurrency(Number(form.liters) * Number(form.costPerLiter))}
                </p>
              </div>
            )}
          </div>
          <div className="flex justify-end gap-3 pt-2 border-t" style={{ borderColor: 'var(--border-color)' }}>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleSave} loading={saving}>
              {selected ? 'Save Changes' : 'Add Log'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default FuelPage;
