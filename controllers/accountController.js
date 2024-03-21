const accountModel = require("../models/account-model");
const utilities = require("../utilities");

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
    let nav = await utilities.getNav();
    const login = await utilities.buildLoginView();
    res.render("account/login", {
      title: "Login",
      nav,
      login,
    })
  }

/* ****************************************
*  Deliver Registration view
* *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav();
  const register = await utilities.buildRegisterView();
  res.render("account/register", {
    title: "Register",
    nav,
    register,
  })
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav();
  const login = await utilities.buildLoginView();
  const register = await utilities.buildRegisterView();
  const { account_firstname, account_lastname, account_email, account_password } = req.body;

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    account_password
  );

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you're registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      login,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.");
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
      register,
    })
  }
}

module.exports = { buildLogin, buildRegister, registerAccount }