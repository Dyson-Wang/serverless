var express = require('express');
var router = express.Router();
var vmFunc = require('../utils/vm.js')
var { writeDataToNewFileSync, readFileSyncToData, writeDataToFileSync } = require('../utils/file.js')
var genCryptoRandomString = require('../utils/rand.js')
var jwt = require('jsonwebtoken')
var child_process = require('child_process');
var dbcon = require('../utils/db.js')

// 根
router.get('/', function (req, res, next) {
  res.send('Welcome Express :)');
});

// 登录获取browsertoken
router.post('/login', function (req, res, next) {
  let token = jwt.sign({
    browserid: req.body.browserid
  }, 'expresswithserverless', {
    algorithm: 'HS256'
  })
  res.send({ token: token });
});

// 获得随机函数名 16位
router.get('/randomfuncname', (req, res, next) => {
  res.end(genCryptoRandomString(16))
})

// 所有函数列表
router.get('/funclist', function (req, res, next) {
  req.app.locals.pool.getConnection((err, connection) => {
    if (err) console.log(err);
    connection.query(`SELECT * FROM faasInfo`, (error, results, fields) => {
      for (let i = 0; i < results.length; i++) {
        results[i].createtime = results[i].createtime.toLocaleString()
      }
      connection.release();
      if (error) {
        console.log(error)
      }
      res.send(results);
    })
  })
});

// 添加函数 POST
router.post('/addfunc', (req, res, next) => {
  const { funcname, namespace, method, maxruntime, code, comments, scanobj } = req.body;
  const { browserid } = req.app.locals.decoded

  // fs
  writeDataToNewFileSync(code, funcname, { funcname, namespace, method, maxruntime, comments, scanobj });

  // ESLint
  try {
    var stdout = child_process.execSync(`eslint ./src/faas/${funcname}/func.js`);
    console.log(stdout.toLocaleString())
  } catch (error) {
    console.log(error.stdout.toLocaleString())
  }

  // scan obj
  console.log(vmFunc(code, scanobj))

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

// 删除函数 POST
router.post('/delfunc', (req, res, next) => {
  const { funcname, namespace } = req.body;
  const { browserid } = req.app.locals.decoded

  req.app.locals.pool.getConnection((err, connection) => {
    if (err) {
      res.status(200);
      res.send({ status: 'fail' })
      console.log(err)
      return
    }
    connection.query(`DELETE FROM faasinfo WHERE faasname like '${funcname}' AND namespace LIKE '${namespace}'`, (error, results, fields) => {
      if (error) {
        res.status(200);
        res.send({ status: 'fail' })
        console.log(error)
        connection.release();
        return
      }
      res.status(200);
      res.send({ status: 'ok' })
      connection.release();
    })
  })
})

// 获取函数详情
router.get('/config/:namespace/:id', function (req, res, next) {
  const funcname = req.params.id,
    namespace = req.params.namespace,
    browserid = req.app.locals.decoded.browserid
  req.app.locals.pool.getConnection((err, connection) => {
    if (err) {
      res.status(200);
      res.send({ status: 'fail' })
      console.log(err)
      return
    }
    connection.query(`SELECT * FROM faasinfo WHERE faasname LIKE '${funcname}'`, (error, results, fields) => {
      if (error) {
        res.status(200);
        res.send({ status: 'fail' })
        console.log(error)
        connection.release();
        return
      }
      const { funcjs, confjson } = readFileSyncToData(funcname);
      for (let i = 0; i < results.length; i++) {
        results[i].code = funcjs
        results[i].config = JSON.parse(confjson)
        results[i].createtime = results[i].createtime.toLocaleString()
      }
      res.status(200);
      res.send(results);
      connection.release();
    })
  })
});

// 修改函数 POST
router.post('/modfunc', (req, res, next) => {
  const { funcname, namespace, method, maxruntime, code, comments, scanobj } = req.body;
  const { browserid } = req.app.locals.decoded

  // fs
  writeDataToFileSync(code, funcname, { funcname, namespace, method, maxruntime, comments, scanobj });

  // ESLint
  try {
    var stdout = child_process.execSync(`eslint ./src/faas/${funcname}/func.js`);
    console.log(stdout.toLocaleString())
  } catch (error) {
    console.log(error.stdout.toLocaleString())
  }

  // scan obj
  console.log(vmFunc(code, scanobj))

  res.status(200)
  res.send('ok')
})

// 请求命名空间
router.get('/namespace', function (req, res, next) {
  req.app.locals.pool.getConnection((err, connection) => {
    if (err) throw err;
    connection.query(`SELECT * FROM namespace WHERE owner LIKE '${req.app.locals.decoded.browserid}'`, (error, results, fields) => {
      for (let i = 0; i < results.length; i++) {
        results[i].createtime = results[i].createtime.toLocaleString()
      }
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

// db post test
router.post('/dbtest', (req, res, next) => {
  const { username, password, host, port, database, option } = req.body;
  dbcon(host, username, password, port, database).connect((err) => {
    if (err) {
      res.status(200)
      res.send({ message: 'fail' })
      return
    }
    res.status(200)
    res.send({ message: 'ok' })
  });
})

// db modify
/*
新建命名空间的数据库配置 可选
修改命名空间的数据库配置
将eslint vm返回的错误 提示用户
首页一些数据展示的api 命名空间数、函数、HTTP GET POST、总成功总失败、数据库连接次数 不需要token
*/
// 


module.exports = router;
