//packages and utilities and APIs
require("dotenv").config();
const router = require("express").Router();
const users = require("../controllers/user/userController");
const authenticateToken = require("../utilities/authenticateToken");
//router
const { Router } = require("express");

/* clients routes begining*/
// personalizationchecker
router.get(
  "/personalizationchecker",
  authenticateToken,
  users.personalizationChecker
);

// personalization
router.post("/personalization", authenticateToken, users.personalization);

// queries regimes online
router.post("/regimesonline", authenticateToken, users.regimesQueryOnline);

// queries regimes offline
router.get("/regimesoffline", users.regimesQueryOffline);

// queries regimes most popular event in a cathegory
router.get("/regimescatpopular", authenticateToken, users.mostPopularInCat);

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
router.get("/ticketowned/:ticketId", authenticateToken, users.ticketOwned);

// ticket owned
router.put("/tickettransfer", authenticateToken, users.ticketShare);
/* clients routes ending*/

/* regime creators routes begining*/
// checks regime name
router.post("/regimecheck", authenticateToken, users.nameCheck);

// creates regime
router.post("/regimecreate", authenticateToken, users.regimeCreate);

// gets last ten tickets purchase
router.get("/lasttentickets/:regimeId", authenticateToken, users.lastTen);
/* regime creators routes ending*/

module.exports = router;
