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
      errors: null,
    })
}

// * ***************************
// *  Build vehicle management view
// * ***************************
invCont.buildInvManagement = async function (req, res, next) {
  let nav = await utilities.getNav();
  const classification_select = await utilities.buildClassificationList();
  res.render("./inventory/management", {
    title: "Vehicle Management",
    nav,
    errors: null,
    classification_select,
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

/* ****************************************
*  Process Add Classification
* *************************************** */
invCont.addClass =  async function(req, res) {
  const { classification_name } = req.body;
  const classResult = await invModel.addClass(classification_name);
  let nav = await utilities.getNav();
  let classification_select = await utilities.buildClassificationList();
  if (classResult) {
    req.flash(
      "notice",
      `The ${classification_name} classification was successfully added.`
    );
    res.status(201).render("inventory/management", {
      title: "Vehicle Management",
      nav,
      errors: null,
      classification_select,
    })
  } else {
    req.flash("notice", "Sorry, creating the new classification failed. Please try again.")
    res.status(501).render("inventory/add-classification", {
      title: "Add New Classification",
      nav,
      errors: null,
      classification_name,
    })
  }
}

// * ***************************
// *  Build Add Vehicle/Inventory management view
// * ***************************
invCont.buildAddVehicleManagement = async function (req, res, next) {
  let nav = await utilities.getNav();
  let classification_select = await utilities.buildClassificationList();
  res.render("./inventory/add-inventory", {
    title: "Add New Vehicle",
    nav,
    errors: null,
    classification_select,
  })
}

/* ****************************************
*  Process Add Vehicle
* *************************************** */
invCont.addVehicle = async function (req, res) {
  const { 
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
  } = req.body;
  const vehicleResult = await invModel.addVehicle(
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
  );
  let nav = await utilities.getNav();
  let classification_select = await utilities.buildClassificationList();
  if (vehicleResult) {
    req.flash(
      "notice",
      `The ${inv_make} ${inv_model} was successfully added.`
    )
    res.status(201).render("inventory/management", {
      title: "Vehicle Management",
      nav,
      errors: null,
      classification_select,
    })
  } else {
    req.flash("notice", "Sorry, creating the new vehicle failed. Please try again.");
    let classification_select = await utilities.buildClassificationList();
    res.status(501).render("inventory/add-inventory", {
      title: "Add New Vehicle",
      nav,
      errors: null,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id,
      classification_select,
    })
  }
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav();
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body;
  const updateResult = await invModel.updateInventory(
    inv_id,  
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  );

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model;
    req.flash("notice", `The ${itemName} was successfully updated.`);
    res.redirect("/inv/");
  } else {
    const classificationSelect = await utilities.buildClassificationList(classification_id);
    const itemName = `${inv_make} ${inv_model}`;
    req.flash("notice", "Sorry, the insert failed.");
    res.status(501).render("inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id,
    inv_id
    });
  }
}

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id);
  const invData = await invModel.getInventoryByClassificationId(classification_id);
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"));
  }
}

// * ***************************
// *  Build "Modify Vehicle/Inventory" view
// * ***************************
invCont.buildModifyInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inventoryId);
  let nav = await utilities.getNav();
  let itemData = await invModel.getVehicleDetailsByInventoryId(inv_id);
  const classification_select = await utilities.buildClassificationList(itemData[0].classification_id);
  const itemName = `${itemData[0].inv_make} ${itemData[0].inv_model}`;
  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classification_select: classification_select,
    errors: null,
    inv_id: itemData[0].inv_id,
    inv_make: itemData[0].inv_make,
    inv_model: itemData[0].inv_model,
    inv_year: itemData[0].inv_year,
    inv_description: itemData[0].inv_description,
    inv_image: itemData[0].inv_image,
    inv_thumbnail: itemData[0].inv_thumbnail,
    inv_price: itemData[0].inv_price,
    inv_miles: itemData[0].inv_miles,
    inv_color: itemData[0].inv_color,
    classification_id: itemData[0].classification_id,
  })
}

module.exports = invCont;