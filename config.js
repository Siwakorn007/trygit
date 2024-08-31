// config.js
const config = {
    user: 'sa',
    password: '1234',
    server: '127.0.0.1', 
    database: 'book',
    synchronize: true,
    options: {
        encrypt: false, 
        trustServerCertificate: true,
        enableArithAbort: true
    },
    port: 1433, 
};

module.exports = config;
