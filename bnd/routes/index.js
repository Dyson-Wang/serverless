var express = require('express');
var router = express.Router();
var vmFunc = require('../utils/vm.js')
var { writeDataToNewFileSync } = require('../utils/file.js')
var genCryptoRandomString = require('../utils/rand.js')

// 根
router.get('/', function (req, res, next) {
  res.end('Welcome Express :)');
});

router.get('/randomfuncname', (req, res, next) => {
  res.end(genCryptoRandomString(16))
})
// 添加函数 POST
router.post('/addfunc', (req, res, next) => {
  /*
    {
      code:string,
      method:string,
      objScan:object,
      comment:string
    }
  */
  // console.log(req.body.codeStr);
  const {funcname, code, author, namespace } = req.body;

  var funcName = funcname;
  writeDataToNewFileSync(code, funcName);
  req.app.locals.pool.getConnection((err, connection) => {
    if (err) throw err;
    let date = new Date();
    let dateString = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
    connection.query(`INSERT INTO faasinfo(faasname, namespace, createtime, invoketimes) VALUES ('${funcName}', '${namespace}', '${dateString}', ${0})`, (error, results, fields) => {
      res.send(`http://127.0.0.1:8080/faas/${funcName}`)
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
  let owner = 'fffff';
  req.app.locals.pool.getConnection((err, connection) => {
    if (err) throw err;
    connection.query(`SELECT * FROM namespace WHERE owner LIKE '${owner}'`, (error, results, fields) => {
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
    connection.query(`INSERT INTO namespace(owner, namespace, createtime) VALUES ('${req.body.owner}', '${req.body.namespace}', '${dateString}')`, (error, results, fields) => {
      res.send(results);
      connection.release();
      if (error) console.log(error);
    })
  })
});

module.exports = router;
