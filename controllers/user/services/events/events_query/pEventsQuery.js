const pool = require("../../../../../db");

exports.popularEventInACathegory = async (req, res) => {
  const { cathegory } = req.params;
  try {
    const mostPopular = await pool.query(
      `
      WITH most_popular AS 
      (SELECT 
      regimes.regime_name AS namer, 
      regimes.regime_media AS media,
      regimes.regime_city AS city,
	    regimes.regime_start_date AS start_date,
	    regimes.regime_start_time AS start_time,
      regimes.c_date AS dater,
      regimes.c_time AS timer,
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
	    regimes.regime_start_date,
	    regimes.regime_start_time
      )
      SELECT SUM(regimes) AS ticket_bought, typer, idd, namer, media, city, start_date, start_time, dater, timer
	    FROM most_popular
      WHERE typer = $1
      GROUP BY most_popular.idd, typer, namer, media, city, start_date, start_time, dater, timer
      ORDER BY ticket_bought DESC
      FETCH FIRST 10 ROW ONLY
    `,
      [cathegory]
    );
    if (mostPopular.rows.length === 0)
      return res.status(202).json("nothing to show");
    return res.status(200).json(mostPopular.rows);
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

exports.mostPopularEvent = async (req, res) => {
  try {
    const mostPopular = await pool.query(
      `
        WITH most_popular AS 
        (SELECT 
        regimes.regime_name AS namer, 
        regimes.regime_media AS media,
        regimes.regime_city AS city,
        regimes.regime_start_date AS start_date,
        regimes.regime_start_time AS start_time,
        regimes.c_date AS dater,
        regimes.c_time AS timer,
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
        regimes.regime_start_date,
        regimes.regime_start_time
        )
        SELECT SUM(regimes) AS ticket_bought, typer, idd, namer, media, city, start_date, start_time, dater, timer
        FROM most_popular
        GROUP BY most_popular.idd, typer, namer, media, city, start_date, start_time, dater, timer
        ORDER BY ticket_bought DESC
        FETCH FIRST 10 ROW ONLY
        `
    );
    if (mostPopular.rows.length === 0)
      return res.status(202).json("nothing to show");
    return res.status(200).json(mostPopular.rows);
  } catch (error) {
    return res.status(500).json(error.message);
  }
};
