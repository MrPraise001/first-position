from flask import Flask, render_template, request, jsonify
import json
import random
from datetime import datetime

app = Flask(__name__)

# Load data from JSON files
def load_data(filename):
    with open(f'data/{filename}', 'r', encoding='utf-8') as f:
        return json.load(f)

# Symptom checker rules
SYMPTOM_RULES = {
    'fever+headache': {'condition': 'Possible Malaria', 'action': 'Rest, drink fluids, take paracetamol', 'severity': 'medium'},
    'cough+fever': {'condition': 'Possible Flu', 'action': 'Rest, stay hydrated, monitor temperature', 'severity': 'low'},
    'vomiting+diarrhea': {'condition': 'Possible Food Poisoning', 'action': 'Stay hydrated, eat bland foods, seek medical help if severe', 'severity': 'medium'},
    'chest pain': {'condition': 'Chest Pain', 'action': 'Seek immediate medical attention', 'severity': 'high'},
    'fever+headache+cough': {'condition': 'Possible Respiratory Infection', 'action': 'Consult a doctor, rest, stay hydrated', 'severity': 'medium'},
    'sore throat+fever': {'condition': 'Possible Throat Infection', 'action': 'Gargle warm water, consult doctor if persists', 'severity': 'low'},
    'dizziness+fatigue': {'condition': 'Possible Dehydration/Anemia', 'action': 'Rest, drink water, eat iron-rich foods', 'severity': 'low'},
    'body pain+fatigue': {'condition': 'Possible Viral Infection', 'action': 'Rest, take pain relievers, monitor symptoms', 'severity': 'low'}
}

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/symptom')
def symptom():
    return render_template('symptom.html')

@app.route('/fitness')
def fitness():
    return render_template('fitness.html')

@app.route('/clinics')
def clinics():
    return render_template('clinics.html')

@app.route('/mission')
def mission():
    return render_template('mission.html')

@app.route('/api/symptom-check', methods=['POST'])
def symptom_check():
    symptoms = request.json.get('symptoms', [])
    
    if not symptoms:
        return jsonify({'error': 'No symptoms provided'}), 400
    
    # Sort symptoms for consistent matching
    symptoms_sorted = sorted(symptoms)
    symptom_key = '+'.join(symptoms_sorted)
    
    # Check for exact matches first
    if symptom_key in SYMPTOM_RULES:
        result = SYMPTOM_RULES[symptom_key]
    else:
        # Check for partial matches
        result = None
        for rule_key, rule_value in SYMPTOM_RULES.items():
            rule_symptoms = rule_key.split('+')
            if any(symptom in symptoms_sorted for symptom in rule_symptoms):
                result = rule_value
                break
        
        if not result:
            result = {
                'condition': 'General Discomfort',
                'action': 'Rest, stay hydrated, consult doctor if symptoms persist',
                'severity': 'low'
            }
    
    return jsonify({
        'condition': result['condition'],
        'action': result['action'],
        'severity': result['severity'],
        'disclaimer': 'This tool is not a medical diagnosis. Please consult a healthcare professional.'
    })

@app.route('/api/exercise')
def get_exercise():
    exercises = load_data('exercises.json')
    # Return 4 random exercises for daily routine
    daily_exercises = random.sample(exercises, min(4, len(exercises)))
    return jsonify(daily_exercises)

@app.route('/api/bmi', methods=['POST'])
def calculate_bmi():
    data = request.json
    try:
        height = float(data['height'])  # in cm
        weight = float(data['weight'])  # in kg
        
        # Calculate BMI
        height_m = height / 100
        bmi = round(weight / (height_m ** 2), 1)
        
        # Determine category
        if bmi < 18.5:
            category = 'Underweight'
            advice = 'Consider increasing calorie intake with nutritious foods. Consult a nutritionist.'
        elif bmi < 25:
            category = 'Normal'
            advice = 'Maintain your current healthy lifestyle with balanced diet and regular exercise.'
        elif bmi < 30:
            category = 'Overweight'
            advice = 'Consider reducing calorie intake and increasing physical activity. Consult a healthcare provider.'
        else:
            category = 'Obese'
            advice = 'Consult a healthcare provider for a comprehensive weight management plan.'
        
        return jsonify({
            'bmi': bmi,
            'category': category,
            'advice': advice
        })
    except (ValueError, KeyError):
        return jsonify({'error': 'Invalid input data'}), 400

@app.route('/api/health-score', methods=['POST'])
def health_score():
    data = request.json
    try:
        score = 0
        questions = [
            'exercise', 'water', 'sleep', 'fruits', 'sugar'
        ]
        
        for question in questions:
            if data.get(question, False):
                score += 20
        
        # Generate advice based on score
        if score >= 80:
            advice = 'Excellent! Keep up your healthy habits.'
        elif score >= 60:
            advice = 'Good job! Focus on the areas you missed to improve further.'
        elif score >= 40:
            advice = 'Fair performance. Try to incorporate more healthy habits into your daily routine.'
        else:
            advice = 'There\'s room for improvement. Start with small changes to build healthier habits.'
        
        return jsonify({
            'score': score,
            'advice': advice
        })
    except Exception:
        return jsonify({'error': 'Invalid input data'}), 400

@app.route('/api/quote')
def get_daily_quote():
    quotes = load_data('quotes.json')
    # Use date as seed for consistent daily quote
    today = datetime.now().strftime('%Y-%m-%d')
    random.seed(today)
    daily_quote = random.choice(quotes)
    return jsonify(daily_quote)

@app.route('/api/clinics')
def get_clinics():
    clinics = load_data('clinics.json')
    return jsonify(clinics)

if __name__ == '__main__':
    app.run(debug=True)
