const express = require("express");
const config = require("../config");
const sql = require("mssql");
const router = express.Router();
require('dotenv').config();

// totally worst code ever
// router.get("/stock/:id", async (req, res) => {

//   const { id } = req.params; // Product_ID

//   try {
//     const pool = await sql.connect(config);

//     const result = await pool.request()
//       .input("Product_ID", sql.Int, id)
//       .query(`
//         SELECT Product.Product_ID, Product.Product_Name, Product.Product_Price, 
//                Stock.Quantity, Stock.Supplier_ID, Stock.Minimum_Value
//         FROM Stock
//         INNER JOIN Product ON Stock.Product_ID = Product.Product_ID
//         WHERE Product.Product_ID = @Product_ID;
//       `);

//     res.json(result.recordset[0]);
//   } catch (error) {
//     console.error("Error fetching stock:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// });





// router.put("/stock/update/:id", async (req, res) => {
//   const { id } = req.params; // Product_ID
//   const { Supplier_ID, Minimum_Value, Quantity, Product_Price } = req.body;

//   try {
//     const pool = await sql.connect(config);

//     await pool.request()
//       .input("Product_ID", sql.Int, id)
//       .input("Supplier_ID", sql.Int, Supplier_ID)
//       .input("Minimum_Value", sql.Int, Minimum_Value)
//       .input("Quantity", sql.Int, Quantity)
//       .query(`
//         UPDATE Stock
//         SET Supplier_ID = @Supplier_ID,
//             Minimum_Value = @Minimum_Value,
//             Quantity = @Quantity
//         WHERE Product_ID = @Product_ID;
//       `);

//     await pool.request()
//       .input("Product_ID", sql.Int, id)
//       .input("Product_Price", sql.Money, Product_Price)
//       .query(`
//         UPDATE Product
//         SET Product_Price = @Product_Price
//         WHERE Product_ID = @Product_ID;
//       `);

//     res.json({ message: "Stock updated successfully" });
//   } catch (error) {
//     console.error("Error updating stock:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// });


// show all products


// dont know what is this for but i think this is for showing all products for some page
router.get("/stock", async (req, res) => {
  try {
    const pool = await sql.connect(config);

    const result = await pool.request()
      .query(`
        SELECT Product.Product_ID, Product.Category_ID, Product.Product_Name, 
               Product.Description, Product.Product_Price, Product.imgUrl, 
               Stock.Supplier_ID, Stock.Minimum_Value, Stock.Quantity
        FROM Product AS Product
        INNER JOIN Stock AS Stock ON Product.Product_ID = Stock.Product_ID;
      `);

    res.json(result.recordset);
  } catch (error) {
    console.error("Error fetching stock:", error);
    res.status(500).json({ message: "Server error" });
  }
  try {
    // code that may throw an error
  } catch (error) {
    console.error("Error fetching stock:", error);
    res.status(500).json({ message: "Server error" });
  }
}
);

// show product by id
router.get("/stock/:id", async (req, res) => {
  const { id } = req.params; // Product_ID

  try {
    const pool = await sql.connect(config);

    const result = await pool.request()
      .input("Product_ID", sql.Int, id)
      .query(`
        SELECT Product.Product_ID, Product.Category_ID, Product.Product_Name, 
               Product.Description, Product.Product_Price, Product.imgUrl, 
               Stock.Supplier_ID, Stock.Minimum_Value, Stock.Quantity
        FROM Product AS Product
        INNER JOIN Stock AS Stock ON Product.Product_ID = Stock.Product_ID
        WHERE Product.Product_ID = @Product_ID;
      `);

    res.json(result.recordset[0]);
  } catch (error) {
    console.error("Error fetching stock:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// update product
router.put("/stock/update/:id", async (req, res) => {
  const { id } = req.params; // Product_ID
  const { Category_ID,Supplier_ID, Minimum_Value, Quantity, Product_Price, Description, imgUrl } = req.body;

  try {
    const pool = await sql.connect(config);

    // Update Stock table
    await pool.request()
      .input("Product_ID", sql.Int, id)
      .input("Supplier_ID", sql.Int, Supplier_ID)
      .input("Minimum_Value", sql.Int, Minimum_Value)
      .input("Quantity", sql.Int, Quantity)
      .query(`
        UPDATE Stock
        SET Supplier_ID = @Supplier_ID,
            Minimum_Value = @Minimum_Value,
            Quantity = @Quantity  
        WHERE Product_ID = @Product_ID;
      `);

    // Update Product table
    await pool.request()
      .input("Product_ID", sql.Int, id)
      .input("Category_ID", sql.Int, Category_ID)
      .input("Product_Price", sql.Money, Product_Price)
      .input("Description", sql.NVarChar, Description)
      .input("imgUrl", sql.NVarChar, imgUrl)
      .query(`
        UPDATE Product
        SET Category_ID = @Category_ID,
            Product_Price = @Product_Price,
            Description = @Description,
            imgUrl = @imgUrl
        WHERE Product_ID = @Product_ID;
      `);

    res.json({ message: "Stock and product details updated successfully" });
  } catch (error) {
    console.error("Error updating stock and product:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Chat manmm suipeng jud joun tonk tum eankkk
// router.delete('/api/stock/delete/:id', (req, res) => {
//   const { id } = req.params; // Product_ID

//   // Execute the query to delete from Stock
//   const stockQuery = `DELETE FROM Stock WHERE Product_ID = ${id}`;
//   sql.query(stockQuery, (stockErr, stockResult) => {
//     if (stockErr) {
//       console.error('Error deleting from Stock table:', stockErr);
//       return res.status(500).send({ message: 'Error deleting product from stock', error: stockErr });
//     }

//     console.log(`Deleted from Stock table: ${stockResult.affectedRows} row(s)`);

//     // Proceed to delete from Product only if the Stock deletion succeeds
//     const productQuery = `DELETE FROM Product WHERE Product_ID = ${id}`;
//     sql.query(productQuery, (productErr, productResult) => {
//       if (productErr) {
//         console.error('Error deleting from Product table:', productErr);
//         return res.status(500).send({ message: 'Error deleting product', error: productErr });
//       }
//       console.log(`Deleted from Product table: ${productResult.affectedRows} row(s)`);
//       res.send({ message: 'Product deleted successfully' });
//     });
//   });
// });

// delete product using id at product, stock, and product_state table
router.delete("/stock/delete/:id", async (req, res) => {
  const { id } = req.params; // Product_ID

  try {
    const pool = await sql.connect(config);

    // Delete from Stock
    await pool.request()
      .input("Product_ID", sql.Int, id)
      .query(`
        DELETE FROM Stock
        WHERE Product_ID = @Product_ID;
      `);

    // Delete from Product
    await pool.request()
      .input("Product_ID", sql.Int, id)
      .query(`
        DELETE FROM Product
        WHERE Product_ID = @Product_ID;
      `);

      await pool.request()
      .input("Product_ID", sql.Int, id)
      .query(`
        DELETE FROM Product_State
        WHERE Product_ID = @Product_ID;
      `);

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Server error" });
  }
});



module.exports = router;
