En sample\_airbnb.listingsAndReviews, ¿qué "room types"
existen?
```js
db.sample_airbnb.aggregate([{$project: {"room_type": 1, _id: 0}}, {$group: {_id: "$room_type"}}])
```

En sample\_training.companies, haga una query que
devuelva el nombre y el año en el que se fundaron las 5
compañías más antiguas.
```js
db.companies.find({founded_year: {$ne: null}}, {name: 1, founded_year: 1, _id: 0}).sort({founded_year: 1}).limit(5)
```

En sample\_training.trips, ¿en qué año nació el ciclista más
joven? (sol. 1999)
```js
db.trips.find({"birth year": {$gt: 0}}, {"birth year": 1, _id: 0}).sort({"birth year": -1}).limit(1)
```
