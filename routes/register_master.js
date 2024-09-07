const bcrypt = require("bcryptjs");
const express = require("express");
const config = require("../config");
const sql = require("mssql");
const router = express.Router();

// register master
router.post("/register_master", async (req, res) => {
    try {
      console.log('Connecting to the database...');
      const pool = await sql.connect(config);
      console.log('Connected to the database.');
  
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);
  
      // Map the keys to their corresponding values
      const keysResult = await pool
        .request()
        .query("SELECT ConfigKey, ConfigValue FROM Configuration");
  
      console.log('Keys retrieved from the database:', keysResult.recordset);
  
      const keys = {};
      keysResult.recordset.forEach((row) => {
        keys[row.ConfigKey] = row.ConfigValue;  
      });
  
      console.log('Keys mapped:', keys);
  
      // verify key by comparing it to the hashed keys by role
      let role;
      const isManager = await bcrypt.compare(req.body.key, keys["ManagerKey"]);
      const isEmployee = await bcrypt.compare(req.body.key, keys["EmployeeKey"]);
  
      console.log('Key verification results:', { isManager, isEmployee });
  
      if (isManager) {
        role = "manager";
      } else if (isEmployee) {
        role = "employee";
      } else {
        console.log('Invalid registration key.');
        return res.status(400).send({ message: "Invalid registration key" });
      }
  
      const { firstName, lastName, username, email, phone } = req.body;
  
      console.log('Inserting new user to the database...');
      const result = await pool
        .request()
        .input("FirstName", sql.VarChar(100), firstName)
        .input("LastName", sql.VarChar(100), lastName)
        .input("UserName", sql.VarChar(20), username)
        .input("Password", sql.VarChar(60), hashedPassword)
        .input("Email", sql.VarChar(50), email)
        .input("Phone", sql.Char(10), phone)
        .input("Role", sql.VarChar(20), role)
        .query(
          "INSERT INTO Master_Account (FirstName, LastName, UserName, Password, Email, Phone, Role) VALUES (@FirstName, @LastName, @UserName, @Password, @Email, @Phone, @Role)"
        );
  
      console.log('User registration result:', result);
  
      if (result.rowsAffected[0] > 0) {
        res.status(201).send({
          message: "User registered successfully",
          rowsAffected: result.rowsAffected[0],
        });
      } else {
        res.status(400).send({ message: "User registration failed" });
      }
    } catch (err) {
      console.error("Database query failed:", err);
      res.status(500).send("An error occurred while registering the user.");
    }
  });
  
  module.exports = router;
  

