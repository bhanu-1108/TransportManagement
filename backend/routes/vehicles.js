import express from 'express';
import Vehicle from '../models/Vehicle.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = express.Router();

// @desc    Get all vehicles
// @route   GET /api/v1/vehicles
router.get('/', protect, async (req, res) => {
  const { type, status, region } = req.query;
  const filter = {};
  if (type) filter.type = type;
  if (status) filter.status = status;
  if (region) filter.region = region;

  try {
    const vehicles = await Vehicle.find(filter).sort({ createdAt: -1 });
    res.json(vehicles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get vehicle by ID
// @route   GET /api/v1/vehicles/:id
router.get('/:id', protect, async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });
    res.json(vehicle);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create new vehicle
// @route   POST /api/v1/vehicles
router.post('/', protect, restrictTo('fleet_manager'), async (req, res) => {
  try {
    const vehicle = new Vehicle(req.body);
    const created = await vehicle.save();
    res.status(201).json(created);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Update vehicle
// @route   PUT /api/v1/vehicles/:id
router.put('/:id', protect, restrictTo('fleet_manager'), async (req, res) => {
  try {
    const vehicle = await Vehicle.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });
    res.json(vehicle);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Delete vehicle
// @route   DELETE /api/v1/vehicles/:id
router.delete('/:id', protect, restrictTo('fleet_manager'), async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });
    await vehicle.deleteOne();
    res.json({ success: true, message: 'Vehicle removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
