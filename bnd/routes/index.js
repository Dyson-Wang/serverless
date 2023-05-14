var express = require('express');
var router = express.Router();
var vmFunc = require('../utils/vm.js')
var { writeDataToNewFileSync, readFileSyncToData, writeDataToTestFileSync } = require('../utils/file.js')
var genCryptoRandomString = require('../utils/rand.js')
var jwt = require('jsonwebtoken')
var child_process = require('child_process');
var dbcon = require('../utils/db.js')
var { serveruri } = require('../utils/server.js')

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

// main 数据展示
router.get('/main', function (req, res, next) {
  req.app.locals.pool.getConnection((error, connection) => {
    if (error) {
      res.status(200)
      res.send({ status: 'fail', message: error })
      return
    }
    connection.query(`SELECT * FROM totalinfo WHERE no = 1`, (e, r, f) => {
      if (e) {
        res.status(200)
        res.send({ status: 'fail', message: e })
        connection.release()
        return
      }
      res.status(200)
      res.send({ status: 'ok', message: r })
      connection.release()
    })
  })
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
  var stdout
  try {
    stdout = child_process.execSync(`eslint ./src/faas/${funcname}/func.js`);
    console.log(stdout.toLocaleString())
  } catch (error) {
    var stdstr = error.stdout.toLocaleString()
    res.status(200)
    res.send({
      status: 'fail', message: {
        esl: stdstr.slice(stdstr.indexOf(funcname)),
        vm: 'sleeping'
      }
    })
    return
  }

  // scan obj
  if (scanobj == undefined) {
    scanobj = {}
  } else if (scanobj != undefined) {
    try {
      scanobj = JSON.parse(scanobj)
    } catch (error) {
      res.status(200)
      res.send({
        status: 'fail', message: {
          esl: stdout.toLocaleString(),
          vm: '输入对象格式不正确！'
        }
      })
      return
    }
  }

  var vm
  try {
    vm = vmFunc(code, scanobj, maxruntime)
  } catch (error) {
    res.status(200)
    res.send({
      status: 'fail', message: {
        esl: stdout.toLocaleString(),
        vm: error.toLocaleString()
      }
    })
    return
  }

  req.app.locals.pool.getConnection((error, connection) => {
    if (error) {
      res.status(200)
      res.send({ status: 'fail', massage: error })
      return
    };
    let date = new Date();
    let dateString = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
    connection.query(`INSERT INTO faasinfo(faasname, namespace, owner, createtime, invoketimes) VALUES ('${funcname}', '${namespace}', '${browserid}', '${dateString}', ${0})`, (error, results, fields) => {
      if (error) {
        res.status(200)
        res.send({ status: 'fail', massage: error })
        connection.release()
        return
      }
      res.status(200);
      res.send({ status: 'ok', vm, funcurl: `${serveruri}/faas/${funcname}` })
      connection.query(`UPDATE totalinfo SET fscount = fscount + 1 WHERE no = 1;`, () => connection.release())
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
      res.send({ status: 'fail', message: err })
      return
    }
    connection.query(`DELETE FROM faasinfo WHERE faasname like '${funcname}' AND namespace LIKE '${namespace}'`, (error, results, fields) => {
      if (error) {
        res.status(200);
        res.send({ status: 'fail', message: error })
        connection.release();
        return
      }
      res.status(200);
      res.send({ status: 'ok' })
      connection.query(`UPDATE totalinfo SET fscount = fscount - 1 WHERE no = 1;`, () => connection.release())
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
        results[i].url = `${serveruri}/faas/${funcname}`
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
  writeDataToTestFileSync(code, funcname, { funcname, namespace, method, maxruntime, comments, scanobj });

  var stdout
  // ESLint
  try {
    stdout = child_process.execSync(`eslint ./src/faas/${funcname}/test/func.js`);
    console.log(stdout.toLocaleString())
  } catch (error) {
    var stdstr = error.stdout.toLocaleString()
    res.status(200)
    res.send({
      status: 'fail', message: {
        esl: stdstr.slice(stdstr.indexOf(funcname)),
        vm: 'sleeping'
      }
    })
    return
  }

  // scan obj
  if (scanobj == undefined) {
    scanobj = {}
  } else if (scanobj != undefined) {
    try {
      scanobj = JSON.parse(scanobj)
    } catch (error) {
      res.status(200)
      res.send({
        status: 'fail', message: {
          esl: stdout.toLocaleString(),
          vm: '输入对象格式不正确！'
        }
      })
      return
    }
  }

  var vm
  try {
    vm = vmFunc(code, scanobj, maxruntime)
  } catch (error) {
    res.status(200)
    res.send({
      status: 'fail', message: {
        esl: stdout.toLocaleString(),
        vm: error.toLocaleString()
      }
    })
    return
  }

  res.status(200);
  res.send({ status: 'ok', vm, funcurl: `${serveruri}/faas/${funcname}` })
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
    if (err) {
      res.status(200);
      res.send({ status: 'fail', message: err })
      return
    };
    connection.query(`INSERT INTO namespace(owner, namespace, createtime) VALUES ('${req.app.locals.decoded.browserid}', '${req.body.namespace}', '${dateString}')`, (error, results, fields) => {
      if (error) {
        res.status(200)
        res.send({ status: 'fail', message: error })
        connection.release();
        return
      };
      res.status(200)
      res.send({ status: 'ok', message: results });
      connection.query(`UPDATE totalinfo SET nscount = nscount + 1 WHERE no = 1;`, () => connection.release())
    })
  })
});

// 删除命名空间 POST
router.post('/delns', (req, res, next) => {
  const { namespace } = req.body;
  const { browserid } = req.app.locals.decoded

  req.app.locals.pool.getConnection((err, connection) => {
    if (err) {
      res.status(200);
      res.send({ status: 'fail', message: err })
      return
    }
    connection.query(`DELETE FROM faasinfo WHERE owner LIKE '${browserid}' AND namespace LIKE '${namespace}'`, (error, results, fields) => {
      if (error) {
        res.status(200);
        res.send({ status: 'fail', message: error })
        connection.release();
        return
      }
      connection.query(`DELETE FROM namespace WHERE owner LIKE '${browserid}' AND namespace LIKE '${namespace}'`, (e, r, f) => {
        if (e) {
          res.status(200);
          res.send({ status: 'func del success but namespace del fail. please try again.', message: e })
          connection.release();
          return
        }
        res.status(200);
        res.send({ status: 'ok' })
        connection.query(`UPDATE totalinfo SET nscount = nscount - 1, fscount = fscount - ${results.affectedRows} WHERE no = 1;`, () => connection.release())
      })
    })
  })
})

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

router.post('/dbmod', (req, res, next) => {
  const { username, password, host, port, database, option, namespace } = req.body;
  const browserid = req.app.locals.decoded.browserid;
  req.app.locals.pool.getConnection((err, connection) => {
    if (err) {
      res.send(err)
      return
    };
    connection.query(`UPDATE namespace SET dbusername = '${username}', dbpassword = '${password}', dbhost = '${host}', dbname = '${database}', dbport = ${port} WHERE namespace LIKE '${namespace}' AND owner LIKE '${browserid}'`, (error, results, fields) => {
      if (error) {
        res.send(error)
        return
      };
      res.send(results);
      connection.release();
    })
  })
})

module.exports = router;