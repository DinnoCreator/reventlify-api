const pool = require("../../../../../db");

exports.pricingQueryOnline = async (req, res) => {
  // get regime id from body
  const { regimeID } = req.body;
  try {
    // gets all the regime's pricing
    const eventPricings = await pool.query(
      "SELECT * FROM pricings WHERE regime_id = $1",
      [regimeID]
    );

    // returns it to the client
    return res.status(200).json({ eventPricings: eventPricings });
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

exports.pricingQueryOffline = async (req, res) => {
  // get regime id from body
  const { regimeID } = req.body;
  try {
    // gets all the regime's pricing
    const eventPricings = await pool.query(
      "SELECT * FROM pricings WHERE regime_id = $1",
      [regimeID]
    );

    // returns it to the client
    return res.status(200).json({ eventPricings: eventPricings });
  } catch (error) {
    return res.status(500).json(error.message);
  }
};
