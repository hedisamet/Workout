require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Program = require('../models/Program');
const MealPlan = require('../models/MealPlan');

async function seedDatabase() {
  try {
    console.log('Connecting to MongoDB...');
    
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: 'fitflow'
    });
    console.log('Connected to MongoDB');

    // Clear existing data
    console.log('Clearing existing data...');
    await User.deleteMany({});
    await Program.deleteMany({});
    await MealPlan.deleteMany({});
    console.log('Existing data cleared');

    // Create sample users with hashed passwords
    console.log('Creating sample users...');
    const hashedPassword = await bcrypt.hash('123', 10);
    
    const users = await User.create([
      {
        username: 'Hedi',
        dob: new Date('2001-06-05'),
        email: 'hedisamet20@gmail.com',
        password: hashedPassword,
        height: 175,
        weight: 78,
        numberOfSession: 3,
        objectif: 'Strength Training',
        sexe: 'Male'
      },
      {
        username: 'Amir',
        dob: new Date('2001-06-05'),
        email: 'hedisamet20@ieee.org',
        password: hashedPassword,
        height: 178,
        weight: 80,
        numberOfSession: 2,
        objectif: 'Muscle Gain',
        sexe: 'Male'
      }
    ]);

    console.log('Users created:', users.map(u => ({ id: u._id, email: u.email })));

    // Create workout programs for each user
    console.log('Creating workout programs...');
    const programs = await Promise.all(users.map(async (user) => {
      const program = await Program.create({
        userId: user._id,
        workoutDays: [
          {
            day: 'Monday',
            workoutFocus: 'Upper Body',
            exercises: 'Push-ups, Dumbbell Rows, Overhead Press',
            setsReps: '3x10-12',
            rest: '1 min',
            calories: 400
          },
          {
            day: 'Tuesday',
            workoutFocus: 'Cardio',
            exercises: 'Running, Jump Rope',
            setsReps: '30 min',
            rest: 'N/A',
            calories: 300
          },
          {
            day: 'Wednesday',
            workoutFocus: 'Lower Body',
            exercises: 'Squats, Deadlifts, Lunges',
            setsReps: '3x10-12',
            rest: '1.5 min',
            calories: 450
          },
          {
            day: 'Thursday',
            workoutFocus: 'Recovery',
            exercises: 'Yoga, Stretching',
            setsReps: '20 min',
            rest: 'N/A',
            calories: 150
          },
          {
            day: 'Friday',
            workoutFocus: 'Full Body',
            exercises: 'Burpees, Kettlebell Swings, Plank',
            setsReps: '3x12, 3x30 sec',
            rest: '1 min',
            calories: 500
          }
        ]
      });

      // Update user with program reference
      await User.findByIdAndUpdate(user._id, { assignedProgram: program._id });
      return program;
    }));

    console.log('Workout programs created:', programs.map(p => ({ id: p._id, userId: p.userId })));

    // Create meal plans for each user
    console.log('Creating meal plans...');
    for (const user of users) {
      const mealPlan = await MealPlan.create({
        userId: user._id,
        meals: [
          {
            name: 'Breakfast',
            foods: ['Oatmeal', 'Banana', 'Protein Shake'],
            calories: 400,
            time: '8:00 AM'
          },
          {
            name: 'Morning Snack',
            foods: ['Apple', 'Almonds'],
            calories: 150,
            time: '10:30 AM'
          },
          {
            name: 'Lunch',
            foods: ['Grilled Chicken', 'Brown Rice', 'Vegetables'],
            calories: 600,
            time: '1:00 PM'
          },
          {
            name: 'Afternoon Snack',
            foods: ['Greek Yogurt', 'Berries'],
            calories: 200,
            time: '4:00 PM'
          },
          {
            name: 'Dinner',
            foods: ['Salmon', 'Sweet Potato', 'Broccoli'],
            calories: 500,
            time: '7:00 PM'
          }
        ]
      });

      console.log('Meal plan created:', { id: mealPlan._id, userId: mealPlan.userId });

      // Update user with meal plan reference
      await User.findByIdAndUpdate(user._id, { assignedMealPlan: mealPlan._id });
      console.log('User updated with meal plan:', { id: user._id, assignedMealPlan: mealPlan._id });
    }

    console.log('Database seeded successfully!');
    console.log('Created users:', users.map(u => u.email).join(', '));

    // Close the connection
    await mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
