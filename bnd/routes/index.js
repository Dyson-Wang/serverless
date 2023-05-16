var express = require('express');
var router = express.Router();
var vmFunc = require('../utils/vm.js')
var { writeDataToNewFileSync, readFileSyncToData, writeDataToTestFileSync, rmDirRecursiveSync } = require('../utils/file.js')
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
    connection.query(`SELECT * FROM faasinfo`, (error, vms, fields) => {
      if (error) {
        res.status(500).send([])
        return
      }
      for (let i = 0; i < vms.length; i++) {
        vms[i].createtime = vms[i].createtime.toLocaleString()
      }
      connection.release();
      if (error) {
        console.log(error)
      }
      res.send(vms);
    })
  })
});

// 添加函数 POST
router.post('/addfunc', (req, res, next) => {
  const { funcname, namespace, method, maxruntime, code, comments } = req.body;
  const { browserid } = req.app.locals.decoded
  var { scanobj } = req.body

  // scan obj
  if (scanobj == undefined) {
    scanobj = {}
  } else if (typeof (scanobj) == 'object') {

  } else if (scanobj != undefined) {
    try {
      if (typeof (scanobj) != 'string') throw new Error
      if (scanobj.charAt(0) != '{' || scanobj.charAt(scanobj.length - 1) != '}') throw new Error
      scanobj = (new Function("return " + scanobj))()
      console.log(scanobj)
    } catch (error) {
      res.status(200)
      res.send({
        status: 'fail', message: {
          esl: '输入对象格式不正确！',
          vm: 'sleeping'
        }
      })
      return
    }
  }

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

  if (!code.includes('glob.stdw(')) {
    res.status(200)
    res.send({
      status: 'fail', message: {
        esl: stdout.toLocaleString(),
        vm: '没有返回值: 函数未调用global.stdw()标准输出流函数！'
      }
    })
    return
  }

  req.app.locals.pool.getConnection((err, connection) => {
    if (err) {
      res.status(200)
      res.send({
        status: 'fail', message: {
          esl: stdout.toLocaleString(),
          vm: err.toLocaleString()
        }
      })
      return
    };
    connection.query(`select dbusername, dbpassword, dbhost, dbname, dbport from namespace where namespace like '${namespace}' and owner like '${browserid}'`, (e, r, f) => {
      var stdw = (v) => {
        let date = new Date();
        let dateString = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
        switch (typeof (v)) {
          case 'string':
            connection.query(`INSERT INTO faasinfo(faasname, namespace, owner, createtime, invoketimes) VALUES ('${funcname}', '${namespace}', '${browserid}', '${dateString}', ${0})`, (error, vms, fields) => {
              try {
                if (error) {
                  res.status(200)
                  res.send({
                    status: 'fail', massage: {
                      esl: stdout.toLocaleString(),
                      vm: error
                    }
                  })
                  connection.release()
                  return
                }
                res.status(200);
                res.send({ status: 'ok', vm: v, funcurl: `${serveruri}/faas/${funcname}` })
                connection.query(`UPDATE totalinfo SET fscount = fscount + 1 WHERE no = 1;`, () => connection.release())
              } catch (error) {
                console.log(error)
              }
            })
            break;
          case 'object':
            connection.query(`INSERT INTO faasinfo(faasname, namespace, owner, createtime, invoketimes) VALUES ('${funcname}', '${namespace}', '${browserid}', '${dateString}', ${0})`, (error, vms, fields) => {
              try {
                if (error) {
                  res.status(200)
                  res.send({
                    status: 'fail', massage: {
                      esl: stdout.toLocaleString(),
                      vm: error
                    }
                  })
                  connection.release()
                  return
                }
                res.status(200);
                res.send({ status: 'ok', vm: Buffer.isBuffer(v) ? v : JSON.stringify(v), funcurl: `${serveruri}/faas/${funcname}` })
                connection.query(`UPDATE totalinfo SET fscount = fscount + 1 WHERE no = 1;`, () => connection.release())
              } catch (error) {
                console.log(error)
              }
            })
            break;
          default:
            res.send({
              status: 'fail', message: {
                esl: stdout.toLocaleString(),
                vm: 'global.stdw函数的调用值必须为string或者buffer'
              }
            })
            connection.release()
            break;
        }
      }
      if (r[0].dbusername == undefined) {
        try {
          setTimeout(() => {
            res.status(200)
            res.send({
              status: 'fail', message: {
                esl: stdout.toLocaleString(),
                vm: 'Execute function time out!'
              }
            }).end()
            connection.release()
            // throw new Error('Execute function time out!')
          }, maxruntime)
          vmFunc(code, { ...scanobj, stdw }, maxruntime);
        } catch (error) {
          res.status(200)
          res.send({
            status: 'fail', message: {
              esl: stdout.toLocaleString(),
              vm: error.toLocaleString()
            }
          })
          connection.release()
          return
        }
      } else {
        var config = r[0]
        var mysql = dbcon(config.dbhost, config.dbusername, config.dbpassword, config.dbport, config.dbname)
        try {
          setTimeout(() => {
            res.status(200)
            res.send({
              status: 'fail', message: {
                esl: stdout.toLocaleString(),
                vm: 'Execute function time out!'
              }
            }).end()
            connection.release()
            // throw new Error('Execute function time out!')
          }, maxruntime)
          vmFunc(code, { ...scanobj, mysql, stdw }, maxruntime);
        } catch (error) {
          res.status(200)
          res.send({
            status: 'fail', message: {
              esl: stdout.toLocaleString(),
              vm: error.toLocaleString()
            }
          })
          connection.release()
          return
        }
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
      res.send({ status: 'fail', message: err })
      return
    }
    connection.query(`DELETE FROM faasinfo WHERE faasname like '${funcname}' AND namespace LIKE '${namespace}'`, (error, vms, fields) => {
      if (error) {
        res.status(200);
        res.send({ status: 'fail', message: error })
        connection.release();
        return
      }
      res.status(200);
      res.send({ status: 'ok' })
      rmDirRecursiveSync(funcname);
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
    connection.query(`SELECT * FROM faasinfo WHERE faasname LIKE '${funcname}'`, (error, vms, fields) => {
      if (error) {
        res.status(200);
        res.send({ status: 'fail' })
        console.log(error)
        connection.release();
        return
      }
      const { funcjs, confjson } = readFileSyncToData(funcname);
      for (let i = 0; i < vms.length; i++) {
        vms[i].code = funcjs
        vms[i].config = JSON.parse(confjson)
        vms[i].createtime = vms[i].createtime.toLocaleString()
        vms[i].url = `${serveruri}/faas/${funcname}`
      }
      res.status(200);
      res.send(vms);
      connection.release();
    })
  })
});

// 修改函数 POST
router.post('/modfunc', (req, res, next) => {
  const { funcname, namespace, method, maxruntime, code, comments } = req.body;
  const { browserid } = req.app.locals.decoded
  var { scanobj } = req.body

  // scan obj
  if (scanobj == undefined) {
    scanobj = {}
  } else if (typeof (scanobj) == 'object') {

  } else if (scanobj != undefined) {
    try {
      if (typeof (scanobj) != 'string') throw new Error
      scanobj = JSON.parse(scanobj)
      console.log(scanobj)
    } catch (error) {
      res.status(200)
      res.send({
        status: 'fail', message: {
          esl: '输入对象格式不正确！',
          vm: 'sleeping'
        }
      })
      return
    }
  }

  // fs
  writeDataToTestFileSync(code, funcname, { funcname, namespace, method, maxruntime, comments, scanobj });

  var stdout
  // ESLint
  try {
    stdout = child_process.execSync(`eslint ./src/faas/${funcname}/test/func.js`);
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

  if (!code.includes('glob.stdw(')) {
    res.status(200)
    res.send({
      status: 'fail', message: {
        esl: stdout.toLocaleString(),
        vm: '没有返回值: 函数未调用global.stdw()标准输出流函数！'
      }
    })
    return
  }

  req.app.locals.pool.getConnection((err, connection) => {
    connection.query(`select dbusername, dbpassword, dbhost, dbname, dbport from namespace, faasinfo where faasname like '${funcname}' and faasinfo.namespace = namespace.namespace and faasinfo.owner = namespace.owner`, (e, r, f) => {
      var stdw = (v) => {
        try {
          switch (typeof (v)) {
            case 'string':
              writeDataToNewFileSync(code, funcname, { funcname, namespace, method, maxruntime, comments, scanobj });
              if (res.locals.isResponsed == true) return
              res.locals.isResponsed = true;
              res.send({ status: 'ok', vm: v, funcurl: `${serveruri}/faas/${funcname}` })
              connection.release()
              break;
            case 'object':
              writeDataToNewFileSync(code, funcname, { funcname, namespace, method, maxruntime, comments, scanobj });
              if (res.locals.isResponsed == true) return
              res.locals.isResponsed = true;
              res.send({ status: 'ok', vm: Buffer.isBuffer(v) ? v : JSON.stringify(v), funcurl: `${serveruri}/faas/${funcname}` })
              connection.release()
              break;
            default:
              if (res.locals.isResponsed == true) return
              res.locals.isResponsed = true;
              res.send({
                status: 'fail', message: {
                  esl: stdout.toLocaleString(),
                  vm: 'global.stdw函数的调用值必须为string或者buffer'
                }
              })
              connection.release()
              break;
          }
        } catch (error) {

        }
      }
      if (r[0].dbusername == undefined) {
        try {
          setTimeout(() => {
            if (res.locals.isResponsed == true) return
            res.locals.isResponsed = true;
            res.status(200)
            res.send({
              status: 'fail', message: {
                esl: stdout.toLocaleString(),
                vm: 'Execute function time out!'
              }
            }).end()
            connection.release()
            // throw new Error('Execute function time out!')
          }, maxruntime)
          vmFunc(code, { ...scanobj, stdw }, maxruntime);
        } catch (error) {
          if (res.locals.isResponsed == true) return
          res.locals.isResponsed = true;
          res.status(200)
          res.send({
            status: 'fail', message: {
              esl: stdout.toLocaleString(),
              vm: error.toLocaleString()
            }
          }).end()
          connection.release()
          return
        }
      } else {
        var config = r[0]
        var mysql = dbcon(config.dbhost, config.dbusername, config.dbpassword, config.dbport, config.dbname)
        try {
          setTimeout(() => {
            if (res.locals.isResponsed == true) return
            res.locals.isResponsed = true;
            res.status(200)
            res.send({
              status: 'fail', message: {
                esl: stdout.toLocaleString(),
                vm: 'Execute function time out!'
              }
            }).end()
            connection.release()
            // throw new Error('Execute function time out!')
          }, maxruntime)
          vmFunc(code, { ...scanobj, mysql, stdw }, maxruntime);
        } catch (error) {
          if (res.locals.isResponsed == true) return
          res.locals.isResponsed = true;
          res.status(200)
          res.send({
            status: 'fail', message: {
              esl: stdout.toLocaleString(),
              vm: error.toLocaleString()
            }
          }).end()
          connection.release()
          return
        }
      }
    })
  })
})

// 请求命名空间
router.get('/namespace', function (req, res, next) {
  req.app.locals.pool.getConnection((err, connection) => {
    if (err) throw err;
    connection.query(`SELECT * FROM namespace WHERE owner LIKE '${req.app.locals.decoded.browserid}'`, (error, vms, fields) => {
      for (let i = 0; i < vms.length; i++) {
        vms[i].createtime = vms[i].createtime.toLocaleString()
      }
      res.send(vms);
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
    connection.query(`INSERT INTO namespace(owner, namespace, createtime) VALUES ('${req.app.locals.decoded.browserid}', '${req.body.namespace}', '${dateString}')`, (error, vms, fields) => {
      if (error) {
        res.status(200)
        res.send({ status: 'fail', message: error })
        connection.release();
        return
      };
      res.status(200)
      res.send({ status: 'ok', message: vms });
      connection.query(`UPDATE totalinfo SET nscount = nscount + 1 WHERE no = 1`, () => connection.release())
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
    connection.query(`SELECT faasname FROM faasinfo WHERE owner LIKE '${browserid}' AND namespace LIKE '${namespace}'`, (error, vms, fields) => {
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
        connection.query(`DELETE FROM faasinfo WHERE owner LIKE '${browserid}' AND namespace LIKE '${namespace}'`, () => { })
        connection.query(`UPDATE totalinfo SET nscount = nscount - 1, fscount = fscount - ${vms.length} WHERE no = 1;`, () => connection.release())
        for (let index = 0; index < vms.length; index++) {
          const element = vms[index].faasname;
          console.log(element)
          rmDirRecursiveSync(element)
        }
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
    connection.query(`UPDATE namespace SET dbusername = '${username}', dbpassword = '${password}', dbhost = '${host}', dbname = '${database}', dbport = ${port} WHERE namespace LIKE '${namespace}' AND owner LIKE '${browserid}'`, (error, vms, fields) => {
      if (error) {
        res.send(error)
        return
      };
      res.send(vms);
      connection.release();
    })
  })
})

module.exports = router;