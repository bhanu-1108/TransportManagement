import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, Wrench, AlertTriangle } from 'lucide-react';
import DataTable from '../components/tables/DataTable';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import { maintenanceAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { formatDate, formatCurrency } from '../utils/helpers';
import { MAINTENANCE_TYPES } from '../utils/constants';
import { dummyVehicles } from '../utils/dummy';
import toast from 'react-hot-toast';

const emptyForm = {
  vehicleId: '', type: 'Oil Change', description: '',
  cost: '', date: new Date().toISOString().split('T')[0],
  vendor: '', status: 'In Progress', nextServiceKm: '',
};

const Maintenance = () => {
  const { canCreate, canEdit, canDelete } = useAuth();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    maintenanceAPI.getAll().then(data => { setRecords(data); setLoading(false); });
  }, []);

  const openCreate = () => { setSelected(null); setForm(emptyForm); setModalOpen(true); };
  const openEdit = (r) => { setSelected(r); setForm({ ...r }); setModalOpen(true); };

  const handleSave = async () => {
    if (!form.vehicleId || !form.type) {
      toast.error('Vehicle and type are required'); return;
    }
    setSaving(true);
    try {
      const vehicle = dummyVehicles.find(v => v.id === form.vehicleId);
      const enriched = { ...form, vehicle: vehicle?.regNumber || '', cost: Number(form.cost) };
      if (selected) {
        await maintenanceAPI.update(selected.id, enriched);
        setRecords(r => r.map(x => x.id === selected.id ? { ...x, ...enriched } : x));
        toast.success('Record updated');
      } else {
        const created = await maintenanceAPI.create(enriched);
        const newRecord = { ...enriched, id: created.id || `MNT${Date.now()}` };
        setRecords(r => [newRecord, ...r]);
        toast.success('Maintenance record added. Vehicle status set to In Shop.');
      }
      setModalOpen(false);
    } catch { toast.error('Something went wrong'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (rec) => {
    if (!confirm('Delete this maintenance record?')) return;
    await maintenanceAPI.delete(rec.id);
    setRecords(r => r.filter(x => x.id !== rec.id));
    toast.success('Record deleted');
  };

  const columns = [
    {
      key: 'id', label: 'Record ID',
      render: v => <span className="font-mono text-xs font-semibold" style={{ color: '#875A7B' }}>{v}</span>
    },
    {
      key: 'vehicle', label: 'Vehicle',
      render: v => <span className="font-mono text-xs">{v}</span>
    },
    { key: 'type', label: 'Type', render: v => <span className="badge-on-trip">{v}</span> },
    {
      key: 'description', label: 'Description',
      render: v => <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{v}</span>
    },
    {
      key: 'cost', label: 'Cost',
      render: v => <span className="text-xs font-medium">{formatCurrency(v)}</span>
    },
    { key: 'date', label: 'Date', render: v => <span className="text-xs">{formatDate(v)}</span> },
    { key: 'vendor', label: 'Vendor', render: v => <span className="text-xs">{v}</span> },
    {
      key: 'status', label: 'Status',
      render: v => (
        <span className={v === 'Completed' ? 'badge-available' : 'badge-in-shop'}>{v}</span>
      )
    },
    {
      key: 'actions', label: 'Actions', sortable: false,
      render: (_, row) => (
        <div className="flex items-center gap-1">
          {canEdit('maintenance') && (
            <motion.button whileHover={{ scale: 1.1 }} onClick={() => openEdit(row)} className="p-1.5 btn-ghost rounded-lg">
              <Edit2 size={13} style={{ color: '#875A7B' }} />
            </motion.button>
          )}
          {canDelete('maintenance') && (
            <motion.button whileHover={{ scale: 1.1 }} onClick={() => handleDelete(row)} className="p-1.5 btn-ghost rounded-lg">
              <Trash2 size={13} className="text-red-500" />
            </motion.button>
          )}
        </div>
      )
    },
  ];

  const inProgress = records.filter(r => r.status === 'In Progress');
  const completed = records.filter(r => r.status === 'Completed');
  const totalCost = records.reduce((sum, r) => sum + (r.cost || 0), 0);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Maintenance</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>{records.length} maintenance records</p>
        </div>
        {canCreate('maintenance') && (
          <Button variant="primary" icon={Plus} onClick={openCreate}>Add Record</Button>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {[
          { label: 'In Progress', value: inProgress.length, color: '#F59E0B' },
          { label: 'Completed', value: completed.length, color: '#22C55E' },
          { label: 'Total Cost', value: formatCurrency(totalCost), color: '#875A7B' },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }} className="card p-4">
            <div className="text-xl font-bold" style={{ color: s.color }}>{s.value}</div>
            <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{s.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Info Banner */}
      {inProgress.length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="card p-4 border-l-4 flex items-start gap-3"
          style={{ borderLeftColor: '#F59E0B' }}>
          <AlertTriangle size={15} style={{ color: '#F59E0B', marginTop: 1 }} />
          <div>
            <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
              {inProgress.length} vehicle{inProgress.length > 1 ? 's' : ''} currently in maintenance
            </p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
              These vehicles are temporarily removed from the active fleet pool.
            </p>
          </div>
        </motion.div>
      )}

      <DataTable
        data={records} columns={columns} loading={loading}
        searchKeys={['vehicle', 'type', 'vendor', 'description']}
        searchPlaceholder="Search maintenance records..."
        filters={[
          { key: 'type', label: 'Type', options: MAINTENANCE_TYPES.map(t => ({ label: t, value: t })) },
          { key: 'status', label: 'Status', options: [{ label: 'In Progress', value: 'In Progress' }, { label: 'Completed', value: 'Completed' }] },
        ]}
        emptyMessage="No maintenance records found."
      />

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}
        title={selected ? 'Edit Maintenance Record' : 'Add Maintenance Record'} size="lg">
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
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Maintenance Type *</label>
              <select className="input" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
                {MAINTENANCE_TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Status</label>
              <select className="input" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                <option>In Progress</option>
                <option>Completed</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Cost (₹)</label>
              <input type="number" className="input" placeholder="15000" value={form.cost}
                onChange={e => setForm(f => ({ ...f, cost: e.target.value }))} />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Date</label>
              <input type="date" className="input" value={form.date}
                onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Vendor / Workshop</label>
              <input className="input" placeholder="Tata Authorized Service" value={form.vendor}
                onChange={e => setForm(f => ({ ...f, vendor: e.target.value }))} />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Next Service (km)</label>
              <input type="number" className="input" placeholder="70000" value={form.nextServiceKm}
                onChange={e => setForm(f => ({ ...f, nextServiceKm: e.target.value }))} />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Description</label>
              <textarea className="input resize-none" rows={3} value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                placeholder="Describe the maintenance work..." />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2 border-t" style={{ borderColor: 'var(--border-color)' }}>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleSave} loading={saving}>
              {selected ? 'Save Changes' : 'Add Record'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Maintenance;
