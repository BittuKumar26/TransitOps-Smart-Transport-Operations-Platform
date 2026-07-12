import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import env from './env.js';

export const seedDefaultAdmin = async () => {
  const existingAdmin = await User.findOne({ email: env.defaultAdminEmail });

  if (existingAdmin) {
    return existingAdmin;
  }

  const hashedPassword = await bcrypt.hash(env.defaultAdminPassword, 10);
  return User.create({
    name: env.defaultAdminName,
    email: env.defaultAdminEmail,
    password: hashedPassword,
    role: 'Admin'
  });
};