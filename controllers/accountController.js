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
  
  module.exports = { buildLogin };