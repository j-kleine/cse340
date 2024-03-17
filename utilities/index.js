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

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

module.exports = Util;