//packages and utilities and APIs
require("dotenv").config();
const router = require("express").Router();
const users = require("../controllers/user/userController");
const authenticateToken = require("../utilities/authenticateToken");
const sizeChecker = require("../utilities/sizeChecker");
//router
const { Router } = require("express");

// personalizationchecker
router.get(
  "/personalizationchecker",
  authenticateToken,
  users.personalizationChecker
);

// personalization
router.post("/personalization", authenticateToken, users.personalization);

// checks regime name
router.post("/regimecheck", authenticateToken, users.nameCheck);

// creates regime
router.post("/regimecreate", authenticateToken, users.regimeCreate);

// queries regimes online
router.get("/onlineregimesquery", authenticateToken, users.regimesQueryOnline);

// queries regimes offline
router.get("/offlineregimesquery", users.regimesQueryOffline);

module.exports = router;
