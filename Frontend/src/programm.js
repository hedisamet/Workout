import React, { useState, useEffect } from 'react';
import Header from './component/Account/Header/Header';
import SideNav from './component/Account/SideNav/SideNav';
import Footer from './component/Footer/Footer';
import './component/Account/Program/Program.css';
import './component/Account/account.css';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const Program = () => {
  const [workoutProgram, setWorkoutProgram] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { email } = useParams();

  useEffect(() => {
    const fetchProgram = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Fetching program for:', email);
        const response = await axios.get(`http://localhost:3001/api/program/${encodeURIComponent(email)}`);
        console.log('Program data:', response.data);
        setWorkoutProgram(response.data);
      } catch (err) {
        console.error('Error fetching program:', err);
        setError(err.response?.data?.message || 'Failed to load workout program');
      } finally {
        setLoading(false);
      }
    };

    if (email) {
      fetchProgram();
    }
  }, [email]);

  if (loading) {
    return <div className="loading">Loading your workout program...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="App1">
      <SideNav />
      <div className="main-content">
        <Header />
        <div className="program-container">
          <h1>Your Workout Program</h1>
          <div className="program-grid">
            {workoutProgram.map((dayProgram, index) => (
              <div key={index} className="day-card">
                <h2>{dayProgram.day}</h2>
                <h3>Focus: {dayProgram.focus}</h3>
                <div className="exercises">
                  {dayProgram.exercises.map((exercise, i) => (
                    <div key={i} className="exercise-item">
                      <p>{exercise}</p>
                      <p>{dayProgram.setsReps[i]}</p>
                    </div>
                  ))}
                </div>
                <div className="program-details">
                  <p>Rest: {dayProgram.rest}</p>
                  <p>Calories: {dayProgram.calories}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="footer">
        <Footer />
      </div>
    </div>
  );
};

export default Program;
