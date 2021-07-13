/* eslint-disable comma-dangle */
/* eslint-disable consistent-return */
const jwt = require("jsonwebtoken");

const { NODE_ENV, JWT_SECRET } = process.env;
const UnauthorizedError = require("../errors/unauthorized-err");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    throw new UnauthorizedError("Необходима авторизация");
  }

  const token = authorization.replace("Bearer ", "");

  let payload;

  try {
    payload = jwt.verify(
      token,
      NODE_ENV === "production" ? JWT_SECRET : "some-secret-key"
    );
  } catch (err) {
    throw new UnauthorizedError("Необходима авторизация");
  }
  req.user = payload;

  next();
};
