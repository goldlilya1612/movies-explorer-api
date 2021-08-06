/* eslint-disable comma-dangle */
/* eslint-disable no-console */
require("dotenv").config(); // После этого env-переменные из файла добавятся в process.env

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { errors } = require("celebrate");
const helmet = require("helmet");

const { router } = require("./routes/index");
const { requestLogger, errorLogger } = require("./middlewares/logger");
const { errorHandler } = require("./middlewares/error-handler");
const { limiter } = require("./middlewares/limiter");

const { PORT = 3005 } = process.env;
const { DATA_BASE, NODE_ENV } = process.env;
const { BASE } = require("./utils/constants");

const app = express();

const allowedCors = [
  "https://diploma.nomoredomains.work",
  "http://diploma.nomoredomains.work",
  "https://api.diploma.nomoredomains.work",
  "http://api.diploma.nomoredomains.work",
  "http://localhost:3005",
];

mongoose.connect(NODE_ENV === "production" ? DATA_BASE : BASE, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(helmet()); // защита HTTP-заголовков
app.use(express.json());
app.use(
  cors({
    origin: allowedCors,
    credentials: true,
    methods: "GET,PUT,PATCH,POST,DELETE",
    allowedHeaders: "Origin,Content-Type,Accept",
  })
);
app.use(requestLogger);
app.use(limiter); // лимитер запросов
app.use(router);
app.use(errorLogger);
app.use(errors());
app.use(errorHandler); // централизованный обработчик ошибок

app.listen(PORT, () => {
  console.log(`server listen on ${PORT} port`);
});
