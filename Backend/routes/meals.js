import express from 'express';
import User from '../models/User.js';
import MealPlan from '../models/MealPlan.js';
import { uploadToIPFS, getFromIPFS } from '../services/ipfsService.js';

const router = express.Router();

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

// Save meal plan to IPFS
router.post('/accept', async (req, res) => {
  try {
    const { mealPlan } = req.body;
    if (!mealPlan) {
      return res.status(400).json({ status: 'error', message: 'Meal plan is required' });
    }

    // Upload meal plan to IPFS
    const ipfsHash = await uploadToIPFS(mealPlan);
    res.json({ status: 'success', ipfsHash, message: 'Meal plan saved to IPFS successfully' });
  } catch (error) {
    console.error('Error saving meal plan to IPFS:', error);
    res.status(500).json({ status: 'error', message: 'Failed to save meal plan to IPFS' });
  }
});

// Retrieve meal plan from IPFS
router.get('/ipfs/:hash', async (req, res) => {
  try {
    const { hash } = req.params;
    if (!hash) {
      return res.status(400).json({ status: 'error', message: 'IPFS hash is required' });
    }

    const mealPlan = await getFromIPFS(hash);
    res.json({ status: 'success', data: mealPlan });
  } catch (error) {
    console.error('Error retrieving meal plan from IPFS:', error);
    res.status(500).json({ status: 'error', message: 'Failed to retrieve meal plan from IPFS' });
  }
});

export default router;
