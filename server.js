// server.js
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
// const petrolRoutes = require('./routes/petrol');
// const userRoutes = require('./routes/user');
const registerRoutes = require('./routes/register');
const testRoutes = require('./routes/test');
const register_masterRoutes = require('./routes/register_master');
const masterRoutes = require('./routes/master');
// const paymetRoutes = require('./routes/payment');
require('dotenv').config();
// const { readdirSync } = require('fs');

const port = 3001;
app.use(cors());

// app.use(cors({
//     origin: 'http://localhost:4200' // Angular app's URL
//   }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());


// app.use('/api', petrolRoutes); 
// app.use('/api', userRoutes); 
app.use('/api', registerRoutes);
app.use('/api', testRoutes);
app.use('/api', register_masterRoutes);
app.use('/api', masterRoutes);
// app.use('/api', paymetRoutes);

//===================================//
// readdirSync('./routes')
//  .map((r)=> app.use('/api',require('./routes/' + r)))


app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
