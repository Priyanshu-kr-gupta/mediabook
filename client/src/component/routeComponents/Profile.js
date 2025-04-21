import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import "./css/Profile.css"
import Notes from '../Notes'
// import 'bootstrap/dist/css/bootstrap.min.css'

function Profile() {
  const navigate = useNavigate()

  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const host = process.env.REACT_APP_HOST

  const handleClick = () => {
    localStorage.removeItem("auth-token")
    localStorage.removeItem("user")
    localStorage.removeItem("uid")
    navigate('/login')
  }

  const getUser = async () => {
    const response = await fetch(`${host}/api/auth/getUser`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("auth-token")
      },
    })
    const json = await response.json()
    setUser(json.user);
    setLoading(false);
  }

  useEffect(() => {
    getUser();
    if (!localStorage.getItem("auth-token"))
      navigate("/login");
  }, [])

  return (
    <>
      <div className='profile'>
        {loading ? (
          <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
            <div className="spinner-border" role="status">
            </div>
          </div>
        ) : (
          <>
            <div className='backgroundImage'>
              <img src={user.bgPhoto} alt='not found' />
            </div>
            <div className='profileContainer'>
              <div className='topData'>
                <div>
                  <h3>{user.name}</h3>
                  {localStorage.getItem("auth-token") && <button className="btn btn-secondary" onClick={handleClick}>Log Out</button>}
                </div>
                <div className='profileImg'><img src={user.profilePhoto} alt='not found' /></div>
              </div>
              <div>
                <br />
              </div>
              <div className='container' style={{ marginBottom: "10vh" }}>
                <Notes />
              </div>
            </div>
          </>
        )}
      </div>
    </>
  )
}

export default Profile
