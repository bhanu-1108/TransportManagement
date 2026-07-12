import { motion } from 'framer-motion';
import {
  AreaChart, Area, BarChart, Bar, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import {
  monthlyRevenueData, fuelCostData, vehicleStatusData,
  tripsByRegionData, driverSafetyData, fleetUtilizationData
} from '../utils/dummy';
import { formatCurrency } from '../utils/helpers';

const COLORS = ['#875A7B', '#3B82F6', '#22C55E', '#F59E0B', '#EF4444', '#8B5CF6'];

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
            {typeof p.value === 'number' && p.value > 1000 ? formatCurrency(p.value) : p.value}
          </span>
        </div>
      ))}
    </div>
  );
};

const ChartCard = ({ title, subtitle, children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    className="card p-5"
  >
    <h3 className="text-sm font-semibold mb-0.5" style={{ color: 'var(--text-primary)' }}>{title}</h3>
    {subtitle && <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>{subtitle}</p>}
    <div className="mt-4">{children}</div>
  </motion.div>
);

const Analytics = () => {
  const radarData = [
    { metric: 'Fleet Util.', value: 81 },
    { metric: 'Safety', value: 85 },
    { metric: 'Revenue', value: 72 },
    { metric: 'Fuel Eff.', value: 68 },
    { metric: 'Maintenance', value: 76 },
    { metric: 'Driver Perf.', value: 88 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Analytics</h1>
        <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>
          Deep-dive into fleet performance metrics
        </p>
      </div>

      {/* Row 1: Area + Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <ChartCard title="Revenue Trend" subtitle="Monthly revenue vs expenses" delay={0.1} className="lg:col-span-2">
          <div className="lg:col-span-2">
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={monthlyRevenueData} margin={{ left: -20, right: 0, top: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="aGradRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#875A7B" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#875A7B" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="aGradExp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#875A7B" strokeWidth={2} fill="url(#aGradRev)" />
                <Area type="monotone" dataKey="expenses" name="Expenses" stroke="#3B82F6" strokeWidth={2} fill="url(#aGradExp)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Fleet Performance Radar" subtitle="Overall fleet score" delay={0.15}>
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="var(--border-color)" />
              <PolarAngleAxis dataKey="metric" tick={{ fontSize: 10, fill: 'var(--text-muted)' }} />
              <Radar name="Performance" dataKey="value" stroke="#875A7B" fill="#875A7B" fillOpacity={0.2} />
            </RadarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Row 2: Trips by Region + Driver Safety */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChartCard title="Trips by Region" subtitle="Trip count and revenue per region" delay={0.2}>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={tripsByRegionData} margin={{ left: -20, right: 0, top: 0, bottom: 0 }} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="region" tick={{ fontSize: 11 }} />
              <YAxis yAxisId="left" tick={{ fontSize: 11 }} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar yAxisId="left" dataKey="trips" name="Trips" fill="#875A7B" radius={[4, 4, 0, 0]} maxBarSize={28} />
              <Bar yAxisId="right" dataKey="revenue" name="Revenue" fill="#3B82F6" radius={[4, 4, 0, 0]} maxBarSize={28} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Driver Safety Distribution" subtitle="Drivers grouped by safety score range" delay={0.25}>
          <div className="flex items-center gap-6">
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={driverSafetyData} cx="50%" cy="50%"
                  outerRadius={70} dataKey="count" nameKey="label" paddingAngle={3}>
                  {driverSafetyData.map((entry, i) => (
                    <Cell key={i} fill={COLORS[i]} stroke="transparent" />
                  ))}
                </Pie>
                <Tooltip formatter={(v, n) => [`${v} drivers`, n]} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 flex-shrink-0">
              {driverSafetyData.map((d, i) => (
                <div key={d.score} className="flex items-center gap-2 text-xs">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS[i] }} />
                  <div>
                    <div style={{ color: 'var(--text-primary)' }} className="font-medium">{d.label}</div>
                    <div style={{ color: 'var(--text-muted)' }}>{d.score} · {d.count} drivers</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ChartCard>
      </div>

      {/* Row 3: Vehicle Status Pie + Fuel vs Maintenance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChartCard title="Vehicle Status Distribution" subtitle="Current fleet status breakdown" delay={0.3}>
          <div className="flex items-center gap-6">
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={vehicleStatusData} cx="50%" cy="50%"
                  innerRadius={40} outerRadius={72} paddingAngle={3} dataKey="value">
                  {vehicleStatusData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} stroke="transparent" />
                  ))}
                </Pie>
                <Tooltip formatter={(v, n) => [`${v} vehicles`, n]} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-3">
              {vehicleStatusData.map(d => (
                <div key={d.name} className="flex items-center gap-2 text-xs">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }} />
                  <span style={{ color: 'var(--text-secondary)' }}>{d.name}</span>
                  <span className="font-bold ml-auto" style={{ color: d.color }}>{d.value}</span>
                </div>
              ))}
            </div>
          </div>
        </ChartCard>

        <ChartCard title="Fuel vs Maintenance Costs" subtitle="Monthly cost comparison" delay={0.35}>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={fuelCostData} margin={{ left: -20, right: 0, top: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="fuel" name="Fuel" fill="#875A7B" radius={[4, 4, 0, 0]} maxBarSize={26} stackId="a" />
              <Bar dataKey="maintenance" name="Maintenance" fill="#F59E0B" radius={[4, 4, 0, 0]} maxBarSize={26} stackId="a" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
};

export default Analytics;
