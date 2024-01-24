var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('chat', { title: 'CHAT', user: req.session.user,req: req });
});

module.exports = router;
