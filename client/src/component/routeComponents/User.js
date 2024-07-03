import React, { useEffect,useState } from 'react'
import { useParams } from 'react-router-dom';

export default function User() {
    const user=useParams();
  const [getsearchUser,setGetSearchUser]=useState();
  const host=process.env.REACT_APP_HOST

    useEffect(()=>{
        findSearchedUser();
    },[])
    const findSearchedUser = async () =>{ 
        const response=await fetch(`${host}/api/user/getSearchedUser`,{
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            "auth-token": localStorage.getItem("auth-token")

          },
          body: JSON.stringify({id:user.userId}),
          
        }
  
        )
        const data=await response.json();
        setGetSearchUser(data.user)

      }

        const connect = async ()=>{
          const response=await fetch(`${host}/api/user/connect`,{
            method:"POST",
            headers:{
              'Content-Type': 'application/json',
              "auth-token": localStorage.getItem("auth-token")
            },
            body: JSON.stringify({receiver:getsearchUser._id}),
          })
          const data=await response.json();
          console.log(data)
        }

  return (
    
    <>
    {getsearchUser?
    <div className='searchedUser'>
    <div className='searchProfile'>
    <div className='searchUserBackgroundImage'>
      <img src={getsearchUser.bgPhoto} alt='not found'/>
    </div>
    <div className='searchUserProfileContainer'>
      <div className='searchUserTopData'>

          <button>Connections</button>
          <div className='searchUserProfileImg'><img src={getsearchUser.profilePhoto} alt='not found'/></div>
          <button onClick={connect}>Follow</button>
      </div>
    <h3> {getsearchUser.name}</h3>
      
    </div>
  </div>
  </div>
:"please wait"
    }
    </>
  )
}