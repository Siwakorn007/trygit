// back\routes\edit_master_user.js

//for editing master user

const express = require("express");
const config = require("../config");
const sql = require("mssql");
const router = express.Router();
require('dotenv').config();
// Update a user by ID
router.put("/master_user/:id", async (req, res) => {
  const User_ID = req.params.id;
  const { Firstname, Lastname, Username, Email, Phone, Role } = req.body;

  try {
    // Connect to the SQL Server
    const pool = await sql.connect(config);

    // Create a new SQL request object
    const request = pool.request();

    // Set up the input parameters
    request.input("User_ID", sql.Int, User_ID);
    request.input("Firstname", sql.VarChar, Firstname);
    request.input("Lastname", sql.VarChar, Lastname);
    request.input("Username", sql.VarChar, Username);
    request.input("Email", sql.VarChar, Email);
    request.input("Phone", sql.Char, Phone);
    request.input("Role", sql.VarChar, Role);

    // Define the SQL update query
    const updateQuery = `
  UPDATE Master_Account
  SET Firstname = @Firstname,
      Lastname = @Lastname,
      Username = @Username,
      Email = @Email,
      Phone = @Phone,
      Role = @Role
  WHERE User_ID = @User_ID
`;

    // Execute the SQL update query
    await request.query(updateQuery);
    res.json({ massage : "User updated successfully"});
    // res.send("User updated successfully");
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).send("Error updating user");
  }
});

module.exports = router;
