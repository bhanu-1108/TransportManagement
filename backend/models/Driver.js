import mongoose from 'mongoose';

const driverSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  licenseNo: { type: String, required: true },
  licenseCategory: { type: String, required: true },
  licenseExpiry: { type: String, required: true }, // YYYY-MM-DD
  contact: { type: String },
  status: {
    type: String,
    enum: ['Available', 'On Trip', 'Off Duty', 'Suspended'],
    default: 'Available'
  },
  safetyScore: { type: Number, default: 90, min: 0, max: 100 },
  region: {
    type: String,
    enum: ['North', 'South', 'East', 'West'],
    required: true
  },
  joiningDate: { type: String }, // YYYY-MM-DD
  trips: { type: Number, default: 0 }
}, { timestamps: true });

const Driver = mongoose.model('Driver', driverSchema);
export default Driver;
