import Vehicle from '../models/Vehicle.js';
import Driver from '../models/Driver.js';
import Trip from '../models/Trip.js';
import { getFleetSummary } from '../services/dashboardService.js';
import { sendSuccess } from '../utils/responseHandler.js';

export const getDashboard = async (req, res, next) => {
  try {
    const summary = await getFleetSummary({ Vehicle, Driver, Trip });
    sendSuccess(res, summary);
  } catch (error) {
    next(error);
  }
};
