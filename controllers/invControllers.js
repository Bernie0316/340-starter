const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}
const detailCont = {}

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

invCont.triggerError = (req, res, next) => {
    try {
        throw new Error('This is an intentional error for testing!');
    } catch (err) {
        next(err); 
    }
};
  
invCont.showManagement = async function (req, res, next) {
    let nav = await utilities.getNav()
    const classificationSelect = await utilities.buildClassificationList();
    res.render("./inventory/management", {
      title: "Vehicle Management",
      nav,
      errors: null,
      classificationSelect,
    })
}  
  
  invCont.showAddClassification = async (req, res) => {
    const nav = await utilities.getNav()
    res.render('inventory/add-classification', {
        title: 'Add Classification',
        nav,
        errors: null,
    })
  }
  
invCont.addClassification = async (req, res) => {
    const { classification_name } = req.body;
    const nav = await utilities.getNav()
    try {
        const result = await invModel.addClassification(classification_name);
        if (result) {
            req.flash('notice', 'Classification added successfully.');
            const nav = await utilities.getNav(); // Regenerate navigation
            res.status(201).render('inventory/management', {
                title: 'Vehicle Management',
                nav,
                errors: null,
        });
    } else {
        req.flash('notice', 'Error: Could not add classification.');
        res.status(500).render('inventory/add-classification', {
            title: 'Add Classification',
            nav,
            errors: null,
        });
    }
    } catch (err) {
        console.error('Error adding classification:', err);
        req.flash('notice', 'An unexpected error occurred.');
        res.status(500).render('inventory/add-classification', {
            title: 'Add Classification',
            nav,
            errors: null,
        });
    }
};
  
invCont.showAddInventory = async (req, res) => {
    const nav = await utilities.getNav();
    const classificationList = await utilities.buildClassificationList();
    res.render("inventory/add-inventory", {
        title: "Add Inventory Item",
        nav,
        classificationList,
        errors: null,
    });
};
  
invCont.addInventory = async (req, res) => {
    const {
        classification_id,
        inv_make,
        inv_model,
        inv_year,
        inv_description,
        inv_price,
        inv_miles,
        inv_image,
        inv_thumbnail,
    } = req.body;
  
    try {
        const result = await invModel.addInventory({
            classification_id,
            inv_make,
            inv_model,
            inv_year,
            inv_description,
            inv_price,
            inv_miles,
            inv_image,
            inv_thumbnail,
        });
  
    if (result) {
        req.flash("notice", "Inventory item added successfully.");
        const nav = await utilities.getNav();
        res.status(201).render("inventory/management", {
            title: "Vehicle Management",
            nav,
            errors: null,
        });
    } else {
        req.flash("notice", "Error adding inventory item.");
        const nav = await utilities.getNav();
        const classificationList = await utilities.buildClassificationList(classification_id);
        res.status(500).render("inventory/add-inventory", {
            title: "Add Inventory Item",
            nav,
            classificationList,
            errors: null,
        });
    }
    } catch (err) {
        console.error("Error adding inventory item:", err);
        req.flash("notice", "An unexpected error occurred.");
        const nav = await utilities.getNav();
        const classificationList = await utilities.buildClassificationList(classification_id);
        res.status(500).render("inventory/add-inventory", {
            title: "Add Inventory Item",
            nav,
            classificationList,
            errors: null,
        });
    }
};

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
    const classification_id = parseInt(req.params.classification_id)
    const invData = await invModel.getInventoryByClassificationId(classification_id)
    if (invData[0].inv_id) {
        return res.json(invData) 
    } else {
        next(new Error("No data returned"))
    }
}

/* ***************************
 *  Build edit inventory view
 * ************************** */
invCont.editInventoryView = async function (req, res, next) {
    const inv_id = parseInt(req.params.inv_id)
    let nav = await utilities.getNav()
    const itemData = await invModel.getInventoryById(inv_id)
    const classificationSelect = await utilities.buildClassificationList(itemData.classification_id)
    const itemName = `${itemData.inv_make} ${itemData.inv_model}`
    res.render("./inventory/edit-inventory", {
        title: "Edit " + itemName,
        nav,
        classificationSelect: classificationSelect,
        errors: null,
        inv_id: itemData.inv_id,
        inv_make: itemData.inv_make,
        inv_model: itemData.inv_model,
        inv_year: itemData.inv_year,
        inv_description: itemData.inv_description,
        inv_image: itemData.inv_image,
        inv_thumbnail: itemData.inv_thumbnail,
        inv_price: itemData.inv_price,
        inv_miles: itemData.inv_miles,
        inv_color: itemData.inv_color,
        classification_id: itemData.classification_id
    })
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
    let nav = await utilities.getNav()
    const {
        inv_id,
        inv_make,
        inv_model,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_year,
        inv_miles,
        inv_color,
        classification_id,
    } = req.body
    const updateResult = await invModel.updateInventory(
        inv_id,  
        inv_make,
        inv_model,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_year,
        inv_miles,
        inv_color,
        classification_id
    )
  
    if (updateResult) {
        const itemName = updateResult.inv_make + " " + updateResult.inv_model
        req.flash("notice", `The ${itemName} was successfully updated.`)
        res.redirect("/inv/")
    } else {
        const classificationSelect = await utilities.buildClassificationList(classification_id)
        const itemName = `${inv_make} ${inv_model}`
        req.flash("notice", "Sorry, the insert failed.")
        res.status(501).render("inventory/edit-inventory", {
            title: "Edit " + itemName,
            nav,
            classificationSelect: classificationSelect,
            errors: null,
            inv_id,
            inv_make,
            inv_model,
            inv_year,
            inv_description,
            inv_image,
            inv_thumbnail,
            inv_price,
            inv_miles,
            inv_color,
            classification_id
        })
    }
}

module.exports = invCont