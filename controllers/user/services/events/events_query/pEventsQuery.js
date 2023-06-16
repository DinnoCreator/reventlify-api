const pool = require("../../../../../db");

exports.popularEventInACathegory = async (req, res) => {
  const { cathegory } = req.body;
  try {
    const mostPopular = await pool.query(
      `
    WITH most_popular AS 
    (
        select regimes.regime_type as typer, pricings.regime_id as idd, 
        COUNT(pricings.regime_id) as regimes from tickets
        LEFT JOIN pricings
        ON
        tickets.pricing_id = pricings.pricing_id
        LEFT JOIN regimes
        ON
        pricings.regime_id = regimes.regime_id
        GROUP BY tickets.pricing_id, pricings.regime_id, regimes.regime_type
    )
    SELECT typer, idd, SUM(regimes) as ticket_bought from most_popular 
    WHERE typer = $1
    GROUP BY most_popular.idd, most_popular.typer
    ORDER BY ticket_bought DESC
    FETCH FIRST 10 ROW ONLY
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
