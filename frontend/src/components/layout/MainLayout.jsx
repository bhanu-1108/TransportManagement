import { useState } from 'react';
import { motion } from 'framer-motion';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { Toaster } from 'react-hot-toast';
import { dummyNotifications } from '../../utils/dummy';

const pageVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

const MainLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const unreadCount = dummyNotifications.filter(n => !n.read).length;

  return (
    <div className="flex h-screen overflow-hidden relative" style={{ background: 'var(--bg-base)' }}>
      {/* Background Mesh Glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div
          className="absolute w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] rounded-full blur-[80px] sm:blur-[120px] opacity-40 dark:opacity-30 animate-glow-1"
          style={{
            background: 'radial-gradient(circle, rgba(135,90,123,0.4) 0%, rgba(135,90,123,0.1) 60%, transparent 100%)',
            top: '-5%',
            right: '-5%',
          }}
        />
        <div
          className="absolute w-[280px] h-[280px] sm:w-[450px] sm:h-[450px] rounded-full blur-[80px] sm:blur-[120px] opacity-35 dark:opacity-25 animate-glow-2"
          style={{
            background: 'radial-gradient(circle, rgba(59,130,246,0.3) 0%, rgba(59,130,246,0.05) 60%, transparent 100%)',
            bottom: '10%',
            left: '-10%',
          }}
        />
      </div>

      {/* Sidebar */}
      <Sidebar
        isMobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      {/* Main Content */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden relative z-10">
        {/* Topbar */}
        <Topbar
          onMenuClick={() => setMobileOpen(true)}
          unreadCount={unreadCount}
        />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <motion.div
            key={location.pathname}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="p-6 min-h-full"
          >
            <Outlet />
          </motion.div>
        </main>
      </div>

      {/* Toast notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: 'var(--bg-surface)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-color)',
            borderRadius: '12px',
            boxShadow: 'var(--shadow-elevated)',
            fontSize: 13,
          },
          success: {
            iconTheme: { primary: '#22C55E', secondary: '#fff' },
          },
          error: {
            iconTheme: { primary: '#EF4444', secondary: '#fff' },
          },
        }}
      />
    </div>
  );
};

export default MainLayout;
