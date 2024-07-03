import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import "./css/Search.css"

export default function Search() {
  const [searchedUser, setSearchedUser] = useState('');
  const [users, setUsers] = useState([]);
  const [requests,setRequests]=useState([]);
  const handleChange = (e) => {
    setSearchedUser(e.target.value);
  };
  const host = process.env.REACT_APP_HOST;


  const fetchRequests = async () => {
    const response = await fetch(`${host}/api/user/fetchRequests`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        "auth-token": localStorage.getItem("auth-token"),

      },
    });
    const json = await response.json();

    // setRequests(json.connect.map(fetchRequestsdetails));
    setRequests(json.requestsUserDetails)
    // console.log(requests)
 
  };
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`${host}/api/user/searchUser`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ searchedUser }),
      });
      const json = await response.json();
      // setUsers(json);
      setUsers(json.user);

   
    };

    // Call the fetch function only if searchedUser is not an empty string

      fetchData();
      fetchRequests();

  }, [searchedUser]); // Run the effect whenever searchedUser changes

   

  const acceptRequest = async (reqid)=>
  {
    const response = await fetch(`${host}/api/user/acceptRequest`,{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        "auth-token": localStorage.getItem("auth-token")

      },
      body: JSON.stringify({ reqid })
    });
    const json =await response.json();
    console.log(json)
    
  }
  return (
    <>
    <div className='searchBox'>
      <input type='text' value={searchedUser} onChange={handleChange} className='userSearch' placeholder='search a user'/>
    {/* <br/>    <br/> */}


    {requests.map(user => (
          <div key={user._id} className='userBox'>
            <div className='userCred'>
              <img src={user.profilePhoto} alt='not found'/>
              <h5>{user.name}</h5>
            </div>

            <button onClick={()=>{acceptRequest(user._id)}}>Accept</ button>      

          </div>
         
        ))} 
        <br/>
       <br/>
        <br/>
        <br />
        {users.map(user => (
          <div key={user._id} className='userBox'  style={{backgroundImage:`url(${user.bgPhoto})`,backgroundSize:"contain",backgroundRepeat:"no-repeat"}}>
            <div className='userCred'>
              <img src={user.profilePhoto} alt='not found'/>
              <h5>{user.name}</h5>
            </div>

            <Link to={`/user/${user._id}`} className='searchUser'>View</Link>      

          </div>
        ))}

    </div>
 
  </>
  );
}