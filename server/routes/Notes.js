  const express = require("express");
  const fetchUSer = require("../middleware/fetchUser");
  const router = express.Router();
  const Notes = require("../models/Notes");
  const Likes=require("../models/Likes")
  const User=require("../models/User");
  const Comments=require("../models/Comment")
const { set } = require("mongoose");
  // ROUTE 1: Creating a note using:POST on '/api/notes/createNote' ; Require authentication

  router.post("/createNote", fetchUSer, async (req, res) => {
    try {
      let userId = req.user.id;
      // let uname=req.user.uname;
      // const userbro = await User.find({_id: userId });
      let userbro = await User.findOne({ _id: userId });
    const uname=userbro.name
      const { title, description, tag ,postImg} = req.body;
      // console.log(postImg)
      const note = new Notes({ title, description, tag,userId,postImg,uname });
      await note.save();
      res.send({ msg: "New note added", note });
    } catch (error) {
      res.status(500).send({ error });
    }
  });

  // ROUTE 2: Get all notes using:GET on '/api/notes/allNotes' ; Require authentication

  router.get("/allNotes", fetchUSer, async (req, res) => {
    try {
      let userId = req.user.id;
      const allNotes = await Notes.find({ userId });
      res.send({allNotes});
    } catch (error) {
      res.status(404).send({ error: "No notes found for this user" });
    }
  });

  // ROUTE 3: Updating one note using:POST on '/api/notes/editNote' ; Require authentication

  router.put("/editNote/:id", fetchUSer, async (req, res) => {
    try {
      const { title, description, tag ,postImg} = req.body;

      // creating an object for the edited note
      let newNote = {};
      if (title) newNote.title = title;
      if (description) newNote.description = description;
      if (tag) newNote.tag = tag;
      if(postImg!="") newNote.postImg=postImg;

      const id = req.params.id;
      let note = await Notes.findById(id);
      if (!note) res.status(404).json({ error: "No notes found" });
      else {
        if (note.userId.toString() !== req.user.id)
          res.status(401).json({ error: "Access Denied" });
        note = await Notes.findByIdAndUpdate(
          id,
          { $set: newNote },
          { new: true }
        );
        res.send({ msg: "Note is updated", note });
      }
    } catch (error) {
      res.status(500).send({ error: "Internal Server error" });
    }
  });

  // ROUTE 4: Deleting one note using:POST on '/api/notes/deleteNote' ; Require authentication

  router.delete("/deleteNote/:id", fetchUSer, async (req, res) => {
    try {
      const id = req.params.id;
      let note = await Notes.findById(id);
      if (!note) res.status(404).json({ error: "No notes found with this id" });
      else {
        if (note.userId.toString() !== req.user.id){
          res.status(401).json({ error: "Access Denied" });
        }
        note = await Notes.findByIdAndDelete(id);
        res.send({ msg: "One note is deleted", note });
      }
    } catch (error) {
      res.status(500).send({ error });
    }
  });



  // ROUTE 5: getting all notes:POST on '/api/notes/getglobalNotes' ; 
  router.get("/getglobalNotes", async (req, res) => {
    try {
      const allglobalNotes = await Notes.find({ });
      res.send({allglobalNotes});
    } catch (error) {
      res.status(404).send({ error: "No notes found for this user" });
    }
  });

  router.post("/getParticularNote", async (req, res) => {
    try {
      const particularnote = await Notes.findById( req.body.post_id);
      res.send({particularnote});
    } catch (error) {
      res.status(404).send({ error: "No notes found for this user" });
    }
  });

  router.post('/getPostUser',async (req,res)=>{
    try {
         const userId=req.body.id;
        const user= await User.findById(userId).select("-password")
        // console.log(user)
        // console.log(user)
        res.send({user})
    } catch (error) {
        console.error(error.message)
        res.status(500).send({msg:"Internal Server Error"})
    }
})

router.post('/like', async (req, res) => {
  const { postId, userId } = req.body;

  try {
      const existingLike = await Likes.findOne({ post_id: postId, user_id: userId });

      if (!existingLike) {
          // If the user hasn't liked the post, insert the like
          await Likes.create({ post_id: postId, user_id: userId });
      } else {
          // If the user has already liked the post, delete the like
          await Likes.deleteOne({ post_id: postId, user_id: userId });
      }

      res.send({ success: true});
  } catch (err) {
      console.error('Error handling like/unlike:', err);
      res.status(500).send({ success: false, error: 'Internal Server Error' });
  }
});

router.get('/getLikes/:postId', async (req, res) => {
  const postId = req.params.postId;

  try {
      const likeCount = await Likes.countDocuments({ post_id: postId });
      res.json({ likeCount });
  } catch (err) {
      console.error('Error getting like count:', err);
      res.status(500).send({ error: 'Internal Server Error' });
  }
});


router.post('/getLikeStatus', async (req, res) => {
  const { postId, userId } = req.body;

  try {
      const existingLike = await Likes.findOne({ post_id: postId, user_id: userId });
      if (!existingLike) {
          // If the user hasn't liked the post, insert the like
          res.json({status:false})
      } else {
          // If the user has already liked the post, delete the like
          res.json({status:true})
      }
  } catch (err) {
      console.error('Error handling like/unlike:', err);
      res.status(500).send({ success: false, error: 'Internal Server Error' });
  }
});

router.post('/add_comment', async (req, res) => {
  const { postId, userId ,uname,comment,postImg} = req.body;

  try {
      await Comments.create({ user_id: userId, post_id: postId,uname,comment,profilePhoto:postImg});
      res.json({ success: true, message: 'Comment added successfully' });
  } catch (err) {
      console.error('Error handling comments', err);
      res.status(500).send({ success: false, error: 'Internal Server Error' });
  }
});

router.get('/get_comments/:postId', async(req, res) => {
  const postId = req.params.postId;
  const postComments = await Comments.find({ post_id: postId }).lean();
  res.json({ comments: postComments });
});


// router.post('/comment', async (req, res) => {
//   const { postId, userId ,comment} = req.body;

//   try {
//       await Comments.create({ post_id: postId, user_id: userId,comment });
//       res.send({ success: true});
//   } catch (err) {
//       console.error('Error handling comments', err);
//       res.status(500).send({ success: false, error: 'Internal Server Error' });
//   }
// });

// router.post('/getComment', async (req, res) => {
//   const { postId, userId } = req.body;
//   try {
//     const allComments = await Notes.find({ post_id: postId, user_id: userId});
//       res.send({allComments});
//   } catch (err) {
//       console.error('Error handling comments', err);
//       res.status(500).send({error: 'Internal Server Error' });
//   }
// });


// router.post('/setLikes',async (req,res)=>{
//   try {
//     const id=req.body.id
//     const count=req.body.count;
//     // console.log(id)
//     await Notes.findByIdAndUpdate(
//       {_id:id},
//       { $set: {likes:count}},
//       { new: true }
//     );
//     //  await Notes.findOneAndUpdate({_id: id}, {$set: {likes: count}}, {new: true});
//   } catch (error) {
//       console.error(error.message)
//       // res.status(500).send({msg:"Internal Server Error"})
//   }
// })



  router.get("/message", async (req, res) => {
    try {
      console.log("Its working")
      res.json("its working")
    } catch (error) {
      res.status(404).send({ error: "No msg found" });
    }
  });

  module.exports = router;