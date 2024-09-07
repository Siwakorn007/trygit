// server.js
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');


// const petrolRoutes = require('./routes/petrol');
// const userRoutes = require('./routes/user');  // log for user
const registerRoutes = require('./routes/register');  //for register user
const register_masterRoutes = require('./routes/register_master'); //for register master account
const masterRoutes = require('./routes/master'); //forlogin master account
const master_userRoutes = require('./routes/master_user'); //for get all user of master account
const edit_master_userRoutes = require('./routes/edit_master_user'); //for edit master user
const user_payment_infoRoutes = require('./routes/user_payment_info');
const productRoutes = require('./routes/Product');
// const stockRoutes = require('./routes/stock');
// const test1Routes = require('./routes/test1');
// const paymetRoutes = require('./routes/payment');


require('dotenv').config();
// const { readdirSync } = require('fs'); //testing readdirSync 

const port = 3001;


// app.use(cors({
//     origin: 'http://localhost:4200' // Angular app's URL
//   }));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());


// app.use('/api', petrolRoutes); 
// app.use('/api', userRoutes);  
app.use('/api', registerRoutes); //resiger
app.use('/api', register_masterRoutes); //master register
app.use('/api', master_userRoutes); //get master user
app.use('/api', edit_master_userRoutes); //edit master user
app.use('/api', masterRoutes); //login all user
app.use('/api', user_payment_infoRoutes);
app.use('/api', productRoutes);
// app.use('/api', paymetRoutes);
// app.use('/api', test1Routes);
//========================testing readdirSync==========================//
// readdirSync('./routes')
//  .map((r)=> app.use('/api',require('./routes/' + r)))


app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
