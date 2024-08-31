const express = require('express');
const config = require('../config');
const sql = require('mssql');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

// router.get('/users', async (req, res) => {
//     try {
//         const pool = await sql.connect(config);
//         const result = await pool.request().query('SELECT * FROM Users');
//         res.json(result.recordset);
//     } catch (error) {
//         console.error('Error fetching users:', error);
//         res.status(500).json({ message: 'Server error' });
//     }
// })

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('username', sql.Char(255), username)
            .query('SELECT * FROM Users WHERE username = @username');
        
        if (result.recordset.length > 0) {
            const user = result.recordset[0];
            const isMatch = await bcrypt.compare(password, user.password);
            console.log(isMatch)

            if (isMatch) {
                const role = user.role.trim();
                const token = jwt.sign({ id: user.id, role }, JWT_SECRET, { expiresIn: '1h' });
                res.json({ token, role, username: user.username });
                console.log('Login successful');
            } else {
                res.status(400).json({ message: 'Invalid credentials' });
            }
        } else {
            res.status(400).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
