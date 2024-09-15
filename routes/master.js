// use at fisrt but now wortless
//=========================================================//


// const express = require("express");
// const config = require("../config");
// const sql = require("mssql");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const router = express.Router();


// const JWT_SECRET = process.env.JWT_SECRET || "super_idol";

// router.post("/login", async (req, res) => {
//   const { username, password } = req.body;
//   try {
//     const pool = await sql.connect(config);

//     // Combine queries to handle both Master_Account and User_Account
//     const result = await pool
//       .request()
//       .input("Username", sql.VarChar(100), username).query(`
//                 SELECT * FROM Master_Account WHERE Username = @Username
//                 UNION ALL
//                 SELECT * FROM User_Account WHERE Username = @Username
//             `);

//     if (result.recordset.length > 0) {
//       const user = result.recordset[0];
//       console.log("User found:", user);

//       if (!user.Password) {
//         console.error("Password field is undefined!");
//         return res
//           .status(500)
//           .json({ message: "Server error: Password is undefined." });
//       }

//       // Compare hashed passwords
//       const isMatch = await bcrypt.compare(password, user.Password);
//       console.log("Password match:", isMatch);

//       if (isMatch) {
//         const role = user.Role.trim();

//         // Generate JWT token
//         const token = jwt.sign({ id: user.Id, role }, JWT_SECRET, {
//           expiresIn: "1h",
//         });

//         // Send the token along with user details in the response
//         res.json({ token, role, username: user.Username });
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

// module.exports = router;


//=========================================================//

const express = require("express");
const config = require("../config");
const sql = require("mssql");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || "super_idol";

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const pool = await sql.connect(config);

    // Modify the query to also fetch Customer_ID from User_Account
    const result = await pool
      .request()
      .input("Username", sql.VarChar(100), username)
      .query(`
                SELECT User_ID, Username, Password, Role, NULL AS Customer_ID FROM Master_Account WHERE Username = @Username
                UNION ALL
                SELECT Customer_ID, Username, Password, Role, Customer_ID FROM User_Account WHERE Username = @Username
            `);

    if (result.recordset.length > 0) {
      const user = result.recordset[0];
      console.log("User found:", user);

      if (!user.Password) {
        console.error("Password field is undefined!");
        return res
          .status(500)
          .json({ message: "Server error: Password is undefined." });
      }

      // Compare hashed passwords
      const isMatch = await bcrypt.compare(password, user.Password);
      console.log("Password match:", isMatch);

      if (isMatch) {
        const role = user.Role.trim();
        const customerID = user.Customer_ID || null; // Get Customer_ID if available

        // Generate JWT token with Customer_ID included if it exists
        const token = jwt.sign(
          { id: user.Id, role, customerID },
          JWT_SECRET,
          {
            expiresIn: "1h",
          }
        );

        // Send the token along with user details in the response
        res.json({ token, role, username: user.Username, customerID });
        console.log("Login successful");
      } else {
        res.status(400).json({ message: "Invalid credentials" });
      }
    } else {
      res.status(400).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
