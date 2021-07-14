/* eslint-disable comma-dangle */
/* eslint-disable consistent-return */
const jwt = require("jsonwebtoken");

const { NODE_ENV, JWT_SECRET } = process.env;
const UnauthorizedError = require("../errors/unauthorized-err");
const { MESSAGE_ERROR_401 } = require("../utils/constants");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    throw new UnauthorizedError(MESSAGE_ERROR_401);
  }

  const token = authorization.replace("Bearer ", "");

  let payload;

  try {
    payload = jwt.verify(
      token,
      NODE_ENV === "production" ? JWT_SECRET : "some-secret-key"
    );
  } catch (err) {
    throw new UnauthorizedError(MESSAGE_ERROR_401);
  }
  req.user = payload;

  next();
};
