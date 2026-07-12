import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Truck, Edit2, Trash2, Eye } from 'lucide-react';
import DataTable from '../components/tables/DataTable';
import { StatusBadge } from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import { vehiclesAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { formatCurrency, formatNumber, formatDate } from '../utils/helpers';
import { VEHICLE_TYPES, VEHICLE_STATUS, REGIONS } from '../utils/constants';
import toast from 'react-hot-toast';

const emptyForm = {
  regNumber: '', name: '', type: 'Truck', status: 'Available',
  odometer: '', maxLoad: '', acquisitionCost: '', region: 'North',
  year: new Date().getFullYear(), fuelType: 'Diesel', lastService: '',
};

const Vehicles = () => {
  const { canCreate, canEdit, canDelete } = useAuth();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      const data = await vehiclesAPI.getAll();
      setVehicles(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setSelected(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (vehicle) => {
    setSelected(vehicle);
    setForm({ ...vehicle });
    setModalOpen(true);
  };

  const openView = (vehicle) => {
    setSelected(vehicle);
    setViewModal(true);
  };

  const handleSave = async () => {
    if (!form.regNumber || !form.name) {
      toast.error('Registration number and name are required');
      return;
    }
    setSaving(true);
    try {
      if (selected) {
        const updated = await vehiclesAPI.update(selected.id, form);
        setVehicles(v => v.map(x => x.id === selected.id ? { ...x, ...form } : x));
        toast.success('Vehicle updated successfully');
      } else {
        const created = await vehiclesAPI.create(form);
        setVehicles(v => [{ ...form, id: created.id || `V${Date.now()}` }, ...v]);
        toast.success('Vehicle added successfully');
      }
      setModalOpen(false);
    } catch {
      toast.error('Something went wrong');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (vehicle) => {
    if (!confirm(`Delete ${vehicle.regNumber}? This cannot be undone.`)) return;
    try {
      await vehiclesAPI.delete(vehicle.id);
      setVehicles(v => v.filter(x => x.id !== vehicle.id));
      toast.success('Vehicle removed');
    } catch {
      toast.error('Failed to delete vehicle');
    }
  };

  const columns = [
    {
      key: 'regNumber', label: 'Reg. Number',
      render: (val) => (
        <span className="font-mono text-xs font-semibold" style={{ color: '#875A7B' }}>{val}</span>
      )
    },
    { key: 'name', label: 'Vehicle Name' },
    { key: 'type', label: 'Type' },
    {
      key: 'status', label: 'Status',
      render: (val) => <StatusBadge status={val} />
    },
    {
      key: 'odometer', label: 'Odometer',
      render: (val) => <span className="text-xs">{formatNumber(val)} km</span>
    },
    {
      key: 'maxLoad', label: 'Max Load',
      render: (val) => <span className="text-xs">{formatNumber(val)} kg</span>
    },
    {
      key: 'acquisitionCost', label: 'Acq. Cost',
      render: (val) => <span className="text-xs">{formatCurrency(val)}</span>
    },
    { key: 'region', label: 'Region' },
    {
      key: 'actions', label: 'Actions', sortable: false,
      render: (_, row) => (
        <div className="flex items-center gap-1">
          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
            onClick={() => openView(row)} className="p-1.5 rounded-lg btn-ghost" title="View">
            <Eye size={13} />
          </motion.button>
          {canEdit('vehicles') && (
            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
              onClick={() => openEdit(row)} className="p-1.5 rounded-lg btn-ghost" title="Edit">
              <Edit2 size={13} style={{ color: '#875A7B' }} />
            </motion.button>
          )}
          {canDelete('vehicles') && (
            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
              onClick={() => handleDelete(row)} className="p-1.5 rounded-lg btn-ghost" title="Delete">
              <Trash2 size={13} className="text-red-500" />
            </motion.button>
          )}
        </div>
      )
    },
  ];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Vehicle Registry</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>
            {vehicles.length} vehicles in fleet
          </p>
        </div>
        {canCreate('vehicles') && (
          <Button variant="primary" icon={Plus} onClick={openCreate}>
            Add Vehicle
          </Button>
        )}
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {Object.values(VEHICLE_STATUS).map((status, i) => {
          const count = vehicles.filter(v => v.status === status).length;
          const colors = { Available: '#22C55E', 'On Trip': '#3B82F6', 'In Shop': '#F59E0B', Retired: '#EF4444' };
          return (
            <motion.div
              key={status}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="card p-4"
            >
              <div className="text-2xl font-bold" style={{ color: colors[status] }}>{count}</div>
              <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{status}</div>
            </motion.div>
          );
        })}
      </div>

      {/* Table */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <DataTable
          data={vehicles}
          columns={columns}
          loading={loading}
          searchKeys={['regNumber', 'name', 'type', 'region']}
          searchPlaceholder="Search vehicles..."
          filters={[
            { key: 'type', label: 'Type', options: VEHICLE_TYPES.map(t => ({ label: t, value: t })) },
            { key: 'status', label: 'Status', options: Object.values(VEHICLE_STATUS).map(s => ({ label: s, value: s })) },
            { key: 'region', label: 'Region', options: REGIONS.map(r => ({ label: r, value: r })) },
          ]}
          emptyMessage="No vehicles found. Add your first vehicle to get started."
        />
      </motion.div>

      {/* Add/Edit Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}
        title={selected ? 'Edit Vehicle' : 'Add New Vehicle'} size="lg">
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                Registration Number *
              </label>
              <input className="input" placeholder="MH-12-AB-1234"
                value={form.regNumber} onChange={e => setForm(f => ({ ...f, regNumber: e.target.value }))} />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                Vehicle Name / Model *
              </label>
              <input className="input" placeholder="Tata Ace Gold"
                value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Type</label>
              <select className="input" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
                {VEHICLE_TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Status</label>
              <select className="input" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                {Object.values(VEHICLE_STATUS).map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                Odometer (km)
              </label>
              <input className="input" type="number" placeholder="45000"
                value={form.odometer} onChange={e => setForm(f => ({ ...f, odometer: Number(e.target.value) }))} />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                Max Load (kg)
              </label>
              <input className="input" type="number" placeholder="5000"
                value={form.maxLoad} onChange={e => setForm(f => ({ ...f, maxLoad: Number(e.target.value) }))} />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                Acquisition Cost (₹)
              </label>
              <input className="input" type="number" placeholder="1500000"
                value={form.acquisitionCost} onChange={e => setForm(f => ({ ...f, acquisitionCost: Number(e.target.value) }))} />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Region</label>
              <select className="input" value={form.region} onChange={e => setForm(f => ({ ...f, region: e.target.value }))}>
                {REGIONS.map(r => <option key={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Year</label>
              <input className="input" type="number" placeholder="2022"
                value={form.year} onChange={e => setForm(f => ({ ...f, year: Number(e.target.value) }))} />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Fuel Type</label>
              <select className="input" value={form.fuelType} onChange={e => setForm(f => ({ ...f, fuelType: e.target.value }))}>
                {['Diesel', 'Petrol', 'CNG', 'Electric'].map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                Last Service Date
              </label>
              <input className="input" type="date" value={form.lastService}
                onChange={e => setForm(f => ({ ...f, lastService: e.target.value }))} />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2 border-t" style={{ borderColor: 'var(--border-color)' }}>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleSave} loading={saving}>
              {selected ? 'Save Changes' : 'Add Vehicle'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* View Modal */}
      <Modal isOpen={viewModal} onClose={() => setViewModal(false)} title="Vehicle Details">
        {selected && (
          <div className="p-6 space-y-4">
            <div className="flex items-center gap-4 pb-4 border-b" style={{ borderColor: 'var(--border-color)' }}>
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
                style={{ background: 'rgba(135,90,123,0.1)', border: '1px solid rgba(135,90,123,0.2)' }}>
                <Truck size={24} style={{ color: '#875A7B' }} />
              </div>
              <div>
                <div className="font-semibold text-base" style={{ color: 'var(--text-primary)' }}>{selected.name}</div>
                <div className="font-mono text-sm" style={{ color: '#875A7B' }}>{selected.regNumber}</div>
                <div className="mt-1"><StatusBadge status={selected.status} /></div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Type', value: selected.type },
                { label: 'Region', value: selected.region },
                { label: 'Year', value: selected.year },
                { label: 'Fuel Type', value: selected.fuelType },
                { label: 'Odometer', value: `${formatNumber(selected.odometer)} km` },
                { label: 'Max Load', value: `${formatNumber(selected.maxLoad)} kg` },
                { label: 'Acquisition Cost', value: formatCurrency(selected.acquisitionCost) },
                { label: 'Last Service', value: formatDate(selected.lastService) },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{label}</p>
                  <p className="text-sm font-medium mt-0.5" style={{ color: 'var(--text-primary)' }}>{value}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Vehicles;
