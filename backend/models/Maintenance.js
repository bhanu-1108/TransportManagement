import mongoose from 'mongoose';

const maintenanceSchema = new mongoose.Schema({
  vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
  vehicle: { type: String, required: true }, // regNumber cached
  type: { type: String, required: true }, // e.g. Oil Change
  description: { type: String },
  cost: { type: Number, default: 0 },
  date: { type: String, required: true }, // YYYY-MM-DD
  vendor: { type: String },
  status: {
    type: String,
    enum: ['In Progress', 'Completed'],
    default: 'In Progress'
  },
  nextServiceKm: { type: Number }
}, { timestamps: true });

const Maintenance = mongoose.model('Maintenance', maintenanceSchema);
export default Maintenance;
