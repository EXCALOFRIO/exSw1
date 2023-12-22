const socket = io();
const form = document.getElementById("form");
const user = document.getElementById("username");
const input = document.getElementById("input");
const messages = document.getElementById("messages");

form.addEventListener('submit', function(e){
    e.preventDefault();
    if(input.value){
        const mensaje = `${user.value} : ${input.value}`
        socket.emit("chat", mensaje);
        input.value = "";
    }
});

socket.on("chat", (msg) =>{
    const item = document.createElement("li");
    item.textContent = msg;
    messages.appendChild(item);
    window.scrollTo(0,document.body.scrollHeight);
});