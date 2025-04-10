var firebaseConfig = {
    apiKey: "AIzaSyB2QfsFWPikZq5t5kBT5LgBhoRVez4pt34",
    authDomain: "web-server-afe0c.firebaseapp.com",
    databaseURL: "https://web-server-afe0c-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "web-server-afe0c",
    storageBucket: "web-server-afe0c.appspot.com",
    messagingSenderId: "1234567890",
    appId: "1:1234567890:web:abcdef123456"
};

firebase.initializeApp(firebaseConfig);

var sensorDataRef = firebase.database().ref('sensorData');
let hourlyData = { temp: 0, hum: 0, soil: 0, count: 0 };
let currentLanguage = 'en'; // Default language

sensorDataRef.on('value', (snapshot) => {
    const data = snapshot.val();
    if (data && data.receivedData) {
        const sensorValues = data.receivedData.split(',');

        const temp = parseFloat(sensorValues[0].split(':')[1]);
        const hum = parseFloat(sensorValues[1].split(':')[1]);
        const soil = parseFloat(sensorValues[2].split(':')[1]);

        // Update sensor value displays
        document.getElementById('temperature').innerText = `${temp.toFixed(2)} °C`;
        document.getElementById('humidity').innerText = `${hum.toFixed(2)} %`;
        document.getElementById('soilMoisture').innerText = `${soil.toFixed(2)} %`;

        // Update real-time data progress bars and values
        const tempBar = document.getElementById('tempBarUnique');
        const humidityBar = document.getElementById('humidityBarUnique');
        const soilBar = document.getElementById('soilBarUnique');
        const tempValue = document.getElementById('tempValueUnique');
        const humidityValue = document.getElementById('humidityValueUnique');
        const soilValue = document.getElementById('soilValueUnique');

        // Define max ranges for progress bars
        const maxTemp = 50; // Assuming 0-50°C range
        const maxHumidity = 100; // 0-100% range
        const maxSoil = 100; // 0-100% range

        // Calculate percentages
        const tempPercent = Math.min((temp / maxTemp) * 100, 100);
        const humidityPercent = Math.min((hum / maxHumidity) * 100, 100);
        const soilPercent = Math.min((soil / maxSoil) * 100, 100);

        // Update progress bar widths
        tempBar.style.width = `${tempPercent}%`;
        humidityBar.style.width = `${humidityPercent}%`;
        soilBar.style.width = `${soilPercent}%`;

        // Update value displays
        tempValue.innerText = `${temp.toFixed(2)}°C (Optimal: 20-30°C)`;
        humidityValue.innerText = `${hum.toFixed(2)}% (Optimal: 50-70%)`;
        soilValue.innerText = `${soil.toFixed(2)}% (Optimal: 20-60%)`;

        // Update graphs with real-time data and assumed time points
        updateGraphData('temp', temp, [20, 30], ['7 pm', '9 pm', '11 pm', '1 am', '3 am', '5 am', '7 am']); // Assumed time points
        updateGraphData('soil', soil, [20, 60], ['7 pm', '9 pm', '11 pm', '1 am', '3 am', '5 am', '7 am']); // Assumed time points
        updateMeterData(hum);

        // Hourly average calculation
        hourlyData.temp += temp;
        hourlyData.hum += hum;
        hourlyData.soil += soil;
        hourlyData.count++;

        if (hourlyData.count === 60) {
            const avgTemp = (hourlyData.temp / hourlyData.count).toFixed(2);
            const avgHum = (hourlyData.hum / hourlyData.count).toFixed(2);
            const avgSoil = (hourlyData.soil / hourlyData.count).toFixed(2);

            console.log(`Hourly Average - Temp: ${avgTemp}, Humidity: ${avgHum}, Soil: ${avgSoil}`);
            hourlyData = { temp: 0, hum: 0, soil: 0, count: 0 };
        }
    }
});

var npkDataRef = firebase.database().ref('sensorData/npk');

npkDataRef.on('value', (snapshot) => {
    const data = snapshot.val();
    console.log(data);

    if (data) {
        const npkValues = data;
        const npkArray = npkValues.split(',');
        const nitrogen = parseFloat(npkArray[0].split(':')[1].trim());
        const phosphorus = parseFloat(npkArray[1].split(':')[1].trim());
        const potassium = parseFloat(npkArray[2].split(':')[1].trim());

        document.getElementById('nitrogen').innerText = `${nitrogen.toFixed(2)} kg/ha`;
        document.getElementById('phosphorus').innerText = `${phosphorus.toFixed(2)} kg/ha`;
        document.getElementById('potassium').innerText = `${potassium.toFixed(2)} kg/ha`;
    } else {
        console.error('No NPK data available in Firebase.');
    }
});

document.getElementById('aiAssistBtn').addEventListener('click', function () {
    console.log("Button clicked. Fetching data from Flask server...");

    fetch('http://127.0.0.1:5000/get_fertilizer_recommendation')
        .then(response => response.json())
        .then(data => {
            if (data.fertilizer_recommendation) {
                document.getElementById('llmResponse').value = currentLanguage === 'en' 
                    ? data.fertilizer_recommendation 
                    : translateToTamil(data.fertilizer_recommendation); // Placeholder for translation
            } else {
                document.getElementById('llmResponse').value = currentLanguage === 'en' 
                    ? "No recommendation available." 
                    : "பரிந்துரை கிடைக்கவில்லை."; // Tamil translation placeholder
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            document.getElementById('llmResponse').value = currentLanguage === 'en' 
                ? "Error fetching recommendation." 
                : "பரிந்துரையை பெறுவதில் பிழை."; // Tamil translation placeholder
        });
});

const optimalDaysForGrowth = 180;
let daysSincePlanted = 54;

function updateTimelineProgressBar(value, maxValue) {
    const progressBar = document.getElementById('plantGrowthTimeline');
    const progressText = document.getElementById('timelineValueDisplay');

    if (progressBar) {
        const percentage = (value / maxValue) * 100;
        progressBar.style.width = `${Math.min(Math.max(percentage, 0), 100)}%`;
    } else {
        console.error('Progress bar element not found');
    }

    if (progressText) {
        progressText.innerText = `Day ${value} of ${maxValue}`;
    }
}

function updateDaysSincePlanted() {
    document.getElementById('daysSincePlanted').innerText = `${daysSincePlanted} Days`;
    updateTimelineProgressBar(daysSincePlanted, optimalDaysForGrowth);
}

updateDaysSincePlanted();

function updatePestDetection(severity, text) {
    let severityLevel = document.getElementById("pestSeverityLevel");
    severityLevel.style.width = severity + "%";

    if (severity >= 70) {
        severityLevel.style.background = "linear-gradient(90deg, #f44336, #ff9800)";
    } else if (severity >= 40) {
        severityLevel.style.background = "linear-gradient(90deg, #ff9800, #f57c00)";
    } else {
        severityLevel.style.background = "linear-gradient(90deg, #4caf50, #66bb6a)";
    }

    document.getElementById("severityText").innerText = currentLanguage === 'en' ? text : translateToTamil(text); // Placeholder for translation
}

function updateLeafDisease(description, advice) {
    document.getElementById("leafDiseaseDescription").innerText = currentLanguage === 'en' ? description : translateToTamil(description); // Placeholder for translation

    let diseaseAdviceBox = document.createElement("div");
    diseaseAdviceBox.classList.add("llm-response-box");
    diseaseAdviceBox.innerHTML = "<h5>AI Response</h5><textarea rows='4' style='width: 100%; background: #3c3c3c; color: #ffffff; border: 1px solid #4c4c4c; border-radius: 10px; padding: 10px;' readonly>" + (currentLanguage === 'en' ? advice : translateToTamil(advice)) + "</textarea>";
    document.querySelector(".leaf-disease-text-content").appendChild(diseaseAdviceBox);
}

updatePestDetection(50, "Detected increased pest activity in the southern quadrant. Preventive measures recommended.");
updateLeafDisease("Leaf Spot Detected", "Apply appropriate fungicides and ensure proper irrigation.");

// Theme Toggle Function
function toggleTheme() {
    const body = document.body;
    body.classList.toggle('light-mode');
    const themeIcon = document.getElementById('themeIcon');
    themeIcon.className = body.classList.contains('light-mode') ? 'fas fa-sun' : 'fas fa-moon';
}

// Navbar Toggle and Scroll Behavior
function toggleNavbar() {
    const dropdown = document.getElementById('navDropdown');
    dropdown.classList.toggle('active');
}

function toggleLangDropdown() {
    const dropdown = document.getElementById('langDropdown');
    dropdown.classList.toggle('active');
}

function scrollToSection(id) {
    const element = document.getElementById(id);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
    document.getElementById('navDropdown').classList.remove('active');
    document.getElementById('langDropdown').classList.remove('active');
}

let lastScroll = 0;
window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    const navbar = document.querySelector('.navbar');
    if (currentScroll > lastScroll) {
        navbar.classList.add('hidden');
    } else {
        navbar.classList.remove('hidden');
    }
    lastScroll = currentScroll;
});

// Show Login Page with Transition (Redirects to login.html)
function showLogin() {
    window.location.href = 'login.html';
}

// Language Selection Functions
function setLanguage(lang) {
    currentLanguage = lang;
    updateLanguage();
    document.getElementById('langDropdown').classList.remove('active');
}

function setLLMLanguage(lang) {
    currentLanguage = lang;
    updateLanguage();
}

function updateLanguage() {
    const translations = {
        en: {
            temperature: "Temperature",
            humidity: "Humidity",
            soilMoisture: "Soil Moisture",
            nitrogen: "Nitrogen",
            phosphorus: "Phosphorus",
            potassium: "Potassium",
            realTime: "Real-time Monitoring",
            growth: "Growth Timeline",
            assistant: "Agros Assistant",
            drone: "Drone Survey",
            pest: "Pest Detection Severity",
            disease: "Disease Detection Severity",
            environmental: "Environmental Indicators",
            salinity: "Salinity",
            phLevel: "pH Level",
            microbialActivity: "Microbial Activity"
        },
        ta: {
            temperature: "வெப்பநிலை",
            humidity: "ஈரப்பதம்",
            soilMoisture: "மண் ஈரப்பதம்",
            nitrogen: "நைட்ரஜன்",
            phosphorus: "பாஸ்பரஸ்",
            potassium: "பொட்டாசியம்",
            realTime: "நிகழ்நேர கண்காணிப்பு",
            growth: "வளர்ச்சி காலவரிசை",
            assistant: "அக்ரோஸ் உதவியாளர்",
            drone: "ட்ரோன் சர்வே",
            pest: "பூச்சி கண்டறிதல் தீவிரம்",
            disease: "நோய் கண்டறிதல் தீவிரம்",
            environmental: "சுற்றுச்சூழல் குறிகள்",
            salinity: "உப்புத்தன்மை",
            phLevel: "pH மட்டம்",
            microbialActivity: "மைக்ரோபியல் செயல்பாடு"
        }
    };

    document.querySelectorAll('.card-header').forEach(header => {
        const text = header.textContent.trim();
        if (translations[currentLanguage][text]) {
            header.textContent = translations[currentLanguage][text];
        }
    });

    document.querySelectorAll('.sensor-value').forEach(value => {
        const text = value.textContent.trim();
        if (text.includes('°C')) {
            value.textContent = `${parseFloat(text)} °C`;
        } else if (text.includes('%')) {
            value.textContent = `${parseFloat(text)} %`;
        } else if (text.includes('kg/ha')) {
            value.textContent = `${parseFloat(text)} kg/ha`;
        }
    });

    document.querySelector('.calendar-box .card-header').textContent = translations[currentLanguage]['growth'];
    document.querySelector('.llm-box .card-header').textContent = translations[currentLanguage]['assistant'];
    document.querySelector('.drone-report-box .card-header').textContent = translations[currentLanguage]['drone'];
    document.querySelector('.pest-box .card-header').textContent = translations[currentLanguage]['pest'];
    document.querySelector('.disease-box .card-header').textContent = translations[currentLanguage]['disease'];
    document.querySelector('.environmental-box .card-header').textContent = translations[currentLanguage]['environmental'];
    document.querySelectorAll('.env-item span').forEach(span => {
        const text = span.textContent.trim();
        if (translations[currentLanguage][text]) {
            span.textContent = translations[currentLanguage][text];
        }
    });

    // Update real-time monitoring headers
    document.querySelector('.real-time .card-header').textContent = translations[currentLanguage]['realTime'];
    document.querySelector('.graph-card:nth-child(1) .card-header').textContent = translations[currentLanguage]['temperature'] + ' Graph';
    document.querySelector('.graph-card:nth-child(2) .card-header').textContent = translations[currentLanguage]['soilMoisture'] + ' Graph';
}

// Placeholder for translation (to be implemented with a proper API or service)
function translateToTamil(text) {
    // This is a placeholder; replace with actual translation logic or API call
    const tamilTranslations = {
        "Detected increased pest activity in the southern quadrant. Preventive measures recommended.": "தெற்கு பகுதியில் பூச்சி செயல்பாடு அதிகரித்துள்ளது. தடுப்பு நடவடிக்கைகள் பரிந்துரைக்கப்படுகின்றன.",
        "Leaf Spot Detected": "இலை புள்ளி கண்டறியப்பட்டது",
        "Apply appropriate fungicides and ensure proper irrigation.": "பொருத்தமான பூச்சிக்கொல்லிகளை பயன்படுத்தவும் மற்றும் சரியான நீர்ப்பாசனத்தை உறுதி செய்யவும்.",
        "Based on current soil conditions, consider applying nitrogen-rich fertilizer within the next 7 days to optimize plant growth.": "தற்போதைய மண் நிலைமைகளை அடிப்படையாகக் கொண்டு, பயிர் வளர்ச்சியை உகந்ததாக்குவதற்கு அடுத்த 7 நாட்களுக்குள் நைட்ரஜன் நிறைந்த உரத்தை பயன்படுத்துவதை கருத்தில் கொள்ளவும்.",
        "No recommendation available.": "பரிந்துரை கிடைக்கவில்லை.",
        "Error fetching recommendation.": "பரிந்துரையை பெறுவதில் பிழை."
    };
    return tamilTranslations[text] || text;
}

// Graph and Meter Updates (Dynamic with Chart.js)
let tempChart, soilChart;

function updateGraph(period, type) {
    const labels = ['7 pm', '9 pm', '11 pm', '1 am', '3 am', '5 am', '7 am']; // Assumed time points
    const dataPoints = Array(7).fill(type === 'temp' ? parseFloat(document.getElementById('temperature').innerText) : parseFloat(document.getElementById('soilMoisture').innerText));

    const data = {
        labels: labels,
        datasets: [{
            label: type === 'temp' ? 'Temperature (°C)' : 'Soil Moisture (%)',
            data: dataPoints,
            fill: true,
            borderColor: '#ff8c00', // Orange curve like the image
            backgroundColor: 'rgba(255, 140, 0, 0.2)', // Shaded area
            tension: 0.1
        }]
    };

    const options = {
        scales: {
            y: {
                beginAtZero: true,
                title: { display: true, text: type === 'temp' ? 'Temperature (°C)' : 'Soil Moisture (%)' },
                suggestedMin: type === 'temp' ? 0 : 0,
                suggestedMax: type === 'temp' ? 50 : 100
            },
            x: { title: { display: true, text: 'Time' } }
        },
        plugins: {
            legend: { display: false },
            annotation: {
                annotations: {
                    optimalRange: {
                        type: 'box',
                        yMin: type === 'temp' ? 20 : 20,
                        yMax: type === 'temp' ? 30 : 60,
                        backgroundColor: 'rgba(0, 255, 0, 0.1)',
                        borderColor: 'rgba(0, 255, 0, 0.5)',
                        borderWidth: 1
                    }
                }
            }
        }
    };

    if (type === 'temp' && !tempChart) {
        const ctx = document.getElementById('tempGraph').getContext('2d');
        tempChart = new Chart(ctx, { type: 'line', data: data, options: options });
    } else if (type === 'soil' && !soilChart) {
        const ctx = document.getElementById('soilGraph').getContext('2d');
        soilChart = new Chart(ctx, { type: 'line', data: data, options: options });
    } else if (type === 'temp' && tempChart) {
        tempChart.data = data;
        tempChart.options = options;
        tempChart.update();
    } else if (type === 'soil' && soilChart) {
        soilChart.data = data;
        soilChart.options = options;
        soilChart.update();
    }
}

function updateMeter(period, type) {
    const hum = parseFloat(document.getElementById('humidity').innerText);
    const offset = 314 - (hum / 100) * 314;
    document.querySelector('.meter .value').setAttribute('stroke-dashoffset', offset);
    document.querySelector('.meter .percentage').textContent = `${hum.toFixed(2)}%`;
}

function updateGraphData(type, value, optimalRange, labels) {
    if (type === 'temp' && tempChart) {
        tempChart.data.labels = labels; // Use assumed time points
        tempChart.data.datasets[0].data = Array(7).fill(value); // Dynamic real-time data from sensors
        tempChart.options.plugins.annotation.annotations.optimalRange = {
            type: 'box',
            yMin: optimalRange[0],
            yMax: optimalRange[1],
            backgroundColor: 'rgba(0, 255, 0, 0.1)',
            borderColor: 'rgba(0, 255, 0, 0.5)',
            borderWidth: 1
        };
        tempChart.update();
    } else if (type === 'soil' && soilChart) {
        soilChart.data.labels = labels; // Use assumed time points
        soilChart.data.datasets[0].data = Array(7).fill(value); // Dynamic real-time data from sensors
        soilChart.options.plugins.annotation.annotations.optimalRange = {
            type: 'box',
            yMin: optimalRange[0],
            yMax: optimalRange[1],
            backgroundColor: 'rgba(0, 255, 0, 0.1)',
            borderColor: 'rgba(0, 255, 0, 0.5)',
            borderWidth: 1
        };
        soilChart.update();
    }
}

function updateMeterData(value) {
    const offset = 314 - (value / 100) * 314;
    document.querySelector('.meter .value').setAttribute('stroke-dashoffset', offset);
    document.querySelector('.meter .percentage').textContent = `${value.toFixed(2)}%`;
}

// Initialize graphs and meter
document.addEventListener('DOMContentLoaded', () => {
    updateGraph('daily', 'temp');
    updateGraph('daily', 'soil');
    updateMeter('daily', 'humidity');
});

// Initialize language
updateLanguage();

sc
