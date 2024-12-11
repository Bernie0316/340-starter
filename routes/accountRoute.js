// Needed Resources 
const express = require("express") // bring Express into scope of file.
const router = new express.Router()     
const accountController = require("../controllers/accountController")
const utilities = require("../utilities")

// Add a "GET" route for the path that will be sent when the "My Account" link is clicked.
// The "GET" route must use a function from the account controller, to handle the request.
router.get("/login", utilities.handleErrors(accountController.buildLogin))

module.exports = router