const express=require('express')
require('dotenv').config();
var cors = require('cors')
const app=express();
const port= process.env.PORT || 5000;
const connectDb=require('./db/Connect')
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const dblink=process.env.DBLINK || "mongodb://localhost:27017/mediabook"
// const dblink="mongodb://localhost:27017/mediabook"
app.use(
  cors() 
);


app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(express.json({ limit: '50mb', extended: true }))
app.use(express.json())
app.use(fileUpload({
  useTempFiles :true,
}));

// app.use((req, res, next) => {
//   console.log(`Request received: ${req.method} ${req.url}`);
//   next();
// });



app.use('/api/auth',require("./routes/Auth"))
app.use('/api/notes',require("./routes/Notes"))
app.use('/api/user',require('./routes/Search'))



// running port
app.listen(port,()=>{
  console.log(" App is succesfully running on port " + port)
})
connectDb(dblink)

