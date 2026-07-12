import { useState } from 'react';
import { useLocation, NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, Bell, Search, ChevronRight, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import ThemeToggle from '../ui/ThemeToggle';
import { RoleBadge } from '../ui/Badge';

// Breadcrumb map
const BREADCRUMB_MAP = {
  '/dashboard': ['Dashboard'],
  '/vehicles': ['Fleet', 'Vehicles'],
  '/drivers': ['Fleet', 'Drivers'],
  '/trips': ['Operations', 'Trips'],
  '/maintenance': ['Fleet', 'Maintenance'],
  '/fuel': ['Finance', 'Fuel Logs'],
  '/expenses': ['Finance', 'Expenses'],
  '/reports': ['Analytics', 'Reports'],
  '/analytics': ['Analytics', 'Analytics'],
  '/settings': ['System', 'Settings'],
  '/profile': ['Account', 'Profile'],
  '/notifications': ['Account', 'Notifications'],
};

const Topbar = ({ onMenuClick, unreadCount = 0 }) => {
  const { user } = useAuth();
  const location = useLocation();
  const [searchOpen, setSearchOpen] = useState(false);

  const breadcrumbs = BREADCRUMB_MAP[location.pathname] || ['Page'];

  return (
    <header
      className="h-16 flex items-center px-4 gap-4 border-b flex-shrink-0"
      style={{
        background: 'var(--bg-surface)',
        borderColor: 'var(--border-color)',
        boxShadow: 'var(--shadow-card)',
      }}
    >
      {/* Mobile menu toggle */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onMenuClick}
        className="lg:hidden p-2 rounded-lg btn-ghost"
      >
        <Menu size={18} />
      </motion.button>

      {/* Breadcrumb */}
      <div className="hidden lg:flex items-center gap-1.5 text-sm">
        {breadcrumbs.map((crumb, i) => (
          <span key={i} className="flex items-center gap-1.5">
            {i > 0 && <ChevronRight size={12} style={{ color: 'var(--text-muted)' }} />}
            <span
              className={i === breadcrumbs.length - 1
                ? 'font-semibold'
                : 'text-sm'}
              style={{ color: i === breadcrumbs.length - 1 ? 'var(--text-primary)' : 'var(--text-muted)' }}
            >
              {crumb}
            </span>
          </span>
        ))}
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Search */}
      <AnimatePresence>
        {searchOpen ? (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 280, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="relative overflow-hidden"
          >
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
            <input
              autoFocus
              placeholder="Search anything..."
              className="input pl-9 pr-9 h-9 text-sm w-full"
            />
            <button
              onClick={() => setSearchOpen(false)}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded"
              style={{ color: 'var(--text-muted)' }}
            >
              <X size={13} />
            </button>
          </motion.div>
        ) : (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSearchOpen(true)}
            className="btn-ghost p-2 rounded-xl"
            title="Search"
          >
            <Search size={16} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Theme Toggle */}
      <ThemeToggle />

      {/* Notifications */}
      <NavLink to="/notifications">
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative p-2 rounded-xl btn-ghost cursor-pointer"
        >
          <Bell size={16} />
          {unreadCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-white flex items-center justify-center"
              style={{ background: '#EF4444', fontSize: 9, fontWeight: 700 }}
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </motion.span>
          )}
        </motion.div>
      </NavLink>

      {/* User Chip */}
      <NavLink to="/profile">
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2.5 pl-1 pr-3 py-1 rounded-xl border cursor-pointer transition-colors"
          style={{
            background: 'var(--bg-surface-2)',
            borderColor: 'var(--border-color)',
          }}
        >
          <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #875A7B, #714B67)' }}>
            {user?.avatar}
          </div>
          <div className="hidden sm:block">
            <div className="text-xs font-semibold leading-tight" style={{ color: 'var(--text-primary)' }}>
              {user?.name?.split(' ')[0]}
            </div>
            <div className="mt-0.5">
              <RoleBadge role={user?.role} className="text-2xs py-0" />
            </div>
          </div>
        </motion.div>
      </NavLink>
    </header>
  );
};

export default Topbar;
