import "../routeComponents/css/login.css"
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function Login(props) {
  const navigate = useNavigate();
  const userInitial = { email: "", password: "" };
  const [user, setUser] = useState(userInitial);
  const { email, password } = user;

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const host = process.env.REACT_APP_HOST;
    const response = await fetch(host + "/api/auth/loginUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    const json = await response.json();
    if (json.login) {
      localStorage.setItem("auth-token", json.authToken);
      localStorage.setItem("user", json.userName);
      localStorage.setItem("uid", json.userId);
      navigate("/");
      props.showAlert(json.msg, "success");
    } else {
      props.showAlert(json.msg, "warning");
    }
  };

  return (
    <div className='login-container'>
      <h2>Login to Mediabook</h2>
      <form onSubmit={handleSubmit} className='login-form'>
        <div className="form-field">
          <label htmlFor="email">Email</label>
          <input name="email" type="email" value={email} id="email" onChange={handleChange} required />
        </div>
        <div className="form-field">
          <label htmlFor="password">Password</label>
          <input name="password" type="password" value={password} id="password" onChange={handleChange} required />
        </div>
        <button type="submit" className="login-btn">Log In</button>
      </form>
      <p className="register-text">
        Don't have an account? <Link to="/signup">Register</Link>
      </p>
    </div>
  );
}

export default Login;
