import { useState } from "react";
import NoteContext from "./NoteContext";

const NoteState = (props) => {
  // const host="https://inotebook-server-m9df.onrender.com" 
  const host=process.env.REACT_APP_HOST
  // const host="http://localhost:5000"
  const [notes, setNotes] = useState([]);
  const [data,setData] = useState(false)
  const [globalNote,setglobalNote]=useState([])
  const [user,setUser]=useState([])
  

  const getUser = async()=>{
    const response=await fetch(host+"/api/auth/getUser",{
            method:"POST",
            headers:{
                "Content-Type": "application/json",
                "auth-token": localStorage.getItem("auth-token")
            },
        })
        const json=await response.json()
        setUser(json.user)
        // console.log(json.user)
      }

  const globalNotes=async ()=>{
    const getglobalNotes= await fetch(host+"/api/notes/getglobalNotes",{
      method:"GET",
      headers:{
        "auth-token": localStorage.getItem("auth-token")
      },
    })
    const json= await getglobalNotes.json();
    setglobalNote(json.allglobalNotes)
    setData(true)
  }  


  const getAllNotes=async ()=>{
    const getNotes= await fetch(host+"/api/notes/allNotes",{
      method:"GET",
      headers:{
        "auth-token": localStorage.getItem("auth-token")
      },
    })
    const json= await getNotes.json();
    setNotes(json.allNotes)
    setData(true)
  }  




  // adding a new note
  const addNote= async (title,description,tag,postImg,alert)=>{
      setData(false)
     const res = await fetch(host+"/api/notes/createNote",{
      method:'POST',
      headers:{
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("auth-token")
      },
      body:JSON.stringify({title,description,tag,postImg})
    })
    if(res) props.showAlert("One note added succesfully","success")
    getAllNotes();
  }

  // delete a note
  const deleteNote=async (id)=>{
    setData(false)
    await fetch(host+"/api/notes/deleteNote/"+id,{
      method:'DELETE',
      headers:{
        "auth-token": localStorage.getItem("auth-token")
      }
    })
    getAllNotes()
  }

  // edit a note
  const updateNote= async (note,alert)=>{
    setData(false)
    const id=note.id;
    const title=String(note.utitle)
    const description=String(note.udescription)
    const tag=String(note.utag)
    const postImg=String(note.upostImg)
    const res = await fetch(host+"/api/notes/editNote/"+id,{
      method:'PUT',
      headers:{
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("auth-token")
      },
      body:JSON.stringify({title,description,tag,postImg})
    })
    if(res) props.showAlert("One note updated successfully","success")
    getAllNotes();

  }





  return (
    <NoteContext.Provider value={{data,notes ,addNote, deleteNote, updateNote, getAllNotes,globalNotes,globalNote,setglobalNote,user,getUser}}>
      {props.children}
    </NoteContext.Provider>
  );
};

export default NoteState;
