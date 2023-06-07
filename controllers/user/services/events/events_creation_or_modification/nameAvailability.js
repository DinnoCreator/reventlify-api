const pool = require("../../../../../db");

exports.nameAvailability = async (req, res) => {
  const { name } = req.body;
  try {
    const nameCheck = await pool.query(
      "SELECT * FROM regimes WHERE regime_name = $1",
      [name]
    );

    if (nameCheck.rows.length === 1)
      return res.status(409).json("Regime name already exists");
    return res.status(200).json("Regime name does not exists");
  } catch (error) {
    return res.status(500).json(error.message);
  }
};
