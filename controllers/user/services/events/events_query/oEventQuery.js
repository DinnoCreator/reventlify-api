const pool = require("../../../../../db");

exports.oneEvent = async (req, res) => {
    // get regime id from body
    const { regimeID } = req.params;
    try {
        // gets regimes offline
        const event = await pool.query(
            `
          SELECT 
          clients.client_name,
          clients.client_photo,
          regimes.regime_id,
          regimes.regime_name, 
          regimes.regime_media, 
          regimes.regime_description, 
          regimes.regime_type,
          regimes.regime_address,
          regimes.regime_city,
          regimes.regime_state,
          regime_start_date,
          regime_start_time,
          regime_end_time,
          regimes.c_date,
          regimes.c_time,
          min(pricings.pricing_amount) as min_ticket_price
          FROM pricings 
          LEFT JOIN regimes  
          ON
          pricings.regime_id = regimes.regime_id 
          LEFT JOIN clients
          ON
          clients.client_id = regimes.creator_id
          WHERE regimes.regime_id = $1
          GROUP BY 
          clients.client_name,
          clients.client_photo,
          regimes.regime_id,
          regimes.regime_name, 
          regimes.regime_media, 
          regimes.regime_description,
          regimes.regime_type,
          regimes.regime_address,
          regimes.regime_city,
          regimes.regime_state,
          regime_start_date,
          regime_start_time,
          regime_end_time,
          regimes.c_date,
          regimes.c_time
          ORDER BY (regimes.c_date, regimes.c_time) DESC
            `, [regimeID]
        );
        if (event.rows.length === 0) {
            return res.status(202).json("nothing to show");
        }

        // gets all the regime's pricing
        const eventPricings = await pool.query(
            "SELECT * FROM pricings WHERE regime_id = $1 ORDER BY (pricing_amount) ASC",
            [regimeID]
        );

        // final return statement
        return res.status(200).json({event: event.rows, eventPricings: eventPricings.rows});

    } catch (error) {

    }
}