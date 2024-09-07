const express = require('express');
const config = require('../config');
const sql = require('mssql');
const router = express.Router();

router.get('/product/cardgame', async (req, res) => {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request().query(

            'SELECT Product.Product_Name, Product.Product_Price, Product.imgUrl FROM Product where Category_ID = 6;'

        );
        res.json(result.recordset);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Server error' });
    }
})
router.get('/product/boardgame', async (req, res) => {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request().query(

            'SELECT Product.Product_Name, Product.Product_Price, Product.imgUrl FROM Product where Category_ID = 7;'

        );
        res.json(result.recordset);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Server error' });
    }
})

router.get('/product/figure_model', async (req, res) => {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request().query(

            'SELECT Product.Product_Name, Product.Product_Price, Product.imgUrl FROM Product where Category_ID = 8;'

        );
        res.json(result.recordset);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Server error' });
    }
})

// router.get('/product', async (req, res) => {
//     try {
//         const pool = await sql.connect(config);
//         const result = await pool.request().query(

//             'SELECT Product.Product_Name, Category_ID,Product.Product_Price, Product.imgUrl FROM Product ;'

//         );
//         res.json(result.recordset);
//     } catch (error) {
//         console.error('Error fetching users:', error);
//         res.status(500).json({ message: 'Server error' });
//     }
// })

router.get('/product', async (req, res) => {
    try {
        const categoryId = req.query.Category_ID; // Get Category_ID from query parameters

        // Ensure Category_ID is provided
        if (!categoryId) {
            return res.status(400).json({ message: 'Category_ID is required' });
        }

        const pool = await sql.connect(config);

        // Use parameterized queries to prevent SQL injection
        const result = await pool.request()
            .input('Category_ID', sql.Int, categoryId)
            .query(
                'SELECT Product.Product_Name, Product.Product_Price, Product.imgUrl FROM Product WHERE Product.Category_ID = @Category_ID;'
            );

        res.json(result.recordset);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ message: 'Server error' });
    }
});




module.exports = router