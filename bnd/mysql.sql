-- user express
-- password express123faas
-- database express

CREATE USER express IDENTIFIED BY 'express123faas';
GRANT all ON express.* TO 'express'@'%';
ALTER USER 'express'@'%' IDENTIFIED WITH mysql_native_password BY 'express123faas';
flush privileges;

CREATE DATABASE express;
USE express;
CREATE TABLE faasInfo(faasName char(16) primary key, owner char(32), namespace varchar(255), createTime timestamp, invokeTimes int);