/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require("express")
const env = require("dotenv").config()
const app = express()
const static = require("./routes/static")
// 匯入 ejs 功能
const expressLayouts = require("express-ejs-layouts")
// 這樣我們就可以使用 baseController 裡面的函數，例如 buildHome()。
const baseController = require("./controllers/baseController")
// week 03
const inventoryRoute = require("./routes/inventoryRoute")
const utilities = require("./utilities") 
// 可以不用index.js，因為 Node.js 會自動尋找 index.js 檔案。
// 「爆」錯專用
const errorRoute = require("./routes/errorRoute");

// Week 04
const session = require("express-session")
const pool = require('./database/')
const accountRoute = require("./routes/accountRoute")


/* ***********************
 * View Engine and Template
 *************************/
app.set("view engine", "ejs")
// 使用ejs當作網站的模板引擎
app.use(expressLayouts)
// 起用 express-ejs-layouts 中間件
app.set("layout", "./layouts/layout") // not at views root
// 設定預設的 layout 檔案位置 

/* ***********************
 * Middleware
 * ************************/
// 啟用 seession 中間件，每個瀏覽者都可有暫存資料(登入狀態、購物車等) 
app.use(session({
  // 讓session 資料儲存在 PostgreSQL 資料庫中
  store: new (require('connect-pg-simple')(session))({
    createTableIfMissing: true,
    pool,
  }),
  // 加密 session 資料，可以避免敏感資料寫死在程式碼裡。
  secret: process.env.SESSION_SECRET,
  // 每次請求都會強制儲存 session 到資料庫，即使沒有更動內容。
  resave: true,
  // 初次訪問網站時，即使你沒有設定任何 session 資料，也會幫你建立一筆空的 session。 一般來說建議設為 false，不然會產生一堆沒用的 session 資料。
  saveUninitialized: true,
  // cookie name in browser
  name: 'sessionId',
}))
// Express Messages Middleware
// connect-flash 是一個中介軟體（middleware），它會把你用 req.flash() 設定的訊息暫存在 session 中。
app.use(require('connect-flash')())
app.use(function(req, res, next){
  res.locals.messages = require('express-messages')(req, res)
  next()
}) // 然後在下一次 HTTP request 中自動將這些訊息傳遞出來，然後就會消失。


/* ***********************
 * Routes
 *************************/
app.use(static)
// 使用 static 路由處理靜態檔案
// Index route

// Week03
app.get("/", utilities.handleErrors(baseController.buildHome))
// 當有人訪問 /，不要直接 render，而是請 baseController 裡的 buildHome 函數來處理。
// Inventory routes
app.use("/inv", inventoryRoute)
app.use("/account", accountRoute)
app.use("/registration", accountRoute)
// 報錯路由一定要在路由列表的最底層
// File Not Found Route - must be last route in list
app.use(async (req, res, next) => {
  next({status: 404, message: 'Sorry, we appear to have lost that page.'})
})
app.use("/", errorRoute); // 可設定其它 base 路徑


// "Place after all other middleware"
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
