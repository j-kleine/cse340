const accountModel = require("../models/account-model");
const utilities = require("../utilities");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const invCont = require("./invController");
require("dotenv").config();

/* ****************************************
*  Deliver Account Management view
* *************************************** */
async function buildAccountManagement(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/account", {
    title: "Manage Account",
    nav,
    errors: null,
  })
}

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
    let nav = await utilities.getNav();
    res.render("account/login", {
      title: "Login",
      nav,
      errors: null,
    })
  }

/* ****************************************
  *  Process login request
  * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav();
  const { account_email, account_password } = req.body;
  const accountData = await accountModel.getAccountByEmail(account_email);
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.");
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors,
      account_email,
    })
    return
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password;
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 });
      if(process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 });
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 });
      }
      return res.redirect("/account/")
    }
  } catch (error) {
    return new Error('Access Forbidden')
  }
  }

/* ****************************************
*  Deliver Registration view
* *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
  })
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav();
  const { account_firstname, account_lastname, account_email, account_password } = req.body;

  // Hash the password before storing
  let hashedPassword;
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10);
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.');
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    });
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  );

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you're registered, ${account_firstname}. Please log in.`
    );
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      errors: null,
    });
  } else {
    req.flash("notice", "Sorry, the registration failed.");
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    });
  }
}

/* ****************************************
*  Deliver Update Account view
* *************************************** */
async function buildAccountUpdate(req, res, next) {
  const account_id = parseInt(req.params.accountId);
  let nav = await utilities.getNav();
  let accountData = await accountModel.getAccountById(account_id);
  res.render("account/update-account", {
    title: "Edit Account",
    nav,
    errors: null,
    account_id,
    account_firstname: accountData.account_firstname,
    account_lastname: accountData.account_lastname,
    account_email: accountData.account_email,
  })
}

/* ****************************************
*  Process Update Account Info
* *************************************** */
async function updateAccount(req, res, next) {
  let nav = await utilities.getNav();
  const {
    account_id,
    account_firstname,
    account_lastname,
    account_email
  } = req.body;
  const updateResult = await accountModel.updateAccountInfo(
    account_id,
    account_firstname,
    account_lastname,
    account_email
  );
  if (updateResult) {
    req.flash("notice", "Congratulations, your information has been updated.");
    res.redirect("/account/");
  } else {
    req.flash("notice", "Sorry, failed to update your account information.");
    res.status(501).render("account/update-account", {
      title: "Edit Account",
      nav,
      errors: null,
      account_id,
      account_firstname: accountData.account_firstname,
      account_lastname: accountData.account_lastname,
      account_email: accountData.account_email,
    });
  }
}

/* ****************************************
*  Process Update Password
* *************************************** */
async function updatePassword(req, res, next) {
  let nav = await utilities.getNav();
  const {
    account_id,
    account_firstname,
    account_lastname,
    account_email,
    account_password
  } = req.body;

  // Hash the password before storing
  let hashedPassword;
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10);
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the password update.');
    res.status(501).render("account/update-account", {
      title: "Edit Account",
      nav,
      errors: null,
      account_id,
      account_firstname,
      account_lastname,
      account_email,
    });
  }
  const updateResult = await accountModel.updatePassword(
    account_id,
    hashedPassword
  );
  if (updateResult) {
    req.flash("notice", "Congratulations, your password has been updated.");
    res.redirect("/account/");
  } else {
    req.flash("notice", "Sorry, failed to update your password.");
    res.status(501).render("account/update-account", {
      title: "Edit Account",
      nav,
      errors: null,
      account_id,
      account_firstname: accountData.account_firstname,
      account_lastname: accountData.account_lastname,
      account_email: accountData.account_email,
    });
  }
}

// Process Logout
async function accountLogout(req, res) {
  res.clearCookie("jwt");
  res.locals.loggedin = 0;
  let nav = await utilities.getNav();
  req.flash("notice", "You have been logged out.");
  res.status(200).render("index", {
    title: "Home",
    nav,
    errors: null,
  });
}

// Deliver favorites view
async function buildFavorites(req, res, next) {
  // const classification_id = req.params.classificationId;
  let data = await accountModel.getFavorites(res?.locals?.accountData?.account_id);
  let nav = await utilities.getNav();
  const grid = await utilities.buildClassificationGrid(data);
  res.render("account/favorites", {
    errors: null,
    title: "My Favorites",
    nav,
    grid,
  })
}

/* ***************************
 *  add a Favorite 
 * ************************** */
async function addFavorite(req, res, next) {
  const inv_id = req.params.inventoryId;
  const data = await accountModel.addFavorite(res?.locals?.accountData?.account_id, inv_id);
  invCont.buildByInventoryId(req, res, next);
};

/* ***************************
 *  remove a Favorite 
 * ************************** */
async function removeFavorite(req, res, next) {
  const inv_id = req.params.inventoryId;
  const data = await accountModel.removeFavorite(res?.locals?.accountData?.account_id, inv_id);
  invCont.buildByInventoryId(req, res, next);
};

module.exports = { buildAccountManagement, buildLogin, accountLogin, buildRegister, registerAccount, buildAccountUpdate, updateAccount, updatePassword, accountLogout, buildFavorites, addFavorite, removeFavorite }