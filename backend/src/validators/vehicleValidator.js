export const validateVehiclePayload = ({ registrationNo, vehicleName, type, capacity }) => {
  const errors = [];

  if (!registrationNo) errors.push('Registration number is required');
  if (!vehicleName) errors.push('Vehicle name is required');
  if (!type) errors.push('Vehicle type is required');
  if (capacity === undefined || capacity === null || Number(capacity) <= 0) errors.push('Capacity must be greater than zero');

  return errors;
};
