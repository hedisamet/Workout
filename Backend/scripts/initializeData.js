require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Program = require('../models/Program');
const MealPlan = require('../models/MealPlan');

async function initializeData() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Program.deleteMany({});
    await MealPlan.deleteMany({});

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const adminUser = await User.create({
      email: 'admin@fitflow.com',
      name: 'Admin',
      password: hashedPassword,
      fitnessLevel: 'advanced',
      goals: ['general_fitness'],
      dietaryPreferences: ['none']
    });

    // Create a workout program
    const program = await Program.create({
      name: 'Strength Builder',
      description: 'A comprehensive strength training program',
      level: 'intermediate',
      workoutDays: {
        monday: {
          focus: 'Chest and Triceps',
          exercises: [
            { name: 'Bench Press', sets: 4, reps: 10, rest: '90 seconds' },
            { name: 'Incline Dumbbell Press', sets: 3, reps: 12, rest: '60 seconds' },
            { name: 'Tricep Pushdowns', sets: 3, reps: 15, rest: '60 seconds' }
          ],
          totalCalories: 400
        },
        wednesday: {
          focus: 'Back and Biceps',
          exercises: [
            { name: 'Pull-ups', sets: 4, reps: 8, rest: '90 seconds' },
            { name: 'Barbell Rows', sets: 3, reps: 12, rest: '60 seconds' },
            { name: 'Bicep Curls', sets: 3, reps: 15, rest: '60 seconds' }
          ],
          totalCalories: 350
        },
        friday: {
          focus: 'Legs and Shoulders',
          exercises: [
            { name: 'Squats', sets: 4, reps: 10, rest: '120 seconds' },
            { name: 'Deadlifts', sets: 3, reps: 8, rest: '120 seconds' },
            { name: 'Shoulder Press', sets: 3, reps: 12, rest: '90 seconds' }
          ],
          totalCalories: 500
        }
      },
      createdBy: adminUser._id
    });

    // Create a meal plan
    const mealPlan = await MealPlan.create({
      name: 'Balanced Nutrition',
      description: 'Well-balanced meal plan for muscle gain',
      dietaryType: 'high_protein',
      dailyMeals: {
        breakfast: {
          time: '8:00 AM',
          items: [
            { name: 'Oatmeal', portion: '1 cup', calories: 150, protein: 6, carbs: 27, fats: 3 },
            { name: 'Eggs', portion: '3 whole', calories: 210, protein: 18, carbs: 0, fats: 15 },
            { name: 'Banana', portion: '1 medium', calories: 105, protein: 1, carbs: 27, fats: 0 }
          ],
          totalCalories: 465
        },
        lunch: {
          time: '1:00 PM',
          items: [
            { name: 'Chicken Breast', portion: '200g', calories: 330, protein: 62, carbs: 0, fats: 7 },
            { name: 'Brown Rice', portion: '1 cup', calories: 216, protein: 5, carbs: 45, fats: 2 },
            { name: 'Mixed Vegetables', portion: '2 cups', calories: 100, protein: 4, carbs: 20, fats: 0 }
          ],
          totalCalories: 646
        },
        dinner: {
          time: '7:00 PM',
          items: [
            { name: 'Salmon', portion: '200g', calories: 412, protein: 46, carbs: 0, fats: 28 },
            { name: 'Sweet Potato', portion: '1 medium', calories: 103, protein: 2, carbs: 24, fats: 0 },
            { name: 'Broccoli', portion: '2 cups', calories: 60, protein: 4, carbs: 12, fats: 0 }
          ],
          totalCalories: 575
        }
      },
      totalDailyCalories: 1686,
      createdBy: adminUser._id
    });

    // Update admin user with program and meal plan
    adminUser.assignedProgram = program._id;
    adminUser.assignedMealPlan = mealPlan._id;
    await adminUser.save();

    console.log('Database initialized with sample data');
    process.exit(0);
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
}

initializeData();
