const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model("User");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

async function mailer(reciveremail, code) {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,

    secure: false,
    requireTLS: true,
    auth: {
      user: process.env.nodemailer_email,
      pass: process.env.nodemailer_password,
    },
  });

  let info = await transporter.sendMail({
    from: "Diven Khatri",
    to: `${reciveremail}`,
    subject: "Email Verification Code",
    text: `Your Email Verification Code is ${code}`,
    html: `<b>Your Email Verification Code is ${code}</b>`,
  });
}

router.post("/verify", (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(422).json({ error: "Please fill all the fields" });
  }
  User.findOne({ email: email }).then(async (saveUser) => {
    if (saveUser) {
      return res
        .status(422)
        .json({ error: "User already exists with that email" });
    }
    try {
      let Verification_Code = Math.floor(100000 + Math.random() * 900000);
      await mailer(email, Verification_Code);
      res.send({
        message: "Verification Code Sent to your Email",
        Verification_Code,
        email,
      });
    } catch (err) {
      console.log(err);
    }
  });
});

router.post("/changeusername", (req, res) => {
  const { username, email } = req.body;

  User.find({ username }).then(async (saveUser) => {
    if (saveUser.length > 0) {
      return res.status(422).json({ error: "Username already exists" });
    } else {
      return res
        .status(200)
        .json({ message: "Username Avaialble ", username, email });
    }
  });
});

router.post("signup", async (req, res) => {
  const { username, password, email } = req.body;
  if (!username || !password || !email) {
    return res.status(422).json({ error: "Please fill all the fields" });
  } else {
    const user = new User({
      username,
      email,
      password,
    });
    try {
      await user.save();
      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
      return res
        .status(200)
        .json({ message: "User Registered Successfully", token });
    } catch (err) {
      console.log(err);
      return res.status(422).json({ error: "User Not Registered" });
    }
  }
});

module.exports = router;
