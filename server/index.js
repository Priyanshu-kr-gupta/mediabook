const connectDb=require('./db/Connect')
const express=require('express')
var cors = require('cors')
require('dotenv').config();
const bodyParser = require('body-parser');
const dblink=process.env.DBLINK || "mongodb://localhost:27017/mediabook"
connectDb(dblink)
const app=express();

const port= process.env.PORT || 5000;

app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(express.json({ limit: '50mb', extended: true }))
app.use(express.json())
app.use(
  cors()
);

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

