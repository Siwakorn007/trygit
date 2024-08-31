// routes/petrol.js
const express = require('express');
const config = require('../config');
const sql = require('mssql');

const router = express.Router();

router.get('/petrol', async (req, res) => {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request().query('SELECT * FROM OilTypes');
        res.send(result.recordset);
    } catch (err) {
        console.error('Database query failed:', err);
        res.status(500).send('An error occurred while fetching data.');
    } finally {
        closePool();
    }
});

module.exports = router;
