import React from 'react'
// import axios from 'axios'

function Myprofile() {
  // useEffect(() => {
  //   const cleanup = async () => {
  //     // Your API request logic here
  //     try {
  //       await axios.post('http://localhost:5000/api/notes/message',);
  //     } catch (error) {
  //       console.error('Error making API request:', error);
  //     }
  //   };

  //   // Cleanup function will be called when the component is unmounted
  //   return () => {
  //     cleanup();
  //   };
  // }, []);
    //  console.log("object")
  return (
    <>
    <div className="background-container"></div>
    <div className="main-container">
    <div className="profile-container">
        <div className="box1">
          <div className="profile-img"></div>
        </div>
        <div className="box2">
            <h1>Jessica Jones</h1>
            <p>Bucharest Romania</p>
        </div>
        <div className="box3">
            <h3>Solution Manager . Creative Tim Officer</h3>
            <p>University of computer science</p>
        </div>
    </div>
    </div>
    </>
  )
}

export default Myprofile
