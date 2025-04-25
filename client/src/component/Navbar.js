import "./routeComponents/css/navbar.css";
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FiHome, FiUser, FiPlusCircle } from "react-icons/fi";

function Navbar() {
  const location = useLocation();
  


  return (
    <>
      {/* Desktop Navigation */}
      <nav className='navbar'>
        <div className="navbar-container">
          <Link to="/" className="logo">
            <span className="logo-text">MediaBook</span>
          </Link>
          
          <div className="nav-links">
            <Link to="/" className={location.pathname === "/" ? "nav-link active" : "nav-link"}>
              Home
            </Link>
            <Link to="/addPost" className={location.pathname === "/addPost" ? "nav-link active" : "nav-link"}>
              Add Post
            </Link>
            <Link to="/profile" className={location.pathname === "/profile" ? "nav-link active" : "nav-link"}>
              My Profile
            </Link>
          </div>
          
        
        </div>
      </nav>

      {/* Mobile Bottom Nav - Only show brand name at top on mobile */}
      <div className="mobile-brand">
        <span className="logo-text">MediaBook</span>
      </div>
      
      {/* Mobile Bottom Nav */}
      <div className="navbar-mobile">
        <Link to="/" className={location.pathname === "/" ? "mobile-icon active" : "mobile-icon"}>
          <FiHome />
          <span className="mobile-label">Home</span>
        </Link>
        <Link to="/addPost" className={location.pathname === "/addPost" ? "mobile-icon active" : "mobile-icon"}>
          <FiPlusCircle />
          <span className="mobile-label">Add</span>
        </Link>
        <Link to="/profile" className={location.pathname === "/profile" ? "mobile-icon active" : "mobile-icon"}>
          <FiUser />
          <span className="mobile-label">Profile</span>
        </Link>
      </div>
    </>
  );
}

export default Navbar;