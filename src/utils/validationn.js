const validator = require("validator");

const validateSignUpData = (req) => {
  const { firstname, lastname, emailId, password } = req.body;

  if (!firstname || !lastname) {
    throw new Error(" : Name is not valid");
  } else if (!validator.isEmail(emailId)) {
    throw new Error(" : Email is not valid");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error(" : Password is not strong");
  }
};
const ValidateEditProfileData = (req) => {
  const allowedEditFields = [
    "firstname",
    "lastname",
    "emailId",
    "photo",
    "about",
    "Skills",
    "age",
    "gender",
  ];

  
  const isEditAllowed = Object.keys(req.body).every((field) =>
    allowedEditFields.includes(field)
  );
  return isEditAllowed;
};

module.exports = { validateSignUpData, ValidateEditProfileData };
