import * as mysql from 'mysql2';

let pool;

export const connect = () => {
    if(pool != undefined) {
        throw new Error("Pool is already initialized!");
    }
    pool = mysql.createPool({
        host: process.env.DB_ADDRESS,
        user: process.env.DB_USER,
        password: process.env.DB_PW,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    });
    console.log("Successfully connected to MySQL database.");
}

/**
 * MySQL 데이터베이스에 쿼리 요청을 하는 함수 입니다.
 * @param {String} sql SQL 문자를 입력 받습니다.
 * @param {...String} wildCards PreparedStatement 사용시 와일드 카드 문자들을 입력 받습니다.
 * @returns 쿼리 요청의 결과를 Promise에 담아 반환합니다.
 */
export const query = (sql, ...wildCards) => {
    if(wildCards == undefined) {
        return new Promise((resolve, reject) => {
            pool.query(sql, (error, results, fields) => {
                if(error) {
                    console.error(error);
                    reject(error);
                }
                else {
                    resolve(results);
                }
            });
        });
    }
    else {
        const queries = [];
        while(wildCards.length != 0) {
            let element = wildCards.shift();
            if(typeof element === 'string' || typeof element === 'number') {
                queries.push(element);
            }
            if(typeof element === 'object') {
                for(let index of element) {
                    queries.push(index);
                }
            }
            if(typeof element === 'undefined') {
                queries.push(null);
            }
        }
        // console.log(queries);
        return new Promise((resolve, reject) => {
            pool.query(sql, queries, (error, results, fields) => {
                if(error) {
                    console.error(error);
                    reject(error);
                }
                else {
                    resolve(results);
                }
            });
        });
    }
}


// export default class MySQL {

//     static mysqlConnection;

//     static query(sql) {
//         return new Promise((resolve, reject) => {
//             this.mysqlConnection.query(sql, (error, results, fields) => {
//                 if (error) {
//                     console.log(error);
//                 }
//                 else {
//                     resolve(results);
//                 }
//             });
//         });
//     }

//     static connect() {
//         this.mysqlConnection = mysql.createConnection({
            
//         });
    
//         this.mysqlConnection.connect((err) => {
//             if (err) {
//                 console.log('An error has occurred while connecting to db:', err);
//                 setTimeout(MySQL.connect, 2000);
//             }
//             else {
//                 console.log(`Successfully connected with database.`);
//             }
//         });
    
//         this.mysqlConnection.on('error', (err) => {
//             console.log(`Database disconnected. Try reconnecting...`);
//             MySQL.connect();
//         });
//     }

    
// }