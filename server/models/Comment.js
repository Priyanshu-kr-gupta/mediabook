const mongoose=require('mongoose');
const commentSchema= new mongoose.Schema({
    user_id:{
        type:String,
    },
    post_id:{
        type: String,
    },
    uname:{
        type:String,
    },
    comment:{
        type:String,
    },
    profilePhoto:{
        type:String,
    }
});

module.exports=mongoose.model('comments',commentSchema);