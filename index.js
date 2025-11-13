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
    // await client.connect();

    const db = client.db('pawmart-db');
    const petsCollection = db.collection('pets-supplies');
    const ordersCollection = db.collection('orders')


    // Find all pets/supplies
    app.get("/pets-supplies", async (req, res) => {
      try {
        const result = await petsCollection.find().toArray();
        res.send(result);
      } catch (err) {
        res.status(500).send({ message: "Failed to load home listings" });
      }
    });


    // Find Latest Limit Data for home
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


    // POST A Single Data (Add Listing)
    app.post("/pets-supplies", async (req, res) => {
      const data = req.body
      console.log(data)
      const result = await petsCollection.insertOne(data)
      res.send(result);

    });

    app.get("/orders", async (req, res) => {
      try {
        const email = req.query.email;
        if (!email) {
          return res.status(400).send({ message: "Missing email query parameter" });
        }
        const orders = await ordersCollection.find({ email }).toArray();
        return res.send(orders);
      } catch (err) {
        console.error(err);
        return res.status(500).send({ message: "Failed to load orders" });
      }
    });

    // Create new Order and POST
    app.post("/orders", async (req, res) => {
      try {
        const orderData = req.body;
        if (!orderData || Object.keys(orderData).length === 0) {
          return res.status(400).send({ message: "Empty order data" });
        }
        const result = await ordersCollection.insertOne(orderData);
        return res.send({ insertedId: result.insertedId });
      } catch (err) {
        console.error(err);
        return res.status(500).send({ message: "Failed to submit order" });
      }
    });


    // await client.db("admin").command({ ping: 1 });
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