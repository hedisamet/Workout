import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Program.css';
import Loader from '../../shared/Loader/Loader';

const Program = () => {
  const [program, setProgram] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [weekRange, setWeekRange] = useState('');
  const [totalCalories, setTotalCalories] = useState(0);
  const [generating, setGenerating] = useState(false);

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
      const response = await axios.get(`http://localhost:5001/api/workout-plans/${userId}`);
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

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      fetchProgram(userId);
    } else {
      setError('User not found');
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setWeekRange(calculateWeekRange());
  }, []);

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

      const response = await axios.post('http://localhost:5001/api/generate-workout', {
        user_id: userId,
        weight: userData.weight || 70,
        height: userData.height || 175,
        Sessions_per_Week: userData.numberOfSession || 3,
        goal: goalMapping[userData.objectif] || 'Health Fitness'
      });

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

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="program-container">
        <div className="error">{error}</div>
        <div className="button-container">
          <button 
            className="generate-plan-btn" 
            onClick={generateNewPlan}
            disabled={generating}
          >
            {generating ? 'Generating...' : 'Generate new plan'}
          </button>
        </div>
      </div>
    );
  }

  if (!program || !program.workoutDays || program.workoutDays.length === 0) {
    return (
      <div className="program-container">
        <div className="empty">No workout program found</div>
        <div className="button-container">
          <button 
            className="generate-plan-btn" 
            onClick={generateNewPlan}
            disabled={generating}
          >
            {generating ? 'Generating...' : 'Generate new plan'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="program-container">
      <h2>Weekly Workout Plan</h2>
      <div className="week-range">{weekRange}</div>
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
      <div className="button-container">
        <button 
          className="generate-plan-btn" 
          onClick={generateNewPlan}
          disabled={generating}
        >
          {generating ? 'Generating...' : 'Generate new plan'}
        </button>
      </div>
    </div>
  );
};

export default Program;