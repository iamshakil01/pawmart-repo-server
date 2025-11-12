const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
require("dotenv").config()
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@firstdb.2rqimp0.mongodb.net/?appName=FirstDB`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();

    const db = client.db('pawmart-db');
    const petsCollection = db.collection('pets-supplies');



    // Find
    app.get("/pets-supplies", async (req, res) => {
      try {
        const result = await petsCollection.find().toArray();
        res.send(result);
      } catch (err) {
        res.status(500).send({ message: "Failed to load home listings" });
      }
    });



    // Find Latest Limit Data
    app.get("/pets-supplies/home", async (req, res) => {
      try {
        const result = await petsCollection.find().sort({ _id: -1 }).limit(6).toArray();
        res.send(result);
      } catch (err) {
        res.status(500).send({ message: "Failed to load home listings" });
      }
    });


    // Find A Single Data
    app.get("/pets-supplies/:id", async (req, res) => {
      try {
        const { id } = req.params
        const result = await petsCollection.findOne({ _id: new ObjectId(id) })
        res.send(result);
      } catch (err) {
        res.status(500).send({ message: "Failed to load home listings" });
      }
    });


    // POST A Single Data
    app.post("/pets-supplies", async (req, res) => {
      const data = req.body
      console.log(data)
      const result = await petsCollection.insertOne(data)
      res.send(result);

    });


    await client.db("admin").command({ ping: 1 });
    console.log("Connected Ping");
  } catch (err) {
    console.error("MongoDB connection failed", err);
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('PawMart is running');
});

app.listen(port, () => {
  console.log(`PawMart is running successfully on port ${port}`);
});
