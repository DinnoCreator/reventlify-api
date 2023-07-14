const moment = require("moment");
const { salesForTheDay } = require("../../../../../utilities/queryRep");
const {
  regimeDetails,
  percentages,
} = require("../../../../../utilities/percentagesAndBalance");

exports.ticketBoughtTAY_comparison = async () => {
  // gets user logged in
  const user = req.user;
  //   client params
  const { regimeId } = req.params;
  //   date handler
  const today = moment(moment()).format("yy-MM-DD");
  const yesterday = moment(moment()).subtract(1, "days").format("yy-MM-DD");
  try {
    // gets details of regime
    const regimeDetailss = await regimeDetails(regimeId);

    // if regime does'nt exist response
    if (regimeDetailss.legnth === 0)
      return res.status(400).json("Regime does not exist.");

    // if user logged in is not permitted to access the result response
    if (regimeDetailss[0].creator_id !== user)
      return res.status(402).json("You are not permitted to access the result");

    // get sales
    const todaySales = await salesForTheDay(regimeId, today);
    const yesterdaySales = await salesForTheDay(regimeId, yesterday);

    const regimeTypePercent = await percentages(regimeDetailss[0].regime_type);
    // returns sales amount
    const amount = (check) => {
      if (check.rows.legnth === 0) {
        return 0;
      } else {
        return (Number(check.rows[0].total_amount) * regimeTypePercent) / 100;
      }
    };

    // assigns sales amounts to respective variables
    const todaySalesAmount = amount(todaySales);
    const yesterdaySalesAmount = amount(yesterday);

    return res.status(200).json({
      yesterday: {
        amountSold: yesterdaySalesAmount,
        ticketSold: Number(yesterdaySales.rows[0].tickets_bought),
        regimeName: yesterdaySales.rows[0].regime_name,
        date: yesterdaySales.rows[0].c_date,
      },
      today: {
        amountSold: todaySalesAmount,
        ticketSold: Number(todaySales.rows[0].tickets_bought),
        regimeName: todaySales.rows[0].regime_name,
        date: todaySales.rows[0].c_date,
      },
    });
  } catch (error) {
    return res.status(500).json(error.message);
  }
};
