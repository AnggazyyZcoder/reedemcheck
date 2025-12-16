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
    
    // Setup scroll animations
    setupScrollAnimations();
    
    // Load data dari database
    loadData();
    
    // Setup smooth scroll untuk semua anchor links
    setupSmoothScroll();
});

// Setup loading screen
function setupLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    const progressBar = document.querySelector('.progress-bar');
    
    // Animate progress bar
    progressBar.style.animation = 'loading 3s cubic-bezier(0.65, 0, 0.35, 1) forwards';
    
    // Set timeout untuk menghilangkan loading screen setelah 3 detik
    setTimeout(() => {
        loadingScreen.classList.add('fade-out');
        
        // Hapus dari DOM setelah animasi selesai
        setTimeout(() => {
            loadingScreen.remove();
            document.getElementById('mainContent').style.opacity = '1';
            
            // Trigger animasi fade in untuk semua element
            triggerScrollAnimations();
        }, 800);
    }, 3000);
}

// Setup semua event listeners
function setupEventListeners() {
    // Button mulai
    const startBtn = document.getElementById('startBtn');
    startBtn.addEventListener('click', () => {
        document.getElementById('statsSection').scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
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
    document.querySelector('.modal-overlay').addEventListener('click', () => {
        document.getElementById('comboModal').classList.remove('active');
    });
    
    // Close modal dengan Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.getElementById('comboModal').classList.remove('active');
        }
    });
}

// Setup scroll animations
function setupScrollAnimations() {
    // Inisialisasi Intersection Observer untuk animasi scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Observe semua element yang perlu di-animate
    document.querySelectorAll('.stat-card, .tips-section, .history-section, .footer, .tip-card').forEach(el => {
        observer.observe(el);
    });
}

// Setup smooth scroll untuk semua anchor links
function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Trigger scroll animations on load
function triggerScrollAnimations() {
    // Force trigger animations for elements in viewport
    const elements = document.querySelectorAll('.stat-card, .tips-section, .history-section, .footer, .tip-card');
    elements.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            el.classList.add('visible');
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
        element.textContent = current.toLocaleString();
        
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

// Show combo modal
function showComboModal() {
    updateModalDetails();
    document.getElementById('comboModal').classList.add('active');
    
    // Tambah efek masuk untuk modal content
    const modalContent = document.querySelector('.modal-content');
    modalContent.style.animation = 'none';
    setTimeout(() => {
        modalContent.style.animation = '';
    }, 10);
}

// Copy combo to clipboard
function copyComboToClipboard() {
    const comboName = Object.keys(appData.BestCombo)[0];
    
    if (comboName) {
        const [server, android] = comboName.split('|');
        const comboText = `Server: ${server} | Android Version: ${android}`;
        
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
    
    // Animasi button
    const applyBtn = document.getElementById('applyComboBtn');
    applyBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Menerapkan...';
    applyBtn.disabled = true;
    
    // Simulasi proses apply combo
    setTimeout(() => {
        // Tambah data reedem baru
        simulateNewReedem();
        
        // Reset button
        applyBtn.innerHTML = '<i class="fas fa-check"></i> Terapkan Combo';
        applyBtn.disabled = false;
        
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
        } else {
            appData.TopServer[server] = 1;
        }
        
        // Update android count
        if (appData.TopAndroid[android]) {
            appData.TopAndroid[android]++;
        } else {
            appData.TopAndroid[android] = 1;
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
                "timestamp": new Date(Date.now() - 3600000).toISOString(),
                "deviceId": "device_demo_001"
            },
            {
                "server": "Japan",
                "androidVersion": "Android 13.0",
                "attempts": 2,
                "timestamp": new Date(Date.now() - 7200000).toISOString(),
                "deviceId": "device_demo_002"
            },
            {
                "server": "USA",
                "androidVersion": "Android 11.0",
                "attempts": 1,
                "timestamp": new Date(Date.now() - 10800000).toISOString(),
                "deviceId": "device_demo_003"
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
    
    // Remove previous classes
    toast.className = 'toast';
    
    // Set warna berdasarkan type
    switch(type) {
        case 'success':
            toast.classList.add('show');
            toastIcon.className = 'fas fa-check-circle toast-icon';
            break;
        case 'error':
            toast.classList.add('show', 'error');
            toastIcon.className = 'fas fa-exclamation-circle toast-icon';
            break;
        case 'info':
            toast.classList.add('show', 'info');
            toastIcon.className = 'fas fa-info-circle toast-icon';
            break;
    }
    
    toastMessage.textContent = message;
    
    // Auto hide setelah 3 detik
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Create floating particles
function createFloatingParticles() {
    const container = document.querySelector('.container');
    
    // Remove existing particles
    document.querySelectorAll('.floating-particle').forEach(p => p.remove());
    
    // Create new particles
    for (let i = 0; i < 15; i++) {
        const particle = document.createElement('div');
        particle.className = 'floating-particle';
        
        const size = Math.random() * 4 + 1;
        const duration = Math.random() * 20 + 10;
        const delay = Math.random() * 5;
        
        particle.style.cssText = `
            position: fixed;
            width: ${size}px;
            height: ${size}px;
            background: linear-gradient(45deg, var(--primary-purple), var(--accent-purple));
            border-radius: 50%;
            top: ${Math.random() * 100}vh;
            left: ${Math.random() * 100}vw;
            z-index: -1;
            opacity: ${Math.random() * 0.3 + 0.1};
            animation: floatParticle ${duration}s linear ${delay}s infinite;
        `;
        
        document.body.appendChild(particle);
    }
}

// Add CSS for particle animation
function addParticleAnimation() {
    if (!document.querySelector('#particle-animation')) {
        const style = document.createElement('style');
        style.id = 'particle-animation';
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
                    transform: translate(${Math.random() * 200 - 100}px, ${Math.random() * 200 - 100}px) rotate(360deg);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Inisialisasi background effects setelah loading
setTimeout(() => {
    createFloatingParticles();
    addParticleAnimation();
}, 3500);

// Refresh particles on window resize
window.addEventListener('resize', createFloatingParticles);