import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import "./css/Comment.css";

const Post = () => {
  const post = useParams();
  const postId = post.noteId;
  const userId = localStorage.getItem("uid");
  const uname = localStorage.getItem("user");
  const [comment, setComment] = useState("");
  const [allComments, setAllComments] = useState([]);
  const [particularPost, setParticularPost] = useState({
    description: "",
    postImg: "",
    userId: null,
    date: null,
  });
  const [postUser, setPostUser] = useState({ name: "", profilePhoto: "" });
  const [likeCount, setLikeCount] = useState(0);
  const [like, setLike] = useState(false);
  const [time, setTime] = useState("");
  const [commentUser, setCommentUser] = useState({})
  const host = process.env.REACT_APP_HOST;
  const addComment = (e) => {
    e.preventDefault();
    fetch(host + "/api/notes/add_comment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ postId, userId, uname, comment,postImg:postUser.profilePhoto }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setComment("");
          setAllComments(
            allComments.concat({
              user_id: userId,
              post_id: postId,
              uname,
              comment,
              profilePhoto:postUser.profilePhoto
            })
          );
        }
      });
  };
  const getComments = async () => {
    const getNotes = await fetch(host + `/api/notes/get_comments/${postId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await getNotes.json();
    setAllComments(data.comments);
  };

  const getCommentUser=async(commentUser)=>{
    const res = await fetch(host+"/api/notes/getPostUser",{
      method:'POST',
      headers:{
        "Content-Type": "application/json"
      },
      body:JSON.stringify({id:commentUser})
  })
  // const response= await res.json()
  const json=await res.json()
  const data=json.user
  // console.log(commentUser)
  // setCommentUser(data)
    // console.log(json.user)
}

  const getPost = async () => {
    const res = await fetch(host + "/api/notes/getParticularNote", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ post_id: postId }),
    });
    const json = await res.json();
    const data = json.particularnote;
    setParticularPost({
      description: data.description,
      postImg: data.postImg,
      userId: data.userId,
      date: data.date,
    });
    userAuthenticate(data.userId);
    // timestamp(data.date);
  };

  const userAuthenticate = async (uid) => {
    const res = await fetch(host + "/api/notes/getPostUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: uid }),
    });
    const json = await res.json();
    const data = json.user;
    // console.log(data)
    setPostUser({ name: data.name, profilePhoto: data.profilePhoto });
    // console.log(data.name)
  };

  const handleLikes = async () => {
    try {
      if (!like) {
        setLike(true);
      } else {
        setLike(false);
      }
      const response = await fetch(host + "/api/notes/like", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ postId, userId }),
      });
      const json = await response.json();
      const data = json.success;
      if (data) {
        getLikeCount();
      }
    } catch (error) {
      console.error("Error liking/unliking:", error);
    }
  };

  const getLikeCount = async () => {
    try {
      const response = await fetch(host + `/api/notes/getLikes/${postId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const json = await response.json();
      const data = json.likeCount;
      setLikeCount(data);
    } catch (error) {
      console.error("Error getting like count:", error);
    }
  };
  const getLikeStatus = async () => {
    try {
      const response = await fetch(host + `/api/notes/getLikeStatus`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ postId, userId }),
      });
      const json = await response.json();
      const data = json.status;
      setLike(data);
    } catch (error) {
      console.error("Error getting like count:", error);
    }
  };

  // const timestamp = (dt) => {
  //   const dateObject = new Date(dt);
  //   const year = dateObject.getFullYear();
  //   const month = dateObject.getMonth() + 1; // Months are zero-based, so add 1
  //   const date = dateObject.getDate();
  //   const tt = date + "-" + month + "-" + year;
  //   setTime(tt);
  // };
  useEffect(() => {
    getPost();
    getComments();
    getLikeCount();
    getLikeStatus();
  }, []);
  return (
    // <>
    //   <div className="post-container">
    //       <div className="post-header">
    //         <img
    //           src={postUser.profilePhoto}
    //           alt="Profile"
    //           className="profile-photo"
    //         />
    //       <div>
    //           <div className="username">{postUser.name}</div>
    //           <div className="post-date">{time}</div>
    //         </div>
    //       </div>
    //       <div
    //         className="postImage"
    //         style={{ backgroundImage: `url(${particularPost.postImg})` }}
    //       >
    //         <img
    //           src={particularPost.postImg}
    //           alt="Post"
    //           className="post-image"
    //           onDoubleClick={handleLikes}
    //         />
    //       </div>
    //       <div className="post-content">
    //         <p>{particularPost.description}</p>
    //       </div>
    //       <div className="interactions">
    //         <div className="like-btn">
    //           {like ? (
    //             <>
    //               <AiFillHeart
    //                 size={30}
    //                 className="text-danger"
    //                 onClick={handleLikes}
    //                 style={{ cursor: "pointer" }}
    //               />
    //               {likeCount}
    //             </>
    //           ) : (
    //             <>
    //               <AiOutlineHeart
    //                 size={30}
    //                 onClick={handleLikes}
    //                 style={{ cursor: "pointer" }}
    //               />
    //               {likeCount}
    //             </>
    //           )}
    //         </div>
    //         <div className="comment-btn">Comment</div>
    //       </div> 
    //       </div>
          
     <>
       <div className="comment-main">
       <div className="comment-post-container">
      {/* <div className="maiin">
        <div className="heart" id={note._id} >😍</div>
        <div className="heart" id={note._id+"1"} >🥺</div>
      </div> */}
      <div className="post-header">
          <img src={postUser.profilePhoto} alt="Profile" className="profile-photo"/>
          <div>
              <div className="username">{postUser.name}</div>
              <div className="post-date">{particularPost.date}</div>
          </div>
          
      </div>
      <div className="postImage" style={{backgroundImage:`url(${particularPost.postImg})`}}>
      
      <img src={particularPost.postImg} alt="Post" className="post-image" onDoubleClick={handleLikes}/>
      </div>
      <div className="post-content">
          <p>{particularPost.description}</p>
      </div>
      <div className="heart" id={particularPost._id} >😍</div>
        <div className="heart" id={particularPost._id+"1"} >🥺</div>
       <div className="interactions">
         <div className="like-btn">
               {like ? (
                 <>
                   <AiFillHeart
                     size={30}
                     className="text-danger"
                     onClick={handleLikes}
                     style={{ cursor: "pointer" }}
                   />
                   {likeCount}
                 </>
               ) : (
                 <>
                   <AiOutlineHeart
                     size={30}
                     onClick={handleLikes}
                     style={{ cursor: "pointer" }}
                   />
                   {likeCount}
                 </>
               )}
             </div>
          <div className="comment-btn">
          </div>
          
      </div>  
    </div>

        <div className="comment-container">
          <div className="comment-post-header">
            <div className="comment-p">
              <p>Comments</p>
            </div>
          </div>
          
         

          <div className="comments-show">
            <div id="section">
              {allComments.slice(0).reverse().map((comments, index) => (
              <div key={index} className="comment-section" onLoad={()=>{getCommentUser(comments.user_id)}}>
                <div className="comment-img">
                  <img src={comments.profilePhoto} alt="" />
                </div>
                <div className="comment-body">
                  <p className="name">{comments.uname}</p>
                  <span>{comments.comment}</span>
                </div>
              </div>
              ))}
            </div>
          </div>
          <form onSubmit={addComment}>
          <div className="add-section">
            <textarea 
            required
            minLength="3"
            type="text"
            value={comment}
             id="" 
             placeholder="Add a comment..."
             onChange={(e) => setComment(e.target.value)}
             style={{ height: "35px", width: "80%",border:"1px solid rgba(0, 0, 0, 0.1)",padding:"2%",height:"100%",resize:"none",outline:"none" }}
             />
            <br />
            <button type="submit">➡️</button>
            </div>
          </form>
        </div>
      </div>
    </> 
  );
};

export default Post;
