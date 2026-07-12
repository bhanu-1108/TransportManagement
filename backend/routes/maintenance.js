import express from 'express';
import Maintenance from '../models/Maintenance.js';
import Vehicle from '../models/Vehicle.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = express.Router();

// @desc    Get all maintenance logs
// @route   GET /api/v1/maintenance
router.get('/', protect, async (req, res) => {
  const { status, type } = req.query;
  const filter = {};
  if (status) filter.status = status;
  if (type) filter.type = type;

  try {
    const logs = await Maintenance.find(filter).sort({ date: -1 });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create maintenance log
// @route   POST /api/v1/maintenance
router.post('/', protect, restrictTo('fleet_manager', 'safety_officer'), async (req, res) => {
  const { vehicleId, status } = req.body;

  try {
    const log = new Maintenance(req.body);
    const created = await log.save();

    // Trigger Side Effect on Vehicle
    if (status === 'In Progress') {
      await Vehicle.findByIdAndUpdate(vehicleId, { status: 'In Shop' });
    } else if (status === 'Completed') {
      await Vehicle.findByIdAndUpdate(vehicleId, { status: 'Available' });
    }

    res.status(201).json(created);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Update maintenance log
// @route   PUT /api/v1/maintenance/:id
router.put('/:id', protect, restrictTo('fleet_manager', 'safety_officer'), async (req, res) => {
  const { status, vehicleId } = req.body;

  try {
    const log = await Maintenance.findById(req.params.id);
    if (!log) return res.status(404).json({ message: 'Log not found' });

    Object.assign(log, req.body);
    const updated = await log.save();

    // Trigger Side Effect on Vehicle based on new status
    if (status === 'In Progress') {
      await Vehicle.findByIdAndUpdate(vehicleId, { status: 'In Shop' });
    } else if (status === 'Completed') {
      await Vehicle.findByIdAndUpdate(vehicleId, { status: 'Available' });
    }

    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Delete maintenance log
// @route   DELETE /api/v1/maintenance/:id
router.delete('/:id', protect, restrictTo('fleet_manager'), async (req, res) => {
  try {
    const log = await Maintenance.findById(req.params.id);
    if (!log) return res.status(404).json({ message: 'Log not found' });
    await log.deleteOne();
    res.json({ success: true, message: 'Maintenance record deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
