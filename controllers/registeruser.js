const User = require('../models/user');
const verifyEmail = require('../utils/validateemail');
const verifyPhoneNumber = require('../utils/validatephone');
const CustomError = require('../error/custom_error');

const generateToken = require('../utils/jwt/generate_jwt_token');

const registerUser = async (req, res, next) => {
  const { username, emailorphone, password } = req.body;

  let emailOrPhone;
  if (/^\d+$/.test(emailorphone)) {
    // check if input is a phone number
    emailOrPhone = verifyPhoneNumber(emailorphone);
  } else {
    // assume input is an email address
    emailOrPhone = verifyEmail(emailorphone);
  }

  try {
    // Check if user already exists with the provided email or phone number
    const existingUser = await User.findOne({ emailOrPhone: emailOrPhone });
    if (existingUser) {
      throw new CustomError(400, 'User already exists');
    }

    // Create new user
    const newUser = new User({
      username,
      emailOrPhone,
      password,
    });

    // Save user to the database
    const user = await newUser.save();
    if (!savedUser) {
      throw new CustomError(500, 'Failed to save user in db');
    }

    // generate token save token and send token to client
    generateToken(user._id, user.role);

    res.status(201).json({
      message: 'User registered successfully',
      user: user,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = registerUser;
