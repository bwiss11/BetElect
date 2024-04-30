// mongodb+srv://bwiss11:Morioles!1@cluster0.klspkku.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
const { MongoClient, ObjectId, insertOne } = require("mongodb");
// Replace the uri string with your connection string.
const uri =
  "mongodb+srv://bwiss11:Morioles!1@cluster0.klspkku.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri);

async function logPick() {
  try {
    await client.connect();
    const database = client.db("GroupPick");
    const groups = database.collection("groups");

    id = new ObjectId("663160c17bebb241a07623dc");
    const ans2 = await groups.findOne({
      _id: id,
    });

    console.log(ans2);
  } finally {
    await client.close();
  }
}
// run().catch(console.dir);
logPick();
