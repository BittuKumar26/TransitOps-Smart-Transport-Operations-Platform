export const calculateFleetUtilization = (vehiclesOnTrip, totalVehicles) => {
  if (!totalVehicles) return 0;
  return Number(((vehiclesOnTrip / totalVehicles) * 100).toFixed(2));
};

export const calculateOperationalCost = (fuelCost, maintenanceCost) => {
  return Number((Number(fuelCost) + Number(maintenanceCost)).toFixed(2));
};
