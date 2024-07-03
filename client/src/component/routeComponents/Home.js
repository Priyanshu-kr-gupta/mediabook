import GlobalNoteItem from "../globalNoteitem";
import NoteContext from "../../context/notes/NoteContext";
import React,{useContext,useEffect} from "react";
import {useNavigate} from "react-router-dom"
import "./css/home.css"
function Home() {
  // console.log("object")
  const navigate = useNavigate()
  const context = useContext(NoteContext);
  const { globalNote,globalNotes,getUser,data} = context;
  
  useEffect(() => {
      if(localStorage.getItem("auth-token")){
          globalNotes();
          getUser();
      }
      else{
          navigate('/login')
      }
  }, []);
  // console.log(globalNote)
  return (
    <>
  {!data? 
       <center>
       <div className="spinner-grow text-dark" role="status" style={{width: "3rem", height: "3rem"}}>
        <span className="sr-only">Loading...</span>
      </div>
       </center>
      : 
      // d-flex flex-wrap
<div className="notes">
        {/* <center style={notes.length===0?{display:"contents"}:{display:"none"}}><p>No Notes to display!!</p></center> */}
        {globalNote.map((note) => {
          return (
            <GlobalNoteItem
              key={note._id}
              note={note}        
            />
          );
        })}
      </div>
     }
    </>
  );
}

export default Home;
