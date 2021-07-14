const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs"); // для хеширования пароля

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: (v) => {
          validator.isEmail(v);
        },
        message: "Неправильный формат почты",
      },
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    name: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 30,
    },
  },
  // eslint-disable-next-line comma-dangle
  { versionKey: false }
);

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email })
    .select("+password") // объект возвращается без поля password, поэтому выбираем его дополнительно. это необходимо, чтобы user.password не было underfined
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error("Неправильные почта или пароль"));
      }
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(new Error("Неправильные почта или пароль"));
        }
        return user;
      });
    });
};

module.exports = mongoose.model("User", userSchema);
