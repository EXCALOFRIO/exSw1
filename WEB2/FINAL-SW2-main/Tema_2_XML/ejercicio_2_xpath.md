## Scraping de Amazon

### Prerequisitos

Para poder ejecutar las consultas incluidas a continuación,
se debe disponer de un navegador con acceso a `Herramientas de desarrollador`.

Las consultas se deberán introducir la consola del navegador. Se ha utilizado un navegador `Firefox`.

Se ha empleado el siguiente [enlace](https://www.amazon.es/s?k=dunlop+p%C3%BAas&__mk_es_ES=%C3%85M%C3%85%C5%BD%C3%95%C3%91&crid=R3TNCVH7LEA2&sprefix=dunlop+p%C3%BAas%2Caps%2C118&ref=nb_sb_noss_2) para las consultas.

### Extracción de Nombre

Para extraer el nombre de los productos introducimos la
siguiente expresión:

**XPath**:
```
//div[contains(@class, "a-section")]/h2/a/span/text()
```

**Javascript** (Ejecutado en la consola de firefox):
```js
let nombres = $x('//div[contains(@class, "a-section")]/h2/a/span/text()').map(t => t.textContent);
```

### Extracción del Precio

Para extraer el precio de los productos introducimos la
siguiente expresión:

**XPath**:
```
//span[@class="a-price"]/span[@class="a-offscreen"]/text()
```

**Javascript** (Ejecutado en la consola de firefox):
```js
let precios = $x('//span[@class="a-price"]/span[@class="a-offscreen"]/text()').map(t => t.textContent);
```

### Combinación de los resultados

Partiendo de las variables javascript creadas anteriormente,
podemos crear una lista de objetos que combinen precio/valor
para cada producto.

Sin embargo, en Amazon, algunos productos no tienen precio, 
por lo que las longitudes de ambas listas no tienen por qué
coincidir.

Para obtener una estructura que asocie a cada elemento su
precio, es mejor obtener los precios a partir de la lista
de nombres:

```js
// Función para recuperar precio en función del nombre
function getPrice(name) {
    return $x(`//div[contains(@class, "a-section")]/h2/a/span[text()="${name}")]/ancestor::div[contains(@class, "a-section")]/descendant::span[contains(@class, "a-offscreen")]/text()`)[0]?.textContent
}
```

Una vez creada la función anterior, podemos aplicarla a la
lista de nombres, obteniendo el siguiente resultado:

```js
let productos = []
nombres.forEach(name => {
    productos.push({
        'nombre': name,
        'precio': getPrice(name)
    });
});
```

Mostramos los primeros resultados:
```js
productos.slice(0, 5).forEach(p => console.log(p))
```

Obtenemos el siguiente resultado:
```js
Object { nombre: "Dunlop 424 Púas TORTEX WEDGE Players violetas 1.14 mm", precio: "7,70 €" }
Object { nombre: "Dunlop 418P88 - púas para guitarra, color verde, 12 Unidad (Paquete de 1)", precio: "6,70 €" }
Object { nombre: "Dunlop 417 Púas GATOR GRIP STANDARD negras 2.00 mm", precio: "9,56 €" }
Object { nombre: "Jim Dunlop.", precio: "6,00 €" }
Object { nombre: "JIM DUNLOP PVP113 Electric Guitar Pick Variety Pack", precio: "14,63 €" }
```
