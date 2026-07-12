import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Shield, Palette, Building2, Save, CheckCircle2 } from 'lucide-react';
import Button from '../components/ui/Button';
import ThemeToggle from '../components/ui/ThemeToggle';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Section = ({ icon: Icon, title, description, children }) => (
  <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="card p-6">
    <div className="flex items-start gap-3 mb-5 pb-4 border-b" style={{ borderColor: 'var(--border-color)' }}>
      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: 'rgba(135,90,123,0.1)', border: '1px solid rgba(135,90,123,0.2)' }}>
        <Icon size={16} style={{ color: '#875A7B' }} />
      </div>
      <div>
        <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{title}</h3>
        <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{description}</p>
      </div>
    </div>
    {children}
  </motion.div>
);

const Toggle = ({ label, description, value, onChange }) => (
  <div className="flex items-center justify-between py-3 border-b last:border-0" style={{ borderColor: 'var(--border-subtle)' }}>
    <div>
      <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{label}</p>
      {description && <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{description}</p>}
    </div>
    <motion.button
      onClick={() => onChange(!value)}
      className="relative flex items-center w-11 h-6 rounded-full p-0.5 transition-colors duration-300 cursor-pointer"
      style={{ background: value ? '#875A7B' : 'var(--border-color)' }}
    >
      <motion.div
        animate={{ x: value ? 20 : 0 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        className="w-5 h-5 rounded-full bg-white shadow-sm"
      />
    </motion.button>
  </div>
);

const Settings = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState({
    tripUpdates: true,
    maintenanceAlerts: true,
    licenseExpiry: true,
    safetyAlerts: true,
    reportsReady: false,
    emailDigest: false,
  });
  const [company, setCompany] = useState({
    name: 'TransitOps Enterprise',
    address: 'Mumbai, Maharashtra, India',
    phone: '+91-22-4567-8900',
    email: 'admin@transitops.in',
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 800));
    setSaving(false);
    toast.success('Settings saved successfully!');
  };

  return (
    <div className="space-y-5 max-w-3xl">
      <div>
        <h1 className="page-title">Settings</h1>
        <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>
          Manage your application preferences
        </p>
      </div>

      {/* Company Profile */}
      <Section icon={Building2} title="Company Profile" description="Basic organization information">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Company Name</label>
            <input className="input" value={company.name}
              onChange={e => setCompany(c => ({ ...c, name: e.target.value }))} />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Contact Email</label>
            <input className="input" value={company.email}
              onChange={e => setCompany(c => ({ ...c, email: e.target.value }))} />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Phone</label>
            <input className="input" value={company.phone}
              onChange={e => setCompany(c => ({ ...c, phone: e.target.value }))} />
          </div>
          <div className="col-span-2">
            <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Address</label>
            <input className="input" value={company.address}
              onChange={e => setCompany(c => ({ ...c, address: e.target.value }))} />
          </div>
        </div>
      </Section>

      {/* Appearance */}
      <Section icon={Palette} title="Appearance" description="Customize the look and feel">
        <div className="flex items-center justify-between py-2">
          <div>
            <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Dark / Light Mode</p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
              Toggle between dark and light theme
            </p>
          </div>
          <ThemeToggle />
        </div>
      </Section>

      {/* Notifications */}
      <Section icon={Bell} title="Notification Preferences" description="Control when you receive alerts">
        {[
          { key: 'tripUpdates', label: 'Trip Status Updates', desc: 'Notify on trip dispatched, completed, or cancelled' },
          { key: 'maintenanceAlerts', label: 'Maintenance Alerts', desc: 'Notify when vehicle enters or exits maintenance' },
          { key: 'licenseExpiry', label: 'License Expiry Warnings', desc: 'Alert 30 days before driver license expiry' },
          { key: 'safetyAlerts', label: 'Safety Score Alerts', desc: 'Notify when driver safety score drops below 70' },
          { key: 'reportsReady', label: 'Monthly Reports', desc: 'Notify when monthly reports are generated' },
          { key: 'emailDigest', label: 'Email Digest', desc: 'Receive daily email summary of fleet activity' },
        ].map(item => (
          <Toggle
            key={item.key}
            label={item.label}
            description={item.desc}
            value={notifications[item.key]}
            onChange={v => setNotifications(n => ({ ...n, [item.key]: v }))}
          />
        ))}
      </Section>

      {/* Security */}
      <Section icon={Shield} title="Security & Access" description="Role-based access control settings">
        <div className="space-y-3">
          {[
            { label: 'Session Timeout', desc: '30 minutes of inactivity', value: '30 min' },
            { label: 'Login Attempts', desc: 'Lock after 5 failed attempts', value: '5 attempts' },
            { label: 'RBAC Status', desc: 'Role-based access control is active', value: <span className="badge-available">Active</span> },
            { label: 'Current Role', desc: 'Your access level in the system', value: user?.role?.replace('_', ' ').toUpperCase() },
          ].map(item => (
            <div key={item.label} className="flex items-center justify-between py-2.5 border-b last:border-0"
              style={{ borderColor: 'var(--border-subtle)' }}>
              <div>
                <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{item.label}</p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{item.desc}</p>
              </div>
              <span className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </Section>

      {/* Save */}
      <div className="flex justify-end">
        <Button variant="primary" icon={Save} onClick={handleSave} loading={saving} size="md">
          Save All Settings
        </Button>
      </div>
    </div>
  );
};

export default Settings;
