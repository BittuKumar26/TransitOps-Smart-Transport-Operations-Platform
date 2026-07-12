export const buildReportOverview = async ({ Trip, FuelLog, Expense, Maintenance }) => {
  const [tripStatusRows, fuelRows, expenseRows, maintenanceRows] = await Promise.all([
    Trip.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }, { $sort: { _id: 1 } }]),
    FuelLog.aggregate([{ $group: { _id: null, liters: { $sum: '$liters' }, cost: { $sum: '$cost' } } }]),
    Expense.aggregate([{ $group: { _id: '$type', amount: { $sum: '$amount' } } }, { $sort: { amount: -1 } }]),
    Maintenance.aggregate([{ $group: { _id: '$status', cost: { $sum: '$cost' }, count: { $sum: 1 } } }, { $sort: { _id: 1 } }])
  ]);

  return {
    generatedAt: new Date().toISOString(),
    tripStatus: tripStatusRows.map((row) => ({ status: row._id, count: row.count })),
    fuel: {
      totalLiters: fuelRows[0]?.liters || 0,
      totalCost: fuelRows[0]?.cost || 0
    },
    expensesByType: expenseRows.map((row) => ({ type: row._id, amount: row.amount })),
    maintenanceSummary: maintenanceRows.map((row) => ({ status: row._id, count: row.count, cost: row.cost }))
  };
};
