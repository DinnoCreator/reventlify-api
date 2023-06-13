require("dotenv").config();
const pool = require("../db");

exports.percentages = async (regimeType) => {
  try {
    // company details
    const companyDetails = await pool.query(
      "SELECT company_accbal, theatre_percentage, concert_percentage, service_percentage, conference_percentage, pageantry_percentage, education_percentage, carnival_percentage, festival_percentage, party_percentage, sport_percentage, talentshow_percentage FROM company WHERE company_id = $1",
      [process.env.COMPANY_ID]
    );

    if (regimeType.toLowerCase() === "concert") {
      return Number(companyDetails.rows[0].concert_percentage);
    } else if (regimeType.toLowerCase() === "conference") {
      return Number(companyDetails.rows[0].conference_percentage);
    } else if (regimeType.toLowerCase() === "theatre") {
      return Number(companyDetails.rows[0].theatre_percentage);
    } else if (regimeType.toLowerCase() === "pageantry") {
      return Number(companyDetails.rows[0].pageantry_percentage);
    } else if (regimeType.toLowerCase() === "service") {
      return Number(companyDetails.rows[0].service_percentage);
    } else if (regimeType.toLowerCase() === "education") {
      return Number(companyDetails.rows[0].education_percentage);
    } else if (regimeType.toLowerCase() === "carnival") {
      return Number(companyDetails.rows[0].carnival_percentage);
    } else if (regimeType.toLowerCase() === "festival") {
      return Number(companyDetails.rows[0].festival_percentage);
    } else if (regimeType.toLowerCase() === "party") {
      return Number(companyDetails.rows[0].party_percentage);
    } else if (regimeType.toLowerCase() === "sport") {
      return Number(companyDetails.rows[0].sport_percentage);
    } else if (regimeType.toLowerCase() === "talentshow") {
      return Number(companyDetails.rows[0].talentshow_percentage);
    } else {
      return "Error method not allowed";
    }
  } catch (error) {
    return "Error method not allowed";
  }
};

exports.companyCurrentBal = async () => {
  try {
    // company details
    const companyDetails = await pool.query(
      "SELECT company_accbal, theatre_percentage, concert_percentage, service_percentage, conference_percentage, pageantry_percentage, education_percentage, carnival_percentage, festival_percentage, party_percentage, sport_percentage, talentshow_percentage FROM company WHERE company_id = $1",
      [process.env.COMPANY_ID]
    );

    return Number(companyDetails.rows[0].company_accbal);
  } catch (error) {
    return "Error method not allowed";
  }
};

exports.clientCurrentBal = async (clientId) => {
  try {
    // client details
    const clientDetails = await pool.query(
      "SELECT client_accbal FROM clients WHERE client_id = $1",
      [clientId]
    );

    return Number(clientDetails.rows[0].client_accbal);
  } catch (error) {
    return "Error method not allowed";
  }
};
