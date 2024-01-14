const nodemailer = require('nodemailer')
const  {email, password } = require('./secrets.js')
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: email,
      pass: password
    }
});

module.exports = async function sendEmail (lat) {
    const mailOptions = {
        from: email,
        to: 'knowl3dg3cav3@gmail.com',
        subject: lat.title,
        text: lat.content
    };
    transporter.sendMail(mailOptions)
    .catch(e => console.log('Something went wrong ' + e))
}

 


