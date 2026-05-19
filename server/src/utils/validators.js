const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

const validateName = (name) => {
  return typeof name === "string" && name.length >= 20 && name.length <= 60;
};

const validateAddress = (address) => {
  return typeof address === "string" && address.length <= 400;
};

const validatePassword = (password) => {
  const regex = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,16}$/;
  return regex.test(password);
};

module.exports = {
  validateEmail,
  validateName,
  validateAddress,
  validatePassword
};
