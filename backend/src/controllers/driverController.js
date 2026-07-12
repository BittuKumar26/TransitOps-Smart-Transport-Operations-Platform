import Driver from '../models/Driver.js';
import { sendSuccess } from '../utils/responseHandler.js';

export const listDrivers = async (req, res, next) => {
  try {
    const drivers = await Driver.find().sort({ createdAt: -1 });
    sendSuccess(res, drivers);
  } catch (error) {
    next(error);
  }
};

export const createDriver = async (req, res, next) => {
  try {
    const driver = await Driver.create(req.body);
    sendSuccess(res, driver, 'Driver created', 201);
  } catch (error) {
    next(error);
  }
};

export const updateDriver = async (req, res, next) => {
  try {
    const driver = await Driver.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!driver) return res.status(404).json({ message: 'Driver not found' });
    sendSuccess(res, driver, 'Driver updated');
  } catch (error) {
    next(error);
  }
};

export const deleteDriver = async (req, res, next) => {
  try {
    const driver = await Driver.findByIdAndDelete(req.params.id);
    if (!driver) return res.status(404).json({ message: 'Driver not found' });
    sendSuccess(res, null, 'Driver deleted');
  } catch (error) {
    next(error);
  }
};
