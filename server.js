/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const expressLayouts = require("express-ejs-layouts")
const express = require("express")
const env = require("dotenv").config()
const app = express()
const static = require("./routes/static")
const baseController = require("./controllers/baseController")
const utilities = require("./utilities/")
const inventoryRoute = require("./routes/inventoryRoute")
// Require the Session package and DB connection
const session = require("express-session")
const pool = require('./database/')
const accountRoute = require('./routes/accountRoute')

/* ***********************
 * Middleware
 * ************************/
app.use(session({ // invokes the app.use() function and indicates the session is to be applied.
  store: new (require('connect-pg-simple')(session))({
    createTableIfMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  name: 'sessionId',  // this is the "name" we are assigning to the unique "id" that will be created for each session.
}))

// Express Messages Middleware
app.use(require('connect-flash')()) // requires the connect-flash package, within an app.use function, making it accessible throughout the application.
app.use(function(req, res, next){ // app.use is applied and a function is passed in as a parameter. The funtion accepts the request, response and next objects as parameters.
  res.locals.messages = require('express-messages')(req, res)
  next()
})

/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout") // not at views root

/* ***********************
 * Routes
 *************************/
app.use(express.static("public"))  // 讓 Express 服務靜態檔案
// Index route
app.get("/", utilities.handleErrors(baseController.buildHome)) 
app.use(static)
// Inventory routes
app.use("/inv", inventoryRoute)
// File Not Found Route - must be last route in list
app.use(async (req, res, next) => {
  next({status: 404, message: 'Sorry, we appear to have lost that page.'})
})
app.use("/account", accountRoute)

/* ***********************
* Express Error Handler
* Place after all other middleware
*************************/
/* ***********************
* Express Error Handler
* Place after all other middleware
*************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav()
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)
  if(err.status == 404){ message = err.message} else {message = 'Oh no! There was a crash. Maybe try a different route?'}
  res.render("errors/error", {
    title: err.status || 'Server Error',
    message,
    nav
  })
})

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT
const host = process.env.HOST

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})
