import Trip from '../models/Trip.js';
import FuelLog from '../models/FuelLog.js';
import Expense from '../models/Expense.js';
import Maintenance from '../models/Maintenance.js';
import { buildReportOverview } from '../services/reportService.js';
import { exportToCSV } from '../utils/csvExport.js';
import { sendSuccess } from '../utils/responseHandler.js';

export const getReports = async (req, res, next) => {
  try {
    const overview = await buildReportOverview({ Trip, FuelLog, Expense, Maintenance });
    sendSuccess(res, overview);
  } catch (error) {
    next(error);
  }
};

export const exportReportCsv = async (req, res, next) => {
  try {
    const overview = await buildReportOverview({ Trip, FuelLog, Expense, Maintenance });

    const rows = [
      ...overview.tripStatus.map((item) => ({ section: 'tripStatus', label: item.status, value: item.count })),
      { section: 'fuel', label: 'totalLiters', value: overview.fuel.totalLiters },
      { section: 'fuel', label: 'totalCost', value: overview.fuel.totalCost },
      ...overview.expensesByType.map((item) => ({ section: 'expensesByType', label: item.type, value: item.amount })),
      ...overview.maintenanceSummary.map((item) => ({ section: 'maintenanceSummary', label: `${item.status} count`, value: item.count })),
      ...overview.maintenanceSummary.map((item) => ({ section: 'maintenanceSummary', label: `${item.status} cost`, value: item.cost }))
    ];

    const csv = exportToCSV(rows);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="transitops-report-${Date.now()}.csv"`);
    res.status(200).send(csv);
  } catch (error) {
    next(error);
  }
};
