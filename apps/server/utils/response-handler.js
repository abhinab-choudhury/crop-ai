export const sendResponse = (res, statusCode, message, data = null) => {
  return res.json({
    status: statusCode,
    success: statusCode >= 400 ? false : true,
    message,
    data,
  });
};
