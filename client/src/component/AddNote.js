import "./routeComponents/css/addnote.css";
import React, { useContext, useState, useEffect } from "react";
import NoteContext from "../context/notes/NoteContext";
import { useNavigate } from 'react-router-dom';
import imageCompression from 'browser-image-compression';

function AddNote() {
  const navigate = useNavigate();
  const context = useContext(NoteContext);
  const { addNote } = context;
  const [note, setNote] = useState({ title: "", description: "", tag: "", postImg: null });
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("auth-token")) {
      navigate("/login");
    }
    
    // Cleanup preview URL when component unmounts
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("title", note.title);
    formData.append("description", note.description);
    formData.append("tag", note.tag);
    // formData.append("postImg", note.postImg);
    if (note.postImg) {
      const postImgFile = note.postImg;
      try {
          const compressedFile = await imageCompression(postImgFile, {
          maxSizeMB: 4, 
          maxWidthOrHeight: 1024, 
          useWebWorker: true, 
        });

        formData.append('postImg', compressedFile);
      } catch (error) {
        console.error('Image compression failed:', error);
      }
    }


    try {
      await addNote(formData);
      setNote({ title: "", description: "", tag: "", postImg: null });
      setPreviewUrl(null);
    } catch (error) {
      console.error("Error adding note:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setNote({ ...note, [e.target.name]: e.target.value });
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNote({ ...note, postImg: file });
      
      // Create preview
      const url = URL.createObjectURL(file);
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      setPreviewUrl(url);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setNote({ ...note, postImg: file });
      
      // Create preview
      const url = URL.createObjectURL(file);
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      setPreviewUrl(url);
    }
  };

  return (
    <div className="add-note-container">
      {/* <h2 className="add-note-title">Create New Post</h2> */}
      
      <form 
        onSubmit={handleSubmit} 
        method="post" 
        encType="multipart/form-data"
        className="add-note-form"
      >
        <div className="form-group">
          <label htmlFor="title" className="form-label">
            Title
          </label>
          <input
            name="title"
            type="text"
            className="form-input"
            id="title"
            placeholder="Enter post title"
            value={note.title}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="description" className="form-label">
            Description
          </label>
          <textarea
            name="description"
            className="form-input form-textarea"
            id="description"
            placeholder="Write your post content here..."
            value={note.description}
            onChange={handleChange}
            rows="4"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="tag" className="form-label">
            Tags
          </label>
          <input
            name="tag"
            type="text"
            className="form-input"
            id="tag"
            placeholder="Add tags separated by commas"
            value={note.tag}
            onChange={handleChange}
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">
            Upload Image
          </label>
          <div 
            className={`file-upload-area ${dragActive ? 'drag-active' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => document.getElementById("postImg").click()}
          >
            <input
              name="postImg"
              type="file"
              className="hidden-input"
              id="postImg"
              accept="image/*"
              onChange={handleImage}
              required
            />
            
            {previewUrl ? (
              <div className="image-preview-container">
                <img 
                  src={previewUrl} 
                  alt="Preview" 
                  className="image-preview"
                />
                <button 
                  type="button"
                  className="remove-image-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    setPreviewUrl(null);
                    setNote({...note, postImg: null});
                  }}
                >
                  ✕
                </button>
              </div>
            ) : (
              <div className="upload-placeholder">
                <svg className="upload-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                <p className="upload-text">Click or drag and drop to upload an image</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="form-actions">
          <button
            type="submit"
            className={`submit-button ${loading ? 'loading' : ''}`}
            disabled={loading}
          >
            {loading ? (
              <div className="loading-indicator">
                <span className="loading-spinner"></span>
                Posting...
              </div>
            ) : "Publish Post"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddNote;