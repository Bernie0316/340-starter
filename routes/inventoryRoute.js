// Needed Resources 
const express = require("express")
const router = new express.Router() 
const utilities = require("../utilities")
const invController = require("../controllers/invController")
const invValidate = require("../utilities/inventory-validation")

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);
router.get("/detail/:invId", invController.buildByInvId);

// Route to build inventory management view
router.get("/", invController.buildManagement);
// Task 2 & 3: Add classification / inventory forms
router.get("/add-classification", invController.buildAddClassification)
router.get("/add-inventory", invController.buildAddInventory)
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

// 展示 update page
router.get("/update/:invId", utilities.handleErrors(invController.editInventoryView))

// 處理表單更新
router.post("/update-inventory",
  invValidate.inventoryRules(),
  invValidate.checkInventoryData,
  invController.updateInventory
)
router.post("/update/", utilities.handleErrors((invController.updateInventory))


module.exports = router;