const utilities = require(".");
const { body, validationResult } = require("express-validator");
// const invModel = require("../models/inv-model");

const validate = {};

/* **********************************
 * Add Classification Validation Rules
 * ********************************* */
validate.classRules = () => {
  return [
    // new classification name required
    body("classification_name")
    .trim()
    .escape()
    .notEmpty()
    .isAlpha()
    .withMessage("A valid classification name is required.")
  ]
}

/* ******************************
 * Check data and return errors or continue to vehicle management view
 * ***************************** */
validate.checkClassData = async (req, res, next) => {
  const { classification_name } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("inventory/add-classification", {
      errors,
      title: "Add New Classification",
      nav,
      classification_name,
    })
    return
  }
  next();
}

/* **********************************
 * Add Vehicle Data Validation Rules
 * ********************************* */
validate.inventoryRules = () => {
  return [
    // classification_id is required and must be string
    body("classification_id")
      .trim()
      .escape()
      .notEmpty().withMessage("Please select a classification."),

    // inv_make is required and must be string
    body("inv_make")
      .trim()
      .escape()
      .notEmpty().withMessage("Please provide a make.")
      .isLength({ min: 3 }).withMessage("Make must be min 3 characters long.")
      .matches(/^[^\s][a-zA-Z\s]{3,}$/).withMessage("Make must be alphabetic characters only."),

    // inv_model is required and must be string
    body("inv_model")
      .trim()
      .escape()
      .notEmpty().withMessage("Please provide a model.")
      .isLength({ min: 3 }).withMessage("Model must be min 3 characters long.")
      .matches(/^[^\s][a-zA-Z\s]{3,}$/).withMessage("Model must be alphabetic characters only."),

    // inv_year is required and must be string
    body("inv_year")
      .trim()
      .escape()
      .notEmpty().withMessage("Please provide a year.")
      .isLength({ min: 4 }).withMessage("Year must be min 4 digits long.")
      .isNumeric().withMessage("Model must be digits only."),
    
    // inv_description is required and must be string
    body("inv_description")
      .trim()
      .escape()
      .notEmpty().withMessage("Please provide a description."),
    
    // inv_image is required and must be string
    body("inv_image")
      .trim()
      .escape()
      .notEmpty().withMessage("Please provide an image path."),
    
    // inv_thumbnail is required and must be string
    body("inv_thumbnail")
      .trim()
      .escape()
      .notEmpty().withMessage("Please provide a thumbnail path."),

    // inv_price is required and must be string
    body("inv_price")
      .trim()
      .escape()
      .notEmpty().withMessage("Please provide a price.")
      .isNumeric().withMessage("Price must be numeric only."),
    
    // inv_miles is required and must be string
    body("inv_miles")
      .trim()
      .escape()
      .notEmpty().withMessage("Please provide a mileage.")
      .isNumeric().withMessage("Mileage must be numeric only."),
    
    // inv_color is required and must be string
    body("inv_color")
      .trim()
      .escape()
      .notEmpty().withMessage("Please provide a color.")
      .matches(/^[^\s][a-zA-Z\s]{3,}$/).withMessage("Color must be alphabetic characters only."),
  ]
}

/* ******************************
 * Check data and return errors or continue to vehicle management view
 * ***************************** */
validate.checkInventoryData = async (req, res, next) => {
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
  let classification_select = await utilities.buildClassificationList();
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("inventory/add-inventory", {
      errors,
      title: "Add New Vehicle",
      nav,
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
    return
  }
  next();
}
  
  module.exports = validate;