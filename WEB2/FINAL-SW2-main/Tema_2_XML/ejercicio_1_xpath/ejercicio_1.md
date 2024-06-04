## Consultas XPath

### Nombres de todos los Proyectos

Consulta:

```
//project/@name
```
### URLs de los proyectos en Español

Consulta:

```
//edition[@language="Spanish"]/text()
```
### Todas las ediciones de todos los proyectos

Consulta:

```
//editions
```

### Sólo las URL de todas las Wikipedias

Consulta:

```
//project[@name="Wikipedia"]/editions/edition/text()
```

### Cuarta edición del Wiktionary

Consulta:

```
//project[@name="Wiktionary"]/editions/edition[4]
```


