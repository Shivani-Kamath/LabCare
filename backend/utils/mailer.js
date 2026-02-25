// const nodemailer = require("nodemailer");

// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: "your-email@gmail.com",
//     pass: "your-app-password"
//   }
// });
// exports.sendNotification = async (to, subject, message) => {
//   const mailOptions = {
//     from: "LabCare <your-email@gmail.com>",
//     to,
//     subject,
//     text: message
//   };

//   return transporter.sendMail(mailOptions);
// };


// const nodemailer = require("nodemailer");

// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

// module.exports.sendNotification = async (emails, subject, message) => {
//   const mailOptions = {
//     from: process.env.EMAIL_USER,
//     to: emails,
//     subject,
//     text: message,
//   };
//   await transporter.sendMail(mailOptions);
// };


const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your.email@gmail.com',
    pass: 'your_app_password'
  }
});

module.exports.sendEmail = async (to, subject, html) => {
  const mailOptions = {
    from: 'your.email@gmail.com',
    to,
    subject,
    html
  };

  return transporter.sendMail(mailOptions);
};
