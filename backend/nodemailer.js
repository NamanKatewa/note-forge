const nm = require("nodemailer");
require("dotenv").config();

const nodemailer = nm.createTransport({
  service: "gmail",
  secure: false,
  auth: {
    user: process.env.MAIL_ID,
    pass: process.env.MAIL_PASS,
  },
  debug: false,
  logger: true,
});

module.exports = nodemailer;
