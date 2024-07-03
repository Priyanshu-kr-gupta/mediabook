const connectDb=require('./db/Connect')
const express=require('express')
var cors = require('cors')
require('dotenv').config();
const bodyParser = require('body-parser');
// connection with mongo
// connectDb("mongodb+srv://someshgupta9234:somesh%4091@cluster1.95fp9ij.mongodb.net/notebook")
// connectDb("mongodb+srv://someshgupta9234:somesh%4091@mediabook.vn7jjjh.mongodb.net/mediabook")
connectDb("mongodb://localhost:27017/mediabook")
// app and port
const app=express();
const port= process.env.PORT || 5000;

// Middlewares
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(express.json({ limit: '50mb', extended: true }))
app.use(express.json())
app.use(
  cors()
);

// Available Routes
app.use('/api/auth',require("./routes/Auth"))
app.use('/api/notes',require("./routes/Notes"))
app.use('/api/user',require('./routes/Search'))

app.get('/',(req,res)=>{
    res.send("<h1>Hello World</h1>")
})


// running port
app.listen(port,()=>{
    console.log(" App is succesfully running on port " + port)
})

