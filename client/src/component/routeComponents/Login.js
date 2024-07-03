import React from 'react'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login(props) {
    const navigate=useNavigate();
    const userInitial={email:"",password:""}
    const [user,setUser]= useState(userInitial)
    const {email,password} = user
    const handleChange=(e)=>{
        setUser({...user,[e.target.name]:e.target.value});
    }
    const handleSubmit=async (e)=>{
        e.preventDefault();
        const {email,password} = user
        // https://inotebook-server-m9df.onrender.com/api/auth/login
        const host=process.env.REACT_APP_HOST
        // const host="http://localhost:5000"
        const response = await fetch(host+"/api/auth/loginUser",{
            method:"POST",
            headers:{
                "Content-Type": "application/json"
            },
            body:JSON.stringify({email,password})
        })
        const json=await response.json()
        if(json.login){
            localStorage.setItem("auth-token",json.authToken)
            localStorage.setItem("user",json.userName)
            localStorage.setItem("uid",json.userId)
            navigate("/")
            props.showAlert(json.msg,"success"); 
        }
        else{
          props.showAlert(json.msg,"warning");
        }
        
    }
  return (
      <div className='container'>
      <h2>Login to Mediabook</h2>
        <form onSubmit={handleSubmit}>
        <div className="form-group">
            <label htmlFor="email">Email</label>
            <input name="email" type="email" value={email} className="form-control" id="email" onChange={handleChange}/>
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input name="password" type="password" value={password} className="form-control" id="password" minLength={8} onChange={handleChange}/>
          </div>
          <button type="submit" className="btn btn-warning">
          Log In
          </button>
        </form>
      </div>
    
  )
}

export default Login
