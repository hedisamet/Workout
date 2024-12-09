const mongoose = require('mongoose');

const workoutDaySchema = new mongoose.Schema({
  day: {
    type: String,
    required: true
  },
  workoutFocus: {
    type: String,
    required: true
  },
  exercises: {
    type: String,
    required: true
  },
  setsReps: {
    type: String,
    required: true
  },
  rest: {
    type: String,
    required: true
  },
  calories: {
    type: Number,
    required: true
  }
}, { _id: false });

const programSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  workoutDays: [workoutDaySchema]
}, {
  timestamps: true
});

module.exports = mongoose.model('Program', programSchema);
