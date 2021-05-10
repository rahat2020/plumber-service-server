const express = require('express')
const cors = require('cors');
const app = express()
require('dotenv').config()
const port = process.env.PORT || 4000


app.use(cors());
app.use(express.urlencoded({extended: false}))
app.use(express.json())
console.log(process.env.DB_USER)

app.get('/', (req, res) => {
  res.send('Hello World!')
})

const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qmrg2.mongodb.net/${process.env.DB_Name}?retryWrites=true&w=majority`;
// console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const productCollection = client.db("product").collection("items");
  const reviewCollection = client.db("product").collection("review");

  ///product uploading to the database
   app.post('/addProduct', (req, res) => {
     const product = req.body;
     productCollection.insertOne(product)
     .then(result => {
       console.log(result.insertedCount > 0)
       res.send(result.insertedCount > 0)
     })
   })

  // showing the product in the UI
  app.get('/products', (req, res) => {
    productCollection.find({id: req.params._id})
    .toArray((error, documents)=>{
      res.send(documents)
    })
  })
   
  //review adding to the database
  app.post('/addReview', (req, res)=>{
    const review = req.body;
    reviewCollection.insertOne(review)
    .then((result)=>{
        res.send(result.insertedCount > 0)
        console.log(result.insertedCount > 0)
    })
  })

  //showing the review to the UI
  app.get('/reviews', (req,res)=>{
    reviewCollection.find({id:req.params._id})
    .toArray((err, documents)=>{
      res.send(documents)
    })
  })
   ///database connection checking by this console
   console.log('database connected successfully')

});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})