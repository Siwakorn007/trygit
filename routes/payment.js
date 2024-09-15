const express = require("express");
const router = express.Router();
const sql = require("mssql");
const config = require("../config");


// payment using order_id from orderdetails table
router.post('/payment', async (req, res) => {
  const { Order_ID, Payment_Method } = req.body;

  try {
    const pool = await sql.connect(config);
    
    // Fetch total price for the given Order_ID by summing up Total_Price from OrderDetails
    const totalPriceQuery = `
      SELECT SUM(Total_Price) AS Payment_Amount
      FROM OrderDetails
      WHERE Order_ID = @Order_ID;
    `;
    const totalPriceResult = await pool.request()
      .input('Order_ID', sql.Int, Order_ID)
      .query(totalPriceQuery);
    
    const Payment_Amount = totalPriceResult.recordset[0].Payment_Amount;

    if (!Payment_Amount) {
      return res.status(400).send("No order details found for the given Order_ID.");
    }

    // Insert into the Payment table
    const paymentQuery = `
      INSERT INTO Payment (Order_ID, Payment_Amount, Payment_Method, Payment_Date)
      VALUES (@Order_ID, @Payment_Amount, @Payment_Method, GETDATE());
    `;
    await pool.request()
      .input('Order_ID', sql.Int, Order_ID)
      .input('Payment_Amount', sql.Money, Payment_Amount)
      .input('Payment_Method', sql.VarChar(50), Payment_Method)
      .query(paymentQuery);

    res.send('Payment processed successfully');
  } catch (error) {
    console.error('Error processing payment:', error);
    res.status(500).send('Error processing payment');
  }
});

module.exports = router;
