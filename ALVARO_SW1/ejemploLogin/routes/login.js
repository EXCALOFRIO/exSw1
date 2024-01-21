const express = require('express');
const router = express.Router();
const database = require('../database');
const database2 = require('../database/models/user.model');
router.get('/', function (req, res, next) {
  res.render('login', { user: req.session.user });
});

router.post('/', async (req, res) => {
  const user = req.body.user;
  if (await database.user.isLoginRight(user, req.body.pass)) {
    req.session.user = { username: user };
    // Obtener el carrito del usuario desde la base de datos
    const carrito = await database2.getCart(req.session.user.username);
    // Guardar el carrito en la sesión
    req.session.user.carrito = carrito || [];
    
    req.session.message = "¡Login correcto!"
    res.redirect("restricted");
  } else {
    req.session.error = "Incorrect username or password.";
    res.redirect("login");
  }
});

module.exports = router;
