const cookie = require('cookie');


// Set the expiration time for the access token cookie (e.g. 6 minutes)
const accessExpiresIn = 6 * 60 * 1000;

// Set the expiration time for the refresh token cookie (e.g. 60 days)
const refreshExpiresIn = 60 * 24 * 60 * 60 * 1000;

// Set the cookies with the plaintext tokens
const accessCookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: 'strict',
  expires: new Date(Date.now() + accessExpiresIn),
  domain: 'example.com',
};

const refreshCookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: 'strict',
  expires: new Date(Date.now() + refreshExpiresIn),
  domain: 'example.com',
};

const setJwtToken=(res,accessToken, refreshToken)=>{
  const accessTokenCookie = cookie.serialize('access_token', accessToken, accessCookieOptions);
  const refreshTokenCookie = cookie.serialize('refresh_token', refreshToken, refreshCookieOptions);

// Send the cookies in the response

res.setHeader('Set-Cookie', [accessTokenCookie, refreshTokenCookie]);

}

module.exports=setJwtToken;

