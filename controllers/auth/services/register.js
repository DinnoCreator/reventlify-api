const pool = require("../../../db");
const dayjs = require("dayjs");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const capNsmalz = require("../../../utilities/capNsmalz");
const idGenerator = require("../../../utilities/IDGenerator");

exports.register = async (req, res) => {
  const { name, email, password, verificationCode } = req.body;
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

    const user = await pool.query(
      "SELECT * FROM clients WHERE client_email = $1",
      [email]
    );

    const userInLimbo = await pool.query(
      "SELECT * FROM limbo WHERE client_email = $1",
      [email]
    );

    // checks if user already exists
    if (user.rows.length !== 0)
      return res.status(409).json("User already exists!");

    // checks if user email hasn't been verified
    if (userInLimbo.rows[0].client_status !== "VERIFIED")
      return res.status(409).json("User email not verified!");

    // hashes password
    const hashedPassword = await bcrypt.hash(password, 10);

    // registers user
    const newClient = await pool.query(
      "INSERT INTO clients(client_id, client_name, client_email, client_password, client_accbal, c_date, c_time) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *",
      [
        await idGenerator.clientID(),
        name.toLowerCase(),
        email,
        hashedPassword,
        0.0,
        dayjs().format("YYYY-MM-DD"),
        dayjs().format("HH:mm:ss"),
      ]
    );

    //credentials for email transportation
    const transport = nodemailer.createTransport({
      host: "smtp.office365.com",
      post: 587,
      auth: {
        user: "reventlifyhub@outlook.com",
        pass: process.env.MAIL,
      },
    });

    //Company Reg alert
    const msg = {
      from: "Reventlify <reventlifyhub@outlook.com>", // sender address
      to: "edijay17@gmail.com", // list of receivers
      subject: "Newly Registered Client", // Subject line
      text: `Congrats ${capNsmalz.neat(
        newClient.rows[0].client_name
      )} just successfully registered with Reventlify.`, // plain text body
      html: `<h1>Newly Registered Client</h1>
      <p>Congrats ${capNsmalz.neat(
        newClient.rows[0].client_name
      )} just successfully registered with <strong>Reventlify</strong></p>`, //HTML message
    };

    //Welcome Message
    const msg1 = {
      from: "Reventlify <reventlifyhub@outlook.com>", // sender address
      to: newClient.rows[0].client_email, // list of receivers
      subject: "Welcome To Reventlify", // Subject line
      text: `${capNsmalz.neat(
        newClient.rows[0].client_name
      )} thank you for choosing Reventlify.`, // plain text body
      html: `<h2>Welcome To Reventlify</h2>
        <p>${capNsmalz.neat(
          newClient.rows[0].client_name
        )} thank you for choosing <strong>Reventlify</strong>.</p>`, //HTML message
    };

    // send mail with defined transport object
    await transport.sendMail(msg);
    await transport.sendMail(msg1);

    // deletes client from limbo
    await pool.query("DELETE FROM limbo WHERE client_email = $1", [email]);

    // return
    return res.status(200).json({ Registration: "Successful!" });
  } catch (error) {
    return res.status(500).json(error.message);
  }
};
