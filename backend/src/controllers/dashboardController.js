import Vehicle from '../models/Vehicle.js';
import Driver from '../models/Driver.js';
import Trip from '../models/Trip.js';
import FuelLog from '../models/FuelLog.js';
import Expense from '../models/Expense.js';
import Maintenance from '../models/Maintenance.js';
import { getFleetSummary } from '../services/dashboardService.js';
import { sendSuccess } from '../utils/responseHandler.js';

export const getDashboard = async (req, res, next) => {
  try {
    const summary = await getFleetSummary({ Vehicle, Driver, Trip, FuelLog, Expense, Maintenance });
    sendSuccess(res, summary);
  } catch (error) {
    next(error);
  }
};
