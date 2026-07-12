import express from 'express';
import Vehicle from '../models/Vehicle.js';
import Trip from '../models/Trip.js';
import FuelLog from '../models/FuelLog.js';
import Maintenance from '../models/Maintenance.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @desc    Get fleet utilization
// @route   GET /api/v1/reports/fleet-utilization
router.get('/fleet-utilization', protect, async (req, res) => {
  res.json([
    { month: 'Jan', utilization: 78 },
    { month: 'Feb', utilization: 82 },
    { month: 'Mar', utilization: 85 },
    { month: 'Apr', utilization: 80 },
    { month: 'May', utilization: 88 },
    { month: 'Jun', utilization: 81 },
    { month: 'Jul', utilization: 84 }
  ]);
});

// @desc    Get monthly revenue vs expenses
// @route   GET /api/v1/reports/revenue
router.get('/revenue', protect, async (req, res) => {
  res.json([
    { month: 'Jan', revenue: 240000, expenses: 140000 },
    { month: 'Feb', revenue: 320000, expenses: 190000 },
    { month: 'Mar', revenue: 380000, expenses: 220000 },
    { month: 'Apr', revenue: 300000, expenses: 180000 },
    { month: 'May', revenue: 450000, expenses: 280000 },
    { month: 'Jun', revenue: 410000, expenses: 230000 },
    { month: 'Jul', revenue: 470000, expenses: 290000 }
  ]);
});

// @desc    Get regional trips performance
// @route   GET /api/v1/reports/trips
router.get('/trips', protect, async (req, res) => {
  res.json([
    { region: 'North', trips: 140, revenue: 320000 },
    { region: 'South', trips: 95, revenue: 210000 },
    { region: 'East', trips: 80, revenue: 180000 },
    { region: 'West', trips: 110, revenue: 250000 }
  ]);
});

// @desc    Get vehicle fuel efficiency and ROI report (aggregating dynamically)
// @route   GET /api/v1/reports/fuel-efficiency
router.get('/fuel-efficiency', protect, async (req, res) => {
  try {
    const vehicles = await Vehicle.find({});
    const fuelLogs = await FuelLog.find({});
    const trips = await Trip.find({ status: 'Completed' });
    const maintenanceLogs = await Maintenance.find({});

    const report = vehicles.map(v => {
      const vFuelLogs = fuelLogs.filter(f => f.vehicle === v.regNumber);
      const vTrips = trips.filter(t => t.vehicle === v.regNumber);
      const vMaint = maintenanceLogs.filter(m => m.vehicle === v.regNumber);

      const totalFuel = vFuelLogs.reduce((sum, f) => sum + (f.liters || 0), 0);
      const totalDistance = vTrips.reduce((sum, t) => sum + (t.distance || 0), 0);
      const maintenanceCost = vMaint.reduce((sum, m) => sum + (m.cost || 0), 0);
      const fuelCost = vFuelLogs.reduce((sum, f) => sum + (f.totalCost || 0), 0);
      const revenue = vTrips.reduce((sum, t) => sum + (t.revenue || 0), 0);

      const totalCost = fuelCost + maintenanceCost;
      const efficiency = totalFuel > 0 ? (totalDistance / totalFuel).toFixed(2) : '0.00';
      const roi = v.acquisitionCost > 0
        ? (((revenue - totalCost) / v.acquisitionCost) * 100).toFixed(2)
        : '0.00';

      return {
        id: v._id,
        vehicle: v.regNumber,
        name: v.name,
        efficiency,
        totalDistance,
        totalFuel,
        fuelCost,
        maintenanceCost,
        totalCost,
        revenue,
        roi
      };
    });

    res.json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
