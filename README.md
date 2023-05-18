# Serverless

这个是一个基于Node.js的创建函数API的项目，使用的数据库是mysql\mariadb，数据库sql在bnd文件夹下。

部署到服务器上的话更改以下三个文件的ip地址：

```
./bnd/utils/server.js
./fhe/package.json proxy
./fhe/utils/axios.js
```
