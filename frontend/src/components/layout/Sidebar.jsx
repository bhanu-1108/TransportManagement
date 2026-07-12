import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Truck, Bell, User, LogOut, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { NAV_ITEMS_BY_ROLE } from '../../utils/constants';
import { RoleBadge } from '../ui/Badge';

const SIDEBAR_EXPANDED = 240;
const SIDEBAR_COLLAPSED = 68;

const Sidebar = ({ isMobileOpen, onMobileClose }) => {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  const navItems = NAV_ITEMS_BY_ROLE[user?.role] || [];

  const sidebarVariants = {
    expanded: { width: SIDEBAR_EXPANDED },
    collapsed: { width: SIDEBAR_COLLAPSED },
  };

  const labelVariants = {
    expanded: { opacity: 1, x: 0, display: 'block' },
    collapsed: { opacity: 0, x: -8, transitionEnd: { display: 'none' } },
  };

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onMobileClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        variants={sidebarVariants}
        animate={collapsed ? 'collapsed' : 'expanded'}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className={`
          fixed top-0 left-0 h-full z-50 flex flex-col
          border-r overflow-hidden
          lg:relative lg:translate-x-0
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
        style={{
          background: 'var(--sidebar-bg)',
          borderColor: 'var(--sidebar-border)',
          boxShadow: 'var(--shadow-card)',
        }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 h-16 border-b flex-shrink-0"
          style={{ borderColor: 'var(--border-color)' }}>
          <motion.div
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #875A7B, #714B67)' }}
            whileHover={{ scale: 1.05, rotate: 5 }}
          >
            <Truck size={18} className="text-white" />
          </motion.div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                variants={labelVariants}
                initial="collapsed"
                animate="expanded"
                exit="collapsed"
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="font-bold text-base leading-tight" style={{ color: 'var(--text-primary)' }}>
                  TransitOps
                </div>
                <div className="text-2xs" style={{ color: 'var(--text-muted)' }}>
                  Fleet Management
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Mobile close */}
          <button onClick={onMobileClose} className="ml-auto lg:hidden btn-ghost p-1">
            <X size={16} />
          </button>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 overflow-y-auto no-scrollbar py-3 px-2">
          {/* Section label */}
          {!collapsed && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="section-label mb-2"
            >
              Navigation
            </motion.p>
          )}

          <div className="space-y-0.5">
            {navItems.map((item, i) => {
              const isActive = location.pathname === item.path ||
                (item.path !== '/dashboard' && location.pathname.startsWith(item.path));

              return (
                <motion.div
                  key={item.path}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04, duration: 0.3 }}
                >
                  <NavLink
                    to={item.path}
                    onClick={onMobileClose}
                    className={`nav-item ${isActive ? 'active' : ''}`}
                    title={collapsed ? item.label : undefined}
                  >
                    <div className="flex-shrink-0">
                      <item.icon size={17} />
                    </div>
                    <AnimatePresence>
                      {!collapsed && (
                        <motion.span
                          variants={labelVariants}
                          initial="collapsed"
                          animate="expanded"
                          exit="collapsed"
                          transition={{ duration: 0.15 }}
                          className="flex-1 whitespace-nowrap text-sm font-medium"
                        >
                          {item.label}
                        </motion.span>
                      )}
                    </AnimatePresence>
                    {isActive && !collapsed && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ background: '#875A7B' }}
                      />
                    )}
                  </NavLink>
                </motion.div>
              );
            })}
          </div>

          {/* Bottom section */}
          <div className="mt-4 pt-3 border-t" style={{ borderColor: 'var(--border-color)' }}>
            {!collapsed && (
              <p className="section-label mb-2">Account</p>
            )}
            <NavLink
              to="/notifications"
              onClick={onMobileClose}
              className={`nav-item ${location.pathname === '/notifications' ? 'active' : ''}`}
              title={collapsed ? 'Notifications' : undefined}
            >
              <Bell size={17} />
              {!collapsed && <span className="text-sm font-medium">Notifications</span>}
            </NavLink>
            <NavLink
              to="/profile"
              onClick={onMobileClose}
              className={`nav-item ${location.pathname === '/profile' ? 'active' : ''}`}
              title={collapsed ? 'Profile' : undefined}
            >
              <User size={17} />
              {!collapsed && <span className="text-sm font-medium">Profile</span>}
            </NavLink>
          </div>
        </nav>

        {/* User Card */}
        <div className="border-t p-3 flex-shrink-0" style={{ borderColor: 'var(--border-color)' }}>
          <div className={`flex items-center gap-2.5 ${collapsed ? 'justify-center' : ''}`}>
            {/* Avatar */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-bold text-white"
              style={{ background: 'linear-gradient(135deg, #875A7B, #714B67)' }}
            >
              {user?.avatar}
            </motion.div>

            {!collapsed && (
              <AnimatePresence>
                <motion.div
                  variants={labelVariants}
                  initial="collapsed"
                  animate="expanded"
                  exit="collapsed"
                  className="flex-1 min-w-0"
                >
                  <div className="text-xs font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
                    {user?.name}
                  </div>
                  <div className="mt-0.5">
                    <RoleBadge role={user?.role} className="text-2xs py-0" />
                  </div>
                </motion.div>
              </AnimatePresence>
            )}

            {!collapsed && (
              <motion.button
                whileHover={{ scale: 1.1, color: '#EF4444' }}
                whileTap={{ scale: 0.9 }}
                onClick={logout}
                className="p-1.5 rounded-lg transition-colors flex-shrink-0"
                style={{ color: 'var(--text-muted)' }}
                title="Logout"
              >
                <LogOut size={14} />
              </motion.button>
            )}
          </div>
        </div>

        {/* Collapse toggle */}
        <motion.button
          onClick={() => setCollapsed(c => !c)}
          className="absolute top-[70px] -right-3 w-6 h-6 rounded-full border flex items-center justify-center
                     shadow-card transition-colors cursor-pointer z-10 hidden lg:flex"
          style={{
            background: 'var(--bg-surface)',
            borderColor: 'var(--border-color)',
            color: 'var(--text-muted)',
          }}
          whileHover={{ scale: 1.15, color: '#875A7B' }}
          whileTap={{ scale: 0.9 }}
        >
          {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </motion.button>
      </motion.aside>
    </>
  );
};

export default Sidebar;
