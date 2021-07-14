const { MESSAGE_ERROR_500 } = require("../utils/constants");

module.exports.errorHandler = (err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500 ? MESSAGE_ERROR_500 : message,
  });

  next();
};
