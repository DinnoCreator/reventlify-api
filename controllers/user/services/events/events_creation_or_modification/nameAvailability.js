const pool = require("../../../../../db");
const _ = require('lodash');

exports.nameAvailability = async (req, res) => {
  const regimeName  = _.trim(req.body.regimeName.replace(/\\/g, ""), '`_- ,:;/.{}[]()<>|?"*^%#@!~+&%');
  // const regimeName  = req.body.regimeName;
  const user = req.user;
  try {
    if (regimeName.length === 0) res.status(400).json("Empty search input");

    const nameCheck = await pool.query(
      "SELECT * FROM regimes WHERE regime_name = $1",
      [regimeName.toLowerCase()]
    );

    if (nameCheck.rows.length > 0) {
      const nameCheck1 = await pool.query(
        "SELECT * FROM regimes WHERE regime_name = $1 and creator_id = $2",
        [regimeName.toLowerCase(), user]
      );
      const nameCheck2 = await pool.query(
        "SELECT * FROM regimes WHERE regime_name = $1 and creator_id = $2 and regime_status = $3",
        [regimeName.toLowerCase(), user, "ongoing"]
      );
      if (nameCheck1.rows.length === 0 && nameCheck2.rows.length === 0) {
        return res
          .status(409)
          .json("Regime name already in use by another creator");
      } else if (nameCheck1.rows.length > 0 && nameCheck2.rows.length > 0) {
        return res
          .status(409)
          .json(
            `Your regime "${nameCheck1.rows[0].regime_name}" is still ongoing, you can't create another with the same name until the current regime ends. `
          );
      } else {
        return res.status(200).json("Regime name is free for use");
      }
    }
    return res.status(200).json("Regime name does not exist");
  } catch (error) {
    return res.status(500).json(error.message);
  }
};
