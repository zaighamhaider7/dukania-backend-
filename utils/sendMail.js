const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendAdminEmail = async (subject, message) => {
    await resend.emails.send({
        from: process.env.EMAIL_FROM,
        to: process.env.ADMIN_EMAIL,
        subject,
        text: message,
    });
};

module.exports = sendAdminEmail;


// const nodemailer = require("nodemailer");

// const transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS,
//     },
// });

// const sendAdminEmail = async (subject, message) => {
//     await transporter.sendMail({
//         from: process.env.EMAIL_USER,
//         to: process.env.ADMIN_EMAIL,
//         subject,
//         text: message,
//     });
// };

// module.exports = sendAdminEmail;