/* eslint-disable consistent-return */
/* eslint-disable prefer-arrow-callback */
/* eslint-disable comma-dangle */
/* eslint-disable no-console */
require("dotenv").config(); // После этого env-переменные из файла добавятся в process.env

const express = require("express");
const mongoose = require("mongoose");
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
  "http://localhost:3000",
  "https://localhost:3000",
];

mongoose.connect(NODE_ENV === "production" ? DATA_BASE : BASE, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(helmet()); // защита HTTP-заголовков
app.use(express.json());

// CORS
// eslint-disable-next-line func-names
app.use(function (req, res, next) {
  const { origin } = req.headers; // Сохраняем источник запроса в переменную origin
  // проверяем, что источник запроса есть среди разрешённых
  if (allowedCors.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }
  const { method } = req; // Сохраняем тип запроса (HTTP-метод) в соответствующую переменную

  // Значение для заголовка Access-Control-Allow-Methods по умолчанию (разрешены все типы запросов)
  const DEFAULT_ALLOWED_METHODS = "GET,HEAD,PUT,PATCH,POST,DELETE";

  // Если это предварительный запрос, добавляем нужные заголовки
  if (method === "OPTIONS") {
    // разрешаем кросс-доменные запросы любых типов (по умолчанию)
    res.header("Access-Control-Allow-Methods", DEFAULT_ALLOWED_METHODS);
  }

  const requestHeaders = req.headers["access-control-request-headers"];
  if (method === "OPTIONS") {
    // разрешаем кросс-доменные запросы с этими заголовками
    res.header("Access-Control-Allow-Headers", requestHeaders);
    // завершаем обработку запроса и возвращаем результат клиенту
    return res.end();
  }
  next();
});
app.use(requestLogger);
app.use(limiter); // лимитер запросов
app.use(router);
app.use(errorLogger);
app.use(errors());
app.use(errorHandler); // централизованный обработчик ошибок

app.listen(PORT, () => {
  console.log(`server listen on ${PORT} port`);
});
