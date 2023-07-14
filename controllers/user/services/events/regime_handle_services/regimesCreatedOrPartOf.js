const pool = require("../../../../../db");

exports.regimeRoles = async (req, res) => {
  const user = req.user;
  try {
    const roles = await pool.query(
      `
        SELECT 
          regime_roles.participant_id,
          regime_roles.regime_role,
          regimes.regime_name,
          regimes.regime_id,
          regimes.regime_media,
          regimes.regime_start_date,
          regimes.regime_start_time,
          regimes.c_date, regimes.c_time 
          FROM regimes
          LEFT JOIN regime_roles
          ON 
          regime_roles.regime_id = regimes.regime_id
          where regime_roles.participant_id = $1
          GROUP BY
          regime_roles.participant_id,
          regime_roles.regime_role,
          regimes.regime_name,
          regimes.regime_id,
          regimes.regime_media,
          regimes.regime_start_date,
          regimes.regime_start_time,
          regimes.c_date,
          regimes.c_time
        ORDER BY (regimes.c_date, regimes.c_time) DESC;
        `,
      [user]
    );

    // if no regime found
    if (roles.rows === 0)
      return res.status(202).json("You are not part of any regime");
    // else
    return res.status(200).json(roles.rows);
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

exports.regimeDashWithRole = async (req, res) => {
  const user = req.user;
  //   client params
  const { regimeId } = req.params;
  try {
    const dashboard = await pool.query(
      `
        SELECT clients.client_name,
          clients.client_photo,
          regime_roles.participant_id,
          regime_roles.regime_role,
          regimes.regime_name,
          regimes.regime_id,
          regimes.regime_media,
          regimes.regime_status,
          regimes.regime_affiliate,
          regimes.regime_start_date,
          regimes.regime_start_time,
          regimes.c_date, regimes.c_time 
          FROM regimes
          LEFT JOIN regime_roles
          ON 
          regime_roles.regime_id = regimes.regime_id
          LEFT JOIN clients
          on
          clients.client_id = regime_roles.participant_id
          where regime_roles.participant_id = $1 and regimes.regime_id = $2
          GROUP BY
          clients.client_name,
          clients.client_photo,
          regime_roles.participant_id,
          regime_roles.regime_role,
          regimes.regime_name,
          regimes.regime_id,
          regimes.regime_media,
          regimes.regime_status,
          regimes.regime_affiliate,
          regimes.regime_start_date,
          regimes.regime_start_time,
          regimes.c_date,
          regimes.c_time
        `,
      [user]
    );
    // if no regime found
    if (dashboard.rows === 0)
      return res.status(400).json("You are not part of this regime");
    // else
    return res.status(200).json(dashboard.rows);
  } catch (error) {
    return res.status(500).json(error.message);
  }
};
