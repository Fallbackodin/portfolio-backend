const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");
const bodyParser = require("body-parser");
var nodemailer = require("nodemailer");
var smtpTransport = require("nodemailer-smtp-transport");

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.options("/", function (req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  res.end();
});

const port = process.env.PORT || 5000;

var transporter = nodemailer.createTransport(
  smtpTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    secure: false,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PS,
    },
  })
);

console.log("This is EMAIL: " + process.env.EMAIL);
console.log("This is PS: " + process.env.PS);
app.listen(port, () => console.log("listening on port " + port));
app.post("/", (req, res) =>  {
    console.log("Grabbing options");
    mailOptions = {
        from: process.env.EMAIL,
        to: process.env.EMAIL,
        subject: "Portfolio Email",
        text: `Name: ${req.body.name}\r\n\r\nEmail: ${req.body.email}\r\n\r\n${req.body.message}`
    };
    console.log(mailOptions);
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
            res.json({ success: 0 });
        } 
        else {
            console.log("Email sent: " + info.response);
            res.json({ success: 1 });
        }
    })
});

