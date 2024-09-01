// const express = require('express');
// const config = require('../config');
// const sql = require('mssql');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const router = express.Router();



// router.post('/login', async (req, res) => {
//     const { username, password } = req.body;
//     try {
//         const pool = await sql.connect(config);
//         const result = await pool.request()
//             .input('Username', sql.VarChar(100), username)
//             .query('SELECT * FROM User_Account WHERE Username = @Username');

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
//                 res.json({ role, username: user.Username });
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




const express = require('express');
const config = require('../config');
const sql = require('mssql');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
require('dotenv').config();


// super idol secret key btw
const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_key'; 

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('Username', sql.VarChar(100), username)
            .query('SELECT * FROM User_Account WHERE Username = @Username');

        if (result.recordset.length > 0) {
            const user = result.recordset[0];
            console.log('User found:', user);

            if (!user.Password) {
                console.error('Password field is undefined!');
                return res.status(500).json({ message: 'Server error: Password is undefined.' });
            }

            // check if matching hashpassword in database
            const isMatch = await bcrypt.compare(password, user.Password);
            console.log('Password match:', isMatch);

            if (isMatch) {
                const role = user.Role.trim();

                // Generate jwt token
                const token = jwt.sign({ id: user.Id, role }, JWT_SECRET, { expiresIn: '1h' });

                // Send the token along with user details in the response
                res.json({ token, role, username: user.Username });
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
