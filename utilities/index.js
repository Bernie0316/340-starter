// const { name } = require("ejs")
const invModel = require("../models/inventory-model")
const jwt = require("jsonwebtoken")
require("dotenv").config()
const Util = {}


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
            grid += '<li>'
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
* Build the inventory view HTML
* ************************************ */
Util.buildInventoryDetail = async function(itemData){
    let itemDetail 
    if(itemData){
        itemDetail = '<div id="inv-detail">'
            itemDetail += '<div id="invDetailPageLeft">'
                // img
                itemDetail +=  '<a href="../../inv/detail/'+ itemData.inv_id 
                + '" title="View ' + itemData.inv_make + ' '+ itemData.inv_model 
                + 'details"><img src="' + itemData.inv_image 
                +'" alt="Image of '+ itemData.inv_make + ' ' + itemData.inv_model 
                +' on CSE Motors" /></a>'
            itemDetail += '</div>'
            itemDetail += '<div id="invDetailPagerRight">'
                // name
                itemDetail += '<h2>'
                    itemDetail += itemData.inv_make + ' ' + itemData.inv_model + ' Details'
                itemDetail += '</h2>'
                // price
                itemDetail += '<div class="namePrice">'
                    itemDetail += '<b><span>Price: $</b>' 
                    + new Intl.NumberFormat('en-US').format(itemData.inv_price) + '</span>'
                itemDetail += '</div>'
                // Description
                itemDetail += '<p><b>Description:</b> ' + itemData.inv_description + '</p>'
                // color
                itemDetail += '<p><b>Color:</b> ' + itemData.inv_color + '</p>'
                // miles
                itemDetail += '<p><b>Miles:</b> ' 
                    + new Intl.NumberFormat('en-US').format(itemData.inv_miles) + '</p>'
            itemDetail += '</div>'
        itemDetail += '</div>'
    } else { 
        itemDetail += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
    }
    return itemDetail
}

/* ******************************
 *  Build Classification List
 * ****************************** */
Util.buildClassificationList = async function (classification_id = null) {
    const data = await invModel.getClassifications();
    let classificationList = '<select name="classification_id" id="classificationList" required>';
    classificationList += "<option value=''>Choose a Classification</option>";
    data.rows.forEach((row) => {
        classificationList += `<option value="${row.classification_id}"`;
        if (classification_id != null && row.classification_id == classification_id) {
            classificationList += " selected";
        }
        classificationList += `>${row.classification_name}</option>`;
    });
    classificationList += "</select>";
    return classificationList;
};


/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
    if (req.cookies.jwt) {
        jwt.verify(
            req.cookies.jwt,
            process.env.ACCESS_TOKEN_SECRET,
            function (err, accountData) {
                if (err) {
                    req.flash("Please log in")
                    res.clearCookie("jwt")
                    return res.redirect("/account/login")
                }
                res.locals.accountData = accountData
                res.locals.loggedin = 1
                next()
            })
    } else {
        res.locals.loggedin = 0
        next()
    }
}

/* ****************************************
 *  Check Login
 * ************************************ */
Util.checkLogin = (req, res, next) => {
    if (res.locals.loggedin) {
        next()
    } else {
        req.flash("notice", "Please log in.")
        return res.redirect("/account/login")
    }
}

module.exports = Util