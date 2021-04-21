const express = require('express');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();
const fileUpload = require('express-fileupload');

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ooeef.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static('service'));
app.use(fileUpload());

const port = 5000;

app.get('/', (req, res) => {
    res.send("db connected");
})

client.connect(err => {
    const adminsCollection = client.db(process.env.DB_NAME).collection("admins");
    const usersCollection = client.db(process.env.DB_NAME).collection("users");
    const servicesCollection = client.db(process.env.DB_NAME).collection("services");
    const pricesCollection = client.db(process.env.DB_NAME).collection("prices");
    const ordersCollection = client.db(process.env.DB_NAME).collection("orders");
    const reviewsCollection = client.db(process.env.DB_NAME).collection("reviews");

    app.post('/addService', (req, res) => {
        // console.log(req.body);
        const service = req.body;
        // console.log(service);
        servicesCollection.insertOne(service)
            .then(result => res.send(result.insertedCount > 0))
            .catch(error => console.log(error))
    })

    app.post('/addPrice', (req, res) => {
        // console.log(req.body);
        const price = req.body;
        // console.log(service);
        pricesCollection.insertOne(price)
            .then(result => res.send(result.insertedCount > 0))
            .catch(error => console.log(error))
    })

    app.post('/addAdmin', (req, res) => {
        // console.log(req.body);
        const admin = req.body;
        // console.log(service);
        adminsCollection.insertOne(admin)
            .then(result => res.send(result.insertedCount > 0))
            .catch(error => console.log(error))
    })

    app.post('/addReview', (req, res) => {
        // console.log(req.body);
        const review = req.body;
        // console.log(service);
        reviewsCollection.insertOne(review)
            .then(result => res.send(result.insertedCount > 0))
            .catch(error => console.log(error))
    })

    app.post('/addOrder', (req, res) => {
        // console.log(req.body);
        const order = req.body;
        // console.log(service);
        ordersCollection.insertOne(order)
            .then(result => res.send(result.insertedCount > 0))
            .catch(error => console.log(error))
    })

    app.post('/isAdmin', (req, res) => {
        const email = req.body.email;
        adminsCollection.find({email: email})
        .toArray((err, admins) => {
            res.send(admins.length > 0);
        })
    })

    app.get('/services', (req, res) => {
        servicesCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    })

    app.get('/prices', (req, res) => {
        pricesCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    })

    app.get('/reviews', (req, res) => {
        reviewsCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    })

    app.get('/orders', (req, res) => {
        ordersCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    })

    app.get('/myOrders/:email', (req, res) => {
        ordersCollection.find({email:req.params.email})
        .toArray((err,documents) => {
            res.send(documents);
        })
    })

    app.get('/getOrder/:id', (req, res) => {
        ordersCollection.find({_id: ObjectId(req.params.id)})
        .toArray((err,documents) => {
            // console.log(documents)
            res.send(documents);
        })
    })

    app.patch('/updateOrder/:id', (req, res) => {
        // const status = req.query.status;
        // console.log(status);
        ordersCollection.updateOne({_id: ObjectId(req.params.id)},
        {
            $set: {status: req.query.status}
        })
        .then(result => console.log("Order Updated"))
    })

    app.delete('/deleteService/:id', (req, res) => {
        servicesCollection.deleteOne({_id: ObjectId(req.params.id)})
        .then(result => console.log("Service Deleted"))
    })

    app.delete('/deletePrice/:id', (req, res) => {
        pricesCollection.deleteOne({_id: ObjectId(req.params.id)})
        .then(result => console.log("Price Deleted"))
    })
});

app.listen(process.env.PORT || 5000);