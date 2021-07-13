const userRoutes = require("express").Router();
const { returnCurrentUser, updateCurrentUser } = require("../controllers/user");
const { updateUserDataValidation } = require("../middlewares/req-validation");

userRoutes.get("/users/me", returnCurrentUser);
userRoutes.patch("/users/me", updateUserDataValidation, updateCurrentUser);

module.exports = { userRoutes };
