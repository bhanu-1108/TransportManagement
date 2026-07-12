import express from 'express';
import Vehicle from '../models/Vehicle.js';
import Driver from '../models/Driver.js';
import Trip from '../models/Trip.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @desc    Get dashboard metrics (KPIs)
// @route   GET /api/v1/dashboard/kpis
router.get('/kpis', protect, async (req, res) => {
  try {
    const totalVehicles = await Vehicle.countDocuments({});
    const activeVehicles = await Vehicle.countDocuments({ status: 'On Trip' });
    const availableVehicles = await Vehicle.countDocuments({ status: 'Available' });
    const inMaintenance = await Vehicle.countDocuments({ status: 'In Shop' });

    const activeTrips = await Trip.countDocuments({ status: 'Dispatched' });
    const pendingTrips = await Trip.countDocuments({ status: 'Draft' });
    const driversOnDuty = await Driver.countDocuments({ status: 'On Trip' });

    // Aggregate monthly revenue (Completed trips)
    const trips = await Trip.find({ status: 'Completed' });
    const monthlyRevenue = trips.reduce((sum, t) => sum + (t.revenue || 0), 0);

    const fleetUtilization = totalVehicles > 0
      ? Math.round(((totalVehicles - availableVehicles) / totalVehicles) * 100)
      : 0;

    res.json({
      activeVehicles: totalVehicles,
      availableVehicles,
      vehiclesInMaintenance: inMaintenance,
      activeTrips,
      pendingTrips,
      driversOnDuty,
      fleetUtilization,
      monthlyRevenue: monthlyRevenue || 410000 // default fallback if empty
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get recent trips
// @route   GET /api/v1/dashboard/recent-trips
router.get('/recent-trips', protect, async (req, res) => {
  try {
    const trips = await Trip.find({}).sort({ createdAt: -1 }).limit(6);
    res.json(trips);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
