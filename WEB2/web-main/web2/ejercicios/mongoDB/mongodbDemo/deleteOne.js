const { MongoClient, ObjectId} = require("mongodb");
const uri = "";
const client = new MongoClient(uri);

const connectToDatabase = async () => {
    try {
        await client.connect();
    } catch (e){
        console.error(e);
    }
}

const dbname = "bank";
const collection_name = "accounts";
const accountsCollection = client.db(dbname).collection(collection_name);
const documentToDelete = { _id: new ObjectId("6447ee6d1631ea877dc0e10f") };
const main = async () => {
  try {
    await connectToDatabase();
    let result = await accountsCollection.deleteOne(documentToDelete);
    result.deletedCount === 1
      ? console.log("Deleted one document")
      : console.log("No documents deleted");
    console.log(result);
  } catch (err) {
    console.error(`Error deleting documents: ${err}`);
  } finally {
    await client.close();
  }
}
main();
