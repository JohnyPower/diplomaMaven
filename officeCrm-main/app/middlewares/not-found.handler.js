const { StatusCodes } = require('http-status-codes');

module.exports = (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not exist.',
    error: 'Endpoint not exist.',
    errorCode: StatusCodes.NOT_FOUND
  });
};
