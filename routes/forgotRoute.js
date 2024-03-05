const express = require("express");

const router = express.Router();

const passwordController = require("../controllers/passwordController");

//Middleware
//const Auth = require("../middleware/auth");

router.post("/forgotpassword", passwordController.sendOTP);

module.exports = router;