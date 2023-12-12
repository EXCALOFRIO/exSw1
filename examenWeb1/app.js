const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');

const app = express();
const port = 3000;

// Middleware para parsear datos del formulario
app.use(bodyParser.urlencoded({ extended: true }));

// Archivos estáticos
app.use(express.static('public'));

// Simulación de base de datos de usuarios
const users = [];

// Ruta de registro
app.get('/registro', (req, res) => {
    res.sendFile(__dirname + '/public/registro.html');
});

app.post('/registro', (req, res) => {
    const { username, password, confirmPassword } = req.body;

    // Validación en el servidor
    if (password.length < 8 || password !== confirmPassword) {
        return res.redirect('/registro?error=1');
    }

    // Comprobar si el usuario ya existe
    if (users.some(user => user.username === username)) {
        return res.redirect('/registro?error=2');
    }

    // Cifrar la contraseña antes de almacenarla
    const hashedPassword = bcrypt.hashSync(password, 10);
    console.log(hashedPassword);

    // Almacenar el nuevo usuario
    users.push({ username, password: hashedPassword });

    // Redirigir al usuario registrado a la página restringida
    res.redirect('/restricted');
});

// Ruta restringida
app.get('/restricted', (req, res) => {
    res.send('¡Bienvenido a la página restringida!');
});

app.get('/', (req, res) => {
    res.redirect('/registro');
});

app.listen(port, () => {
    console.log(`Servidor iniciado en http://localhost:${port}`);
});
