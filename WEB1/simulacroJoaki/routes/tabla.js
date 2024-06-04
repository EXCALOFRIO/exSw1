var express = require('express');
var router = express.Router();
const users = require('../users');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('tabla', { title: 'Tabla', user: req.session.user});
});

module.exports = router;