import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_ENDPOINTS, axiosConfig } from '../../../config/api';
import './Meals.css';

const Meals = () => {
  const [mealPlan, setMealPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [ipfsHash, setIpfsHash] = useState(null);
  const [isAccepted, setIsAccepted] = useState(false);

  useEffect(() => {
    // Check if there's an accepted meal plan for this week
    const savedHash = localStorage.getItem('weeklyMealHash');
    const savedDate = localStorage.getItem('mealAcceptedDate');
    
    if (savedHash && savedDate) {
      const lastAcceptedDate = new Date(savedDate);
      const today = new Date();
      const diffDays = Math.floor((today - lastAcceptedDate) / (1000 * 60 * 60 * 24));
      
      if (diffDays < 7) {
        setIpfsHash(savedHash);
        setIsAccepted(true);
        fetchAcceptedMealPlan(savedHash);
      }
    }
  }, []);

  const fetchAcceptedMealPlan = async (hash) => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_ENDPOINTS.MEAL.GET_IPFS}/${hash}`, axiosConfig);
      if (response.data.status === 'success') {
        setMealPlan(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching accepted meal plan:', error);
      setError('Failed to fetch accepted meal plan');
    } finally {
      setLoading(false);
    }
  };

  const acceptMealPlan = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        API_ENDPOINTS.MEAL.ACCEPT,
        { mealPlan },
        axiosConfig
      );
      
      if (response.data.status === 'success') {
        const { ipfsHash: hash } = response.data;
        setIpfsHash(hash);
        setIsAccepted(true);
        
        // Save for the week
        localStorage.setItem('weeklyMealHash', hash);
        localStorage.setItem('mealAcceptedDate', new Date().toISOString());
      } else {
        throw new Error(response.data.message || 'Failed to save meal plan');
      }
    } catch (error) {
      console.error('Error accepting meal plan:', error);
      setError('Failed to save meal plan to IPFS');
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

      const response = await axios.post(
        API_ENDPOINTS.MEAL.GENERATE,
        userData,
        axiosConfig
      );
      
      if (response.data.status === 'success') {
        setMealPlan(response.data.data);
      } else {
        throw new Error(response.data.message || 'Failed to generate meal plan');
      }
    } catch (error) {
      console.error('Error generating meal plan:', error);
      setError(error.message || 'Failed to generate meal plan');
    } finally {
      setGenerating(false);
    }
  };

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
              {day.meals.map((meal, index) => (
                <div key={`${day.dayName}-${meal.mealType}-${index}`} className="meal-card">
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
      <h2>Weekly Meal Plan</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      {!isAccepted && (
        <div className="meal-actions">
          <button 
            onClick={generateNewMeal} 
            className="generate-button"
            disabled={generating}
          >
            {generating ? 'Generating...' : 'Generate New Meal Plan'}
          </button>
          {mealPlan && (
            <button 
              onClick={acceptMealPlan}
              className="accept-button"
              disabled={loading}
            >
              Accept This Meal Plan
            </button>
          )}
        </div>
      )}

      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        renderMealPlanTable()
      )}

      {ipfsHash && (
        <div className="ipfs-info">
          <p>Plan saved on IPFS with hash: {ipfsHash}</p>
        </div>
      )}
    </div>
  );
};

export default Meals;
