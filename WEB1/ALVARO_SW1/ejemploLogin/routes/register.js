const express = require('express');
const router = express.Router();
const database = require('../database');
const database2 = require('../database/models/user.model');

router.get('/', function (req, res, next) {
    res.render('register', { user: req.session.user, req: req });
    console.log(req.app.locals.cookies);
});

router.post('/', async (req, res) => {
    //funcion para registrar un usuario
    const user = req.body.user;
    const pass = req.body.pass;
    const pass2 = req.body.pass2;

    if (pass === pass2) {
        if (await database2.isUsernameTaken(user)) {
            req.session.error = "Username ya registrado usa otro nombre cazurro, o prueba hackear la cuenta y entrar.";
            res.redirect("register");
        } else {
            await database2.register(user, pass);
            req.session.user = { username: user };
            req.session.message = "¡Registro correcto!"
            req.session.user.cookies = req.app.locals.cookies;
            console.log('Sesión del usuario antes de renderizar la vista:', req.session.user);
            //haz un post para iniqciar sesion pasandole el usuario y la contraseña
            res.redirect("/");

        }
    }
    else {
        req.session.error = "Las contraseñas no coinciden macho no es tan dificil.";
        res.redirect("register");
    }
});

module.exports = router;
