import React, { useContext, useEffect, useRef, useState } from "react";
import NoteContext from "../context/notes/NoteContext";
import NoteItem from "./NoteItem";
import { useNavigate } from "react-router-dom";



function Notes(props) {
  const navigate = useNavigate()
  const context = useContext(NoteContext);
  const { data, notes, getAllNotes,updateNote,getUser} = context;
  useEffect(() => {
      if(localStorage.getItem("auth-token")){
        getUser();
        getAllNotes();
      }
      else{
        navigate("/login")
      }
    // eslint-disable-next-line
  }, []);

  const [unote,setunote] = useState({id:"",utitle:"",udescription:"",utag:"",upostImg:""})
  const toggleUpdateNote=(note)=>{
    ref.current.click()
    setunote({...unote,id:note._id,utitle:note.title,udescription:note.description,utag:note.tag})
    document.getElementById("utitle").value=note.title
    document.getElementById("udescription").value=note.description
    document.getElementById("utag").value=note.tag
  }
  const ref = useRef(null)
  const handleChange=(e)=>{
    setunote({...unote,[e.target.name] : [e.target.value] })
  }
  const handleClick=(e)=>{
    e.preventDefault();
    updateNote(unote)
    console.log(unote)

    ref.current.click()
  }
  const convertToBase64 = (file) => {
    const fileReader =new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = () => {
      setunote({...unote, upostImg: `${fileReader.result}`})
    };
}
const HandleImage = (e) => {
    const file = e.target.files[0];
    // console.log( e.target.files[0])
    convertToBase64(file);
}

  return (
    <div className="container" style={{marginBottom:"20px"}}>
      {/* <AddNote></AddNote> */}
      <button type="button" ref={ref} className="btn d-none btn-primary" data-toggle="modal" data-target="#exampleModal">
        Launch demo modal
      </button>
      <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Update Post
              </h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <form >
                <div className="form-group">
                  <label htmlFor="utitle">Title</label>
                  <input name="utitle" type="text" className="form-control" id="utitle" onChange={handleChange}/>
                </div>
                <div className="form-group">
                  <label htmlFor="udescription">Description</label>
                  <input name="udescription" type="text" className="form-control" id="udescription" onChange={handleChange}/>
                </div>
                <div className="form-group">
                  <label htmlFor="ntag">Tag</label>
                  <input name="utag" type="text" className="form-control" id="utag" onChange={handleChange}/>
                </div>
                <div className="form-group">
                  {/* <label htmlFor="">Tag</label> */}
                  <input name="upostImg" type="file" className="form-control" id="upostImg" onChange={(e) => {HandleImage(e)}}/>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-dismiss="modal"
              >
                Close
              </button>
              <form>
                <button type="submit" className="btn btn-warning" onClick={handleClick}>
                  Update Post
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>


      <h2>Your Posts</h2>
      <hr/>
    <br/>
    <br/>
      {!data? 
       <center>
       <div className="spinner-grow text-dark" role="status" style={{width: "3rem", height: "3rem"}}>
        <span className="sr-only">Loading...</span>
      </div>
       </center>
      : 
      <>
      
      <div className="d-flex flex-wrap">
        <center style={notes.length===0?{display:"contents"}:{display:"none"}}><p>No Post to display!!</p></center>
        {notes.map((note) => {
          return (
            <NoteItem
              key={note._id}
              note={note}
              toggleUpdateNote={toggleUpdateNote}
            ></NoteItem>
          );
        })}
      </div>
      </>
      }
    </div>
  );
}

export default Notes;
