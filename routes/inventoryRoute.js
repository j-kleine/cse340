// Needed Resources 
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const utilities = require("../utilities/");

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to build vehicle details
router.get("/detail/:inventoryId", utilities.handleErrors(invController.buildByInventoryId));

// Route to build vehicle/inventory management
router.get("/", utilities.handleErrors(invController.buildInvManagement));

// Route to build Add Classification for vehicle/inventory management
router.get("/add-class", utilities.handleErrors(invController.buildAddClassManagement));

// Route to build Add Vehicle for vehicle/inventory management
router.get("/add-inv", utilities.handleErrors(invController.buildAddVehicleManagement));

module.exports = router;