const pool = require("../../../../../db");
const capNsmalz = require("../../../../../utilities/capNsmalz");
const cloudinary = require("../../../../../utilities/cloudinary");
const sizeChecker = require("../../../../../utilities/sizeChecker");
const dayjs = require("dayjs");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const idGenerator = require("../../../../../utilities/IDGenerator");
const _ = require('lodash');
const { nameCheckerRep } = require("../../../../../utilities/queryRep");

exports.createRegime = async (req, res) => {
  const userId = req.user;
  const userName = req.name;
  const email = req.email;
  const {
    regimeType,
    regimeDescription,
    regimeAddress,
    regimePricing,
    regimeCity,
    regimeState,
    regimeCountry,
    regimeWithdrawalPin,
    regimeMediaBase64,
    regimeAffiliate,
    regimeStartDate,
    regimeStartTime,
    regimeEndDate,
    regimeEndTime,
  } = req.body;
  const regimeName  = _.trim(req.body.regimeName, '`_- ,:;/.{}[]()|?"*^%#@!~+&%');
  try {
    // Checks name availability
    if (regimeName.length === 0)
      return res.status(400).json("You must enter a regime name.");
    if (
      regimeAddress.length === 0 ||
      regimePricing.length === 0 ||
      regimeWithdrawalPin.length === 0 ||
      regimeStartDate.length === 0 ||
      regimeStartTime.length === 0 ||
      regimeEndDate.length === 0 ||
      regimeEndTime.length === 0
    )
      return res.status(400).json("Some inputs are missing.");
    const regimeNameAvailability = await pool.query(
      "SELECT * FROM regimes WHERE regime_name = $1",
      [regimeName]
    );
    // Checks name availability
    // if (regimeNameAvailability.rows.length === 1)
    //   return res.status(409).json("Regime name already exists.");
    const nameCheckResult = await nameCheckerRep(userId, regimeName);
    if (nameCheckResult !== 'ok')
    return res.status(409).json("Regime name already in use.");

    // Checks media file size
    if (Number(sizeChecker.sizeChecker(regimeMediaBase64).MB) > Number(10))
      return res.status(400).json("Media larger than 10MB");

    // adds the first two alphabet characters to the regime ID
    const typePrefix = capNsmalz.regimeTypePrefix(regimeType);

    // hashes withdrawal pin
    const hashedPin = await bcrypt.hash(regimeWithdrawalPin, 10);

    //uploads the image to cloudinary and gets the url and id
    const resultOfUpdate = await cloudinary.uploader.upload(regimeMediaBase64, {
      folder: "regime_media",
    });

    // creates the regime
    const newRegime = await pool.query(
      "INSERT INTO regimes(regime_id, creator_id, regime_name, regime_address, regime_city, regime_state, regime_country, regime_withdrawal_pin, regime_type, regime_media, regime_media_id, regime_accbal, regime_affiliate, regime_status, regime_start_date, regime_start_time, regime_end_date, regime_end_time, c_date, c_time, regime_description) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21) RETURNING *",
      [
        await idGenerator.regimeID(typePrefix),
        userId,
        regimeName.toLowerCase(),
        regimeAddress.toLowerCase(),
        regimeCity.toLowerCase(),
        regimeState.toLowerCase(),
        regimeCountry.toLowerCase(),
        hashedPin,
        regimeType.toLowerCase(),
        resultOfUpdate.secure_url,
        resultOfUpdate.public_id,
        0.0,
        regimeAffiliate.toLowerCase(),
        "ONGOING".toLowerCase(),
        regimeStartDate,
        regimeStartTime,
        regimeEndDate,
        regimeEndTime,
        // dayjs(regimeStartDate).format("YYYY-MM-DD"),
        // regimeStartTime,
        // moment(regimeStartTime, "hmm").format("HH:mm"),
        // dayjs(regimeEndDate).format("YYYY-MM-DD"),
        // regimeEndTime,
        // moment(regimeEndTime, "hmm").format("HH:mm"),
        dayjs().format("YYYY-MM-DD"),
        dayjs().format("HH:mm:ss"),
        regimeDescription,
      ]
    );

    // creates all the regime's pricing
    regimePricing.map(async (price) => {
      await pool.query(
        "INSERT INTO pricings(pricing_id, regime_id, pricing_name, pricing_total_seats, pricing_available_seats, pricing_amount, pricing_affiliate_amount, c_date, c_time) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *",
        [
          await idGenerator.pricingID(typePrefix),
          newRegime.rows[0].regime_id,
          price.pricingName.toLowerCase(),
          Number(price.pricingTotalSeats),
          Number(price.pricingTotalSeats),
          Number(price.pricingAmount),
          Number(price.pricingAffiliateAmount),
          dayjs().format("YYYY-MM-DD"),
          dayjs().format("HH:mm:ss"),
        ]
      );
    });

    const creatorRoleAssigner = await pool.query(
      `
    INSERT INTO regime_roles(partcipant_id, regime_id, regime_role) 
    VALUES($1, $2, $3) RETURNING *
    `,
      [newRegime.rows[0].creator_id, newRegime.rows[0].regime_id, "creator"]
    );
    //credentials for email transportation
    const transport = nodemailer.createTransport({
      host: "smtp.office365.com",
      post: 587,
      auth: {
        user: "reventlifyhub@outlook.com",
        pass: process.env.MAIL,
      },
    });

    //Regime Creation company alert
    const msg = {
      from: "Reventlify <reventlifyhub@outlook.com>", // sender address
      to: "edijay17@gmail.com", // list of receivers
      subject: "Newly Created Regime", // Subject line
      text: `Congrats ${capNsmalz.neat(
        userName
      )} just successfully created ${newRegime.rows[0].regime_name.toUpperCase()} a ${capNsmalz.neat(
        newRegime.rows[0].regime_type
      )} type event with Reventlify.`, // plain text body
      html: `<h1>Newly Created Regime</h1>
      <p>Congrats ${capNsmalz.neat(
        userName
      )} just successfully created ${newRegime.rows[0].regime_name.toUpperCase()} a ${capNsmalz.neat(
        newRegime.rows[0].regime_type
      )} type event with <strong>Reventlify</strong></p>`, //HTML message
    };

    //Regime Creation client alert
    const msg1 = {
      from: "Reventlify <reventlifyhub@outlook.com>", // sender address
      to: email, // list of receivers
      subject: "Regime Creation Successful", // Subject line
      text: `${capNsmalz.neat(
        userName
      )} you have successfully created ${newRegime.rows[0].regime_name.toUpperCase()} a ${capNsmalz.neat(
        newRegime.rows[0].regime_type
      )} type of event, thank you for choosing Reventlify.`, // plain text body
      html: `<h2>Regime Creation Successful</h2>
        <p>${capNsmalz.neat(
          userName
        )} you have successfully created ${newRegime.rows[0].regime_name.toUpperCase()} a ${capNsmalz.neat(
        newRegime.rows[0].regime_type
      )} type of event, thank you for choosing <strong>Reventlify</strong>.</p>`, //HTML message
    };

    // send mail with defined transport object
    await transport.sendMail(msg);
    await transport.sendMail(msg1);

    // return
    return res.status(200).json({ "Regime Creation": "Successful!" });
  } catch (error) {
    return res.status(500).json(error.message);
  }
};
