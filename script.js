
// staff.json से स्टाफ डाटा लोड करना
fetch("staff.json")
  .then(response => response.json())
  .then(data => {
    const staffContainer = document.getElementById("staff-list"); // index.html में जो container है उसका id

    data.pravakta.forEach(staff => {
      const div = document.createElement("div");
      div.classList.add("staff-card");

      div.innerHTML = `
        <img src="${staff.photo}" alt="${staff.name}" class="staff-photo">
        <h3>${staff.name}</h3>
        <p>${staff.post}</p>
      `;

      staffContainer.appendChild(div);
    });
  })
  .catch(error => console.error("Error loading staff:", error));
  
  
  



// ===== Navigation History Management =====
let currentSection = 'home';
const sectionHistory = ['home'];

// Section dikhane ka function
function showSection(sectionId) {
    // Agar same section hai to kuch na kare
    if (sectionId === currentSection) return;
    
    // History mein add kare
    sectionHistory.push(sectionId);
    currentSection = sectionId;
    
    // Sab sections ko hide kare
    const sections = document.querySelectorAll('.container > div');
    sections.forEach(div => {
        div.classList.add('hidden');
        div.style.display = 'none';
    });
    
    // Selected section ko show kare
    const section = document.getElementById(sectionId);
    if (section) {
        section.classList.remove('hidden');
        section.style.display = 'block';
    }
    
    // Page ke top par scroll kare
    window.scrollTo(0, 0);
    
    // Active button ko update kare
    updateActiveButton(sectionId);
}

// Back button handle karne ka function
function handleBackNavigation() {
    if (sectionHistory.length > 1) {
        // Current section ko history se remove kare
        sectionHistory.pop();
        // Pichle section par jaye
        const prevSection = sectionHistory[sectionHistory.length - 1];
        showSection(prevSection);
        return true; // Navigation handled
    }
    return false; // No more history
}

// Back button ke liye function
function goBack() {
    if (!handleBackNavigation()) {
        // Agar history khatam ho gaya to home par jaye
        showSection('home');
    }
}

// Page load hone par initialization
document.addEventListener('DOMContentLoaded', function() {
    // Android WebView back button ke liye
    window.onpopstate = function(event) {
        if (!handleBackNavigation()) {
            // Agar history khatam ho gaya to app band kare
            if (window.AndroidInterface) {
                AndroidInterface.closeApp();
            }
        }
    };
    
    // Browser back button ke liye
    window.addEventListener('popstate', function(event) {
        handleBackNavigation();
    });
    
    // Initial state - home section dikhaye
    showSection('home');
    
    // Back buttons ko configure kare
    document.querySelectorAll('.back-btn').forEach(btn => {
        btn.onclick = goBack;
    });
    
    // Agar Android interface available hai to notification bheje
    if (window.AndroidInterface) {
        AndroidInterface.pageLoaded();
    }
});

// Active nav button ko update karne ka function
function updateActiveButton(sectionId) {
    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(button => {
        button.classList.remove('active');
    });
    
    const activeButton = document.querySelector(`.nav-btn[onclick="showSection('${sectionId}')"]`);
    if (activeButton) {
        activeButton.classList.add('active');
    }
}


    // Principal Profile Page Functions
    function openPrincipalProfile() {
        const profile = document.getElementById('principalProfile');
        if (profile) {
            profile.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }
    
    function closePrincipalProfile() {
        const profile = document.getElementById('principalProfile');
        if (profile) {
            profile.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    }
    
    // Update the principal image in the staff section to be clickable
    document.addEventListener('DOMContentLoaded', function() {
        const principalImg = document.querySelector('.principal-img');
        if (principalImg) {
            principalImg.style.cursor = 'pointer';
            principalImg.addEventListener('click', openPrincipalProfile);
        }
    });
    
    
    
// ===== Firebase Configuration =====
const firebaseConfig = {
    apiKey: "AIzaSyDv4R-NEsfzlYSWInwSv3LmNq3hhEABXNA",
    authDomain: "shambhu-dayal-1122.firebaseapp.com",
    projectId: "shambhu-dayal-1122",
    storageBucket: "shambhu-dayal-1122.appspot.com",
    messagingSenderId: "635905565367",
    appId: "1:635905565367:web:1de5aed7da39b6f9c8a332"
};

// Initialize Firebase
let db, messaging;

try {
    const app = firebase.initializeApp(firebaseConfig);
    db = firebase.firestore();
    
    if (firebase.messaging.isSupported()) {
        messaging = firebase.messaging();
    }
} catch (error) {
    console.error("Firebase initialization error:", error);
}

// ===== Navigation Functions =====
function scrollNav(amount) {
    const navButtons = document.querySelector('.nav-buttons');
    navButtons.scrollBy({
        left: amount,
        behavior: 'smooth'
    });
}

function setupWheelScroll() {
    const navButtons = document.querySelector('.nav-buttons');
    if (!navButtons) return;
    
    navButtons.addEventListener('wheel', function(e) {
        e.preventDefault();
        this.scrollLeft += e.deltaY;
    });
}

function checkNavScroll() {
    const navButtons = document.querySelector('.nav-buttons');
    const leftBtn = document.querySelector('.nav-scroll-btn.left');
    const rightBtn = document.querySelector('.nav-scroll-btn.right');
    
    if (!navButtons || !leftBtn || !rightBtn) return;
    
    if (navButtons.scrollLeft <= 10) {
        leftBtn.style.opacity = '0.5';
        leftBtn.style.pointerEvents = 'none';
    } else {
        leftBtn.style.opacity = '1';
        leftBtn.style.pointerEvents = 'auto';
    }
    
    if (navButtons.scrollLeft >= navButtons.scrollWidth - navButtons.clientWidth - 10) {
        rightBtn.style.opacity = '0.5';
        rightBtn.style.pointerEvents = 'none';
    } else {
        rightBtn.style.opacity = '1';
        rightBtn.style.pointerEvents = 'auto';
    }
}

function initNavigation() {
    const navButtons = document.querySelector('.nav-buttons');
    if (navButtons) {
        navButtons.addEventListener('scroll', checkNavScroll);
        setupWheelScroll();
        checkNavScroll();
        
        navButtons.addEventListener('mousedown', function(e) {
            if (e.target.classList.contains('nav-btn')) {
                e.preventDefault();
            }
        });
    }
}

// ===== Section Management =====
function showSection(sectionId) {
    // Hide all sections
    const sections = document.querySelectorAll('.container > div');
    sections.forEach(div => {
        div.classList.add('hidden');
        div.style.display = 'none';
    });
    
    // Show selected section
    const section = document.getElementById(sectionId);
    if (section) {
        section.classList.remove('hidden');
        section.style.display = 'block';
    }
    
    // Scroll to top
    window.scrollTo(0, 0);
    
    // Update active button
    updateActiveButton(sectionId);
}

function updateActiveButton(sectionId) {
    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(button => {
        button.classList.remove('active');
    });
    
    const activeButton = document.querySelector(`.nav-btn[onclick="showSection('${sectionId}')"]`);
    if (activeButton) {
        activeButton.classList.add('active');
    }
}

// ===== Gallery Modal Functions =====
function openModal(imageSrc) {
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    
    if (modal && modalImg) {
        modal.classList.add('active');
        modalImg.src = imageSrc;
        document.body.style.overflow = 'hidden';
    }
}

function closeModal() {
    const modal = document.getElementById('imageModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

// ===== Form Handling =====
function updateSubjectOptions() {
    const classSelect = document.getElementById('class');
    const streamSelect = document.getElementById('stream');
    const streamGroup = document.getElementById('streamGroup');
    const subjectGroup = document.getElementById('subjectGroup');
    const subjectOptions = document.getElementById('subjectOptions');
    
    subjectOptions.innerHTML = '';
    subjectGroup.style.display = 'none';
    streamGroup.style.display = 'none';
    
    const selectedClass = classSelect.value;
    if (!selectedClass) return;
    
    if (selectedClass === '11' || selectedClass === '12') {
        streamGroup.style.display = 'block';
    }
    
    const selectedStream = streamSelect.value;
    if ((selectedClass === '11' || selectedClass === '12') && !selectedStream) {
        return;
    }
    
    subjectGroup.style.display = 'block';
    let subjects = [];
    
    if (selectedClass === '6' || selectedClass === '7' || selectedClass === '8') {
        subjects = [
            { name: 'hindi', label: 'हिंदी', required: true },
            { name: 'english', label: 'अंग्रेजी', required: true },
            { name: 'maths', label: 'गणित', required: true },
            { name: 'science', label: 'विज्ञान', required: true },
            { name: 'social_science', label: 'सामाजिक विज्ञान', required: true },
            { name: 'sanskrit', label: 'संस्कृत', required: true },
            { name: 'computer', label: 'कंप्यूटर', required: false }
        ];
    }
    else if (selectedClass === '9' || selectedClass === '10') {
        subjects = [
            { name: 'hindi', label: 'हिंदी', required: true },
            { name: 'english', label: 'अंग्रेजी', required: true },
            { name: 'maths', label: 'गणित', required: true },
            { name: 'science', label: 'विज्ञान', required: true },
            { name: 'social_science', label: 'सामाजिक विज्ञान', required: true },
            { name: 'computer', label: 'कंप्यूटर', required: false },
            { name: 'drawing', label: 'ड्राइंग', required: false }
        ];
    }
    else if (selectedClass === '11' || selectedClass === '12') {
        if (selectedStream === 'science') {
            subjects = [
                { name: 'physics', label: 'भौतिक विज्ञान', required: true },
                { name: 'chemistry', label: 'रसायन विज्ञान', required: true },
                { name: 'maths', label: 'गणित', required: false },
                { name: 'biology', label: 'जीव विज्ञान', required: false },
                { name: 'computer_science', label: 'कंप्यूटर विज्ञान', required: false },
                { name: 'hindi', label: 'हिंदी', required: true },
                { name: 'english', label: 'अंग्रेजी', required: true }
            ];
        }
        else if (selectedStream === 'commerce') {
            subjects = [
                { name: 'accountancy', label: 'लेखाशास्त्र', required: true },
                { name: 'business_studies', label: 'व्यवसाय अध्ययन', required: true },
                { name: 'economics', label: 'अर्थशास्त्र', required: true },
                { name: 'maths', label: 'गणित', required: false },
                { name: 'computer_science', label: 'कंप्यूटर विज्ञान', required: false },
                { name: 'hindi', label: 'हिंदी', required: true },
                { name: 'english', label: 'अंग्रेजी', required: true }
            ];
        }
        else if (selectedStream === 'arts') {
            subjects = [
                { name: 'history', label: 'इतिहास', required: true },
                { name: 'political_science', label: 'राजनीति विज्ञान', required: true },
                { name: 'geography', label: 'भूगोल', required: true },
                { name: 'economics', label: 'अर्थशास्त्र', required: false },
                { name: 'psychology', label: 'मनोविज्ञान', required: false },
                { name: 'sociology', label: 'समाजशास्त्र', required: false },
                { name: 'hindi', label: 'हिंदी', required: true },
                { name: 'english', label: 'अंग्रेजी', required: true },
                { name: 'sanskrit', label: 'संस्कृत', required: false }
            ];
        }
    }
    
    subjects.forEach(subject => {
        const subjectDiv = document.createElement('div');
        subjectDiv.style.marginBottom = '10px';
        
        if (subject.required) {
            const hiddenInput = document.createElement('input');
            hiddenInput.type = 'hidden';
            hiddenInput.name = 'subjects[]';
            hiddenInput.value = subject.name;
            hiddenInput.checked = true;
            subjectDiv.appendChild(hiddenInput);
            
            const label = document.createElement('label');
            label.style.display = 'flex';
            label.style.alignItems = 'center';
            label.innerHTML = `<i class="fas fa-check" style="color: var(--accent); margin-right: 8px;"></i> ${subject.label} (अनिवार्य)`;
            subjectDiv.appendChild(label);
        } else {
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.name = 'subjects[]';
            checkbox.value = subject.name;
            checkbox.id = `subject_${subject.name}`;
            checkbox.style.marginRight = '8px';
            
            const label = document.createElement('label');
            label.htmlFor = `subject_${subject.name}`;
            label.style.display = 'flex';
            label.style.alignItems = 'center';
            label.appendChild(checkbox);
            label.appendChild(document.createTextNode(subject.label));
            
            subjectDiv.appendChild(label);
        }
        
        subjectOptions.appendChild(subjectDiv);
    });
}

function validateSubjects() {
    const classSelect = document.getElementById('class').value;
    const streamSelect = document.getElementById('stream').value;
    const subjectCheckboxes = document.querySelectorAll('input[name="subjects[]"]:checked');
    
    if (classSelect === '11' || classSelect === '12') {
        let requiredOptionalCount = 0;
        
        if (streamSelect === 'science') {
            requiredOptionalCount = 1;
        } else if (streamSelect === 'commerce') {
            requiredOptionalCount = 1;
        } else if (streamSelect === 'arts') {
            requiredOptionalCount = 2;
        }
        
        let optionalSelected = 0;
        subjectCheckboxes.forEach(checkbox => {
            if (!checkbox.disabled) {
                optionalSelected++;
            }
        });
        
        if (optionalSelected < requiredOptionalCount) {
            const validationMessage = document.getElementById('subjectValidation');
            if (validationMessage) {
                validationMessage.textContent = `कृपया कम से कम ${requiredOptionalCount} वैकल्पिक विषय चुनें`;
            }
            return false;
        }
    }
    return true;
}

async function submitEnrollmentForm(event) {
    event.preventDefault();
    
    if (!validateSubjects()) {
        return;
    }
    
    const form = event.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const statusMessage = document.getElementById('statusMessage');
    
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> प्रोसेस हो रहा है...';
    
    try {
        const formData = new FormData(form);
        
        const response = await fetch(form.action, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        });
        
        if (response.ok) {
            statusMessage.className = 'status-message success';
            statusMessage.innerHTML = `
                <i class="fas fa-check-circle"></i> 
                <div>
                    <strong>आपका नामांकन फॉर्म सफलतापूर्वक जमा हो गया है!</strong><br>
                    हम जल्द ही आपसे संपर्क करेंगे।<br>
                    कृपया 3 कार्यदिवसों के भीतर आवश्यक दस्तावेजों के साथ स्कूल कार्यालय में संपर्क करें।
                </div>
            `;
            
            form.reset();
        } else {
            throw new Error('Form submission failed');
        }
    } catch (error) {
        console.error('Error:', error);
        statusMessage.className = 'status-message error';
        statusMessage.innerHTML = `
            <i class="fas fa-exclamation-circle"></i> 
            <div>
                <strong>फॉर्म जमा करने में त्रुटि!</strong><br>
                कृपया बाद में पुनः प्रयास करें या सीधे स्कूल कार्यालय में संपर्क करें।
            </div>
        `;
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'सबमिट करें';
        
        setTimeout(() => {
            statusMessage.className = 'status-message';
            statusMessage.innerHTML = '';
        }, 8000);
    }
}

// ===== Firebase Data Loading =====
async function loadNotifications() {
    if (!db) return;
    
    try {
        const querySnapshot = await db.collection("notifications").orderBy("date", "desc").limit(5).get();
        const notificationsList = document.getElementById("notifications-list");
        notificationsList.innerHTML = '';
        
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const notificationItem = document.createElement('div');
            notificationItem.className = 'notification-item';
            notificationItem.innerHTML = `
                <span class="notification-date">${formatDate(data.date)}</span>
                <h3>${data.title}</h3>
                <p>${data.message}</p>
            `;
            notificationsList.appendChild(notificationItem);
        });
    } catch (error) {
        console.log("Error getting notifications:", error);
    }
}

async function loadEvents() {
    if (!db) return;
    
    try {
        const today = new Date();
        const querySnapshot = await db.collection("events").where("date", ">=", today).orderBy("date").limit(5).get();
        const eventsList = document.getElementById("events-list");
        eventsList.innerHTML = '';
        
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const eventItem = document.createElement('div');
            eventItem.className = 'event-item';
            eventItem.innerHTML = `
                <span class="event-date">${formatDate(data.date)}</span>
                <h3>${data.title}</h3>
                <p>${data.description}</p>
            `;
            eventsList.appendChild(eventItem);
        });
    } catch (error) {
        console.log("Error getting events:", error);
    }
}

function formatDate(timestamp) {
    if (!timestamp) return '';
    const date = timestamp.toDate();
    return date.toLocaleDateString('hi-IN', { day: 'numeric', month: 'long', year: 'numeric' });
}

// ===== Notification Functions =====
async function requestNotificationPermission() {
    try {
        if (!messaging) {
            console.warn("Messaging not available");
            return;
        }
        
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
            console.log('Notification permission granted');
            await getFCMToken();
        }
    } catch (error) {
        console.error("Notification permission error:", error);
    }
}

async function getFCMToken() {
    try {
        const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
        const token = await messaging.getToken({
            vapidKey: "BC3NxWfvjJapAqcwviqhNdPqF2fZG07qE31hnCwxSCiqThvk1il0S48EcLth4gHJcJJHVJ25Hdbxm97k-V3X-UE",
            serviceWorkerRegistration: registration
        });
        
        console.log('FCM Token:', token);
        return token;
    } catch (error) {
        console.error("Error getting FCM token:", error);
        return null;
    }
}

// ===== Initialize App =====
document.addEventListener('DOMContentLoaded', function() {
    // Show home section by default
    showSection('home');
    
    // Initialize navigation
    initNavigation();
    
    // Load data from Firebase
    loadNotifications();
    loadEvents();
    
    // Initialize Firebase services
    if (messaging) {
        requestNotificationPermission();
    }
    
    // Setup form submission
    const enrollmentForm = document.getElementById('enrollmentForm');
    if (enrollmentForm) {
        enrollmentForm.addEventListener('submit', submitEnrollmentForm);
        
        // Setup class and stream change listeners
        document.getElementById('class').addEventListener('change', updateSubjectOptions);
        document.getElementById('stream').addEventListener('change', updateSubjectOptions);
    }
    
    // Close modal when clicking outside image
    document.getElementById('imageModal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeModal();
        }
    });
});