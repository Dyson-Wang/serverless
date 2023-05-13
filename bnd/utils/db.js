const mysql = require('mysql');

const getConnectionFromRemoteDatabase = (host, username, password, port, database) => {
    var connection = mysql.createConnection({
        host: host,
        user: username,
        password: password,
        database: database,
        port: port
    })

    return connection;
}

module.exports = getConnectionFromRemoteDatabase;