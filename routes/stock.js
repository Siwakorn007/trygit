const express = require("express");
const config = require("../config");
const sql = require("mssql");
const router = express.Router();

router.put("/stock", async (req, res) => {
  const { Prod_ID, Category_ID, Prod_name, Quantity, POS } = req.body;
  try {
    const pool = await sql.connect(config);
    const result = pool.request().query(
      `SELECT
    p.prod_id,
    p.categories_id,
    p.prod_name,
    s.quantity,
    s.Pos
FROM
    Products p
JOIN
    Stock s ON p.prod_id = s.prod_id;`
    );
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Server error" });
  }
});
