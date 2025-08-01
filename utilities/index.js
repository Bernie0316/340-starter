// 建立一個專門放 公用工具函式（utilities/functions） 的 JS 檔案，用來幫 Controller 做一些重複或支援性的工作，例如：產生 nav 導覽列、格式化字串、驗證資料… 等等。
// 這個檔案是你的「工具箱」，裡面可以放你會重複用到的工具函數（Utility Functions）。

const invModel = require("../models/inventory-model")
const Util = {}
// 建立一個空物件，用來裝所有公用工具函式（目前只放 getNav，以後可以擴充）。

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li class="inv-item">'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/* **************************************
* Build the detail view HTML
* ************************************ */
Util.buildDetailGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = ''
    grid += '<div class="detail-content">'
      grid += '<section id="section1">'
        grid += `<img src="${data[0].inv_image}" alt="Image of ${data[0].inv_make} ${data[0].inv_model}">`
      grid += "</section>"
      grid += '<section id="section2">'
        grid += `<h2>${data[0].inv_make} ${data[0].inv_model}</h2>`
        grid += `<p><strong>Price:</strong> $${data[0].inv_price}</p>`
        grid += `<p><strong>Description:</strong> ${data[0].inv_description}</p>`
        grid += `<p><strong>Color:</strong> ${data[0].inv_color}</p>`
        grid += `<p><strong>Miles:</strong> ${data[0].inv_miles}</p>`
      grid += "</section>"
    grid += '</div>'
    return grid
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util