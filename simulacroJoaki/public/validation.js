function validarFormulario() {
    console.log('validar');
    var password = document.getElementById('pass').value;
    var confirmPassword = document.getElementById('conf_pass').value;

    if ((password.length < 8) || (password !== confirmPassword)) {
        alert('La contraseña debe tener al menos 8 caracteres.');
        event.preventDefault();
    } else {
        document.getElementById('myform').submit();
        register
    }
}