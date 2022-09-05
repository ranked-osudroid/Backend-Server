import * as mysql from 'mysql';

export default class MySQL {

    static mysqlConnection;

    static query(sql) {
        return new Promise((resolve, reject) => {
            this.mysqlConnection.query(sql, (error, results, fields) => {
                if (error) {
                    console.log(error);
                }
                else {
                    resolve(results);
                }
            });
        });
    }

    static connect() {
        this.mysqlConnection = mysql.createConnection({
            host: process.env.DB_ADDRESS,
            user: process.env.DB_USER,
            password: process.env.DB_PW,
            database: process.env.DB_NAME,
            port: process.env.DB_PORT
        });
    
        this.mysqlConnection.connect(function (err) {
            if (err) {
                console.log('error when connecting to db:', err);
                setTimeout(MySQL.connect, 2000);
            }
            else {
                console.log(`Successfully connected with database.`);
            }
        });
    
        this.mysqlConnection.on('error', function (err) {
            console.log(`Database disconnected. Try reconnecting...`);
            MySQL.connect();
        });
    }
}