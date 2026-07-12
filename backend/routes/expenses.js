import express from 'express';
import Expense from '../models/Expense.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = express.Router();

// @desc    Get all expenses
// @route   GET /api/v1/expenses
router.get('/', protect, async (req, res) => {
  const { category } = req.query;
  const filter = {};
  if (category) filter.category = category;

  try {
    const expenses = await Expense.find(filter).sort({ date: -1 });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create new expense
// @route   POST /api/v1/expenses
router.post('/', protect, restrictTo('fleet_manager', 'financial_analyst'), async (req, res) => {
  try {
    const expense = new Expense({
      ...req.body,
      approvedBy: req.user.name
    });
    const created = await expense.save();
    res.status(201).json(created);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Delete expense
// @route   DELETE /api/v1/expenses/:id
router.delete('/:id', protect, restrictTo('fleet_manager', 'financial_analyst'), async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) return res.status(404).json({ message: 'Expense not found' });
    await expense.deleteOne();
    res.json({ success: true, message: 'Expense deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
