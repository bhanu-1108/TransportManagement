import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Check, CheckCheck, Truck, Wrench, AlertTriangle, Info, CheckCircle2, XCircle } from 'lucide-react';
import { notificationsAPI } from '../services/api';
import { formatRelativeTime } from '../utils/helpers';
import Button from '../components/ui/Button';
import toast from 'react-hot-toast';

const TYPE_CONFIG = {
  warning: { icon: AlertTriangle, color: '#F59E0B', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.2)' },
  danger: { icon: XCircle, color: '#EF4444', bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.2)' },
  success: { icon: CheckCircle2, color: '#22C55E', bg: 'rgba(34,197,94,0.1)', border: 'rgba(34,197,94,0.2)' },
  info: { icon: Info, color: '#3B82F6', bg: 'rgba(59,130,246,0.1)', border: 'rgba(59,130,246,0.2)' },
};

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    notificationsAPI.getAll().then(data => {
      setNotifications(data);
      setLoading(false);
    });
  }, []);

  const markRead = async (id) => {
    await notificationsAPI.markRead(id);
    setNotifications(n => n.map(x => x.id === id ? { ...x, read: true } : x));
  };

  const markAllRead = async () => {
    await notificationsAPI.markAllRead();
    setNotifications(n => n.map(x => ({ ...x, read: true })));
    toast.success('All notifications marked as read');
  };

  const filtered = notifications.filter(n => {
    if (filter === 'unread') return !n.read;
    if (filter === 'warning') return n.type === 'warning';
    if (filter === 'danger') return n.type === 'danger';
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const filters = [
    { key: 'all', label: 'All', count: notifications.length },
    { key: 'unread', label: 'Unread', count: unreadCount },
    { key: 'warning', label: 'Warnings', count: notifications.filter(n => n.type === 'warning').length },
    { key: 'danger', label: 'Alerts', count: notifications.filter(n => n.type === 'danger').length },
  ];

  return (
    <div className="max-w-3xl space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Notifications</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>
            {unreadCount > 0 ? `${unreadCount} unread notifications` : 'All caught up!'}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button variant="secondary" size="sm" icon={CheckCheck} onClick={markAllRead}>
            Mark all read
          </Button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 p-1 rounded-xl" style={{ background: 'var(--bg-surface-2)' }}>
        {filters.map(f => (
          <motion.button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer"
            style={{
              background: filter === f.key ? 'var(--bg-surface)' : 'transparent',
              color: filter === f.key ? 'var(--text-primary)' : 'var(--text-muted)',
              boxShadow: filter === f.key ? 'var(--shadow-card)' : 'none',
            }}
          >
            {f.label}
            {f.count > 0 && (
              <span className="px-1.5 py-0.5 rounded-full text-2xs font-semibold"
                style={{
                  background: filter === f.key ? 'rgba(135,90,123,0.15)' : 'var(--bg-surface)',
                  color: filter === f.key ? '#875A7B' : 'var(--text-muted)',
                }}>
                {f.count}
              </span>
            )}
          </motion.button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-2">
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="card p-4 flex items-start gap-3">
              <div className="skeleton w-9 h-9 rounded-xl" />
              <div className="flex-1 space-y-2">
                <div className="skeleton h-4 w-40 rounded" />
                <div className="skeleton h-3 w-64 rounded" />
              </div>
            </div>
          ))
        ) : filtered.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="card p-12 flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
              style={{ background: 'var(--bg-surface-2)' }}>
              <Bell size={20} style={{ color: 'var(--text-muted)' }} />
            </div>
            <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>No notifications to show</p>
          </motion.div>
        ) : (
          <AnimatePresence>
            {filtered.map((notif, i) => {
              const config = TYPE_CONFIG[notif.type] || TYPE_CONFIG.info;
              const IconComp = config.icon;
              return (
                <motion.div
                  key={notif.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 12 }}
                  transition={{ delay: i * 0.04 }}
                  className="card p-4 flex items-start gap-3 cursor-pointer"
                  style={{
                    opacity: notif.read ? 0.7 : 1,
                    borderLeft: !notif.read ? `3px solid ${config.color}` : undefined,
                  }}
                  onClick={() => !notif.read && markRead(notif.id)}
                >
                  {/* Icon */}
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: config.bg, border: `1px solid ${config.border}` }}>
                    <IconComp size={16} style={{ color: config.color }} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                        {notif.title}
                      </p>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                          {formatRelativeTime(notif.time)}
                        </span>
                        {!notif.read && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-2 h-2 rounded-full"
                            style={{ background: config.color }}
                          />
                        )}
                      </div>
                    </div>
                    <p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                      {notif.message}
                    </p>
                    {!notif.read && (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        onClick={(e) => { e.stopPropagation(); markRead(notif.id); }}
                        className="mt-2 flex items-center gap-1 text-2xs font-medium"
                        style={{ color: config.color }}
                      >
                        <Check size={10} /> Mark as read
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default Notifications;
