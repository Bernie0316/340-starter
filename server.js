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
app.get("/", function(req, res) {
  res.render("index", { title: "Home" })
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
