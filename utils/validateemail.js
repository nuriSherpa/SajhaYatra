const validator = require('email-validator');

verifyEmail=(email, errorHandler)=> {
  if (validator.validate(email)) {
    return email;
  } else {
    throw new Error('Invalid Email')
  }
}

module.exports = verifyEmail;


