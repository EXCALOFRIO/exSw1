const { MongoClient} = require("mongodb");
const uri = "";
const client = new MongoClient(uri);

const dbname = "bank";
const accounts = client.db(dbname).collection("accounts");
const transfers = client.db(dbname).collection("transfers");

let account_id_sender = "MDB574189300";
let account_id_receiver = "MDB343652528";
let transfer_id = "TR21872189";
let transaction_amount = 100;
const session = client.startSession();

const main = async () => {
  try {
    const transactionResults = await session.withTransaction(async () => {
        const senderUpdate = await accounts.updateOne(
            { account_id: account_id_sender },
            { $inc: { balance: -transaction_amount } },
            { session }
        );
        const receiverUpdate = await accounts.updateOne(
            { account_id: account_id_receiver },
            { $inc: { balance: transaction_amount } },
            { session }
        );
        const transfer = {
            transfer_id: transfer_id,
            amount: transaction_amount,
            from_account: account_id_sender,
            to_account: account_id_receiver,
        };
        const insertTransferResults = await transfers.insertOne(transfer, { session });
        throw new Error("Error en la transacción");
        const updateSenderTransferResults = await accounts.updateOne(
            { account_id: account_id_sender },
            { $push: { transfers_complete: transfer.transfer_id } },
            { session }
        );
        const updateReceiverTransferResults = await accounts.updateOne(
            { account_id: account_id_receiver },
            { $push: { transfers_complete: transfer.transfer_id } },
            { session }
        );
    });
    if (transactionResults) {
        console.log("Transaction completed successfully.");
    } else {
        console.log("Transaction failed.");}
  } catch (err) {
    console.error(`Transaction aborted: ${err}`)
    process.exit(1)
  } finally {
    await session.endSession()
    await client.close()
  }
}
main();
