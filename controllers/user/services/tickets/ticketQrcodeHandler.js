const QRCode = require("qrcode");
const pool = require("../../../../db");

exports.ticketQrGenerator = async (req, res) => {
  const { ticketId } = req.body;
  try {
    const ticketDetails = await pool.query(
      "SELECT * FROM tickets WHERE  ticket_id = $1",
      [ticketId]
    );

    if (ticketDetails.rows.length === 0) res.status(4);
    QRCode.toString("I am a pony!", function (err, url) {
      console.log(url);
    });
    return;
  } catch (error) {
    console.log(error.message);
    return res.status(500).json(error.message);
  }
};
