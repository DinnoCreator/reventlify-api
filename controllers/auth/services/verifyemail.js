const pool = require("../../../db");
const dayjs = require("dayjs");
const nodemailer = require("nodemailer");
const randomString = require("random-string");

exports.sendVerificationCode = async (req, res) => {
  const { email } = req.body;
  // verification code
  const emailVCode = randomString({ length: 5 });
  try {
    // deletes client from limbo
    await pool.query("DELETE FROM limbo WHERE client_email = $1", [email]);

    // checks if user already exists
    const user = await pool.query(
      "SELECT * FROM clients WHERE client_email = $1",
      [email]
    );

    // action if user already exists
    if (user.rows.length !== 0)
      return res.status(409).json("User already exists!");

    await pool.query(
      "INSERT INTO limbo(client_email, client_verify, client_status, c_date, c_time) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [
        email,
        emailVCode,
        "UNVERIFIED",
        dayjs().format("YYYY-MM-DD"),
        dayjs().format("HH:mm:ss"),
      ]
    );

    //credentials for email transportation
    const transport = nodemailer.createTransport({
      // service: "Hotmail",
      // auth: {
      //   user: "reventlifyhub@outlook.com",
      //   pass: process.env.MAIL,
      // },
      host: "smtp.office365.com",
      post: 587,
      auth: {
        user: "reventlifyhub@outlook.com",
        pass: process.env.MAIL,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    //sends verification code to clients mail
    const msg = {
      from: "Reventlify <reventlifyhub@outlook.com>", // sender address
      to: email, // list of receivers
      subject: "Email Verification", // Subject line
      text: `here is your verification code: ${emailVCode}`, // plain text body
      html: `<h3>Email Verification</h3>
      <p>here is your verification code: <strong>${emailVCode}</strong></p>`, //HTML message
    };

    // send mail with defined transport object
    await transport.sendMail(msg);
    return res.status(200).json({
      Status: "Sent Successfully!",
      toEmail: email,
    });
  } catch (error) {
    console.log(error);
    res.status(418).json(error.message);
  }
};

exports.verifyCode = async (req, res) => {
  const { verificationCode, email } = req.body;
  try {
    // gets the real verification code
    const code = await pool.query(
      "SELECT * FROM limbo WHERE client_email = $1",
      [email]
    );

    // checks if the code entered is valid
    if (code.rows[0].client_verify !== verificationCode)
      return res.status(400).json("Incorrect Code.");

    // sets the client in limbo to verified final registeration
    await pool.query(
      "UPDATE limbo SET client_status = $1 WHERE client_email = $2",
      ["VERIFIED", email]
    );

    return res.status(200).json({ message: "Email Verified!" });
  } catch (error) {
    return res.status(500).json({ err: error.message });
  }
};
