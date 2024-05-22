
const nodemailer = require('nodemailer');
const keys = require("../Config/config");
const sendEmail = async (email, subject, text) => {

  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: keys.senderEmail,
      pass: keys.senderPassword
    }
  });
  
  var mailOptions = {
    from: keys.senderEmail,
    to: email,
    subject,
    text,
  };
  
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
      return info.response
    }
  });

}
module.exports = sendEmail