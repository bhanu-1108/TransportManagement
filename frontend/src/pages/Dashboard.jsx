import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Truck, Users, Route, Wrench, DollarSign, Fuel, TrendingUp,
  CheckCircle2, Clock, AlertTriangle, Plus, RefreshCw, Activity
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { useAuth } from '../context/AuthContext';
import KPICard from '../components/cards/KPICard';
import { StatusBadge } from '../components/ui/Badge';
import { dashboardAPI } from '../services/api';
import { formatCurrency, formatDate } from '../utils/helpers';
import {
  monthlyRevenueData, fuelCostData, vehicleStatusData,
  dummyTrips, dummyMaintenance, dummyActivity, dashboardKPIs
} from '../utils/dummy';

// Custom tooltip
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="card px-3 py-2 text-xs">
      <p className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>{label}</p>
      {payload.map((p, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span style={{ color: 'var(--text-secondary)' }}>{p.name}:</span>
          <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
            {typeof p.value === 'number' && p.value > 1000
              ? `₹${(p.value / 1000).toFixed(0)}K`
              : p.value}
          </span>
        </div>
      ))}
    </div>
  );
};

// Activity icon map
const ActivityIcon = ({ type }) => {
  const iconProps = { size: 14 };
  const map = {
    trip: <Route {...iconProps} style={{ color: '#3B82F6' }} />,
    maintenance: <Wrench {...iconProps} style={{ color: '#F59E0B' }} />,
    fuel: <Fuel {...iconProps} style={{ color: '#22C55E' }} />,
    driver: <Users {...iconProps} style={{ color: '#875A7B' }} />,
    vehicle: <Truck {...iconProps} style={{ color: '#8B5CF6' }} />,
    check: <CheckCircle2 {...iconProps} style={{ color: '#22C55E' }} />,
    alert: <AlertTriangle {...iconProps} style={{ color: '#EF4444' }} />,
  };
  return map[type] || <Activity {...iconProps} />;
};

const Dashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [kpis, setKpis] = useState(dashboardKPIs);
  const [recentTrips, setRecentTrips] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [kpiData, trips] = await Promise.all([
          dashboardAPI.getKPIs(),
          dashboardAPI.getRecentTrips(),
        ]);
        setKpis(kpiData);
        setRecentTrips(trips);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Role-specific KPI sets
  const kpiCards = (() => {
    const all = [
      { title: 'Active Vehicles', value: kpis.activeVehicles, icon: Truck, color: 'primary', trend: 8, trendLabel: 'vs last month', delay: 0 },
      { title: 'Available Vehicles', value: kpis.availableVehicles, icon: CheckCircle2, color: 'success', trend: 5, trendLabel: 'vs last month', delay: 0.06 },
      { title: 'In Maintenance', value: kpis.vehiclesInMaintenance, icon: Wrench, color: 'warning', trend: -2, trendLabel: 'vs last month', delay: 0.12 },
      { title: 'Active Trips', value: kpis.activeTrips, icon: Route, color: 'info', trend: 12, trendLabel: 'vs last month', delay: 0.18 },
      { title: 'Pending Trips', value: kpis.pendingTrips, icon: Clock, color: 'warning', trend: 0, trendLabel: 'unchanged', delay: 0.24 },
      { title: 'Drivers on Duty', value: kpis.driversOnDuty, icon: Users, color: 'primary', trend: 15, trendLabel: 'vs last month', delay: 0.30 },
      { title: 'Fleet Utilization', value: `${kpis.fleetUtilization}%`, icon: TrendingUp, color: 'success', trend: 3, trendLabel: 'vs last month', delay: 0.36 },
      { title: 'Monthly Revenue', value: `₹${(kpis.monthlyRevenue / 1000).toFixed(0)}K`, icon: DollarSign, color: 'success', trend: 8, trendLabel: 'vs last month', delay: 0.42 },
    ];

    if (user?.role === 'driver') return all.filter((_, i) => [0, 3, 5].includes(i));
    if (user?.role === 'safety_officer') return all.filter((_, i) => [0, 2, 5, 6].includes(i));
    if (user?.role === 'financial_analyst') return all.filter((_, i) => [0, 3, 6, 7].includes(i));
    return all;
  })();

  const maintenanceAlerts = dummyMaintenance.filter(m => m.status === 'In Progress');
  const recentActivity = dummyActivity.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <motion.h1
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-xl font-bold"
            style={{ color: 'var(--text-primary)' }}
          >
            Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'},{' '}
            <span style={{ color: '#875A7B' }}>{user?.name?.split(' ')[0]}</span> 👋
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-sm mt-0.5"
            style={{ color: 'var(--text-muted)' }}
          >
            Here's what's happening with your fleet today
          </motion.p>
        </div>
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="btn-secondary gap-2 hidden sm:flex"
          onClick={() => window.location.reload()}
        >
          <RefreshCw size={14} />
          Refresh
        </motion.button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {kpiCards.map((kpi, i) => (
          <KPICard key={kpi.title} loading={loading} {...kpi} />
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Revenue & Expenses — Area Chart */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card p-5 lg:col-span-2"
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                Revenue vs Expenses
              </h3>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>Monthly financial overview</p>
            </div>
            <div className="flex items-center gap-3 text-xs" style={{ color: 'var(--text-muted)' }}>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full" style={{ background: '#875A7B' }} />Revenue
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full" style={{ background: '#3B82F6' }} />Expenses
              </span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={monthlyRevenueData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="gradRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#875A7B" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#875A7B" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradExpenses" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#875A7B" strokeWidth={2} fill="url(#gradRevenue)" />
              <Area type="monotone" dataKey="expenses" name="Expenses" stroke="#3B82F6" strokeWidth={2} fill="url(#gradExpenses)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Vehicle Status — Pie Chart */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="card p-5"
        >
          <h3 className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
            Vehicle Status
          </h3>
          <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>Current fleet breakdown</p>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie
                data={vehicleStatusData}
                cx="50%"
                cy="50%"
                innerRadius={48}
                outerRadius={72}
                paddingAngle={3}
                dataKey="value"
              >
                {vehicleStatusData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} stroke="transparent" />
                ))}
              </Pie>
              <Tooltip formatter={(v, n) => [v + ' vehicles', n]} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {vehicleStatusData.map(item => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: item.color }} />
                  <span style={{ color: 'var(--text-secondary)' }}>{item.name}</span>
                </div>
                <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{item.value}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Recent Trips */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card lg:col-span-2 overflow-hidden"
        >
          <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: 'var(--border-color)' }}>
            <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Recent Trips</h3>
            <a href="/trips" className="text-xs font-medium" style={{ color: '#875A7B' }}>View all →</a>
          </div>
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Trip ID</th>
                  <th>Route</th>
                  <th>Driver</th>
                  <th>Status</th>
                  <th>ETA</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <tr key={i}>
                      {Array.from({ length: 5 }).map((_, j) => (
                        <td key={j}><div className="skeleton h-4 rounded w-20" /></td>
                      ))}
                    </tr>
                  ))
                ) : recentTrips.slice(0, 5).map((trip, i) => (
                  <motion.tr
                    key={trip.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + i * 0.05 }}
                  >
                    <td>
                      <span className="font-mono text-xs font-semibold" style={{ color: '#875A7B' }}>
                        {trip.id}
                      </span>
                    </td>
                    <td>
                      <div className="text-xs">
                        <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{trip.source}</span>
                        <span className="mx-1" style={{ color: 'var(--text-muted)' }}>→</span>
                        <span style={{ color: 'var(--text-secondary)' }}>{trip.destination}</span>
                      </div>
                    </td>
                    <td className="text-xs" style={{ color: 'var(--text-secondary)' }}>{trip.driver}</td>
                    <td><StatusBadge status={trip.status} /></td>
                    <td className="text-xs" style={{ color: 'var(--text-muted)' }}>{trip.eta || '—'}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Right Column: Alerts + Activity */}
        <div className="space-y-4">
          {/* Maintenance Alerts */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="card p-5"
          >
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle size={14} style={{ color: '#F59E0B' }} />
              <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                Maintenance Alerts
              </h3>
              {maintenanceAlerts.length > 0 && (
                <span className="badge-in-shop ml-auto">{maintenanceAlerts.length}</span>
              )}
            </div>
            {maintenanceAlerts.length === 0 ? (
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>No active alerts</p>
            ) : (
              <div className="space-y-2.5">
                {maintenanceAlerts.map((m, i) => (
                  <motion.div
                    key={m.id}
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + i * 0.05 }}
                    className="flex items-start gap-2.5 p-2.5 rounded-xl"
                    style={{ background: 'var(--bg-surface-2)' }}
                  >
                    <Wrench size={13} style={{ color: '#F59E0B', marginTop: 1 }} />
                    <div className="min-w-0">
                      <p className="text-xs font-medium truncate" style={{ color: 'var(--text-primary)' }}>
                        {m.vehicle}
                      </p>
                      <p className="text-2xs truncate" style={{ color: 'var(--text-muted)' }}>{m.type}</p>
                    </div>
                    <span className="badge-in-shop flex-shrink-0 text-2xs">In Progress</span>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Activity Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="card p-5"
          >
            <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
              Activity
            </h3>
            <div className="space-y-3">
              {recentActivity.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.55 + i * 0.05 }}
                  className="flex items-start gap-2.5"
                >
                  <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: 'var(--bg-surface-2)' }}>
                    <ActivityIcon type={item.icon} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs leading-snug" style={{ color: 'var(--text-secondary)' }}>
                      {item.message}
                    </p>
                    <p className="text-2xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                      {item.user} · {formatDate(item.time)}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Fuel Cost Bar Chart */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55 }}
        className="card p-5"
      >
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
              Fuel & Maintenance Costs
            </h3>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>Monthly cost breakdown</p>
          </div>
          <div className="flex items-center gap-3 text-xs" style={{ color: 'var(--text-muted)' }}>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full" style={{ background: '#875A7B' }} />Fuel
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full" style={{ background: '#F59E0B' }} />Maintenance
            </span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={fuelCostData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="fuel" name="Fuel" fill="#875A7B" radius={[4, 4, 0, 0]} maxBarSize={28} />
            <Bar dataKey="maintenance" name="Maintenance" fill="#F59E0B" radius={[4, 4, 0, 0]} maxBarSize={28} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
};

export default Dashboard;
