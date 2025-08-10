// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);
router.get("/detail/:invId", invController.buildByInvId);

// Route to build inventory management view
router.get("/", invController.buildManagement);
// Task 2 & 3: Add classification / inventory forms
router.get("/add-classification", invController.buildAddClassification)
router.get("/add-inventory", invController.buildAddInventory)

module.exports = router;