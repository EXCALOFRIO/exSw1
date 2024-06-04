const express = require('express');
const router = express.Router();
const dbo = require('../db/conn');
const ObjectId = require('mongodb').ObjectId;
const MAX_RESULTS = parseInt(process.env.MAX_RESULTS);
const COLLECTION = 'books';


const bookPostSchema = require("../schemas/bookPostSchema.json");

// Load schema beforehand
const Ajv = require('ajv/dist/2020');
const ajv = new Ajv();

ajv.addSchema(bookPostSchema, 'PostBooks');




//getBooks()
router.get('/', async (req, res) => {
  let limit = MAX_RESULTS;
  if (req.query.limit){
    limit = Math.min(parseInt(req.query.limit), MAX_RESULTS);
  }
  let next = req.query.next;
  let query = {}
  if (next){
    query = {_id: {$lt: new ObjectId(next)}}
  }
  const dbConnect = dbo.getDb();
  let results = await dbConnect
    .collection(COLLECTION)
    .find(query)
    .sort({_id: -1})
    .limit(limit)
    .project({ _id: 1, title: 1, author: 1, link: { $concat: ['http://localhost:3000/api/v2/book/', { $toString: '$_id' }] } })
    .toArray()
    .catch(err => res.status(400).send('Error searching for books'));
  next = results.length == limit ? results[results.length - 1]._id : null;
  res.json({results, next}).status(200);
});






router.get('/offsetBasedPagination', async (req, res) => {
  const page = req.query.page ? Math.min(parseInt(req.query.page), MAX_RESULTS) : MAX_RESULTS;
  const size = req.query.size ? parseInt(req.query.size) : 0;
  const offset = (page - 1) * size;
  console.log(page, size, offset);
  
  try {
    const dbConnect = dbo.getDb();
    const results = await dbConnect
      .collection(COLLECTION)
      .find() 
      .sort({ _id:1 })
      .project({title:1,  link: { $concat: ['http://localhost:3010'+ process.env.BASE_URI+ '/book/', { $toString: '$_id' }] } })
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
  const data = req.body;
  const validate = ajv.getSchema("PostBooks");
  const valid = validate(data);

  if (valid){
    const dbConnect = dbo.getDb();
    console.log(req.body);
    let result = await dbConnect
    .collection(COLLECTION)
    .insertOne(req.body);
    res.status(201).send(result);
  }else{
    res.status(400).send("Bad Format Post");
  }
   
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
