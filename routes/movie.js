const movieRoutes = require("express").Router();
const {
  createMovie,
  returnUserMovies,
  removeMovie,
} = require("../controllers/movie");
const {
  paramsValidation,
  movieDataValidation,
} = require("../middlewares/req-validation");

movieRoutes.post("/movies", movieDataValidation, createMovie);
movieRoutes.get("/movies", returnUserMovies);
movieRoutes.delete("/movies/:movieId", paramsValidation, removeMovie);

module.exports = { movieRoutes };
