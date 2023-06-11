//dependencies
require('dotenv').config();
const express = require("express");
const cors = require("cors");
const port = 5000;

//requires root
const authRoute = require('./routes/auth-routes');
const usersRoute = require('./routes/users-routes');

const app = express();
// const corsOptions = {optionsSuccessStatus: 200, Credential:true, origin:process.env.URL,};

//middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json({
  limit: '50mb'
}));
app.use(cors());
// app.use(cors(corsOptions));

//ROUTES
app.use('/auth', authRoute);
app.use('/user', usersRoute);


app.listen(port, () => {
  console.log(`Server has started on port ${port}`);
});