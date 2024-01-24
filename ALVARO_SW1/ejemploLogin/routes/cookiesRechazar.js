// Importar el módulo Express
const express = require('express');
// Crear una instancia del enrutador de Express
const router = express.Router();

// Ruta para rexchazar las cookies
router.post('/', (req, res) => {
    req.session.destroy();
    req.app.locals.cookies = false;
    //redirigir a google    
    res.redirect('https://www.google.com');
});

// Exportar el enrutador
module.exports = router;
