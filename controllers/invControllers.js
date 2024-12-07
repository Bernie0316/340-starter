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
 *  Build inventory by item view
 * ************************** */
invCont.buildByInventoryId = async function (req, res, next) {
    const inv_id = req.params.inventoryId
    const itemData = await invModel.getInventoryByInventoryId(inv_id)
    const itemDetail = await utilities.buildInventoryDetail(itemData)
    let nav = await utilities.getNav()
    const title = `${itemData.inv_year} ${itemData.inv_make} ${itemData.inv_model}` 
    res.render("./inventory/detail", {
        title,
        nav,
        itemDetail,
    })
}

module.exports = invCont