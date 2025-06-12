const { StatusCodes } = require('http-status-codes');
const db = require('../../db/postgres/models/index');

async function sendJson(res, action, status = StatusCodes.OK) {
  let result;
  try {
    result = await action(db);

    if (db === null) {
      throw new Error('No connection to the database.');
    }

    if (result?.success) {
      return res.status(status).json({
        ...result.result
      });
    } else {
      res.locals.error = result || 'Unknown warning';
      return res.status(result.statusCode ?? StatusCodes.NOT_FOUND).json({
        success: result.success,
        message: result?.message,
        error: result.error,
        errorCode: result.errorCode
      });
    }
  } catch (error) {
    if (process.env.ENV === 'local') {
      console.log(error);
    }
    console.log(error);
    res.locals.error = error;
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
}

module.exports = {
  sendJson
};
