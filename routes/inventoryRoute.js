const express = require("express")
const router = new express.Router()
const utilities = require("../utilities")
const invController = require("../controllers/invController")
const invValidate = require("../utilities/inventory-validation")

// 查看分類或單一庫存
router.get("/type/:classificationId", invController.buildByClassificationId)
router.get("/detail/:invId", invController.buildByInvId)

// 庫存管理頁面
router.get("/", invController.buildManagement)

// 新增分類 / 車輛表單頁面
router.get("/add-classification", invController.buildAddClassification)
router.get("/add-inventory", invController.buildAddInventory)

// AJAX - 取得庫存 JSON
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

// 更新庫存頁面
router.get("/update/:invId", utilities.handleErrors(invController.editInventoryView))

// POST - 新增分類
router.post(
  "/add-classification",
  utilities.handleErrors(invValidate.checkClassificationData),
  utilities.handleErrors(invController.addClassification)
)

// POST - 新增車輛
router.post(
  "/add-inventory",
  utilities.handleErrors(invValidate.checkInventoryData),
  utilities.handleErrors(invController.addInventory)
)

// POST - 更新車輛
router.post(
  "/update-inventory",
  utilities.handleErrors(invValidate.checkInventoryData),
  utilities.handleErrors(invController.updateInventory)
)

module.exports = router