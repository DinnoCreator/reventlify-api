//packages and utilities and APIs
require("dotenv").config();
const router = require("express").Router();
const auth = require("../controllers/auth/authController");
//router
const { Router } = require("express");

// sends verification code for email verification
router.post("/sendcode", auth.sendCode);

// verifies email
router.post("/verify", auth.verifyCode);

// registers user
router.post("/register", auth.register);

// logs in user
router.post("/login", auth.login);

module.exports = router;
