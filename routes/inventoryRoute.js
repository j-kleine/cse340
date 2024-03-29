// Needed Resources 
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const utilities = require("../utilities/");
const invValidate = require('../utilities/inventory-validation');

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to build vehicle details
router.get("/detail/:inventoryId", utilities.handleErrors(invController.buildByInventoryId));

// Route to build vehicle/inventory management
router.get("/", utilities.handleErrors(invController.buildInvManagement));

// Route to build Add Classification for vehicle/inventory management
router.get("/add-classification", utilities.handleErrors(invController.buildAddClassManagement));

// Route to build Add Vehicle for vehicle/inventory management
router.get("/add-inventory", utilities.handleErrors(invController.buildAddVehicleManagement));

// Route to process the Add Classification data
router.post(
    "/add-classification",
    invValidate.classRules(),
    invValidate.checkClassData,
    utilities.handleErrors(invController.addClass));

// Route to process the Add Vehicle data
router.post(
    "/add-inventory",
    invValidate.inventoryRules(),
    invValidate.checkInventoryData,
    utilities.handleErrors(invController.addVehicle));

module.exports = router;