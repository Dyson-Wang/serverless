var express = require('express');
var router = express.Router();
var { readFileSyncToData } = require('../utils/file');
const vmFunc = require('../utils/vm');

router.get('/:id', function (req, res, next) {
  var o = readFileSyncToData(req.params.id);
  var option = JSON.parse(o.confjson)

  if (option.method != "GET") {
    res.send('unsupport method')
    return
  }

  var result
  try {
    result = vmFunc(o.funcjs, {}, option.maxruntime);
    res.send(result);
  } catch (error) {
    res.status(200)
    res.send('fail to run this function')
    return
  }
});

router.post('/:id', function (req, res, next) {
  var o = readFileSyncToData(req.params.id);
  const data = req.body == undefined ? {} : req.body
  var option = JSON.parse(o.confjson)
  if (option.method != "POST") {
    res.send('unsupport method')
    return
  }
  var result
  try {
    result = vmFunc(o.funcjs, data, option.maxruntime);
    res.send(result);
  } catch (error) {
    res.status(200)
    res.send('fail to run this function')
    return
  }
})

module.exports = router;
