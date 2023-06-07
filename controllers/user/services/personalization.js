const pool = require("../../../db");
const dayjs = require("dayjs");
const randomString = require("random-string");

exports.personalizationChecker = async (req, res) => {
  const user = req.user;
  try {
    const preference = await pool.query(
      "SELECT * FROM preference WHERE owner_id = $1",
      [user]
    );

    if (preference.rows.length !== 1) {
      return res.status(202).json("User experience not personalized");
    } else {
      return res.status(200).json("User experience is personalized");
    }
  } catch (error) {
    return res.status(500).json(error.message);
  }
};
exports.personalization = async (req, res) => {
  const user = req.user;
  const { preferenceOne, preferenceTwo, preferenceThree } = req.body;
  try {
    const preference = await pool.query(
      "SELECT * FROM preference WHERE owner_id = $1",
      [user]
    );

    if (preference.rows.length === 1)
      return res.status(202).json("User experience not personalized");

    await pool.query(
      "INSERT INTO preference(owner_id, preference_one, preference_two, preference_three, edit_date, edit_time, c_date, c_time) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
      [
        user,
        preferenceOne,
        preferenceTwo,
        preferenceThree,
        dayjs().format("YYYY-MM-DD"),
        dayjs().format("HH:mm:ss"),
        dayjs().format("YYYY-MM-DD"),
        dayjs().format("HH:mm:ss"),
      ]
    );

    return res.status(200).json("User experience just got personalized");
  } catch (error) {
    return res.status(500).json(error.message);
  }
};
