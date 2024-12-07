const pool = require("../database/")  // import database connection file (index.js) from database folder

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
    return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
    try {
    const data = await pool.query(
        `SELECT * FROM public.inventory AS i 
        JOIN public.classification AS c 
        ON i.classification_id = c.classification_id 
        WHERE i.classification_id = $1`,
        [classification_id]
    )
    return data.rows
    } catch (error) {
        console.error("getclassificationsbyid error " + error)
    }
}

/* ***************************
 *  Get all inventory data
 * ************************** */
async function getInventorys(){
    return await pool.query("SELECT * FROM public.inventory ORDER BY inv_id")
}

/* ***************************
 *  Get inventory item by inv_id
 * ************************** */
async function getInventoryByInventoryId(inv_id) {
    const query = `
        SELECT * 
        FROM public.inventory AS i
        JOIN public.classification AS c 
        ON i.classification_id = c.classification_id
        WHERE i.inv_id = $1
    `
    const data = await pool.query(query, [inv_id])
    return data.rows[0] // Return a single object
}

module.exports = {
    getClassifications,
    getInventoryByClassificationId,
    getInventorys,
    getInventoryByInventoryId
}