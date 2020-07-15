import mysql from "mysql2/promise"
import config from "../../config/config.json"

class MySQL {
    constructor() {
        this.connection = mysql.createPool({
            host:"localhost",
            user: config.MYSQL_USERNAME,
            password: config.MYSQL_PASSWORD,
            database: config.MYSQL_DB,
            connectionLimit:10,
            waitForConnections:true,
            queueLimit:0
        })
    }
    
}

export default MySQL