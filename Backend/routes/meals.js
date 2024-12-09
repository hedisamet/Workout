const express = require('express');
const router = express.Router();
const User = require('../models/User');
const MealPlan = require('../models/MealPlan');

// Get user's meal plan
router.get('/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    console.log('Looking up meal plan for user ID:', userId);
    
    const user = await User.findById(userId).populate('assignedMealPlan');
    console.log('User lookup result:', user);
    
    if (!user) {
      console.log('No user found for ID:', userId);
      return res.status(404).json({ status: 'error', message: 'User not found' });
    }

    if (!user.assignedMealPlan) {
      // Create a default meal plan
      const defaultMealPlan = {
        userId: user._id,
        meals: [
          {
            name: 'Breakfast',
            time: '08:00',
            foods: ['Oatmeal', 'Banana', 'Greek Yogurt'],
            calories: 400
          },
          {
            name: 'Morning Snack',
            time: '10:30',
            foods: ['Apple', 'Almonds'],
            calories: 200
          },
          {
            name: 'Lunch',
            time: '13:00',
            foods: ['Grilled Chicken', 'Brown Rice', 'Steamed Vegetables'],
            calories: 600
          },
          {
            name: 'Afternoon Snack',
            time: '16:00',
            foods: ['Protein Bar', 'Orange'],
            calories: 250
          },
          {
            name: 'Dinner',
            time: '19:00',
            foods: ['Salmon', 'Quinoa', 'Mixed Salad'],
            calories: 550
          }
        ]
      };

      const newMealPlan = await MealPlan.create(defaultMealPlan);
      user.assignedMealPlan = newMealPlan._id;
      await user.save();
      
      return res.json({ status: 'success', data: newMealPlan });
    }

    console.log('Found meal plan:', user.assignedMealPlan);
    res.json({ status: 'success', data: user.assignedMealPlan });
  } catch (error) {
    console.error('Error fetching meal plan:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});

// Update user's meal plan
router.post('/update/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const { meals } = req.body;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ status: 'error', message: 'User not found' });
    }

    let mealPlan;
    if (user.assignedMealPlan) {
      mealPlan = await MealPlan.findByIdAndUpdate(
        user.assignedMealPlan,
        { meals },
        { new: true }
      );
    } else {
      mealPlan = await MealPlan.create({
        userId: user._id,
        meals
      });
      user.assignedMealPlan = mealPlan._id;
      await user.save();
    }

    res.json({ status: 'success', data: mealPlan });
  } catch (error) {
    console.error('Error updating meal plan:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});

module.exports = router;
