import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Meals.css';
import Loader from '../../shared/Loader/Loader';

const Meals = () => {
  const [mealPlan, setMealPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalCalories, setTotalCalories] = useState(0);

  useEffect(() => {
    const fetchMealPlan = async () => {
      try {
        setLoading(true);
        const userId = localStorage.getItem('userId');
        if (!userId) {
          setError('User not found');
          setLoading(false);
          return;
        }

        console.log('Fetching meal plan for user:', userId);
        const response = await axios.get(`http://localhost:3001/api/meals/${userId}`);
        console.log('Meal plan response:', response.data);

        if (response.data && response.data.status === 'success' && response.data.data) {
          const mealPlanData = response.data.data;
          setMealPlan(mealPlanData);
          
          // Calculate total calories
          if (mealPlanData.meals && mealPlanData.meals.length > 0) {
            const total = mealPlanData.meals.reduce((sum, meal) => sum + (meal.calories || 0), 0);
            setTotalCalories(total);
          }
        } else {
          setError('No meal plan found');
        }
      } catch (error) {
        console.error('Error fetching meal plan:', error);
        setError('Failed to load meal plan');
      } finally {
        setLoading(false);
      }
    };

    fetchMealPlan();
  }, []);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="meals-container">
        <div className="error">{error}</div>
      </div>
    );
  }

  if (!mealPlan || !mealPlan.meals || mealPlan.meals.length === 0) {
    return (
      <div className="meals-container">
        <h2>Daily Meal Plan</h2>
        <p>No meal plan found. Please create a meal plan.</p>
      </div>
    );
  }

  return (
    <div className="meals-container">
      <h2>Daily Meal Plan</h2>
      <div className="meals-table-container">
        <table className="meals-table">
          <thead>
            <tr>
              <th>Meal</th>
              <th>Time</th>
              <th>Food Items</th>
              <th>Calories</th>
            </tr>
          </thead>
          <tbody>
            {mealPlan.meals.map((meal, index) => (
              <tr key={index}>
                <td>{meal.name}</td>
                <td>{meal.time}</td>
                <td>{meal.foods.join(', ')}</td>
                <td>{meal.calories} kcal</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="3" className="total-calories">Total Daily Calories</td>
              <td className="total-calories-value">{totalCalories} kcal</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default Meals;
