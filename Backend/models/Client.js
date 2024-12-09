const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  fitnessLevel: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  goals: [{
    type: String,
    enum: ['weight_loss', 'muscle_gain', 'general_fitness', 'endurance', 'strength'],
    default: 'general_fitness'
  }],
  dietaryPreferences: [{
    type: String,
    enum: ['none', 'vegetarian', 'vegan', 'keto', 'paleo', 'high_protein'],
    default: 'none'
  }],
  program: {
    type: Map,
    of: new mongoose.Schema({
      focus: String,
      exercises: [String],
      setsReps: [String],
      rest: String,
      calories: String
    }, { _id: false })
  },
  meals: {
    type: Map,
    of: new mongoose.Schema({
      time: String,
      foodItems: [String],
      macronutrient: String,
      calories: Number
    }, { _id: false })
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Client', clientSchema);
