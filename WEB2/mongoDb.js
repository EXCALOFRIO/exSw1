const MongoClient = require('mongodb').MongoClient;

// Conexión a la base de datos
const uri = "mongodb://localhost:27017/";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// Nombre de la base de datos y colección
const dbName = "sample_airbnb";
const collectionName = "trips";

// Obtener la colección
async function allRegistros(client) {
    try {
        // Conectar a la base de datos
        await client.connect();

        // Obtener la colección "listingsAndReviews"
        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        // Contar los registros que tengan 2, 3, 4 o 5 camas
        const count = await collection.countDocuments({
            $or: [{ beds: 2 }, { beds: 3 }, { beds: 4 }, { beds: 5 }],
        });

        // Imprimir el resultado
        console.log("Resultado:", count);
    } catch (error) {
        console.error(error);
    } finally {
        // Cerrar la conexión a la base de datos
        await client.close();
    }
}

// Llamar a la función
allRegistros(client);
