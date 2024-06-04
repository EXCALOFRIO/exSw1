const express = require('express');
const router = express.Router();
const productos = require('../public/js/productos');

router.get('/', function (req, res) {
  res.render('restricted', { user: req.session.user, productos: productos,req: req });
});

module.exports = router;
