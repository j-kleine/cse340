const invModel = require("../models/inventory-model");
const Util = {};
// console.log(data);

// * ************************
// * Constructs the nav HTML unordered list
// **************************
Util.getNav = async function (req, res, next) {
    let data = await invModel.getClassifications();
    let list = "<ul>";
    list += '<li><a href="/" title="Home page">Home</a></li>';
    data.rows.forEach((row) => {
        list += "<li>";
        list +=
            '<a href="/inv/type/' +
            row.classification_id +
            '" title="See our inventory of ' +
            row.classification_name +
            ' vehicles">' +
            row.classification_name +
            "</a>"
        list += "</li>"
    })
    list += "</ul>";
    return list
}

// * **************************************
// * Build the classification view HTML
// * **************************************
Util.buildClassificationGrid = async function(data) {
    let grid;
    if (data.length > 0) {
        grid = '<ul id="inv-display">';
        data.forEach(vehicle => {
            grid += '<li>';
            grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
            + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
            + ' details"><img src="' + vehicle.inv_thumbnail 
            +'" alt="Photo of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
            +' on CSE Motors"></a>';
            grid += '<div class="namePrice">';
            grid += '<hr>';
            grid += '<h2>';
            grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
            + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
            + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>';
            grid += '</h2>';
            grid += '<span>$' 
            + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>';
            grid += '</div>';
            grid += '</li>';
        })
        grid += '</ul>';
    } else { 
        grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>';
    }
    return grid
}

// * **************************************
// * Build the classification view HTML
// * **************************************
Util.buildVehicleDetailCard = async function(data) {
    let card;
    if (data.length > 0) {
        card = '<div id="card-display-grid">';
        data.forEach(vehicle => {
            card += `<img id="vehicle-img" src="${vehicle.inv_image}" alt="Photo of ${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}">`;
            card += `<section id="vehicle-details">
                        <h2>${vehicle.inv_make} ${vehicle.inv_model} Details</h2>
                        <p id="vehicle-price">Price: <span>$${parseInt(vehicle.inv_price).toLocaleString('en-US')}</span></p>
                        <p id="vehicle-desc">Description: <span>${vehicle.inv_description}</span></p>
                        <p id="vehicle-color">Color: <span>${vehicle.inv_color}</span></p>
                        <p id="vehicle-miles">Miles: <span>${vehicle.inv_miles.toLocaleString('en-US')}</span></p>
                    </section>`
        })
        card += '</div>';
    } else { 
        card += '<p class="notice">Sorry, no matching vehicle could be found.</p>';
    }
    return card
}

// * **************************************
// * Build the Login view HTML
// * **************************************
Util.buildLoginView = async function() {
    let login = `
        <form id="login-form">
            <fieldset>
                <!-- <legend></legend> -->
                <label>Email:
                    <input type="text" name="account_email" id="account-email" title="Enter your email address" placeholder="Enter email address" required>
                </label>
                <label>Password:
                    <input type="text" name="account_password" id="account-password" title="Enter your password" placeholder="Enter password" required>
                </label>
            </fieldset>
            <input class="submitButton" type="submit" value="Login">
            <a class="signUp-link" href="/account/register">No account? <span class="link-part">Sign-up</span></a>
        </form>`;
    return login
}

// * **************************************
// * Build the Registration HTML
// * **************************************
Util.buildRegisterView = async function() {
    let register = `
        <form id="register-form">
            <span class="required-info">All fields are required</span>
            <fieldset>
                <!-- <legend></legend> -->
                <label>First name:
                    <input type="text" name="account_firstname" id="account-firstname" title="Enter your first name" placeholder="Enter first name" required>
                </label>
                <label>Last name:
                    <input type="text" name="account_lastname" id="account-lastname" title="Enter your last name" placeholder="Enter last name" required>
                </label>
                <label>Email:
                    <input type="text" name="account_email" id="account-email" title="Enter your email address" placeholder="Enter email address" required>
                </label>
                <label>Password:
                    <input type="text" name="account_password" id="account-password" title="Enter your password" placeholder="Enter password" required>
                    <span class="password-info">Password must be minimum of 12 characters and include 1 capital letter, 1 number and 1 special character.</span>
                    </label>
            </fieldset>
            <input class="submitButton" type="submit" value="Register">
        </form>`;
    return register
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

module.exports = Util;