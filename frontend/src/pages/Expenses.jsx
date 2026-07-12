import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import DataTable from '../components/tables/DataTable';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import { expensesAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { formatDate, formatCurrency } from '../utils/helpers';
import { EXPENSE_CATEGORIES } from '../utils/constants';
import { dummyVehicles } from '../utils/dummy';
import toast from 'react-hot-toast';

const emptyForm = {
  vehicleId: '', category: 'Toll', description: '',
  amount: '', date: new Date().toISOString().split('T')[0], tripId: '',
};

const Expenses = () => {
  const { canCreate, canEdit, canDelete } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    expensesAPI.getAll().then(d => { setExpenses(d); setLoading(false); });
  }, []);

  const openCreate = () => { setSelected(null); setForm(emptyForm); setModalOpen(true); };
  const openEdit = (r) => { setSelected(r); setForm({ ...r }); setModalOpen(true); };

  const handleSave = async () => {
    if (!form.vehicleId || !form.amount) { toast.error('Vehicle and amount are required'); return; }
    setSaving(true);
    try {
      const vehicle = dummyVehicles.find(v => v.id === form.vehicleId);
      const enriched = { ...form, vehicle: vehicle?.regNumber || '', amount: Number(form.amount) };
      if (selected) {
        await expensesAPI.update(selected.id, enriched);
        setExpenses(e => e.map(x => x.id === selected.id ? { ...x, ...enriched } : x));
        toast.success('Expense updated');
      } else {
        const created = await expensesAPI.create(enriched);
        setExpenses(e => [{ ...enriched, id: created.id || `EXP${Date.now()}` }, ...e]);
        toast.success('Expense added');
      }
      setModalOpen(false);
    } catch { toast.error('Something went wrong'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (exp) => {
    if (!confirm('Delete this expense?')) return;
    await expensesAPI.delete(exp.id);
    setExpenses(e => e.filter(x => x.id !== exp.id));
    toast.success('Expense deleted');
  };

  const totalByCategory = EXPENSE_CATEGORIES.reduce((acc, cat) => {
    acc[cat] = expenses.filter(e => e.category === cat).reduce((s, e) => s + (e.amount || 0), 0);
    return acc;
  }, {});

  const categoryColors = {
    Toll: '#3B82F6', Maintenance: '#F59E0B', Miscellaneous: '#8B5CF6',
    Repairs: '#EF4444', Insurance: '#22C55E'
  };

  const columns = [
    { key: 'id', label: 'ID', render: v => <span className="font-mono text-xs font-semibold" style={{ color: '#875A7B' }}>{v}</span> },
    { key: 'vehicle', label: 'Vehicle', render: v => <span className="font-mono text-xs">{v}</span> },
    {
      key: 'category', label: 'Category',
      render: v => (
        <span className="badge" style={{ color: categoryColors[v], background: categoryColors[v] + '15', border: `1px solid ${categoryColors[v]}30` }}>
          {v}
        </span>
      )
    },
    { key: 'description', label: 'Description', render: v => <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{v}</span> },
    { key: 'amount', label: 'Amount', render: v => <span className="text-xs font-semibold" style={{ color: '#875A7B' }}>{formatCurrency(v)}</span> },
    { key: 'date', label: 'Date', render: v => <span className="text-xs">{formatDate(v)}</span> },
    { key: 'approvedBy', label: 'Approved By', render: v => <span className="text-xs">{v}</span> },
    {
      key: 'actions', label: 'Actions', sortable: false,
      render: (_, row) => (
        <div className="flex items-center gap-1">
          {canEdit('expenses') && <motion.button whileHover={{ scale: 1.1 }} onClick={() => openEdit(row)} className="p-1.5 btn-ghost rounded-lg">
            <Edit2 size={13} style={{ color: '#875A7B' }} />
          </motion.button>}
          {canDelete('expenses') && <motion.button whileHover={{ scale: 1.1 }} onClick={() => handleDelete(row)} className="p-1.5 btn-ghost rounded-lg">
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
          <h1 className="page-title">Expenses</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>{expenses.length} expense records</p>
        </div>
        {canCreate('expenses') && <Button variant="primary" icon={Plus} onClick={openCreate}>Add Expense</Button>}
      </div>

      {/* Category Breakdown */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {EXPENSE_CATEGORIES.map((cat, i) => (
          <motion.div key={cat} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }} className="card p-4">
            <div className="text-lg font-bold" style={{ color: categoryColors[cat] }}>
              {formatCurrency(totalByCategory[cat])}
            </div>
            <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{cat}</div>
          </motion.div>
        ))}
      </div>

      <DataTable
        data={expenses} columns={columns} loading={loading}
        searchKeys={['vehicle', 'description', 'category', 'approvedBy']}
        searchPlaceholder="Search expenses..."
        filters={[
          { key: 'category', label: 'Category', options: EXPENSE_CATEGORIES.map(c => ({ label: c, value: c })) },
        ]}
        emptyMessage="No expenses found."
      />

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}
        title={selected ? 'Edit Expense' : 'Add Expense'}>
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
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Category</label>
              <select className="input" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                {EXPENSE_CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Amount (₹) *</label>
              <input type="number" className="input" placeholder="1500" value={form.amount}
                onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Date</label>
              <input type="date" className="input" value={form.date}
                onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Trip ID (optional)</label>
              <input className="input" placeholder="TR001" value={form.tripId}
                onChange={e => setForm(f => ({ ...f, tripId: e.target.value }))} />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Description</label>
              <textarea className="input resize-none" rows={2} value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                placeholder="Description of expense..." />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2 border-t" style={{ borderColor: 'var(--border-color)' }}>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleSave} loading={saving}>
              {selected ? 'Save Changes' : 'Add Expense'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Expenses;
