import pymongo

# Conexión a la base de datos
client = pymongo.MongoClient("mongodb://localhost:27017/")

# Nombre de la base de datos y colección
dbname = "sample_airbnb"
collection_name = "trips"

# Obtener la colección
collection = client.db(dbname).collection(collection_name)

# Función para obtener todos los registros
async def allRegistros(client):
    # Obtener la colección "listingsAndReviews"
    db = client.db("sample_airbnb").collection("listingsAndReviews")

    # Contar los registros que tengan 2, 3, 4 o 5 camas
    result = await db.find({"$or": [{"beds": 2}, {"beds": 3}, {"beds": 4}, {"beds": 5}]}).count()

    # Imprimir el resultado
    print("Resultado", result)

# Llamar a la función
allRegistros(client)
