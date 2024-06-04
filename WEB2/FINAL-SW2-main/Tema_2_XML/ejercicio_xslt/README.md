## Contenido entrega

### Ficheros incluidos

Se entregan los siguientes ficheros:

* **README.md**: explicación de la entrega
* **API\_SP.POP.TOTL\_DS2\_en\_xml\_v2\_4898676.xml**: fichero XML a analizar.
* **ejercicio\_xslt.xsl**: fichero con las reglas XSLT.
* **makefile**: fichero para automatizar la generación del HTML.
* **result.html**: página de muestra, por si la máquina no cumple los requistos
  para el makefile.

### Requisitos Makefile

El `makefile` añadido sólo funcionará en sistemas 
operativos `Unix` con el comando `xsltproc` instalado.

### Generación HTML

Para generar el `html` a partir de los ficheros proporcionados,
se debe ejecutar la siguiente instrucción:
```
make html
```

A continuación, se puede abrir el fichero resultante (`result.html`)
en cualquier navegador para visualizar su contenido
