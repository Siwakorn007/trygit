// const express = require("express");
// const Stripe = require("stripe");
// const cors = require("cors");
// const sql = require('mssql');
// // const config = require('../config');
// const router = express.Router();
// const app = express();
// // const stripe = Stripe("your_secret_key"); // Replace with your Stripe secret key
// // const { v4: uuidv4 } = require("uuid");
// // const { config } = require("dotenv");


// app.use(express.json());
// app.use(cors()); // To handle CORS
// // sql.connect(config);


// app.get("/payment", express.json(), async (req, res) => {
//     const { user, orderId } = req.body;

//     res.json({
//         user,
//         orderId
//     })
// })


// // app.post("/payment", express.json(), async (req, res) => {
// //     const { user, orderId } = req.body;

// //     res.json({
// //         user,
// //         orderId
// //     })
// // })


// // Endpoint to create a payment intent
// // app.post("/payment", express.json(), async (req, res) => {
// //   const { product, information } = req.body;

// //   try {
// //     const orderId = uuidv4();
// //     const pool = await sql.connect(config);
// //     const paymentIntent = await pool.stripe.paymentIntents.create({
// //       payment_method_types: ["card"],
// //       line_items: [
// //         {
// //           price_data: {
// //             currency: "thb",
// //             product_data: {
// //               name: product.name,
// //             },
// //             unit_amount: product.price * 100,
// //           },
// //           quantity: product.quantity,
// //         },
// //       ],
// //       mode: "payment",
// //       success_url: `http://localhost:3001/success.html?id=${orderId}`,
// //       cancel_url: `http://localhost:3001/cancel.html?id=${orderId}`,
// //       metadata: {
// //         orderId,
// //       },
// //     });

// //     console.log("session", paymentIntent);

// //     const data = {
// //       name: information.name,
// //       address: information.address,
// //       session_id: session.id,
// //       status: session.status,
// //       order_id: orderId,
// //     };

// //     const [result] = await conn.query("INSERT INTO orders SET ?", data);

// //     res.json({
// //       message: "Checkout success.",
// //       id: session.id,
// //       result,
// //     });
// //   } catch (error) {
// //     console.error("Error creating user:", error.message);
// //     res.status(400).json({ error: "Error payment" });
// //   }
// // });

// module.exports = router;
