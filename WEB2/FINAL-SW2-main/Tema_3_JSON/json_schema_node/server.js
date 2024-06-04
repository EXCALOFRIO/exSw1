const http = require("http");

// Load schemas beforehand
const movieSchema = require("./schemas/movie_schema.json");
const seriesSchema = require("./schemas/tv_series_schema.json");

const Ajv = require("ajv/dist/2020");
const ajv = new Ajv();

ajv.addSchema(movieSchema, "movie");
ajv.addSchema(seriesSchema, "series");

// Start server
const port = 3000;
const server = http.createServer(requestListener);
server.listen(port, () => {
    console.log(`Server Started on port ${port}`);
});


// HELPER FUNCTIONS

/**
 * Function that handles request's received by the server.
 * 
 * @param {http.ClientRequest} req Received request object
 * @param {http.ServerResponse} res Response to send to the client
 */
function requestListener(req, res) {
    console.log(`Connection received from ip '${req.socket.remoteAddress}' port '${req.socket.remotePort}'`);

    // Discriminate based on method
    if (req.method === "POST") {
        let data = "";
        req.on("data", (chunk) => data += chunk);
        req.on("end", () => {
            try {
                data = JSON.parse(data);
            } catch (error) {
                res.writeHead(400);
                res.end();
            }

            // Discriminate based on route
            switch(req.url) {
                case MOVIE_ROUTE:
                    validate("movie", data, res);
                    break;
                case SERIES_ROUTE:
                    validate("series", data, res);
                    break;
                default:
                    console.log(req.url)
                    notFoundError(res);
            }
        });
    } else {
        notFoundError(res);
    }
}

/**
 * Function to validate a schema and respond with result.
 * @param {string} schema Schema to use for validation
 * @param {string} json JSON content to validate
 * @param {http.ServerResponse} res Response to send to client
 */
function validate(schema, json, res) {
    try {
        const validate = ajv.getSchema(schema);
        const statusCode = validate(json) ? 200 : 400;

        if (validate.errors) {
            console.log(validate.errors)
        }

        res.writeHead(statusCode);
    } catch(error) {
        res.writeHead(400);
    } finally {
        res.end();
    }
}

/**
 * Function that sends a Not found response.
 * 
 * @param {http.ServerResponse} res Response to send to the client
 */
function notFoundError(res) {
    res.writeHead(404);
    res.end();
}

// CONSTANTS
const MOVIE_ROUTE = "/movie";
const SERIES_ROUTE = "/series";
