const utilities = require("../utilities/") // import an index.js file (which does not yet exist) from a utilities
const baseController = {}

baseController.buildHome = async function(req, res){
    const nav = await utilities.getNav()
    res.render("index", {
      title: "Home",
      nav,
      errors: null
    })
  }
  
  module.exports = baseController