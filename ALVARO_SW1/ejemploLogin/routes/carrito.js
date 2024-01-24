const express = require('express');
const router = express.Router();
const database2 = require('../database/models/user.model');


router.get('/', function (req, res) {
    // Obtener el nombre de usuario desde la sesión
    const username = req.session.user.username;

    try {
        // Obtener el carrito del usuario desde la base de datos
        const carrito = database2.getCart(username);

        // Renderizar la vista con el carrito
        res.render('carrito', { carrito: carrito || [], user: req.session.user, req: req });
    } catch (error) {
        // Manejar el error si el usuario no existe
        console.error(error.message);
        res.status(500).send('Error al obtener el carrito del usuario');
    }
});

router.post('/', async (req, res) => {
    // Obtener el producto pulsado desde la solicitud POST
    const producto = req.body.producto;

    // Verificar si el usuario tiene un carrito en la sesiónSS
    if (!req.session.user.carrito) {
        req.session.user.carrito = [];
    }

    // Agregar el producto al carrito del usuario
    req.session.user.carrito.push(producto);

    // Guardar el carrito en la base de datos o almacenamiento persistente
    try {
        await database2.saveCart(req.session.user.username, req.session.user.carrito);
        // Respuesta al cliente
        console.log('Sesión del usuario antes de renderizar la vista:', req.session.user);
        res.redirect("/restricted");

    } catch (error) {
        // Manejar el error si hay un problema al guardar el carrito
        console.error(error.message);
        res.status(500).send('Error al guardar el carrito del usuario');
    }
});

module.exports = router;
