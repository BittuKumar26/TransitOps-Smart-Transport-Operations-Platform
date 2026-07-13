import Vehicle from '../models/Vehicle.js';
import { sendSuccess } from '../utils/responseHandler.js';

const findVehicleByIdOrFail = async (id, res) => {
  const vehicle = await Vehicle.findById(id);

  if (!vehicle) {
    res.status(404).json({ message: 'Vehicle not found' });
    return null;
  }

  return vehicle;
};

export const listVehicles = async (req, res, next) => {
  try {
    const page = Math.max(Number(req.query.page || 1), 1);
    const limit = Math.min(Math.max(Number(req.query.limit || 25), 1), 100);
    const skip = (page - 1) * limit;
    const search = (req.query.search || '').trim();
    const status = (req.query.status || '').trim();

    const query = {};

    if (status) {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { registrationNo: { $regex: search, $options: 'i' } },
        { vehicleName: { $regex: search, $options: 'i' } },
        { type: { $regex: search, $options: 'i' } }
      ];
    }

    const [vehicles, totalCount] = await Promise.all([
      Vehicle.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Vehicle.countDocuments(query)
    ]);

    res.setHeader('X-Page', String(page));
    res.setHeader('X-Limit', String(limit));
    res.setHeader('X-Total-Count', String(totalCount));
    sendSuccess(res, vehicles);
  } catch (error) {
    next(error);
  }
};

export const createVehicle = async (req, res, next) => {
  try {
    const existingVehicle = await Vehicle.findOne({ registrationNo: req.body.registrationNo });

    if (existingVehicle) {
      return res.status(400).json({ message: 'Registration number already exists' });
    }

    const vehicle = await Vehicle.create(req.body);
    sendSuccess(res, vehicle, 'Vehicle created', 201);
  } catch (error) {
    next(error);
  }
};

export const getVehicleById = async (req, res, next) => {
  try {
    const vehicle = await findVehicleByIdOrFail(req.params.id, res);
    if (!vehicle) return;
    sendSuccess(res, vehicle);
  } catch (error) {
    next(error);
  }
};

export const updateVehicle = async (req, res, next) => {
  try {
    const vehicle = await findVehicleByIdOrFail(req.params.id, res);
    if (!vehicle) return;

    if (req.body.registrationNo && req.body.registrationNo !== vehicle.registrationNo) {
      const duplicateVehicle = await Vehicle.findOne({ registrationNo: req.body.registrationNo });

      if (duplicateVehicle) {
        return res.status(400).json({ message: 'Registration number already exists' });
      }
    }

    Object.assign(vehicle, req.body);
    await vehicle.save();
    sendSuccess(res, vehicle, 'Vehicle updated');
  } catch (error) {
    next(error);
  }
};

export const deleteVehicle = async (req, res, next) => {
  try {
    const vehicle = await findVehicleByIdOrFail(req.params.id, res);
    if (!vehicle) return;

    await vehicle.deleteOne();
    sendSuccess(res, null, 'Vehicle deleted');
  } catch (error) {
    next(error);
  }
};
