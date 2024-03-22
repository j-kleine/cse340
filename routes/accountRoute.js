// Needed Resources 
const express = require("express");
const router = new express.Router();
const accountController = require("../controllers/accountController");
const utilities = require("../utilities");
const regValidate = require('../utilities/account-validation');

// Route to deliver Login View
router.get("/login", utilities.handleErrors(accountController.buildLogin));

// Route to deliver Registration View
router.get("/register", utilities.handleErrors(accountController.buildRegister));

// Route to post Registration Input
router.post(
    "/register",
    regValidate.registrationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount));

// Process the login attempt
router.post(
    "/login",
    regValidate.loginRules(),
    regValidate.checkLoginData,
    (req, res) => {
      res.status(200).send('login process')
    }
  )

module.exports = router;