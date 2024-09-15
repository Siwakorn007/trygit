const express = require("express");
const router = express.Router();
const sql = require("mssql");
const config = require("../config"); // Assuming your config contains the necessary database connection details

// router.post("/create-order", async (req, res) => {
//   const { customerID, discount, amount, products } = req.body; // Get order data and product details from request body

//   if (!customerID || !products || products.length === 0) {
//     return res.status(400).json({ message: "Invalid request data" });
//   }

//   let pool; // Declare pool outside try block for rollback if necessary
//   let transaction;

//   try {
//     // Create a new SQL Server connection pool using the config
//     pool = await sql.connect(config);

//     // Begin transaction
//     transaction = new sql.Transaction(pool);
//     await transaction.begin();

//     // Insert new order into the 'Order' table
//     const orderRequest = new sql.Request(transaction);
//     const orderResult = await orderRequest
//       .input("Customer_ID", sql.Int, customerID)
//       .input("Discount", sql.Decimal(18, 2), discount)
//       .input("Amount", sql.Int, amount)
//       .input("Order_Date", sql.DateTime, new Date()).query(`
//         INSERT INTO [Order] (Customer_ID, Discount, Amount, Order_Date) 
//         OUTPUT INSERTED.Order_ID
//         VALUES (@Customer_ID, @Discount, @Amount, @Order_Date)
//       `);

//     const orderID = orderResult.recordset[0].Order_ID; // Get the generated Order_ID

//     // Insert order details into the 'OrderDetails' table
//     const orderDetailsRequest = new sql.Request(transaction);

//     for (const product of products) {
//       const { productID, quantity, productPrice } = product;
    
//       await orderDetailsRequest
//         .input("Order_ID", sql.Int, orderID)
//         .input("Product_ID", sql.Int, productID)
//         .input("Quantity", sql.Int, quantity)
//         .input("Product_Price", sql.Money, productPrice).query(`
//           INSERT INTO OrderDetails (Order_ID, Product_ID, Quantity, Product_Price) 
//           VALUES (@Order_ID, @Product_ID, @Quantity, @Product_Price)
//         `);
//     }

//     // Commit transaction
//     await transaction.commit();

//     res.status(201).json({ message: "Order created successfully", orderID });
//   } catch (error) {
//     console.error("Error creating order: ", error);

//     // If error occurs, rollback transaction
//     if (transaction) {
//       await transaction.rollback();
//     }

//     res.status(500).json({ message: "Error creating order", error });
//   } finally {
//     // Close the pool connection after transaction
//     if (pool) {
//       pool.close();
//     }
//   }
// });


router.post("/create-order", async (req, res) => {
  const { customerID, discount, products } = req.body;

  if (!customerID || !products || products.length === 0) {
    return res.status(400).json({ message: "Invalid request data" });
  }

  let pool;
  let transaction;

  try {
    // Create a new SQL Server connection pool using the config
    pool = await sql.connect(config);

    // Begin transaction
    transaction = new sql.Transaction(pool);
    await transaction.begin();

    // Insert new order into the 'Order' table
    const orderRequest = new sql.Request(transaction);
    const orderResult = await orderRequest
      .input("Customer_ID", sql.Int, customerID)
      .input("Discount", sql.Decimal(18, 2), discount)
      .input("Amount", sql.Int, amount)
      .input("Order_Date", sql.DateTime, new Date()).query(`
        INSERT INTO [Order] (Customer_ID, Discount, Amount, Order_Date) 
        OUTPUT INSERTED.Order_ID
        VALUES (@Customer_ID, @Discount, @Amount, @Order_Date)
      `);

    const orderID = orderResult.recordset[0].Order_ID; // Get the generated Order_ID

    // Insert order details into the 'OrderDetails' table
    for (const product of products) {
      const { productID, quantity } = product;

      // Query the Product table to get the Product_Price for the productID
      const productRequest = new sql.Request(transaction);
      const productResult = await productRequest
        .input("Product_ID", sql.Int, productID)
        .query(`
          SELECT Product_Price FROM Product WHERE Product_ID = @Product_ID
        `);

      // Check if the product exists and has a valid price
      if (productResult.recordset.length === 0) {
        throw new Error(`Product with ID ${productID} not found`);
      }

      const productPrice = productResult.recordset[0].Product_Price;

      if (productPrice === null || productPrice === undefined) {
        throw new Error(`Product price for product ID ${productID} is NULL`);
      }

      // Log productPrice for debugging
      console.log(`Product ID: ${productID}, Price: ${productPrice}`);

      const orderDetailsRequest = new sql.Request(transaction);
      await orderDetailsRequest
        .input("Order_ID", sql.Int, orderID)
        .input("Product_ID", sql.Int, productID)
        .input("Quantity", sql.Int, quantity)
        .input("Product_Price", sql.Money, productPrice).query(`
          INSERT INTO OrderDetails (Order_ID, Product_ID, Quantity, Product_Price) 
          VALUES (@Order_ID, @Product_ID, @Quantity, @Product_Price)
        `);
    }

    // Commit transaction
    await transaction.commit();

    res.status(201).json({ message: "Order created successfully", orderID });
  } catch (error) {
    console.error("Error creating order: ", error);

    // If error occurs, rollback transaction
    if (transaction) {
      await transaction.rollback();
    }

    res.status(500).json({ message: "Error creating order", error });
  } finally {
    // Close the pool connection after transaction
    if (pool) {
      pool.close();
    }
  }
});



module.exports = router;
