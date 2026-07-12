import Maintenance from '../models/Maintenance.js';
import Vehicle from '../models/Vehicle.js';
import { sendSuccess } from '../utils/responseHandler.js';

export const listMaintenance = async (req, res, next) => {
  try {
    const items = await Maintenance.find().populate('vehicleId').sort({ createdAt: -1 });
    sendSuccess(res, items);
  } catch (error) {
    next(error);
  }
};

export const createMaintenance = async (req, res, next) => {
  try {
    const maintenance = await Maintenance.create(req.body);
    const vehicle = await Vehicle.findById(req.body.vehicleId);
    if (vehicle) {
      vehicle.status = 'In Shop';
      await vehicle.save();
    }
    sendSuccess(res, maintenance, 'Maintenance created', 201);
  } catch (error) {
    next(error);
  }
};

export const closeMaintenance = async (req, res, next) => {
  try {
    const maintenance = await Maintenance.findById(req.params.id);
    if (!maintenance) return res.status(404).json({ message: 'Maintenance not found' });

    maintenance.status = 'Closed';
    await maintenance.save();

    const vehicle = await Vehicle.findById(maintenance.vehicleId);
    if (vehicle) {
      vehicle.status = 'Available';
      await vehicle.save();
    }

    sendSuccess(res, maintenance, 'Maintenance closed');
  } catch (error) {
    next(error);
  }
};
