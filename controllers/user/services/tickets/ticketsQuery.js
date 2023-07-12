const pool = require("../../../../db");

exports.ticketQuery = async (req, res) => {
  const userId = req.user;
  const { ticketId } = req.params;
  try {
    const ticketOwnedByClient = await pool.query(
      `
      SELECT 
      regimes.regime_media,
      regimes.regime_name,
      pricings.pricing_amount,
      pricings.pricing_name,
      tickets.ticket_id,
      regimes.regime_address,
      regimes.regime_city,
      regimes.regime_state,
      regimes.regime_country,
      regimes.regime_start_date,
      regimes.regime_start_time,
      tickets.c_date,
      tickets.c_time
      FROM tickets
      LEFT JOIN pricings
      ON
      tickets.pricing_id = pricings.pricing_id   
      LEFT JOIN regimes
      ON
      regimes.regime_id = pricings.regime_id 
      WHERE ticket_owner_id = $1 AND ticket_id = $2
      GROUP BY 
      regimes.regime_media,
      regimes.regime_name,
      pricings.pricing_amount,
      pricings.pricing_name,
      tickets.ticket_id,
      regimes.regime_address,
      regimes.regime_city,
      regimes.regime_state,
      regimes.regime_country,
      regimes.regime_start_date,
      regimes.regime_start_time,
      tickets.c_date,
      tickets.c_time
      ORDER BY (tickets.c_date, tickets.c_time) DESC
      `,
      [userId, ticketId]
    );
    if (ticketOwnedByClient.rows.length === 0)
      return res.status(202).json("nothing to show");
    return res.status(200).json(ticketOwnedByClient.rows[0]);
  } catch (error) {
    return res.status(500).json(error.message);
    return;
  }
};

exports.ticketsQuery = async (req, res) => {
  const userId = req.user;
  try {
    const ticketsOwnedByClient = await pool.query(
      `
      SELECT 
      regimes.regime_media,
      regimes.regime_status,
      regimes.regime_name,
      tickets.ticket_id,
      tickets.c_date,
      tickets.c_time
      FROM tickets
      LEFT JOIN pricings
      ON
      tickets.pricing_id = pricings.pricing_id   
      LEFT JOIN regimes
      ON
      regimes.regime_id = pricings.regime_id 
      WHERE ticket_owner_id = $1
      GROUP BY 
      regimes.regime_media,
      regimes.regime_status,
      regimes.regime_name,
      tickets.ticket_id,
      tickets.c_date,
      tickets.c_time
      ORDER BY (tickets.c_date, tickets.c_time) DESC
      `,
      [userId]
    );
    if (ticketsOwnedByClient.rows.length === 0)
      return res.status(202).json("nothing to show");
    return res.status(200).json(ticketsOwnedByClient.rows);
  } catch (error) {
    return res.status(500).json(error.message);
  }
};
