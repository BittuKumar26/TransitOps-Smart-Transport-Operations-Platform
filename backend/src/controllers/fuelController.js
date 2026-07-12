import FuelLog from '../models/FuelLog.js';
import Vehicle from '../models/Vehicle.js';
import { sendSuccess } from '../utils/responseHandler.js';

const findFuelLogByIdOrFail = async (id, res) => {
  const fuelLog = await FuelLog.findById(id);

  if (!fuelLog) {
    res.status(404).json({ message: 'Fuel log not found' });
    return null;
  }

  return fuelLog;
};

export const listFuelLogs = async (req, res, next) => {
  try {
    const page = Math.max(Number(req.query.page || 1), 1);
    const limit = Math.min(Math.max(Number(req.query.limit || 25), 1), 100);
    const skip = (page - 1) * limit;

    const [fuelLogs, totalCount] = await Promise.all([
      FuelLog.find().populate('vehicleId').sort({ createdAt: -1 }).skip(skip).limit(limit),
      FuelLog.countDocuments()
    ]);

    res.setHeader('X-Page', String(page));
    res.setHeader('X-Limit', String(limit));
    res.setHeader('X-Total-Count', String(totalCount));
    sendSuccess(res, fuelLogs);
  } catch (error) {
    next(error);
  }
};

export const createFuelLog = async (req, res, next) => {
  try {
    const { vehicleId, liters, cost } = req.body;

    if (!vehicleId) {
      return res.status(400).json({ message: 'Vehicle is required' });
    }

    if (Number(liters) <= 0 || Number(cost) <= 0) {
      return res.status(400).json({ message: 'Liters and cost must be greater than zero' });
    }

    const vehicle = await Vehicle.findById(vehicleId);

    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    const fuelLog = await FuelLog.create(req.body);
    sendSuccess(res, fuelLog, 'Fuel log created', 201);
  } catch (error) {
    next(error);
  }
};

export const deleteFuelLog = async (req, res, next) => {
  try {
    const fuelLog = await findFuelLogByIdOrFail(req.params.id, res);
    if (!fuelLog) return;

    await fuelLog.deleteOne();
    sendSuccess(res, null, 'Fuel log deleted');
  } catch (error) {
    next(error);
  }
};
