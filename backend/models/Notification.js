import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: {
    type: String,
    enum: ['warning', 'danger', 'success', 'info'],
    default: 'info'
  },
  read: { type: Boolean, default: false },
  time: { type: Date, default: Date.now }
}, { timestamps: true });

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
