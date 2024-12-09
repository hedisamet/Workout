require('dotenv').config();
const mongoose = require('mongoose');
const Client = require('./models/Client');

const defaultProgram = {
  monday: {
    focus: 'Chest and Triceps',
    exercises: ['Bench Press', 'Incline Dumbbell Press', 'Tricep Pushdowns', 'Dips'],
    setsReps: ['4x10', '3x12', '3x15', '3x10'],
    rest: '60-90 seconds',
    calories: '300-400'
  },
  wednesday: {
    focus: 'Back and Biceps',
    exercises: ['Pull-ups', 'Barbell Rows', 'Bicep Curls', 'Face Pulls'],
    setsReps: ['4x8', '3x12', '3x15', '3x12'],
    rest: '60-90 seconds',
    calories: '300-400'
  },
  friday: {
    focus: 'Legs and Shoulders',
    exercises: ['Squats', 'Deadlifts', 'Shoulder Press', 'Lateral Raises'],
    setsReps: ['4x10', '3x8', '3x12', '3x15'],
    rest: '90-120 seconds',
    calories: '400-500'
  }
};

const defaultMeals = {
  breakfast: {
    time: '8:00 AM',
    foodItems: ['Oatmeal with Berries', 'Greek Yogurt', 'Banana', 'Coffee'],
    macronutrient: 'Carbs: 45g, Protein: 25g, Fat: 10g',
    calories: 400
  },
  lunch: {
    time: '1:00 PM',
    foodItems: ['Grilled Chicken Breast', 'Brown Rice', 'Mixed Vegetables', 'Olive Oil'],
    macronutrient: 'Carbs: 55g, Protein: 40g, Fat: 15g',
    calories: 550
  },
  dinner: {
    time: '7:00 PM',
    foodItems: ['Salmon Fillet', 'Sweet Potato', 'Broccoli', 'Quinoa'],
    macronutrient: 'Carbs: 50g, Protein: 35g, Fat: 20g',
    calories: 500
  },
  snacks: {
    time: 'Throughout Day',
    foodItems: ['Almonds', 'Apple', 'Protein Shake'],
    macronutrient: 'Carbs: 30g, Protein: 20g, Fat: 15g',
    calories: 300
  }
};

async function initializeDb() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data for the specific email
    await Client.deleteOne({ email: 'hedisamet20@gmail.com' });

    // Create new client with default program and meals
    const client = new Client({
      email: 'hedisamet20@gmail.com',
      name: 'Hedi',
      fitnessLevel: 'intermediate',
      goals: ['muscle_gain', 'strength'],
      dietaryPreferences: ['high_protein'],
      program: defaultProgram,
      meals: defaultMeals
    });

    await client.save();
    console.log('Database initialized with default data');
    process.exit(0);
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
}

initializeDb();
