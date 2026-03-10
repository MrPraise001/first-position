// Fitness Page JavaScript

// Mobile menu toggle
document.getElementById('mobileMenuBtn').addEventListener('click', function() {
    const mobileMenu = document.getElementById('mobileMenu');
    mobileMenu.classList.toggle('hidden');
});

// Load exercises
let allExercises = [];

async function loadExercises() {
    try {
        const response = await fetch('/api/exercise');
        allExercises = await response.json();
        generateRoutine();
        loadTutorials();
    } catch (error) {
        console.error('Error loading exercises:', error);
    }
}

// Generate daily exercise routine
function generateRoutine() {
    const routineContainer = document.getElementById('routineContainer');
    
    // Select 4 random exercises for the routine
    const routineExercises = [];
    const tempExercises = [...allExercises];
    
    for (let i = 0; i < 4 && tempExercises.length > 0; i++) {
        const randomIndex = Math.floor(Math.random() * tempExercises.length);
        routineExercises.push(tempExercises[randomIndex]);
        tempExercises.splice(randomIndex, 1);
    }
    
    routineContainer.innerHTML = routineExercises.map((exercise, index) => `
        <div class="exercise-routine-card bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 hover:shadow-lg transition-all transform hover:scale-105">
            <div class="flex items-center justify-between mb-4">
                <span class="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                    Exercise ${index + 1}
                </span>
                <i class="fas fa-dumbbell text-purple-600 text-2xl"></i>
            </div>
            
            <h3 class="text-xl font-bold text-gray-800 mb-3">${exercise.name}</h3>
            
            <div class="space-y-3 mb-4">
                <div class="flex items-center text-gray-600">
                    <i class="fas fa-fire text-orange-500 mr-2"></i>
                    <span class="text-sm">${exercise.benefit}</span>
                </div>
                
                <div class="flex items-center text-gray-600">
                    <i class="fas fa-redo text-blue-500 mr-2"></i>
                    <span class="text-sm font-semibold">${exercise.repetitions}</span>
                </div>
                
                <div class="flex items-center text-gray-600">
                    <i class="fas fa-layer-group text-green-500 mr-2"></i>
                    <span class="text-sm font-semibold">${exercise.sets}</span>
                </div>
            </div>
            
            <button onclick="showExerciseModal('${exercise.name.replace(/'/g, "\\'")}')" class="w-full bg-purple-600 text-white py-2 rounded-lg font-semibold hover:bg-purple-700 transition-colors">
                <i class="fas fa-info-circle mr-2"></i>
                View Instructions
            </button>
        </div>
    `).join('');
}

// Load exercise tutorials
function loadTutorials() {
    const tutorialsContainer = document.getElementById('tutorialsContainer');
    
    tutorialsContainer.innerHTML = allExercises.map(exercise => `
        <div class="tutorial-card bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all transform hover:scale-105 cursor-pointer" onclick="showExerciseModal('${exercise.name.replace(/'/g, "\\'")}')">
            <div class="text-center mb-4">
                <div class="w-16 h-16 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <i class="fas fa-running text-white text-2xl"></i>
                </div>
                <h3 class="text-lg font-bold text-gray-800">${exercise.name}</h3>
            </div>
            
            <div class="space-y-2 text-sm">
                <div class="flex items-center justify-between">
                    <span class="text-gray-600">Difficulty:</span>
                    <span class="font-semibold text-blue-600">${getDifficulty(exercise.name)}</span>
                </div>
                
                <div class="flex items-center justify-between">
                    <span class="text-gray-600">Duration:</span>
                    <span class="font-semibold text-green-600">${getDuration(exercise.name)}</span>
                </div>
                
                <div class="flex items-center justify-between">
                    <span class="text-gray-600">Muscle Group:</span>
                    <span class="font-semibold text-purple-600">${getMuscleGroup(exercise.name)}</span>
                </div>
            </div>
            
            <div class="mt-4 pt-4 border-t">
                <p class="text-gray-600 text-sm">${exercise.benefit}</p>
            </div>
        </div>
    `).join('');
}

// Get exercise difficulty
function getDifficulty(exerciseName) {
    const difficulties = {
        'Push Ups': 'Intermediate',
        'Squats': 'Beginner',
        'Jumping Jacks': 'Beginner',
        'Plank': 'Intermediate',
        'Lunges': 'Intermediate',
        'Sit Ups': 'Beginner',
        'High Knees': 'Intermediate',
        'Burpees': 'Advanced'
    };
    return difficulties[exerciseName] || 'Beginner';
}

// Get exercise duration
function getDuration(exerciseName) {
    const durations = {
        'Push Ups': '5-10 min',
        'Squats': '5-10 min',
        'Jumping Jacks': '3-5 min',
        'Plank': '3-5 min',
        'Lunges': '5-10 min',
        'Sit Ups': '5-10 min',
        'High Knees': '3-5 min',
        'Burpees': '5-10 min'
    };
    return durations[exerciseName] || '5-10 min';
}

// Get muscle group
function getMuscleGroup(exerciseName) {
    const muscleGroups = {
        'Push Ups': 'Upper Body',
        'Squats': 'Lower Body',
        'Jumping Jacks': 'Full Body',
        'Plank': 'Core',
        'Lunges': 'Lower Body',
        'Sit Ups': 'Core',
        'High Knees': 'Cardio',
        'Burpees': 'Full Body'
    };
    return muscleGroups[exerciseName] || 'Full Body';
}

// Show exercise modal
function showExerciseModal(exerciseName) {
    const exercise = allExercises.find(ex => ex.name === exerciseName);
    if (!exercise) return;
    
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
                <i class="fas fa-list-ol mr-2"></i>Step-by-Step Instructions
            </h4>
            <ol class="list-decimal list-inside space-y-2 text-green-700">
                ${exercise.instructions.map(instruction => `<li>${instruction}</li>`).join('')}
            </ol>
        </div>
        
        <div class="bg-purple-50 rounded-lg p-4">
            <h4 class="font-bold text-purple-800 mb-2">
                <i class="fas fa-chart-line mr-2"></i>Workout Details
            </h4>
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <p class="text-purple-700"><strong>Repetitions:</strong> ${exercise.repetitions}</p>
                    <p class="text-purple-700"><strong>Sets:</strong> ${exercise.sets}</p>
                </div>
                <div>
                    <p class="text-purple-700"><strong>Difficulty:</strong> ${getDifficulty(exercise.name)}</p>
                    <p class="text-purple-700"><strong>Duration:</strong> ${getDuration(exercise.name)}</p>
                </div>
            </div>
        </div>
        
        <div class="bg-yellow-50 rounded-lg p-4">
            <h4 class="font-bold text-yellow-800 mb-2">
                <i class="fas fa-exclamation-triangle mr-2"></i>Safety Tips
            </h4>
            <ul class="list-disc list-inside space-y-1 text-yellow-700 text-sm">
                <li>Warm up before starting any exercise</li>
                <li>Maintain proper form throughout</li>
                <li>Stop if you feel pain</li>
                <li>Breathe steadily and don't hold your breath</li>
                <li>Stay hydrated during your workout</li>
            </ul>
        </div>
    `;
    
    modal.classList.remove('hidden');
}

// Close modal
document.getElementById('closeModal').addEventListener('click', function() {
    document.getElementById('exerciseModal').classList.add('hidden');
});

// Generate new routine
document.getElementById('generateRoutine').addEventListener('click', function() {
    this.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Generating...';
    this.disabled = true;
    
    setTimeout(() => {
        generateRoutine();
        this.innerHTML = '<i class="fas fa-sync-alt mr-2"></i> Generate New Routine';
        this.disabled = false;
    }, 1000);
});

// Initialize weekly chart
function initWeeklyChart() {
    const ctx = document.getElementById('weeklyChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'Exercise Minutes',
                data: [30, 45, 0, 60, 30, 90, 45],
                backgroundColor: 'rgba(34, 197, 94, 0.8)',
                borderColor: 'rgba(34, 197, 94, 1)',
                borderWidth: 2,
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    cornerRadius: 8,
                    callbacks: {
                        label: function(context) {
                            return context.parsed.y + ' minutes';
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    },
                    ticks: {
                        callback: function(value) {
                            return value + ' min';
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

// Close modal on outside click
document.getElementById('exerciseModal').addEventListener('click', function(e) {
    if (e.target === this) {
        this.classList.add('hidden');
    }
});

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    loadExercises();
    initWeeklyChart();
});

// Add smooth animations
const style = document.createElement('style');
style.textContent = `
    .exercise-routine-card {
        animation: slideInUp 0.5s ease forwards;
        opacity: 0;
    }
    
    .exercise-routine-card:nth-child(1) { animation-delay: 0.1s; }
    .exercise-routine-card:nth-child(2) { animation-delay: 0.2s; }
    .exercise-routine-card:nth-child(3) { animation-delay: 0.3s; }
    .exercise-routine-card:nth-child(4) { animation-delay: 0.4s; }
    
    .tutorial-card {
        animation: fadeInUp 0.6s ease forwards;
        opacity: 0;
    }
    
    .tutorial-card:nth-child(1) { animation-delay: 0.1s; }
    .tutorial-card:nth-child(2) { animation-delay: 0.2s; }
    .tutorial-card:nth-child(3) { animation-delay: 0.3s; }
    .tutorial-card:nth-child(4) { animation-delay: 0.4s; }
    .tutorial-card:nth-child(5) { animation-delay: 0.5s; }
    .tutorial-card:nth-child(6) { animation-delay: 0.6s; }
    .tutorial-card:nth-child(7) { animation-delay: 0.7s; }
    .tutorial-card:nth-child(8) { animation-delay: 0.8s; }
    
    @keyframes slideInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);
