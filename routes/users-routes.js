//packages and utilities and APIs
require("dotenv").config();
const router = require("express").Router();
const users = require("../controllers/user/userController");
const authenticateToken = require("../utilities/authenticateToken");
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
router.post("/regimesonline", authenticateToken, users.regimesQueryOnline);

// queries regimes offline
router.get("/regimesoffline", users.regimesQueryOffline);

// queries regimes most popular event in a cathegory
router.post("/regimescatpopular", authenticateToken, users.mostPopularInCat);

// queries regimes most popular event in a cathegory
router.get("/mostpopularevent", users.mostPopularEvent);

// queries regimes most popular event in a cathegory
router.post("/searchevents", users.searchEvents);

// queries pricings online
router.post("/pricingsonline", authenticateToken, users.pricingsOnline);

// queries pricings offline
router.post("/pricingsoffline", users.pricingsOffline);

// ticket purchase
router.post("/buyticket", authenticateToken, users.purchaseInitializer);

// ticket purchase webhook
router.post("/paystackwebhook", users.purchaseWebHook);

// tickets owned
router.get("/ticketsowned", authenticateToken, users.ticketsOwned);

// ticket owned
router.post("/ticketowned", authenticateToken, users.ticketOwned);

module.exports = router;
