// Symptom Checker JavaScript

// Mobile menu toggle
document.getElementById('mobileMenuBtn').addEventListener('click', function() {
    const mobileMenu = document.getElementById('mobileMenu');
    mobileMenu.classList.toggle('hidden');
});

// Symptom selection functionality
const symptomCheckboxes = document.querySelectorAll('.symptom-checkbox');
const selectedSymptomsContainer = document.getElementById('selectedSymptoms');
const analyzeBtn = document.getElementById('analyzeBtn');
const clearBtn = document.getElementById('clearSymptoms');

// Custom styling for symptom cards
const style = document.createElement('style');
style.textContent = `
    .symptom-label {
        display: block;
        cursor: pointer;
    }
    
    .symptom-checkbox {
        display: none;
    }
    
    .symptom-card {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 1rem;
        border: 2px solid #E5E7EB;
        border-radius: 0.75rem;
        background: white;
        transition: all 0.3s ease;
        min-height: 80px;
        justify-content: center;
    }
    
    .symptom-card i {
        font-size: 1.5rem;
        margin-bottom: 0.5rem;
    }
    
    .symptom-card span {
        font-size: 0.875rem;
        font-weight: 500;
        text-align: center;
    }
    
    .symptom-checkbox:checked + .symptom-card {
        border-color: #3B82F6;
        background: linear-gradient(135deg, #EBF8FF 0%, #DBEAFE 100%);
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
    }
    
    .symptom-label:hover .symptom-card {
        border-color: #9CA3AF;
        transform: translateY(-1px);
    }
    
    .symptom-checkbox:checked + .symptom-card i {
        color: #3B82F6;
    }
    
    .symptom-checkbox:checked + .symptom-card span {
        color: #1E40AF;
        font-weight: 600;
    }
    
    .selected-symptom-tag {
        display: inline-flex;
        align-items: center;
        padding: 0.5rem 0.75rem;
        background: linear-gradient(135deg, #3B82F6 0%, #2563EB 100%);
        color: white;
        border-radius: 9999px;
        font-size: 0.875rem;
        font-weight: 500;
        animation: slideIn 0.3s ease;
    }
    
    .selected-symptom-tag button {
        background: none;
        border: none;
        color: white;
        margin-left: 0.5rem;
        cursor: pointer;
        padding: 0;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background-color 0.2s ease;
    }
    
    .selected-symptom-tag button:hover {
        background: rgba(255, 255, 255, 0.2);
    }
    
    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .result-card {
        animation: fadeInUp 0.5s ease;
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
    
    .severity-low {
        border-left: 4px solid #10B981;
        background: linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%);
    }
    
    .severity-medium {
        border-left: 4px solid #F59E0B;
        background: linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%);
    }
    
    .severity-high {
        border-left: 4px solid #EF4444;
        background: linear-gradient(135deg, #FEF2F2 0%, #FEE2E2 100%);
    }
`;
document.head.appendChild(style);

// Update selected symptoms display
function updateSelectedSymptoms() {
    const selectedSymptoms = Array.from(symptomCheckboxes)
        .filter(checkbox => checkbox.checked)
        .map(checkbox => checkbox.value);
    
    if (selectedSymptoms.length === 0) {
        selectedSymptomsContainer.innerHTML = '<span class="text-gray-500 text-sm">No symptoms selected</span>';
        analyzeBtn.disabled = true;
    } else {
        selectedSymptomsContainer.innerHTML = selectedSymptoms.map(symptom => `
            <span class="selected-symptom-tag">
                ${formatSymptomName(symptom)}
                <button onclick="removeSymptom('${symptom}')" aria-label="Remove ${symptom}">
                    <i class="fas fa-times text-xs"></i>
                </button>
            </span>
        `).join('');
        analyzeBtn.disabled = false;
    }
}

// Format symptom name for display
function formatSymptomName(symptom) {
    return symptom.charAt(0).toUpperCase() + symptom.slice(1).replace('_', ' ');
}

// Remove specific symptom
function removeSymptom(symptom) {
    const checkbox = document.querySelector(`.symptom-checkbox[value="${symptom}"]`);
    if (checkbox) {
        checkbox.checked = false;
        updateSelectedSymptoms();
    }
}

// Clear all symptoms
clearBtn.addEventListener('click', function() {
    symptomCheckboxes.forEach(checkbox => checkbox.checked = false);
    updateSelectedSymptoms();
    document.getElementById('resultsArea').classList.add('hidden');
});

// Add event listeners to checkboxes
symptomCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', updateSelectedSymptoms);
});

// Analyze symptoms
analyzeBtn.addEventListener('click', async function() {
    const selectedSymptoms = Array.from(symptomCheckboxes)
        .filter(checkbox => checkbox.checked)
        .map(checkbox => checkbox.value);
    
    if (selectedSymptoms.length === 0) {
        alert('Please select at least one symptom');
        return;
    }
    
    // Show loading state
    analyzeBtn.disabled = true;
    analyzeBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Analyzing...';
    
    try {
        const response = await fetch('/api/symptom-check', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ symptoms: selectedSymptoms })
        });
        
        const result = await response.json();
        displayResults(result, selectedSymptoms);
    } catch (error) {
        console.error('Error analyzing symptoms:', error);
        showError('Unable to analyze symptoms. Please try again.');
    } finally {
        analyzeBtn.disabled = false;
        analyzeBtn.innerHTML = '<i class="fas fa-search-medical mr-2"></i> Analyze Symptoms';
    }
});

// Display analysis results
function displayResults(result, symptoms) {
    const resultsArea = document.getElementById('resultsArea');
    const analysisResults = document.getElementById('analysisResults');
    
    const severityClass = `severity-${result.severity}`;
    const severityIcon = getSeverityIcon(result.severity);
    const severityText = result.severity.charAt(0).toUpperCase() + result.severity.slice(1);
    
    analysisResults.innerHTML = `
        <div class="result-card ${severityClass} rounded-lg p-6">
            <div class="flex items-start mb-4">
                <div class="flex-shrink-0 mr-4">
                    ${severityIcon}
                </div>
                <div class="flex-1">
                    <h4 class="text-xl font-bold text-gray-800 mb-2">Possible Condition</h4>
                    <p class="text-lg text-gray-700 font-semibold">${result.condition}</p>
                </div>
            </div>
            
            <div class="mb-4">
                <h5 class="font-semibold text-gray-800 mb-2">
                    <i class="fas fa-user-md text-blue-600 mr-2"></i>
                    Recommended Action
                </h5>
                <p class="text-gray-700">${result.action}</p>
            </div>
            
            <div class="mb-4">
                <h5 class="font-semibold text-gray-800 mb-2">
                    <i class="fas fa-exclamation-triangle text-yellow-600 mr-2"></i>
                    Severity Level
                </h5>
                <div class="flex items-center">
                    <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getSeverityBadgeClass(result.severity)}">
                        ${severityIcon}
                        <span class="ml-2">${severityText}</span>
                    </span>
                </div>
            </div>
            
            <div class="bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
                <p class="text-blue-800 text-sm">
                    <i class="fas fa-info-circle mr-2"></i>
                    <strong>Important:</strong> ${result.disclaimer}
                </p>
            </div>
        </div>
        
        <div class="mt-6 text-center">
            <button onclick="startNewAnalysis()" class="bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors">
                <i class="fas fa-redo mr-2"></i>
                Start New Analysis
            </button>
        </div>
    `;
    
    resultsArea.classList.remove('hidden');
    resultsArea.scrollIntoView({ behavior: 'smooth' });
}

// Get severity icon
function getSeverityIcon(severity) {
    switch (severity) {
        case 'low':
            return '<i class="fas fa-check-circle text-green-600 text-2xl"></i>';
        case 'medium':
            return '<i class="fas fa-exclamation-circle text-yellow-600 text-2xl"></i>';
        case 'high':
            return '<i class="fas fa-times-circle text-red-600 text-2xl"></i>';
        default:
            return '<i class="fas fa-info-circle text-blue-600 text-2xl"></i>';
    }
}

// Get severity badge class
function getSeverityBadgeClass(severity) {
    switch (severity) {
        case 'low':
            return 'bg-green-100 text-green-800';
        case 'medium':
            return 'bg-yellow-100 text-yellow-800';
        case 'high':
            return 'bg-red-100 text-red-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
}

// Show error message
function showError(message) {
    const resultsArea = document.getElementById('resultsArea');
    const analysisResults = document.getElementById('analysisResults');
    
    analysisResults.innerHTML = `
        <div class="bg-red-50 border-l-4 border-red-600 p-6 rounded-lg">
            <div class="flex items-start">
                <i class="fas fa-exclamation-triangle text-red-600 text-xl mr-4 flex-shrink-0"></i>
                <div>
                    <h4 class="text-lg font-bold text-red-800 mb-2">Error</h4>
                    <p class="text-red-700">${message}</p>
                </div>
            </div>
        </div>
    `;
    
    resultsArea.classList.remove('hidden');
}

// Start new analysis
function startNewAnalysis() {
    symptomCheckboxes.forEach(checkbox => checkbox.checked = false);
    updateSelectedSymptoms();
    document.getElementById('resultsArea').classList.add('hidden');
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    updateSelectedSymptoms();
});
