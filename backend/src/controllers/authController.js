import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import env from '../config/env.js';
import { validateAuthPayload } from '../validators/authValidator.js';

const signToken = (id) => jwt.sign({ id }, env.jwtSecret, { expiresIn: env.jwtExpiresIn });

export const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    const payloadErrors = validateAuthPayload({ name, email, password });

    if (payloadErrors.length) {
      return res.status(400).json({ message: payloadErrors.join(', ') });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'Admin'
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: signToken(user._id)
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: signToken(user._id)
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    res.json({
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role
    });
  } catch (error) {
    next(error);
  }
};
