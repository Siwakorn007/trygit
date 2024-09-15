// // routes/petrol.js
// const express = require('express');
// const config = require('../config');
// const sql = require('mssql');
// require('dotenv').config();
// const router = express.Router();

// router.get('/petrol', async (req, res) => {
//     try {
//         const pool = await sql.connect(config);
//         const result = await pool.request().query('SELECT * FROM OilTypes');
//         res.send(result.recordset);
//     } catch (err) {
//         console.error('Database query failed:', err);
//         res.status(500).send('An error occurred while fetching data.');
//     } finally {

//     }
// });

// router.post('/petrol', async (req, res) => {
//     const { name, price, quantity, type } = req.body;
//     try {
//         const pool = await sql.connect(config);
//         const result = await pool.request()
//             .input('name', sql.VarChar(255), name)
//             .input('price', sql.VarChar(255), price)
//             .input('quantity', sql.VarChar(255), quantity)
//             .input('type', sql.VarChar(255), type)
//             .query('INSERT INTO OilTypes (name, price, quantity, type) VALUES (@name, @price, @quantity, @type)');
//         res.send(result.recordset);
//     } catch (err) {
//         console.error('Database query failed:', err);
//         res.status(500).send('An error occurred while fetching data.');
//     } finally {

//     };
// });

// module.exports = router;
