export const validateAuthPayload = ({ name, email, password }) => {
  const errors = [];

  if (!name) errors.push('Name is required');
  if (!email) errors.push('Email is required');
  if (!password || password.length < 6) errors.push('Password must be at least 6 characters');

  return errors;
};
