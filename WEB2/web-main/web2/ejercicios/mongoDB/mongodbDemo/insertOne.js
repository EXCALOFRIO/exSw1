const { MongoClient} = require("mongodb");
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
const sampleAccount = {
  account_holder: "Linus Torvalds",
  account_id: "MDB829001337",
  account_type: "checking",
  balance: 50352434,
}
const main = async () => {
  try {
    await connectToDatabase()
    let result = await accountsCollection.insertOne(sampleAccount);
    console.log(`Inserted document: ${result.insertedId}`);
    console.log(result);
  } catch (err) {  console.error(`Error inserting document: ${err}`);
  } finally {
    await client.close();
  }
} 
main();
