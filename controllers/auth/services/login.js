const pool = require("../../../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//login begin
exports.logger = async (req, res) => {
  try {
    const { email, password } = req.body;

    //Email Check
    const users = await pool.query(
      `SELECT * FROM 
      clients WHERE client_email = $1`,
      [email]
    );
    if (users.rows.length === 0)
      return res.status(401).json("Email is incorrect!");

    //Password Check
    const validPassword = await bcrypt.compare(
      password,
      users.rows[0].client_password
    );
    if (!validPassword) return res.status(401).json("Incorrect password!");

    //JWT
    const user_email = users.rows[0].client_email;
    const user_name = users.rows[0].client_name;
    const user_id = users.rows[0].client_id;
    const token = await jwt.sign(
      { user_id, user_name, user_email },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "55m",
      }
    );
    return res.status(200).json({
      auth: true,
      token: token,
      person: {
        name: user_name,
        email: user_email,
      },
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
