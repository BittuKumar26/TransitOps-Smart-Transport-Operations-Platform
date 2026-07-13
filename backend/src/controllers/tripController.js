import Trip from '../models/Trip.js';
import Vehicle from '../models/Vehicle.js';
import Driver from '../models/Driver.js';
import { sendSuccess } from '../utils/responseHandler.js';

const findTripByIdOrFail = async (id, res) => {
  const trip = await Trip.findById(id);

  if (!trip) {
    res.status(404).json({ message: 'Trip not found' });
    return null;
  }

  return trip;
};

const validateTripPayload = ({ source, destination, weight, distance, fuel }) => {
  if (!source || !destination) {
    return 'Source and destination are required';
  }

  if (String(source).trim().toLowerCase() === String(destination).trim().toLowerCase()) {
    return 'Source and destination must be different';
  }

  if (Number(weight) <= 0) {
    return 'Weight must be greater than zero';
  }

  if (Number(distance || 0) < 0) {
    return 'Distance cannot be negative';
  }

  if (Number(fuel || 0) < 0) {
    return 'Fuel cannot be negative';
  }

  return null;
};

const validateDriverAndVehicleForTrip = async ({ vehicleId, driverId, weight }) => {
  const [vehicle, driver] = await Promise.all([Vehicle.findById(vehicleId), Driver.findById(driverId)]);

  if (!vehicle) {
    return { error: 'Vehicle not found' };
  }

  if (!driver) {
    return { error: 'Driver not found' };
  }

  if (vehicle.status === 'In Shop' || vehicle.status === 'Inactive') {
    return { error: 'Selected vehicle is not operational' };
  }

  if (driver.status === 'Suspended' || driver.status === 'Inactive') {
    return { error: 'Selected driver is not operational' };
  }

  if (new Date(driver.expiry) < new Date()) {
    return { error: 'Driver license expired' };
  }

  if (Number(weight) > Number(vehicle.capacity)) {
    return { error: 'Cargo exceeds vehicle capacity' };
  }

  return { vehicle, driver };
};

export const listTrips = async (req, res, next) => {
  try {
    const page = Math.max(Number(req.query.page || 1), 1);
    const limit = Math.min(Math.max(Number(req.query.limit || 25), 1), 100);
    const skip = (page - 1) * limit;
    const status = (req.query.status || '').trim();
    const search = (req.query.search || '').trim();

    const query = {};

    if (status) {
      query.status = status;
    }

    if (search) {
      query.$or = [{ source: { $regex: search, $options: 'i' } }, { destination: { $regex: search, $options: 'i' } }];
    }

    const [trips, totalCount] = await Promise.all([
      Trip.find(query).populate('vehicleId driverId').sort({ createdAt: -1 }).skip(skip).limit(limit),
      Trip.countDocuments(query)
    ]);

    res.setHeader('X-Page', String(page));
    res.setHeader('X-Limit', String(limit));
    res.setHeader('X-Total-Count', String(totalCount));
    sendSuccess(res, trips);
  } catch (error) {
    next(error);
  }
};

export const createTrip = async (req, res, next) => {
  try {
    const payloadError = validateTripPayload(req.body);

    if (payloadError) {
      return res.status(400).json({ message: payloadError });
    }

    const validation = await validateDriverAndVehicleForTrip(req.body);

    if (validation.error) {
      return res.status(400).json({ message: validation.error });
    }

    const trip = await Trip.create({
      ...req.body,
      status: 'Draft'
    });

    sendSuccess(res, trip, 'Trip created', 201);
  } catch (error) {
    next(error);
  }
};

export const getTripById = async (req, res, next) => {
  try {
    const trip = await Trip.findById(req.params.id).populate('vehicleId driverId');

    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    sendSuccess(res, trip);
  } catch (error) {
    next(error);
  }
};

export const updateTrip = async (req, res, next) => {
  try {
    const trip = await findTripByIdOrFail(req.params.id, res);
    if (!trip) return;

    if (trip.status !== 'Draft') {
      return res.status(400).json({ message: 'Only draft trips can be updated' });
    }

    const nextPayload = {
      vehicleId: req.body.vehicleId ?? trip.vehicleId,
      driverId: req.body.driverId ?? trip.driverId,
      source: req.body.source ?? trip.source,
      destination: req.body.destination ?? trip.destination,
      weight: req.body.weight ?? trip.weight,
      distance: req.body.distance ?? trip.distance,
      fuel: req.body.fuel ?? trip.fuel
    };

    const payloadError = validateTripPayload(nextPayload);

    if (payloadError) {
      return res.status(400).json({ message: payloadError });
    }

    const validation = await validateDriverAndVehicleForTrip(nextPayload);

    if (validation.error) {
      return res.status(400).json({ message: validation.error });
    }

    Object.assign(trip, req.body);
    await trip.save();
    sendSuccess(res, trip, 'Trip updated');
  } catch (error) {
    next(error);
  }
};

export const deleteTrip = async (req, res, next) => {
  try {
    const trip = await findTripByIdOrFail(req.params.id, res);
    if (!trip) return;

    if (trip.status === 'Dispatched') {
      return res.status(400).json({ message: 'Dispatched trip cannot be deleted' });
    }

    await trip.deleteOne();
    sendSuccess(res, null, 'Trip deleted');
  } catch (error) {
    next(error);
  }
};

export const dispatchTrip = async (req, res, next) => {
  try {
    const trip = await findTripByIdOrFail(req.params.id, res);
    if (!trip) return;

    if (trip.status !== 'Draft') {
      return res.status(400).json({ message: 'Only draft trips can be dispatched' });
    }

    const vehicle = await Vehicle.findById(trip.vehicleId);
    const driver = await Driver.findById(trip.driverId);

    if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });
    if (!driver) return res.status(404).json({ message: 'Driver not found' });
    if (vehicle.status !== 'Available') return res.status(400).json({ message: 'Vehicle is not available' });
    if (driver.status !== 'Available') return res.status(400).json({ message: 'Driver is not available' });
    if (new Date(driver.expiry) < new Date()) return res.status(400).json({ message: 'Driver license expired' });
    if (Number(trip.weight) > vehicle.capacity) return res.status(400).json({ message: 'Cargo exceeds vehicle capacity' });

    trip.status = 'Dispatched';
    vehicle.status = 'On Trip';
    driver.status = 'On Trip';

    await trip.save();
    await vehicle.save();
    await driver.save();

    sendSuccess(res, trip, 'Trip dispatched');
  } catch (error) {
    next(error);
  }
};

export const completeTrip = async (req, res, next) => {
  try {
    const trip = await findTripByIdOrFail(req.params.id, res);
    if (!trip) return;

    if (trip.status !== 'Dispatched') {
      return res.status(400).json({ message: 'Only dispatched trips can be completed' });
    }

    const vehicle = await Vehicle.findById(trip.vehicleId);
    const driver = await Driver.findById(trip.driverId);

    trip.status = 'Completed';
    if (vehicle) vehicle.status = 'Available';
    if (driver) driver.status = 'Available';

    await trip.save();
    if (vehicle) await vehicle.save();
    if (driver) await driver.save();

    sendSuccess(res, trip, 'Trip completed');
  } catch (error) {
    next(error);
  }
};

export const cancelTrip = async (req, res, next) => {
  try {
    const trip = await findTripByIdOrFail(req.params.id, res);
    if (!trip) return;

    if (trip.status === 'Completed' || trip.status === 'Cancelled') {
      return res.status(400).json({ message: 'Completed or cancelled trip cannot be cancelled again' });
    }

    const vehicle = await Vehicle.findById(trip.vehicleId);
    const driver = await Driver.findById(trip.driverId);

    trip.status = 'Cancelled';
    if (vehicle) vehicle.status = 'Available';
    if (driver) driver.status = 'Available';

    await trip.save();
    if (vehicle) await vehicle.save();
    if (driver) await driver.save();

    sendSuccess(res, trip, 'Trip cancelled');
  } catch (error) {
    next(error);
  }
};
