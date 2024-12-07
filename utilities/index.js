const { name } = require("ejs")
const invModel = require("../models/inventory-model")
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

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util