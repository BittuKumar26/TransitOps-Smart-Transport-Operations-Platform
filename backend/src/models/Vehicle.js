import mongoose from 'mongoose';

const vehicleSchema = new mongoose.Schema(
  {
    registrationNo: { type: String, required: true, unique: true, trim: true },
    vehicleName: { type: String, required: true, trim: true },
    type: { type: String, required: true, trim: true },
    capacity: { type: Number, required: true, min: 0 },
    odometer: { type: Number, default: 0, min: 0 },
    cost: { type: Number, default: 0, min: 0 },
    status: { type: String, enum: ['Available', 'On Trip', 'In Shop', 'Inactive'], default: 'Available' }
  },
  { timestamps: true }
);

export default mongoose.model('Vehicle', vehicleSchema);
