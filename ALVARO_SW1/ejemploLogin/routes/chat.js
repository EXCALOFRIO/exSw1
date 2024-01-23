// routes/chat.js

const express = require('express');
const router = express.Router();
const chat = require('../public/js/chat.js');

// Ruta para obtener el historial de mensajes
router.get('/messages', (req, res) => {
    const messages = chat.getMessages();
    res.json({ messages });
});

// Ruta para enviar un nuevo mensaje
router.post('/send', (req, res) => {
    const { message } = req.body;

    if (message) {
        // Puedes guardar el mensaje en la base de datos si es necesario
        chat.addMessage(message);

        // Enviar el mensaje a todos los clientes conectados
        req.app.io.emit('chat message', message);

        res.json({ success: true });
    } else {
        res.json({ success: false, error: 'Message is required' });
    }
});

module.exports = router;
