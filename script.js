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
    console.log('Website Anggazyy Market loaded');
    
    // Setup loading screen
    setupLoadingScreen();
    
    // Setup event listeners
    setupEventListeners();
    
    // Load data dari database
    loadData();
    
    // Enable scrolling
    enableScrolling();
});

// Enable scrolling function
function enableScrolling() {
    document.body.style.overflow = 'auto';
    document.body.style.height = 'auto';
    document.body.style.position = 'relative';
    
    console.log('Scrolling enabled');
}

// Setup loading screen
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
            
            // Enable scrolling after loading
            enableScrolling();
            
            console.log('Loading screen removed, scrolling should work now');
        }, 800);
    }, 3000);
}

// Setup semua event listeners
function setupEventListeners() {
    console.log('Setting up event listeners');
    
    // Button mulai
    const startBtn = document.getElementById('startBtn');
    if (startBtn) {
        startBtn.addEventListener('click', () => {
            console.log('Start button clicked');
            smoothScrollTo('#statsSection');
        });
    }
    
    // Button refresh
    const refreshBtn = document.getElementById('refreshBtn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', () => {
            console.log('Refresh button clicked');
            refreshBtn.classList.add('spinning');
            loadData();
            
            setTimeout(() => {
                refreshBtn.classList.remove('spinning');
            }, 500);
        });
    }
    
    // Button coba combo
    const tryComboBtn = document.getElementById('tryComboBtn');
    if (tryComboBtn) {
        tryComboBtn.addEventListener('click', showComboModal);
    }
    
    // Modal buttons
    const closeModalBtn = document.getElementById('closeModal');
    const copyComboBtn = document.getElementById('copyComboBtn');
    const applyComboBtn = document.getElementById('applyComboBtn');
    
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            document.getElementById('comboModal').classList.remove('active');
        });
    }
    
    if (copyComboBtn) {
        copyComboBtn.addEventListener('click', copyComboToClipboard);
    }
    
    if (applyComboBtn) {
        applyComboBtn.addEventListener('click', applyBestCombo);
    }
    
    // Close modal ketika klik di luar
    const modal = document.getElementById('comboModal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    }
    
    // Close modal dengan ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.getElementById('comboModal').classList.remove('active');
        }
    });
    
    // Test scrolling
    document.addEventListener('wheel', (e) => {
        console.log('Wheel event fired', e.deltaY);
    });
    
    document.addEventListener('touchmove', (e) => {
        console.log('Touch move event fired');
    }, { passive: true });
    
    // Test click events
    document.addEventListener('click', (e) => {
        console.log('Click event at:', e.target.tagName);
    });
}

// Smooth scroll function
function smoothScrollTo(targetSelector, duration = 800) {
    const targetElement = document.querySelector(targetSelector);
    if (!targetElement) {
        console.error('Target element not found:', targetSelector);
        return;
    }
    
    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;
    
    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);
        
        // Easing function
        const easeProgress = easeOutCubic(progress);
        const run = startPosition + distance * easeProgress;
        
        window.scrollTo(0, run);
        
        if (timeElapsed < duration) {
            requestAnimationFrame(animation);
        }
    }
    
    function easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    }
    
    requestAnimationFrame(animation);
    console.log('Smooth scrolling to:', targetSelector);
}

// Load data dari database JSONBin.io
async function loadData() {
    try {
        console.log('Loading data from API...');
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
        
        console.log('Data loaded successfully:', appData);
        
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
    console.log('Updating UI with new data');
    
    // Update total success
    const totalSuccess = document.getElementById('totalSuccess');
    const successRate = document.getElementById('successRate');
    
    const rate = appData.totalPercobaan > 0 
        ? Math.round((appData.totalReedem / appData.totalPercobaan) * 100)
        : 0;
    
    if (successRate) {
        successRate.textContent = `${rate}%`;
    }
    
    // Update top server
    const topServer = document.getElementById('topServer');
    const serverCount = document.getElementById('serverCount');
    
    const serverName = Object.keys(appData.TopServer)[0] || 'Tidak tersedia';
    const serverValue = appData.TopServer[serverName] || 0;
    
    if (topServer) {
        topServer.textContent = serverName;
    }
    
    if (serverCount) {
        serverCount.textContent = serverValue;
    }
    
    // Update top android
    const topAndroid = document.getElementById('topAndroid');
    const androidCount = document.getElementById('androidCount');
    
    const androidName = Object.keys(appData.TopAndroid)[0] || 'Tidak tersedia';
    const androidValue = appData.TopAndroid[androidName] || 0;
    
    if (topAndroid) {
        topAndroid.textContent = androidName;
    }
    
    if (androidCount) {
        androidCount.textContent = androidValue;
    }
    
    // Update best combo
    const bestCombo = document.getElementById('bestCombo');
    const comboName = Object.keys(appData.BestCombo)[0] || 'Tidak tersedia';
    
    if (bestCombo) {
        bestCombo.textContent = comboName.replace('|', ' + ');
    }
    
    // Update modal details
    updateModalDetails();
}

// Animasikan angka dari 0 ke nilai target
function animateNumbers() {
    console.log('Animating numbers');
    
    const totalSuccess = document.getElementById('totalSuccess');
    const serverCount = document.getElementById('serverCount');
    const androidCount = document.getElementById('androidCount');
    
    if (totalSuccess) {
        animateValue(totalSuccess, 0, appData.totalReedem, 1500);
    }
    
    if (serverCount) {
        animateValue(serverCount, 0, appData.TopServer[Object.keys(appData.TopServer)[0]] || 0, 1500);
    }
    
    if (androidCount) {
        animateValue(androidCount, 0, appData.TopAndroid[Object.keys(appData.TopAndroid)[0]] || 0, 1500);
    }
}

// Fungsi animasi angka
function animateValue(element, start, end, duration) {
    if (start === end || !element) return;
    
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
    if (!historyTable) return;
    
    historyTable.innerHTML = '';
    
    // Ambil 5 data terbaru
    const recentHistory = appData.reedemHistory ? appData.reedemHistory.slice(-5).reverse() : [];
    
    if (recentHistory.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td colspan="5" style="text-align: center; padding: 2rem;">
                <i class="fas fa-history"></i> Belum ada riwayat reedem
            </td>
        `;
        historyTable.appendChild(row);
        return;
    }
    
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
            <td><span class="server-badge">${record.server || '-'}</span></td>
            <td>${record.androidVersion || '-'}</td>
            <td><span class="attempts-badge">${record.attempts || '0'}</span></td>
            <td>${formattedTime}</td>
            <td><span class="device-id">${record.deviceId ? record.deviceId.substring(0, 10) + '...' : '-'}</span></td>
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
        
        const modalServer = document.getElementById('modalServer');
        const modalAndroid = document.getElementById('modalAndroid');
        const modalRate = document.getElementById('modalRate');
        
        if (modalServer) modalServer.textContent = server;
        if (modalAndroid) modalAndroid.textContent = android;
        if (modalRate) modalRate.textContent = `Success: ${successCount} kali`;
    }
}

// Show combo modal
function showComboModal() {
    console.log('Showing combo modal');
    updateModalDetails();
    
    const modal = document.getElementById('comboModal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
    }
}

// Hide combo modal
function hideComboModal() {
    const modal = document.getElementById('comboModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto'; // Re-enable scrolling
    }
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
        hideComboModal();
    }, 1500);
}

// Simulasi reedem baru (untuk demo)
function simulateNewReedem() {
    const comboName = Object.keys(appData.BestCombo)[0];
    
    if (comboName) {
        const [server, android] = comboName.split('|');
        
        // Update data lokal
        appData.totalReedem = (appData.totalReedem || 0) + 1;
        appData.totalPercobaan = (appData.totalPercobaan || 0) + 1;
        
        // Update history
        const newRecord = {
            server: server,
            androidVersion: android,
            attempts: 1,
            timestamp: new Date().toISOString(),
            deviceId: `device_${Math.random().toString(36).substr(2, 9)}`
        };
        
        if (!appData.reedemHistory) {
            appData.reedemHistory = [];
        }
        appData.reedemHistory.push(newRecord);
        
        // Update server count
        if (appData.TopServer && appData.TopServer[server]) {
            appData.TopServer[server]++;
        }
        
        // Update android count
        if (appData.TopAndroid && appData.TopAndroid[android]) {
            appData.TopAndroid[android]++;
        }
        
        // Update combo count
        if (appData.BestCombo && appData.BestCombo[comboName]) {
            appData.BestCombo[comboName]++;
        }
        
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
    console.log('Loading fallback data');
    
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
            },
            {
                "server": "Japan",
                "androidVersion": "Android 11.0",
                "attempts": 2,
                "timestamp": new Date(Date.now() - 3600000).toISOString(),
                "deviceId": "device_demo_002"
            },
            {
                "server": "USA",
                "androidVersion": "Android 13.0",
                "attempts": 1,
                "timestamp": new Date(Date.now() - 7200000).toISOString(),
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
    
    if (!toast || !toastIcon || !toastMessage) return;
    
    // Set warna berdasarkan type
    switch(type) {
        case 'success':
            toast.style.background = 'linear-gradient(45deg, var(--success), #00CC66)';
            toastIcon.className = 'fas fa-check-circle toast-icon';
            break;
        case 'error':
            toast.style.background = 'linear-gradient(45deg, var(--danger), #CC0000)';
            toastIcon.className = 'fas fa-exclamation-circle toast-icon';
            break;
        case 'info':
            toast.style.background = 'linear-gradient(45deg, var(--info), #0080FF)';
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

// Test function untuk debugging
function testScrolling() {
    console.log('Testing scrolling...');
    console.log('Body overflow:', document.body.style.overflow);
    console.log('Body height:', document.body.style.height);
    console.log('Body position:', document.body.style.position);
    console.log('Window scrollY:', window.scrollY);
    console.log('Document height:', document.documentElement.scrollHeight);
    console.log('Window height:', window.innerHeight);
}

// Panggil test function setelah loading
setTimeout(testScrolling, 3500);

// Event listener untuk debug
window.addEventListener('scroll', () => {
    console.log('Scrolling! Current scrollY:', window.scrollY);
});

// Prevent zoom but allow scrolling
document.addEventListener('touchmove', function(e) {
    // Allow normal scrolling
    if (e.scale !== 1) {
        e.preventDefault();
    }
}, { passive: false });

// Add keyboard shortcut for testing
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'd') {
        e.preventDefault();
        testScrolling();
    }
});

// Initialize some particles for background
function initParticles() {
    const container = document.querySelector('.container');
    if (!container) return;
    
    for (let i = 0; i < 10; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            position: fixed;
            width: ${Math.random() * 4 + 1}px;
            height: ${Math.random() * 4 + 1}px;
            background: rgba(138, 43, 226, ${Math.random() * 0.3 + 0.1});
            border-radius: 50%;
            top: ${Math.random() * 100}%;
            left: ${Math.random() * 100}%;
            z-index: 0;
            pointer-events: none;
        `;
        container.appendChild(particle);
    }
}

// Initialize particles after loading
setTimeout(initParticles, 4000);