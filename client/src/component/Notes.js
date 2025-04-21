import "../component/routeComponents/css/notes.css";
import React, { useContext, useEffect, useRef, useState } from "react";
import NoteContext from "../context/notes/NoteContext";
import { useNavigate } from "react-router-dom";

function Notes() {
  const navigate = useNavigate();
  const context = useContext(NoteContext);
  const { data, notes, getAllNotes, updateNote, deleteNote, getUser } = context;

  const [unote, setunote] = useState({
    id: "",
    utitle: "",
    udescription: "",
    utag: "",
    upostImg: ""
  });

  const [selectedNote, setSelectedNote] = useState(null);

  const updateRef = useRef(null);
  const optionsRef = useRef(null);

  useEffect(() => {
    if (localStorage.getItem("auth-token")) {
      getUser();
      getAllNotes();
    } else {
      navigate("/login");
    }
    // eslint-disable-next-line
  }, []);

  const openUpdateModal = (note) => {
    updateRef.current.click();
    setunote({
      id: note._id,
      utitle: note.title,
      udescription: note.description,
      utag: note.tag,
      upostImg: note.postImg
    });
  };

  const openOptionsModal = (note) => {
    setSelectedNote(note);
    optionsRef.current.click();
  };

  const handleChange = (e) => {
    setunote({ ...unote, [e.target.name]: e.target.value });
  };

  const handleUpdateClick = (e) => {
    e.preventDefault();
    updateNote(unote);
    updateRef.current.click();
  };

  const handleDeleteClick = () => {
    if (selectedNote) {
      deleteNote(selectedNote._id);
      optionsRef.current.click();
    }
  };

  const convertToBase64 = (file) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = () => {
      setunote({ ...unote, upostImg: fileReader.result });
    };
  };

  const HandleImage = (e) => {
    const file = e.target.files[0];
    if (file) convertToBase64(file);
  };

  return (
    <div className="container py-4">
      {/* Hidden modal triggers */}
      <button
        type="button"
        ref={updateRef}
        className="btn d-none"
        data-toggle="modal"
        data-target="#updateModal"
      >
        Launch Update Modal
      </button>
      
      <button
        type="button"
        ref={optionsRef}
        className="btn d-none"
        data-toggle="modal"
        data-target="#optionsModal"
      >
        Launch Options Modal
      </button>

      {/* Update Modal */}
      <div
        className="modal fade"
        id="updateModal"
        tabIndex="-1"
        aria-labelledby="updateModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Update Post</h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <form>
                <input
                  name="utitle"
                  type="text"
                  placeholder="Title"
                  className="form-control my-2"
                  value={unote.utitle}
                  onChange={handleChange}
                />
                <input
                  name="udescription"
                  type="text"
                  placeholder="Description"
                  className="form-control my-2"
                  value={unote.udescription}
                  onChange={handleChange}
                />
                <input
                  name="utag"
                  type="text"
                  placeholder="Tag"
                  className="form-control my-2"
                  value={unote.utag}
                  onChange={handleChange}
                />
                <input
                  name="upostImg"
                  type="file"
                  className="form-control my-2"
                  onChange={HandleImage}
                />
              </form>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-dismiss="modal"
              >
                Close
              </button>
              <button
                type="submit"
                className="btn btn-warning"
                onClick={handleUpdateClick}
              >
                Update Post
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Options Modal */}
      <div
        className="modal fade"
        id="optionsModal"
        tabIndex="-1"
        aria-labelledby="optionsModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered modal-sm">
          <div className="modal-content">
            <div className="modal-body p-0">
              <div className="options-list">
                <button
                  className="option-item"
                  onClick={() => {
                    optionsRef.current.click();
                    if (selectedNote) openUpdateModal(selectedNote);
                  }}
                >
                  Edit
                </button>
                <button
                  className="option-item text-danger"
                  onClick={handleDeleteClick}
                >
                  Delete
                </button>
                <button
                  className="option-item border-top"
                  data-dismiss="modal"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Posts Grid */}
      <h2 className="profile-title mb-2">Your Posts</h2>
      <hr />
      {!data ? (
        <div className="text-center">
          <div
            className="spinner-border text-dark"
            role="status"
            style={{ width: "3rem", height: "3rem" }}
          >
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="instagram-grid mb-5">
          {notes.length === 0 ? (
            <p className="text-center">No Posts to display!</p>
          ) : (
            notes.map((note) => (
              <div 
                className="instagram-grid-item" 
                key={note._id}
                onClick={() => openOptionsModal(note)}
              >
                <div className="grid-image">
                  <img
                    src={note.postImg || "https://via.placeholder.com/300"}
                    alt={note.title}
                  />
                </div>
                {note.tag && (
                  <div className="grid-tag">
                    #{note.tag}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default Notes;