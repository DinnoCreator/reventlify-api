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
  const { reference, status, regimeId, pricingId, userId, affiliate } =
    req.body;
  try {
    // verifies the transaction on paystack
    const response = await axios({
      method: "get",
      url: `https://api.paystack.co/transaction/verify/${reference}`,
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        "content-type": "application/json",
        "cache-control": "no-cache",
      },
    });

    // gets the amount for the ticket and the id for that pricing
    const pricingAmount = await pool.query(
      "SELECT pricing_amount, pricing_id FROM pricings WHERE pricing_id = $1",
      [pricingId]
    );

    // converts it to naira
    const amount = Number(response.data.data.amount) / 100;

    // gets the remainder of the division of the amount paid by the actual ticket amount
    const remainderChecker =
      amount % Number(pricingAmount.rows[0].pricing_amount);

    // function to run if it has a remainder
    if (remainderChecker !== 0) {
      await pool.query(
        "INSERT INTO transactions(transaction_id, client_id, regime_id, pricing_id, reference_number, amount, transaction_status, transaction_description, transaction_date, transaction_time) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *",
        [
          await transactionID(),
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

    // steps to handle if it does not have a remainder

    // gets the number of tickets purchased
    let numberOfTickets = amount / Number(pricingAmount.rows[0].pricing_amount);

    // saves the transaction in the database
    const transaction = await pool.query(
      "INSERT INTO transactions(transaction_id, client_id, regime_id, pricing_id, reference_number, amount, transaction_status, transaction_description, transaction_date, transaction_time) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *",
      [
        await transactionID(),
        userId,
        regimeId,
        pricingId,
        reference,
        Number(amount),
        status.toLowerCase(),
        "amount matches pricing",
        dayjs().format("YYYY-MM-DD"),
        dayjs().format("HH:mm:ss"),
      ]
    );

    // loop to create the number of tickets purchased in the database
    for (let i = 1; i <= numberOfTickets; i++) {
      if (i <= 10) {
        await pool.query(
          "INSERT INTO tickets(ticket_id, pricing_id, transaction_id, ticket_buyer_id, ticket_owner_id, ticket_amount, ticket_status, affiliate_id, c_date, c_time) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *",
          [
            await ticketID(),
            pricingAmount.rows[0].pricing_id,
            transaction.rows[0].transaction_id,
            userId,
            userId,
            Number(pricingAmount.rows[0].pricing_amount),
            status.toLowerCase(),
            affiliate,
            dayjs().format("YYYY-MM-DD"),
            dayjs().format("HH:mm:ss"),
          ]
        );
      }
    }
    return res.status(200).json(response.data.data);
  } catch (error) {
    // Handle any errors that occur during the request
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
};
