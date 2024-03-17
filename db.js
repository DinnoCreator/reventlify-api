require("dotenv").config();
const Pool = require("pg").Pool;

// const pool = new Pool({
//   user: "postgres",
//   password: process.env.DB_PASSWORD,
//   host: "localhost",
//   port: 5432,
//   database: "reventlify",
// });

const pool = new Pool({
  user: "all_db_93f5_user",
  // user: "postgres",
  password: process.env.DB_PASSWORD,
  host: "dpg-cnrbl9a1hbls73dusiig-a",
  // host: "dpg-cnrbl9a1hbls73dusiig-a.oregon-postgres.render.com",
  port: 5432,
  database: "all_db_93f5",
  // database: "reventlify",
  // ssl: true,
});
module.exports = pool;
