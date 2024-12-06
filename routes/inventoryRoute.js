// Needed Resources 
const express = require("express") // bring Express into scope of file.
const router = new express.Router() 
const invController = require("../controllers/invControllers")

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);
// Route to build inventory item by classification view
router.get("/detail/:inventoryId", invController.buildByInventoryId);

module.exports = router;