// server.js
const express = require('express');
const cors = require('cors');
const petrolRoutes = require('./routes/petrol');
const userRoutes = require('./routes/user');
const app = express();
const port = 3001;

app.use(cors({
    origin: 'http://localhost:4200' // Your Angular app's URL
  }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', petrolRoutes); 
app.use('/api', userRoutes); 

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
