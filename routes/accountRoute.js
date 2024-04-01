// Needed Resources 
const express = require("express");
const router = new express.Router();
const accountController = require("../controllers/accountController");
const utilities = require("../utilities");
const regValidate = require('../utilities/account-validation');

router.get(
    "/",
    utilities.checkLogin,
    utilities.handleErrors(accountController.buildAccountManagement)
);

// Route to deliver Login View
router.get("/login", utilities.handleErrors(accountController.buildLogin));

// Process the login attempt
router.post(
    "/login",
    regValidate.loginRules(),
    regValidate.checkLoginData,
    utilities.handleErrors(accountController.accountLogin)
);

// Route to deliver Registration View
router.get("/register", utilities.handleErrors(accountController.buildRegister));

// Route to post Registration Input
router.post(
    "/register",
    regValidate.registrationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
);

// Route to deliver Update Account Information View
router.get(
    "/update/:accountId",
    utilities.checkLogin,
    utilities.handleErrors(accountController.buildAccountUpdate)
);

// Route to post Update Account Info
router.post(
    "/updateInfo",
    regValidate.updateInfoRules(),
    regValidate.checkUpdateInfoData,
    utilities.handleErrors(accountController.updateAccount)
);

// Route to post Update Account Password
router.post(
    "/changePassword",
    regValidate.updatePwdRules(),
    regValidate.checkUpdatePwdData,
    utilities.handleErrors(accountController.updatePassword)
);

// Route to logout client and redirect to Home page
router.get(
    "/logout",
    utilities.handleErrors(accountController.accountLogout)
);

module.exports = router;