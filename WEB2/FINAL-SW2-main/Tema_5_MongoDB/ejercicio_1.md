En sample\_training.zips ¿Cuántas colecciones tienen
menos de 1000 personas en el campo pop? (sol. 8065)

```js
db.zips.find({"pop": {"$lt": 1000}}).count()
```

En sample\_training.trips ¿Cuál es la diferencia entre la
gente que nació en 1998 y la que nació después de 1998? (sol.
6)

```js
Math.abs(db.trips.find({"birth year": {"$eq": 1998}}).count() - db.trips.find({"birth year": {"$gt": 1998}}).count())
```

En sample\_training.routes ¿Cuántas rutas tienen al menos
una parada? (sol. 11)
```js
db.routes.find({"stops": {"$gte": 1}}).count()
```

En sample\_training.inspections ¿Cuántos negocios
tienen un resultado de inspección "Out of Business" y
pertenecen al sector "Home Improvement Contractor -
100"? (sol. 4)
```js
db.inspections.find({"$and": [{"result": "Out of Business"}, {"sector": "Home Improvement Contractor - 100"}]}).count()
```

En sample\_training.inspections ¿Cuántos documentos
hay con fecha de inspección "Feb 20 2015" o "Feb 21 2015" y
cuya sector no sea "Cigarette Retail Dealer - 127"? (sol.
204)
```js
db.inspections.find({"$and": [{"$or": [{"date": "Feb 20 2015"}, {"date": "Feb 21 2015"}]}, {"sector": {"$ne": "Cigarette Retail Dealer - 127"}}]}).count()
```
