export const validateTripPayload = ({ vehicleId, driverId, source, destination, weight }) => {
  const errors = [];

  if (!vehicleId) errors.push('Vehicle is required');
  if (!driverId) errors.push('Driver is required');
  if (!source) errors.push('Source is required');
  if (!destination) errors.push('Destination is required');
  if (weight === undefined || weight === null || Number(weight) <= 0) errors.push('Weight must be greater than zero');

  return errors;
};
