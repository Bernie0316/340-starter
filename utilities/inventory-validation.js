const { body, validationResult } = require("express-validator")

const classificationRules = () => {
  return [
    body("classification_name")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide a classification name."),
  ]
}

const checkClassificationData = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("./inventory/add-classification", {
      title: "Add New Classification",
      nav,
      errors: errors.array(),
    })
    return
  }
  next()
}

const inventoryRules = () => {
  return [
    body("classification_id")
      .isInt({ min: 1 })
      .withMessage("Please choose a classification."),

    body("make")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide a make."),

    body("model")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide a model."),

    body("year")
      .isInt({ min: 1900, max: new Date().getFullYear() + 1 })
      .withMessage("Please provide a valid year."),

    body("description")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide a description."),

    body("image")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide an image path."),

    body("thumbnail")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide a thumbnail path."),

    body("price")
      .isFloat({ min: 0 })
      .withMessage("Please provide a valid price."),

    body("miles")
      .isInt({ min: 0 })
      .withMessage("Please provide valid mileage."),

    body("color")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide a color."),
  ]
}

const checkInventoryData = async (req, res, next) => {
  const errors = validationResult(req)
  const { classification_id, make, model, year, description, image, thumbnail, price, miles, color } = req.body

  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    let classificationSelect = await utilities.buildClassificationList(classification_id) // 下拉選單 sticky
    res.render("./inventory/add-inventory", {
      title: "Add New Inventory",
      nav,
      classificationSelect,
      errors: errors.array(),
      classification_id,
      make,
      model,
      year,
      description,
      image,
      thumbnail,
      price,
      miles,
      color
    })
    return
  }
  next()
}

/* ******************************
 *  Check data and return to edit view if error
 * ***************************** */
const checkUpdateData = async (req, res, next) => {
  const errors = validationResult(req)
  const { inv_id, classification_id, make, model, year, description, image, thumbnail, price, miles, color } = req.body

  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    let classificationSelect = await utilities.buildClassificationList(classification_id)
    res.render("./inventory/edit-inventory", {
      title: `Edit ${make} ${model}`, // 跟 controller 裡 deliverEditInventory 的 title 一致
      nav,
      classificationSelect,
      errors: errors.array(),
      inv_id,
      classification_id,
      make,
      model,
      year,
      description,
      image,
      thumbnail,
      price,
      miles,
      color
    })
    return
  }
  next()
}

module.exports = { classificationRules, checkClassificationData, inventoryRules, checkInventoryData, checkUpdateData }