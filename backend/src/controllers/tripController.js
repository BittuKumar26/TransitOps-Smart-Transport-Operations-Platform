import Trip from '../models/Trip.js';
import Vehicle from '../models/Vehicle.js';
import Driver from '../models/Driver.js';
import { sendSuccess } from '../utils/responseHandler.js';

export const listTrips = async (req, res, next) => {
  try {
    const trips = await Trip.find().populate('vehicleId driverId').sort({ createdAt: -1 });
    sendSuccess(res, trips);
  } catch (error) {
    next(error);
  }
};

export const createTrip = async (req, res, next) => {
  try {
    const trip = await Trip.create(req.body);
    sendSuccess(res, trip, 'Trip created', 201);
  } catch (error) {
    next(error);
  }
};

export const dispatchTrip = async (req, res, next) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ message: 'Trip not found' });

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
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ message: 'Trip not found' });

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
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ message: 'Trip not found' });

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
