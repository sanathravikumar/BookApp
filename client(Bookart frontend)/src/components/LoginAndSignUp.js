import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faEnvelope, faLock, faPhone } from "@fortawesome/free-solid-svg-icons";
import "bootstrap/dist/css/bootstrap.min.css";
import "./LoginAndSignUp.css";

const LoginAndSignUp = () => {
    const [isSignup, setIsSignup] = useState(false);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ firstName: "", lastName: "", email: "", password: "", cellNumber: "" });
    const [rememberMe, setRememberMe] = useState(false);
    
    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    
    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:5135/api/JWTProtal/PostLoginDetails", {
                email: formData.email,
                password: formData.password,
            });
            
            if (response.data.accessToken) {
                localStorage.setItem("accessToken", response.data.accessToken);
                localStorage.setItem("userId", response.data.userId);
                rememberMe ? localStorage.setItem("rememberedEmail", formData.email) : localStorage.removeItem("rememberedEmail");
                alert("Login successful!");
                navigate("/store");
            } else {
                alert("Invalid email or password.");
            }
        } catch (error) {
            alert("Login failed. Please try again.");
        }
    };
    
    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:5135/api/Users", formData);
            
            if (response.status === 201) {
                alert("Signup successful!");
                setIsSignup(false);
            } else {
                alert("Signup failed. Please try again.");
            }
        } catch (error) {
            alert("Signup failed. Please try again.");
        }
    };
    
    return (
        <div className="container d-flex justify-content-center align-items-center vh-100 bg-dark text-light">
            <div className="card p-4 shadow-lg w-50">
                <h3 className="welcome-message">BooKart</h3><br></br>
                <h2 className="text-center mb-4">{isSignup ? "Sign Up" : "Login"}</h2>
                <form onSubmit={isSignup ? handleSignup : handleLogin}>
                    {isSignup && (
                        <>
                            <div className="mb-3 input-group">
                                <span className="input-group-text"><FontAwesomeIcon icon={faUser} /></span>
                                <input type="text" className="form-control" name="firstName" placeholder="First Name" required value={formData.firstName} onChange={handleChange} />
                            </div>
                            <div className="mb-3 input-group">
                                <span className="input-group-text"><FontAwesomeIcon icon={faUser} /></span>
                                <input type="text" className="form-control" name="lastName" placeholder="Last Name" required value={formData.lastName} onChange={handleChange} />
                            </div>
                        </>
                    )}
                    <div className="mb-3 input-group">
                        <span className="input-group-text"><FontAwesomeIcon icon={faEnvelope} /></span>
                        <input type="email" className="form-control" name="email" placeholder="Email" required value={formData.email} onChange={handleChange} />
                    </div>
                    {isSignup && (
                        <div className="mb-3 input-group">
                            <span className="input-group-text"><FontAwesomeIcon icon={faPhone} /></span>
                            <input type="text" className="form-control" name="cellNumber" placeholder="Cell Number" required value={formData.cellNumber} onChange={handleChange} />
                        </div>
                    )}
                    <div className="mb-3 input-group">
                        <span className="input-group-text"><FontAwesomeIcon icon={faLock} /></span>
                        <input type="password" className="form-control" name="password" placeholder="Password" required value={formData.password} onChange={handleChange} />
                    </div>
                    {!isSignup && (
                        <div className="mb-3 form-check">
                            <input type="checkbox" className="form-check-input" id="rememberMe" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
                            <label className="form-check-label" htmlFor="rememberMe">Remember Me</label>
                        </div>
                    )}
                    <button type="submit" className="btn btn-primary w-100">{isSignup ? "Sign Up" : "Login"}</button>
                </form>
                <p className="text-center mt-3">
                    {isSignup ? "Already have an account? " : "Don't have an account? "}
                    <span onClick={() => setIsSignup(!isSignup)} className="text-primary" style={{ cursor: "pointer" }}>
                        {isSignup ? "Login" : "Sign Up"}
                    </span>
                </p>
            </div>
        </div>
    );
};

export default LoginAndSignUp;