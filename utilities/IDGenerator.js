const pool = require("../db");
const randomString = require("random-string");

// generates clients IDs
exports.clientID = async () => {
  // generates clients ID
  let id = randomString({
    length: 10,
    numeric: true,
    letters: false,
    special: false,
  });
  try {
    const checker = await pool.query(
      "SELECT * FROM clients WHERE client_id = $1",
      [id]
    );

    if (checker.rows.length !== 0) {
      return clientID();
    } else {
      return id;
    }
  } catch (error) {
    return console.log(error);
  }
};

// generates regime IDs
exports.regimeID = async (typePrefix) => {
  // generates regime ID
  let idR = randomString({
    length: 10,
    numeric: true,
    letters: false,
    special: false,
  });
  try {
    // Checks if the ID already exists
    const checker = await pool.query(
      "SELECT * FROM regimes WHERE regime_id = $1",
      [`${typePrefix}${idR}`]
    );

    if (checker.rows.length !== 0) {
      return regimeID(typePrefix);
    } else {
      // Return Unique ID
      return `${typePrefix}${idR}`;
    }
  } catch (error) {
    return console.log(error);
  }
};

// generates pricing IDs
exports.pricingID = async (typePrefix) => {
  // generates pricing ID
  let idP = randomString({
    length: 12,
    numeric: true,
    letters: false,
    special: false,
  });
  try {
    // Checks if the ID already exists
    const checker = await pool.query(
      "SELECT * FROM pricings WHERE pricing_id = $1",
      [`${typePrefix}${idP}P`]
    );

    if (checker.rows.length !== 0) {
      return pricingID(typePrefix);
    } else {
      // Return Unique ID
      return `${typePrefix}${idP}P`;
    }
  } catch (error) {
    console.log(error);
  }
};

// const pricing = [
//   {
//     pricingName: "regular",
//     pricingAmount: 2000,
//     pricingTotalSeats: 5000,
//     pricingAffiliateAmount: 100,
//   },
//   {
//     pricingName: "vip",
//     pricingAmount: 10000,
//     pricingTotalSeats: 500,
//     pricingAffiliateAmount: 400,
//   },
//   {
//     pricingName: "vvip",
//     pricingAmount: 100000,
//     pricingTotalSeats: 50,
//     pricingAffiliateAmount: 1500,
//   },
// ];
