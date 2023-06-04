const pool = require("../../../../../db");

exports.eventQueryPersonalizedOrNot = async (req, res) => {
  const user = req.user;
  try {
    // Gets user preference
    const userPreference = await pool.query(
      "SELECT * FROM preference WHERE owner_id = $1",
      [user]
    );

    // Checks if user has set preference
    if (userPreference.rows.length !== 1) {
      const regimesNoPref = await pool.query(
        "SELECT regime_id, regime_name, regime_address, regime_city, regime_state, regime_country, regime_media, regime_description, regime_start_date, regime_start_time, regime_end_date, regime_end_time, c_date, c_time FROM regimes ORDER BY (c_time, c_time) DESC"
      );
      return res.status(201).json({ regimes: regimesNoPref });
    }

    // gets user preference
    const preferenceOne = userPreference.rows[0].preference_one;
    const preferenceTwo = userPreference.rows[0].preference_two;
    const preferenceThree = userPreference.rows[0].preference_three;

    // gets regimes that matches user preference
    const regimesWithPref = await pool.query(
      "SELECT regime_id, regime_name, regime_address, regime_city, regime_state, regime_country, regime_media, regime_description, regime_start_date, regime_start_time, regime_end_date, regime_end_time, c_date, c_time FROM regimes WHERE regime_type = $1 OR regime_type = $2 OR regime_type = $3 AND regime_city = $4 ORDER BY (c_time, c_time) DESC",
      [
        preferenceOne.toLowerCase(),
        preferenceTwo.toLowerCase(),
        preferenceThree.toLowerCase(),
        "calabar",
      ]
    );

    // final return statement
    return res.status(200).json({ regimes: regimesWithPref });
  } catch (error) {
    console.log(error);
    return res.status(418).json(error);
  }
};


exports.offline = async (req, res) => {
  try {
      const regimesOffline = await pool.query(
        "SELECT regime_id, regime_name, regime_address, regime_city, regime_state, regime_country, regime_media, regime_description, regime_start_date, regime_start_time, regime_end_date, regime_end_time, c_date, c_time FROM regimes ORDER BY (c_time, c_time) DESC"
      );

    // final return statement
    return res.status(200).json({ regimes: regimesOffline });
  } catch (error) {
    console.log(error);
    return res.status(418).json(error);
  }
};
