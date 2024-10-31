const dotenv = require('dotenv');

const { MongoClient, ServerApiVersion } = require('mongodb');
// Load environment variables from .env file
dotenv.config({ path: '../.env' });
const uri = process.env.MONGODB_URI;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    console.log("Connected successfully to MongoDB");

    // Specify the database and collection
    const database = client.db('legalSalesTarget');
    const collection = database.collection('users');

    // Insert a single document
    const user = {
      name: 'John Doe',
      email: 'JohnDoe@mail.com',
      password: 'abc',
    };

    const result = await collection.insertOne(user);

    // Retrieve the document
    const query = { name: 'John Doe' };
    const userDocument = await collection.findOne(query);
    console.log(userDocument);

  } catch (error) {
    console.error(error);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

run().catch(console.dir);
