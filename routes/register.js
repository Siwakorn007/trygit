const express = require('express');
const config = require('../config');
const sql = require('mssql');
const router = express.Router();
const bcrypt = require('bcryptjs');
require('dotenv').config();

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
// })
//---------------------------------------------------------------------------------//


// Register user


router.post('/register', async (req, res) => {
    const { firstName, lastName, username, password, email, phone, role } = req.body;

    // Validate the role against a list of acceptable roles
    const allowedRoles = ['user']; 
    if (!allowedRoles.includes(role)) {
        return res.status(400).send({ message: 'Invalid role provided.' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('FirstName', sql.VarChar(100), firstName)
            .input('LastName', sql.VarChar(100), lastName)
            .input('UserName', sql.VarChar(20), username)
            .input('Password', sql.VarChar(60), hashedPassword)
            .input('Email', sql.VarChar(50), email)
            .input('Phone', sql.Char(10), phone)
            .input('Role', sql.VarChar(20), role)
            .query('INSERT INTO User_Account (FirstName, LastName, UserName, Password, Email, Phone, Role) VALUES (@FirstName, @LastName, @UserName, @Password, @Email, @Phone, @Role)');
        
        console.log(result);

        if (result.rowsAffected[0] > 0) {
            res.status(201).send({ message: 'User registered successfully', rowsAffected: result.rowsAffected[0] });
        } else {
            res.status(400).send({ message: 'User registration failed' });
        }
    } catch (err) {
        console.error('Database query failed:', err);
        res.status(500).send('An error occurred while registering the user.');
    }
});

module.exports = router;