import mongoose from 'mongoose';

const driverSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    license: { type: String, required: true, unique: true, trim: true },
    expiry: { type: Date, required: true },
    status: { type: String, enum: ['Available', 'On Trip', 'Suspended', 'Inactive'], default: 'Available' },
    safetyScore: { type: Number, default: 100, min: 0, max: 100 }
  },
  { timestamps: true }
);

export default mongoose.model('Driver', driverSchema);
