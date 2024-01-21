const socket = io();
const form = document.getElementById("form");
const input = document.getElementById("input");
const messages = document.getElementById("messages");

const username = form.dataset.username;

form.addEventListener('submit', function (e) {
    e.preventDefault();
    const user = username;
    const message = input.value.trim();

    if (message) {
        const fullMessage = `${user}: ${message}`;
        socket.emit("chat", fullMessage);
        input.value = "";
    }
});

socket.on("chat", (msg) => {
    const item = document.createElement("li");
    item.textContent = msg;
    messages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
});
