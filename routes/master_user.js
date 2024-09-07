const express = require('express');
const config = require('../config');
const sql = require('mssql');
const router = express.Router();

router.get('/master_user', async (req, res) => {
    try {
        console.log('Attempting to connect to the database...');
        const pool = await sql.connect(config);

        console.log('Connection successful, executing query...');
        const result = await pool.request().query(
            'SELECT User_ID, Firstname, Lastname, Username, Email, Phone, Role FROM Master_Account'
        );

        console.log('Query executed successfully, sending data...');
        console.log(result.recordset);  
        res.send(result.recordset);
    } catch (err) {
        console.error('Database query failed:', err);
        res.status(500).send('An error occurred while fetching data.');
    }
});

module.exports = router;
