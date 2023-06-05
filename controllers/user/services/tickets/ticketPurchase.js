const axios = require("axios");
const pool = require("../../../../db");
const {
  transactionID,
  ticketID,
} = require("../../../../utilities/IDGenerator");
const dayjs = require("dayjs");
exports.ticketsPurchase = async (req, res) => {
  // request body from the clients
  const { email, amount } = req.body;
  try {
    // params
    const params = JSON.stringify({
      email: email,
      amount: amount * 100,
    });

    const response = await axios({
      method: "post",
      url: "https://api.paystack.co/transaction/initialize",
      data: params,
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        "content-type": "application/json",
        "cache-control": "no-cache",
      },
    });

    return res.status(200).json(response.data.data);
  } catch (error) {
    // Handle any errors that occur during the request
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
};

exports.purchaseVerifier = async (req, res) => {
  // request params from the clients
  const { reference, status, regimeId, pricingId, userId } = req.body;
  try {
    const response = await axios({
      method: "get",
      url: `https://api.paystack.co/transaction/verify/${reference}`,
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        "content-type": "application/json",
        "cache-control": "no-cache",
      },
    });
    const pricingAmount = await pool.query(
      "SELECT pricing_amount FROM pricings WHERE pricing_id = $1",
      [pricingId]
    );
    const amount = Number(response.data.data.amount) / 100;

    const remainderChecker = amount % Number(pricingAmount);

    const transactionId = await transactionID();
    const ticketId = await ticketID();
    if (remainderChecker !== 0) {
      await pool.query(
        "INSERT INTO transactions(transaction_id, client_id, regime_id, pricing_id, reference_number, amount, transaction_status, transaction_description, transaction_date, transaction_time) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *",
        [
          transactionId,
          userId,
          regimeId,
          pricingId,
          reference,
          Number(amount),
          status.toLowerCase(),
          "amount does not match pricing",
          dayjs().format("YYYY-MM-DD"),
          dayjs().format("HH:mm:ss"),
        ]
      );
      return res.status(400).json("amount does not match pricing");
    }
    return res.status(200).json(response.data.data);
  } catch (error) {
    // Handle any errors that occur during the request
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
};
