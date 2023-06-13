const pool = require("../../../../../db");

exports.eventQueryPersonalizedOrNot = async (req, res) => {
  const user = req.user;
  try {
    const {city, state} = req.body
    // Gets user preference
    const userPreference = await pool.query(
      "SELECT * FROM preference WHERE owner_id = $1",
      [user]
    );

    // Checks if user has set preference
    if (userPreference.rows.length !== 1) {
      const regimesNoPref = await pool.query(
        `
        SELECT 
          regimes.regime_id,
          regimes.regime_name, 
          regimes.regime_media, 
          regimes.regime_type,
          regimes.regime_city,
          regimes.c_date,
          regimes.c_time,
          min(pricings.pricing_amount) as min_ticket_price
          FROM regimes 
          LEFT OUTER JOIN pricings  
          ON
          regimes.regime_id = pricings.regime_id 
          GROUP BY 
          regimes.regime_id,
          regimes.regime_name, 
          regimes.regime_media, 
          regimes.regime_type,
          regimes.regime_city,
          regimes.c_date,
          regimes.c_time
          ORDER BY (regimes.c_date, regimes.c_time) DESC
        `
      );
      return res.status(201).json({ regimes: regimesNoPref });
    }

    // gets user preference
    const preferenceOne = userPreference.rows[0].preference_one;
    const preferenceTwo = userPreference.rows[0].preference_two;
    const preferenceThree = userPreference.rows[0].preference_three;

    // gets regimes that matches user preference
    const regimesWithPref = await pool.query(
      `
      SELECT 
        regimes.regime_id,
        regimes.regime_name, 
        regimes.regime_media, 
        regimes.regime_type,
        regimes.regime_city,
        regimes.c_date,
        regimes.c_time,
        min(pricings.pricing_amount) as min_ticket_price
        FROM regimes 
        LEFT OUTER JOIN pricings  
        ON
        regimes.regime_id = pricings.regime_id 
        WHERE regimes.regime_city = $1 OR regimes.regime_state = $2 AND 
        regimes.regime_type = $3 OR regimes.regime_type = $4 OR regimes.regime_type = $5
        GROUP BY 
        regimes.regime_id,
        regimes.regime_name, 
        regimes.regime_media, 
        regimes.regime_type,
        regimes.regime_city,
        regimes.c_date,
        regimes.c_time
        ORDER BY (regimes.c_date, regimes.c_time) DESC
      `,
      [
        city,
        state,
        preferenceOne.toLowerCase(),
        preferenceTwo.toLowerCase(),
        preferenceThree.toLowerCase(),
      ]
    );

    // final return statement
    return res.status(200).json({ regimes: regimesWithPref });
  } catch (error) {
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
    return res.status(500).json(error.message);
  }
};
