var express = require('express');
var router = express.Router();
var vmFunc = require('../utils/vm.js')
var { writeDataToNewFileSync } = require('../utils/file.js')
var genCryptoRandomString = require('../utils/rand.js')

router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' })
});

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
  const { code, author, namespace } = req.body;

  var funcName = genCryptoRandomString(16);
  writeDataToNewFileSync(code, funcName);
  req.app.locals.pool.getConnection((err, connection) => {
    if (err) throw err;
    let date = new Date();
    let dateString = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
    connection.query(`INSERT INTO faasInfo(faasName, owner, namespace, createTime, invokeTimes) values('${funcName}', '${author}', '${namespace}', '${dateString}', ${0})`, (error, results, fields) => {
      console.log(results);
      connection.release();
      if (error) {
        console.log(error)
      }
    })
  })
  res.send(`http://127.0.0.1:8080/faas/${funcName}`)
})

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

router.get('/funclist/:namespaceid', function (req, res, next) {
  var params = req.params;
  res.render('tips', { title: 'Express', text: `这是ID为${params.namespaceid}的函数页` });
});

module.exports = router;
