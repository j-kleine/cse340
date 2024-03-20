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

module.exports = { buildLogin, buildRegister }