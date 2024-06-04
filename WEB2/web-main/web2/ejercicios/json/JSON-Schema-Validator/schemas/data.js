const Ajv2020 = require("ajv/dist/2020");

const ajv = new Ajv2020();

const schemaMovie = require("./movie.schema.json");

ajv.addSchema(schemaMovie, "movie");

module.exports = ajv;