import React, { useState } from "react";
import "./login.css";
import Headerlogin from "./Headerlogin.jsx";
import Footer from "../Footer/Footer.jsx";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios"; // Importez axios

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Clean the email and password values
    const cleanEmail = email.trim();
    const cleanPassword = password.trim();
    
    console.log("Attempting login with email:", cleanEmail);
    
    axios
      .post("http://localhost:3000/api/account/login", { 
        email: cleanEmail, 
        password: cleanPassword 
      })
      .then((result) => {
        console.log("Login response status:", result.data.status);
        if (result.data.status === "success") {
          const userData = result.data.data;
          localStorage.setItem("isLoggedIn", "true");
          localStorage.setItem("userId", userData._id);
          localStorage.setItem("userEmail", userData.email);
          localStorage.setItem("username", userData.username);
          window.dispatchEvent(new Event("loginSuccess"));
          navigate(`/account/${userData._id}`);
          alert("Welcome back " + userData.username + "! Time to crush your fitness goals.");
        }
      })
      .catch((err) => {
        console.error("Login error:", err);
        let errorMessage = "Login failed. ";
        if (err.response) {
          errorMessage += err.response.data.message;
        } else {
          errorMessage += "Please check your credentials and try again.";
        }
        alert(errorMessage);
      });
  };

  return (
    <div>
      <fieldset>
        <Headerlogin />
        <h2 className="">Login</h2>
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              className="input"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value.trim())}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              className="input"
              id="password"
              name="password"
              onChange={(e) => {
                setPassword(e.target.value.trim());
              }}
            />
          </div>
          <div className="button-container">
            <button type="submit">Login</button>
            <Link to="/Registration">
              <button type="button">Sign Up</button>
            </Link>
          </div>
        </form>
      </fieldset>
      <Footer />
    </div>
  );
}

export default Login;
