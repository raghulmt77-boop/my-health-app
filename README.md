<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI Medical Diagnosis Assistant</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        body {
            font-family: 'Inter', sans-serif;
        }
        .container {
            max-width: 800px;
        }
        .btn-primary {
            background-color: #2563eb;
            color: white;
            transition: transform 0.2s;
        }
        .btn-primary:hover {
            transform: translateY(-2px);
        }
        .card {
            background-color: white;
            border-radius: 12px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .input-field {
            border: 1px solid #d1d5db;
            border-radius: 8px;
            padding: 10px;
            width: 100%;
        }
        .loading-spinner {
            border: 4px solid #f3f3f3;
            border-top: 4px solid #3498db;
            border-radius: 50%;
            width: 24px;
            height: 24px;
            animation: spin 1s linear infinite;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        .error-message {
            color: #ef4444;
            font-size: 0.875rem;
            margin-top: 0.5rem;
        }
        .bg-login {
            background-color: black;
        }
        .table-striped tbody tr:nth-of-type(odd) {
            background-color: #f3f4f6;
        }
    </style>
</head>
<body class="bg-gray-100 flex items-center justify-center min-h-screen p-4">

    <!-- Login/Signup Section -->
    <div id="auth-container" class="card p-8 w-full max-w-sm bg-login text-white">
        <h1 class="text-3xl font-bold text-center text-blue-400 mb-2" id="auth-title">Health AI</h1>
        <p class="text-gray-300 text-center mb-6" id="auth-subtitle">Login to your account</p>
        <div class="space-y-4">
            <input type="email" id="email" placeholder="Enter Email" class="input-field bg-gray-800 text-white border-gray-700">
            <input type="password" id="password" placeholder="Enter random Password" class="input-field bg-gray-800 text-white border-gray-700">
            <div id="auth-error" class="error-message hidden"></div>
            <button id="loginBtn" class="btn-primary w-full py-3 rounded-full font-semibold">Login</button>
        </div>
    </div>

    <!-- Main Diagnosis App Section -->
    <div id="main-app" class="container mx-auto p-6 bg-white rounded-xl shadow-lg hidden">
        <header class="flex justify-between items-center mb-6">
            <div class="flex items-center space-x-2 text-blue-600">
                <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-heart-pulse"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/><path d="M3.22 10C5.12 10.42 6 11 6 12.5a2.5 2.5 0 0 1-1.77 2.25"/><path d="M12 21.32c1.76-1.5 4.5-4.05 4.5-7.82a5.5 5.5 0 0 0-8.5-4c1.24 1.5 2.5 3.5 3.5 5.5L12 21.32Z"/><path d="M10 13c1.5-1.5 3.2-2.5 5-2.5a2.5 2.5 0 0 1 1.77 2.25"/></svg>
                <h1 class="text-3xl font-bold" id="app-title">Health AI</h1>
            </div>
            <div class="flex items-center space-x-2">
                 <select id="language" class="input-field">
                    <option value="en">English</option>
                    <option value="hi">Hindi</option>
                    <option value="ta">Tamil</option>
                    <option value="te">Telugu</option>
                    <option value="bn">Bengali</option>
                </select>
                <button id="logoutBtn" class="px-4 py-2 rounded-full font-semibold text-gray-600 bg-gray-200 hover:bg-gray-300">
                    Logout
                </button>
            </div>
        </header>

        <!-- Patient Demographics Section -->
        <div class="mb-6 card p-4 flex flex-col items-center">
            <h2 class="text-lg font-semibold mb-2" id="demographics-title">Patient Demographics</h2>
            <div class="w-full space-y-2 max-w-sm">
                <input type="number" id="age" placeholder="Age" class="input-field text-center">
                <select id="gender" class="input-field text-center">
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                </select>
                <input type="number" id="weight" placeholder="Weight (kg)" class="input-field text-center">
            </div>
        </div>

        <!-- Patient Information Section -->
        <div class="card p-6 mb-6">
            <h2 class="text-2xl font-semibold mb-4" id="info-title">Patient Information</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                    <label for="symptoms" class="block text-gray-700 font-medium mb-1" id="symptoms-label">Symptoms (e.g., fever, cough, fatigue)</label>
                    <textarea id="symptoms" rows="4" class="input-field" placeholder="Describe the patient's symptoms..."></textarea>
                </div>
                <div>
                    <label for="history" class="block text-gray-700 font-medium mb-1" id="history-label">Medical History (e.g., diabetes, hypertension)</label>
                    <textarea id="history" rows="4" class="input-field" placeholder="Any relevant past medical conditions..."></textarea>
                </div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label for="temp" class="block text-gray-700 font-medium mb-1" id="temp-label">Temperature ($^{\circ}C$)</label>
                    <input type="number" id="temp" class="input-field" placeholder="e.g., 38.5">
                </div>
                <div>
                    <label for="bp" class="block text-gray-700 font-medium mb-1" id="bp-label">Blood Pressure (mmHg)</label>
                    <input type="text" id="bp" class="input-field" placeholder="e.g., 120/80">
                </div>
                <div>
                    <label for="heart_rate" class="block text-gray-700 font-medium mb-1" id="heart-rate-label">Heart Rate (bpm)</label>
                    <input type="number" id="heart_rate" class="input-field" placeholder="e.g., 85">
                </div>
            </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex justify-center space-x-4 mb-6">
            <button id="diagnoseBtn" class="btn-primary flex items-center px-6 py-3 rounded-full font-semibold">
                <span id="buttonText">Get Diagnosis</span>
                <div id="loadingSpinner" class="hidden loading-spinner ml-2"></div>
            </button>
            <button id="clearBtn" class="px-6 py-3 rounded-full font-semibold text-gray-600 bg-gray-200 hover:bg-gray-300">
                Clear
            </button>
        </div>

        <!-- Diagnosis Results Section -->
        <div id="results" class="hidden card p-6 overflow-x-auto">
            <h2 class="text-2xl font-bold text-green-700 mb-4 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check-circle-2 mr-2"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
                <span id="results-title">Diagnosis & Treatment Plan</span>
            </h2>
            <table class="min-w-full table-auto border-collapse table-striped">
                <thead>
                    <tr class="bg-gray-200 text-gray-700">
                        <th class="p-4 text-left font-bold" id="table-header-diagnosis">Diagnosis</th>
                        <th class="p-4 text-left font-bold" id="table-header-medication">Medication</th>
                        <th class="p-4 text-left font-bold" id="table-header-dosage">Dosage</th>
                        <th class="p-4 text-left font-bold" id="table-header-specialist">Specialist</th>
                        <th class="p-4 text-left font-bold" id="table-header-precautions">Precautions</th>
                    </tr>
                </thead>
                <tbody id="diagnosisTableBody">
                    <!-- Diagnosis results will be inserted here -->
                </tbody>
            </table>
            <div id="referralAlert" class="hidden mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative">
                <span class="block sm:inline font-semibold" id="referral-alert-text">Specialist Referral Required:</span>
                <p id="referralText" class="mt-2 text-sm"></p>
            </div>
        </div>

    </div>

    <script>
        // --- UI Element References ---
        const authContainer = document.getElementById('auth-container');
        const mainApp = document.getElementById('main-app');
        const loginBtn = document.getElementById('loginBtn');
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
        const authError = document.getElementById('auth-error');
        const logoutBtn = document.getElementById('logoutBtn');

        const diagnoseBtn = document.getElementById('diagnoseBtn');
        const clearBtn = document.getElementById('clearBtn');
        const resultsDiv = document.getElementById('results');
        const diagnosisTableBody = document.getElementById('diagnosisTableBody');
        const referralAlert = document.getElementById('referralAlert');
        const referralText = document.getElementById('referralText');
        const loadingSpinner = document.getElementById('loadingSpinner');
        const buttonText = document.getElementById('buttonText');
        const languageSelector = document.getElementById('language');
        
        // --- Language and Content Mappings ---
        const translations = {
            en: {
                title: "Health AI",
                subtitle: "Your assistant for better rural healthcare in India",
                loginTitle: "Login to your account",
                loginButton: "Login",
                demographicsTitle: "Patient Demographics",
                genderOptions: ["Select Gender", "Male", "Female", "Other"],
                languageTitle: "Language",
                infoTitle: "Patient Information",
                symptomsLabel: "Symptoms (e.g., fever, cough, fatigue)",
                historyLabel: "Medical History (e.g., diabetes, hypertension)",
                tempLabel: "Temperature ($^{\circ}C$)",
                bpLabel: "Blood Pressure (mmHg)",
                heartRateLabel: "Heart Rate (bpm)",
                getDiagnosis: "Get Diagnosis",
                clear: "Clear",
                resultsTitle: "Diagnosis & Treatment Plan",
                referralAlert: "Specialist Referral Required:",
                tableHeaders: ["Diagnosis", "Medication", "Dosage", "Specialist", "Precautions"],
                analyzing: "Analyzing...",
                enterSymptoms: "Please enter some symptoms to get a diagnosis.",
                networkError: "An error occurred. Please check your internet connection and try again."
            },
            hi: {
                title: "स्वास्थ्य एआई",
                subtitle: "ग्रामीण भारत में बेहतर स्वास्थ्य सेवा के लिए आपका सहायक",
                loginTitle: "अपने खाते में लॉग इन करें",
                loginButton: "लॉग इन करें",
                demographicsTitle: "रोगी जनसांख्यिकी",
                genderOptions: ["लिंग चुनें", "पुरुष", "महिला", "अन्य"],
                languageTitle: "भाषा",
                infoTitle: "रोगी की जानकारी",
                symptomsLabel: "लक्षण (उदाहरण: बुखार, खांसी, थकान)",
                historyLabel: "चिकित्सा इतिहास (उदाहरण: मधुमेह, उच्च रक्तचाप)",
                tempLabel: "तापमान ($^{\circ}C$)",
                bpLabel: "रक्तचाप (mmHg)",
                heartRateLabel: "हृदय गति (bpm)",
                getDiagnosis: "निदान प्राप्त करें",
                clear: "हटाएं",
                resultsTitle: "निदान और उपचार योजना",
                referralAlert: "विशेषज्ञ रेफरल आवश्यक है:",
                tableHeaders: ["निदान", "दवा", "खुराक", "विशेषज्ञ", "सावधानियां"],
                analyzing: "विश्लेषण हो रहा है...",
                enterSymptoms: "निदान प्राप्त करने के लिए कुछ लक्षण दर्ज करें।",
                networkError: "एक त्रुटि हुई। कृपया अपना इंटरनेट कनेक्शन जांचें और पुनः प्रयास करें।"
            },
            ta: {
                title: "சுகாதார AI",
                subtitle: "இந்திய கிராமப்புற சுகாதாரத்திற்கான உங்கள் உதவியாளர்",
                loginTitle: "உங்கள் கணக்கில் உள்நுழையவும்",
                loginButton: "உள்நுழையவும்",
                demographicsTitle: "நோயாளியின் புள்ளிவிவரங்கள்",
                genderOptions: ["பாலினத்தைத் தேர்ந்தெடுக்கவும்", "ஆண்", "பெண்", "மற்றவை"],
                languageTitle: "மொழி",
                infoTitle: "நோயாளியின் தகவல்",
                symptomsLabel: "அறிகுறிகள் (எ.கா., காய்ச்சல், இருமல், சோர்வு)",
                historyLabel: "மருத்துவ வரலாறு (எ.கா., நீரிழிவு, உயர் இரத்த அழுத்தம்)",
                tempLabel: "வெப்பநிலை ($^{\circ}C$)",
                bpLabel: "இரத்த அழுத்தம் (mmHg)",
                heartRateLabel: "இதய துடிப்பு (bpm)",
                getDiagnosis: "நோயறிதலைப் பெறுங்கள்",
                clear: "அழி",
                resultsTitle: "நோயறிதல் மற்றும் சிகிச்சைத் திட்டம்",
                referralAlert: "சிறப்பு மருத்துவர் பரிந்துரை தேவை:",
                tableHeaders: ["நோயறிதல்", "மருந்து", "மருந்தளவு", "சிறப்பு மருத்துவர்", "முன்னெச்சரிக்கைகள்"],
                analyzing: "பகுப்பாய்வு...",
                enterSymptoms: "நோயறிதலைப் பெற சில அறிகுறிகளை உள்ளிடவும்.",
                networkError: "ஒரு பிழை ஏற்பட்டது. தயவுசெய்து உங்கள் இணைய இணைப்பைச் சரிபார்த்து மீண்டும் முயற்சிக்கவும்."
            },
            te: {
                title: "హెల్త్ AI",
                subtitle: "గ్రామీణ భారతదేశంలో మెరుగైన ఆరోగ్య సంరక్షణ కోసం మీ సహాయకుడు",
                loginTitle: "మీ ఖాతాలోకి లాగిన్ అవ్వండి",
                loginButton: "లాగిన్",
                demographicsTitle: "రోగి జనాభా వివరాలు",
                genderOptions: ["లింగం ఎంచుకోండి", "పురుషుడు", "స్త్రీ", "ఇతర"],
                languageTitle: "భాష",
                infoTitle: "రోగి సమాచారం",
                symptomsLabel: "లక్షణాలు (ఉదాహరణకు, జ్వరం, దగ్గు, అలసట)",
                historyLabel: "వైద్య చరిత్ర (ఉదాహరణకు, మధుమేహం, అధిక రక్తపోటు)",
                tempLabel: "ఉష్ణోగ్రత ($^{\circ}C$)",
                bpLabel: "రక్తపోటు (mmHg)",
                heartRateLabel: "గుండె రేటు (bpm)",
                getDiagnosis: "వ్యాధి నిర్ధారణ పొందండి",
                clear: "క్లియర్",
                resultsTitle: "వ్యాధి నిర్ధారణ మరియు చికిత్సా ప్రణాళిక",
                referralAlert: "ప్రత్యేక వైద్య నిపుణుడు సిఫార్సు అవసరం:",
                tableHeaders: ["వ్యాధి నిర్ధారణ", "మందు", "మోతాదు", "ప్రత్యేక వైద్యుడు", "జాగ్రత్తలు"],
                analyzing: "విశ్లేషిస్తోంది...",
                enterSymptoms: "వ్యాధి నిర్ధారణ పొందడానికి కొన్ని లక్షణాలను నమోదు చేయండి.",
                networkError: "ఒక లోపం సంభవించింది. దయచేసి మీ ఇంటర్నెట్ కనెక్షన్‌ని తనిఖీ చేసి, మళ్లీ ప్రయత్నించండి."
            },
            bn: {
                title: "স্বাস্থ্য এআই",
                subtitle: "গ্রামীণ ভারতে উন্নত স্বাস্থ্যসেবার জন্য আপনার সহায়ক",
                loginTitle: "আপনার অ্যাকাউন্টে লগইন করুন",
                loginButton: "লগইন",
                demographicsTitle: "রোগীর জনসংখ্যা",
                genderOptions: ["লিঙ্গ নির্বাচন করুন", "পুরুষ", "মহিলা", "অন্যান্য"],
                languageTitle: "ভাষা",
                infoTitle: "রোগীর তথ্য",
                symptomsLabel: "লক্ষণ (যেমন: জ্বর, কাশি, ক্লান্তি)",
                historyLabel: "চিকিৎসা ইতিহাস (যেমন: ডায়াবেটিস, উচ্চ রক্তচাপ)",
                tempLabel: "তাপমাত্রা ($^{\circ}C$)",
                bpLabel: "রক্তচাপ (mmHg)",
                heartRateLabel: "হৃৎপিণ্ডের গতি (bpm)",
                getDiagnosis: "রোগ নির্ণয় পান",
                clear: "পরিষ্কার করুন",
                resultsTitle: "রোগ নির্ণয় এবং চিকিৎসা পরিকল্পনা",
                referralAlert: "বিশেষজ্ঞের রেফারেল প্রয়োজন:",
                tableHeaders: ["রোগ নির্ণয়", "ওষুধ", "মাত্রা", "বিশেষজ্ঞ", "সতর্কতা"],
                analyzing: "বিশलेषण করা হচ্ছে...",
                enterSymptoms: "রোগ নির্ণয় পেতে কিছু লক্ষণ লিখুন।",
                networkError: "একটি ত্রুটি ঘটেছে। দয়া করে আপনার ইন্টারনেট সংযোগ পরীক্ষা করুন এবং আবার চেষ্টা করুন।"
            }
        };

        const knowledgeBase = {
            "en": {
                "common_cold": {
                    "name": "Common Cold",
                    "confidence": "95%",
                    "drugs": ["Paracetamol", "Ibuprofen"],
                    "dosage": "Paracetamol: 500mg every 4-6 hours for adults. Ibuprofen: 200-400mg every 4-6 hours for adults.",
                    "specialist": "No specialist required.",
                    "precautions": "Rest, hydration, and over-the-counter pain relievers. Avoid crowded places. Wash hands frequently. Use a face mask to prevent spreading.",
                    "referral": false,
                    "referral_reason": ""
                },
                "malaria": {
                    "name": "Malaria",
                    "confidence": "80%",
                    "drugs": ["Artemether-Lumefantrine"],
                    "dosage": "Artemether-Lumefantrine: Two tablets, twice daily for three days.",
                    "specialist": "Infectious Disease Specialist.",
                    "precautions": "Based on a positive blood smear, immediate antimalarial medication is required. Complete the full course of medication. Use mosquito nets. Keep surroundings clean.",
                    "referral": true,
                    "referral_reason": "Malaria requires confirmation via blood test and close monitoring. Referral to a district hospital or a specialist is highly recommended."
                },
                "typhoid": {
                    "name": "Typhoid Fever",
                    "confidence": "70%",
                    "drugs": ["Ciprofloxacin", "Ceftriaxone"],
                    "dosage": "Ciprofloxacin: 500mg every 12 hours for 7-14 days.",
                    "specialist": "Gastroenterologist or General Physician.",
                    "precautions": "Symptomatic treatment with antipyretics and rehydration. Ensure food and water are clean. Wash hands before meals. Avoid raw vegetables and street food.",
                    "referral": true,
                    "referral_reason": "Typhoid requires lab confirmation and can lead to serious complications. Patient must be monitored closely in a clinical setting."
                }
            },
            "hi": {
                "common_cold": {
                    "name": "सामान्य सर्दी",
                    "confidence": "95%",
                    "drugs": ["प
