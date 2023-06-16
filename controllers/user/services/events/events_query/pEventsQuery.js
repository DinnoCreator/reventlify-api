const pool = require("../../../../../db");


exports.popularEventInACathegory = async (req, res) => {
  try {
    const mostPopular = await pool.query(`
    WITH most_popular AS 
    (select pricings.regime_id as idd, 
    count(pricings.regime_id) as regimes from tickets
    LEFT OUTER JOIN pricings
    ON
    tickets.pricing_id = pricings.pricing_id   
    GROUP BY tickets.pricing_id, pricings.regime_id)
    select idd, sum(regimes) as ticket_bought from most_popular
    group by most_popular.idd;
    `)
    return;
  } catch (error) {
    return;
  }
};
