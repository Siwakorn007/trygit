// config.js
const config = {
    user: 'sa',
    password: '1234',
    server: '127.0.0.1', 
    database: 'toytest',
    synchronize: true,
    options: {
        encrypt: false, 
        trustServerCertificate: true,
        enableArithAbort: true
    },
    port: 1433, 
};

// const config = {
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     server: process.env.DB_SERVER,
//     database: process.env.DB_NAME,
//     synchronize: true,
//     options: {
//         encrypt: false, 
//         trustServerCertificate: true,
//         enableArithAbort: true
//     },
//     port: 1433,
// };


module.exports = config;
