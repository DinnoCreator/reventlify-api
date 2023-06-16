const pool = require("../../../../../db");

exports.searchEvents = async (req, res) => {
  const { searchCharacters } = req.body;
  try {
    const searchResult = await pool.query(
      `
        SELECT regime_name, regime_id
        FROM regimes
        WHERE regime_name like $1 or regime_id like $2
        `,
      [`${searchCharacters}%`, `${searchCharacters}%`]
    );
    if (searchResult.rows.length === 0)
      return res.status(202).json("no result found");
    return res.status(200).json(searchResult.rows);
  } catch (error) {
    return res.status(500).json(error.message);
  }
};
