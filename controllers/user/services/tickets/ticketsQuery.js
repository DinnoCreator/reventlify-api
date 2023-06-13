const pool = require("../../../../db");

exports.ticketQuery = async (req, res) => {
  const userId = req.user;
  try {
    const ticketsOwnedByClient = await pool.query(
      "SELECT * FROM tickets WHERE ticket_owner_id = $1 ORDER BY (c_date, c_time) DESC",
      [userId]
    );
     if (ticketsOwnedByClient.rows.length === 0)
    return res.status(202).json("nothing to show");
    return res.status(200).json(ticketsOwnedByClient.rows[0]);
  } catch (error) {
    return;
  }
};
