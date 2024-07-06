import React,{useState} from 'react'
import { useNavigate } from 'react-router-dom';
const Signup = () => {
    const navigate=useNavigate();
    const [email,setEmail]= useState("")
    const [name,setName]= useState("")
    const [password,setPassword]= useState("")
    const [otp,setOtp]= useState("")
    const [checkOtpSent,setCheckotpSent]= useState(false)
    const [checkOtpVerified,setCheckOtpVeified]= useState(false)
    const [profileImg,setProfileImg] = useState("");
    const [bgImg,setBgImg] = useState("");

    const host=process.env.REACT_APP_HOST
    // const host="http://localhost:5000"

    const handleChangeEmail= (e) =>{
    setEmail(e.target.value)
  }
  const handleChangeName= (e) =>{
    setName(e.target.value)
  }
  const handleChangePassword= (e) =>{
    setPassword(e.target.value)
  }
    const handleChangeOtp=(e)=>{
      setOtp(e.target.value)

    }
  
  
  
  const handleOtp=async (e)=>{
        const response = await fetch(host+"/api/auth/sendOtp",{
            method:"POST",
            headers:{
                "Content-Type": "application/json"
            },
            body:JSON.stringify({email})
        })
        const json=await response.json()
        if(json.status){
           setCheckotpSent(json.status);
           
            // props.showAlert(json.msg,"success")
        }
        else{
          // props.showAlert(json.msg,"warning")
        }
    }
    const verifyOtp=async (e)=>{
      const response = await fetch(host+"/api/auth/verifyOtp",{
          method:"POST",
          headers:{
              "Content-Type": "application/json"
          },
          body:JSON.stringify({email,otp})
      })
      const json=await response.json()
      if(json.status){
         setCheckOtpVeified(json.status);
       
          // props.showAlert(json.msg,"successfully verified")
      }
      else{
        // props.showAlert(json.msg,"warning")
      }
  }
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log(PostData.postImg)
    console.log(email)
    console.log(name)
    console.log(password)
    console.log(profileImg)
    try {
        const respon = await fetch(host+"/api/auth/createUser", {
            method: "POST",
            headers: {
                "Content-Type": "Application/json",
            },
            body: JSON.stringify({email,name,password,profileImg,bgImg})
        })
        const result=await respon.json();
            console.log(result);
        if(result.signup){
              localStorage.setItem("auth-token",result.authToken)
              localStorage.setItem("user",name)
              navigate("/")
              console.log(result.msg)
              alert(result.msg,"success")
          }
    } catch (error) {
    alert("Cant register you");
    }
}
  
const convert = (file) => {
  const fileReader =new FileReader();
  fileReader.readAsDataURL(file);
  fileReader.onload = () => {
    setBgImg(fileReader.result)
  };
}
const HandleBgImage = (e) => {
  const file = e.target.files[0];
  // console.log( e.target.files[0])
  convert(file);
}
  
  const convertToBase64 = (file) => {
    const fileReader =new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = () => {
      setProfileImg(fileReader.result)
    };
}
const HandleImage = (e) => {
    const file = e.target.files[0];
    // console.log( e.target.files[0])
    convertToBase64(file);
}
    return (
    <div className='container'>
      
      <h2>Sign Up to mediaBook</h2>
      <br/>
      <br/>
     

       
    {  (checkOtpSent && checkOtpVerified)?

     <div className='container'>

        <form> 
         <div className='form-group'>
           <label htmlFor="name">Set user Name</label>
           <input name="name" type="text"  className="form-control" id="name" onChange={handleChangeName}required/>
         </div>
         <div className='form-group'>
           <label htmlFor="password">Password</label>
           <input name="password" type="text"  className="form-control" id="password" onChange={handleChangePassword}required/>
         </div>
         <div className='form-group'>
           <label htmlFor="profilePhoto">Profile photo (optional)</label>
           <input  type="file" id="profilePhoto"  className="form-control" onChange={(e) => {HandleImage(e)}} required/>
         </div>
         <div className='form-group'>
           <label htmlFor="profilePhoto">Background photo (optional)</label>
           <input  type="file" id="bgPhoto"  className="form-control" onChange={(e) => {HandleBgImage(e)}} required/>
         </div>
         <button type="submit" className="btn btn-warning" onClick={handleSubmit}>
         Sign Up
         </button>      
        </form> 
     </div>

        :
        
        
        (!checkOtpSent)?
          <div className='container'>

            <div className='form-group'>
              <label htmlFor="email">Email</label>
              <input name="email" type="email"  className="form-control" id="email" onChange={handleChangeEmail} required key={1}/>
              
            </div>
              <button  className="btn btn-warning" onClick={handleOtp}>Send Otp</button>
          </div>
          :  
          <div className='conatiner'>
            <div className='form-group'>
              <label htmlFor="otp">Enter verification code</label>
              <input name="otp" type="text"  className="form-control"  id="otp"  required key={2} onChange={handleChangeOtp}/>
            </div>
              <button className="btn btn-warning" onClick={verifyOtp}>continue</button>
          </div>
          
      }
    
      </div>
  )
}

export default Signup





















































// import React, { useState } from 'react'
// import { useNavigate } from 'react-router-dom'

// function Signup(props) {
//     const navigate=useNavigate();
//     const userInitial={name:"",email:"",password:""}
//     const [user,setUser]= useState(userInitial)
//     const handleChange=(e)=>{
//         setUser({...user,[e.target.name]:e.target.value});
//     }
//     const {name,email,password} = user
//     const handleSubmit=async (e)=>{
//         e.preventDefault();
//         const {name,email,password} = user
//         const response = await fetch("http://localhost:5000/api/auth/signup",{
//             method:"POST",
//             headers:{
//                 "Content-Type": "application/json"
//             },
//             body:JSON.stringify({name,email,password})
//         })
//         const json=await response.json()
//         if(json.signup){
//             localStorage.setItem("auth-token",json.authToken)
//             localStorage.setItem("user",json.userName)
//             navigate("/")
//             props.showAlert(json.msg,"success")
//         }
//         else{
//           props.showAlert(json.msg,"warning")
//         }
//     }
//   return (
//     <div className='container'>
//       <h2>Sign Up to iNotebook</h2>
//       <form onSubmit={handleSubmit}>
//         <div className="form-group">
//           <label htmlFor="name">Name</label>
//           <input name="name" type="text" className="form-control" id="name" onChange={handleChange} value={name} required/>
//         </div>
//         <div className="form-group">
//           <label htmlFor="email">Email</label>
//           <input name="email" type="email" className="form-control" id="email" onChange={handleChange} value={email} required/>
//         </div>
//         <div className="form-group">
//           <label htmlFor="password">Password</label>
//           <input name="password" type="password" className="form-control" id="password" onChange={handleChange}  value={password} required/>
//         </div>
//         <button type="submit" disabled={password.length<8} className="btn btn-warning" >
//         Sign Up
//         </button>
//         </form>
//     </div>
//   )
// }

// export default Signup
