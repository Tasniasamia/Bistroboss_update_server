const express = require('express')
const app = express()

const port = 3650 || process.env.PORT;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
var cors = require('cors')
require('dotenv').config()
app.use(
  cors({
    origin: "*",
    methods: "GET,POST,PATCH,PUT,DELETE",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "*",
  })
);


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ioy1chb.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);

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
    // Send a ping to confirm a successful connection
    const database = client.db("Bistroboss");
    const movies = database.collection("menu");
    const userCollection=database.collection("userCollection");
    const alluser=database.collection("Alluser");
    //sign in data collection
    app.post('/Allusers',async(req,res)=>{
      const data=req.body;
      const email=data.email;
      const existuser=await alluser.findOne({email:email})
      console.log(existuser);
      if(existuser){
       return res.send({message : "The user is already exist"})
      }
      else{
        const result = await alluser.insertOne(data);
        res.send(result);
      }
    



    })
   
    //cart data insertion
    app.post('/users',async(req,res)=>{
      
      const data=req.body;
      console.log("dataall",data);
      const result = await userCollection.insertOne(data);
      res.send(result);

    })

    //delete from user select cart
    app.delete('/user/:id',async(req,res)=>{
      const id=req.params.id;
      const _id={_id:new ObjectId(id)};
      const result = await userCollection.deleteOne(_id);
      res.send(result);

    })
    //delete from alluser data
    app.delete('/Allusers/:id',async(req,res)=>{
      const id=req.params.id;
      const _id={_id:new ObjectId(id)};
      const result = await alluser.deleteOne(_id);
      res.send(result);

    })
    //update user into alluser data
    app.patch('/UserRoleUpdate/:id',async(req,res)=>{
      const id=req.params.id;
      const query={_id:new ObjectId(id)};
      const updateDoc = {

        $set: {
  
         role:"Admin"
  
        },
  
      };

      const result = await alluser.updateOne(query, updateDoc);
      res.send(result);

    })
    //menu data collectiion
    app.get('/menudata',async(req,res)=>{
        
        const result=await movies.find().toArray();
        res.send(result);
    })
    //find cart data as email wise
    app.get('/cart',async(req,res)=>{
      const email=req?.query?.email;
      const result=await userCollection.find({email:email}).toArray();
      res.send(result);
      
    })
    //upload all users data
    app.get('/AllusersData',async(req,res)=>{
      const result=await alluser.find().toArray();
      res.send(result);
 
 
     })
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})