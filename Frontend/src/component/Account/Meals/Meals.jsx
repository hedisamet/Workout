import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../../../config/api';
import './Meals.css';

const Meals = () => {
  const [mealPlan, setMealPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [generating, setGenerating] = useState(false);

  const fetchMealPlan = async (userId) => {
    try {
      setLoading(true);
      const response = await axios.get(API_ENDPOINTS.MEAL.GET_PLAN(userId));
      if (response.data.status === 'success' && response.data.plan) {
        setMealPlan(response.data.plan);
      } else {
        console.log('No meal plan found');
        setMealPlan(null);
      }
    } catch (error) {
      console.error('Error fetching meal plan:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const generateNewMeal = async () => {
    try {
      setGenerating(true);
      setError(null);
      
      const userData = {
        user_id: localStorage.getItem('userId'),
        weight: localStorage.getItem('weight') || '70',
        height: localStorage.getItem('height') || '170',
        goal: localStorage.getItem('goal') || 'Health and Fitness'
      };

      const response = await axios.post(API_ENDPOINTS.MEAL.GENERATE, userData);
      
      if (response.data.status === 'success') {
        setMealPlan(response.data.data);
        // No need to fetch again since we have the data
      } else {
        throw new Error(response.data.message || 'Failed to generate meal plan');
      }
    } catch (error) {
      console.error('Error generating meal plan:', error);
      setError(error.message);
    } finally {
      setGenerating(false);
    }
  };

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      setError('User not found');
      setLoading(false);
      return;
    }
    fetchMealPlan(userId);
  }, []);

  const renderMealPlanTable = () => {
    if (!mealPlan || !mealPlan.dailyMeals || mealPlan.dailyMeals.length === 0) {
      return (
        <div className="no-meal-plan">
          <p>No meal plan available. Click 'Generate New Meal Plan' to create one.</p>
        </div>
      );
    }

    return (
      <div className="meal-plan-container">
        {mealPlan.dailyMeals.map((day) => (
          <div key={day.dayName} className="day-section">
            <div className="day-header">
              <h3>{day.dayName}</h3>
              <div className="total-calories">
                Total: {day.totalDailyCalories} kcal
              </div>
            </div>
            <div className="meals-grid">
              {day.meals.map((meal) => (
                <div key={`${day.dayName}-${meal.mealType}`} className="meal-card">
                  <div className="meal-header">
                    <h4>{meal.mealType}</h4>
                    <span className="meal-time">{meal.timeSlot}</span>
                  </div>
                  <div className="meal-content">
                    <div className="food-items">
                      <div className="food-item">{meal.food}</div>
                    </div>
                    <div className="meal-stats">
                      <div className="macros">
                        <span className="label">Protein:</span>
                        <span className="value">{meal.protein}g</span>
                        <span className="label">Carbs:</span>
                        <span className="value">{meal.carbs}g</span>
                        <span className="label">Fats:</span>
                        <span className="value">{meal.fats}g</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="meals-container">
      <h1>Weekly Meal Plan</h1>
      <button 
        className="generate-button"
        onClick={generateNewMeal}
        disabled={generating}
      >
        {generating ? 'Generating...' : 'Generate new meal'}
      </button>
      
      {error && <div className="error-message">{error}</div>}
      {loading ? (
        <div className="loading">Loading meal plan...</div>
      ) : (
        renderMealPlanTable()
      )}
    </div>
  );
};

export default Meals;
