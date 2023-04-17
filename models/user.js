const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 255,
    trim: true,
    validate: {
      validator: validator.isAlphanumeric,
      message: 'Username can only contain letters and numbers',
    },
  },
  emailOrPhone: {
    type: String,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 255,
    trim: true,
  },
  role: {
    type: String,
    enum: ['admin', 'client'],
    default: 'client',
  },
  otp: {
    type: String,
    required: false,
    minlength: 6,
    maxlength: 6,
    trim: true,
  },
  profilePicture: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

// Hash password before saving to the database
userSchema.pre('save', async function (next) {
  const user = this;
  if (!user.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(user.password, salt);
    user.password = hash;
    next();
  } catch (err) {
    return next(err);
  }
});

// Hash otp before saving to the database
userSchema.pre('save', async function (next) {
  const user = this;
  if (!user.isModified('otp')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(user.otp, salt);
    user.otp = hash;
    next();
  } catch (err) {
    return next(err);
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
