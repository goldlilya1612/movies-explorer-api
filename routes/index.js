const router = require("express").Router();
const { userRoutes } = require("./user");
const { movieRoutes } = require("./movie");

const NotFoundError = require("../errors/not-found-err");

router.use(userRoutes);
router.use(movieRoutes);
router.all("*", () => {
  throw new NotFoundError("Запрашиваемый ресурс не найден");
});

module.exports = { router };
