import FuelLog from '../models/FuelLog.js';
import { sendSuccess } from '../utils/responseHandler.js';

export const listFuelLogs = async (req, res, next) => {
  try {
    const fuelLogs = await FuelLog.find().populate('vehicleId').sort({ createdAt: -1 });
    sendSuccess(res, fuelLogs);
  } catch (error) {
    next(error);
  }
};

export const createFuelLog = async (req, res, next) => {
  try {
    const fuelLog = await FuelLog.create(req.body);
    sendSuccess(res, fuelLog, 'Fuel log created', 201);
  } catch (error) {
    next(error);
  }
};
