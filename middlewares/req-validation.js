const { celebrate, Joi } = require("celebrate");

module.exports.paramsValidation = celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().length(24).hex(),
  }),
});

module.exports.userDataValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().min(8).required(),
    name: Joi.string().required().min(2).max(30),
  }),
});

module.exports.movieDataValidation = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().allow("").required(),
    image: Joi.string()
      .regex(/(http|https):\/\/(www\.)?\S*/)
      .required(),
    trailer: Joi.string()
      .regex(/(http|https):\/\/(www\.)?\S*/)
      .required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
    thumbnail: Joi.string()
      .regex(/(http|https):\/\/(www\.)?\S*/)
      .required(),
    movieId: Joi.number().required(),
  }),
});

module.exports.loginValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().min(8).required(),
  }),
});

module.exports.updateUserDataValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    name: Joi.string().min(2).max(30).required(),
  }),
});
