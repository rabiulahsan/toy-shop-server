const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;
app.use(cors())
app.use(express.json());
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASS}@cluster0.9ylecqg.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    //database collection
    const toyCollection = client.db("toy-shop").collection("allToys");

    //get all toys
    app.get("/", async (req, res) => {
      const result = await toyCollection.find().toArray();
      res.send(result);
    });

    //get specific toys by id
    app.get("/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: new ObjectId(id) };
      const result = await toyCollection.findOne(query);
      res.send(result);
    });


 

    //post a toy
    app.post("/", async (req, res) => {
      const toyDetails = req.body;
      console.log(toyDetails);

      const result = await toyCollection.insertOne(toyDetails);
      res.send(result);
    });

    //put a toy
    app.put('/:id', async(req, res) => {
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)}
      const options = { upsert: true };
      const updatedToy = req.body;
console.log(updatedToy);
      const toy = {
          $set: {
              ...updatedToy
          }
      }

      const result = await toyCollection.updateOne(filter, toy, options);
      res.send(result);
  })

    //get toys by email
    // app.get("/mytoys", async (req, res) => {
    //   console.log(req.query);

    //   let query = {};
    //   if (req.query?.email) {
    //     query = {
    //       email: req.query.email,
    //     };
    //   }
    //   const cursor = toyCollection.find(query);
    //   const result = await cursor.toArray();
    //   res.send(result);
    // });

    //delete

    app.delete("/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await toyCollection.deleteOne(query);
      res.send(result);
    });

    //update a toy
    // app.put("/:id", async (req, res) => {
    //   const id = req.params.id;
    //   const toyDetails = req.body;

    //   console.log(id, user);

    //   const filter = { _id: new ObjectId(id) };
    //   const options = { upsert: true };
    //   const updatedToyDetails = {
    //     $set: {
    //       ...toyDetails,
    //     },
    //   };

    //   const result = await userCollection.updateOne(
    //     filter,
    //     updatedToyDetails,
    //     options
    //   );
    //   res.send(result);
    // });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`running on ${port}`);
});
