En sample\_training.companies, ¿cuántas empresas tienen
más empleados que el año en el que se fundaron? (sol. 324)
```js
db.companies.find({$expr: {$gt: ["$number_of_employees", "$founded_year"]}}).count()
```

En sample_training.companies, ¿en cuántas empresas
coinciden su permalink con su twitter_username? (sol.
1299)

```js
db.companies.find({$expr: {$eq: ["$permalink", "$twitter_username"]}}).count()
```

En sample_airbnb.listingsAndReviews, ¿cuál es el nombre
del alojamiento en el que pueden estar más de 6 personas
alojadas y tiene exactamente 50 reviews? (sol. Sunset Beach
Lodge Retreat)

```js
db.sample_airbnb.find({$and: [{accommodates: {$gt: 6}},{reviews: {$size: 50}}]}, {name: 1, _id: 0})
```

En sample_airbnb.listingsAndReviews, ¿cuántos
documentos tienen el "property_type" "House" e incluyen
"Changing table" como una de las "amenities"? (sol. 11)
```js
db.sample_airbnb.find({property_type: "House", amenities: {$all: ["Changing table"]}}).count()
```

En sample_training.companies, ¿Cuántas empresas tienen
oficinas en Seattle? (sol. 117)
```js
db.companies.find({offices: {$elemMatch: {city: "Seattle"}}}).count()
```
o
```js
db.companies.find({"offices.city": "Seattle"}).count()
```

En sample_training.companies, haga una query que
devuelva únicamente el nombre de las empresas que tengan
exactamente 8 "funding_rounds"
```js
db.companies.find({funding_rounds: {$size: 8}}, {name: 1, _id: 0})
```

En sample_training.trips, ¿cuántos viajes empiezan en
estaciones que están al oeste de la longitud -74? (sol. 1928)
```js
db.trips.find({"start station location.coordinates.0": {$lt: -74}}).count()
```

En sample_training.inspections, ¿cuántas inspecciones se
llevaron a cabo en la ciudad de "NEW YORK"? (sol. 18279)
```js
db.inspections.find({"address.city": "NEW YORK"}).count()
```

En sample_airbnb.listingsAndReviews, haga una query que
devuelva el nombre y la dirección de los alojamientos que
tengan "Internet" como primer elemento de "amenities"
```js
db.sample_airbnb.find({"amenities.0": "Internet"}, {name: 1, address: 1, _id:0})
```
