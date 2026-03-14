from flask import Flask, render_template, request, jsonify
import json
import random
from datetime import datetime

app = Flask(__name__)

# Load data from JSON files
def load_data(filename):
    with open(f'data/{filename}', 'r', encoding='utf-8') as f:
        return json.load(f)

# Comprehensive Symptom Checker Rules - AI-like Analysis
SYMPTOM_RULES = {
    # Respiratory Conditions
    'fever+cough': {'condition': 'Possible Common Cold or Flu', 'action': 'Rest, drink warm fluids, take paracetamol for fever, monitor for 3-5 days', 'severity': 'low'},
    'fever+cough+shortness of breath': {'condition': 'Possible COVID-19 or Pneumonia', 'action': 'Isolate immediately, get tested, seek medical evaluation', 'severity': 'high'},
    'cough+chest pain': {'condition': 'Possible Bronchitis or Chest Infection', 'action': 'Consult doctor, avoid cold drinks, use humidifier', 'severity': 'medium'},
    'sore throat+fever': {'condition': 'Possible Strep Throat or Tonsillitis', 'action': 'Gargle warm salt water, see doctor for throat swab', 'severity': 'medium'},
    'cough+wheezing': {'condition': 'Possible Asthma or Allergic Reaction', 'action': 'Use inhaler if prescribed, avoid allergens, seek emergency care if severe', 'severity': 'medium'},
    
    # Gastrointestinal Conditions
    'vomiting+diarrhea': {'condition': 'Possible Gastroenteritis (Stomach Flu)', 'action': 'Stay hydrated with ORS, eat bland foods, monitor for dehydration', 'severity': 'medium'},
    'abdominal pain+fever': {'condition': 'Possible Appendicitis or Infection', 'action': 'Seek immediate medical attention, avoid eating or drinking', 'severity': 'high'},
    'nausea+headache': {'condition': 'Possible Migraine or Digestive Issue', 'action': 'Rest in dark room, stay hydrated, avoid strong smells', 'severity': 'low'},
    'diarrhea+fever': {'condition': 'Possible Bacterial Infection', 'action': 'Stay hydrated, consider probiotics, see doctor if persists >2 days', 'severity': 'medium'},
    'bloating+abdominal pain': {'condition': 'Possible Indigestion or IBS', 'action': 'Avoid trigger foods, eat smaller meals, consider antacids', 'severity': 'low'},
    
    # Neurological Conditions
    'headache+fever': {'condition': 'Possible Malaria or Viral Infection', 'action': 'Take paracetamol, rest, get tested for malaria if in endemic area', 'severity': 'medium'},
    'headache+blurred vision': {'condition': 'Possible Migraine with Aura or Hypertension', 'action': 'Check blood pressure, rest in dark room, seek medical evaluation', 'severity': 'medium'},
    'dizziness+headache': {'condition': 'Possible Dehydration or High Blood Pressure', 'action': 'Drink water, check BP, avoid sudden movements', 'severity': 'medium'},
    'confusion+fever': {'condition': 'Possible Encephalitis or Severe Infection', 'action': 'Seek emergency medical care immediately', 'severity': 'high'},
    'seizure+fever': {'condition': 'Possible Febrile Seizure or Meningitis', 'action': 'Emergency medical care, cool body, note seizure duration', 'severity': 'high'},
    
    # Cardiovascular Conditions
    'chest pain+shortness of breath': {'condition': 'Possible Heart Attack or Pulmonary Embolism', 'action': 'CALL EMERGENCY SERVICES IMMEDIATELY', 'severity': 'critical'},
    'chest pain': {'condition': 'Possible Angina or Heart Issue', 'action': 'Seek immediate medical attention, chew aspirin if available', 'severity': 'high'},
    'palpitations+dizziness': {'condition': 'Possible Arrhythmia or Anxiety', 'action': 'Sit down, measure pulse, seek medical evaluation', 'severity': 'medium'},
    'swollen legs+shortness of breath': {'condition': 'Possible Heart Failure or DVT', 'action': 'Seek immediate medical care, elevate legs', 'severity': 'high'},
    
    # Urinary/Genitourinary Conditions
    'burning urination+frequent urination': {'condition': 'Possible UTI', 'action': 'Drink plenty of water, see doctor for antibiotics', 'severity': 'medium'},
    'back pain+fever': {'condition': 'Possible Kidney Infection', 'action': 'Seek medical evaluation, drink water, avoid caffeine', 'severity': 'high'},
    'lower abdominal pain+burning urination': {'condition': 'Possible Bladder Infection', 'action': 'Increase fluid intake, see doctor for testing', 'severity': 'medium'},
    
    # Skin Conditions
    'rash+fever': {'condition': 'Possible Viral Exanthem or Allergic Reaction', 'action': 'Avoid scratching, take antihistamines, see doctor', 'severity': 'medium'},
    'itching+rash': {'condition': 'Possible Allergic Reaction or Eczema', 'action': 'Apply calamine lotion, avoid irritants, see doctor', 'severity': 'low'},
    'swelling+redness': {'condition': 'Possible Cellulitis or Infection', 'action': 'Apply warm compress, see doctor for antibiotics', 'severity': 'medium'},
    
    # Musculoskeletal Conditions
    'joint pain+swelling': {'condition': 'Possible Arthritis or Injury', 'action': 'Rest joint, apply ice, see doctor if persistent', 'severity': 'medium'},
    'back pain': {'condition': 'Possible Muscle Strain or Spinal Issue', 'action': 'Apply heat/cold, gentle stretching, see doctor if severe', 'severity': 'low'},
    'muscle pain+fatigue': {'condition': 'Possible Fibromyalgia or Viral Infection', 'action': 'Gentle exercise, stress management, see doctor', 'severity': 'medium'},
    
    # Mental/Neurological Symptoms
    'fatigue+sleep problems': {'condition': 'Possible Depression or Sleep Disorder', 'action': 'Maintain sleep schedule, exercise, consider counseling', 'severity': 'medium'},
    'anxiety+palpitations': {'condition': 'Possible Anxiety or Panic Attack', 'action': 'Practice deep breathing, avoid caffeine, seek counseling', 'severity': 'medium'},
    'memory loss+confusion': {'condition': 'Possible Cognitive Issue or Medication Side Effect', 'action': 'See doctor for evaluation, review medications', 'severity': 'high'},
    
    # Women's Health
    'lower abdominal pain+nausea': {'condition': 'Possible Pregnancy or Gynecological Issue', 'action': 'Take pregnancy test, see gynecologist if severe', 'severity': 'medium'},
    'fever+vaginal discharge': {'condition': 'Possible PID or Infection', 'action': 'See gynecologist immediately, avoid sexual activity', 'severity': 'high'},
    
    # Emergency Symptoms
    'difficulty breathing': {'condition': 'Respiratory Emergency', 'action': 'CALL EMERGENCY SERVICES IMMEDIATELY', 'severity': 'critical'},
    'severe headache': {'condition': 'Possible Neurological Emergency', 'action': 'Seek emergency care, especially if sudden onset', 'severity': 'high'},
    'unconscious': {'condition': 'Medical Emergency', 'action': 'CALL EMERGENCY SERVICES, check breathing', 'severity': 'critical'},
    'bleeding': {'condition': 'Possible Hemorrhage or Injury', 'action': 'Apply pressure, seek emergency care', 'severity': 'high'},
    
    # Multi-symptom Complex Conditions
    'fever+headache+body pain': {'condition': 'Possible Dengue or Severe Flu', 'action': 'Seek medical testing, monitor platelets, rest', 'severity': 'medium'},
    'fever+chills+sweating': {'condition': 'Possible Malaria or Sepsis', 'action': 'Seek immediate medical evaluation, test for malaria', 'severity': 'high'},
    'weight loss+fatigue': {'condition': 'Possible Thyroid Issue or Chronic Disease', 'action': 'See doctor for blood tests and evaluation', 'severity': 'medium'},
    'thirst+frequent urination': {'condition': 'Possible Diabetes', 'action': 'Check blood sugar, see doctor for testing', 'severity': 'medium'},
    
    # Pediatric Considerations
    'fever+rash': {'condition': 'Possible Measles or Roseola', 'action': 'See pediatrician, isolate from others', 'severity': 'medium'},
    'cough+vomiting': {'condition': 'Possible Whooping Cough or Respiratory Infection', 'action': 'See doctor immediately, monitor breathing', 'severity': 'high'},
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
    
    # Enhanced AI-like symptom analysis
    result = analyze_symptoms_intelligently(symptoms_sorted)
    
    return jsonify({
        'condition': result['condition'],
        'action': result['action'],
        'severity': result['severity'],
        'symptoms_analyzed': symptoms,
        'confidence': result.get('confidence', 'moderate')
    })

def analyze_symptoms_intelligently(symptoms):
    """
    AI-like symptom analysis with intelligent matching and severity assessment
    """
    # Check for exact matches first (highest confidence)
    symptom_key = '+'.join(symptoms)
    if symptom_key in SYMPTOM_RULES:
        result = SYMPTOM_RULES[symptom_key].copy()
        result['confidence'] = 'high'
        return result
    
    # Check for critical emergency symptoms first
    critical_symptoms = ['difficulty breathing', 'unconscious', 'chest pain+shortness of breath']
    for critical in critical_symptoms:
        critical_parts = critical.split('+')
        if all(part in symptoms for part in critical_parts):
            return SYMPTOM_RULES[critical]
    
    # Intelligent partial matching with scoring system
    best_match = None
    best_score = 0
    
    for rule_key, rule_value in SYMPTOM_RULES.items():
        rule_symptoms = rule_key.split('+')
        
        # Calculate match score
        matches = sum(1 for symptom in rule_symptoms if symptom in symptoms)
        total_rule_symptoms = len(rule_symptoms)
        
        if matches > 0:
            # Score based on percentage of symptoms matched
            score = matches / total_rule_symptoms
            
            # Bonus for matching more symptoms
            if matches >= 2:
                score += 0.2
            
            # Bonus for critical symptoms
            critical_keywords = ['fever', 'chest pain', 'difficulty breathing', 'severe', 'bleeding']
            if any(keyword in ' '.join(symptoms) for keyword in critical_keywords):
                score += 0.1
            
            if score > best_score:
                best_score = score
                best_match = rule_value.copy()
                best_match['confidence'] = 'high' if score >= 0.8 else 'moderate' if score >= 0.5 else 'low'
    
    if best_match and best_score >= 0.3:
        return best_match
    
    # Fallback analysis based on dominant symptom patterns
    return analyze_dominant_symptoms(symptoms)

def analyze_dominant_symptoms(symptoms):
    """
    Fallback analysis when no good matches found
    """
    symptoms_str = ' '.join(symptoms).lower()
    
    # Respiratory pattern
    if any(s in symptoms_str for s in ['cough', 'breath', 'chest']):
        return {
            'condition': 'Possible Respiratory Condition',
            'action': 'Monitor breathing, avoid irritants, see doctor if symptoms worsen',
            'severity': 'medium',
            'confidence': 'low'
        }
    
    # Gastrointestinal pattern
    elif any(s in symptoms_str for s in ['nausea', 'vomiting', 'diarrhea', 'abdominal']):
        return {
            'condition': 'Possible Digestive Issue',
            'action': 'Stay hydrated, eat bland foods, monitor for dehydration',
            'severity': 'medium',
            'confidence': 'low'
        }
    
    # Neurological pattern
    elif any(s in symptoms_str for s in ['headache', 'dizziness', 'confusion']):
        return {
            'condition': 'Possible Neurological Symptom',
            'action': 'Rest, stay hydrated, seek medical evaluation if severe',
            'severity': 'medium',
            'confidence': 'low'
        }
    
    # General illness pattern
    elif any(s in symptoms_str for s in ['fever', 'fatigue', 'pain']):
        return {
            'condition': 'Possible General Illness',
            'action': 'Rest, stay hydrated, monitor symptoms, see doctor if persists',
            'severity': 'low',
            'confidence': 'low'
        }
    
    # Default fallback
    return {
        'condition': 'General Discomfort',
        'action': 'Rest, stay hydrated, consult doctor if symptoms persist or worsen',
        'severity': 'low',
        'confidence': 'very_low'
    }

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
