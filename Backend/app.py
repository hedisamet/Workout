from flask import Flask, request, jsonify
from flask_cors import CORS
import openai
import os
import json
import requests
import traceback
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

openai.api_type = "azure"
openai.api_base = os.getenv("AZURE_OPENAI_API_BASE")
openai.api_version = os.getenv("AZURE_OPENAI_API_VERSION")
openai.api_key = os.getenv("AZURE_OPENAI_API_KEY")
OPENAI_DEPLOYMENT_NAME = os.getenv("AZURE_OPENAI_DEPLOYMENT_NAME", "DeploymentGPT35T")

app = Flask(__name__)

# Configure CORS
CORS(app, resources={
    r"/*": {
        "origins": ["http://localhost:3001"],
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"],
        "supports_credentials": True
    }
})

# Add CORS headers to all responses
@app.after_request
def after_request(response):
    response.headers.pop('Access-Control-Allow-Origin', None)
    response.headers.pop('Access-Control-Allow-Headers', None)
    response.headers.pop('Access-Control-Allow-Methods', None)
    response.headers.pop('Access-Control-Allow-Credentials', None)
    
    response.headers['Access-Control-Allow-Origin'] = 'http://localhost:3001'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS'
    response.headers['Access-Control-Allow-Credentials'] = 'true'
    return response

# IPFS Service URL
IPFS_SERVICE_URL = 'http://localhost:3002'

def get_standardized_goal(goal):
    goal_dict = {
        1: "Health and Fitness",
        2: "Strength training",
        3: "Cardiovascular fitness",
        4: "Fat burning",
        "Health Fitness": "Health and Fitness",
        "Strength": "Strength training",
        "Cardio": "Cardiovascular fitness",
        "Weight Loss": "Fat burning"
    }
    goal = str(goal) if isinstance(goal, (int, float)) else goal
    return goal_dict.get(goal, "Health and Fitness")

def generate_workout_plan(user_data):
    try:
        standardized_goal = get_standardized_goal(user_data['goal'])

        system_message = {
            "role": "system",
            "content": "You are a professional fitness trainer. Generate detailed workout plans based on user specifications."
        }

        user_message = {
            "role": "user",
            "content": f"""Please generate a personalized workout program with the following specifications:

Input Parameters:
- Weight: {user_data['weight']} kg
- Height: {user_data['height']} cm
- Weekly Workout Days: {user_data['Sessions_per_Week']}
- Fitness Goal: {standardized_goal}
- Workout Location: Gym

Please provide the workout program as a JSON object with the following structure:

{{
  "programDetails": {{
    "totalWeeks": 1,
    "sessionsPerWeek": {user_data['Sessions_per_Week']},
    "fitnessGoal": "{standardized_goal}",
    "totalWeeklyCalories": 0
  }},
  "workoutDays": [
    {{
      "dayName": "Monday",
      "workoutFocus": "",
      "exercises": [
        {{
          "name": "",
          "sets": 0,
          "reps": 0,
          "restDuration": 0,
        }}
      ],
      "totalDuration": 0,
      "calories": 0,
    }}
  ]
}}"""
        }

        messages = [system_message, user_message]

        print("Attempting to call OpenAI with deployment: DeploymentGPT35T")
        response = openai.ChatCompletion.create(
            deployment_id=OPENAI_DEPLOYMENT_NAME,
            messages=messages,
            temperature=0.7,
            max_tokens=800,
            top_p=0.95,
            frequency_penalty=0,
            presence_penalty=0
        )
        
        return response.choices[0].message['content']
    except Exception as e:
        print(f"Error in generate_workout_plan: {str(e)}")
        raise

def parse_meal_line(line):
    try:
        # Strip any whitespace and split by the pipe character
        parts = [part.strip() for part in line.split('|')]
        if len(parts) != 5:
            print(f"Invalid meal format: {line}")
            return None
            
        meal_type, food, protein, carbs, fats = parts
        # Convert macros to float first, then to int to handle decimal values
        protein = int(float(protein))
        carbs = int(float(carbs))
        fats = int(float(fats))
        
        return {
            "meal_type": meal_type,
            "food": food,
            "macros": {
                "protein": protein,
                "carbs": carbs,
                "fats": fats
            }
        }
    except Exception as e:
        print(f"Error parsing meal data: {str(e)}")
        return None

def generate_single_day_meals(day_name, daily_calories, standardized_goal):
    meal_times = {
        "Breakfast": "8:00 AM",
        "Morning Snack": "10:30 AM",
        "Lunch": "1:00 PM",
        "Afternoon Snack": "3:30 PM",
        "Dinner": "6:30 PM"
    }

    system_prompt = """You are a professional nutritionist creating precise meal plans. Follow these rules exactly:
    1. Return exactly 5 meals, one per line
    2. Each line must be in this exact format: MealType|Food with portion|Protein|Carbs|Fats
    3. Use only whole numbers for macros (protein, carbs, fats)
    4. Separate each field with a single pipe character (|)
    5. Do not include any other text or explanations

    Example format:
    Breakfast|Oatmeal with berries (1 cup)|12|45|6
    Snack|Greek yogurt with almonds|15|12|8
    Lunch|Grilled chicken with rice|35|40|12
    Snack|Protein shake with banana|20|25|5
    Dinner|Salmon with sweet potato|30|35|15"""

    user_prompt = f"""Create a meal plan for {standardized_goal} with {daily_calories} total calories.
    Remember: Return exactly 5 meals, one per line, in this format: MealType|Food with portion|Protein|Carbs|Fats"""

    try:
        print(f"Attempting to call OpenAI with deployment: {OPENAI_DEPLOYMENT_NAME}")
        response = openai.ChatCompletion.create(
            deployment_id=OPENAI_DEPLOYMENT_NAME,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            temperature=0.7,
            max_tokens=500
        )

        # Parse the response
        meals_text = response.choices[0].message.content.strip().split('\n')
        meals = []
        
        for line in meals_text:
            meal = parse_meal_line(line)
            if meal:
                meals.append(meal)
        
        if len(meals) == 5:
            return meals
        else:
            print(f"Invalid number of meals: {len(meals)}")
            raise ValueError("Invalid meal plan format")

    except Exception as e:
        print(f"Error generating meals: {str(e)}")
        return generate_meals_retry(day_name, daily_calories, standardized_goal, meal_times)

def generate_meals_retry(day_name, daily_calories, standardized_goal, meal_times):
    """Simplified retry attempt for meal generation"""
    system_prompt = """You are a nutritionist. Follow this format exactly:
    Return exactly 5 meals, one per line:
    MealType|Food with portion|Protein|Carbs|Fats
    Use only whole numbers for macros."""

    user_prompt = f"""Create a simple meal plan for {standardized_goal} with {daily_calories} calories.
    Return exactly 5 meals in this format (one per line):
    MealType|Food with portion|Protein|Carbs|Fats"""

    try:
        response = openai.ChatCompletion.create(
            deployment_id=OPENAI_DEPLOYMENT_NAME,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            temperature=0.5,
            max_tokens=300
        )
        
        meals_text = response.choices[0].message.content.strip().split('\n')
        meals = []
        
        for line in meals_text:
            meal = parse_meal_line(line)
            if meal:
                meals.append(meal)
        
        if len(meals) == 5:
            return meals
            
    except Exception as e:
        print(f"Error in retry: {str(e)}")
    
    # If all else fails, return a default meal plan
    return [
        {"meal_type": "Breakfast", "food": "Oatmeal with berries", "macros": {"protein": 12, "carbs": 45, "fats": 6}},
        {"meal_type": "Morning Snack", "food": "Greek yogurt with nuts", "macros": {"protein": 15, "carbs": 12, "fats": 8}},
        {"meal_type": "Lunch", "food": "Grilled chicken with rice", "macros": {"protein": 35, "carbs": 40, "fats": 12}},
        {"meal_type": "Afternoon Snack", "food": "Protein shake", "macros": {"protein": 20, "carbs": 25, "fats": 5}},
        {"meal_type": "Dinner", "food": "Salmon with vegetables", "macros": {"protein": 30, "carbs": 35, "fats": 15}}
    ]

def calculate_total_calories(meals):
    total_calories = 0
    for meal in meals:
        # Calculate calories from macros (4 cal/g for protein and carbs, 9 cal/g for fats)
        calories = (meal["macros"]["protein"] * 4) + (meal["macros"]["carbs"] * 4) + (meal["macros"]["fats"] * 9)
        total_calories += calories
    return total_calories

def generate_meal_plan(user_data):
    try:
        if not user_data or 'user_id' not in user_data:
            raise ValueError("Missing user_id in request")
            
        print(f"Generating meal plan for user: {user_data['user_id']}")
        
        # Calculate daily calories based on user data
        weight = float(user_data.get('weight', 70))
        height = float(user_data.get('height', 170))
        goal = get_standardized_goal(user_data.get('goal', 'Health and Fitness'))
        
        # Basic BMR calculation using Mifflin-St Jeor Equation
        bmr = 10 * weight + 6.25 * height - 5 * 25 + 5  # Assuming age 25 and male for now
        target_calories = int(bmr * 1.2)  # Sedentary multiplier
        
        # Adjust calories based on goal
        if goal == "Weight Loss":
            target_calories = int(target_calories * 0.8)  # 20% deficit
        elif goal == "Muscle Gain":
            target_calories = int(target_calories * 1.1)  # 10% surplus
            
        print(f"Calculated target calories: {target_calories}")
        
        # Days of the week
        days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
        all_daily_meals = []
        
        # Generate meals for each day
        for day in days:
            daily_meals = generate_single_day_meals(day, target_calories, goal)
            if not daily_meals:
                raise ValueError(f"Failed to generate meals for {day}")
            
            # Calculate actual calories from the generated meals
            actual_calories = calculate_total_calories(daily_meals)
            
            all_daily_meals.append({
                "dayName": day,
                "totalDailyCalories": actual_calories,
                "meals": [
                    {
                        "mealType": meal["meal_type"],
                        "timeSlot": get_time_slot(meal["meal_type"]),
                        "food": meal["food"],
                        "protein": meal["macros"]["protein"],
                        "carbs": meal["macros"]["carbs"],
                        "fats": meal["macros"]["fats"]
                    }
                    for meal in daily_meals
                ]
            })
            
        print(f"Generated meals for all days: {json.dumps(all_daily_meals, indent=2)}")
        
        # Format the response
        meal_plan = {
            "mealPlanDetails": {
                "totalDays": 7,
                "mealsPerDay": 5,
                "fitnessGoal": goal,
                "targetDailyCalories": target_calories
            },
            "dailyMeals": all_daily_meals
        }
        
        return meal_plan
        
    except Exception as e:
        print(f"Error in generate_meal_plan: {traceback.format_exc()}")
        raise

def get_time_slot(meal_type):
    time_slots = {
        "Breakfast": "8:00 AM",
        "Morning Snack": "10:30 AM",
        "Lunch": "1:00 PM",
        "Afternoon Snack": "4:00 PM",
        "Dinner": "7:00 PM"
    }
    return time_slots.get(meal_type, "12:00 PM")

# IPFS proxy endpoints
@app.route('/api/meals/ipfs/<hash>', methods=['GET'])
def get_from_ipfs(hash):
    try:
        response = requests.get(f'http://localhost:3002/api/meals/ipfs/{hash}')
        return response.json(), response.status_code
    except requests.RequestException as e:
        return jsonify({
            'status': 'error',
            'message': f'Failed to retrieve from IPFS: {str(e)}'
        }), 500

@app.route('/api/meals/ipfs', methods=['POST'])
def upload_to_ipfs():
    try:
        response = requests.post('http://localhost:3002/api/meals/ipfs', json=request.json)
        return response.json(), response.status_code
    except requests.RequestException as e:
        return jsonify({
            'status': 'error',
            'message': f'Failed to upload to IPFS: {str(e)}'
        }), 500

@app.route('/api/generate-meal', methods=['POST'])
def create_meal_plan():
    try:
        data = request.get_json()
        user_data = {
            'user_id': data.get('user_id'),
            'weight': data.get('weight', '70'),
            'height': data.get('height', '170'),
            'goal': data.get('goal', 'Health and Fitness')
        }
        
        meal_plan = generate_meal_plan(user_data)
        return jsonify({'status': 'success', 'data': meal_plan})
    except Exception as e:
        print(f"Error generating meal plan: {str(e)}")
        traceback.print_exc()
        return jsonify({'status': 'error', 'message': str(e)}), 500

@app.route('/api/meals/accept', methods=['POST'])
def accept_meal_plan():
    try:
        meal_plan = request.get_json().get('mealPlan')
        if not meal_plan:
            return jsonify({'status': 'error', 'message': 'No meal plan provided'}), 400

        # Add metadata
        meal_plan['acceptedAt'] = datetime.utcnow().isoformat()
        
        # Send to IPFS service
        response = requests.post(f"{IPFS_SERVICE_URL}/api/ipfs/upload", json=meal_plan)
        if response.status_code != 200:
            raise Exception(f"Failed to upload to IPFS: {response.text}")
            
        ipfs_hash = response.json().get('hash')
        return jsonify({
            'status': 'success',
            'ipfsHash': ipfs_hash,
            'message': 'Meal plan saved to IPFS successfully'
        })
    except Exception as e:
        print(f"Error saving to IPFS: {str(e)}")
        return jsonify({'status': 'error', 'message': str(e)}), 500

@app.route('/api/meals/ipfs/<hash>', methods=['GET'])
def get_meal_plan_from_ipfs(hash):
    try:
        response = requests.get(f"{IPFS_SERVICE_URL}/get/{hash}")
        if response.status_code != 200:
            raise Exception(f"Failed to retrieve from IPFS: {response.text}")
            
        meal_plan = response.json().get('data')
        return jsonify({
            'status': 'success',
            'data': meal_plan
        })
    except Exception as e:
        print(f"Error retrieving from IPFS: {str(e)}")
        return jsonify({'status': 'error', 'message': str(e)}), 500

@app.route('/api/generate-workout', methods=['POST'])
def create_workout_plan():
    try:
        data = request.get_json()
        user_data = {
            'user_id': data.get('user_id'),
            'weight': data.get('weight', '70'),
            'height': data.get('height', '170'),
            'goal': data.get('goal', 'Health and Fitness'),
            'Sessions_per_Week': data.get('Sessions_per_Week', 3)
        }
        
        workout_plan = generate_workout_plan(user_data)
        return jsonify({'status': 'success', 'data': workout_plan})
    except Exception as e:
        print(f"Error generating workout plan: {str(e)}")
        traceback.print_exc()
        return jsonify({'status': 'error', 'message': str(e)}), 500

@app.route('/api/program/accept', methods=['POST'])
def accept_workout_plan():
    try:
        workout_plan = request.get_json().get('workoutPlan')
        print("Received workout plan:", workout_plan)  # Debug log
        if not workout_plan:
            return jsonify({'status': 'error', 'message': 'No workout plan provided'}), 400

        # Parse the workout plan if it's a string
        if isinstance(workout_plan, str):
            try:
                workout_plan = json.loads(workout_plan)
            except json.JSONDecodeError as e:
                return jsonify({'status': 'error', 'message': f'Invalid workout plan format: {str(e)}'}), 400

        # Add metadata
        workout_plan['acceptedAt'] = datetime.utcnow().isoformat()
        
        # Send to IPFS service
        print("Sending to IPFS:", workout_plan)  # Debug log
        response = requests.post(f"{IPFS_SERVICE_URL}/api/meals/ipfs", json=workout_plan)
        print("IPFS response:", response.text)  # Debug log
        if response.status_code != 200:
            raise Exception(f"Failed to upload to IPFS: {response.text}")
            
        ipfs_hash = response.json().get('hash')
        return jsonify({
            'status': 'success',
            'ipfsHash': ipfs_hash,
            'message': 'Workout plan saved to IPFS successfully'
        })
    except Exception as e:
        print(f"Error saving to IPFS: {str(e)}")
        return jsonify({'status': 'error', 'message': str(e)}), 500

@app.route('/api/program/ipfs/<hash>', methods=['GET'])
def get_workout_plan_from_ipfs(hash):
    try:
        print(f"Fetching workout plan with hash: {hash}")  # Debug log
        response = requests.get(f"{IPFS_SERVICE_URL}/api/meals/ipfs/{hash}")
        print("IPFS response:", response.text)  # Debug log
        if response.status_code != 200:
            raise Exception(f"Failed to retrieve from IPFS: {response.text}")
            
        workout_plan = response.json().get('data')
        print("Retrieved workout plan:", workout_plan)  # Debug log
        return jsonify({
            'status': 'success',
            'data': workout_plan
        })
    except Exception as e:
        print(f"Error retrieving from IPFS: {str(e)}")
        return jsonify({'status': 'error', 'message': str(e)}), 500

if __name__ == '__main__':
    try:
        print("Starting Flask app on port 5002...")
        app.run(debug=True, port=5002, host='localhost', threaded=True)
    except Exception as e:
        print(f"Error starting Flask app: {str(e)}")
