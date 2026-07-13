export const sendSuccess = (res, data, message = 'Success', statusCode = 200) => {
  res.status(statusCode).json({ message, data });
};
