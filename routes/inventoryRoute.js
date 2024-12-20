// Needed Resources 
const express = require("express") // bring Express into scope of file.
const router = new express.Router() 
const invController = require("../controllers/invControllers")
const invValidate = require("../utilities/inv-validation");
const utilities = require("../utilities/index")

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);
// Route to build inventory item by classification view
router.get("/detail/:inventoryId", invController.buildByInventoryId);

router.get('/:trigger-error', invController.triggerError);

// Management Links
router.get('/', invController.showManagement);

// Add Clasification
router.get('/add-classification', invController.showAddClassification);

router.post('/add-classification', 
    invValidate.classificationRules(),
    invValidate.checkData,
    invController.addClassification
)

// Add Inventory
router.get("/add-inventory", utilities.handleErrors(invController.showAddInventory));

router.post(
    "/add-inventory",
    invValidate.inventoryRules(),
    invValidate.checkInventoryData,
    utilities.handleErrors(invController.addInventory)
);

router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

router.get(
    "/edit/:inv_id",
    utilities.handleErrors(invController.editInventoryView)
);

router.post(
    "/edit-inventory/",
    utilities.handleErrors(invController.updateInventory)
)


router.get(
    "/delete/:inv_id",
    utilities.handleErrors(invController.deleteInventoryView)
);

router.post(
    "/delete-inventory/",
    utilities.handleErrors(invController.deleteInventory)
)
  
 

module.exports = router;