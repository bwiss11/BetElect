// mongodb+srv://bwiss11:Morioles!1@cluster0.klspkku.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0

const { MongoClient } = require("mongodb");
// Replace the uri string with your connection string.
const uri =
  "mongodb+srv://bwiss11:Morioles!1@cluster0.klspkku.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri);
async function run() {
  try {
    const database = client.db("GroupPick");
    const users = database.collection("users");
    // Query for a movie that has the title 'Back to the Future'
    const query = { email: "bwiss11@gmail.com" };
    const user = await users.findOne(query);
    console.log(user);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

async function logPick() {
  try {
    const database = client.db("GroupPick");
    const users = database.collection("users");
    // Query for a movie that has the title 'Back to the Future'
    const query = { email: "bwiss11@gmail.com" };
    const user = await users.findOne(query);
    // const picks = await user.find({ picks: "20240429" });
    console.log(
      user.picks["20240429"]
      // .project({ picks: "20240429" })
    );
  } finally {
    await client.close();
  }
}
logPick().catch(console.dir);
