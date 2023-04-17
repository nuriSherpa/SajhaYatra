const fs = require('fs');
const jwt = require('jsonwebtoken');

const public_key = fs.readFileSync('./private.key');

verifyAccessToken=(token) => {
    try {
      const payload = jwt.verify(token, public_key, { algorithms: ['ES256'] });
      return payload;
    } catch (err) {
      const customError = new Error(`Error verifying access token: ${err.message}`);
      customError.status = 401;
      throw customError;
    }
}
  
verifyRefreshToken=(token) => {
    try {
      const payload = jwt.verify(token, public_key, { algorithms: ['ES256'] });
      return payload;
    } catch (err) {
      const customError = new Error(`Error verifying refresh token: ${err.message}`);
      customError.status = 401;
      throw customError;
    }
}


module.exports= {verifyAccessToken, verifyRefreshToken};