import { useState } from 'react';
import { motion } from 'framer-motion';
import { Edit2, Save, LogOut, Shield, Briefcase, Calendar, Phone, Mail } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { RoleBadge } from '../components/ui/Badge';
import Button from '../components/ui/Button';
import { ROLE_LABELS, PERMISSIONS } from '../utils/constants';
import { formatDate } from '../utils/helpers';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, logout } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '+91-9876543210',
    department: user?.department || '',
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 700));
    setSaving(false);
    setEditing(false);
    toast.success('Profile updated successfully!');
  };

  const rolePerms = PERMISSIONS[user?.role] || {};
  const permissionList = Object.entries(rolePerms)
    .filter(([, actions]) => actions.length > 0)
    .map(([module, actions]) => ({ module, actions }));

  return (
    <div className="max-w-3xl space-y-5">
      <div>
        <h1 className="page-title">My Profile</h1>
        <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>
          Manage your account information
        </p>
      </div>

      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="card p-6"
      >
        <div className="flex items-start gap-5">
          {/* Avatar */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-bold text-white flex-shrink-0"
            style={{
              background: 'linear-gradient(135deg, #875A7B, #714B67)',
              boxShadow: '0 8px 24px rgba(135,90,123,0.4)',
            }}
          >
            {user?.avatar}
          </motion.div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            {editing ? (
              <input
                className="input text-lg font-bold mb-1 w-full"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              />
            ) : (
              <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{user?.name}</h2>
            )}
            <p className="text-sm mb-2" style={{ color: 'var(--text-muted)' }}>{user?.email}</p>
            <div className="flex items-center gap-2 flex-wrap">
              <RoleBadge role={user?.role} />
              <span className="badge-on-trip">{user?.department}</span>
              <span className="badge-available">Active</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 flex-shrink-0">
            {editing ? (
              <>
                <Button variant="secondary" size="sm" onClick={() => setEditing(false)}>Cancel</Button>
                <Button variant="primary" size="sm" icon={Save} onClick={handleSave} loading={saving}>Save</Button>
              </>
            ) : (
              <Button variant="secondary" size="sm" icon={Edit2} onClick={() => setEditing(true)}>Edit</Button>
            )}
          </div>
        </div>
      </motion.div>

      {/* Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card p-5">
          <h3 className="text-sm font-semibold mb-4 pb-3 border-b" style={{ color: 'var(--text-primary)', borderColor: 'var(--border-color)' }}>
            Contact Information
          </h3>
          <div className="space-y-3">
            {[
              { icon: Mail, label: 'Email', key: 'email' },
              { icon: Phone, label: 'Phone', key: 'phone' },
              { icon: Briefcase, label: 'Department', key: 'department' },
            ].map(f => (
              <div key={f.key} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: 'var(--bg-surface-2)' }}>
                  <f.icon size={14} style={{ color: 'var(--text-muted)' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{f.label}</p>
                  {editing ? (
                    <input className="input mt-0.5 text-sm py-1"
                      value={form[f.key]}
                      onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} />
                  ) : (
                    <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>{form[f.key]}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="card p-5">
          <h3 className="text-sm font-semibold mb-4 pb-3 border-b" style={{ color: 'var(--text-primary)', borderColor: 'var(--border-color)' }}>
            Account Details
          </h3>
          <div className="space-y-3">
            <div>
              <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>Assigned Role</p>
              <RoleBadge role={user?.role} />
            </div>
            <div>
              <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>Role Label</p>
              <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{ROLE_LABELS[user?.role]}</p>
            </div>
            <div>
              <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>Login Time</p>
              <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                {user?.loginTime ? new Date(user.loginTime).toLocaleTimeString('en-IN') : '—'}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Permissions */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card p-5">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b" style={{ borderColor: 'var(--border-color)' }}>
          <Shield size={15} style={{ color: '#875A7B' }} />
          <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
            Access Permissions
          </h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {permissionList.map(({ module, actions }) => (
            <div key={module} className="p-3 rounded-xl" style={{ background: 'var(--bg-surface-2)' }}>
              <p className="text-xs font-semibold capitalize mb-2" style={{ color: 'var(--text-primary)' }}>
                {module.replace('_', ' ')}
              </p>
              <div className="flex flex-wrap gap-1">
                {actions.map(a => (
                  <span key={a} className="px-1.5 py-0.5 rounded text-2xs font-medium"
                    style={{ background: 'rgba(135,90,123,0.15)', color: '#875A7B' }}>
                    {a}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Logout */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}>
        <Button variant="danger" icon={LogOut} onClick={logout}>Sign Out</Button>
      </motion.div>
    </div>
  );
};

export default Profile;
