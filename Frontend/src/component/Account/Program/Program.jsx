import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Program.css';
import Loader from '../../shared/Loader/Loader';
import { API_ENDPOINTS, axiosConfig } from '../../../config/api';

const Program = () => {
  const [program, setProgram] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [weekRange, setWeekRange] = useState('');
  const [totalCalories, setTotalCalories] = useState(0);
  const [generating, setGenerating] = useState(false);
  const [ipfsHash, setIpfsHash] = useState(null);
  const [isAccepted, setIsAccepted] = useState(false);

  const calculateWeekRange = () => {
    const today = new Date();
    const firstDayOfWeek = new Date(today);
    firstDayOfWeek.setDate(today.getDate() - today.getDay() + 1);
    const lastDayOfWeek = new Date(firstDayOfWeek);
    lastDayOfWeek.setDate(firstDayOfWeek.getDate() + 6);

    const formatDate = (date) => {
      return `${date.toLocaleString('default', { month: 'short' })} ${date.getDate()}`;
    };

    return `${formatDate(firstDayOfWeek)} - ${formatDate(lastDayOfWeek)}`;
  };

  const fetchProgram = async (userId) => {
    try {
      const response = await axios.get(
        API_ENDPOINTS.WORKOUT.GET_PLAN(userId),
        axiosConfig
      );
      if (response.data && response.data.length > 0) {
        // Get the most recent plan
        const latestPlan = response.data[response.data.length - 1];
        const workoutPlan = typeof latestPlan.plan === 'string' 
          ? JSON.parse(latestPlan.plan) 
          : latestPlan.plan;
        
        setProgram(workoutPlan);
        const total = workoutPlan.workoutDays.reduce(
          (sum, day) => sum + (day.calories || 0),
          0
        );
        setTotalCalories(total);
      }
    } catch (error) {
      console.error('Error fetching program:', error);
      setError('Failed to fetch workout program');
    } finally {
      setLoading(false);
    }
  };

  const generateNewPlan = async () => {
    try {
      setGenerating(true);
      setError(null);
      const userId = localStorage.getItem('userId');
      if (!userId) {
        setError('User not found');
        return;
      }

      const accountResponse = await axios.get(`http://localhost:3000/api/account/${userId}`);
      const userData = accountResponse.data.data;

      // Map the objectif to the correct goal format
      const goalMapping = {
        'Health Fitness': 'Health Fitness',
        'Strength': 'Strength',
        'Cardio': 'Cardio',
        'Weight Loss': 'Weight Loss'
      };

      const response = await axios.post(
        API_ENDPOINTS.WORKOUT.GENERATE,
        {
          user_id: userId,
          weight: userData.weight || 70,
          height: userData.height || 175,
          Sessions_per_Week: userData.numberOfSession || 3,
          goal: goalMapping[userData.objectif] || 'Health Fitness'
        },
        axiosConfig
      );

      if (response.data && response.data.status === 'success') {
        const workoutPlan = typeof response.data.data === 'string' 
          ? JSON.parse(response.data.data) 
          : response.data.data;
        
        setProgram(workoutPlan);
        const total = workoutPlan.workoutDays.reduce(
          (sum, day) => sum + (day.calories || 0),
          0
        );
        setTotalCalories(total);
      } else {
        throw new Error('Failed to generate workout plan');
      }
    } catch (error) {
      console.error('Error generating new plan:', error);
      setError('Failed to generate new workout plan');
    } finally {
      setGenerating(false);
    }
  };

  const fetchAcceptedProgram = async (hash) => {
    try {
      const response = await axios.get(`${API_ENDPOINTS.WORKOUT.GET_IPFS}/${hash}`);
      if (response.data && response.data.status === 'success') {
        const workoutPlan = response.data.data;
        setProgram(workoutPlan);
        
        // Calculate total calories
        const total = workoutPlan.workoutDays.reduce(
          (sum, day) => sum + (parseInt(day.calories) || 0),
          0
        );
        setTotalCalories(total);
        setLoading(false);
      } else {
        throw new Error('Failed to fetch program data');
      }
    } catch (error) {
      console.error('Error fetching accepted program:', error);
      setError('Failed to fetch accepted program');
      setLoading(false);
    }
  };

  useEffect(() => {
    // Check if there's an accepted program for today
    const savedHash = localStorage.getItem('todaysProgramHash');
    const savedDate = localStorage.getItem('programAcceptedDate');
    const today = new Date().toISOString().split('T')[0];
    
    if (savedHash && savedDate === today) {
      setIpfsHash(savedHash);
      setIsAccepted(true);
      fetchAcceptedProgram(savedHash);
    } else {
      const userId = localStorage.getItem('userId');
      if (userId) {
        fetchProgram(userId);
      } else {
        setError('User not found');
        setLoading(false);
      }
    }
  }, []);

  const acceptProgram = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        API_ENDPOINTS.WORKOUT.ACCEPT,
        { workoutPlan: program },
        axiosConfig
      );
      
      const { ipfsHash: hash } = response.data;
      setIpfsHash(hash);
      setIsAccepted(true);
      
      // Save for today
      const today = new Date().toISOString().split('T')[0];
      localStorage.setItem('todaysProgramHash', hash);
      localStorage.setItem('programAcceptedDate', today);
      
      // Fetch the accepted program from IPFS
      await fetchAcceptedProgram(hash);
      
    } catch (error) {
      console.error('Error accepting program:', error);
      setError('Failed to save program to IPFS');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setWeekRange(calculateWeekRange());
  }, []);

  return (
    <div className="program-container">
      <h2>Weekly Workout Plan</h2>
      <div className="week-range">{weekRange}</div>
      
      {error && <div className="error">{error}</div>}
      
      {!loading && program && !isAccepted && (
        <div className="program-actions">
          <button 
            onClick={generateNewPlan}
            className="generate-plan-btn"
            disabled={generating || isAccepted}
          >
            {generating ? 'Generating...' : 'Generate Another Plan'}
          </button>
          <button 
            onClick={acceptProgram}
            className="accept-button"
            disabled={loading}
          >
            Accept This Plan
          </button>
        </div>
      )}

      {ipfsHash && (
        <div className="ipfs-info">
          <p>Program saved on IPFS</p>
          <small>IPFS Hash: {ipfsHash}</small>
        </div>
      )}

      {loading ? (
        <Loader />
      ) : program && program.workoutDays ? (
        <div className="program-table-container">
          <table className="program-table">
            <thead>
              <tr>
                <th>DAY</th>
                <th>WORKOUT FOCUS</th>
                <th>EXERCISES</th>
                <th>SETS/REPS</th>
                <th>REST</th>
                <th>CALORIES</th>
              </tr>
            </thead>
            <tbody>
              {program.workoutDays.map((workout, index) => (
                <tr key={index}>
                  <td>{workout.dayName}</td>
                  <td>{workout.workoutFocus}</td>
                  <td>
                    {workout.exercises.map((exercise, exIndex) => (
                      <div key={exIndex} className="exercise-item">
                        {exercise.name}
                      </div>
                    ))}
                  </td>
                  <td>
                    {workout.exercises.map((exercise, exIndex) => (
                      <div key={exIndex} className="exercise-item">
                        {exercise.sets}×{exercise.reps}
                        {exercise.name.toLowerCase().includes('plank') ? ' seconds' : ''}
                      </div>
                    ))}
                  </td>
                  <td>
                    {workout.exercises.map((exercise, exIndex) => (
                      <div key={exIndex} className="exercise-item">
                        {exercise.restDuration}s
                      </div>
                    ))}
                  </td>
                  <td>{workout.calories}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="5" className="total-calories">Total Weekly Calories</td>
                <td className="total-calories-value">{totalCalories}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      ) : (
        <div className="empty">
          <p>No workout program found</p>
          {!isAccepted && (
            <button 
              className="generate-plan-btn" 
              onClick={generateNewPlan}
              disabled={generating}
            >
              {generating ? 'Generating...' : 'Generate New Plan'}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Program;