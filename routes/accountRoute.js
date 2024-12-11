// Needed Resources 
const express = require("express") // bring Express into scope of file.
const router = new express.Router()     
const accountController = require("../controllers/accountController")
const utilities = require("../utilities")

/* ****************************************
 *  Deliver login view
 *
 * *************************************** */
router.get("/login", utilities.handleErrors(accountController.buildLogin))

/* ****************************************
 *  Deliver Registeration view
 *
 * *************************************** */
router.get("/Register", utilities.handleErrors(accountController.buildRegister))

/* ****************************************
 *  Add a new comment to the route and the route, as shown below, to the file, below the two existing routes.
 *
 * *************************************** */
router.post('/register', utilities.handleErrors(accountController.registerAccount))

module.exports = router