// Main JavaScript for Clinic-in-a-Phone

// Mobile menu toggle
document.getElementById('mobileMenuBtn').addEventListener('click', function() {
    const mobileMenu = document.getElementById('mobileMenu');
    mobileMenu.classList.toggle('hidden');
});

// Load daily quote
async function loadDailyQuote() {
    try {
        const response = await fetch('/api/quote');
        const quote = await response.json();
        document.getElementById('dailyQuote').textContent = quote;
    } catch (error) {
        document.getElementById('dailyQuote').textContent = 'Health is the greatest wealth.';
    }
}

// Load exercises of the day
async function loadExercises() {
    try {
        const response = await fetch('/api/exercise');
        const exercises = await response.json();
        const container = document.getElementById('exercisesContainer');
        
        container.innerHTML = exercises.map(exercise => `
            <div class="exercise-card bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-6 hover:shadow-lg transition-all cursor-pointer transform hover:scale-105" data-exercise='${JSON.stringify(exercise).replace(/'/g, "&apos;")}'>
                <div class="text-center">
                    <i class="fas fa-dumbbell text-green-600 text-3xl mb-3"></i>
                    <h3 class="text-lg font-bold text-gray-800 mb-2">${exercise.name}</h3>
                    <p class="text-sm text-gray-600 mb-4">${exercise.benefit}</p>
                    <button class="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-700 transition-colors">
                        How to do it
                    </button>
                </div>
            </div>
        `).join('');
        
        // Add click handlers to exercise cards
        document.querySelectorAll('.exercise-card').forEach(card => {
            card.addEventListener('click', function(e) {
                if (!e.target.closest('button')) return;
                const exercise = JSON.parse(this.dataset.exercise);
                showExerciseModal(exercise);
            });
        });
    } catch (error) {
        console.error('Error loading exercises:', error);
    }
}

// Show exercise modal
function showExerciseModal(exercise) {
    const modal = document.getElementById('exerciseModal');
    const nameEl = document.getElementById('modalExerciseName');
    const contentEl = document.getElementById('modalExerciseContent');
    
    nameEl.textContent = exercise.name;
    contentEl.innerHTML = `
        <div class="bg-blue-50 rounded-lg p-4">
            <h4 class="font-bold text-blue-800 mb-2">
                <i class="fas fa-star mr-2"></i>Benefits
            </h4>
            <p class="text-blue-700">${exercise.benefit}</p>
        </div>
        
        <div class="bg-green-50 rounded-lg p-4">
            <h4 class="font-bold text-green-800 mb-2">
                <i class="fas fa-list-ol mr-2"></i>Instructions
            </h4>
            <ol class="list-decimal list-inside space-y-2 text-green-700">
                ${exercise.instructions.map(instruction => `<li>${instruction}</li>`).join('')}
            </ol>
        </div>
        
        <div class="bg-purple-50 rounded-lg p-4">
            <h4 class="font-bold text-purple-800 mb-2">
                <i class="fas fa-chart-line mr-2"></i>Recommended
            </h4>
            <p class="text-purple-700"><strong>Repetitions:</strong> ${exercise.repetitions}</p>
            <p class="text-purple-700"><strong>Sets:</strong> ${exercise.sets}</p>
        </div>
    `;
    
    modal.classList.remove('hidden');
}

// Close modal
document.getElementById('closeModal').addEventListener('click', function() {
    document.getElementById('exerciseModal').classList.add('hidden');
});

// Health score calculation
document.getElementById('calculateHealthScore').addEventListener('click', async function() {
    const checkboxes = document.querySelectorAll('.health-checkbox');
    const answers = {};
    
    checkboxes.forEach(checkbox => {
        answers[checkbox.dataset.question] = checkbox.checked;
    });
    
    try {
        const response = await fetch('/api/health-score', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(answers)
        });
        
        const result = await response.json();
        showHealthScore(result);
    } catch (error) {
        console.error('Error calculating health score:', error);
    }
});

// Show health score result
function showHealthScore(result) {
    const resultDiv = document.getElementById('healthScoreResult');
    const scoreValue = document.getElementById('scoreValue');
    const scoreAdvice = document.getElementById('scoreAdvice');
    
    scoreValue.textContent = result.score;
    scoreAdvice.textContent = result.advice;
    
    // Create simple chart
    const chartContainer = document.getElementById('scoreChart');
    chartContainer.innerHTML = `
        <div class="w-full bg-gray-200 rounded-full h-4">
            <div class="bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 h-4 rounded-full transition-all duration-1000" style="width: ${result.score}%"></div>
        </div>
    `;
    
    resultDiv.classList.remove('hidden');
    resultDiv.scrollIntoView({ behavior: 'smooth' });
}

// BMI Calculator
document.getElementById('calculateBMI').addEventListener('click', async function() {
    const height = document.getElementById('height').value;
    const weight = document.getElementById('weight').value;
    
    if (!height || !weight) {
        alert('Please enter both height and weight');
        return;
    }
    
    try {
        const response = await fetch('/api/bmi', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ height, weight })
        });
        
        const result = await response.json();
        showBMIResult(result);
    } catch (error) {
        console.error('Error calculating BMI:', error);
    }
});

// Show BMI result
function showBMIResult(result) {
    const resultDiv = document.getElementById('bmiResult');
    const bmiValue = document.getElementById('bmiValue');
    const bmiCategory = document.getElementById('bmiCategory');
    const bmiAdvice = document.getElementById('bmiAdvice');
    
    bmiValue.textContent = result.bmi;
    bmiCategory.textContent = result.category;
    bmiAdvice.textContent = result.advice;
    
    resultDiv.classList.remove('hidden');
    resultDiv.scrollIntoView({ behavior: 'smooth' });
}

// Emergency help
document.getElementById('emergencyBtn').addEventListener('click', async function() {
    const modal = document.getElementById('emergencyModal');
    const clinicsContainer = document.getElementById('emergencyClinics');
    
    try {
        const response = await fetch('/api/clinics');
        const clinics = await response.json();
        
        // Show first 3 clinics as emergency options
        const emergencyClinics = clinics.slice(0, 3);
        clinicsContainer.innerHTML = emergencyClinics.map(clinic => `
            <div class="bg-white rounded-lg p-3">
                <p class="font-semibold text-gray-800">${clinic.name}</p>
                <p class="text-sm text-gray-600">${clinic.address}</p>
                <p class="text-sm text-blue-600 font-semibold">${clinic.phone}</p>
            </div>
        `).join('');
        
        modal.classList.remove('hidden');
    } catch (error) {
        console.error('Error loading emergency clinics:', error);
        clinicsContainer.innerHTML = '<p class="text-red-600">Unable to load clinic information</p>';
        modal.classList.remove('hidden');
    }
});

// Close emergency modal
document.getElementById('closeEmergencyModal').addEventListener('click', function() {
    document.getElementById('emergencyModal').classList.add('hidden');
});

// Close modals on outside click
document.getElementById('exerciseModal').addEventListener('click', function(e) {
    if (e.target === this) {
        this.classList.add('hidden');
    }
});

document.getElementById('emergencyModal').addEventListener('click', function(e) {
    if (e.target === this) {
        this.classList.add('hidden');
    }
});

// Set current date
function setCurrentDate() {
    const dateEl = document.getElementById('currentDate');
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    dateEl.textContent = new Date().toLocaleDateString('en-US', options);
}

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    loadDailyQuote();
    loadExercises();
    setCurrentDate();
    
    // Register service worker for PWA
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/service-worker.js')
            .then(registration => {
                console.log('ServiceWorker registration successful with scope: ', registration.scope);
            })
            .catch(error => {
                console.log('ServiceWorker registration failed: ', error);
            });
    }
    
    // Add smooth scrolling to navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
});

// Add pulse animation to emergency button
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
    }
    .pulse-animation {
        animation: pulse 2s infinite;
    }
`;
document.head.appendChild(style);
