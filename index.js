const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()
const app = express();
const port = process.env.POET || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mgtwv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


app.get('/', (req, res) => {
    res.send("This is server for the car mechanicks.")
})

app.get('/hellow', (req, res) => {
    res.send('Hellow form Heroku')
})

client.connect(err => {
    const collection = client.db("test").collection("devices");
  });


async function run(){
    try{
        await client.connect();
        const database = client.db("carMechanic");
        const servicesCollection = database.collection("services");
         
        //get api
        app.get('/services', async (req, res) => {
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        })

        // dinamic api
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            console.log(req.params.id);
            const query = { _id: ObjectId(id) };
            const service = await servicesCollection.findOne(query);
            res.json(service);
        })


        //post api
        app.post('/services', async(req, res) => {
            const services = req.body;
            console.log('hit the post', services);
            
            const result = await servicesCollection.insertOne(services);
            console.log(result);
            res.json(result);
        })

        app.delete('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id)}
            const result = await servicesCollection.deleteOne(query)
            console.log(result);
        })



    }
    finally{

    }
};
run().catch(console.dir)




app.listen(port , () => {
    console.log('Running Server form port', port);
})