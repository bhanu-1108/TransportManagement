import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Truck, Mail, Lock, Shield, ChevronRight, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { DEMO_ACCOUNTS, ROLE_LABELS } from '../utils/constants';
import toast from 'react-hot-toast';

const Login = () => {
  const { login, isAuthenticated, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});
  const [loginError, setLoginError] = useState('');
  const [selectedRole, setSelectedRole] = useState(null);

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  const validate = () => {
    const errs = {};
    if (!email) errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = 'Invalid email address';
    if (!password) errs.password = 'Password is required';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    try {
      await login(email, password);
      toast.success('Welcome to TransitOps!');
    } catch (err) {
      setLoginError(err.message || 'Login failed');
    }
  };

  const fillDemo = (account) => {
    setEmail(account.email);
    setPassword(account.password);
    setSelectedRole(account.role);
    setLoginError('');
    setErrors({});
  };

  const roleColors = {
    fleet_manager: '#875A7B',
    driver: '#3B82F6',
    safety_officer: '#22C55E',
    financial_analyst: '#F59E0B',
  };

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--bg-base)' }}>

      {/* ===== LEFT PANEL ===== */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="hidden lg:flex flex-col justify-between w-[480px] flex-shrink-0 relative overflow-hidden"
        style={{
          background: 'linear-gradient(160deg, #0f0e13 0%, #1a1527 40%, #2d1f3d 70%, #3d2152 100%)',
        }}
      >
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-20"
            style={{ background: 'radial-gradient(circle, #875A7B, transparent)' }} />
          <div className="absolute -bottom-32 -right-16 w-80 h-80 rounded-full opacity-15"
            style={{ background: 'radial-gradient(circle, #714B67, transparent)' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] opacity-5"
            style={{ background: 'radial-gradient(circle, #875A7B, transparent)' }} />
          {/* Grid dots */}
          <svg className="absolute inset-0 w-full h-full opacity-[0.03]">
            <defs>
              <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
                <circle cx="1" cy="1" r="1" fill="white" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Content */}
        <div className="relative z-10 p-10">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex items-center gap-3 mb-12"
          >
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #875A7B, #714B67)', boxShadow: '0 4px 20px rgba(135,90,123,0.4)' }}>
              <Truck size={22} className="text-white" />
            </div>
            <div>
              <div className="text-white font-bold text-xl leading-tight">TransitOps</div>
              <div className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>Smart Transport Operations</div>
            </div>
          </motion.div>

          {/* Headline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <h1 className="text-3xl font-bold text-white mb-4 leading-tight">
              One platform.<br />
              <span style={{ color: '#a57098' }}>Total fleet control.</span>
            </h1>
            <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>
              Manage vehicles, drivers, trips, maintenance, and expenses — all in one place.
            </p>
          </motion.div>
        </div>

        {/* Feature bullets */}
        <div className="relative z-10 px-10 pb-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="space-y-3 mb-8"
          >
            {[
              'Real-time fleet tracking & utilization',
              'RBAC with 4 specialized roles',
              'Automated maintenance alerts',
              'Fuel efficiency & cost analytics',
            ].map((feat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + i * 0.1 }}
                className="flex items-center gap-3"
              >
                <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(135,90,123,0.3)', border: '1px solid rgba(135,90,123,0.4)' }}>
                  <CheckCircle2 size={11} style={{ color: '#a57098' }} />
                </div>
                <span className="text-sm" style={{ color: 'rgba(255,255,255,0.65)' }}>{feat}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* Role Pills */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            <p className="text-xs mb-3 font-medium" style={{ color: 'rgba(255,255,255,0.35)' }}>
              ONE LOGIN · FOUR ROLES
            </p>
            <div className="flex flex-wrap gap-2">
              {['Fleet Manager', 'Driver', 'Safety Officer', 'Financial Analyst'].map((r, i) => (
                <span key={i} className="px-3 py-1 rounded-full text-xs font-medium"
                  style={{
                    background: 'rgba(255,255,255,0.07)',
                    color: 'rgba(255,255,255,0.6)',
                    border: '1px solid rgba(255,255,255,0.1)',
                  }}>
                  {r}
                </span>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Footer */}
        <div className="relative z-10 px-10 py-6 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>
            © 2026 TransitOps · Enterprise Edition · RBAC Enabled
          </p>
        </div>
      </motion.div>

      {/* ===== RIGHT PANEL ===== */}
      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #875A7B, #714B67)' }}>
              <Truck size={18} className="text-white" />
            </div>
            <div className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>TransitOps</div>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-1.5" style={{ color: 'var(--text-primary)' }}>
              Welcome back
            </h2>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Sign in to your TransitOps account
            </p>
          </div>

          {/* Demo Quick Select */}
          <div className="mb-6">
            <p className="text-xs font-medium mb-3" style={{ color: 'var(--text-muted)' }}>
              QUICK ACCESS — DEMO ACCOUNTS
            </p>
            <div className="grid grid-cols-2 gap-2">
              {DEMO_ACCOUNTS.map(account => (
                <motion.button
                  key={account.id}
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => fillDemo(account)}
                  className="relative flex items-center gap-2.5 px-3 py-2.5 rounded-xl border text-left transition-all duration-200 cursor-pointer"
                  style={{
                    background: selectedRole === account.role
                      ? `rgba(${account.role === 'fleet_manager' ? '135,90,123' : account.role === 'driver' ? '59,130,246' : account.role === 'safety_officer' ? '34,197,94' : '245,158,11'},0.1)`
                      : 'var(--bg-surface-2)',
                    borderColor: selectedRole === account.role
                      ? roleColors[account.role] + '50'
                      : 'var(--border-color)',
                  }}
                >
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                    style={{ background: roleColors[account.role] }}>
                    {account.avatar}
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
                      {account.name.split(' ')[0]}
                    </div>
                    <div className="text-2xs truncate" style={{ color: 'var(--text-muted)' }}>
                      {ROLE_LABELS[account.role]}
                    </div>
                  </div>
                  {selectedRole === account.role && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-1.5 right-1.5"
                    >
                      <CheckCircle2 size={12} style={{ color: roleColors[account.role] }} />
                    </motion.div>
                  )}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px" style={{ background: 'var(--border-color)' }} />
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>or enter manually</span>
            <div className="flex-1 h-px" style={{ background: 'var(--border-color)' }} />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                Email Address
              </label>
              <div className="relative">
                <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@transitops.in"
                  className={`input pl-9 ${errors.email ? 'border-red-400' : ''}`}
                  autoComplete="email"
                />
              </div>
              <AnimatePresence>
                {errors.email && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-xs mt-1 text-red-500"
                  >
                    {errors.email}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                Password
              </label>
              <div className="relative">
                <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`input pl-9 pr-10 ${errors.password ? 'border-red-400' : ''}`}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: 'var(--text-muted)' }}
                >
                  {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
              <AnimatePresence>
                {errors.password && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-xs mt-1 text-red-500"
                  >
                    {errors.password}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Remember Me + Forgot */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <div
                  onClick={() => setRememberMe(p => !p)}
                  className="w-4 h-4 rounded border-2 flex items-center justify-center transition-colors cursor-pointer"
                  style={{
                    borderColor: rememberMe ? '#875A7B' : 'var(--border-color)',
                    background: rememberMe ? '#875A7B' : 'transparent',
                  }}
                >
                  {rememberMe && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                    <CheckCircle2 size={10} className="text-white" />
                  </motion.div>}
                </div>
                <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>Remember me</span>
              </label>
              <button type="button" className="text-xs font-medium transition-colors"
                style={{ color: '#875A7B' }}
                onMouseEnter={e => e.target.style.color = '#a57098'}
                onMouseLeave={e => e.target.style.color = '#875A7B'}
              >
                Forgot password?
              </button>
            </div>

            {/* Login Error */}
            <AnimatePresence>
              {loginError && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  className="flex items-start gap-2.5 px-4 py-3 rounded-xl border"
                  style={{ background: 'rgba(239,68,68,0.08)', borderColor: 'rgba(239,68,68,0.2)' }}
                >
                  <Shield size={14} className="text-red-500 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-red-500">{loginError}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={!isLoading ? { scale: 1.01 } : {}}
              whileTap={!isLoading ? { scale: 0.99 } : {}}
              className="w-full flex items-center justify-center gap-2.5 py-3 rounded-xl text-white font-semibold text-sm transition-all duration-300 cursor-pointer disabled:cursor-not-allowed disabled:opacity-70"
              style={{
                background: 'linear-gradient(135deg, #875A7B, #714B67)',
                boxShadow: isLoading ? 'none' : '0 4px 20px rgba(135,90,123,0.4)',
              }}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <ChevronRight size={16} />
                </>
              )}
            </motion.button>
          </form>

          {/* Access info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6 p-4 rounded-xl border"
            style={{ background: 'var(--bg-surface-2)', borderColor: 'var(--border-color)' }}
          >
            <p className="text-xs font-medium mb-2" style={{ color: 'var(--text-muted)' }}>
              Access scoped by role after login:
            </p>
            <div className="space-y-1">
              {[
                { role: 'Fleet Manager', access: 'Full fleet, maintenance, analytics' },
                { role: 'Driver', access: 'Dashboard, own trips' },
                { role: 'Safety Officer', access: 'Drivers, compliance, reports' },
                { role: 'Financial Analyst', access: 'Fuel, expenses, analytics' },
              ].map(r => (
                <div key={r.role} className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-muted)' }}>
                  <span className="font-medium" style={{ color: 'var(--text-secondary)' }}>{r.role}</span>
                  <span>→</span>
                  <span>{r.access}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
