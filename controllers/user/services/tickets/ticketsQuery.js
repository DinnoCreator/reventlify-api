const pool = require("../../../../db");

exports.ticketQuery = async (req, res) => {
  const userId = req.user;
  try {
    const ticketsOwnedByClient = await pool.query(
      "SELECT * FROM tickets WHERE ticket_owner_id = $1 ORDER BY (c_date, c_time) DESC",
      [userId]
    );
    return res.status(200).json(ticketsOwnedByClient.rows[0]);
  } catch (error) {
    return;
  }
};
