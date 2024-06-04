const express = require('express');
const router = express.Router();
const dbo = require('../db/conn');
const ObjectId = require('mongodb').ObjectId;
const MAX_RESULTS = parseInt(process.env.MAX_RESULTS);
const COLLECTION = 'books';


//getBooks()
router.get('/offsetBasedPagination', async (req, res) => {
  // COMPROBACIONES PÁGINA:
  //  - Si no introducen página, usamos 1 (la primera).
  //  - Si introducen página, tiene que ser como mínimo 1
  const page = req.query.page ? Math.max(parseInt(req.query.page), 1) : 1;

  // COMPROBACIONES SIZE:
  //  - Si no introducen size, usamos MAX_SIZE
  //  - Si introducen size, tiene que ser mayor que 0 y menor que MAX_RESULTS
  let size = MAX_RESULTS;
  if (req.query.size && (parseInt(req.query.size) > 0)) {
    size = Math.min(parseInt(req.query.size), MAX_RESULTS);
  }
  const offset = (page - 1) * size;
  
  try {
    const dbConnect = dbo.getDb();
    const results = await dbConnect
      .collection(COLLECTION)
      .find() 
      .sort({ _id:1 })
      .project({title:1})
      .skip(offset)
      .limit(size)
      .toArray();

    const total_elements = await dbConnect.collection(COLLECTION).countDocuments()
    const remaining_elements = total_elements- (page * size)
    let next = null //si no entra a ningun if = null
    if (remaining_elements <= size && remaining_elements > 0){ //quedan menos elementos que el tamaño de página
      next = "http://localhost:"+ process.env.PORT + process.env.BASE_URI + "/book/offsetBasedPagination?size="+ remaining_elements + "&page=" +(page + 1)  ;
    }
    else if(remaining_elements > size){
      next = "http://localhost:"+ process.env.PORT + process.env.BASE_URI + "/book/offsetBasedPagination?size="+ size + "&page=" +(page + 1) ;
    } 
    res.status(200).json({ results, next });
  } catch (error) {
    console.log(error)
    res.status(400).send('Error searching for books');
  }
});

router.get('/CursorBasedPagination', async (req, res) => {
  let size = null; //inicializamos
  let query_size = parseInt(req.query.size);
  let envMaxResults = parseInt(process.env.MAX_RESULTS);
  if (query_size >= 1 && query_size <= envMaxResults){
    size = query_size
  }else{
    size = envMaxResults
  }
  //const size = (req.query.size >= 1 && req.query.size <= process.env.MAX_RESULTS) ? req.query.size: process.env.MAX_RESULTS  EN UNA LINEA
  console.log(typeof(size), typeof(envMaxResults));

  const query = {};
  if (req.query.next) { 
    query._id = { $gt: new ObjectId(req.query.next) }; //gt = no repite ultimo elemento, gte =si
  }
  
  try {
    const dbConnect = dbo.getDb();
    const results = await dbConnect
      .collection(COLLECTION)
      .find(query) 
      .sort({ _id:1 })
      .project({title:1})
      .limit(size)
      .toArray();

    const next = results.length === size ? results[results.length - 1]._id : null;
    res.status(200).json({ results, next });
  } catch (error) {
    console.log(error)
    res.status(400).send('Error searching for books');
  }
});


//getBookById()
router.get('/:id', async (req, res) => {
  const dbConnect = dbo.getDb();
  let query = {_id: new ObjectId(req.params.id)};
  let result = await dbConnect
    .collection(COLLECTION)
    .findOne(query)
  if (!result){
    res.send("Not found").status(404);
  } else {
    res.status(200).send(result);
  }
});

//addBook()
router.post('/', async (req, res) => {
  const dbConnect = dbo.getDb();
  console.log(req.body);
  let result = await dbConnect
    .collection(COLLECTION)
    .insertOne(req.body);
  res.status(201).send(result);
});

//deleteBookById()
router.delete('/:id', async (req, res) => {
  const query = { _id: new ObjectId(req.params.id) };
  const dbConnect = dbo.getDb();
  
  let result = await dbConnect
    .collection(COLLECTION)
    .deleteOne(query)
    if (result.deletedCount == 1){
      res.status(200).send("Successful operation")
    }else{
      res.status(400).send("Invalid book ID")
    }
});

module.exports = router;
