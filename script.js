// Konfigurasi API
const API_CONFIG = {
    BIN_ID: '6940ef47ae596e708f9d2bb1',
    API_KEY: '$2a$10$cZQwFNLXAb1VEjuYEGqgLO4f7i08ro3s4VGw7SJS2jUEsrXGv3VZy',
    BASE_URL: 'https://api.jsonbin.io/v3/b'
};

// State aplikasi
let appData = {
    totalReedem: 0,
    totalPercobaan: 0,
    topAndroid: {},
    topServer: {},
    bestCombo: {},
    reedemHistory: []
};

// Inisialisasi
document.addEventListener('DOMContentLoaded', function() {
    // Setup loading screen
    setupLoadingScreen();
    
    // Setup event listeners
    setupEventListeners();
    
    // Setup animations
    setupAnimations();
    
    // Load data dari database
    loadData();
});

// Setup loading screen dengan animasi
function setupLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    const progressBar = document.querySelector('.progress-bar');
    
    // Animate progress bar
    progressBar.style.width = '100%';
    
    // Set timeout untuk menghilangkan loading screen setelah 3 detik
    setTimeout(() => {
        loadingScreen.classList.add('fade-out');
        
        // Hapus dari DOM setelah animasi selesai
        setTimeout(() => {
            loadingScreen.remove();
            document.getElementById('mainContent').style.opacity = '1';
            
            // Trigger animasi fade in untuk semua element
            triggerFadeInAnimations();
            
            // Setup smooth scroll
            setupSmoothScroll();
        }, 800);
    }, 3000);
}

// Setup semua event listeners
function setupEventListeners() {
    // Button mulai
    const startBtn = document.getElementById('startBtn');
    startBtn.addEventListener('click', () => {
        smoothScrollTo('#statsSection', 1000);
    });
    
    // Button refresh
    const refreshBtn = document.getElementById('refreshBtn');
    refreshBtn.addEventListener('click', () => {
        refreshBtn.classList.add('spinning');
        loadData();
        
        setTimeout(() => {
            refreshBtn.classList.remove('spinning');
        }, 500);
    });
    
    // Button coba combo
    const tryComboBtn = document.getElementById('tryComboBtn');
    tryComboBtn.addEventListener('click', showComboModal);
    
    // Modal buttons
    const closeModalBtn = document.getElementById('closeModal');
    const copyComboBtn = document.getElementById('copyComboBtn');
    const applyComboBtn = document.getElementById('applyComboBtn');
    
    closeModalBtn.addEventListener('click', () => {
        document.getElementById('comboModal').classList.remove('active');
    });
    
    copyComboBtn.addEventListener('click', copyComboToClipboard);
    applyComboBtn.addEventListener('click', applyBestCombo);
    
    // Close modal ketika klik di luar atau tekan ESC
    document.getElementById('comboModal').addEventListener('click', (e) => {
        if (e.target === document.getElementById('comboModal')) {
            document.getElementById('comboModal').classList.remove('active');
        }
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.getElementById('comboModal').classList.remove('active');
        }
    });
}

// Setup animations untuk element
function setupAnimations() {
    // Add animation delays to cards
    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach((card, index) => {
        card.style.setProperty('--card-index', index);
        card.style.animationDelay = `${0.1 * index}s`;
    });
    
    // Add animation delays to tip cards
    const tipCards = document.querySelectorAll('.tip-card');
    tipCards.forEach((card, index) => {
        card.style.setProperty('--tip-index', index);
    });
    
    // Add animation delays to combo items
    const comboItems = document.querySelectorAll('.combo-item');
    comboItems.forEach((item, index) => {
        item.style.setProperty('--item-index', index);
    });
    
    // Add animation delays to footer sections
    const footerSections = document.querySelectorAll('.footer-section');
    footerSections.forEach((section, index) => {
        section.style.setProperty('--section-index', index);
    });
}

// Setup smooth scroll dengan easing
function setupSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            smoothScrollTo(targetId, 1000);
        });
    });
}

// Smooth scroll function dengan easing
function smoothScrollTo(target, duration) {
    const targetElement = document.querySelector(target);
    if (!targetElement) return;
    
    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;
    
    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const run = easeInOutCubic(timeElapsed, startPosition, distance, duration);
        window.scrollTo(0, run);
        if (timeElapsed < duration) requestAnimationFrame(animation);
    }
    
    function easeInOutCubic(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t * t + b;
        t -= 2;
        return c / 2 * (t * t * t + 2) + b;
    }
    
    requestAnimationFrame(animation);
}

// Load data dari database JSONBin.io
async function loadData() {
    try {
        showToast('Memuat data terbaru...', 'info');
        
        const response = await fetch(
            `${API_CONFIG.BASE_URL}/${API_CONFIG.BIN_ID}/latest`,
            {
                headers: {
                    'X-Master-Key': API_CONFIG.API_KEY,
                    'Content-Type': 'application/json'
                }
            }
        );
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        appData = result.record;
        
        // Update UI dengan data baru
        updateUI();
        
        // Animasikan angka
        animateNumbers();
        
        // Update history table
        updateHistoryTable();
        
        showToast('Data berhasil diupdate!', 'success');
        
    } catch (error) {
        console.error('Error loading data:', error);
        showToast('Gagal memuat data. Menggunakan data fallback.', 'error');
        
        // Fallback data jika API gagal
        loadFallbackData();
    }
}

// Update UI dengan data terbaru
function updateUI() {
    // Update total success dengan animasi
    const totalSuccess = document.getElementById('totalSuccess');
    const successRate = document.getElementById('successRate');
    
    const rate = appData.totalPercobaan > 0 
        ? Math.round((appData.totalReedem / appData.totalPercobaan) * 100)
        : 0;
    
    successRate.textContent = `${rate}%`;
    
    // Animate success rate
    animateNumber(successRate, 0, rate, 1000);
    
    // Update top server
    const topServer = document.getElementById('topServer');
    const serverCount = document.getElementById('serverCount');
    
    const serverName = Object.keys(appData.TopServer)[0] || 'Tidak tersedia';
    const serverValue = appData.TopServer[serverName] || 0;
    
    topServer.textContent = serverName;
    serverCount.textContent = serverValue;
    
    // Update top android
    const topAndroid = document.getElementById('topAndroid');
    const androidCount = document.getElementById('androidCount');
    
    const androidName = Object.keys(appData.TopAndroid)[0] || 'Tidak tersedia';
    const androidValue = appData.TopAndroid[androidName] || 0;
    
    topAndroid.textContent = androidName;
    androidCount.textContent = androidValue;
    
    // Update best combo
    const bestCombo = document.getElementById('bestCombo');
    const comboName = Object.keys(appData.BestCombo)[0] || 'Tidak tersedia';
    bestCombo.textContent = comboName.replace('|', ' + ');
    
    // Update modal details
    updateModalDetails();
}

// Animasikan angka dari 0 ke nilai target dengan easing
function animateNumbers() {
    const totalSuccess = document.getElementById('totalSuccess');
    const serverCount = document.getElementById('serverCount');
    const androidCount = document.getElementById('androidCount');
    
    animateNumber(totalSuccess, 0, appData.totalReedem, 1500);
    animateNumber(serverCount, 0, appData.TopServer[Object.keys(appData.TopServer)[0]] || 0, 1500);
    animateNumber(androidCount, 0, appData.TopAndroid[Object.keys(appData.TopAndroid)[0]] || 0, 1500);
}

// Fungsi animasi angka dengan easing
function animateNumber(element, start, end, duration) {
    if (start === end) return;
    
    const range = end - start;
    let startTime = null;
    
    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);
        
        // Easing function
        const easeProgress = easeOutCubic(progress);
        const current = Math.floor(start + (range * easeProgress));
        
        element.textContent = current;
        
        if (progress < 1) {
            requestAnimationFrame(animation);
        } else {
            element.textContent = end;
        }
    }
    
    function easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    }
    
    requestAnimationFrame(animation);
}

// Update history table
function updateHistoryTable() {
    const historyTable = document.getElementById('historyTable');
    historyTable.innerHTML = '';
    
    // Ambil 5 data terbaru
    const recentHistory = appData.reedemHistory.slice(-5).reverse();
    
    recentHistory.forEach((record, index) => {
        const row = document.createElement('tr');
        row.className = 'fade-in';
        row.style.animationDelay = `${index * 0.1}s`;
        
        // Format timestamp
        const date = new Date(record.timestamp);
        const formattedTime = date.toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
        
        row.innerHTML = `
            <td><span class="server-badge">${record.server}</span></td>
            <td>${record.androidVersion}</td>
            <td><span class="attempts-badge">${record.attempts}</span></td>
            <td>${formattedTime}</td>
            <td><span class="device-id">${record.deviceId.substring(0, 10)}...</span></td>
        `;
        
        historyTable.appendChild(row);
    });
}

// Update modal details
function updateModalDetails() {
    const comboName = Object.keys(appData.BestCombo)[0];
    
    if (comboName) {
        const [server, android] = comboName.split('|');
        const successCount = appData.BestCombo[comboName];
        
        document.getElementById('modalServer').textContent = server;
        document.getElementById('modalAndroid').textContent = android;
        document.getElementById('modalRate').textContent = 
            `Success: ${successCount} kali`;
    }
}

// Show combo modal dengan animasi
function showComboModal() {
    updateModalDetails();
    const modal = document.getElementById('comboModal');
    modal.classList.add('active');
    
    // Animate modal content
    const modalContent = modal.querySelector('.modal-content');
    modalContent.style.animation = 'modalSlideIn 0.4s ease-out';
    
    setTimeout(() => {
        modalContent.style.animation = '';
    }, 400);
}

// Copy combo to clipboard
function copyComboToClipboard() {
    const comboName = Object.keys(appData.BestCombo)[0];
    
    if (comboName) {
        const [server, android] = comboName.split('|');
        const comboText = `Server: ${server} | Android: ${android}`;
        
        navigator.clipboard.writeText(comboText).then(() => {
            showToast('Combo berhasil disalin!', 'success');
        }).catch(err => {
            console.error('Failed to copy: ', err);
            showToast('Gagal menyalin combo', 'error');
        });
    }
}

// Apply best combo
function applyBestCombo() {
    showToast('Menerapkan combo terbaik...', 'info');
    
    // Animate apply button
    const applyBtn = document.getElementById('applyComboBtn');
    applyBtn.classList.add('applying');
    
    // Simulasi proses apply combo
    setTimeout(() => {
        // Tambah data reedem baru
        simulateNewReedem();
        
        showToast('Combo berhasil diterapkan!', 'success');
        document.getElementById('comboModal').classList.remove('active');
        applyBtn.classList.remove('applying');
    }, 1500);
}

// Simulasi reedem baru (untuk demo)
function simulateNewReedem() {
    const comboName = Object.keys(appData.BestCombo)[0];
    
    if (comboName) {
        const [server, android] = comboName.split('|');
        
        // Update data lokal
        appData.totalReedem++;
        appData.totalPercobaan++;
        
        // Update history
        const newRecord = {
            server: server,
            androidVersion: android,
            attempts: 1,
            timestamp: new Date().toISOString(),
            deviceId: `device_${Math.random().toString(36).substr(2, 9)}`
        };
        
        appData.reedemHistory.push(newRecord);
        
        // Update server count
        if (appData.TopServer[server]) {
            appData.TopServer[server]++;
        }
        
        // Update android count
        if (appData.TopAndroid[android]) {
            appData.TopAndroid[android]++;
        }
        
        // Update combo count
        appData.BestCombo[comboName]++;
        
        // Update UI dengan animasi
        updateUI();
        updateHistoryTable();
        
        // Animate updated elements
        animateUpdatedElements();
        
        // Simpan ke database
        saveToDatabase();
    }
}

// Animate elements that were updated
function animateUpdatedElements() {
    // Animate success card
    const successCard = document.querySelector('.stat-icon.success').closest('.stat-card');
    successCard.style.animation = 'cardPulse 0.5s ease-out';
    
    setTimeout(() => {
        successCard.style.animation = '';
    }, 500);
}

// Simpan data ke database (simulasi POST)
async function saveToDatabase() {
    try {
        const response = await fetch(
            `${API_CONFIG.BASE_URL}/${API_CONFIG.BIN_ID}`,
            {
                method: 'PUT',
                headers: {
                    'X-Master-Key': API_CONFIG.API_KEY,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(appData)
            }
        );
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        console.log('Data saved to database');
        
    } catch (error) {
        console.error('Error saving data:', error);
        showToast('Gagal menyimpan ke database', 'error');
    }
}

// Fallback data jika API gagal
function loadFallbackData() {
    appData = {
        totalReedem: 156,
        totalPercobaan: 200,
        TopAndroid: {
            "Android 12.0": 120
        },
        TopServer: {
            "Singapore": 145
        },
        BestCombo: {
            "Singapore|Android 12.0": 85
        },
        reedemHistory: [
            {
                "server": "Singapore",
                "androidVersion": "Android 12.0",
                "attempts": 1,
                "timestamp": new Date().toISOString(),
                "deviceId": "device_demo_001"
            }
        ]
    };
    
    updateUI();
    animateNumbers();
    updateHistoryTable();
}

// Show toast notification dengan animasi
function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    const toastIcon = toast.querySelector('.toast-icon');
    const toastMessage = toast.querySelector('.toast-message');
    
    // Remove existing classes
    toast.classList.remove('error', 'info', 'success');
    
    // Set warna berdasarkan type
    switch(type) {
        case 'success':
            toast.style.background = 'linear-gradient(45deg, var(--success), #00CC66)';
            toastIcon.className = 'fas fa-check-circle toast-icon';
            toast.classList.add('success');
            break;
        case 'error':
            toast.style.background = 'linear-gradient(45deg, var(--danger), #CC0000)';
            toastIcon.className = 'fas fa-exclamation-circle toast-icon';
            toast.classList.add('error');
            break;
        case 'info':
            toast.style.background = 'linear-gradient(45deg, var(--info), #0080FF)';
            toastIcon.className = 'fas fa-info-circle toast-icon';
            toast.classList.add('info');
            break;
    }
    
    toastMessage.textContent = message;
    toast.classList.add('show');
    
    // Auto hide setelah 3 detik
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Trigger fade in animations untuk semua element
function triggerFadeInAnimations() {
    const elements = document.querySelectorAll('.fade-in');
    
    elements.forEach((element, index) => {
        setTimeout(() => {
            element.style.animationDelay = `${index * 0.1}s`;
        }, 100);
    });
}

// Background animation effect
function createBackgroundEffects() {
    const container = document.querySelector('.container');
    
    // Create floating particles
    for (let i = 0; i < 15; i++) {
        const particle = document.createElement('div');
        particle.className = 'floating-particle';
        
        // Random position and size
        const size = Math.random() * 3 + 1;
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        const duration = Math.random() * 15 + 10;
        const delay = Math.random() * 5;
        
        particle.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            background: rgba(138, 43, 226, ${Math.random() * 0.2 + 0.1});
            border-radius: 50%;
            position: fixed;
            top: ${posY}%;
            left: ${posX}%;
            z-index: -1;
            animation: floatParticle ${duration}s linear ${delay}s infinite;
        `;
        
        // Add custom animation for this particle
        const keyframes = `
            @keyframes floatParticle_${i} {
                0% {
                    transform: translate(0, 0) rotate(0deg);
                    opacity: 0;
                }
                10% {
                    opacity: ${Math.random() * 0.5 + 0.3};
                }
                90% {
                    opacity: ${Math.random() * 0.5 + 0.3};
                }
                100% {
                    transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px) rotate(${Math.random() * 360}deg);
                    opacity: 0;
                }
            }
        `;
        
        const style = document.createElement('style');
        style.textContent = keyframes;
        document.head.appendChild(style);
        
        particle.style.animationName = `floatParticle_${i}`;
        container.appendChild(particle);
    }
}

// Inisialisasi background effects setelah loading
setTimeout(createBackgroundEffects, 3500);

// Prevent zoom on mobile
document.addEventListener('touchmove', function(e) {
    if (e.scale !== 1) {
        e.preventDefault();
    }
}, { passive: false });

// Add CSS animation for modal slide in
const modalAnimation = `
    @keyframes modalSlideIn {
        from {
            opacity: 0;
            transform: translateY(-30px) scale(0.95);
        }
        to {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
    }
    
    @keyframes cardPulse {
        0% {
            transform: scale(1);
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
        }
        50% {
            transform: scale(1.02);
            box-shadow: 0 15px 30px rgba(0, 0, 0, 0.4);
        }
        100% {
            transform: scale(1);
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
        }
    }
    
    .applying {
        animation: applyingAnimation 1.5s ease-in-out;
    }
    
    @keyframes applyingAnimation {
        0%, 100% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.05);
        }
    }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = modalAnimation;
document.head.appendChild(styleSheet);