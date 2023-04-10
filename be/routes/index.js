import express from 'express';

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/funclist', (req, res, next) => {
  res.send('funclist');
})

router.get('/:id', (req, res, next) => {
  
})

router.post('/newfunc', (req, res, next) => {
  const body = req.body;
  res.send('funclist');
})

router.post('/modfunc', (req, res, next) => {
  res.send('funclist');
})

router.post('/delfun', (req, res, next) => {
  res.send('funclist');
})

export default router;
