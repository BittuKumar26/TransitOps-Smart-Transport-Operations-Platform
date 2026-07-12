import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
    role: { type: String, required: true, enum: ['Admin', 'Fleet Manager', 'Dispatcher', 'Safety Officer', 'Financial Analyst'], default: 'Dispatcher' }
  },
  { timestamps: true }
);

export default mongoose.model('User', userSchema);
