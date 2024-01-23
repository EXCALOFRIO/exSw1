// public/js/chat.js

// Verificar si estamos en el entorno del navegador antes de ejecutar el código específico del navegador
if (typeof window !== 'undefined') {
    window.addEventListener('load', () => {
        // Código específico del navegador
        fetch('/chat/messages')
            .then((response) => response.json())
            .then((data) => {
                const messagesList = document.getElementById('messages');
                data.messages.forEach((msg) => {
                    const li = document.createElement('li');
                    li.textContent = msg;
                    messagesList.appendChild(li);
                });
            });
    });

    // Resto del código específico del navegador
    document.getElementById('form').addEventListener('submit', (e) => {
        e.preventDefault();
        const message = document.getElementById('message').value;
        socket.emit('chat message', message);
        document.getElementById('message').value = '';
    });

    socket.on('chat message', (msg) => {
        const messagesList = document.getElementById('messages');
        const li = document.createElement('li');
        li.textContent = msg;
        messagesList.appendChild(li);
    });
}


const messages = [];

function addMessage(message) {
    messages.push(message);
}

function getMessages() {
    return messages;
}

module.exports = {
    addMessage,
    getMessages,
};
