var express = require('express');
var router = express.Router();
var { readFileSyncToData } = require('../utils/file');
const vmFunc = require('../utils/vm');

router.get('/:id', function (req, res, next) {
  var code = readFileSyncToData(`./src/faas/${req.params.id}/func.js`);
  var result = vmFunc(code);
  res.send(result);
});

router.post('/:id', function (req, res, next) {

})

module.exports = router;
