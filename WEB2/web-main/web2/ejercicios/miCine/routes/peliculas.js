const express = require('express');
const router = express.Router();
const dbo = require('../db/conn');
const ObjectId = require('mongodb').ObjectId;
const MAX_RESULTS = parseInt(process.env.MAX_RESULTS);

//getPeliculas()
/*
router.get('/', async (req, res) => {
  const dbConnect = dbo.getDb();
  let results = await dbConnect
    .collection('peliculas')
    .find({})
    .limit(MAX_RESULTS)
    .toArray()
    .catch(err => res.status(400).send('Error al buscar películas'));
  res.json(results).status(200);
});
*/
router.get('/', async (req, res) => {
  const limit = Math.min(req.query.limit, MAX_RESULTS);
  let next = req.query.next;
  let query = {}
  if (next){
    query = {_id: {$lt: next}}
  }
  const dbConnect = dbo.getDb();
  let results = await dbConnect
    .collection('peliculas')
    .find(query)
    .sort({_id: -1})
    .limit(limit)
    .toArray()
    .catch(err => res.status(400).send('Error al buscar películas'));
  next = results.length == limit ? results[results.length - 1]._id : null;
  res.json({results, next}).status(200);
});

//getPeliculaById()
router.get('/:id', async (req, res) => {
  const dbConnect = dbo.getDb();
  let query = {_id: new ObjectId(req.params.id)};
  let result = await dbConnect
    .collection('peliculas')
    .findOne(query);
  if (!result){
    res.send("Not found").status(404);
  } else {
    res.send(result).status(200);
  }
});

//addPelicula()
router.post('/', async (req, res) => {
  const dbConnect = dbo.getDb();
  console.log(req.body);
  let result = await dbConnect
    .collection('peliculas')
    .insertOne(req.body);
  res.send(result).status(201);
});

//updatePeliculaById()
router.put('/:id', async (req, res) => {
  const query = {_id: new ObjectId(req.params.id)};
  const update = {$set:{
    titulo: req.body.titulo,
    descripcion: req.body.descripcion,
    duracion: req.body.duracion
  }};
  const dbConnect = dbo.getDb();
  let result = await dbConnect
    .collection('peliculas')
    .updateOne(query, update);
  res.send(result).status(200);
});

//deletePeliculaById()
router.delete('/:id', async (req, res) => {
  const query = { _id: new ObjectId(req.params.id) };
  const dbConnect = dbo.getDb();
  let result = await dbConnect
    .collection('peliculas')
    .deleteOne(query);
  res.send(result).status(200);
});

module.exports = router;
