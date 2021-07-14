const BASE = "mongodb://localhost:27017/bitfilmsdb";

const MESSAGE_ERROR_401 = "Необходима авторизация";
const MESSAGE_ERROR_404 = "Ресурс не найден";
const MESSAGE_ERROR_403 = "Доступ запрещен";
const MESSAGE_ERROR_409 = "Пользователь с таким email уже зарегистрирован";
const MESSAGE_ERROR_400 = "Переданы некорректные данные";
const MESSAGE_ERROR_500 = "На сервере произошла ошибка";

module.exports = {
  BASE,
  MESSAGE_ERROR_401,
  MESSAGE_ERROR_404,
  MESSAGE_ERROR_403,
  MESSAGE_ERROR_409,
  MESSAGE_ERROR_400,
  MESSAGE_ERROR_500,
};
