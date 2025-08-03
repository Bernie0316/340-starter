const pool = require("../database/")


// 把「註冊表單送來的資料」存進 PostgreSQL 的 account 表格中。
/* *****************************
*   Register new account
* *************************** */
async function registerAccount(account_firstname, account_lastname, account_email, account_password){
  try {
    // 建立 SQL 指令，用 參數化語法 $1, $2, ... 放資料；直接把帳號類型定為 'Client'
    const sql = "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *"
    return await pool.query(sql, [account_firstname, account_lastname, account_email, account_password])
  } catch (error) {
    return error.message
  }
}

module.exports = {registerAccount}