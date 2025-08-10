const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

/* ***************************
 *  Build inventory by detail view
 * ************************** */
invCont.buildByInvId = async function (req, res, next) {
  const inv_id = req.params.invId
  const data = await invModel.getDetailByInvId(inv_id)
  const grid = await utilities.buildDetailGrid(data)
  let nav = await utilities.getNav()
  const invName = `${data[0].inv_make} ${data[0].inv_model}`
  res.render("./inventory/detail", {
    title: invName + " vehicles",
    nav,
    grid,
  })
}

/* ***************************
 *  Build inventory by management view
 * ************************** */
invCont.buildManagement = async function (req, res, next) {
  const data = await invModel.getAllInventory()
  const grid = await utilities.buildManagementGrid(data)
  let nav = await utilities.getNav()
  res.render("./inventory/management", {
    title: "Inventory Management",
    nav,
    grid,
    Message: req.flash("notice"),
  })
}

/* ***************************
 *  Build add classification view
 * ************************** */
invCont.buildAddClassification = async function(req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/add-classification", {
    title: "Add-classification",
    nav,
    errors: null
  })
}
// 處理新增 classification
invCont.addClassification = async function (req, res) {
  const { classification_name } = req.body
  const result = await invModel.addClassification(classification_name)
  
  let nav = await utilities.getNav()
  if (result) {
    req.flash("notice", "Classification added successfully.")
    res.redirect("/inv/")
  } else {
    req.flash("notice", "Failed to add classification.")
    res.status(500).render("./inventory/add-classification", {
      title: "Add New Classification",
      nav,
      errors: null,
    })
  }
}

/* ***************************
 *  Build add inventory view
 * ************************** */
invCont.buildAddInventory = async function(req, res, next) {
  let nav = await utilities.getNav()
  let classificationSelect = await utilities.buildClassificationList()

  res.render("inventory/add-inventory", {
    title: "Add New Inventory",
    nav,
    classificationSelect,
    errors: null,
    make: "",
    model: "",
    year: "",
    description: "",
    image: "/images/no-image.png",
    thumbnail: "/images/no-image-tn.png",
    price: "",
    miles: "",
    color: ""
  })
}
// Add Inventory Item
invCont.addInventory = async function (req, res) {
  let nav = await utilities.getNav()
  let classificationSelect = await utilities.buildClassificationList(req.body.classification_id)
  const { classification_id, make, model, year, description, image, thumbnail, price, miles, color } = req.body

  const result = await invModel.addInventory(
    classification_id, make, model, year, description, image, thumbnail, price, miles, color
  )

  if (result) {
    req.flash("notice", `${make} ${model} was successfully added.`)
    res.redirect("/inv/")
  } else {
    req.flash("notice", "Sorry, the insert failed.")
    res.status(500).render("inventory/add-inventory", {
      title: "Add New Inventory",
      nav,
      classificationSelect,
      errors: null,
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
  }
}

module.exports = invCont