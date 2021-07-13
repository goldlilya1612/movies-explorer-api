/* eslint-disable comma-dangle */
/* eslint-disable no-console */
require("dotenv").config(); // После этого env-переменные из файла добавятся в process.env

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { errors } = require("celebrate");
const helmet = require("helmet");

const { router } = require("./routes/index");
const { createUser, login } = require("./controllers/user");
const auth = require("./middlewares/auth");
const {
  userDataValidation,
  loginValidation,
} = require("./middlewares/req-validation");
const { requestLogger, errorLogger } = require("./middlewares/logger");
const { errorHandler } = require("./middlewares/error-handler");
const { limiter } = require("./middlewares/limiter");

const { PORT = 3005 } = process.env;
const { DATA_BASE, NODE_ENV } = process.env;
const app = express();

mongoose.connect(
  NODE_ENV === "production"
    ? DATA_BASE
    : "mongodb://localhost:27017/bitfilmsdb",
  {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  }
);

app.use(helmet()); // защита HTTP-заголовков
app.use(express.json());
app.use(cors());
app.use(requestLogger);
app.use(limiter); // лимитер запросов
app.post("/signup", userDataValidation, createUser);
app.post("/signin", loginValidation, login);
app.use(auth);
app.use(router);
app.use(errorLogger);
app.use(errors());
app.use(errorHandler); // централизованный обработчик ошибок

app.listen(PORT, () => {
  console.log(`server listen on ${PORT} port`);
});
