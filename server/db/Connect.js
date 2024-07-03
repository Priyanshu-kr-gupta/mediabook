const mongoose=require('mongoose')

const connectDb= async (dbUrl)=>{
    try{
        await mongoose.connect(dbUrl);
        console.log("Database Connection Successfull..");
    }
    catch(err){
        console.log(err);
    }
}
module.exports= connectDb;