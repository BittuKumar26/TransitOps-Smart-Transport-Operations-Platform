export const validateDriverPayload = ({ name, license, expiry }) => {
  const errors = [];

  if (!name) errors.push('Driver name is required');
  if (!license) errors.push('License number is required');
  if (!expiry) errors.push('Expiry date is required');

  return errors;
};
