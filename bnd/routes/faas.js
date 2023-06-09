var express = require('express');
var router = express.Router();
var { readFileSyncToData } = require('../utils/file');
const vmFunc = require('../utils/vm');
var getConnectionFromRemote = require('../utils/db')


router.get('/:id', function (req, res, next) {
  var o = readFileSyncToData(req.params.id);
  var option = JSON.parse(o.confjson)

  if (option.method != "GET") {
    res.send('unsupport method')
    req.app.locals.pool.getConnection((err, connection) => {
      connection.query(`UPDATE totalinfo SET httpget = httpget + 1, totalfail = totalfail + 1 WHERE no = 1`)
      connection.query(`UPDATE faasinfo SET invoketimes = invoketimes + 1 WHERE faasname like '${req.params.id}'`)
      connection.release()
    })
    return
  }
  var stdw = (v) => {
    try {
      switch (typeof (v)) {
        case 'string':
          if (res.locals.isResponsed == true) return
          res.locals.isResponsed = true;
          res.status(200).send(v)
          break;
        case 'object':
          if (res.locals.isResponsed == true) return
          res.locals.isResponsed = true;
          Buffer.isBuffer(v) ? res.status(200).send(v) : res.status(200).send(JSON.stringify(v))
          break
        default:
          if (res.locals.isResponsed == true) return
          res.locals.isResponsed = true;
          res.status(400).send('incorrect params!')
          break;
      }
    } catch (error) {
    }
  }

  req.app.locals.pool.getConnection((err, connection) => {
    connection.query(`select dbusername, dbpassword, dbhost, dbname, dbport from namespace, faasinfo where faasname like '${req.params.id}' and faasinfo.namespace = namespace.namespace and faasinfo.owner = namespace.owner`, (e, r, f) => {
      if (r[0].dbusername == undefined) {
        var result
        try {
          setTimeout(() => {
            // throw new Error('Execute function time out!')
            if (res.locals.isResponsed == true) return
            res.locals.isResponsed = true;
            res.status(400).send('Execute function time out!').end()
            connection.query(`UPDATE totalinfo SET httpget = httpget + 1, totalfail = totalfail + 1 WHERE no = 1`)
            connection.query(`UPDATE faasinfo SET invoketimes = invoketimes + 1 WHERE faasname like '${req.params.id}'`)
            connection.release()
          }, option.maxruntime)
          result = vmFunc(o.funcjs, { stdw }, option.maxruntime);
          connection.query(`UPDATE totalinfo SET httpget = httpget + 1, totalsc = totalsc + 1 WHERE no = 1`)
          connection.query(`UPDATE faasinfo SET invoketimes = invoketimes + 1 WHERE faasname like '${req.params.id}'`)
          connection.release()
        } catch (error) {
          if (res.locals.isResponsed == true) return
          res.locals.isResponsed = true;
          res.status(400)
          res.send('fail to run this function ! ' + error.toLocaleString())
          connection.query(`UPDATE totalinfo SET httpget = httpget + 1, totalfail = totalfail + 1 WHERE no = 1`)
          connection.query(`UPDATE faasinfo SET invoketimes = invoketimes + 1 WHERE faasname like '${req.params.id}'`)
          connection.release()
          return
        }
      } else {
        var config = r[0]
        var mysql = getConnectionFromRemote(config.dbhost, config.dbusername, config.dbpassword, config.dbport, config.dbname)
        var result
        connection.query(`UPDATE totalinfo SET sqlservice = sqlservice + 1 WHERE no = 1`)
        try {
          setTimeout(() => {
            // throw new Error('Execute function time out!')
            if (res.locals.isResponsed == true) return
            res.locals.isResponsed = true;
            res.status(400).send('Execute function time out!').end()
            connection.query(`UPDATE totalinfo SET httpget = httpget + 1, totalfail = totalfail + 1 WHERE no = 1`)
            connection.query(`UPDATE faasinfo SET invoketimes = invoketimes + 1 WHERE faasname like '${req.params.id}'`)
            connection.release()
          }, option.maxruntime)
          result = vmFunc(o.funcjs, { mysql, stdw }, option.maxruntime);
          connection.query(`UPDATE totalinfo SET httpget = httpget + 1, totalsc = totalsc + 1 WHERE no = 1`)
          connection.query(`UPDATE faasinfo SET invoketimes = invoketimes + 1 WHERE faasname like '${req.params.id}'`)
          connection.release()
        } catch (error) {
          if (res.locals.isResponsed == true) return
          res.locals.isResponsed = true;
          res.status(400)
          res.send('fail to run this function ! ' + error.toLocaleString())
          connection.query(`UPDATE totalinfo SET httpget = httpget + 1, totalfail = totalfail + 1 WHERE no = 1`)
          connection.query(`UPDATE faasinfo SET invoketimes = invoketimes + 1 WHERE faasname like '${req.params.id}'`)
          connection.release()
          return
        }
      }
    })
  })


});

router.post('/:id', function (req, res, next) {
  var o = readFileSyncToData(req.params.id);
  const data = req.body == undefined ? {} : req.body
  var option = JSON.parse(o.confjson)
  if (option.method != "POST") {
    res.send('unsupport method')
    req.app.locals.pool.getConnection((err, connection) => {
      if (err) {
        res.status(500).send('server error')
        return
      }
      connection.query(`UPDATE totalinfo SET httpget = httpget + 1, totalfail = totalfail + 1 WHERE no = 1`)
      connection.query(`UPDATE faasinfo SET invoketimes = invoketimes + 1 WHERE faasname like '${req.params.id}'`)
      connection.release()
    })
    return
  }

  req.app.locals.pool.getConnection((err, connection) => {
    if (err) {
      res.status(500).send('server error')
      return
    }
    var stdw = (v) => {
      try {
        switch (typeof (v)) {
          case 'string':
            if (res.locals.isResponsed == true) return
            res.locals.isResponsed = true;
            res.status(200).send(v)
            break;
          case 'object':
            if (res.locals.isResponsed == true) return
            res.locals.isResponsed = true;
            Buffer.isBuffer(v) ? res.status(200).send(v) : res.status(200).send(JSON.stringify(v))
            break
          default:
            if (res.locals.isResponsed == true) return
            res.locals.isResponsed = true;
            res.status(400).send('incorrect params!')
            break;
        }
      } catch (error) {

      }
    }
    connection.query(`select dbusername, dbpassword, dbhost, dbname, dbport from namespace, faasinfo where faasname like '${req.params.id}' and faasinfo.namespace = namespace.namespace and faasinfo.owner = namespace.owner`, (e, r, f) => {
      if (r[0].dbusername == undefined) {
        var result
        try {
          setTimeout(() => {
            // throw new Error('Execute function time out!')
            if (res.locals.isResponsed == true) return
            res.locals.isResponsed = true;
            res.status(400).send('Execute function time out!').end()
            connection.query(`UPDATE totalinfo SET httppost = httppost + 1, totalfail = totalfail + 1 WHERE no = 1`)
            connection.query(`UPDATE faasinfo SET invoketimes = invoketimes + 1 WHERE faasname like '${req.params.id}'`)
            connection.release()
          }, option.maxruntime)
          result = vmFunc(o.funcjs, { ...data, stdw }, option.maxruntime);
          connection.query(`UPDATE totalinfo SET httppost = httppost + 1, totalsc = totalsc + 1 WHERE no = 1`)
          connection.query(`UPDATE faasinfo SET invoketimes = invoketimes + 1 WHERE faasname like '${req.params.id}'`)
          connection.release()
        } catch (error) {
          if (res.locals.isResponsed == true) return
          res.locals.isResponsed = true;
          res.status(400)
          res.send('fail to run this function ! ' + error.toLocaleString())
          connection.query(`UPDATE totalinfo SET httppost = httppost + 1, totalfail = totalfail + 1 WHERE no = 1`)
          connection.query(`UPDATE faasinfo SET invoketimes = invoketimes + 1 WHERE faasname like '${req.params.id}'`)
          connection.release()
          return
        }
      } else {
        var config = r[0]
        var mysql = getConnectionFromRemote(config.dbhost, config.dbusername, config.dbpassword, config.dbport, config.dbname)
        connection.query(`UPDATE totalinfo SET sqlservice = sqlservice + 1 WHERE no = 1`)
        var result
        try {
          setTimeout(() => {
            // throw new Error('Execute function time out!')
            if (res.locals.isResponsed == true) return
            res.locals.isResponsed = true;
            res.status(400).send('Execute function time out!').end()
            connection.query(`UPDATE totalinfo SET httppost = httppost + 1, totalfail = totalfail + 1 WHERE no = 1`)
            connection.query(`UPDATE faasinfo SET invoketimes = invoketimes + 1 WHERE faasname like '${req.params.id}'`)
            connection.release()
          }, option.maxruntime)
          result = vmFunc(o.funcjs, { ...data, mysql, stdw }, option.maxruntime);
          connection.query(`UPDATE totalinfo SET httppost = httppost + 1, totalsc = totalsc + 1 WHERE no = 1`)
          connection.query(`UPDATE faasinfo SET invoketimes = invoketimes + 1 WHERE faasname like '${req.params.id}'`)
          connection.release()
        } catch (error) {
          if (res.locals.isResponsed == true) return
          res.locals.isResponsed = true;
          res.status(400)
          res.send('fail to run this function ! ' + error.toLocaleString())
          connection.query(`UPDATE totalinfo SET httppost = httppost + 1, totalfail = totalfail + 1 WHERE no = 1`)
          connection.query(`UPDATE faasinfo SET invoketimes = invoketimes + 1 WHERE faasname like '${req.params.id}'`)
          connection.release()
          return
        }
      }
    })
  })

})

module.exports = router;
