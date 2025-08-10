const pool = require("../database/")

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
 *  Get all items details and inv_name by inv_id
 * ************************** */
async function getDetailByInvId(inv_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory 
      WHERE inv_id = $1`,
      [inv_id]
    )
    return data.rows
  } catch (error) {
    console.error("getDetailByInvId error " + error)
  }
}

/* ***************************
 *  Get all iventory items
 * ************************** */
async function getAllInventory() {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      ORDER BY i.inv_make, i.inv_model`
    )
    return data.rows
  } catch (error) {
    console.error("getAllInventory error " + error)
  }
}

async function addClassification(classification_name) {
  try {
    const sql = "INSERT INTO classification (classification_name) VALUES ($1) RETURNING *"
    const data = await pool.query(sql, [classification_name])
    return data.rows[0]
  } catch (error) {
    console.error("addClassification error", error)
    return null
  }
}

async function addInventory(classification_id, make, model, year, description, image, thumbnail, price, miles, color) {
  try {
    const sql = `
      INSERT INTO inventory 
        (classification_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color) 
      VALUES 
        ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) 
      RETURNING *;
    `
    return await pool.query(sql, [classification_id, make, model, year, description, image, thumbnail, price, miles, color])
  } catch (error) {
    console.error("addInventory error:", error)
    return null
  }
}

module.exports = {getClassifications, getInventoryByClassificationId, getDetailByInvId, getAllInventory, addClassification, addInventory}