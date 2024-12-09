const utilities = require("../utilities/") // import an index.js file (which does not yet exist) from a utilities
const baseController = {}

baseController.buildHome = async function(req, res){
    const nav = await utilities.getNav()
    req.flash("notice", "This is a flash message.")
    res.render("index", {title: "Home", nav})
}

module.exports = baseController