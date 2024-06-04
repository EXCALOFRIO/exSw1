const express = require('express');
const resourceSchema = require('../schemas/resource.json');
const resourcePutSchema = require("../schemas/resourcePut.json");
const assetSchema = require("../schemas/asset.json");
const assetPutSchema = require("../schemas/assetPutSchema.json");
const router = express.Router();
const { Database } = require("../scripts/database");
const { XMLParser, XMLBuilder, XMLValidator } = require("fast-xml-parser");
const parser = new XMLParser()
const http = require("http");
const axios = require('axios');


// Load schema beforehand
const Ajv = require('ajv/dist/2020');
const ajv = new Ajv();

ajv.addSchema(resourceSchema, 'resource');
ajv.addSchema(resourcePutSchema, "resourcePut");
ajv.addSchema(assetSchema, "assetSchema");
ajv.addSchema(assetPutSchema, "assetPutSchema");

/** GET: Method to get list of resources  */
router.get('/', async function (req, res, next) {
  // 1. Consulta a mongo -> recursos
  const databaseManager = Database.getInstance();
  const db = databaseManager.client.db("scrapiffy");
  const cursor = db.collection("resources").find();

  const resources = [];
  while (await cursor.hasNext()) {
    const resource = await cursor.next();
    resources.push(resource);
  }

  // 2. Devolver resultado 
  if (resources.length) {
    const response = JSON.stringify(resources);
    sendResponse(res, 200, response);
  } else {
    sendResponse(res, 204, "No hay contenido");
  }
});

router.post('/', async function (req, res, next) {
  const admin = checkAdmin(req, res);
  if (admin) {
    const data = await await getContent(req, res, "resource")
    if (data) {
      // 2. Añadir en mongo recurso
      const databaseManager = Database.getInstance();
      const db = databaseManager.client.db("scrapiffy");

      try {
        const mongoResponse = await db.collection("resources").insertOne({
          _id: data.id,
          descripcion: data.descripcion
        });

        //crear colección para el recurso
        await db.createCollection(data.id);

        // 3. Devolver respuesta
        const response = JSON.stringify({
          id: mongoResponse.insertedId
        });
        sendResponse(res, 201, response);
      } catch {
        sendResponse(res, 400, "El id ya existe");
      }
    }
  }
});

router.put('/:idRecurso', async function (req, res, next) {
  const admin = checkAdmin(req, res);
  if (admin) {
    const data = await getContent(req, res, "resourcePut")
    if (data) {
      // 2. Añadir en mongo recurso
      const databaseManager = Database.getInstance();
      const db = databaseManager.client.db("scrapiffy");

      const updateDoc = {
        $set: {
          descripcion: data.descripcion
        },
      };
      await db.collection("resources").updateOne({ _id: req.params.idRecurso }, updateDoc);

      // 3. Devolver respuesta
      sendResponse(res, 200, "Todo correcto");
    }
  }
});

router.delete('/:idRecurso', async function (req, res, next) {
  const admin = checkAdmin(req, res);
  if (admin) {
    // 2. Añadir en mongo recurso
    const databaseManager = Database.getInstance();
    const db = databaseManager.client.db("scrapiffy");
    const mongoResponse = await db.collection("resources").deleteOne({ _id: req.params.idRecurso });

    // 3. Devolver respuesta
    if (mongoResponse.deletedCount) {
      // Borrar la colección asociada al recurso
      await db.dropCollection(req.params.idRecurso);

      sendResponse(res, 200, "Todo correcto");
    } else {
      sendResponse(res, 404, `El recurso ${req.params.idRecurso} no existe`);
    }
  }
});

function checkAdmin(req, res) {
  if (req.session.user && req.session.user.admin) {
    return true;
  }
  else {
    if (req.user) {
      sendResponse(res, 403, "No se dispone de los permisos necesarios para realizar esta operación");
    }
    else {
      sendResponse(res, 401, "Esta operación requiere autentificación");
    }
  }
  return false;
}

function validateSchema(schema, data, res) {
  const validate = ajv.getSchema(schema);
  const valid = validate(data);

  if (!valid) {
    sendResponse(res, 400, "Formato incorrecto");
  }

  return valid;
}

function sendResponse(res, statusCode, response) {
  res.contentType("json");
  res.statusCode = statusCode;
  res.send(response);
}

async function getContent(req, res, validator) {
  let data = '';

  if (req.is("application/x-www-form-urlencoded")) {
    try {
      const body = Object.keys(req.body)[0];
      const config = {
        headers: {
          'Content-Type': 'application/xml'
        }
      }
      const response = await axios.post(process.env.DTD_SERVICE_URL + "/" + validator, body, config);
      data = parser.parse(body).content;
      return data;
    } catch {
      sendResponse(res, 400, "Formato incorrecto");
    }
  } else if (req.is("application/json")) {
    data = req.body;
    const valid = validateSchema(validator, data, res);
    return valid ? data : null;
  } else {
    sendResponse(res, 400, "Formato incorrecto");
  }
}

/** GET: Method to get list of resources  */
router.get('/:idRecurso', async function (req, res, next) {
  // Comprobamos admin
  const admin = checkAdmin(req, res);
  if (admin) {
    // 1. Obtenemos página y offset
    const page = Math.max(1, req.query.page);             // La página debe ser mayor que 1, para que cuando se calcule el offset sea mayor o igual que 0
    const page_size = Math.min(req.query.page_size, process.env.MAX_PAGE_SIZE);  // El tamaño de página debe ser menor o igual que MAX_PAGE_SIZE
    const offset = (page - 1) * page_size;                // El se calcula como (página - 1) * tamaño_página, para que la página 1 se corresponda a los
                                                          // primeros resultados [0, n)

    // 1. Consulta a mongo -> Todos los activos asociados a un recurso (paginados)
    const resource = req.params.idRecurso;
    const databaseManager = Database.getInstance();
    const db = databaseManager.client.db("scrapiffy");
    const cursor = await db.collection(resource)
      .find()
      .limit(page_size)
      .skip(offset)

    if (cursor) {
      // Si recurso existe, da formato a la respuesta
      const assets = [];

      // Recorre todos los activos de la página y los traduce a objectos de la aplicación
      while (await cursor.hasNext()) {
        const asset = await cursor.next();

        // Obtiene la lista de ocurrencias del activo
        const ocurrencias = [];
        asset.ocurrencias.forEach(o => {
          ocurrencias.push({
            timestamp: o.timestamp,
            source: o.source
          });
        });

        // Añade el activo a la lista de activos
        assets.push(
          {
            id: asset._id,
            ocurrencias
          }
        );
      }

      const response = {
        activos: assets,
        next: `/recursos/${resource}?page=${page + 1}&page_size=${page_size}`
      };
      sendResponse(res, 200, response);
    } else {
      // Si el recurso no existe, devuelve error
      sendResponse(res, 404, `El recurso ${asset} no existe`);
    }
  }
});

router.get('/:idRecurso/:idActivo', async function (req, res, next) {
  // 1. Consulta a mongo -> activos
  const resource = req.params.idRecurso;
  const asset = req.params.idActivo;

  const databaseManager = Database.getInstance();
  const db = databaseManager.client.db("scrapiffy");
  const mongoResponse = await db.collection(resource).findOne({ _id: asset });

  if (mongoResponse) {
    const ocurrencias = [];
    mongoResponse.ocurrencias.forEach(o => {
      ocurrencias.push({
        timestamp: o.timestamp,
        source: o.source
      });
    });

    const response = {
      id: mongoResponse.id,
      ocurrencias
    };
    sendResponse(res, 200, response);
  } else {
    sendResponse(res, 404, `El recurso ${asset} no existe`);
  }
});

router.post('/:idRecurso', async function (req, res, next) {
  const admin = checkAdmin(req, res);
  if (admin) {
    const data = await getContent(req, res, "assetSchema");
    if (data) {
      const databaseManager = Database.getInstance();
      const db = databaseManager.client.db("scrapiffy");

      const collections = await db.collections();
      const resources = collections.map(c => c.s.namespace.collection);
      const resourceExists = resources.includes(req.params.idRecurso);
      if (resourceExists) {
        // 2. Añadir en mongo recurso
        try {
          const mongoResponse = await db.collection(req.params.idRecurso).insertOne({
            _id: data.id,
            ocurrencias: data.ocurrencias
          });

          // 3. Devolver respuesta
          const response = JSON.stringify({
            id: mongoResponse.insertedId
          });
          sendResponse(res, 201, response);
        } catch {
          sendResponse(res, 400, 'El id ya existe');
        }
      } else {
        sendResponse(res, 404, `El recurso ${req.params.idRecurso} no existe`);
      }
    } 
  }
});

router.put('/:idRecurso/:idActivo', async function (req, res, next) {
  const admin = checkAdmin(req, res);
  if (admin) {
    const databaseManager = Database.getInstance();
    const db = databaseManager.client.db("scrapiffy");

    const collections = await db.collections();
    const resources = collections.map(c => c.s.namespace.collection);
    const resourceExists = resources.includes(req.params.idRecurso);

    if (resourceExists) {
      const data = await getContent(req, res, "assetPutSchema");
      if (data) {
        // 2. Añadir en mongo recurso
        const updateDoc = {
          $push: { ocurrencias: data }
        }
        const mongoResponse = await db.collection(req.params.idRecurso).updateOne({ _id: req.params.idActivo }, updateDoc);

        // 3. Devolver respuesta
        if (mongoResponse.modifiedCount === 1) {
          sendResponse(res, 200, "Todo correcto");
        } else {
          sendResponse(res, 404, `El activo ${req.params.idActivo} no existe`);
        }
      }
    } else {
      sendResponse(res, 404, `El recurso ${req.params.idRecurso} no existe`);
    }
  }
});

router.delete('/:idRecurso/:idActivo', async function (req, res, next) {
  const admin = checkAdmin(req, res);
  if (admin) {
    const databaseManager = Database.getInstance();
    const db = databaseManager.client.db("scrapiffy");

    const collections = await db.collections();
    const resources = collections.map(c => c.s.namespace.collection);
    const resourceExists = resources.includes(req.params.idRecurso);

    if (resourceExists) {
      const mongoResponse = await db.collection(req.params.idRecurso).deleteOne({ _id: req.params.idActivo });

      // 3. Devolver respuesta
      if (mongoResponse.deletedCount) {
        sendResponse(res, 200, "Todo correcto");
      } else {
        sendResponse(res, 404, `El activo ${req.params.idActivo} no existe`);
      }
    } else {
      sendResponse(res, 404, `El recurso ${req.params.idRecurso} no existe`);
    }
  }
});

module.exports = router;