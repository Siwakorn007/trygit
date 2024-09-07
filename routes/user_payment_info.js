const express = require("express");
const config = require("../config");
const sql = require("mssql");
const router = express.Router();

router.get("/user_payment_info", async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().query(`
      SELECT 
        Payment.Payment_ID, 
        [Order].Order_ID, 
        User_Account.Customer_ID, 
        User_Account.Firstname, 
        User_Account.Lastname, 
        Payment.Payment_Method, 
        Payment.Total_Price, 
        Payment.Payment_Date
      FROM 
        [Order]
      INNER JOIN Payment ON [Order].Order_ID = Payment.Order_ID
      INNER JOIN User_Account ON [Order].Customer_ID = User_Account.Customer_ID
    `);
    res.json(result.recordset);
  } catch (error) {
    console.error("Error fetching user payment info:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
