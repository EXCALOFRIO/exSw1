const express = require('express');
const router = express.Router();

router.post('/', function (req, res, next) {
  const token = req.body.token;

  // If token is ADMIN token -> log user in as admin
  if (token == process.env.ADMIN_TOKEN) {
    req.session.user = { admin: true };
    res.statusCode = 200;
    res.send();
  } else {
    res.statusCode = 403;
    res.send();
  }
});

module.exports = router;
