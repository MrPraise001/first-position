// Mission Page JavaScript

// Mobile menu toggle
document.getElementById('mobileMenuBtn').addEventListener('click', function() {
    const mobileMenu = document.getElementById('mobileMenu');
    mobileMenu.classList.toggle('hidden');
});

// Animated counter for impact statistics
function animateCounter(elementId, targetValue, duration = 2000) {
    const element = document.getElementById(elementId);
    const startTime = Date.now();
    const startValue = 0;
    
    function updateCounter() {
        const currentTime = Date.now();
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const currentValue = Math.floor(startValue + (targetValue - startValue) * easeOutQuart);
        
        element.textContent = currentValue.toLocaleString();
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        }
    }
    
    // Start animation when element is in viewport
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                updateCounter();
                observer.unobserve(entry.target);
            }
        });
    });
    
    observer.observe(element);
}

// Share mission functionality
function shareMission() {
    const shareData = {
        title: 'Clinic-in-a-Phone - Serving the God of All Flesh through Technology',
        text: 'Join our mission to make healthcare accessible to everyone through innovative technology.',
        url: window.location.href
    };
    
    if (navigator.share) {
        navigator.share(shareData)
            .then(() => console.log('Shared successfully'))
            .catch((error) => console.log('Error sharing:', error));
    } else {
        // Fallback for browsers that don't support Web Share API
        const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareData.text)}&url=${encodeURIComponent(shareData.url)}`;
        window.open(shareUrl, '_blank');
    }
}

// Learn more functionality
function learnMore() {
    // Create a modal with more information
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4';
    modal.innerHTML = `
        <div class="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div class="p-6">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-2xl font-bold text-gray-800">More About Our Mission</h3>
                    <button onclick="this.closest('.fixed').remove()" class="text-gray-500 hover:text-gray-700">
                        <i class="fas fa-times text-2xl"></i>
                    </button>
                </div>
                
                <div class="space-y-6">
                    <div>
                        <h4 class="text-xl font-bold text-purple-800 mb-3">
                            <i class="fas fa-history mr-2"></i>
                            Our Story
                        </h4>
                        <p class="text-gray-700 leading-relaxed">
                            Clinic-in-a-Phone was born from a vision to combine faith and technology for the betterment of humanity. 
                            We recognized that in today's digital age, healthcare access remains a challenge for many. 
                            Our solution leverages mobile technology to bridge this gap, making health information and services 
                            available to anyone with a smartphone.
                        </p>
                    </div>
                    
                    <div>
                        <h4 class="text-xl font-bold text-blue-800 mb-3">
                            <i class="fas fa-target mr-2"></i>
                            Our Goals
                        </h4>
                        <ul class="list-disc list-inside space-y-2 text-gray-700">
                            <li>Provide free health education to underserved communities</li>
                            <li>Connect people with nearby healthcare facilities</li>
                            <li>Promote preventive health practices</li>
                            <li>Reduce healthcare disparities through technology</li>
                            <li>Honor God through service to His creation</li>
                        </ul>
                    </div>
                    
                    <div>
                        <h4 class="text-xl font-bold text-green-800 mb-3">
                            <i class="fas fa-hands-helping mr-2"></i>
                            How You Can Help
                        </h4>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div class="bg-green-50 rounded-lg p-4">
                                <h5 class="font-semibold text-green-800 mb-2">Spread the Word</h5>
                                <p class="text-sm text-gray-700">Share our app with friends, family, and your community.</p>
                            </div>
                            <div class="bg-blue-50 rounded-lg p-4">
                                <h5 class="font-semibold text-blue-800 mb-2">Provide Feedback</h5>
                                <p class="text-sm text-gray-700">Help us improve by sharing your experience and suggestions.</p>
                            </div>
                            <div class="bg-purple-50 rounded-lg p-4">
                                <h5 class="font-semibold text-purple-800 mb-2">Partner with Us</h5>
                                <p class="text-sm text-gray-700">Healthcare providers can join our network of clinics.</p>
                            </div>
                            <div class="bg-yellow-50 rounded-lg p-4">
                                <h5 class="font-semibold text-yellow-800 mb-2">Support Our Mission</h5>
                                <p class="text-sm text-gray-700">Your prayers and encouragement help us serve better.</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg p-4">
                        <p class="text-center text-gray-800 font-medium">
                            <i class="fas fa-quote-left text-purple-600 mr-2"></i>
                            "The greatest way to serve God is to serve His people with love and compassion."
                            <i class="fas fa-quote-right text-purple-600 ml-2"></i>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close modal on outside click
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// Initialize animations and interactions
document.addEventListener('DOMContentLoaded', function() {
    // Start counter animations
    animateCounter('usersCount', 50000);
    animateCounter('clinicsCount', 150);
    animateCounter('checksCount', 25000);
    animateCounter('livesCount', 100000);
    
    // Add smooth scroll behavior
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
    
    // Add parallax effect to hero section
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.bg-gradient-to-r.from-purple-600.to-blue-600');
        if (hero && scrolled < 500) {
            hero.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    });
    
    // Add fade-in animation to sections
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                fadeObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe all sections
    document.querySelectorAll('section').forEach(section => {
        fadeObserver.observe(section);
    });
});

// Add custom animations
const style = document.createElement('style');
style.textContent = `
    .fade-in {
        animation: fadeInUp 0.8s ease forwards;
        opacity: 0;
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .bg-gradient-to-r.from-purple-600.to-blue-600 {
        transition: transform 0.3s ease;
    }
    
    .hover-lift {
        transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    
    .hover-lift:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
    }
    
    .pulse-slow {
        animation: pulse 3s infinite;
    }
    
    @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
    }
    
    .gradient-text {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
    }
    
    .card-hover {
        transition: all 0.3s ease;
    }
    
    .card-hover:hover {
        transform: translateY(-3px);
        box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
    }
`;
document.head.appendChild(style);

// Add hover effects to interactive elements
document.addEventListener('DOMContentLoaded', function() {
    // Add hover class to cards
    document.querySelectorAll('.bg-white.rounded-2xl').forEach(card => {
        card.classList.add('card-hover');
    });
    
    // Add pulse animation to prayer icon
    const prayerIcon = document.querySelector('.fa-pray');
    if (prayerIcon) {
        prayerIcon.classList.add('pulse-slow');
    }
});

// Add keyboard navigation
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        // Close any open modals
        const modals = document.querySelectorAll('.fixed.inset-0');
        modals.forEach(modal => modal.remove());
    }
});
