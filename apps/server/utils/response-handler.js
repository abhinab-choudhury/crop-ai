export const sendResponse = (res, statusCode, message, data = null) => {
  return res.status(statusCode).json({
    success: statusCode >= 400 ? false : true,
    message,
    data,
  });
};
