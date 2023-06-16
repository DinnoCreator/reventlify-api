const { regimeDetails } = require("../../../../../utilities/percentagesAndBalance");


exports.ticketBoughtUpdate = async (req, res) => {
    const regimeCreator = req.user
  try {
    const regimeDetails = regimeDetails(regimeCreator)
    return;
  } catch (error) {
    return;
  }
};
