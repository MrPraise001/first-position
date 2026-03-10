// Service Worker for Clinic-in-a-Phone PWA

const CACHE_NAME = 'clinic-in-a-phone-v1';
const urlsToCache = [
    '/',
    '/static/css/style.css',
    '/static/js/main.js',
    '/static/js/symptom.js',
    '/static/js/fitness.js',
    '/static/js/clinics.js',
    '/static/js/mission.js',
    'https://cdn.tailwindcss.com',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
    'https://cdn.jsdelivr.net/npm/chart.js',
    'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
    'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
];

// Install event - cache resources
self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function(cache) {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

// Fetch event - serve cached content when offline
self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request)
            .then(function(response) {
                // Return cached version or fetch from network
                if (response) {
                    return response;
                }
                
                return fetch(event.request).then(function(response) {
                    // Check if valid response
                    if (!response || response.status !== 200 || response.type !== 'basic') {
                        return response;
                    }
                    
                    // Clone response for caching
                    var responseToCache = response.clone();
                    
                    caches.open(CACHE_NAME)
                        .then(function(cache) {
                            cache.put(event.request, responseToCache);
                        });
                    
                    return response;
                }).catch(function() {
                    // Return offline fallback for API calls
                    if (event.request.url.includes('/api/')) {
                        return getOfflineResponse(event.request.url);
                    }
                });
            })
    );
});

// Provide offline responses for API calls
function getOfflineResponse(url) {
    if (url.includes('/api/clinics')) {
        return new Response(JSON.stringify([
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
        ]), {
            status: 200,
            statusText: 'OK',
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
    
    if (url.includes('/api/exercise')) {
        return new Response(JSON.stringify([
            {
                name: "Push Ups",
                benefit: "Builds upper body strength and core stability",
                instructions: [
                    "Start in a plank position with hands slightly wider than shoulders",
                    "Lower your body until chest nearly touches the floor",
                    "Push back up to starting position",
                    "Keep your body in a straight line throughout"
                ],
                repetitions: "10-15 reps",
                sets: "3 sets"
            },
            {
                name: "Squats",
                benefit: "Strengthens legs and glutes, improves balance",
                instructions: [
                    "Stand with feet shoulder-width apart",
                    "Lower your body as if sitting in a chair",
                    "Keep your back straight and chest up",
                    "Return to starting position"
                ],
                repetitions: "15-20 reps",
                sets: "3 sets"
            },
            {
                name: "Jumping Jacks",
                benefit: "Great cardio exercise, improves coordination",
                instructions: [
                    "Start standing with feet together, arms at sides",
                    "Jump while spreading legs shoulder-width apart",
                    "Simultaneously raise arms overhead",
                    "Jump back to starting position"
                ],
                repetitions: "20-30 reps",
                sets: "3 sets"
            },
            {
                name: "Plank",
                benefit: "Strengthens core muscles and improves posture",
                instructions: [
                    "Start in push-up position",
                    "Hold your body in a straight line from head to heels",
                    "Engage your core muscles",
                    "Keep breathing steadily"
                ],
                repetitions: "30-60 seconds",
                sets: "3 sets"
            }
        ]), {
            status: 200,
            statusText: 'OK',
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
    
    if (url.includes('/api/quote')) {
        return new Response(JSON.stringify("Health is the greatest wealth."), {
            status: 200,
            statusText: 'OK',
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
    
    if (url.includes('/api/symptom-check')) {
        return new Response(JSON.stringify({
            condition: "General Discomfort",
            action: "Rest, stay hydrated, consult doctor if symptoms persist",
            severity: "low",
            disclaimer: "This tool is not a medical diagnosis. Please consult a healthcare professional."
        }), {
            status: 200,
            statusText: 'OK',
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
    
    if (url.includes('/api/health-score')) {
        return new Response(JSON.stringify({
            score: 60,
            advice: "Fair performance. Try to incorporate more healthy habits into your daily routine."
        }), {
            status: 200,
            statusText: 'OK',
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
    
    if (url.includes('/api/bmi')) {
        return new Response(JSON.stringify({
            bmi: 22.5,
            category: "Normal",
            advice: "Maintain your current healthy lifestyle with balanced diet and regular exercise."
        }), {
            status: 200,
            statusText: 'OK',
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
    
    // Default offline response
    return new Response(JSON.stringify({ error: "Offline mode - limited functionality available" }), {
        status: 503,
        statusText: 'Service Unavailable',
        headers: {
            'Content-Type': 'application/json'
        }
    });
}

// Activate event - clean up old caches
self.addEventListener('activate', function(event) {
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.map(function(cacheName) {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Background sync for offline actions
self.addEventListener('sync', function(event) {
    if (event.tag === 'background-sync') {
        event.waitUntil(doBackgroundSync());
    }
});

function doBackgroundSync() {
    // Handle any queued offline actions
    return Promise.resolve();
}

// Push notification handler
self.addEventListener('push', function(event) {
    const options = {
        body: event.data ? event.data.text() : 'New health tip available!',
        icon: '/static/images/icon-192x192.png',
        badge: '/static/images/badge-72x72.png',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        },
        actions: [
            {
                action: 'explore',
                title: 'Explore',
                icon: '/static/images/checkmark.png'
            },
            {
                action: 'close',
                title: 'Close',
                icon: '/static/images/xmark.png'
            }
        ]
    };
    
    event.waitUntil(
        self.registration.showNotification('Clinic-in-a-Phone', options)
    );
});

// Notification click handler
self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    
    if (event.action === 'explore') {
        event.waitUntil(
            clients.openWindow('/')
        );
    }
});

// Cache update strategy
self.addEventListener('message', function(event) {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});
