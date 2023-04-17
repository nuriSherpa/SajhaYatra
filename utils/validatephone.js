const phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();

const verifyPhoneNumber = (phoneNumber) => {
  try {
    if (phoneNumber.startsWith('+977')) {
      phoneNumber = phoneNumber.slice(4); // remove the country code
    }
    const parsedPhoneNumber = phoneUtil.parse(phoneNumber, 'NP');
    if (phoneUtil.isValidNumber(parsedPhoneNumber)) {
      const formattedPhoneNumber = phoneUtil.format(parsedPhoneNumber, 0);
      return formattedPhoneNumber;
    } else {
      throw new Error('Invalid phone number');
    }
  } catch (e) {
    return {
      error: 'Invalid phone number',
      status: 400
    };
  }
};


module.exports = verifyPhoneNumber;
