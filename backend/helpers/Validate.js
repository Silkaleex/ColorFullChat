const { isEmpty, isLength, isAlpha, isEmail } = require("validator");

const validate = (params) => {
  if (!params || !params.name || !params.surname || !params.nick || !params.password) {
    throw new Error("Los campos 'name', 'surname', 'nick' y 'password' son obligatorios");
  }

  const name = params.name;
  const surname = params.surname;
  const nick = params.nick;
  const email = params.email;
  const password = params.password;
  const bio = params.bio;

  // Luego, realiza las validaciones usando las funciones de validator
  const isNameValid = !isEmpty(name) && isLength(name, { min: 3 });
  const isAlphaValid = isAlpha(name, "es-ES");

  const isSurnameValid = !isEmpty(surname) && isLength(surname, { min: 3 });
  const isSurnameAlphaValid = isAlpha(surname, "es-ES");

  const isNickValid = !isEmpty(nick) && isLength(nick, { min: 3 });
  const isNickAlphaValid = isAlpha(nick, "es-ES");

  const isEmailValid = !isEmpty(email) && isEmail(email);

  const isPasswordValid = !isEmpty(password);

  const isBioValid = isEmpty(bio) || isLength(bio, { max: 255 });

  if (
    !isNameValid ||
    !isAlphaValid ||
    !isSurnameValid ||
    !isSurnameAlphaValid ||
    !isNickValid ||
    !isNickAlphaValid ||
    !isEmailValid ||
    !isPasswordValid ||
    !isBioValid
  ) {
    throw new Error("La validación no se superó");
  }

  console.log("Validación superada");
};

module.exports = validate;
