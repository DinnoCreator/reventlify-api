const pool = require("../../../../../db");

exports.searchEvents = async (req, res) => {
  const { searchCharacters } = req.body;
  try {
    if (searchCharacters === "") res.status(400).json("Empty search input");
    const searchResult = await pool.query(
      `
        SELECT regime_media, regime_name, regime_id
        FROM regimes
        WHERE regime_name like $1 or regime_id like $2
        `,
      [`${searchCharacters.toLowerCase()}%`, `${searchCharacters.toLowerCase()}%`]
    );
    if (searchResult.rows.length === 0)
      return res.status(202).json("No result found");
    return res.status(200).json(searchResult.rows);
  } catch (error) {
    return res.status(500).json(error.message);
  }
};
