const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

//  MiddleWare

app.use(cors());
app.use(express.json());


const uri = "mongodb+srv://pawmart-db:P9S5Z8pZcg7Okyg7@firstdb.2rqimp0.mongodb.net/?appName=FirstDB";

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
        await client.connect();





        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('PawMart is running ')
});



app.listen(port, () => {
    console.log(`PawMart are running succesfully on port${port}`)
})