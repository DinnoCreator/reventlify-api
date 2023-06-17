//dependencies
require("dotenv").config();
// process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
const express = require("express");
const cors = require("cors");
const port = 5000;

//requires root
const authRoute = require("./routes/auth-routes");
const usersRoute = require("./routes/users-routes");

const app = express();
const whitelist = [process.env.URL, "https://api.paystack.co"];
const corsOptions = {
  optionsSuccessStatus: 200,
  Credential: true,
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
}
// const corsOptions = {
//   optionsSuccessStatus: 200,
//   Credential: true,
//   // origin: "*",
// };

//middlewares
app.use(express.urlencoded({ extended: true }));
app.use(
  express.json({
    limit: "50mb",
  })
);
app.use(cors(corsOptions));

//ROUTES
app.use("/auth", authRoute);
app.use("/user", usersRoute);

app.listen(port, () => {
  console.log(`Server has started on port ${port}`);
});
