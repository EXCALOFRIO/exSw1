const express = require('express');
const router = express.Router();
const users = require('../users');
const database = require('../public/database')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login', { title: 'Login', user: req.session.user});
});

router.post('/', async (req, res) => {
    const user = req.body.user;
    if(await database.user.isLoginRight(user, req.body.pass)){
      req.session.user = {username: user};
      req.session.message = "¡Login correcto!"
      res.redirect("restricted");
    }else if (users[user]){
        users.comparePass(req.body.pass, users[user].hash, function(err, result){
            if(result){
                req.session.user = users[user];
                req.session.message = "Welcome!"
                res.redirect("/restricted");
            } else {
                req.session.error = "Incorrect user or password";
                res.redirect("/login");
            }
        });
    } else  {
      req.session.error = "Incorrect username or password.";
      res.redirect("login");
    }
  });

module.exports = router;
