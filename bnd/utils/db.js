const mysql = require('mysql');

const getConnectionFromRemoteDatabase = (host, username, password, database) => {
    var connection = mysql.createConnection({
        host: host,
        user: username,
        password: password,
        database: database
    })

    return connection;
}

module.exports = getConnectionFromRemoteDatabase;