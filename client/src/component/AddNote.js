import React, { useContext } from "react";
import NoteContext from "../context/notes/NoteContext";
import { useState } from "react";

function AddNote(props) {
  const context = useContext(NoteContext);
  const {addNote} = context;
    const [note, setNote] = useState({title: "",description: "",tag: "",postImg:""});
    const handleSubmit = (e) => {
      e.preventDefault();
      // console.log(note.postImg)
      addNote(String(note.title), String(note.description), String(note.tag),String(note.postImg));
      setNote({title:"",description: "",tag: "",postImg:""})
    };
    const handleChange = (e) => {
      setNote({ ...note, [e.target.name]: [e.target.value] });

    };
    const convertToBase64 = (file) => {
      const fileReader =new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        setNote({...note, postImg: `${fileReader.result}`})
      };
}
  const HandleImage = (e) => {
      const file = e.target.files[0];
      // console.log( e.target.files[0])
      convertToBase64(file);
  }
  return (
    <div id="mb-5" className="container">
      <h2>Add New Post</h2>
      <form onSubmit={handleSubmit} method="post" encType="multipart/form-data">
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input name="title" type="text" className="form-control" id="title" value={note.title} onChange={handleChange} required/>
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <input name="description" type="text" className="form-control" id="description" value={note.description} onChange={handleChange} required/>
        </div>
        <div className="form-group">
          <label htmlFor="tag">Tag</label>
          <input name="tag" type="text" className="form-control" id="tag" value={note.tag} onChange={handleChange}/>
        </div>
        <div className="form-group">
          {/* <label htmlFor="tag"></label> */}
          {/* <input type="file" name="postImg" id="postImg" accept='.jpeg,.png,.jpg' onChange={(e) => {HandleImage(e)}} required /> */}
          <input name="postImg" type="file" className="form-control" id="postImg"  onChange={(e) => {HandleImage(e)}} required/>
        </div>
        <button type="submit" className="btn btn-warning">
        POST
        </button>
      </form>
      </div>
  )
}

export default AddNote
