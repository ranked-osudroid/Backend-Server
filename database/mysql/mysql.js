const mysql = require('mysql');

let mysqlConnection;

exports.query = (dbQuery) => {
    return new Promise((resolve, reject) => {
        mysqlConnection.query(dbQuery, (error, results, fields) => {
            if (error) {
                console.log(error);
            }
            else {
                resolve(results);
            }
        });
    });
}

const handleDisconnect = () => {
    mysqlConnection = mysql.createConnection({
        host: process.env.DB_ADDRESS,
        user: process.env.DB_USER,
        password: process.env.DB_PW,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT
    });

    mysqlConnection.connect(function (err) {
        if (err) {
            console.log('error when connecting to db:', err);
            setTimeout(handleDisconnect, 2000);
        }
        else {
            console.log(`Successfully connected with database.`);
        }
    });

    mysqlConnection.on('error', function (err) {
        console.log(`Database disconnected. Try reconnecting...`);
        handleDisconnect();
    });
}

handleDisconnect();