const pool = require("../../../../../db");
const {
  regimeDetails,
} = require("../../../../../utilities/percentagesAndBalance");

exports.lastTenTicketBoughtUpdate = async (req, res) => {
  const regimeCreator = req.user;
  const { regimeId } = req.params;
  try {
    const regimeDetailss = await regimeDetails(regimeId);

    // response if regime doesn't exists
    if (regimeDetailss.length === 0)
      return res.status(400).json("Regime does not exist.");

    // response if the client making the request is not in charge
    if (regimeDetailss[0].creator_id !== regimeCreator)
      return res.status(400).json("You are not in charge of this regime.");

    // last ten tickets purchased
    const lastTenTicketsPurchased = await pool.query(
      `
      SELECT 
      pricings.regime_id,
	    pricings.pricing_id,
	    pricings.pricing_name,
	    tickets.ticket_id,
	    tickets.ticket_buyer_id,
	    tickets.c_date,
	    tickets.c_time
	    FROM tickets
      LEFT JOIN pricings
      ON
      tickets.pricing_id = pricings.pricing_id
	    WHERE pricings.regime_id = $1
      GROUP BY 
      pricings.regime_id,
	    pricings.pricing_id,
	    pricings.pricing_name,
	    tickets.ticket_id,
	    tickets.ticket_buyer_id,
	    tickets.c_date,
	    tickets.c_time
	    ORDER BY (tickets.c_date, tickets.c_time) DESC
      FETCH FIRST 10 ROW ONLY
      `,
      [regimeId]
    );

    return res.status(400).json(lastTenTicketsPurchased.rows);
  } catch (error) {
    return res.status(500).json(error.message);
  }
};
