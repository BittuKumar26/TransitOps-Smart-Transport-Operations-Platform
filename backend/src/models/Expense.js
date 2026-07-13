import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema(
  {
    vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle' },
    type: { type: String, required: true, trim: true },
    amount: { type: Number, required: true, min: 0 }
  },
  { timestamps: true }
);

export default mongoose.model('Expense', expenseSchema);
