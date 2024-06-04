const express = require('express');
const router = express.Router();
const database2 = require('../database/models/user.model');

// Ruta para aceptar las cookies
router.post('/', async (req, res) => {
    if (!req.session.user) {
        req.app.locals.cookies = true;

        res.redirect('/');

    } else {
        console.log('Sesión del usuario antes:', req.session.user);
        if (!req.session.user.cookies) {
            req.session.user.cookies = false;
        }
        req.app.locals.cookies = true;
        req.session.user.cookies = true;
        console.log('Sesión del usuario despues:', req.session.user);
        await database2.aceptarCookies(req.session.user.username, req.session.user.cookies);

        console.log('Sesión del usuario antes de renderizar la vista:', req.session.user);
        res.render('index', { user: req.session.user, req: req });
    }
});

// Exportar el enrutador
module.exports = router;
