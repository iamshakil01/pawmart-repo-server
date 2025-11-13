const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
require("dotenv").config();
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
    const db = client.db('pawmart-db');
    const petsCollection = db.collection('pets-supplies');
    const ordersCollection = db.collection('orders');
    const listingsCollection = db.collection('listings');

    app.get("/pets-supplies", async (req, res) => {
      const result = await petsCollection.find().toArray();
      res.send(result);
    });

    app.get("/pets-supplies/home", async (req, res) => {
      const result = await petsCollection.find().sort({ _id: -1 }).limit(6).toArray();
      res.send(result);
    });

    app.get("/pets-supplies/:id", async (req, res) => {
      const { id } = req.params;
      const result = await petsCollection.findOne({ _id: new ObjectId(id) });
      res.send(result);
    });

    app.post("/pets-supplies", async (req, res) => {
      const data = req.body;
      const result = await petsCollection.insertOne(data);
      res.send(result);
    });

    app.get("/orders", async (req, res) => {
      const email = req.query.email;
      const orders = await ordersCollection.find({ email }).toArray();
      res.send(orders);
    });

    app.post("/orders", async (req, res) => {
      const orderData = req.body;
      const result = await ordersCollection.insertOne(orderData);
      await listingsCollection.insertOne(orderData);
      res.send({ insertedId: result.insertedId });
    });

    app.get("/listings", async (req, res) => {
      const email = req.query.email;
      const listings = await listingsCollection.find({ email }).toArray();
      res.send(listings);
    });

    // ✅ DELETE listing
    app.delete("/listings/:id", async (req, res) => {
      const { id } = req.params;
      const result = await listingsCollection.deleteOne({ _id: new ObjectId(id) });
      res.send(result);
    });

    // ✅ UPDATE listing
    app.put("/listings/:id", async (req, res) => {
      const { id } = req.params;
      const updated = req.body;
      const result = await listingsCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updated }
      );
      res.send(result);
    });

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
