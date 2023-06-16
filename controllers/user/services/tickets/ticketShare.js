const pool = require("../../../../db");
const {
  clientDetails,
} = require("../../../../utilities/percentagesAndBalance");

exports.ticketShare = async (req, res) => {
  const senderId = req.user;
  const { ticketId, receiverId } = req.body;
  try {
    const ticketDetails = await pool.query(
      `
          SELECT * FROM tickets WHERE ticket_id = $1 AND ticket_buyer_id = $2
        `,
      [ticketId, senderId]
    );

    if (ticketDetails.rows.length === 0)
      return res.status(400).json("You don't own this ticket");

    const changeOfOwnership = await pool.query(
      `
          UPDATE tickets SET ticket_owner_id = $1 WHERE ticket_id = $2
        `,
      [receiverId, ticketId]
    );

    const receiverName = await clientDetails(receiverId).client_name;
    return res
      .status(200)
      .json(`You have successfully transfered your ticket to ${receiverName}`);
  } catch (error) {
    return res.status(200).json(error.message);
  }
};
