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
 * Routes
 *************************/
app.use(static)
// 使用 static 路由處理靜態檔案
// Index route
app.get("/", baseController.buildHome)
// 當有人訪問 /，不要直接 render，而是請 baseController 裡的 buildHome 函數來處理。
// Inventory routes
app.use("/inv", inventoryRoute)

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
