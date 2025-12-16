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
    
    // Load data dari database
    loadData();
});

// Setup loading screen
function setupLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    
    // Set timeout untuk menghilangkan loading screen setelah 3 detik
    setTimeout(() => {
        loadingScreen.classList.add('fade-out');
        
        // Hapus dari DOM setelah animasi selesai
        setTimeout(() => {
            loadingScreen.remove();
            document.getElementById('mainContent').style.opacity = '1';
            
            // Trigger animasi fade in untuk semua element
            triggerFadeInAnimations();
        }, 800);
    }, 3000);
}

// Setup semua event listeners
function setupEventListeners() {
    // Button mulai
    const startBtn = document.getElementById('startBtn');
    startBtn.addEventListener('click', () => {
        document.getElementById('statsSection').scrollIntoView({ 
            behavior: 'smooth' 
        });
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
    
    // Close modal ketika klik di luar
    document.getElementById('comboModal').addEventListener('click', (e) => {
        if (e.target === document.getElementById('comboModal')) {
            document.getElementById('comboModal').classList.remove('active');
        }
    });
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

// Animasikan angka dari 0 ke nilai target
function animateNumbers() {
    const totalSuccess = document.getElementById('totalSuccess');
    const serverCount = document.getElementById('serverCount');
    const androidCount = document.getElementById('androidCount');
    
    animateValue(totalSuccess, 0, appData.totalReedem, 1500);
    animateValue(serverCount, 0, appData.TopServer[Object.keys(appData.TopServer)[0]] || 0, 1500);
    animateValue(androidCount, 0, appData.TopAndroid[Object.keys(appData.TopAndroid)[0]] || 0, 1500);
}

// Fungsi animasi angka
function animateValue(element, start, end, duration) {
    if (start === end) return;
    
    const range = end - start;
    const increment = end > start ? 1 : -1;
    const stepTime = Math.abs(Math.floor(duration / range));
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        element.textContent = current;
        
        if (current === end) {
            clearInterval(timer);
        }
    }, stepTime);
}

// Update history table
function updateHistoryTable() {
    const historyTable = document.getElementById('historyTable');
    historyTable.innerHTML = '';
    
    // Ambil 5 data terbaru
    const recentHistory = appData.reedemHistory.slice(-5).reverse();
    
    recentHistory.forEach(record => {
        const row = document.createElement('tr');
        row.className = 'fade-in';
        
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

// Show combo modal
function showComboModal() {
    updateModalDetails();
    document.getElementById('comboModal').classList.add('active');
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
    
    // Simulasi proses apply combo
    setTimeout(() => {
        // Tambah data reedem baru
        simulateNewReedem();
        
        showToast('Combo berhasil diterapkan!', 'success');
        document.getElementById('comboModal').classList.remove('active');
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
        
        // Update UI
        updateUI();
        updateHistoryTable();
        
        // Simpan ke database
        saveToDatabase();
    }
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

// Show toast notification
function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    const toastIcon = toast.querySelector('.toast-icon');
    const toastMessage = toast.querySelector('.toast-message');
    
    // Set warna berdasarkan type
    switch(type) {
        case 'success':
            toast.style.background = 'linear-gradient(45deg, #00FF7F, #00CC66)';
            toastIcon.className = 'fas fa-check-circle toast-icon';
            break;
        case 'error':
            toast.style.background = 'linear-gradient(45deg, #FF4444, #CC0000)';
            toastIcon.className = 'fas fa-exclamation-circle toast-icon';
            break;
        case 'info':
            toast.style.background = 'linear-gradient(45deg, #00BFFF, #0080FF)';
            toastIcon.className = 'fas fa-info-circle toast-icon';
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
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'floating-particle';
        particle.style.cssText = `
            position: absolute;
            width: ${Math.random() * 4 + 1}px;
            height: ${Math.random() * 4 + 1}px;
            background: rgba(138, 43, 226, ${Math.random() * 0.3 + 0.1});
            border-radius: 50%;
            top: ${Math.random() * 100}%;
            left: ${Math.random() * 100}%;
            z-index: -1;
            animation: floatParticle ${Math.random() * 20 + 10}s linear infinite;
        `;
        
        container.appendChild(particle);
    }
    
    // Add CSS for particle animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes floatParticle {
            0% {
                transform: translate(0, 0) rotate(0deg);
                opacity: 0;
            }
            10% {
                opacity: 1;
            }
            90% {
                opacity: 1;
            }
            100% {
                transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px) rotate(360deg);
                opacity: 0;
            }
        }
    `;
    
    document.head.appendChild(style);
}

// Inisialisasi background effects setelah loading
setTimeout(createBackgroundEffects, 3500);