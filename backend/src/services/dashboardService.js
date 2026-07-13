export const getFleetSummary = async ({ Vehicle, Driver, Trip, FuelLog, Expense, Maintenance }) => {
  const [
    totalVehicles,
    availableVehicles,
    vehiclesOnTrip,
    inShopVehicles,
    totalDrivers,
    availableDrivers,
    activeTrips,
    totalTrips,
    fuelSummary,
    expenseSummary,
    maintenanceSummary,
    vehicleStatusChart,
    monthlyExpenseChart
  ] = await Promise.all([
    Vehicle.countDocuments(),
    Vehicle.countDocuments({ status: 'Available' }),
    Vehicle.countDocuments({ status: 'On Trip' }),
    Vehicle.countDocuments({ status: 'In Shop' }),
    Driver.countDocuments(),
    Driver.countDocuments({ status: 'Available' }),
    Trip.countDocuments({ status: 'Dispatched' }),
    Trip.countDocuments(),
    FuelLog.aggregate([{ $group: { _id: null, totalCost: { $sum: '$cost' } } }]),
    Expense.aggregate([{ $group: { _id: null, totalAmount: { $sum: '$amount' } } }]),
    Maintenance.aggregate([{ $group: { _id: null, totalCost: { $sum: '$cost' } } }]),
    Vehicle.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
    Expense.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
          amount: { $sum: '$amount' }
        }
      },
      { $sort: { _id: 1 } }
    ])
  ]);

  const totalFuelCost = fuelSummary[0]?.totalCost || 0;
  const totalExpenseAmount = expenseSummary[0]?.totalAmount || 0;
  const totalMaintenanceCost = maintenanceSummary[0]?.totalCost || 0;
  const fleetUtilization = totalVehicles ? Number(((vehiclesOnTrip / totalVehicles) * 100).toFixed(2)) : 0;

  const normalizedVehicleStatusChart = ['Available', 'On Trip', 'In Shop', 'Inactive'].map((status) => ({
    status,
    count: vehicleStatusChart.find((item) => item._id === status)?.count || 0
  }));

  const latestTrips = await Trip.find().populate('vehicleId driverId').sort({ createdAt: -1 }).limit(5);
  const recentMaintenance = await Maintenance.find().populate('vehicleId').sort({ createdAt: -1 }).limit(5);

  return {
    totalVehicles,
    availableVehicles,
    vehiclesOnTrip,
    inShopVehicles,
    totalDrivers,
    availableDrivers,
    activeTrips,
    totalTrips,
    fleetUtilization,
    totalFuelCost,
    totalExpenseAmount,
    totalMaintenanceCost,
    totalOperationalCost: Number((totalFuelCost + totalMaintenanceCost + totalExpenseAmount).toFixed(2)),
    vehicleStatusChart: normalizedVehicleStatusChart,
    monthlyExpenseChart: monthlyExpenseChart.map((item) => ({ month: item._id, amount: item.amount })),
    latestTrips,
    recentMaintenance
  };
};
