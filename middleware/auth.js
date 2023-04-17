const jwt = require('jsonwebtoken');
const fs = require('fs');
const tryCatch = require('../utils/try_catch');

const public_key = fs.readFileSync('./public.key');

const authMiddleware = tryCatch(async (req, res, next) => {
  // Get the token from the request header
  const authHeader = req.headers.authorization;
  if (authHeader == null) {
    throw new unauthenticatedError('Invalid token');
  }

  const token = authHeader.split(' ')[1];
  const [accessToken, refreshToken] = token.split('.');
  // Use accessToken and refreshToken as needed
  try {
    // Verify the access token
    const decodedAccessToken = jwt.verify(accessToken, public_key, {
      algorithms: ['ES256'],
      audience: 'your-audience',
    });
    req.user = decodedAccessToken;

    // If the access token is valid, move on to the next middleware or route handler
    next();
  } catch (err) {
    // If the access token is invalid, check if there is a refresh token in the request
    if (err.name === 'JsonWebTokenError' && err.message === 'jwt expired') {
      const refreshToken = req.headers['x-refresh-token'];

      if (refreshToken) {
        try {
          // Verify the refresh token
          const decodedRefreshToken = jwt.verify(refreshToken, public_key, {
            algorithms: ['ES256'],
            audience: 'your-audience',
          });

          // If the refresh token is valid, generate a new access token and move on to the next middleware or route handler
          const newAccessToken = generateAccessToken(decodedRefreshToken);
          req.user = decodedRefreshToken;
          req.accessToken = newAccessToken;

          next();
        } catch (err) {
          // If the refresh token is invalid, send a 401 Unauthorized response
          res.status(401).json({ message: 'Invalid refresh token' });
        }
      } else {
        // If there is no refresh token in the request, send a 401 Unauthorized response
        res
          .status(401)
          .json({
            message: 'Access token expired and no refresh token provided',
          });
      }
    } else {
      // If there is another error with the access token, send a 401 Unauthorized response
      res.status(401).json({ message: 'Invalid access token' });
    }
  }
});

module.exports = authMiddleware;
