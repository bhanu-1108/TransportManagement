import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, ChevronRight, Route } from 'lucide-react';
import DataTable from '../components/tables/DataTable';
import { StatusBadge } from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import { tripsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { formatDate, formatCurrency, formatNumber } from '../utils/helpers';
import { TRIP_STATUS, VEHICLE_TYPES, REGIONS } from '../utils/constants';
import { dummyVehicles, dummyDrivers } from '../utils/dummy';
import toast from 'react-hot-toast';

const TRIP_FLOW = ['Draft', 'Dispatched', 'Completed', 'Cancelled'];

const emptyForm = {
  source: '', destination: '', vehicleId: '', driverId: '',
  cargoWeight: '', distance: '', plannedDate: '', revenue: '', notes: '',
};

const Trips = () => {
  const { canCreate, canEdit, canDelete, user } = useAuth();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      const data = await tripsAPI.getAll();
      // Drivers only see their own trips
      const filtered = user?.role === 'driver'
        ? data.filter(t => t.driver === user?.name)
        : data;
      setTrips(filtered);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => { setSelected(null); setForm(emptyForm); setModalOpen(true); };
  const openEdit = (t) => { setSelected(t); setForm({ ...t }); setModalOpen(true); };

  const handleStatusChange = async (trip, newStatus) => {
    try {
      await tripsAPI.updateStatus(trip.id, newStatus);
      setTrips(prev => prev.map(t => t.id === trip.id ? { ...t, status: newStatus } : t));
      toast.success(`Trip ${newStatus.toLowerCase()}`);
    } catch { toast.error('Failed to update status'); }
  };

  const handleSave = async () => {
    if (!form.source || !form.destination || !form.vehicleId || !form.driverId) {
      toast.error('Source, destination, vehicle and driver are required'); return;
    }
    setSaving(true);
    try {
      const vehicle = dummyVehicles.find(v => v.id === form.vehicleId);
      const driver = dummyDrivers.find(d => d.id === form.driverId);
      const enriched = {
        ...form,
        vehicle: vehicle?.regNumber || '',
        driver: driver?.name || '',
        status: 'Draft',
        eta: 'Pending',
        cargoWeight: Number(form.cargoWeight),
        distance: Number(form.distance),
        revenue: Number(form.revenue),
      };
      if (selected) {
        await tripsAPI.update(selected.id, enriched);
        setTrips(t => t.map(x => x.id === selected.id ? { ...x, ...enriched } : x));
        toast.success('Trip updated');
      } else {
        const created = await tripsAPI.create(enriched);
        setTrips(t => [{ ...enriched, id: created.id || `TR${Date.now()}` }, ...t]);
        toast.success('Trip created');
      }
      setModalOpen(false);
    } catch { toast.error('Something went wrong'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (trip) => {
    if (!confirm(`Delete trip ${trip.id}?`)) return;
    await tripsAPI.delete(trip.id);
    setTrips(t => t.filter(x => x.id !== trip.id));
    toast.success('Trip deleted');
  };

  const nextStatus = (status) => {
    const idx = TRIP_FLOW.indexOf(status);
    return idx < 2 ? TRIP_FLOW[idx + 1] : null;
  };

  const availableVehicles = dummyVehicles.filter(v => v.status === 'Available');
  const availableDrivers = dummyDrivers.filter(d => d.status === 'Available');

  const columns = [
    {
      key: 'id', label: 'Trip ID',
      render: (val) => <span className="font-mono text-xs font-semibold" style={{ color: '#875A7B' }}>{val}</span>
    },
    {
      key: 'source', label: 'Route',
      render: (val, row) => (
        <div className="flex items-center gap-1.5 text-xs">
          <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{val}</span>
          <ChevronRight size={11} style={{ color: 'var(--text-muted)' }} />
          <span style={{ color: 'var(--text-secondary)' }}>{row.destination}</span>
        </div>
      )
    },
    { key: 'vehicle', label: 'Vehicle', render: v => <span className="font-mono text-xs">{v || '—'}</span> },
    { key: 'driver', label: 'Driver', render: v => <span className="text-xs">{v || '—'}</span> },
    {
      key: 'cargoWeight', label: 'Cargo',
      render: v => <span className="text-xs">{v ? `${formatNumber(v)} kg` : '—'}</span>
    },
    {
      key: 'distance', label: 'Distance',
      render: v => <span className="text-xs">{v ? `${v} km` : '—'}</span>
    },
    { key: 'status', label: 'Status', render: v => <StatusBadge status={v} /> },
    { key: 'plannedDate', label: 'Date', render: v => <span className="text-xs">{formatDate(v)}</span> },
    {
      key: 'revenue', label: 'Revenue',
      render: v => <span className="text-xs font-medium" style={{ color: '#22C55E' }}>{v ? formatCurrency(v) : '—'}</span>
    },
    {
      key: 'actions', label: 'Actions', sortable: false,
      render: (_, row) => (
        <div className="flex items-center gap-1">
          {nextStatus(row.status) && canEdit('trips') && nextStatus(row.status) !== 'Cancelled' && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleStatusChange(row, nextStatus(row.status))}
              className="px-2 py-1 rounded-lg text-xs font-medium text-white"
              style={{ background: 'linear-gradient(135deg, #875A7B, #714B67)' }}
            >
              → {nextStatus(row.status)}
            </motion.button>
          )}
          {row.status === 'Dispatched' && canEdit('trips') && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => handleStatusChange(row, 'Cancelled')}
              className="px-2 py-1 rounded-lg text-xs font-medium text-red-500 border"
              style={{ borderColor: 'rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.05)' }}
            >
              Cancel
            </motion.button>
          )}
          {row.status === 'Draft' && canEdit('trips') && (
            <motion.button whileHover={{ scale: 1.1 }} onClick={() => openEdit(row)} className="p-1.5 btn-ghost rounded-lg">
              <Edit2 size={13} style={{ color: '#875A7B' }} />
            </motion.button>
          )}
          {canDelete('trips') && (
            <motion.button whileHover={{ scale: 1.1 }} onClick={() => handleDelete(row)} className="p-1.5 btn-ghost rounded-lg">
              <Trash2 size={13} className="text-red-500" />
            </motion.button>
          )}
        </div>
      )
    },
  ];

  // Trip status summary
  const statusCounts = Object.values(TRIP_STATUS).map(s => ({
    status: s,
    count: trips.filter(t => t.status === s).length,
    colors: { Draft: '#6b7280', Dispatched: '#3B82F6', Completed: '#22C55E', Cancelled: '#EF4444' }[s],
  }));

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Trip Management</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>{trips.length} trips total</p>
        </div>
        {canCreate('trips') && (
          <Button variant="primary" icon={Plus} onClick={openCreate}>Create Trip</Button>
        )}
      </div>

      {/* Status Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {statusCounts.map((s, i) => (
          <motion.div key={s.status} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }} className="card p-4">
            <div className="text-2xl font-bold" style={{ color: s.colors }}>{s.count}</div>
            <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{s.status}</div>
          </motion.div>
        ))}
      </div>

      {/* Trip Lifecycle Info */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
        className="card p-4 flex items-center gap-3 overflow-x-auto">
        <span className="text-xs font-medium flex-shrink-0" style={{ color: 'var(--text-muted)' }}>
          Trip Lifecycle:
        </span>
        {TRIP_FLOW.map((s, i) => (
          <div key={s} className="flex items-center gap-2 flex-shrink-0">
            <StatusBadge status={s} />
            {i < TRIP_FLOW.length - 1 && <ChevronRight size={12} style={{ color: 'var(--text-muted)' }} />}
          </div>
        ))}
      </motion.div>

      <DataTable
        data={trips} columns={columns} loading={loading}
        searchKeys={['id', 'source', 'destination', 'vehicle', 'driver']}
        searchPlaceholder="Search trips..."
        filters={[
          { key: 'status', label: 'Status', options: Object.values(TRIP_STATUS).map(s => ({ label: s, value: s })) },
        ]}
        emptyMessage="No trips found. Create your first trip to get started."
      />

      {/* Create/Edit Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}
        title={selected ? 'Edit Trip' : 'Create New Trip'} size="lg">
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Source *</label>
              <input className="input" placeholder="Mumbai HQ" value={form.source}
                onChange={e => setForm(f => ({ ...f, source: e.target.value }))} />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Destination *</label>
              <input className="input" placeholder="Pune Depot" value={form.destination}
                onChange={e => setForm(f => ({ ...f, destination: e.target.value }))} />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Vehicle *</label>
              <select className="input" value={form.vehicleId} onChange={e => setForm(f => ({ ...f, vehicleId: e.target.value }))}>
                <option value="">Select vehicle...</option>
                {availableVehicles.map(v => (
                  <option key={v.id} value={v.id}>{v.regNumber} — {v.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Driver *</label>
              <select className="input" value={form.driverId} onChange={e => setForm(f => ({ ...f, driverId: e.target.value }))}>
                <option value="">Select driver...</option>
                {availableDrivers.map(d => (
                  <option key={d.id} value={d.id}>{d.name} (Score: {d.safetyScore})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Cargo Weight (kg)</label>
              <input type="number" className="input" placeholder="5000" value={form.cargoWeight}
                onChange={e => setForm(f => ({ ...f, cargoWeight: e.target.value }))} />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Distance (km)</label>
              <input type="number" className="input" placeholder="250" value={form.distance}
                onChange={e => setForm(f => ({ ...f, distance: e.target.value }))} />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Planned Date</label>
              <input type="date" className="input" value={form.plannedDate}
                onChange={e => setForm(f => ({ ...f, plannedDate: e.target.value }))} />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Revenue (₹)</label>
              <input type="number" className="input" placeholder="25000" value={form.revenue}
                onChange={e => setForm(f => ({ ...f, revenue: e.target.value }))} />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Notes</label>
              <textarea className="input resize-none" rows={2} placeholder="Additional notes..."
                value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2 border-t" style={{ borderColor: 'var(--border-color)' }}>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleSave} loading={saving}>
              {selected ? 'Save Changes' : 'Create Trip'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Trips;
