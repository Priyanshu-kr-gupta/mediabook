import React,{useEffect, useState,useContext} from 'react'
import { BiComment} from "react-icons/bi";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import {Link} from "react-router-dom"
import "./routeComponents/css/Post.css"
// import queryString from "query-string"
// import NoteContext from '../context/notes/NoteContext';
function GlobalNoteitem(props) {
      // const context=useContext(NoteContext)
      // const {data}=context
      const {note}=props;
      const [postUser,setPostUser]=useState({name:"",profilePhoto:""})
      const [likeCount, setLikeCount] = useState(0);
      const [like, setLike] = useState(false);
      const userId=localStorage.getItem("uid")

      const host = process.env.REACT_APP_HOST;
      // const host="http://localhost:5000"

      const handleLikes = async () => {
          try {
            if (!like) {
                    setLike(true);
                    setLikeCount(likeCount+1);
                    const heart = document.getElementById(note._id);
                    heart.style.animation="heartBeat 1s";
                    setTimeout(() => {
                      heart.style.animation = "";
                    }, 1000);
                  } else {
                    setLike(false);
                    setLikeCount(likeCount-1);
                    const heart = document.getElementById(note._id+"1");
                    heart.style.animation="heartBeat 1s";
                    setTimeout(() => {
                      heart.style.animation = "";
                    }, 1000);
                  }
            const response = await fetch(host+"/api/notes/like",{
              method:'POST',
              headers:{
                "Content-Type": "application/json"
              },
              body:JSON.stringify({postId:note._id,userId:userId})
            })
            const json=await response.json()
            const data=json.success
              // if (data) {
              //     getLikeCount();
              // }
          } catch (error) {
              console.error('Error liking/unliking:', error);
          }
      };
  
      const getLikeCount = async () => {
          try {
              const response = await fetch(host+`/api/notes/getLikes/${note._id}`,{
                method:'GET',
                headers:{
                  "Content-Type": "application/json"
                }
              })
              const json=await response.json()
              const data=json.likeCount
              // console.log(data)
              setLikeCount(data);
          } catch (error) {
              console.error('Error getting like count:', error);
          }
      };
      const getLikeStatus = async () => {
        try {
            const response = await fetch(host+`/api/notes/getLikeStatus`,{
              method:'POST',
              headers:{
                "Content-Type": "application/json"
              },
              body:JSON.stringify({postId:note._id,userId:userId})
            })
            const json=await response.json()
            const data=json.status
            // console.log(data)
            setLike(data);
        } catch (error) {
            console.error('Error getting like count:', error);
        }
    };
  
      
      // const host="http://localhost:5000"
      const getUserDetails=async()=>{
        const res = await fetch(host+"/api/notes/getPostUser",{
          method:'POST',
          headers:{
            "Content-Type": "application/json"
          },
          body:JSON.stringify({id:note.userId})
      })
      // const response= await res.json()
      const json=await res.json()
      const data=json.user
        setPostUser({name:data.name,profilePhoto:data.profilePhoto})
        // console.log(json.user)
    }

    // const commentSection=async()=>{
    //   const res = await fetch(host+"/api/notes/getPostUser",{
    //     method:'POST',
    //     headers:{
    //       "Content-Type": "application/json"
    //     },
    //     body:JSON.stringify({id:note.userId})
    // })
    // // const response= await res.json()
    // const json=await res.json()
    // const data=json.user
    //   setPostUser({name:data.name,profilePhoto:data.profilePhoto})
    // }


    // const notes = queryString.stringify(note);
      useEffect(()=>{
        getUserDetails()
        getLikeCount()
        getLikeStatus()
      },[])
    return (
      <>
     
      <div className="post-container">
      {/* <div className="maiin">
        <div className="heart" id={note._id} >😍</div>
        <div className="heart" id={note._id+"1"} >🥺</div>
      </div> */}
      <div className="post-header">
          <img src={postUser.profilePhoto} alt="Profile" className="profile-photo"/>
          <div>
              <div className="username">{postUser.name}</div>
              <div className="post-date">{note.date}</div>
          </div>
          
      </div>
      <div className="postImage" style={{backgroundImage:`url(${note.postImg})`}}>
      
      <img src={note.postImg} alt="Post" className="post-image" onDoubleClick={handleLikes}/>
      </div>
      <div className="post-content">
          <p>{note.description}</p>
      </div>
      <div className="heart" id={note._id} >😍</div>
        <div className="heart" id={note._id+"1"} >🥺</div>
      <div className="interactions">
          <div className="like-btn">
          {like ? (
                <>
                <AiFillHeart size={30} className="text-danger" onClick={handleLikes} style={{ cursor: "pointer" }}/>{likeCount}</>) : (
                <>
                <AiOutlineHeart size={30} onClick={handleLikes} style={{ cursor: "pointer" }}/>{likeCount}</>
              )}
          </div>
          <div className="comment-btn">
          <Link to={`/Post/${note._id}`} className='searchUser'><BiComment size={30} style={{ cursor: "pointer" }} /></Link>
          </div>
          
      </div>  
    </div>




        {/* <div className="card bg-dark text-warning ml-1 mb-1 noteItem " style={{height:"440px"}} >
              <div className="card-body">
                <div className="card-header d-flex">
                <img src={postUser.profilePhoto} alt="" width="45px" height="45px" className='mx-4 rounded-circle'/>
              <h4 className="card-title text-light my-2" >{postUser.name}</h4> */}
              {/* <h6 className="card-title text-light my-3" >{extractDateFromTimestamp(note.date)}</h6> */}
              {/* <h4 className="card-title text-light mx-3 my-2" >{note.date.split("-")[2]}</h4> */}
              {/* </div> */}
                {/* <h4 className="card-title text-light" >{note.title}</h4> */}
                {/* <div className="noteImg" style={{backgroundImage:`url(${note.postImg})`,height:"50%",width:"100%",backgroundSize:"cover"}} onDoubleClick={handleLikes}></div> */}
                {/* <p className="card-text text-warning">
                  {note.description}
                </p>
                <div className="card-footer d-flex justify-content-between align-items">
                  <div> */}
            {/* {like ? (
              <>
              <AiFillHeart size={30} className="text-danger" onClick={handleLikes} style={{ cursor: "pointer" }}/>{likeCount}</>) : (
              <>
              <AiOutlineHeart size={30} onClick={handleLikes} style={{ cursor: "pointer" }}/>{likeCount}</>
            )}
            </div> */}

            {/* <Link to={`/Post/${note._id}`} className='searchUser'><BiComment size={30} style={{ cursor: "pointer" }} /></Link> */}
            {/* <BiComment size={30} style={{ cursor: "pointer" }} onClick={commentSection}/> */}
          {/* </div>
              </div>
          </div> */}
         
          </>
    )
}

export default GlobalNoteitem
