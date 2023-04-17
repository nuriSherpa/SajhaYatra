const fs = require('fs');
const jwt = require('jsonwebtoken');
const CustomError = require('../../error/custom_error');
const Token = require('../../models/token');

const private_key = fs.readFileSync('./private.key');

const accessTokenExp = Math.floor(Date.now() / 1000) + 5 * 60; // 5 minutes
const refreshTokenExp = Math.floor(Date.now() / 1000) + 60 * 24 * 60 * 60; // 30 days
const timestamp = Math.floor(new Date().getTime() / 1000); // time stamp now

generateToken = async (userId, role) => {
  // access token payload
  const accPayload = {
    sub: userId,
    role: role,
    iat: timestamp,
    exp: accessTokenExp,
  };
  // refresh token payload
  const refPayload = {
    sub: userId,
    iat: timestamp,
    exp: refreshTokenExp,
  };

  try {
    const accessToken = jwt.sign(accPayload, private_key, {
      algorithm: 'ES256',
    });
    const refreshToken = jwt.sign(refPayload, private_key, {
      algorithm: 'ES256',
    });

    if (!accessToken || !refreshToken) {
      throw new CustomError(500, 'Unable to generate token');
    }

    const token = new Token({
      _id: user._id, // Set the _id field to be the userId
      accessToken: accessToken,
      refreshToken: refreshToken,
    });

    // save token in db
    const newToken = await token.save();
    if (!newToken) {
      throw new CustomError(400, 'Token error');
    }

    // send token to clinet
    setJwtToken(accessToken, refreshToken);
  } catch (err) {
    next(err);
  }
};

module.exports = generateToken;
