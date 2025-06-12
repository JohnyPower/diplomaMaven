const { StatusCodes } = require('http-status-codes');

module.exports = (err, req, res) => {
  res.locals.error = err;
  const status = err.status || 500;
  res.status(status).json({
    success: false,
    message: err.message.replace(/"/g, ''),
    error: 'The request is broken, contact the backend developer. It should not be!',
    errorCode: StatusCodes.INTERNAL_SERVER_ERROR
  });
};
