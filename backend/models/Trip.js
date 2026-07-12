import mongoose from 'mongoose';

const tripSchema = new mongoose.Schema({
  source: { type: String, required: true },
  destination: { type: String, required: true },
  vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
  vehicle: { type: String, required: true }, // regNumber cached
  driverId: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver', required: true },
  driver: { type: String, required: true }, // name cached
  cargoWeight: { type: Number, default: 0 },
  distance: { type: Number, default: 0 },
  plannedDate: { type: String, required: true }, // YYYY-MM-DD
  revenue: { type: Number, default: 0 },
  status: {
    type: String,
    enum: ['Draft', 'Dispatched', 'Completed', 'Cancelled'],
    default: 'Draft'
  },
  eta: { type: String, default: 'Pending' },
  notes: { type: String }
}, { timestamps: true });

const Trip = mongoose.model('Trip', tripSchema);
export default Trip;
