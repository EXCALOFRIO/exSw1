function validateForm() {
    var password = document.getElementById("password").value;
    var confirmPassword = document.getElementById("confirmPassword").value;

    if (password.length < 8) {
        document.getElementById("errorMessage").innerHTML = "La contraseña debe tener al menos 8 caracteres.";
        document.getElementById("errorMessage").style.display = "block";
        return false;
    }

    if (password !== confirmPassword) {
        document.getElementById("errorMessage").innerHTML = "Las contraseñas no coinciden.";
        document.getElementById("errorMessage").style.display = "block";
        return false;
    }

    return true;
}
