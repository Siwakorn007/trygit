const express = require("express");
const config = require("../config");
const sql = require("mssql");
const router = express.Router();
require("dotenv").config();

// show all products in somw page idk
router.get("/product", async (req, res) => {
  try {
    // Extract Category_ID from query parameters
    const categoryId = req.query.Category_ID;

    // Check if Category_ID is provided
    if (!categoryId) {
      return res.status(400).json({ message: "Category_ID is required" });
    }

    console.log("Category_ID:", categoryId); // check

    const pool = await sql.connect(config);
    const result = await pool
      .request()
      .input("Category_ID", sql.Int, categoryId)
      .query(
        "SELECT Product.Product_ID, Product.Product_Name, Product.Product_Price, Product.Description ,Product.imgUrl FROM Product WHERE Product.Category_ID = @Category_ID;"
      );

    res.json(result.recordset);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Server error" });
  }
});


//=======================================================/
// need to fix later
router.get("/product", async (req, res) => {
  const productId = req.query.Product_ID;

  // Check if Product_ID is provided
  if (!productId) {
    return res.status(400).json({ message: "Product_ID is required" });
  }

  try {
    const pool = await sql.connect(config);
    const result = await pool
      .request()
      .input("Product_ID", sql.Int, productId)
      .query(
        "SELECT Product.Product_Name, Categories.Category_Name, Product.Product_Price, Product.Description " +
        "FROM Product " +
        "INNER JOIN Categories ON Product.Category_ID = Categories.Category_ID " +
        "WHERE Product.Product_ID = @Product_ID;"  // Added WHERE clause
      );

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(result.recordset[0]);
  } catch (error) {
    console.error("Database query failed:", error);
    res.status(500).json({ message: "An error occurred while fetching product data" });
  }
});




//=======================================================/
router.get("/product/:", async (req, res) => {
  try {
    // Extract Category_ID from query parameters
    const categoryId = req.query.Category_ID;

    // Check if Category_ID is provided
    if (!categoryId) {
      return res.status(400).json({ message: "Category_ID is required" });
    }

    console.log("Category_ID:", categoryId); // check

    const pool = await sql.connect(config);
    const result = await pool
      .request()
      .input("Category_ID", sql.Int, categoryId)
      .query(
        "SELECT Product.Product_ID, Product.Product_Name, Product.Product_Price, Product.Description ,Product.imgUrl FROM Product WHERE Product.Category_ID = @Category_ID;"
      );

    res.json(result.recordset);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// show product details in another page
router.get("/product/:id", async (req, res) => {
  const categoryId = req.query.Category_ID;

  // Check if Category_ID is provided
  if (!categoryId) {
    return res.status(400).json({ message: "Category_ID is required" });
  }
  try {
    const pool = await sql.connect(config);
    const result = await pool
      .request()
      .input("Category_ID", sql.Int, categoryId)
      .query(
        "SELECT Product.Product_Name, Categories.Category_Name,  Product.Product_Price, Product.Description FROM Product INNER JOIN Categories ON Product.Category_ID = Categories.Category_ID;"
      );

    res.json(result.recordset);
  } catch (error) {}
});



// for adding new product(not adding state of product in Product_State table)
// router.post("/product/add", async (req, res) => {
//   const {
//     Category_ID,
//     Product_Name,
//     Description,
//     Product_Price,
//     Quantity,
//     imgUrl,
//   } = req.body;

//   try {
//     const pool = await sql.connect(config);

//     // Begin a transaction
//     const transaction = new sql.Transaction(pool);
//     await transaction.begin();

//     try {
//       // Insert into the Product table and get the inserted Product_ID
//       const result = await transaction
//         .request()
//         .input("Category_ID", sql.Int, Category_ID)
//         .input("Product_Name", sql.VarChar(100), Product_Name)
//         .input("Description", sql.VarChar(500), Description)
//         .input("Product_Price", sql.Money, Product_Price)
//         .input("Quantity", sql.Int, Quantity)
//         .input("imgUrl", sql.Text, imgUrl)
//         .query(
//           "INSERT INTO Product (Category_ID, Product_Name, Product_Price, Description, Quantity, imgUrl) " +
//             "OUTPUT INSERTED.Product_ID " +
//             "VALUES (@Category_ID, @Product_Name, @Product_Price, @Description, @Quantity, @imgUrl);"
//         );

//       const Product_ID = result.recordset[0].Product_ID;

//       // Insert into the Stock table
//       await transaction
//         .request()
//         .input("Product_ID", sql.Int, Product_ID)
//         .input("Quantity", sql.Int, Quantity)
//         .query(
//           "INSERT INTO Stock (Product_ID, Quantity) VALUES (@Product_ID, @Quantity);"
//         );

//       // Commit the transaction
//       await transaction.commit();

//       res.json({ message: "Product and stock added successfully" });
//     } catch (error) {
//       // Rollback the transaction if there is an error
//       await transaction.rollback();
//       console.error("Error adding product and stock:", error);
//       res.status(500).json({ message: "Server error" });
//     }
//   } catch (error) {
//     console.error("Error connecting to database:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// });


// for adding new product
router.post("/product/add", async (req, res) => {
  const {
    Category_ID,
    Product_Name,
    Description,
    Product_Price,
    Quantity,
    imgUrl,
  } = req.body;

  try {
    const pool = await sql.connect(config);

    // Begin a transaction
    const transaction = new sql.Transaction(pool);
    await transaction.begin();

    try {
      // Insert into the Product table and get the inserted Product_ID
      const result = await transaction
        .request()
        .input("Category_ID", sql.Int, Category_ID)
        .input("Product_Name", sql.VarChar(100), Product_Name)
        .input("Description", sql.VarChar(500), Description)
        .input("Product_Price", sql.Money, Product_Price)
        .input("Quantity", sql.Int, Quantity)
        .input("imgUrl", sql.Text, imgUrl)
        .query(
          "INSERT INTO Product (Category_ID, Product_Name, Product_Price, Description, Quantity, imgUrl) " +
            "OUTPUT INSERTED.Product_ID " +
            "VALUES (@Category_ID, @Product_Name, @Product_Price, @Description, @Quantity, @imgUrl);"
        );

      const Product_ID = result.recordset[0].Product_ID;

      // Insert into the Stock table
      await transaction
        .request()
        .input("Product_ID", sql.Int, Product_ID)
        .input("Quantity", sql.Int, Quantity)
        .query(
          "INSERT INTO Stock (Product_ID, Quantity) VALUES (@Product_ID, @Quantity);"
        );

      // Insert into the Product_State table with State set to true
      await transaction
        .request()
        .input("Product_ID", sql.Int, Product_ID)
        .input("State", sql.Bit, true)
        .query(
          "INSERT INTO Product_State (Product_ID, State) VALUES (@Product_ID, @State);"
        );

      // Commit the transaction
      await transaction.commit();

      res.json({ message: "Product, stock, and state added successfully" });
    } catch (error) {
      // Rollback the transaction if there is an error
      await transaction.rollback();
      console.error("Error adding product, stock, or state:", error);
      res.status(500).json({ message: "Server error" });
    }
  } catch (error) {
    console.error("Error connecting to database:", error);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;
