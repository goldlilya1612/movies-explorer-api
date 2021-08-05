/* eslint-disable comma-dangle */
const bcrypt = require("bcryptjs"); // для хеширование пароля
const jwt = require("jsonwebtoken"); // для создания токена
const User = require("../models/user");

const { NODE_ENV, JWT_SECRET } = process.env;

const NotFoundError = require("../errors/not-found-err");
const BadRequestError = require("../errors/bad-request-err");
const ConflictError = require("../errors/conflict-err");

const {
  MESSAGE_ERROR_404,
  MESSAGE_ERROR_400,
  MESSAGE_ERROR_409,
} = require("../utils/constants");

// возвращение текущего пользователя
const returnCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        return next(new NotFoundError(MESSAGE_ERROR_404));
      }
      return res.send({
        name: user.name,
        email: user.email,
      });
    })
    .catch(next);
};

// обновление информации текущего пользователя
const updateCurrentUser = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, email },
    { new: true, runValidators: true }
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError(MESSAGE_ERROR_404);
      } else {
        res.send({
          name: user.name,
          email: user.email,
        });
      }
    })
    .catch((err) => {
      if (err.message === "CastError" || err.message === "ValidationError") {
        throw new BadRequestError(MESSAGE_ERROR_400);
      } else if (err.name === "MongoError" && err.code === 11000) {
        throw new ConflictError(MESSAGE_ERROR_409);
      }
      throw err;
    })
    .catch(next);
};

// регистрация
const createUser = (req, res, next) => {
  const { name, email, password } = req.body;

  bcrypt.hash(password, 10).then((hash) => {
    User.create({
      name,
      email,
      password: hash,
    })
      .then((user) => {
        res.send({
          _id: user._id,
          name: user.name,
          email: user.email,
        });
      })
      .catch((err) => {
        if (err.message === "CastError" || err.message === "ValidationError") {
          throw new BadRequestError(MESSAGE_ERROR_400);
        } else if (err.name === "MongoError" && err.code === 11000) {
          throw new ConflictError(MESSAGE_ERROR_409);
        }
        throw err;
      })
      .catch(next);
  });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === "production" ? JWT_SECRET : "some-secret-key",
        {
          expiresIn: "7d",
        }
      );
      res.send({ token });
    })
    .catch(() => {
      throw new BadRequestError(MESSAGE_ERROR_400);
    })
    .catch(next);
};

module.exports = {
  returnCurrentUser,
  updateCurrentUser,
  createUser,
  login,
};
