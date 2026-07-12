import express from 'express';
import Trip from '../models/Trip.js';
import Vehicle from '../models/Vehicle.js';
import Driver from '../models/Driver.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = express.Router();

// @desc    Get all trips
// @route   GET /api/v1/trips
router.get('/', protect, async (req, res) => {
  const filter = {};

  // Drivers only see their own trips
  if (req.user.role === 'driver') {
    filter.driver = req.user.name;
  }

  try {
    const trips = await Trip.find(filter).sort({ plannedDate: -1 });
    res.json(trips);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create a new trip
// @route   POST /api/v1/trips
router.post('/', protect, restrictTo('fleet_manager'), async (req, res) => {
  try {
    const trip = new Trip(req.body);
    const created = await trip.save();
    res.status(201).json(created);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Update trip
// @route   PUT /api/v1/trips/:id
router.put('/:id', protect, restrictTo('fleet_manager'), async (req, res) => {
  try {
    const trip = await Trip.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!trip) return res.status(404).json({ message: 'Trip not found' });
    res.json(trip);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Update trip status (operational logic)
// @route   PATCH /api/v1/trips/:id/status
router.patch('/:id/status', protect, restrictTo('fleet_manager', 'driver'), async (req, res) => {
  const { status } = req.body;

  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ message: 'Trip not found' });

    const originalStatus = trip.status;
    trip.status = status;

    if (status === 'Dispatched') {
      trip.eta = 'In Transit';
      // Set vehicle and driver to On Trip
      await Vehicle.findByIdAndUpdate(trip.vehicleId, { status: 'On Trip' });
      await Driver.findByIdAndUpdate(trip.driverId, { status: 'On Trip' });
    } else if (status === 'Completed') {
      trip.eta = 'Arrived';
      // Set vehicle and driver back to Available
      await Vehicle.findByIdAndUpdate(trip.vehicleId, {
        status: 'Available',
        $inc: { odometer: trip.distance || 0 }
      });
      await Driver.findByIdAndUpdate(trip.driverId, {
        status: 'Available',
        $inc: { trips: 1 }
      });
    } else if (status === 'Cancelled') {
      trip.eta = 'Cancelled';
      // Set vehicle and driver back to Available
      await Vehicle.findByIdAndUpdate(trip.vehicleId, { status: 'Available' });
      await Driver.findByIdAndUpdate(trip.driverId, { status: 'Available' });
    }

    const updated = await trip.save();
    res.json({ success: true, trip: updated });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Delete trip
// @route   DELETE /api/v1/trips/:id
router.delete('/:id', protect, restrictTo('fleet_manager'), async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ message: 'Trip not found' });
    await trip.deleteOne();
    res.json({ success: true, message: 'Trip removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
