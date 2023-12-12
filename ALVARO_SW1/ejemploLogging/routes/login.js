const express = require('express');
const router = express.Router();
const database = require('../database');
const logger = require('../logger');

router.get('/', function(req, res, next) {
  res.render('login', {user: req.session.user});
});

router.post('/', async (req, res) => {
  logger.info("Nueva conexión en /login");
  const user = req.body.user;
  if(await database.user.isLoginRight(user, req.body.pass)){
    req.session.user = {username: user};
    req.session.message = "¡Login correcto!"
    res.redirect("restricted");
  } else {
    logger.error("Intento de login fallido");
    req.session.error = "Incorrect username or password.";
    res.redirect("login");
  }
});

module.exports = router;
