const Movie = require("../models/movie");
const BadRequestError = require("../errors/bad-request-err");
const NotFoundError = require("../errors/not-found-err");
const ForbiddenError = require("../errors/forbidden-err");
const {
  MESSAGE_ERROR_404,
  MESSAGE_ERROR_403,
  MESSAGE_ERROR_400,
} = require("../utils/constants");

// создание фильма
const createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    owner: req.user._id,
    movieId,
  })
    .then((movie) => {
      res.send(movie);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        throw new BadRequestError(MESSAGE_ERROR_400);
      }
      throw err;
    })
    .catch(next);
};

const returnUserMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movie) => {
      res.send(movie);
    })
    .catch(next);
};

const removeMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .then((movie) => {
      if (!movie) {
        return next(new NotFoundError(MESSAGE_ERROR_404));
      }
      if (movie.owner.toString() !== req.user._id) {
        return next(new ForbiddenError(MESSAGE_ERROR_403));
      }
      return Movie.findByIdAndRemove(req.params.movieId)
        .then((data) => {
          res.send(data);
        })
        .catch(next);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        throw new BadRequestError(MESSAGE_ERROR_400);
      }
      throw err;
    })
    .catch(next);
};

module.exports = { createMovie, returnUserMovies, removeMovie };
