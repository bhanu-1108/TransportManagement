import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, Eye, AlertTriangle, Users } from 'lucide-react';
import DataTable from '../components/tables/DataTable';
import { StatusBadge, SafetyScoreBadge } from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import { driversAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { formatDate, isExpiringSoon, isExpired } from '../utils/helpers';
import { DRIVER_STATUS, LICENSE_CATEGORIES, REGIONS } from '../utils/constants';
import toast from 'react-hot-toast';

const emptyForm = {
  name: '', licenseNo: '', licenseCategory: 'C', licenseExpiry: '',
  contact: '', status: 'Available', safetyScore: 90, region: 'North',
  email: '', joiningDate: new Date().toISOString().split('T')[0],
};

const Drivers = () => {
  const { canCreate, canEdit, canDelete } = useAuth();
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      const data = await driversAPI.getAll();
      setDrivers(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => { setSelected(null); setForm(emptyForm); setModalOpen(true); };
  const openEdit = (d) => { setSelected(d); setForm({ ...d }); setModalOpen(true); };
  const openView = (d) => { setSelected(d); setViewModal(true); };

  const handleSave = async () => {
    if (!form.name || !form.licenseNo) {
      toast.error('Name and license number are required'); return;
    }
    setSaving(true);
    try {
      if (selected) {
        await driversAPI.update(selected.id, form);
        setDrivers(d => d.map(x => x.id === selected.id ? { ...x, ...form } : x));
        toast.success('Driver updated');
      } else {
        const created = await driversAPI.create(form);
        setDrivers(d => [{ ...form, id: created.id || `D${Date.now()}`, trips: 0 }, ...d]);
        toast.success('Driver added');
      }
      setModalOpen(false);
    } catch { toast.error('Something went wrong'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (driver) => {
    if (!confirm(`Remove ${driver.name}?`)) return;
    await driversAPI.delete(driver.id);
    setDrivers(d => d.filter(x => x.id !== driver.id));
    toast.success('Driver removed');
  };

  const columns = [
    {
      key: 'name', label: 'Driver',
      render: (val, row) => (
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #875A7B, #714B67)' }}>
            {val.split(' ').map(n => n[0]).join('').slice(0, 2)}
          </div>
          <div>
            <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{val}</div>
            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{row.email}</div>
          </div>
        </div>
      )
    },
    { key: 'licenseNo', label: 'License No.', render: (val) => <span className="font-mono text-xs">{val}</span> },
    { key: 'licenseCategory', label: 'Category', render: (val) => <span className="badge-on-trip">{val}</span> },
    {
      key: 'licenseExpiry', label: 'License Expiry',
      render: (val) => {
        const expired = isExpired(val);
        const expiring = isExpiringSoon(val);
        return (
          <div className="flex items-center gap-1.5">
            <span className="text-xs" style={{
              color: expired ? '#EF4444' : expiring ? '#F59E0B' : 'var(--text-secondary)'
            }}>
              {formatDate(val)}
            </span>
            {(expired || expiring) && (
              <AlertTriangle size={11} style={{ color: expired ? '#EF4444' : '#F59E0B' }} />
            )}
          </div>
        );
      }
    },
    { key: 'status', label: 'Status', render: (val) => <StatusBadge status={val} /> },
    { key: 'safetyScore', label: 'Safety Score', render: (val) => <SafetyScoreBadge score={val} /> },
    { key: 'trips', label: 'Trips', render: (val) => <span className="text-xs font-semibold">{val}</span> },
    { key: 'region', label: 'Region' },
    {
      key: 'actions', label: 'Actions', sortable: false,
      render: (_, row) => (
        <div className="flex items-center gap-1">
          <motion.button whileHover={{ scale: 1.1 }} onClick={() => openView(row)} className="p-1.5 rounded-lg btn-ghost">
            <Eye size={13} />
          </motion.button>
          {canEdit('drivers') && (
            <motion.button whileHover={{ scale: 1.1 }} onClick={() => openEdit(row)} className="p-1.5 rounded-lg btn-ghost">
              <Edit2 size={13} style={{ color: '#875A7B' }} />
            </motion.button>
          )}
          {canDelete('drivers') && (
            <motion.button whileHover={{ scale: 1.1 }} onClick={() => handleDelete(row)} className="p-1.5 rounded-lg btn-ghost">
              <Trash2 size={13} className="text-red-500" />
            </motion.button>
          )}
        </div>
      )
    },
  ];

  const expiryWarnings = drivers.filter(d => isExpiringSoon(d.licenseExpiry, 60) || isExpired(d.licenseExpiry));

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Driver Management</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>{drivers.length} drivers in system</p>
        </div>
        {canCreate('drivers') && (
          <Button variant="primary" icon={Plus} onClick={openCreate}>Add Driver</Button>
        )}
      </div>

      {/* Status Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {Object.values(DRIVER_STATUS).map((s, i) => {
          const count = drivers.filter(d => d.status === s).length;
          const colors = { Available: '#22C55E', 'On Trip': '#3B82F6', 'Off Duty': '#6b7280', Suspended: '#EF4444' };
          return (
            <motion.div key={s} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }} className="card p-4">
              <div className="text-2xl font-bold" style={{ color: colors[s] }}>{count}</div>
              <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{s}</div>
            </motion.div>
          );
        })}
      </div>

      {/* License Expiry Alerts */}
      {expiryWarnings.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          className="card p-4 border-l-4" style={{ borderLeftColor: '#F59E0B' }}>
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle size={14} style={{ color: '#F59E0B' }} />
            <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
              License Expiry Alerts ({expiryWarnings.length})
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {expiryWarnings.map(d => (
              <span key={d.id} className={`badge ${isExpired(d.licenseExpiry) ? 'badge-retired' : 'badge-in-shop'}`}>
                {d.name} — {formatDate(d.licenseExpiry)}
              </span>
            ))}
          </div>
        </motion.div>
      )}

      <DataTable
        data={drivers} columns={columns} loading={loading}
        searchKeys={['name', 'licenseNo', 'email', 'region']}
        searchPlaceholder="Search drivers..."
        filters={[
          { key: 'status', label: 'Status', options: Object.values(DRIVER_STATUS).map(s => ({ label: s, value: s })) },
          { key: 'licenseCategory', label: 'License', options: LICENSE_CATEGORIES.map(c => ({ label: c, value: c })) },
          { key: 'region', label: 'Region', options: REGIONS.map(r => ({ label: r, value: r })) },
        ]}
        emptyMessage="No drivers found."
      />

      {/* Add/Edit Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}
        title={selected ? 'Edit Driver' : 'Add New Driver'} size="lg">
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Full Name *', key: 'name', placeholder: 'Rajesh Sharma' },
              { label: 'Email', key: 'email', placeholder: 'driver@transitops.in' },
              { label: 'License Number *', key: 'licenseNo', placeholder: 'MH-01-2021-1234' },
              { label: 'Contact', key: 'contact', placeholder: '+91-9876543210' },
            ].map(f => (
              <div key={f.key}>
                <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>{f.label}</label>
                <input className="input" placeholder={f.placeholder} value={form[f.key] || ''}
                  onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} />
              </div>
            ))}
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>License Category</label>
              <select className="input" value={form.licenseCategory}
                onChange={e => setForm(p => ({ ...p, licenseCategory: e.target.value }))}>
                {LICENSE_CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>License Expiry</label>
              <input type="date" className="input" value={form.licenseExpiry}
                onChange={e => setForm(p => ({ ...p, licenseExpiry: e.target.value }))} />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Status</label>
              <select className="input" value={form.status}
                onChange={e => setForm(p => ({ ...p, status: e.target.value }))}>
                {Object.values(DRIVER_STATUS).map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Safety Score (0-100)</label>
              <input type="number" min="0" max="100" className="input" value={form.safetyScore}
                onChange={e => setForm(p => ({ ...p, safetyScore: Number(e.target.value) }))} />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Region</label>
              <select className="input" value={form.region} onChange={e => setForm(p => ({ ...p, region: e.target.value }))}>
                {REGIONS.map(r => <option key={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Joining Date</label>
              <input type="date" className="input" value={form.joiningDate}
                onChange={e => setForm(p => ({ ...p, joiningDate: e.target.value }))} />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2 border-t" style={{ borderColor: 'var(--border-color)' }}>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleSave} loading={saving}>
              {selected ? 'Save Changes' : 'Add Driver'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* View Modal */}
      <Modal isOpen={viewModal} onClose={() => setViewModal(false)} title="Driver Profile">
        {selected && (
          <div className="p-6 space-y-4">
            <div className="flex items-center gap-4 pb-4 border-b" style={{ borderColor: 'var(--border-color)' }}>
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-bold text-white"
                style={{ background: 'linear-gradient(135deg, #875A7B, #714B67)' }}>
                {selected.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
              <div>
                <div className="font-semibold text-lg" style={{ color: 'var(--text-primary)' }}>{selected.name}</div>
                <div className="text-sm" style={{ color: 'var(--text-muted)' }}>{selected.email}</div>
                <div className="flex items-center gap-2 mt-1.5">
                  <StatusBadge status={selected.status} />
                  <SafetyScoreBadge score={selected.safetyScore} />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'License No.', value: selected.licenseNo },
                { label: 'Category', value: selected.licenseCategory },
                { label: 'License Expiry', value: formatDate(selected.licenseExpiry) },
                { label: 'Contact', value: selected.contact },
                { label: 'Region', value: selected.region },
                { label: 'Total Trips', value: selected.trips },
                { label: 'Joining Date', value: formatDate(selected.joiningDate) },
                { label: 'Safety Score', value: `${selected.safetyScore}/100` },
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

export default Drivers;
