import mongoose from 'mongoose';

const mealSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  foods: {
    type: [String],
    required: true
  },
  calories: {
    type: Number,
    required: true
  }
}, { _id: false });

const mealPlanSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  meals: [mealSchema],
  ipfsHash: {
    type: String,
    default: null
  },
  lastAcceptedDate: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Virtual for total daily calories
mealPlanSchema.virtual('totalDailyCalories').get(function() {
  return this.meals.reduce((total, meal) => total + meal.calories, 0);
});

export default mongoose.model('MealPlan', mealPlanSchema);
