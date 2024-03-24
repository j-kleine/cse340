const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const invCont = {};
// * ***************************
// *  Build inventory by classification view
// * ***************************
invCont.buildByClassificationId = async function (req, res, next) {
    const classification_id = req.params.classificationId;
    const data = await invModel.getInventoryByClassificationId(classification_id);
    const grid = await utilities.buildClassificationGrid(data);
    let nav = await utilities.getNav();
    const className = data[0].classification_name;
    res.render("./inventory/classification", {
      title: className + " vehicles",
      nav,
      grid,
    })
}

// * ***************************
// *  Build vehicle details by specific view
// * ***************************
invCont.buildByInventoryId = async function (req, res, next) {
    const inv_id = req.params.inventoryId;
    const data = await invModel.getVehicleDetailsByInventoryId(inv_id);
    const card = await utilities.buildVehicleDetailCard(data);
    let nav = await utilities.getNav();
    const vehicleName = `${data[0].inv_year} ${data[0].inv_make} ${data[0].inv_model}`;
    res.render("./inventory/vehicleDetails", {
      title: vehicleName,
      nav,
      card,
    })
}

// * ***************************
// *  Build vehicle management view
// * ***************************
invCont.buildInvManagement = async function (req, res, next) {
  let nav = await utilities.getNav();
  res.render("./inventory/management", {
    title: "Vehicle Management",
    nav,
    errors: null,
  })
}

// * ***************************
// *  Build Add Classification management view
// * ***************************
invCont.buildAddClassManagement = async function (req, res, next) {
  let nav = await utilities.getNav();
  res.render("./inventory/add-classification", {
    title: "Add New Classification",
    nav,
    errors: null,
  })
}

// * ***************************
// *  Build Add Vehicle/Inventory management view
// * ***************************
invCont.buildAddVehicleManagement = async function (req, res, next) {
  let nav = await utilities.getNav();
  res.render("./inventory/add-inventory", {
    title: "Add New Vehicle",
    nav,
    errors: null,
  })
}

module.exports = invCont;