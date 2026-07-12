import mongoose from 'mongoose';

const maintenanceSchema = new mongoose.Schema(
  {
    vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
    description: { type: String, required: true, trim: true },
    cost: { type: Number, default: 0, min: 0 },
    status: { type: String, enum: ['Open', 'Closed'], default: 'Open' }
  },
  { timestamps: true }
);

export default mongoose.model('Maintenance', maintenanceSchema);
