const nodemailer = require('nodemailer');
const { EMAIL_SERVICE, EMAIL_USER, EMAIL_PASS } = require('../config/config');
console.log(EMAIL_SERVICE);
console.log(EMAIL_USER);
console.log(EMAIL_PASS);

// Create a nodemailer transporter with your email service credentials
const transporter = nodemailer.createTransport({
  service: EMAIL_SERVICE,
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS
  }
});

// Function to send email with verification link
sendVerificationEmail=(userEmail, verificationLink)=> {
  const mailOptions = {
    from: EMAIL_USER,
    to: userEmail,
    subject: 'Email Verification',
    html: `<p>Click the link to verify your email: <a href="${verificationLink}">${verificationLink}</a></p>`
  };

  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}

// module.exports=sendVerificationEmail;
// Example usage
const userEmail = 'tendinuri@gmail.com';
const verificationLink = 'https://example.com/verify?userId=1234&token=abcd&totp=123456';
sendVerificationEmail(userEmail, verificationLink);
