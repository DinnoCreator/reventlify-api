const pool = require("../../../../../db");

exports.eventQueryPersonalizedOrNot = async (req, res) => {
  const user = req.user;
  try {
    const { city, state } = req.body;
    // Gets user preference
    const userPreference = await pool.query(
      "SELECT * FROM preference WHERE owner_id = $1",
      [user]
    );

    // Checks if user has set preference unique
    if (userPreference.rows.length === 0) {
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
          WHERE regimes.regime_city = $1 OR regimes.regime_state = $2
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
        [city, state]
      );
      if (regimesNoPref.rows.length === 0) {
        return res.status(202).json("nothing to show");
      }
      return res.status(201).json(regimesNoPref.rows);
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
    if (regimesWithPref.rows.length === 0) {
      return res.status(202).json("nothing to show")
    }

    // final return statement
    return res.status(200).json(regimesWithPref.rows);
  } catch (error) {
    return res.status(500).json(error);
  }
};

exports.offline = async (req, res) => {
  try {
    // gets regimes offline
    const regimesOffline = await pool.query(
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
    if (regimesOffline.rows.length === 0)
      return res.status(202).json("nothing to show");

    // final return statement
    return res.status(200).json(regimesOffline.rows);
  } catch (error) {
    return res.status(500).json(error.message);
  }
};
