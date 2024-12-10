import express from 'express';
import { uploadToIPFS, getFromIPFS } from '../services/ipfsService.js';
import { workoutDayStructure } from '../models/Program.js';

const router = express.Router();

// Get default program
function getDefaultProgram() {
  return {
    workoutDays: [
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
      }
    ]
  };
}

// Get user's program from IPFS or return default
router.get('/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    console.log('Looking up program for user ID:', userId);
    
    // Return default program if no IPFS hash is found
    const defaultProgram = getDefaultProgram();
    res.json({ status: 'success', data: defaultProgram });
  } catch (error) {
    console.error('Error fetching program:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});

// Save workout plan to IPFS
router.post('/accept', async (req, res) => {
  try {
    const { workoutPlan } = req.body;
    if (!workoutPlan) {
      return res.status(400).json({ status: 'error', message: 'No workout plan provided' });
    }

    // Add metadata
    workoutPlan.acceptedAt = new Date().toISOString();
    
    // Upload to IPFS
    const ipfsHash = await uploadToIPFS(workoutPlan);
    
    res.json({ 
      status: 'success', 
      data: { 
        ipfsHash,
        message: 'Workout plan saved to IPFS successfully' 
      } 
    });
  } catch (error) {
    console.error('Error saving workout plan to IPFS:', error);
    res.status(500).json({ status: 'error', message: 'Error saving workout plan' });
  }
});

// Retrieve workout plan from IPFS
router.get('/ipfs/:hash', async (req, res) => {
  try {
    const hash = req.params.hash;
    const workoutPlan = await getFromIPFS(hash);
    res.json({ status: 'success', data: workoutPlan });
  } catch (error) {
    console.error('Error retrieving workout plan from IPFS:', error);
    res.status(500).json({ status: 'error', message: 'Error retrieving workout plan' });
  }
});

export default router;
