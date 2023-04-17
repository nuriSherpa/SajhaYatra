const otplib = require('otplib');
const { generateTotp }=require('./generateOtp');

let userIdentifier = 'user123'; // Replace with the actual user identifier



// Verify the TOTP code for the user
function verifyTotp(userIdentifier, secret, totpCode) {
  const expectedCode = otplib.authenticator.generate(secret);
  const previousCode = otplib.authenticator.generate(secret, { time: Date.now() - 30000 });
  return (totpCode === expectedCode || totpCode === previousCode);
}


// // Use the function to verify the generated TOTP code
// const isCodeValid = verifyTotp(userIdentifier, secret, totp);
// if (isCodeValid) {
//   console.log('is valid');
// } else {
//   console.log('is invalid');
// }

// const {totp, secret}=generateTotp(userIdentifier);

const {totp: totp1, secret: secret1} = generateTotp(userIdentifier);
const {totp: totp2, secret: secret2} = generateTotp(userIdentifier);

// Verify the TOTP code after a delay of 4 seconds
// setTimeout(function() {
//   const isCodeValid = verifyTotp(userIdentifier, secret1, totp1);
//   if (isCodeValid) {
//     console.log('is valid after delay');
//   } else {
//     console.log('is invalid after delay');
//   }
// }, 4000);
