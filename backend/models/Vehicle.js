import mongoose from 'mongoose';

const vehicleSchema = new mongoose.Schema({
  regNumber: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  type: {
    type: String,
    enum: ['Truck', 'Van', 'Bus', 'Trailer'],
    required: true
  },
  status: {
    type: String,
    enum: ['Available', 'On Trip', 'In Shop', 'Retired'],
    default: 'Available'
  },
  odometer: { type: Number, default: 0 },
  maxLoad: { type: Number, default: 0 },
  acquisitionCost: { type: Number, default: 0 },
  region: {
    type: String,
    enum: ['North', 'South', 'East', 'West'],
    required: true
  },
  year: { type: Number },
  fuelType: {
    type: String,
    enum: ['Diesel', 'Petrol', 'CNG', 'Electric'],
    default: 'Diesel'
  },
  lastService: { type: String } // YYYY-MM-DD
}, { timestamps: true });

const Vehicle = mongoose.model('Vehicle', vehicleSchema);
export default Vehicle;
