/* eslint-disable comma-dangle */
const bcrypt = require("bcryptjs"); // для хеширование пароля
const jwt = require("jsonwebtoken"); // для создания токена
const User = require("../models/user");

const NotFoundError = require("../errors/not-found-err");
const BadRequestError = require("../errors/bad-request-err");
const ConflictError = require("../errors/conflict-err");

// возвращение текущего пользователя
const returnCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        return next(new NotFoundError("Пользователь не найден"));
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
        throw new NotFoundError("Нет пользователя с таким id");
      } else {
        res.send({
          name: user.name,
          email: user.email,
        });
      }
    })
    .catch((err) => {
      if (err.message === "CastError" || err.message === "ValidationError") {
        throw new BadRequestError("Переданы некорректные данные");
      } else if (err.name === "MongoError" && err.code === 11000) {
        throw new ConflictError(
          "Пользователь с таким email уже зарегистрирован"
        );
      }
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
          throw new BadRequestError("Переданы некорректные данные");
        } else if (err.name === "MongoError" && err.code === 11000) {
          throw new ConflictError(
            "Пользователь с таким email уже зарегистрирован"
          );
        }
      })
      .catch(next);
  });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, "some-secret-key", {
        expiresIn: "7d",
      });
      res.send(token);
    })
    .catch(() => {
      throw new BadRequestError("Переданы некорректные данные");
    })
    .catch(next);
};

module.exports = {
  returnCurrentUser,
  updateCurrentUser,
  createUser,
  login,
};
