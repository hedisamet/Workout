import React, { useState, useEffect } from 'react';
import './Registration.css';
import { useNavigate } from 'react-router-dom';
import Axios from 'axios';

function Registration() {
  const navigate = useNavigate();
  const [username, setUserName] = useState('');
  const [dob, setDob] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [numberOfSession, setNumberOfSession] = useState(2);
  const [objectif, setObjectif] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [sexe, setSexe] = useState('');

  const createUser = () => {
    // Check if all required fields are filled
    if (!username || !email || !password || !dob || !height || !weight || !objectif || !sexe) {
      setMessage('Please fill in all required fields');
      setMessageType('error');
      return;
    }

    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
      setMessageType('error');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMessage('Please enter a valid email address');
      setMessageType('error');
      return;
    }

    Axios.post('http://localhost:3001/api/account/register', {
      username,
      dob,
      email,
      password,
      height: parseInt(height),
      weight: parseInt(weight),
      numberOfSession,
      objectif,
      sexe
    })
      .then((response) => {
        if (response.data.status === 'success') {
          setMessage('Registration successful! Redirecting to login...');
          setMessageType('success');
          setTimeout(() => navigate('/login'), 2000);
        } else {
          setMessage(response.data.message);
          setMessageType('error');
        }
      })
      .catch((error) => {
        setMessage(error.response?.data?.message || 'Registration failed. Please try again.');
        setMessageType('error');
      });
  };

  return (
    <div className="registration-container">
      <div className="registration-box">
        <h2>Create Your Account</h2>
        {message && (
          <div className={`message ${messageType}`}>{message}</div>
        )}
        
        <form onSubmit={(e) => e.preventDefault()} className="registration-form">
          <div className="form-group">
            <label>Username<span className="required">*</span></label>
            <input
              type="text"
              required
              placeholder="Enter your username"
              onChange={(e) => setUserName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Date of Birth<span className="required">*</span></label>
            <input
              type="date"
              required
              onChange={(e) => setDob(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Email<span className="required">*</span></label>
            <input
              type="email"
              required
              placeholder="Enter your email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-row">
            <div className="form-group half">
              <label>Password<span className="required">*</span></label>
              <input
                type="password"
                required
                placeholder="Enter password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="form-group half">
              <label>Confirm Password<span className="required">*</span></label>
              <input
                type="password"
                required
                placeholder="Confirm password"
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group half">
              <label>Height (cm)<span className="required">*</span></label>
              <input
                type="number"
                required
                placeholder="Enter height"
                min="100"
                max="250"
                onChange={(e) => setHeight(e.target.value)}
              />
            </div>
            <div className="form-group half">
              <label>Weight (kg)<span className="required">*</span></label>
              <input
                type="number"
                required
                placeholder="Enter weight"
                min="30"
                max="200"
                onChange={(e) => setWeight(e.target.value)}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group half">
              <label>Number of Sessions<span className="required">*</span></label>
              <select
                required
                value={numberOfSession}
                onChange={(e) => setNumberOfSession(parseInt(e.target.value))}
              >
                {[2, 3, 4, 5, 6].map(num => (
                  <option key={num} value={num}>{num} sessions</option>
                ))}
              </select>
            </div>
            <div className="form-group half">
              <label>Gender<span className="required">*</span></label>
              <select
                required
                value={sexe}
                onChange={(e) => setSexe(e.target.value)}
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Fitness Goal<span className="required">*</span></label>
            <select
              required
              value={objectif}
              onChange={(e) => setObjectif(e.target.value)}
            >
              <option value="">Select your goal</option>
              <option value="Strength Training">Strength Training</option>
              <option value="Cardio Training">Cardio Training</option>
              <option value="Fat Burning">Fat Burning</option>
              <option value="Health Fitness">Health Fitness</option>
            </select>
          </div>

          <button type="button" onClick={createUser} className="register-button">
            Register
          </button>
        </form>
      </div>
    </div>
  );
}

export default Registration;