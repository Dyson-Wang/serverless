-- user express
-- password express123faas
-- database express

show databases;
create database express;
use express;
show tables;
create user express identified by 'express123faas';
grant all on express.* to 'express'@'%';
ALTER USER 'express'@'%' IDENTIFIED WITH mysql_native_password BY 'express123faas';
flush privileges;


USE express;
SET SQL_SAFE_UPDATES = 0;
create table faasinfo(
faasname char(16) primary key,
namespace varchar(255) not null,
owner char(32) not null,
createtime timestamp,
invoketimes int default 0
);
create table namespace(
owner char(32) not null,
namespace varchar(255) not null,
createtime timestamp not null,
dbusername varchar(255),
dbpassword varchar(255),
primary key(owner, namespace)
);