import mongoose from 'mongoose';

const fuelLogSchema = new mongoose.Schema({
  vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
  vehicle: { type: String, required: true }, // regNumber cached
  date: { type: String, required: true }, // YYYY-MM-DD
  liters: { type: Number, required: true },
  costPerLiter: { type: Number, required: true },
  totalCost: { type: Number, required: true }, // liters * costPerLiter
  odometer: { type: Number },
  station: { type: String }
}, { timestamps: true });

const FuelLog = mongoose.model('FuelLog', fuelLogSchema);
export default FuelLog;
