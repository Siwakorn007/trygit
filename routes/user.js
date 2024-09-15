// const express = require('express');
// const config = require('../config');
// const sql = require('mssql');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const router = express.Router();
// require('dotenv').config();
// router.post('/login', async (req, res) => {
//     const { username, password } = req.body;
//     try {
//         const pool = await sql.connect(config);
//         const result = await pool.request()
//             .input('username', sql.VarChar(100), username)
//             .query('SELECT * FROM User_Account WHERE username = @username');

//         if (result.recordset.length > 0) {
//             const user = result.recordset[0];
//             console.log('User found:', user);

//             if (!user.Password) {
//                 console.error('Password field is undefined!');
//                 return res.status(500).json({ message: 'Server error: Password is undefined.' });
//             }

//             const isMatch = await bcrypt.compare(password, user.Password);
//             console.log('Password match:', isMatch);

//             if (isMatch) {
//                 const role = user.Role.trim();
//                 res.json({ role, username: user.username });
//                 console.log('Login successful');
//             } else {
//                 res.status(400).json({ message: 'Invalid credentials' });
//             }
//         } else {
//             res.status(400).json({ message: 'User not found' });
//         }
//     } catch (error) {
//         console.error('Error during login:', error);
//         res.status(500).json({ message: 'Server error' });
//     }
// });

// module.exports = router;

//===================================not using cause not stupid anyway bruh===============================================================//
// const express = require("express");
// const config = require("../config");
// const sql = require("mssql");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const router = express.Router();
// require("dotenv").config();

// // super idol secret key btw
// const JWT_SECRET = process.env.JWT_SECRET || "super_idol";

// router.post("/login", async (req, res) => {
//   const { username, password } = req.body;
//   console.log("Received login data:", req.body); // Log received data

//   if (!username || !password) {
//     return res
//       .status(400)
//       .json({ message: "username and password are required" });
//   }

//   try {
//     const pool = await sql.connect(config);
//     const result = await pool
//       .request()
//       .input("username", sql.VarChar(100), username)
//       .query("SELECT * FROM User_Account WHERE username = @username");

//     if (result.recordset.length > 0) {
//       const user = result.recordset[0];
//       console.log("User found:", user);

//       if (!user.Password) {
//         console.error("Password field is undefined!");
//         return res
//           .status(500)
//           .json({ message: "Server error: Password is undefined." });
//       }

//       const isMatch = await bcrypt.compare(password, user.Password);
//       console.log("Password match:", isMatch);

//       if (isMatch) {
//         const role = user.Role.trim();
//         const token = jwt.sign({ id: user.Id, role }, JWT_SECRET, {
//           expiresIn: "1h",
//         });

//         res.json({ token, role, username: user.username });
//         console.log("Login successful");
//       } else {
//         res.status(400).json({ message: "Invalid credentials" });
//       }
//     } else {
//       res.status(400).json({ message: "User not found" });
//     }
//   } catch (error) {
//     console.error("Error during login:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// });

//-------------------for testing only--------------------------------------//
// router.get('/users', async (req, res) => {
//     try {
//         const pool = await sql.connect(config);
//         const result = await pool.request().query('SELECT * FROM User_Account');
//         res.json(result.recordset);
//     } catch (error) {
//         console.error('Error fetching users:', error);
//         res.status(500).json({ message: 'Server error' });
//     }
// });
//---------------------------------------------------------------------------------//

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const pool = await sql.connect(config);
    const result = await pool
      .request()
      .input("username", sql.VarChar(100), username)
      .query("SELECT * FROM login WHERE username = @username");

    if (result.recordset.length === 0) {
      // No user found with the given username
      return res.status(404).json({ message: "User not found" });
    }

    const user = result.recordset[0];
    console.log("User found:", user);

    if (!user.Password) {
      console.error("Password field is undefined!");
      return res.status(500).json({ message: "Server error: Password is undefined." });
    }

    // Direct password comparison (not secure for production use)
    if (password !== user.Password) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // If password matches, return success response
    res.status(200).json({
      message: "Login successful",
      user: { username: user.username },
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;
