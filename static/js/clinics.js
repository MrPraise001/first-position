// Clinics Map JavaScript

// Mobile menu toggle
document.getElementById('mobileMenuBtn').addEventListener('click', function() {
    const mobileMenu = document.getElementById('mobileMenu');
    mobileMenu.classList.toggle('hidden');
});

// Global variables
let map;
let clinics = [];
let markers = [];
let userLocation = null;

// Initialize map
function initMap() {
    try {
        // Initialize map centered on Lagos, Nigeria
        map = L.map('map').setView([6.5244, 3.3792], 12);
        
        // Add tile layer with fallback
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 18
        }).on('tileerror', function() {
            // If map fails to load, show offline notice
            document.getElementById('offlineNotice').classList.remove('hidden');
            document.getElementById('map').innerHTML = `
                <div class="flex items-center justify-center h-full bg-gray-100">
                    <div class="text-center p-6">
                        <i class="fas fa-map-marked-alt text-6xl text-gray-400 mb-4"></i>
                        <p class="text-gray-600 font-semibold">Map Unavailable</p>
                        <p class="text-gray-500 text-sm mt-2">Showing clinic list instead</p>
                    </div>
                </div>
            `;
        }).addTo(map);
        
        // Add user location marker if available
        if (userLocation) {
            L.marker([userLocation.lat, userLocation.lng])
                .addTo(map)
                .bindPopup('Your Location')
                .setIcon(L.divIcon({
                    className: 'user-location-marker',
                    html: '<div style="background: #3B82F6; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.3);"></div>',
                    iconSize: [20, 20]
                }));
        }
        
    } catch (error) {
        console.error('Error initializing map:', error);
        document.getElementById('offlineNotice').classList.remove('hidden');
    }
}

// Load clinics data
async function loadClinics() {
    try {
        const response = await fetch('/api/clinics');
        clinics = await response.json();
        displayClinicsList(clinics);
        if (map) {
            addClinicMarkers(clinics);
        }
    } catch (error) {
        console.error('Error loading clinics:', error);
        // Load cached clinics if available
        loadCachedClinics();
    }
}

// Load cached clinics (offline fallback)
function loadCachedClinics() {
    const cachedClinics = [
        {
            name: "Faith Medical Clinic",
            address: "123 Health Street, Medical District",
            phone: "+234-800-123-4567",
            coordinates: [6.5244, 3.3792],
            services: ["General Medicine", "Emergency Care", "Laboratory"]
        },
        {
            name: "City Health Center",
            address: "456 Wellness Avenue, City Center",
            phone: "+234-800-234-5678",
            coordinates: [6.5344, 3.3892],
            services: ["Primary Care", "Vaccination", "Health Screening"]
        },
        {
            name: "Community Hospital",
            address: "789 Care Boulevard, Residential Area",
            phone: "+234-800-345-6789",
            coordinates: [6.5144, 3.3692],
            services: ["24/7 Emergency", "Surgery", "Maternity", "Pediatrics"]
        }
    ];
    
    clinics = cachedClinics;
    displayClinicsList(clinics);
    if (map) {
        addClinicMarkers(clinics);
    }
}

// Display clinics list
function displayClinicsList(clinicsToShow) {
    const clinicsList = document.getElementById('clinicsList');
    
    if (clinicsToShow.length === 0) {
        clinicsList.innerHTML = `
            <div class="text-center py-8">
                <i class="fas fa-clinic-medical text-4xl text-gray-300 mb-4"></i>
                <p class="text-gray-500">No clinics found</p>
            </div>
        `;
        return;
    }
    
    clinicsList.innerHTML = clinicsToShow.map((clinic, index) => `
        <div class="clinic-card bg-gray-50 rounded-lg p-4 mb-4 hover:bg-gray-100 transition-colors cursor-pointer" onclick="showClinicDetails(${index})">
            <div class="flex items-start justify-between">
                <div class="flex-1">
                    <h3 class="font-bold text-gray-800 mb-2">
                        <i class="fas fa-hospital text-blue-600 mr-2"></i>
                        ${clinic.name}
                    </h3>
                    <p class="text-gray-600 text-sm mb-2">
                        <i class="fas fa-map-marker-alt text-red-500 mr-2"></i>
                        ${clinic.address}
                    </p>
                    <p class="text-gray-600 text-sm mb-3">
                        <i class="fas fa-phone text-green-600 mr-2"></i>
                        ${clinic.phone}
                    </p>
                    <div class="flex flex-wrap gap-2">
                        ${clinic.services.slice(0, 3).map(service => `
                            <span class="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                ${service}
                            </span>
                        `).join('')}
                        ${clinic.services.length > 3 ? `
                            <span class="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                                +${clinic.services.length - 3} more
                            </span>
                        ` : ''}
                    </div>
                </div>
                <button onclick="event.stopPropagation(); getDirections(${clinic.coordinates[0]}, ${clinic.coordinates[1]})" 
                        class="bg-green-600 text-white p-2 rounded-lg hover:bg-green-700 transition-colors ml-4">
                    <i class="fas fa-directions"></i>
                </button>
            </div>
        </div>
    `).join('');
}

// Add clinic markers to map
function addClinicMarkers(clinicsToShow) {
    // Clear existing markers
    markers.forEach(marker => map.removeLayer(marker));
    markers = [];
    
    clinicsToShow.forEach((clinic, index) => {
        const marker = L.marker([clinic.coordinates[0], clinic.coordinates[1]])
            .addTo(map)
            .bindPopup(`
                <div class="p-2">
                    <h4 class="font-bold text-gray-800 mb-1">${clinic.name}</h4>
                    <p class="text-sm text-gray-600 mb-1">${clinic.address}</p>
                    <p class="text-sm text-gray-600 mb-2">${clinic.phone}</p>
                    <button onclick="showClinicDetails(${index})" 
                            class="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">
                        View Details
                    </button>
                </div>
            `);
        
        markers.push(marker);
    });
    
    // Fit map to show all markers
    if (clinicsToShow.length > 0) {
        const group = new L.featureGroup(markers);
        map.fitBounds(group.getBounds().pad(0.1));
    }
}

// Show clinic details modal
function showClinicDetails(index) {
    const clinic = clinics[index];
    const modal = document.getElementById('clinicModal');
    const nameEl = document.getElementById('modalClinicName');
    const contentEl = document.getElementById('modalClinicContent');
    
    nameEl.textContent = clinic.name;
    contentEl.innerHTML = `
        <div class="space-y-4">
            <div class="bg-blue-50 rounded-lg p-4">
                <h4 class="font-bold text-blue-800 mb-2">
                    <i class="fas fa-map-marker-alt mr-2"></i>
                    Address
                </h4>
                <p class="text-blue-700">${clinic.address}</p>
            </div>
            
            <div class="bg-green-50 rounded-lg p-4">
                <h4 class="font-bold text-green-800 mb-2">
                    <i class="fas fa-phone mr-2"></i>
                    Contact
                </h4>
                <p class="text-green-700">${clinic.phone}</p>
                <button onclick="callClinic('${clinic.phone}')" class="mt-2 bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700">
                    <i class="fas fa-phone-alt mr-2"></i>
                    Call Now
                </button>
            </div>
            
            <div class="bg-purple-50 rounded-lg p-4">
                <h4 class="font-bold text-purple-800 mb-2">
                    <i class="fas fa-medkit mr-2"></i>
                    Services
                </h4>
                <div class="flex flex-wrap gap-2">
                    ${clinic.services.map(service => `
                        <span class="bg-purple-100 text-purple-800 text-sm px-3 py-1 rounded-full">
                            ${service}
                        </span>
                    `).join('')}
                </div>
            </div>
            
            <div class="flex space-x-3">
                <button onclick="getDirections(${clinic.coordinates[0]}, ${clinic.coordinates[1]})" 
                        class="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                    <i class="fas fa-directions mr-2"></i>
                    Get Directions
                </button>
                <button onclick="saveClinic(${index})" 
                        class="flex-1 bg-gray-600 text-white py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors">
                    <i class="fas fa-bookmark mr-2"></i>
                    Save Clinic
                </button>
            </div>
        </div>
    `;
    
    modal.classList.remove('hidden');
}

// Get directions to clinic
function getDirections(lat, lng) {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    window.open(url, '_blank');
}

// Call clinic
function callClinic(phone) {
    window.location.href = `tel:${phone}`;
}

// Save clinic (localStorage)
function saveClinic(index) {
    const clinic = clinics[index];
    let savedClinics = JSON.parse(localStorage.getItem('savedClinics') || '[]');
    
    if (!savedClinics.find(c => c.name === clinic.name)) {
        savedClinics.push(clinic);
        localStorage.setItem('savedClinics', JSON.stringify(savedClinics));
        alert('Clinic saved successfully!');
    } else {
        alert('Clinic already saved!');
    }
}

// Close modal
document.getElementById('closeModal').addEventListener('click', function() {
    document.getElementById('clinicModal').classList.add('hidden');
});

// Search functionality
document.getElementById('searchInput').addEventListener('input', function(e) {
    const searchTerm = e.target.value.toLowerCase();
    const serviceFilter = document.getElementById('serviceFilter').value;
    
    const filteredClinics = clinics.filter(clinic => {
        const matchesSearch = clinic.name.toLowerCase().includes(searchTerm) || 
                             clinic.address.toLowerCase().includes(searchTerm);
        const matchesService = !serviceFilter || clinic.services.includes(serviceFilter);
        
        return matchesSearch && matchesService;
    });
    
    displayClinicsList(filteredClinics);
    if (map) {
        addClinicMarkers(filteredClinics);
    }
});

// Service filter
document.getElementById('serviceFilter').addEventListener('change', function(e) {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const serviceFilter = e.target.value;
    
    const filteredClinics = clinics.filter(clinic => {
        const matchesSearch = clinic.name.toLowerCase().includes(searchTerm) || 
                             clinic.address.toLowerCase().includes(searchTerm);
        const matchesService = !serviceFilter || clinic.services.includes(serviceFilter);
        
        return matchesSearch && matchesService;
    });
    
    displayClinicsList(filteredClinics);
    if (map) {
        addClinicMarkers(filteredClinics);
    }
});

// Get current location
document.getElementById('getCurrentLocation').addEventListener('click', function() {
    if (navigator.geolocation) {
        this.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Getting Location...';
        this.disabled = true;
        
        navigator.geolocation.getCurrentPosition(
            (position) => {
                userLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                
                // Add user location marker to map
                if (map) {
                    L.marker([userLocation.lat, userLocation.lng])
                        .addTo(map)
                        .bindPopup('Your Location')
                        .setIcon(L.divIcon({
                            className: 'user-location-marker',
                            html: '<div style="background: #3B82F6; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.3);"></div>',
                            iconSize: [20, 20]
                        }));
                    
                    map.setView([userLocation.lat, userLocation.lng], 13);
                }
                
                // Sort clinics by distance from user
                clinics.sort((a, b) => {
                    const distA = calculateDistance(userLocation.lat, userLocation.lng, a.coordinates[0], a.coordinates[1]);
                    const distB = calculateDistance(userLocation.lat, userLocation.lng, b.coordinates[0], b.coordinates[1]);
                    return distA - distB;
                });
                
                displayClinicsList(clinics);
                if (map) {
                    addClinicMarkers(clinics);
                }
                
                this.innerHTML = '<i class="fas fa-location-arrow mr-2"></i> Location Found';
                this.classList.remove('bg-blue-600', 'hover:bg-blue-700');
                this.classList.add('bg-green-600', 'hover:bg-green-700');
            },
            (error) => {
                console.error('Error getting location:', error);
                alert('Unable to get your location. Please check your browser settings.');
                this.innerHTML = '<i class="fas fa-location-arrow mr-2"></i> Use My Location';
                this.disabled = false;
            }
        );
    } else {
        alert('Geolocation is not supported by your browser.');
    }
});

// Calculate distance between two points
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const d = R * c; // Distance in km
    return d;
}

function deg2rad(deg) {
    return deg * (Math.PI/180);
}

// Close modal on outside click
document.getElementById('clinicModal').addEventListener('click', function(e) {
    if (e.target === this) {
        this.classList.add('hidden');
    }
});

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    initMap();
    loadClinics();
});

// Add custom styles
const style = document.createElement('style');
style.textContent = `
    .clinic-card {
        animation: slideInUp 0.5s ease forwards;
        opacity: 0;
    }
    
    .clinic-card:nth-child(1) { animation-delay: 0.1s; }
    .clinic-card:nth-child(2) { animation-delay: 0.2s; }
    .clinic-card:nth-child(3) { animation-delay: 0.3s; }
    .clinic-card:nth-child(4) { animation-delay: 0.4s; }
    .clinic-card:nth-child(5) { animation-delay: 0.5s; }
    .clinic-card:nth-child(6) { animation-delay: 0.6s; }
    
    @keyframes slideInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .leaflet-popup-content {
        min-width: 200px;
    }
    
    .user-location-marker {
        background: #3B82F6 !important;
        border: 3px solid white !important;
        border-radius: 50% !important;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3) !important;
    }
`;
document.head.appendChild(style);
