import Maintenance from '../models/Maintenance.js';
import Vehicle from '../models/Vehicle.js';
import { sendSuccess } from '../utils/responseHandler.js';

const findMaintenanceByIdOrFail = async (id, res) => {
  const maintenance = await Maintenance.findById(id);

  if (!maintenance) {
    res.status(404).json({ message: 'Maintenance not found' });
    return null;
  }

  return maintenance;
};

export const listMaintenance = async (req, res, next) => {
  try {
    const page = Math.max(Number(req.query.page || 1), 1);
    const limit = Math.min(Math.max(Number(req.query.limit || 25), 1), 100);
    const skip = (page - 1) * limit;
    const status = (req.query.status || '').trim();

    const query = {};

    if (status) {
      query.status = status;
    }

    const [items, totalCount] = await Promise.all([
      Maintenance.find(query).populate('vehicleId').sort({ createdAt: -1 }).skip(skip).limit(limit),
      Maintenance.countDocuments(query)
    ]);

    res.setHeader('X-Page', String(page));
    res.setHeader('X-Limit', String(limit));
    res.setHeader('X-Total-Count', String(totalCount));
    sendSuccess(res, items);
  } catch (error) {
    next(error);
  }
};

export const createMaintenance = async (req, res, next) => {
  try {
    if (!req.body.vehicleId || !req.body.description) {
      return res.status(400).json({ message: 'Vehicle and description are required' });
    }

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
    const maintenance = await findMaintenanceByIdOrFail(req.params.id, res);
    if (!maintenance) return;

    if (maintenance.status === 'Closed') {
      return res.status(400).json({ message: 'Maintenance is already closed' });
    }

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

export const deleteMaintenance = async (req, res, next) => {
  try {
    const maintenance = await findMaintenanceByIdOrFail(req.params.id, res);
    if (!maintenance) return;

    await maintenance.deleteOne();
    sendSuccess(res, null, 'Maintenance deleted');
  } catch (error) {
    next(error);
  }
};
