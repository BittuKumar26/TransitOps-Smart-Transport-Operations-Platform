import { buildReportOverview } from '../services/reportService.js';
import { sendSuccess } from '../utils/responseHandler.js';

export const getReports = async (req, res, next) => {
  try {
    const overview = await buildReportOverview();
    sendSuccess(res, overview);
  } catch (error) {
    next(error);
  }
};
