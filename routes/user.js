const userRoutes = require("express").Router();
const {
  returnCurrentUser,
  updateCurrentUser,
  createUser,
  login,
} = require("../controllers/user");
const {
  updateUserDataValidation,
  userDataValidation,
  loginValidation,
} = require("../middlewares/req-validation");
const auth = require("../middlewares/auth");

userRoutes.post("/signup", userDataValidation, createUser);
userRoutes.post("/signin", loginValidation, login);

userRoutes.use(auth);

userRoutes.get("/users/me", returnCurrentUser);
userRoutes.patch("/users/me", updateUserDataValidation, updateCurrentUser);

module.exports = { userRoutes };
