require("dotenv").config();
const pool = require("../db");

exports.salesForTheDay = async (regimeId, date) => {
  try {
    const sales = await pool.query(
      `
      WITH the_source AS (SELECT 
        regimes.regime_name,
        regimes.regime_id,
        pricings.pricing_name,
		    tickets.c_date,
        COUNT(tickets.ticket_id) AS tickets_bought,
        (pricings.pricing_amount * COUNT(pricings.regime_id)) AS total_amount,
		    pricings.pricing_amount
		    FROM tickets
        LEFT JOIN pricings
        ON
        tickets.pricing_id = pricings.pricing_id
        LEFT JOIN regimes
        ON
        pricings.regime_id = regimes.regime_id
		    WHERE regimes.regime_id = $1 and tickets.c_date = $2
		    GROUP BY 
        regimes.regime_name,
        regimes.regime_id,
        pricings.pricing_name,
		    pricings.pricing_amount,
		    tickets.c_date)
		    SELECT SUM(total_amount) as total_amount, 
		    SUM(tickets_bought) as tickets_bought, 
		    the_source.regime_name, 
        the_source.c_date, 
		    the_source.regime_id
		    from the_source
        GROUP BY the_source.regime_name, the_source.c_date, the_source.regime_id;
        `,
      [regimeId, date]
    );

    return sales;
  } catch (error) {
    return "Error method not allowed";
  }
};

exports.nameCheckerRep = async (user, name) => {
  try {
    if (name.length === 0) res.status(400).json("Empty search input");

    const nameCheck = await pool.query(
      "SELECT * FROM regimes WHERE regime_name = $1",
      [name.toLowerCase()]
    );

    if (nameCheck.rows.length > 0) {
      const nameCheck1 = await pool.query(
        "SELECT * FROM regimes WHERE regime_name = $1 and creator_id = $2",
        [name.toLowerCase(), user]
      );
      const nameCheck2 = await pool.query(
        "SELECT * FROM regimes WHERE regime_name = $1 and creator_id = $2 and regime_status = $3",
        [name.toLowerCase(), user, "ongoing"]
      );
      if (nameCheck1.rows.length === 0 && nameCheck2.rows.length === 0) {
        return 'not ok';
      } else if (nameCheck1.rows.length > 0 && nameCheck2.rows.length > 0) {
        return 'not ok';
      } else {
        return "ok";
      }
    }
    return 'ok';
  } catch (error) {
    console.log('something went wrong');
    return 'something went wrong';
  }
};
