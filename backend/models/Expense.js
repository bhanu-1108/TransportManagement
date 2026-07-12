import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema({
  vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
  vehicle: { type: String, required: true }, // regNumber cached
  category: {
    type: String,
    enum: ['Toll', 'Maintenance', 'Miscellaneous', 'Repairs', 'Insurance'],
    required: true
  },
  amount: { type: Number, required: true },
  date: { type: String, required: true }, // YYYY-MM-DD
  description: { type: String },
  tripId: { type: String }, // optional linked trip ID
  approvedBy: { type: String, default: 'Finance System' }
}, { timestamps: true });

const Expense = mongoose.model('Expense', expenseSchema);
export default Expense;
