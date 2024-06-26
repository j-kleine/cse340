// Needed Resources 
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const utilities = require("../utilities/");
const invValidate = require('../utilities/inventory-validation');

// Route to build inventory by classification view
router.get(
    "/type/:classificationId",
    utilities.handleErrors(invController.buildByClassificationId)
);

// Route to build vehicle details
router.get(
    "/detail/:inventoryId",
    utilities.handleErrors(invController.buildByInventoryId)
);

// Route to build vehicle/inventory management
router.get(
    "/",
    utilities.checkAuthorization,
    utilities.handleErrors(invController.buildInvManagement)
);

// Route to build Add Classification for vehicle/inventory management
router.get(
    "/add-classification",
    utilities.checkAuthorization,
    utilities.handleErrors(invController.buildAddClassManagement)
);

// Route to process the Add Classification data
router.post(
    "/add-classification",
    utilities.checkAuthorization,
    invValidate.classRules(),
    invValidate.checkClassData,
    utilities.handleErrors(invController.addClass)
);

// Route to build Add Vehicle for vehicle/inventory management
router.get(
    "/add-inventory",
    utilities.checkAuthorization,
    utilities.handleErrors(invController.buildAddVehicleManagement));

// Route to process the Add Vehicle data
router.post(
    "/add-inventory",
    utilities.checkAuthorization,
    invValidate.inventoryRules(),
    invValidate.checkInventoryData,
    utilities.handleErrors(invController.addVehicle));

// Route to build Selected classification result for management view
router.get(
    "/getInventory/:classification_id",
    utilities.checkAuthorization,
    utilities.handleErrors(invController.getInventoryJSON));

// Route to build "Modify selected vehicle" view
router.get(
    "/edit/:inventoryId",
    utilities.checkAuthorization,
    utilities.handleErrors(invController.buildModifyInventoryView));

// Route to rocess the Update/Modify Vehicle data
router.post(
    "/update",
    utilities.checkAuthorization,
    invValidate.inventoryRules(),
    invValidate.checkUpdateData,
    utilities.handleErrors(invController.updateInventory));

// Route to build "Delete selected vehicle" view
router.get(
    "/delete/:inventoryId",
    utilities.checkAuthorization,
    utilities.handleErrors(invController.buildDeleteView));

// Route to process "Delete selected vehicle" data
router.post(
    "/delete",
    utilities.checkAuthorization,
    utilities.handleErrors(invController.deleteItem));

module.exports = router;