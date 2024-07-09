const express = require("express");
const router = express.Router();
const nodemailer = require("../nodemailer");
const db = require("../db");
const bcrypt = require("bcrypt");
const useragent = require("useragent");
const { caeserEncrypt } = require("../lib/encrypt");

const sendVerificationEmail = async (email, code) => {
  const mailOptions = {
    from: process.env.MAIL_ID,
    to: email,
    subject: "Email Verification for Note Forge",
    text: `Your verification code is ${code}. This code will expire in 10 mins`,
  };

  try {
    await nodemailer.sendMail(mailOptions);
    console.log(`Verification email sent to: ${email}`);
  } catch (err) {
    console.error("Error sending Verification Email:", err);
    throw err;
  }
};

const sendPasswordResetEmail = async (email, token) => {
  const mailOptions = {
    from: process.env.MAIL_ID,
    to: email,
    subject: "Password Reset",
    text: `Your password reset token is ${token}. This will expire in 10 mins`,
  };

  try {
    await nodemailer.sendMail(mailOptions);
    console.log(`Password reset email sent to ${email}`);
  } catch (err) {
    console.error("Error sending password reset email");
    throw err;
  }
};

const generateCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const generateToken = () => {
  const length = 10;
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let token = "";
  for (let i = 0; i < length; i++) {
    token += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return token;
};

router.post("/sendverify", async (req, res) => {
  const { email } = req.body;

  const code = generateCode();

  if (!email.endsWith("@gmail.com")) {
    return res.status(400).json("Invalid email format.");
  }

  try {
    const user = await db.user.findUnique({
      where: {
        email: email,
      },
    });

    if (user) {
      res.status(400).json("Email already exists. Login instead.");
    } else {
      await db.verify.create({
        data: {
          email,
          code,
        },
      });
      await sendVerificationEmail(email, code);
      res.status(200).json("Verification Code sent");
    }
  } catch (err) {
    console.error("Error sending verification email: ", err);
    res.status(500).json("Internal Server Error");
  }
});

router.post("/register", async (req, res) => {
  const { email, code, name, password } = req.body;

  if (!email.endsWith("@gmail.com")) {
    return res.status(400).json("Invalid email format.");
  } else if (!name) {
    res.status(400).json("Name is required.");
  } else if (!password) {
    res.status(400).json("Password is required");
  } else {
    try {
      const data = await db.verify.findFirst({ where: { email, code } });

      if (!data) {
        res.status(400).json("Invalid Verification Code");
      } else {
        try {
          const username = await db.user.findFirst({ where: { name } });
          const user = await db.user.findFirst({ where: { email } });

          if (user) {
            await db.verify.delete({ where: { id: data.id } });
            res.status(400).json("Email already exists. Login instead.");
          } else if (username) {
            res
              .status(400)
              .json("Username already in use. Try another username");
          } else {
            const hashed = await bcrypt.hash(password, 10);
            await db.user.create({
              data: {
                email,
                name,
                password: hashed,
                role: "contributor",
              },
            });
            await db.verify.delete({ where: { id: data.id } });
            res.status(200).json("User Created");
          }
        } catch (err) {
          console.error("Error Creating User: ", err);
          res.status(500).json("Internal Server Error");
        }
      }
    } catch (err) {
      console.error("Error Verifying email: ", err);
      res.status(500).json("Internal Server Error");
    }
  }
});

router.post("/login", async (req, res) => {
  browser = useragent.parse(req.headers["user-agent"]).family;
  const { email, password } = req.body;
  if (!email) {
    res.status(400).json("Email is required");
  } else if (!password) {
    res.status(400).json("Password is required");
  } else {
    try {
      const user = await db.user.findFirst({ where: { email } });
      if (!user) {
        res.status(400).json("No user with this email");
      } else {
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
          res.status(400).json("Invalid password");
        } else {
          const data = `${user.id}${browser}${Math.floor(
            100000 + Math.random() * 900000
          ).toString()}`;
          const cookie = caeserEncrypt(data);
          await db.session.create({
            data: {
              cookie,
              browser,
              userId: user.id,
            },
          });
          res.status(200).json({ cookie, role: user.role, userId: user.id });
        }
      }
    } catch (err) {
      console.error("Error logging In: ", err);
      res.status(500).json("Internal Server Error");
    }
  }
});

router.post("/forgotpassword", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    res.status(400).json("Email is required");
  } else if (!email.endsWith("@gmail.com")) {
    return res.status(400).json("Invalid email format.");
  } else {
    try {
      const user = await db.user.findFirst({ where: { email } });

      if (!user) {
        res.status(400).json("No user with this email");
      } else {
        const token = generateToken();

        await db.passwordReset.create({
          data: {
            email,
            reset_token: token,
          },
        });

        await sendPasswordResetEmail(email, token);

        res.status(200).json("Reset Token sent to email.");
      }
    } catch (err) {
      console.error("Error initiating password reset: ", err);
      res.status(500).json("Internal Server Error");
    }
  }
});

router.post("/resetpassword", async (req, res) => {
  const { token, password } = req.body;

  if (!token) {
    res.status(400).json("Token is required");
  } else if (!password) {
    res.status(400).json("Password is required");
  } else {
    try {
      const user = await db.passwordReset.findFirst({
        where: {
          reset_token: token,
        },
      });
      if (!user) {
        res.status(400).json("Invalid Token");
      } else {
        const email = user.email;
        const hashed = await bcrypt.hash(password, 10);
        await db.user.update({
          where: { email },
          data: {
            password: hashed,
          },
        });
        await db.passwordReset.delete({ where: { id: user.id } });
        res.status(200).json("Password Reset Successful");
      }
    } catch (err) {
      console.error("Error resetting password: ", err);
      res.status(500).json("Internal Server Error");
    }
  }
});

router.post("/logout", async (req, res) => {
  const { cookie } = req.body;

  const data = await db.session.findFirst({ where: { cookie } });
  if (data) {
    await db.session.delete({ where: { id: data.id } });
  }
  res.status(200).json("Session deleted");
});

module.exports = router;
