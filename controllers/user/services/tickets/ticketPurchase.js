// dependencies
const axios = require("axios");
const pool = require("../../../../db");
const nodemailer = require("nodemailer");
const capNsmalz = require("../../../../utilities/capNsmalz");
const crypto = require("crypto");
const {
  transactionID,
  ticketID,
} = require("../../../../utilities/IDGenerator");
const dayjs = require("dayjs");
const {
  percentages,
  companyCurrentBal,
  clientCurrentBal,
} = require("../../../../utilities/percentagesAndBalance");

// ticket purchase service
exports.ticketsPurchase = async (req, res) => {
  const userId = req.user;
  // request body from the clients
  const { email, amount, pricingId, regimeId, affiliate } = req.body;
  try {
    // gets the amount for the ticket and the id for that pricing
    const pricingAmount = await pool.query(
      "SELECT pricing_amount, pricing_id FROM pricings WHERE pricing_id = $1",
      [pricingId]
    );
    // gets the amount for the ticket and the id for that pricing
    const ticketsBought = await pool.query(
      "SELECT ticket_buyer_id, ticket_id FROM tickets WHERE ticket_buyer_id = $1",
      [userId]
    );

    const ticketPrice = Number(pricingAmount.rows[0].pricing_amount);
    const amountNumber = Number(amount);
    // gets the number of tickets purchased
    const numberOfTickets = amountNumber / ticketPrice;

    // gets the remainder of the division of the amount paid by the actual ticket amount
    const remainderChecker =
      amount % Number(pricingAmount.rows[0].pricing_amount);

    // checks if user has purchased up to 10 tickets
    if (ticketsBought.rows.length === 10)
      return res
        .status(400)
        .json(`You have reached the ticket purchase limit(10) for this event.`);

    // checks if user is trying to pay less than the price for the ticket
    if (amountNumber < ticketPrice)
      return res
        .status(402)
        .json(
          `The amount inputed, is less than the price of the ticket. Which is ${ticketPrice}.`
        );

    // checks if user is trying to buy more than 10 tickets
    if (numberOfTickets > 10)
      return res
        .status(402)
        .json(`Each user's maximum number of tickets purchase per event is 10`);

    // checks if user is trying to buy more than 10 tickets
    if (remainderChecker !== 0)
      return res.status(402).json(`The amount inputed has change`);
    // params
    const params = JSON.stringify({
      email: email,
      amount: amountNumber * 100,
      metadata: {
        data: {
          regimeId: regimeId,
          pricingId: pricingId,
          affiliateId: affiliate,
          buyerId: userId,
        },
      },
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

// // purchase verifier service
// exports.purchaseVerifier = async (req, res) => {
//   try {
//   } catch (error) {
//     // Handle any errors that occur during the request
//     console.error(error);
//     res.status(500).json({ error: "An error occurred" });
//   }
// };

exports.paystackWebhook = async (req, res) => {
  try {
    const secret = process.env.PAYSTACK_SECRET_KEY;
    const hash = crypto
      .createHmac("sha512", secret)
      .update(JSON.stringify(req.body))
      .digest("hex");
    if (hash == req.headers["x-paystack-signature"]) {
      res.sendStatus(200);
      // Retrieve the request's body
      const event = req.body;

      // request params from the client side
      const { reference } = event.data;
      const { buyerId, regimeId, pricingId, affiliateId } =
        event.data.metadata.data;

      const userId = buyerId;
      // gets client accBal just incase
      const clientDetails = await pool.query(
        "SELECT client_accbal, client_name, client_email FROM clients WHERE client_id = $1",
        [userId]
      );

      const userEmail = clientDetails.rows[0].client_email;
      const userName = clientDetails.rows[0].client_name;
      // checks if transaction already exists in the database
      const transactionExistence = await pool.query(
        "SELECT * FROM transactions WHERE reference_number = $1",
        [reference]
      );

      // regime details
      const regimeDetails = await pool.query(
        "SELECT creator_id, regime_accbal, regime_name, regime_type FROM regimes WHERE regime_id = $1",
        [regimeId]
      );

      // regime creator details
      const regimeCreatorDetails = await pool.query(
        "SELECT client_name, client_email FROM clients WHERE client_id = $1",
        [regimeDetails.rows[0].creator_id]
      );

      // response if transaction already exists
      if (transactionExistence.rows.length !== 0)
        return res.status(400).json(`transaction has been verified already`);

      // gets the amount for the ticket and the id for that pricing
      const pricingAmount = await pool.query(
        "SELECT pricing_amount, pricing_id, pricing_name, pricing_affiliate_amount, pricing_total_seats, pricing_available_seats FROM pricings WHERE pricing_id = $1",
        [pricingId]
      );

      if (
        event.data.status.toLowerCase() !== "success" &&
        event.data.status.toLowerCase() !== "declined"
      )
        return res.status(400).json("The transaction was not completed");
      // converts it to naira
      const amount = Number(event.data.amount) / 100;

      const ticketPrice = Number(pricingAmount.rows[0].pricing_amount);

      // gets the number of tickets purchased
      let numberOfTickets = amount / ticketPrice;

      // function to run if it has a remainder
      if (amount < ticketPrice) {
        await pool.query(
          "INSERT INTO transactions(transaction_id, transaction_type, client_id, regime_id, pricing_id, reference_number, amount, transaction_status, transaction_description, transaction_date, transaction_time) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *",
          [
            await transactionID(),
            "purchase",
            userId,
            regimeId,
            pricingId,
            reference,
            Number(amount),
            event.data.status.toLowerCase(),
            "amount does not match pricing",
            dayjs().format("YYYY-MM-DD"),
            dayjs().format("HH:mm:ss"),
          ]
        );
        return res.status(400).json("amount does not match pricing");
      }
      if (event.data.status.toLowerCase() === "declined") {
        await pool.query(
          "INSERT INTO transactions(transaction_id, transaction_type, client_id, regime_id, pricing_id, reference_number, amount, transaction_status, transaction_description, transaction_date, transaction_time) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *",
          [
            await transactionID(),
            "purchase",
            userId,
            regimeId,
            pricingId,
            reference,
            Number(amount),
            event.data.status.toLowerCase(),
            "transaction declined",
            dayjs().format("YYYY-MM-DD"),
            dayjs().format("HH:mm:ss"),
          ]
        );
        return res.status(400).json("transaction declined");
      }

      // steps to handle if it does not have a remainder

      // saves the transaction in the database
      const transaction = await pool.query(
        "INSERT INTO transactions(transaction_id, transaction_type, client_id, regime_id, pricing_id, reference_number, amount, transaction_status, transaction_description, transaction_date, transaction_time) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *",
        [
          await transactionID(),
          "purchase",
          userId,
          regimeId,
          pricingId,
          reference,
          Number(amount),
          event.data.status.toLowerCase(),
          "amount matches pricing",
          dayjs().format("YYYY-MM-DD"),
          dayjs().format("HH:mm:ss"),
        ]
      );

      const affiliateChecker = (affiliate) => {
        if (affiliate === "none") {
          return null;
        } else {
          return `${affiliate}`;
        }
      };

      const affiliatelog = affiliateChecker(affiliateId);
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
              ticketPrice,
              event.data.status.toLowerCase(),
              affiliatelog,
              dayjs().format("YYYY-MM-DD"),
              dayjs().format("HH:mm:ss"),
            ]
          );
        }
      }

      const availableSeats = Number(
        pricingAmount.rows[0].pricing_available_seats - numberOfTickets
      );

      await pool.query(
        "UPDATE pricings set pricing_available_seats = $1 WHERE pricing_id = $2",
        [availableSeats, pricingId]
      );
      const regimeTypePercent = await percentages(
        regimeDetails.rows[0].regime_type
      );

      const clientReminantMoney = amount - ticketPrice * numberOfTickets;

      const moneyTotal = ticketPrice * numberOfTickets;

      const charge = (moneyTotal * regimeTypePercent) / 100;

      // handles regime balance update
      const regimeProfit = moneyTotal - charge;
      const regimeFormerBal = Number(regimeDetails.rows[0].regime_accbal);
      const regimeNewBal = regimeFormerBal + regimeProfit;

      // handles company balance update
      const compFormerBal = await companyCurrentBal();
      const companyNewBal = Number(charge + compFormerBal);

      // handles clients balance update
      const clientFormerBal = await clientCurrentBal(userId);
      const clientNewBal = Number(clientFormerBal + clientReminantMoney);

      // handles clients balance update
      const affiliateFormerBal = await clientCurrentBal(userId);
      const affiliateNewBal = Number(
        affiliateFormerBal + pricingAmount.rows[0].pricing_affiliate_amount
      );

      const regimeTopUp = await pool.query(
        "UPDATE regimes SET regime_accbal = $1 WHERE regime_id = $2 RETURNING *",
        [regimeNewBal, regimeId]
      );
      const companyTopUp = await pool.query(
        "UPDATE company SET company_accbal = $1 WHERE company_id = $2 RETURNING *",
        [companyNewBal, process.env.COMPANY_ID]
      );
      const clientTopUp = await pool.query(
        "UPDATE clients SET client_accbal = $1 WHERE client_id = $2 RETURNING *",
        [clientNewBal, userId]
      );

      const affiliateCrediter = async () => {
        if (affiliatelog !== "none") {
          return await pool.query(
            "UPDATE clients WHERE client_id = $1 SET client_accbal = $2 RETURNING *",
            [affiliatelog, affiliateNewBal]
          );
        }
      };

      await affiliateCrediter();
      //credentials for email transportation
      const transport = nodemailer.createTransport({
        host: "smtp.office365.com",
        post: 587,
        auth: {
          user: "reventlifyhub@outlook.com",
          pass: process.env.MAIL,
        },
      });

      //ticket purchaser alert
      const msg = {
        from: "Reventlify <reventlifyhub@outlook.com>", // sender address
        to: userEmail, // list of receivers
        subject: "Ticket Purchase", // Subject line
        text: `Congrats ${capNsmalz.neat(
          userName
        )} you just successfully purchased ${numberOfTickets} ${regimeDetails.rows[0].regime_name.toUpperCase()} ${pricingAmount.rows[0].pricing_name.toLowerCase()} ticket${
          numberOfTickets === 1 ? "" : "s"
        }.`, // plain text body
        html: `<h1>Ticket Purchase</h1>
      <p>Congrats ${capNsmalz.neat(
        userName
      )} you just successfully purchased ${numberOfTickets} <strong>${regimeDetails.rows[0].regime_name.toUpperCase()}</strong> ${pricingAmount.rows[0].pricing_name.toLowerCase()} ticket${
          numberOfTickets === 1 ? "" : "s"
        }.</p>`, //HTML message
      };

      //regime creator alert
      const msg1 = {
        from: "Reventlify <reventlifyhub@outlook.com>", // sender address
        to: regimeCreatorDetails.rows[0].client_email, // list of receivers
        subject: "Ticket Purchase", // Subject line
        text: `Congrats ${capNsmalz.neat(
          regimeCreatorDetails.rows[0].client_name
        )}, ${capNsmalz.neat(
          userName
        )} just successfully purchased ${numberOfTickets} ${pricingAmount.rows[0].pricing_name.toLowerCase()} ticket${
          numberOfTickets === 1 ? "" : "s"
        } for your ${regimeDetails.rows[0].regime_name.toUpperCase()} regime.`, // plain text body
        html: `<h1>Ticket Purchase</h1>
      <p>Congrats ${capNsmalz.neat(
        regimeCreatorDetails.rows[0].client_name
      )},  ${capNsmalz.neat(
          userName
        )} just successfully purchased ${numberOfTickets} ${pricingAmount.rows[0].pricing_name.toLowerCase()} ticket${
          numberOfTickets === 1 ? "" : "s"
        } for your <strong>${regimeDetails.rows[0].regime_name.toUpperCase()}</strong> regime.</p>`, //HTML message
      };

      //company alert
      const msg2 = {
        from: "Reventlify <reventlifyhub@outlook.com>", // sender address
        to: "edijay17@gmail.com", // list of receivers
        subject: "Ticket Purchase", // Subject line
        text: `Congrats, ${capNsmalz.neat(
          userName
        )} just successfully purchased ${numberOfTickets} ${pricingAmount.rows[0].pricing_name.toLowerCase()} ticket${
          numberOfTickets === 1 ? "" : "s"
        } for ${regimeDetails.rows[0].regime_name.toUpperCase()} regimee and your current balance is ${
          companyTopUp.rows[0].company_accbal
        }.`, // plain text body
        html: `<h1>Ticket Purchase</h1>
      <p>Congrats, ${capNsmalz.neat(
        userName
      )} just successfully purchased ${numberOfTickets} ${pricingAmount.rows[0].pricing_name.toLowerCase()} ticket${
          numberOfTickets === 1 ? "" : "s"
        } for <strong>${regimeDetails.rows[0].regime_name.toUpperCase()}</strong> regime and your current balance is ${
          companyTopUp.rows[0].company_accbal
        }.</p>`, //HTML message
      };

      // send mail with defined transport object
      await transport.sendMail(msg);
      await transport.sendMail(msg1);
      await transport.sendMail(msg2);

      // final response
      return res.status(200);
    }
  } catch (error) {
    return;
  }
};
