# Apuntes Software 1

## NODE

### Iniciar un proyecto

```bash
npm init
```

### Instalar dependencias

```bash
npm install express
```

### Instalar dependencias de desarrollo

```bash
npm install -D nodemon
```

### Ejecutar el proyecto

```bash
npm run start

```

### alejandro.ramirezlarena@usp.ceu.es


git clone https://bitbucket.org/eps-ceu/sw2_2024_repository.git

### git config --global user.name "alejandro.ramirezlarena"

### git config --global user.email alejandro.ramirezlarena@usp.ceu.es

### alejandro.ramirezlarena

### 116317

# exSw1

https://github.com/juaki0315/examenSW1

# MongoDB Queries

## Ejercicio 1

1. Obtener el conteo de documentos en la colección `zips` donde la población (`pop`) es menor a 1000.
    ```javascript
    db.zips.find({pop: {$lt: 1000}}).count()
    ```

2. Calcular la diferencia entre el conteo de documentos en la colección `trips` donde el año de nacimiento (`birth year`) es mayor a 1998 y el conteo donde el año de nacimiento es 1998.
    ```javascript
    db.trips.count({"birth year": {$gt: 1998}}) - db.trips.count({"birth year": 1998})
    ```

3. Obtener el conteo de documentos en la colección `routes` donde las paradas (`stops`) son mayores o iguales a 1.
    ```javascript
    db.routes.find({stops: {$gte: 1}}).count()
    ```

4. Obtener el conteo de documentos en la colección `inspections` donde el resultado es "Out of Business" y el sector es "Home Improvement Contractor - 100".
    ```javascript
    db.inspections.find({result: "Out of Business", sector: "Home Improvement Contractor - 100"}).count()
    ```

5. Obtener el conteo de documentos en la colección `inspections` donde la fecha es "Feb 20 2015" o "Feb 21 2015" y el sector no es "Cigarette Retail Dealer - 127".
    ```javascript
    db.inspections.find({
      $and: [
        {$or: [{date: "Feb 20 2015"}, {date: "Feb 21 2015"}]},
        {sector: {$not: {$eq: "Cigarette Retail Dealer - 127"}}}
      ]
    }).count()
    ```

6. Obtener el conteo de documentos en la colección `inspections` donde la fecha es "Feb 20 2015" o "Feb 21 2015" y el sector no es "Cigarette Retail Dealer - 127" (otra forma de hacerlo).
    ```javascript
    db.inspections.find({
      $or: [{date: "Feb 20 2015"}, {date: "Feb 21 2015"}],
      sector: {$ne: "Cigarette Retail Dealer - 127"}
    }).count()
    ```

## Ejercicio 2

1. Obtener el conteo de documentos en la colección `companies` donde el número de empleados (`number_of_employees`) es mayor que el año de fundación (`founded_year`).
    ```javascript
    db.companies.find({ "$expr": { "$gt": ["$number_of_employees", "$founded_year"] }}).count()
    ```

2. Obtener el conteo de documentos en la colección `companies` donde el permalink es igual al nombre de usuario en Twitter (`twitter_username`).
    ```javascript
    db.companies.find({ "$expr": { "$eq": ["$permalink", "$twitter_username"] }}).count()
    ```

3. Obtener los nombres de las revisiones en la colección `listingsAndReviews` donde el número de revisiones es 50 y acomoda a más de 6 personas.
    ```javascript
    db.listingsAndReviews.find({number_of_reviews: 50, accommodates: {$gt: 6}}, {name: 1})
    ```

4. Obtener el conteo de documentos en la colección `listingsAndReviews` donde el tipo de propiedad es "House" y contiene la amenidad "Changing table".
    ```javascript
    db.listingsAndReviews.find({property_type: "House", amenities: {$elemMatch: {$eq: "Changing table"}}}).count()
    ```

5. Obtener el conteo de documentos en la colección `companies` donde una de sus oficinas está en la ciudad de Seattle.
    ```javascript
    db.companies.find({offices: {$elemMatch: {city: "Seattle"}}}).count()
    ```

6. Obtener el conteo de documentos en la colección `companies` donde una de sus oficinas está en la ciudad de Seattle (otra forma de hacerlo).
    ```javascript
    db.companies.find({'offices.city': "Seattle"}).count()
    ```

7. Obtener el nombre de las compañías que tienen 8 rondas de financiación.
    ```javascript
    db.companies.find({"funding_rounds": {$size: 8}}, {name: 1, _id: 0})
    ```

8. Obtener el conteo de documentos en la colección `trips` donde la coordenada de la estación de inicio es menor a -74.
    ```javascript
    db.trips.find({"start station location.coordinates.0": {$lt: -74}}).count()
    ```

9. Obtener el conteo de documentos en la colección `inspections` donde la ciudad es Nueva York.
    ```javascript
    db.inspections.find({"address.city": "NEW YORK"}).count()
    ```

10. Obtener los nombres y direcciones de las revisiones en la colección `listingsAndReviews` donde la primera amenidad es "Internet".
    ```javascript
    db.listingsAndReviews.find({"amenities.0": "Internet"}, {name: 1, address: 1, _id: 0})
    ```

## Ejercicio 3

1. Agrupar los documentos en la colección `listingsAndReviews` por el tipo de habitación (`room_type`).
    ```javascript
    db.listingsAndReviews.aggregate([{ $group: { _id: "$room_type" } }])
    ```

2. Obtener los primeros 5 documentos en la colección `companies` ordenados por año de fundación en orden ascendente, donde el año de fundación no es nulo, mostrando solo el nombre y el año de fundación.
    ```javascript
    db.companies.find({"founded_year": {$ne: null}}, {name: 1, "founded_year": 1, _id: 0}).sort({"founded_year": 1}).limit(5)
    ```

3. Obtener el año de nacimiento más reciente en la colección `trips` donde el año de nacimiento no está vacío.
    ```javascript
    db.trips.aggregate([
      { $match: {"birth year": {$ne: ''}} },
      { $group: { _id: null, maxBirthYear: {$max: "$birth year"} } }
    ])
    ```

4. Obtener el documento con el año de nacimiento más reciente en la colección `trips` donde el año de nacimiento no está vacío, mostrando solo el nombre y el año de nacimiento.
    ```javascript
    db.trips.find({'birth year': {$ne: ''}}, {name: 1, _id: 0, 'birth year': 1}).sort({'birth year': -1}).limit(1)
    ```



https://github.com/Daguerre45/Examen_SW1
