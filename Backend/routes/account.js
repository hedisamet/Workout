const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        status: 'error',
        message: 'Email already registered'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create new user with hashed password
    const userData = {
      ...req.body,
      password: hashedPassword
    };
    
    const user = await User.create(userData);
    
    res.json({
      status: 'success',
      message: 'Registration successful',
      data: { _id: user._id }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Registration failed'
    });
  }
});

// Login route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Looking up user with email:', email);
    
    const user = await User.findOne({ email });
    
    if (!user) {
      console.log('No user found for email:', email);
      return res.status(404).json({ status: 'error', message: 'User not found' });
    }

    // Compare password using bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ status: 'error', message: 'Invalid password' });
    }

    // Don't send password back to client
    const userWithoutPassword = {
      _id: user._id,
      email: user.email,
      username: user.username,
      dob: user.dob,
      height: user.height,
      weight: user.weight,
      numberOfSession: user.numberOfSession,
      objectif: user.objectif,
      sexe: user.sexe,
      assignedProgram: user.assignedProgram,
      assignedMealPlan: user.assignedMealPlan
    };

    console.log('Login successful for user:', user._id);
    res.json({ status: 'success', data: userWithoutPassword });
  } catch (error) {
    console.error('Error in login:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});

// Get user profile by ID
router.get('/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    console.log('Looking up user with ID:', userId);
    
    const user = await User.findById(userId);
    
    if (!user) {
      console.log('No user found for ID:', userId);
      return res.status(404).json({ status: 'error', message: 'User not found' });
    }

    // Don't send password back to client
    const userWithoutPassword = {
      _id: user._id,
      email: user.email,
      username: user.username,
      dob: user.dob,
      height: user.height,
      weight: user.weight,
      numberOfSession: user.numberOfSession,
      objectif: user.objectif,
      sexe: user.sexe,
      assignedProgram: user.assignedProgram,
      assignedMealPlan: user.assignedMealPlan
    };

    console.log('Found user:', user._id);
    res.json({ status: 'success', data: userWithoutPassword });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});

// Update user profile
router.post('/update/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const updateData = req.body;
    
    // If password is being updated, hash it
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }
    
    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ status: 'error', message: 'User not found' });
    }

    // Don't send password back to client
    const userWithoutPassword = {
      _id: user._id,
      email: user.email,
      username: user.username,
      dob: user.dob,
      height: user.height,
      weight: user.weight,
      numberOfSession: user.numberOfSession,
      objectif: user.objectif,
      sexe: user.sexe,
      assignedProgram: user.assignedProgram,
      assignedMealPlan: user.assignedMealPlan
    };

    res.json({ status: 'success', data: userWithoutPassword });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});

module.exports = router;
