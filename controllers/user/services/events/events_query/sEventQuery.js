const pool = require("../../../../../db");

exports.searchEvents = async (req, res) => {
  const { searchCharacters, searchType } = req.body;
  try {
    if (searchCharacters === "") res.status(400).json("Empty search input");

    if (searchType === "events") {
      // gets regimes
      const regimeSearchResult = await pool.query(
        `
          SELECT regime_media, regime_name, regime_id
          FROM regimes
          WHERE regime_name like $1 or regime_id like $2
          `,
        [
          `${searchCharacters.toLowerCase()}%`,
          `${searchCharacters.toLowerCase()}%`,
        ]
      );
      if (regimeSearchResult.rows.length === 0)
        return res.status(202).json("No result found");
      return res.status(200).json(regimeSearchResult.rows);
    } else if (searchType === "people") {
      // gets clients
      const clientSearchResult = await pool.query(
        `
          SELECT client_photo, client_name, client_id
          FROM clients
          WHERE client_name like $1 or client_id like $2
          `,
        [
          `${searchCharacters.toLowerCase()}%`,
          `${searchCharacters.toLowerCase()}%`,
        ]
      );
      if (clientSearchResult.rows.length === 0)
        return res.status(202).json("No result found");
      return res.status(200).json(clientSearchResult.rows);
    } else if (searchType === "affiliate enabled events") {
      // gets regimes with affiliate enabled
      const regimeAFFiliateSearchResult = await pool.query(
        `
          SELECT regime_media, regime_name, regime_id
          FROM regimes
          WHERE regime_name like $1 AND regime_affiliate = 'enabled' 
          OR 
          regime_id like $2 AND regime_affiliate = 'enabled' 
          `,
        [
          `${searchCharacters.toLowerCase()}%`,
          `${searchCharacters.toLowerCase()}%`,
        ]
      );
      if (regimeAFFiliateSearchResult.rows.length === 0)
        return res.status(202).json("No result found");
      return res.status(200).json(regimeAFFiliateSearchResult.rows);
    }
  } catch (error) {
    return res.status(500).json(error.message);
  }
};
