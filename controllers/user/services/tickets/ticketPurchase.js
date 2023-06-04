const axios = require("axios");
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
  const { reference } = req.params;
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

    return res.status(200).json(response.data.data);
  } catch (error) {
    // Handle any errors that occur during the request
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
};
