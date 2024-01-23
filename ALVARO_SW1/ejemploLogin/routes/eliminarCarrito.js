// Importar el módulo Express
const express = require('express');
// Crear una instancia del enrutador de Express
const router = express.Router();

// Ruta para eliminar el carrito
router.post('/', (req, res) => {
    // Lógica para eliminar el carrito aquí
    req.session.user.carrito = [];

    res.redirect('carrito');
});

// Exportar el enrutador
module.exports = router;
