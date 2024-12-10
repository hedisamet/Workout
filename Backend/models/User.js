import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  dob: {
    type: Date,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  height: {
    type: Number,
    required: true
  },
  weight: {
    type: Number,
    required: true
  },
  numberOfSession: {
    type: Number,
    default: 0
  },
  objectif: {
    type: String,
    enum: ['Strength Training', 'Weight Loss', 'Muscle Gain', 'General Fitness'],
    required: true
  },
  sexe: {
    type: String,
    enum: ['Male', 'Female'],
    required: true
  },
  assignedMealPlan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MealPlan'
  }
}, {
  timestamps: true
});

export default mongoose.model('User', userSchema);
