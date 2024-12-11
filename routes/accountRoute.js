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

module.exports = router