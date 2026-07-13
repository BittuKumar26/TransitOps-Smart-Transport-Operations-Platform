import mongoose from 'mongoose';

const tripSchema = new mongoose.Schema(
  {
    vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
    driverId: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver', required: true },
    source: { type: String, required: true, trim: true },
    destination: { type: String, required: true, trim: true },
    weight: { type: Number, required: true, min: 0 },
    distance: { type: Number, default: 0, min: 0 },
    fuel: { type: Number, default: 0, min: 0 },
    status: { type: String, enum: ['Draft', 'Dispatched', 'Completed', 'Cancelled'], default: 'Draft' }
  },
  { timestamps: true }
);

export default mongoose.model('Trip', tripSchema);
