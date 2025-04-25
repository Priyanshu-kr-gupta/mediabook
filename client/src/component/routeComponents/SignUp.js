import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import "../routeComponents/css/signup.css";


const Signup = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [otp, setOtp] = useState("");
    const [checkOtpSent, setCheckotpSent] = useState(false);
    const [checkOtpVerified, setCheckOtpVerified] = useState(false);
    const [profileImg, setProfileImg] = useState(null);
    const [bgImg, setBgImg] = useState(null);

    const [isLoadingOtp, setIsLoadingOtp] = useState(false);
    const [isLoadingVerify, setIsLoadingVerify] = useState(false); 
    const [isLoadingSignup, setIsLoadingSignup] = useState(false); 
    const host = process.env.REACT_APP_HOST;

    const handleChangeEmail = (e) => setEmail(e.target.value);
    const handleChangeName = (e) => setName(e.target.value);
    const handleChangePassword = (e) => setPassword(e.target.value);
    const handleChangeOtp = (e) => setOtp(e.target.value);

    const handleOtp = async () => {
        setIsLoadingOtp(true);
        try {
            const response = await fetch(`${host}/api/auth/sendOtp`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });
            const json = await response.json();
            setCheckotpSent(json.status);
        } finally {
            setIsLoadingOtp(false);
        }
    };

    const verifyOtp = async () => {
        setIsLoadingVerify(true);
        try {
            const response = await fetch(`${host}/api/auth/verifyOtp`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, otp }),
            });
            const json = await response.json();
            setCheckOtpVerified(json.status);
        } finally {
            setIsLoadingVerify(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoadingSignup(true);
        try {
            const formData = new FormData();
            formData.append("email", email);
            formData.append("name", name);
            formData.append("password", password);
            if (profileImg) formData.append("profileImg", profileImg);
            if (bgImg) formData.append("bgImg", bgImg);

            const response = await fetch(`${host}/api/auth/createUser`, {
                method: "POST",
                body: formData,
            });
            const result = await response.json();
            if (result.signup) {
                localStorage.setItem("auth-token", result.authToken);
                localStorage.setItem("user", name);
                navigate("/");
                alert(result.msg, "success");
            }
        } catch (error) {
            alert("Unable to register.");
        } finally {
            setIsLoadingSignup(false);
        }
    };

    const handleBgImage = (e) => {
        setBgImg(e.target.files[0]);
    };
    const handleImage = (e) => {
        setProfileImg(e.target.files[0]);
    };

    return (
        <div className='signup-container'>
            <h2 className="signup-title">Sign Up to Mediabook</h2>
            <br /><br />

            {checkOtpSent && checkOtpVerified ? (
                <form className="signup-form">
                    <div className='form-group'>
                        <label htmlFor="name">Set user Name</label>
                        <input
                            name="name"
                            type="text"
                            id="name"
                            className="input"
                            value={name}
                            onChange={handleChangeName}
                            required
                        />
                    </div>
                    <div className='form-group'>
                        <label htmlFor="password">Password</label>
                        <input
                            name="password"
                            type="password"
                            id="password"
                            className="input"
                            value={password}
                            onChange={handleChangePassword}
                            required
                        />
                    </div>
                    <div className='form-group'>
                        <label htmlFor="profilePhoto">Profile photo (optional)</label>
                        <input
                            type="file"
                            id="profilePhoto"
                            className="input"
                            onChange={handleImage}
                        />
                    </div>
                    <div className='form-group'>
                        <label htmlFor="bgPhoto">Background photo (optional)</label>
                        <input
                            type="file"
                            id="bgPhoto"
                            className="input"
                            onChange={handleBgImage}
                        />
                    </div>
                    <button
                        type="submit"
                        className="button"
                        onClick={handleSubmit}
                        disabled={isLoadingSignup}
                    >
                        {isLoadingSignup ? "Signing Up..." : "Sign Up"}
                    </button>
                </form>
            ) : !checkOtpSent ? (
                <div className="otp-email-section">
                    <div className='form-group'>
                        <label htmlFor="email">Email</label>
                        <input
                            name="email"
                            type="email"
                            id="email"
                            className="input"
                            value={email}
                            onChange={handleChangeEmail}
                            required
                        />
                    </div>
                    <button
                        className="button"
                        onClick={handleOtp}
                        disabled={isLoadingOtp}
                    >
                        {isLoadingOtp ? "Sending..." : "Send OTP"}
                    </button>
                </div>
            ) : (
                <div className="otp-verification-section">
                    <div className='form-group'>
                        <label htmlFor="otp">Enter verification code</label>
                        <input
                            name="otp"
                            type="text"
                            id="otp"
                            className="input"
                            value={otp}
                            required
                            onChange={handleChangeOtp}
                        />
                    </div>
                    <button
                        className="button"
                        onClick={verifyOtp}
                        disabled={isLoadingVerify}
                    >
                        {isLoadingVerify ? "Verifying..." : "Continue"}
                    </button>
                </div>
            )}
             <p className="register-text">
                   Already have an account? <Link to="/login">Login</Link>
                  </p>
        </div>
    );
};

export default Signup;
