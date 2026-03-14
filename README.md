# Clinic-in-a-Phone

A progressive web application (PWA) for health management, symptom checking, fitness tracking, and finding nearby healthcare facilities.

## 🏥 Features

- **Symptom Checker**: AI-powered preliminary health assessment based on symptoms
- **Fitness Tracker**: Daily exercise routines with detailed tutorials
- **Clinic Locator**: Interactive map to find nearby healthcare facilities
- **Health Score**: Daily health assessment with personalized advice
- **BMI Calculator**: Calculate and track body mass index
- **Emergency Help**: Quick access to emergency information and nearby clinics
- **Offline Support**: Full functionality available even without internet connection
- **PWA Ready**: Install as a mobile app on any device

## 🙏 Mission

"Lord of All through Technology"

This application was built to care for people's health using technology, reflecting our commitment to serving humanity under the Lordship of the Almighty. The project is inspired by Jeremiah 32:27: "Behold, I am the Lord, the God of all flesh: is there any thing too hard for me?".

## 🛠 Tech Stack

### Frontend
- **HTML5**, **CSS3**, **JavaScript**
- **Tailwind CSS** for modern UI design
- **Font Awesome** for icons
- **Chart.js** for data visualization
- **Leaflet.js** for interactive maps

### Backend
- **Python Flask** web framework
- **JSON** for data storage

### PWA Features
- **Service Workers** for offline caching
- **Web App Manifest** for app installation
- **Responsive Design** for all devices

## 📋 Prerequisites

- Python 3.7 or higher
- pip (Python package manager)
- Modern web browser (Chrome, Firefox, Safari, Edge)

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd clinic-in-a-phone
```

### 2. Create Virtual Environment
```bash
python -m venv venv

# On Windows
venv\Scripts\activate

# On macOS/Linux
source venv/bin/activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Run the Application
```bash
python app.py
```

### 5. Access the Application
Open your web browser and navigate to:
```
http://localhost:5000
```

## 📱 PWA Installation

### On Desktop (Chrome/Edge)
1. Open the application in Chrome/Edge
2. Click the install icon (⬇) in the address bar
3. Click "Install" to add to your desktop

### On Mobile
1. Open the application in Chrome/Safari
2. Look for "Add to Home Screen" option in browser menu
3. Tap "Add" to install the app

## 🗂 Project Structure

```
clinic-in-a-phone/
├── app.py                 # Flask backend application
├── service-worker.js      # PWA service worker for offline support
├── requirements.txt       # Python dependencies
├── templates/            # HTML templates
│   ├── index.html       # Home page
│   ├── symptom.html     # Symptom checker
│   ├── fitness.html     # Fitness page
│   ├── clinics.html     # Clinic map
│   └── mission.html     # Mission page
├── static/              # Static assets
│   ├── css/
│   │   └── style.css    # Custom styles
│   ├── js/
│   │   ├── main.js      # Home page scripts
│   │   ├── symptom.js   # Symptom checker scripts
│   │   ├── fitness.js   # Fitness page scripts
│   │   ├── clinics.js   # Map functionality
│   │   └── mission.js   # Mission page scripts
│   ├── images/          # Icons and images (see README.md)
│   └── manifest.json    # PWA manifest
└── data/                # JSON data files
    ├── exercises.json   # Exercise database
    ├── clinics.json     # Clinic information
    └── quotes.json      # Daily health quotes
```

## 🎨 Customization

### Adding New Exercises
Edit `data/exercises.json`:
```json
{
    "name": "Exercise Name",
    "benefit": "Description of benefits",
    "instructions": ["Step 1", "Step 2", "Step 3"],
    "repetitions": "10-15 reps",
    "sets": "3 sets"
}
```

### Adding New Clinics
Edit `data/clinics.json`:
```json
{
    "name": "Clinic Name",
    "address": "Full Address",
    "phone": "+234-XXX-XXX-XXXX",
    "coordinates": [latitude, longitude],
    "services": ["Service 1", "Service 2"]
}
```

### Modifying Symptom Rules
Edit `SYMPTOM_RULES` in `app.py` to add new symptom combinations and their corresponding conditions.

## 🔧 API Endpoints

- `GET /` - Home page
- `GET /symptom` - Symptom checker page
- `GET /fitness` - Fitness page
- `GET /clinics` - Clinic map page
- `GET /mission` - Mission page
- `GET /api/exercise` - Get daily exercises
- `GET /api/clinics` - Get clinic data
- `GET /api/quote` - Get daily quote
- `POST /api/symptom-check` - Analyze symptoms
- `POST /api/bmi` - Calculate BMI
- `POST /api/health-score` - Calculate health score

## 🌐 Offline Functionality

The application works offline thanks to service worker caching:
- All pages are cached for offline access
- API calls return cached data when offline
- Maps show cached clinic locations when internet is unavailable

## 📱 Mobile Features

- **Responsive Design**: Optimized for all screen sizes
- **Touch-Friendly**: Large buttons and intuitive navigation
- **App-Like Experience**: Full-screen mode when installed as PWA
- **Location Services**: Find clinics near your current location

## 🚨 Emergency Features

- **Emergency Button**: Quick access to emergency information
- **Nearest Clinics**: Shows closest healthcare facilities
- **Emergency Contacts**: Displays important emergency numbers

## 🎯 Educational Purpose

This project was created for an ICT exhibition to demonstrate:
- Modern web development techniques
- PWA capabilities
- Healthcare technology applications
- Faith-based service through technology

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- **Jeremiah 32:27** - Biblical foundation for our mission
- **OpenStreetMap** - Map tiles for clinic locations
- **Font Awesome** - Icon library
- **Tailwind CSS** - CSS framework
- **Chart.js** - Data visualization library

## 📞 Support

For questions, suggestions, or support:
- Create an issue in the repository
- Contact the development team

---

*"Lord of All through Technology"* 🙏💙
