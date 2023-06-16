const pool = require("../../../../../db");

exports.popularEventInACathegory = async (req, res) => {
  const { cathegory } = req.body;
  try {
    const mostPopular = await pool.query(
      `
      WITH most_popular AS 
      (SELECT 
      regimes.regime_name as namer, 
      regimes.regime_media as media,
      regimes.regime_city as city,
      regimes.c_date as dater,
      regimes.c_time as timer,
      MIN(pricings.pricing_amount) AS min_ticket_price,
       regimes.regime_type AS typer, 
       pricings.regime_id AS idd, 
      COUNT(pricings.regime_id) AS regimes FROM tickets
      LEFT JOIN pricings
      ON
      tickets.pricing_id = pricings.pricing_id
      LEFT JOIN regimes
      ON
      pricings.regime_id = regimes.regime_id
      GROUP BY 
       tickets.pricing_id, 
       pricings.regime_id, 
       regimes.regime_type,
      regimes.regime_name, 
      regimes.regime_media,
      regimes.regime_city,
      regimes.c_date,
      regimes.c_time,
      pricings.pricing_amount
      )
      SELECT typer, idd, namer, media, city, dater, timer, min_ticket_price, SUM(regimes) 
      AS ticket_bought FROM most_popular
      WHERE typer = $1
      GROUP BY idd, typer, namer, media, city, dater, timer, min_ticket_price
      ORDER BY ticket_bought DESC
      FETCH FRIST 10 ROW ONLY
    `,
      [cathegory]
    );
    if (mostPopular.rows.length === 0)
      return res.status(202).json("nothing to show");
    return res.status(200).json(mostPopular.rows);
  } catch (error) {
    return;
  }
};
