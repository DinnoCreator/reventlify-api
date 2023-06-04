const i = require("../auth/services/verifyemail");
const ii = require("../auth/services/register");
const iii = require("../auth/services/login");

// sends verification code for email verification
exports.sendCode = i.sendVerificationCode;

// verifies email
exports.verifyCode = i.verifyCode;

// registers user
exports.register = ii.register;

// logs in user
exports.login = iii.logger;