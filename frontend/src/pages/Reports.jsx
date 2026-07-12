import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, BarChart3, TrendingUp, DollarSign, Gauge } from 'lucide-react';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import Button from '../components/ui/Button';
import { reportsAPI } from '../services/api';
import { formatCurrency, formatNumber, exportToCSV } from '../utils/helpers';
import { monthlyRevenueData, fleetUtilizationData } from '../utils/dummy';
import toast from 'react-hot-toast';

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
            {typeof p.value === 'number' && p.value > 100 ? formatCurrency(p.value) : `${p.value}${p.name.includes('%') || p.name.includes('utiliz') ? '%' : ''}`}
          </span>
        </div>
      ))}
    </div>
  );
};

const Reports = () => {
  const [efficiencyData, setEfficiencyData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    reportsAPI.getFuelEfficiency().then(data => {
      setEfficiencyData(data.filter(d => d.totalDistance > 0));
      setLoading(false);
    });
  }, []);

  const handleExportEfficiency = () => {
    exportToCSV(efficiencyData, 'fuel_efficiency_report');
    toast.success('CSV exported successfully!');
  };

  const handleExportRevenue = () => {
    exportToCSV(monthlyRevenueData, 'revenue_report');
    toast.success('Revenue report exported!');
  };

  const avgEfficiency = efficiencyData.length
    ? (efficiencyData.reduce((s, d) => s + Number(d.efficiency || 0), 0) / efficiencyData.length).toFixed(2)
    : 0;

  const totalRevenue = monthlyRevenueData.reduce((s, d) => s + d.revenue, 0);
  const totalExpenses = monthlyRevenueData.reduce((s, d) => s + d.expenses, 0);
  const netProfit = totalRevenue - totalExpenses;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Reports</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>Fleet performance & financial reports</p>
        </div>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Revenue (YTD)', value: formatCurrency(totalRevenue), color: '#22C55E', icon: DollarSign },
          { label: 'Total Expenses (YTD)', value: formatCurrency(totalExpenses), color: '#EF4444', icon: TrendingUp },
          { label: 'Net Profit (YTD)', value: formatCurrency(netProfit), color: '#875A7B', icon: BarChart3 },
          { label: 'Avg Fuel Efficiency', value: `${avgEfficiency} km/L`, color: '#3B82F6', icon: Gauge },
        ].map((kpi, i) => (
          <motion.div key={kpi.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }} className="card p-4">
            <div className="flex items-center gap-2 mb-2">
              <kpi.icon size={14} style={{ color: kpi.color }} />
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{kpi.label}</span>
            </div>
            <div className="text-xl font-bold" style={{ color: kpi.color }}>{kpi.value}</div>
          </motion.div>
        ))}
      </div>

      {/* Revenue Chart */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="card p-5">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Monthly Revenue & Expenses</h3>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>January – July 2026</p>
          </div>
          <Button variant="secondary" size="sm" icon={Download} onClick={handleExportRevenue}>
            Export CSV
          </Button>
        </div>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={monthlyRevenueData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
            <Bar dataKey="revenue" name="Revenue" fill="#875A7B" radius={[4, 4, 0, 0]} maxBarSize={32} />
            <Bar dataKey="expenses" name="Expenses" fill="#3B82F6" radius={[4, 4, 0, 0]} maxBarSize={32} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Fleet Utilization Chart */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="card p-5">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Fleet Utilization (%)</h3>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>Monthly fleet utilization rate</p>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={fleetUtilizationData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} />
            <YAxis domain={[60, 100]} tick={{ fontSize: 11 }} unit="%" />
            <Tooltip content={<CustomTooltip />} />
            <Line type="monotone" dataKey="utilization" name="Utilization %" stroke="#875A7B"
              strokeWidth={2.5} dot={{ r: 4, fill: '#875A7B' }} activeDot={{ r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Vehicle Efficiency & ROI Table */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        className="card overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: 'var(--border-color)' }}>
          <div>
            <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Vehicle ROI & Fuel Efficiency</h3>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
              ROI = (Revenue - Maintenance - Fuel) / Acquisition Cost × 100
            </p>
          </div>
          <Button variant="secondary" size="sm" icon={Download} onClick={handleExportEfficiency}>
            Export CSV
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Vehicle</th>
                <th>Model</th>
                <th>Efficiency (km/L)</th>
                <th>Total Distance</th>
                <th>Fuel Cost</th>
                <th>Maint. Cost</th>
                <th>Total Cost</th>
                <th>Revenue</th>
                <th>ROI %</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 9 }).map((_, j) => (
                      <td key={j}><div className="skeleton h-4 rounded w-16" /></td>
                    ))}
                  </tr>
                ))
              ) : efficiencyData.map((d, i) => (
                <motion.tr key={d.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}>
                  <td><span className="font-mono text-xs font-semibold" style={{ color: '#875A7B' }}>{d.vehicle}</span></td>
                  <td className="text-xs">{d.name}</td>
                  <td>
                    <span className="badge-available text-xs">{d.efficiency} km/L</span>
                  </td>
                  <td className="text-xs">{formatNumber(d.totalDistance)} km</td>
                  <td className="text-xs">{formatCurrency(d.fuelCost)}</td>
                  <td className="text-xs">{formatCurrency(d.maintenanceCost)}</td>
                  <td className="text-xs font-medium">{formatCurrency(d.totalCost)}</td>
                  <td className="text-xs font-medium" style={{ color: '#22C55E' }}>{formatCurrency(d.revenue)}</td>
                  <td>
                    <span className={`badge text-xs font-semibold ${Number(d.roi) > 0 ? 'badge-available' : 'badge-retired'}`}>
                      {Number(d.roi) > 0 ? '+' : ''}{d.roi}%
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default Reports;
