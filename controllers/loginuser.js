const User = require('../models/user');
const bcrypt = require('bcryptjs');
const verifyEmail = require('../utils/validateemail');
const verifyPhoneNumber = require('../utils/validatephone');
const setJwtToken = require('../utils/jwt/set_jwt_cookie');
const generateToken = require('../utils/jwt/generate_jwt_token');

const loginUser = async (req, res, next) => {
  const { emailorphone, password } = req.body;

  let verifiedContact;
  if (/^\d+$/.test(emailorphone)) {
    // check if input is a phone number
    verifiedContact = verifyPhoneNumber(emailorphone);
  } else {
    // assume input is an email address
    verifiedContact = verifyEmail(emailorphone);
  }

  try {
    if (!verifiedContact) {
      throw new Error('Invalid phone number or email address');
    }

    const user = await User.findOne({ emailOrPhone: verifiedContact });

    if (!user) {
      throw new Error('Invalid email/phone number or password');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error('Invalid password');
    }

    // generate token save token and send token to client
    generateToken(user._id, user.role);

    // store user object on request object and pass control to the next middleware function or route handler
    req.user = user;
  } catch (error) {
    next(error);
  }
};

module.exports = loginUser;
