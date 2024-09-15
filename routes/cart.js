// const express = require("express");
// const config = require("../config");
// const sql = require("mssql");
// const router = express.Router();

// router.get("/cart/:id", async (req, res) => {
//     const { id } = req.params; // Use req.params to get the id from the URL
//     try {
//       const pool = await sql.connect(config);
//       const result = await pool
//         .request()
//         .input("Product_ID", sql.Int, id)
//         .query(`
//           SELECT Product.*, Stock.Quantity, Stock.Supplier_ID, Stock.Minimum_Value
//           FROM Product
//           JOIN Stock ON Product.Product_ID = Stock.Product_ID
//           WHERE Product.Product_ID = @Product_ID;
//         `);
  
//       res.json(result.recordset);
//     } catch (error) {
//       console.error("Error fetching cart:", error);
//       res.status(500).json({ message: "Server error" });
//     }
//   });
  

// module.exports = router;


const express = require("express");
const config = require("../config");
const sql = require("mssql");
const router = express.Router();

router.post('/api/checkout', async (req, res) => {
  const { Customer_ID, Products } = req.body;

  try {
    const pool = await sql.connect(config);
    const request = pool.request();

    // Insert order and get the newly inserted Order_ID using OUTPUT clause
    const orderQuery = `
      INSERT INTO [Order] (Customer_ID, Order_Date) 
      OUTPUT INSERTED.Order_ID
      VALUES (@Customer_ID, GETDATE());
    `;
    const orderIdResult = await request.input('Customer_ID', sql.Int, Customer_ID).query(orderQuery);
    
    const orderID = orderIdResult.recordset[0].Order_ID;
    console.log("Generated Order_ID:", orderID); // Log the Order_ID for debugging

    // Insert order details with Quantity and Product_Price
    for (const product of Products) {
      const productRequest = pool.request(); // Create a new request object inside the loop for each product

      // Get the product price from Product table
      const productPriceQuery = `
        SELECT Product_Price 
        FROM Product 
        WHERE Product_ID = @Product_ID;
      `;
      const productPriceResult = await productRequest
        .input('Product_ID', sql.Int, product.Product_ID)
        .query(productPriceQuery);
      const productPrice = productPriceResult.recordset[0].Product_Price;

      // Insert into OrderDetails
      const orderDetailsRequest = pool.request();
      const orderDetailsQuery = `
        INSERT INTO OrderDetails (Order_ID, Product_ID, Quantity, Product_Price)
        VALUES (@Order_ID, @Product_ID, @Quantity, @Product_Price);
      `;
      await orderDetailsRequest
        .input('Order_ID', sql.Int, orderID)
        .input('Product_ID', sql.Int, product.Product_ID)
        .input('Quantity', sql.Int, product.Quantity || 1) // Provide default quantity if needed
        .input('Product_Price', sql.Decimal(10, 2), productPrice)
        .query(orderDetailsQuery);
    }

    res.status(200).json({ message: 'Order placed successfully' });
  } catch (error) {
    console.error('Detailed error information:', error);
    res.status(500).send('Error processing order');
  }
});



module.exports = router;