const express = require('express');
const router = express.Router();
const database2 = require('../database/models/user.model');

// Ruta para aceptar las cookies
router.post('/', async (req, res) => {
    if (!req.session.user) {
        // Usuario no autenticado,poner req.session.cookiesAccepted = true;
        console.log('Sesión del usuario antes de renderizar la vista:', req.session.cookiesAccepted);
        req.session.cookiesAccepted = true;
        console.log('Sesión del usuario despues de acceptar:', req.session.cookiesAccepted);

        res.redirect('/');

    } else {
        if (!req.session.user.cookies) {
            req.session.user.cookies = false;
        }

        req.session.user.cookies = true;

        await database2.aceptarCookies(req.session.user.username, req.session.user.cookies);

        console.log('Sesión del usuario antes de renderizar la vista:', req.session.user);
        res.render('index', { user: req.session.user });
    }
});

// Exportar el enrutador
module.exports = router;
