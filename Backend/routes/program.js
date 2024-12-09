const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Program = require('../models/Program');

// Get user's program
router.get('/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    console.log('Looking up program for user ID:', userId);
    
    const user = await User.findById(userId).populate('assignedProgram');
    console.log('User lookup result:', user);
    
    if (!user) {
      console.log('No user found for ID:', userId);
      return res.status(404).json({ status: 'error', message: 'User not found' });
    }

    if (!user.assignedProgram) {
      // Create default program if none exists
      const defaultProgram = await createDefaultProgram(userId);
      user.assignedProgram = defaultProgram._id;
      await user.save();
      return res.json({ status: 'success', data: defaultProgram });
    }

    console.log('Found program:', user.assignedProgram);
    res.json({ status: 'success', data: user.assignedProgram });
  } catch (error) {
    console.error('Error fetching program:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});

// Update user's program
router.post('/update/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const { workoutDays } = req.body;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ status: 'error', message: 'User not found' });
    }

    let program;
    if (user.assignedProgram) {
      program = await Program.findByIdAndUpdate(
        user.assignedProgram,
        { workoutDays },
        { new: true }
      );
    } else {
      program = await Program.create({
        userId: user._id,
        workoutDays
      });
      user.assignedProgram = program._id;
      await user.save();
    }

    res.json({ status: 'success', data: program });
  } catch (error) {
    console.error('Error updating program:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});

// Helper function to create a default program
async function createDefaultProgram(userId) {
  const defaultWorkouts = [
    {
      day: "Monday",
      workoutFocus: "Upper Body",
      exercises: "Push-ups, Dumbbell Rows, Overhead Press",
      setsReps: "3x10-12",
      rest: "1 min",
      calories: 400
    },
    {
      day: "Tuesday",
      workoutFocus: "Cardio",
      exercises: "Running, Jump Rope",
      setsReps: "30 min",
      rest: "N/A",
      calories: 350
    },
    {
      day: "Wednesday",
      workoutFocus: "Lower Body",
      exercises: "Squats, Deadlifts, Lunges",
      setsReps: "3x10-12",
      rest: "1.5 min",
      calories: 450
    },
    {
      day: "Thursday",
      workoutFocus: "Recovery",
      exercises: "Yoga, Stretching",
      setsReps: "20 min",
      rest: "N/A",
      calories: 200
    },
    {
      day: "Friday",
      workoutFocus: "Full Body",
      exercises: "Burpees, Kettlebell Swings, Plank",
      setsReps: "3x12, 3x30 sec",
      rest: "1-2 min",
      calories: 500
    },
    {
      day: "Saturday",
      workoutFocus: "Cardio/Strength",
      exercises: "HIIT: 40-sec sprint, 20-sec rest",
      setsReps: "8 rounds",
      rest: "2 min",
      calories: 600
    },
    {
      day: "Sunday",
      workoutFocus: "Rest",
      exercises: "-",
      setsReps: "-",
      rest: "-",
      calories: 0
    }
  ];

  return await Program.create({
    userId,
    workoutDays: defaultWorkouts
  });
}

module.exports = router;
