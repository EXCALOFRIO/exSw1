// Datos de ejemplo
var datos = [
    { nombre: 'Juan', edad: 25, ciudad: 'México' },
    { nombre: 'María', edad: 30, ciudad: 'Madrid' },
    { nombre: 'Pedro', edad: 28, ciudad: 'Buenos Aires' }
];

// Función para crear la tabla dinámica
function crearTabla(datos) {
    // Crear tabla
    var tabla = document.createElement('table');
    tabla.border = '1';

    // Crear encabezado
    var encabezado = tabla.createTHead();
    var filaEncabezado = encabezado.insertRow();
    for (var clave in datos[0]) {
        var th = document.createElement('th');
        th.innerHTML = clave;
        filaEncabezado.appendChild(th);
    }

    // Crear filas de datos
    var cuerpoTabla = tabla.createTBody();
    datos.forEach(function (filaDatos) {
        var fila = cuerpoTabla.insertRow();
        for (var clave in filaDatos) {
            var celda = fila.insertCell();
            celda.innerHTML = filaDatos[clave];
        }
    });

    return tabla;
}

// Obtener el contenedor y agregar la tabla
var contenedor = document.getElementById('tabla-container');
contenedor.appendChild(crearTabla(datos));
