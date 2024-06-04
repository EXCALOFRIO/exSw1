async function senderRequest() {
    const respuesta = document.getElementById("respuesta");
    respuesta.innerHTML="Respuesta:"
    try {
        const elemento = document.getElementById("search-input").value;
        let recurso = document.getElementById("recursos").value;
        if (recurso == "default"){
            alert("Selccione un recurso")
            return
        }
        let response = await axios("http://localhost:3000/recursos/" + recurso + "/" + elemento);
        const res = document.getElementById('res');
        const linky = document.getElementById('linky');
        const ruta = document.getElementById('ruta');

        if (response.data) {
            let tamaño = response.data.ocurrencias.length;
            document.getElementById("res").style.color = "#a82c2c";
            let l = "http://localhost:3000/recursos/" + recurso + "/" + elemento;
            res.innerHTML = "Hemos encontrado " + tamaño + " occurencia. Si quieres ver más información utilice la siguiente API: " + l;
            
        }
    } catch {
        document.getElementById("res").style.color = "#28ad52"
        res.innerHTML = ("ENHORABUENA, No se ha encontrado ninguna ocurrencia.")
    };
}