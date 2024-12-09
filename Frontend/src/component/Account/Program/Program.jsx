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

  useEffect(() => {
    // Calculate week range
    const today = new Date();
    const firstDayOfWeek = new Date(today);
    firstDayOfWeek.setDate(today.getDate() - today.getDay() + 1); // Monday
    const lastDayOfWeek = new Date(firstDayOfWeek);
    lastDayOfWeek.setDate(firstDayOfWeek.getDate() + 6); // Sunday

    const formatDate = (date) => {
      const options = { month: 'short', day: 'numeric' };
      return date.toLocaleDateString('en-US', options);
    };

    setWeekRange(`${formatDate(firstDayOfWeek)} - ${formatDate(lastDayOfWeek)}`);

    const fetchProgram = async () => {
      try {
        const userId = localStorage.getItem('userId');
        if (!userId) {
          setError('User not found');
          setLoading(false);
          return;
        }

        const response = await axios.get(`http://localhost:3001/api/program/${userId}`);
        if (response.data && response.data.status === 'success' && response.data.data) {
          setProgram(response.data.data);
          // Calculate total calories
          const total = response.data.data.workoutDays.reduce(
            (sum, day) => sum + (day.calories || 0),
            0
          );
          setTotalCalories(total);
        } else {
          setError('Failed to load program data');
        }
      } catch (error) {
        console.error('Error fetching program:', error);
        setError('Failed to load workout program');
      } finally {
        setLoading(false);
      }
    };

    fetchProgram();
  }, []);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="program-container">
        <div className="error">{error}</div>
      </div>
    );
  }

  if (!program || !program.workoutDays || program.workoutDays.length === 0) {
    return (
      <div className="program-container">
        <div className="empty">No workout program found</div>
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
              <th>Day</th>
              <th>Workout Focus</th>
              <th>Exercises</th>
              <th>Sets/Reps</th>
              <th>Rest</th>
              <th>Calories</th>
            </tr>
          </thead>
          <tbody>
            {program.workoutDays.map((workout, index) => (
              <tr key={index}>
                <td>{workout.day}</td>
                <td>{workout.workoutFocus}</td>
                <td>{workout.exercises}</td>
                <td>{workout.setsReps}</td>
                <td>{workout.rest}</td>
                <td>{workout.calories || 0}</td>
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
        <button className="generate-plan-btn">Generate new plan</button>
      </div>
    </div>
  );
};

export default Program;