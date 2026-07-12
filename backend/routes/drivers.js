import express from 'express';
import Driver from '../models/Driver.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = express.Router();

// @desc    Get all drivers
// @route   GET /api/v1/drivers
router.get('/', protect, async (req, res) => {
  const { status, licenseCategory, region } = req.query;
  const filter = {};
  if (status) filter.status = status;
  if (licenseCategory) filter.licenseCategory = licenseCategory;
  if (region) filter.region = region;

  try {
    const drivers = await Driver.find(filter).sort({ createdAt: -1 });
    res.json(drivers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get driver by ID
// @route   GET /api/v1/drivers/:id
router.get('/:id', protect, async (req, res) => {
  try {
    const driver = await Driver.findById(req.params.id);
    if (!driver) return res.status(404).json({ message: 'Driver not found' });
    res.json(driver);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create new driver
// @route   POST /api/v1/drivers
router.post('/', protect, restrictTo('fleet_manager', 'safety_officer'), async (req, res) => {
  try {
    const driver = new Driver(req.body);
    const created = await driver.save();
    res.status(201).json(created);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Update driver
// @route   PUT /api/v1/drivers/:id
router.put('/:id', protect, restrictTo('fleet_manager', 'safety_officer'), async (req, res) => {
  try {
    const driver = await Driver.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!driver) return res.status(404).json({ message: 'Driver not found' });
    res.json(driver);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Delete driver
// @route   DELETE /api/v1/drivers/:id
router.delete('/:id', protect, restrictTo('fleet_manager', 'safety_officer'), async (req, res) => {
  try {
    const driver = await Driver.findById(req.params.id);
    if (!driver) return res.status(404).json({ message: 'Driver not found' });
    await driver.deleteOne();
    res.json({ success: true, message: 'Driver removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
