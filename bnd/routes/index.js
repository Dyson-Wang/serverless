var express = require('express');
var router = express.Router();
var vmFunc = require('../utils/vm.js')
var { writeDataToNewFileSync } = require('../utils/file.js')
var genCryptoRandomString = require('../utils/rand.js')
var jwt = require('jsonwebtoken')

// 根
router.get('/', function (req, res, next) {
  res.end('Welcome Express :)');
});

// jwt
router.post('/login', function (req, res, next) {
  // console.log(req.body)
  let token = jwt.sign({
    browserid: req.body.browserid
  }, 'expresswithserverless', {
    algorithm: 'HS256'
  })
  res.send({ token: token });
});

// 获得随机函数名 16
router.get('/randomfuncname', (req, res, next) => {
  res.end(genCryptoRandomString(16))
})

// 添加函数 POST
router.post('/addfunc', (req, res, next) => {
  const { funcname, namespace, method, maxruntime, code, comments, scanobj } = req.body;
  const { browserid } = req.app.locals.decoded

  writeDataToNewFileSync(code, funcname, { funcname, namespace, method, maxruntime, comments, scanobj });
  req.app.locals.pool.getConnection((err, connection) => {
    if (err) throw err;
    let date = new Date();
    let dateString = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
    connection.query(`INSERT INTO faasinfo(faasname, namespace, owner, createtime, invoketimes) VALUES ('${funcname}', '${namespace}', '${browserid}', '${dateString}', ${0})`, (error, results, fields) => {
      res.status(200);
      res.send({ status: 'ok', funcurl: `http://127.0.0.1:8080/faas/${funcname}` })
      connection.release();
      if (error) {
        console.log(error)
      }
    })
  })
})

// 所有函数列表
router.get('/funclist', function (req, res, next) {
  var data = null;
  req.app.locals.pool.getConnection((err, connection) => {
    if (err) console.log(err);
    connection.query(`SELECT * FROM faasInfo`, (error, results, fields) => {
      data = results;
      connection.release();
      if (error) {
        console.log(error)
      }
      res.send(data);
    })
  })
});

// 根据命名空间请求
router.get('/funclist/:namespaceid', function (req, res, next) {
  res.send(`这是ID为${req.params.namespaceid}的函数页`);
});

// 请求命名空间
router.get('/namespace', function (req, res, next) {
  req.app.locals.pool.getConnection((err, connection) => {
    if (err) throw err;
    connection.query(`SELECT * FROM namespace WHERE owner LIKE '${req.app.locals.decoded.browserid}'`, (error, results, fields) => {
      res.send(results);
      connection.release();
      if (error) console.log(error);
    })
  })
});

// 创建命名空间
router.post('/namespace', function (req, res, next) {
  let date = new Date();
  let dateString = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
  req.app.locals.pool.getConnection((err, connection) => {
    if (err) throw err;
    connection.query(`INSERT INTO namespace(owner, namespace, createtime) VALUES ('${req.app.locals.decoded.browserid}', '${req.body.namespace}', '${dateString}')`, (error, results, fields) => {
      res.send(results);
      connection.release();
      if (error) console.log(error);
    })
  })
});

module.exports = router;
