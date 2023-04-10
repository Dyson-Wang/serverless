import express from "express";

var router = express.Router();

router.get('/:id', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/:id', function(req, res, next) {
    res.send('respond with a resource');
});

export default router;