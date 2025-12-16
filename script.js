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

// Inisialisasi Smooth Scroll Polyfill
if ('scrollBehavior' in document.documentElement.style) {
    // Browser support native smooth scroll
} else {
    // Polyfill akan di-load dari CDN
}

// Inisialisasi
document.addEventListener('DOMContentLoaded', function() {
    // Setup loading screen
    setupLoadingScreen();
    
    // Setup event listeners
    setupEventListeners();
    
    // Setup background animation
    setupBackgroundAnimation();
    
    // Setup scroll animations
    setupScrollAnimations();
    
    // Load data dari database
    loadData();
});

// Setup loading screen dengan animasi baru
function setupLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    
    // Create floating data points
    createFloatingDataPoints();
    
    // Set timeout untuk menghilangkan loading screen setelah 3 detik
    setTimeout(() => {
        loadingScreen.classList.add('fade-out');
        
        // Hapus dari DOM setelah animasi selesai
        setTimeout(() => {
            loadingScreen.remove();
            document.getElementById('mainContent').style.opacity = '1';
            
            // Trigger animasi fade in untuk semua element
            triggerFadeInAnimations();
            
            // Setup card animations
            setupCardAnimations();
            
            // Setup tip animations
            setupTipAnimations();
        }, 800);
    }, 3000);
}

// Create floating data points for background
function createFloatingDataPoints() {
    const container = document.querySelector('.animated-background');
    
    for (let i = 0; i < 30; i++) {
        const point = document.createElement('div');
        point.className = 'floating-data-point';
        
        // Random positioning
        const size = Math.random() * 4 + 1;
        const duration = Math.random() * 20 + 10;
        const delay = Math.random() * 5;
        
        point.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            left: ${Math.random() * 100}%;
            animation-delay: ${delay}s;
            animation-duration: ${duration}s;
        `;
        
        container.appendChild(point);
    }
}

// Setup background animation effects
function setupBackgroundAnimation() {
    // Create additional floating elements
    const container = document.querySelector('.animated-background');
    
    // Create connection lines
    for (let i = 0; i < 5; i++) {
        const line = document.createElement('div');
        line.className = 'connection-line';
        
        line.style.cssText = `
            position: absolute;
            width: ${Math.random() * 100 + 50}px;
            height: 1px;
            background: linear-gradient(90deg, 
                transparent 0%, 
                rgba(138, 43, 226, 0.3) 50%, 
                transparent 100%);
            top: ${Math.random() * 100}%;
            left: ${Math.random() * 100}%;
            transform: rotate(${Math.random() * 360}deg);
            animation: linePulse ${Math.random() * 10 + 5}s ease-in-out infinite;
            opacity: ${Math.random() * 0.3 + 0.1};
        `;
        
        container.appendChild(line);
    }
    
    // Add CSS for line animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes linePulse {
            0%, 100% { opacity: 0.1; }
            50% { opacity: 0.3; }
        }
    `;
    document.head.appendChild(style);
}

// Setup semua event listeners
function setupEventListeners() {
    // Button mulai dengan smooth scroll
    const startBtn = document.getElementById('startBtn');
    startBtn.addEventListener('click', () => {
        const statsSection = document.getElementById('statsSection');
        smoothScrollTo(statsSection, 1000);
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
        closeComboModal();
    });
    
    copyComboBtn.addEventListener('click', copyComboToClipboard);
    applyComboBtn.addEventListener('click', applyBestCombo);
    
    // Close modal ketika klik di luar
    document.getElementById('comboModal').addEventListener('click', (e) => {
        if (e.target === document.getElementById('comboModal')) {
            closeComboModal();
        }
    });
    
    // Close modal dengan Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeComboModal();
        }
    });
    
    // Mencegah zoom dengan keyboard
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && (e.key === '+' || e.key === '-' || e.key === '0')) {
            e.preventDefault();
        }
    });
    
    // Mencegah zoom dengan wheel
    document.addEventListener('wheel', (e) => {
        if (e.ctrlKey) {
            e.preventDefault();
        }
    }, { passive: false });
}

// Smooth scroll function dengan easing
function smoothScrollTo(element, duration) {
    const start = window.pageYOffset;
    const to = element.offsetTop - 100;
    const change = to - start;
    const startTime = performance.now();
    
    function animateScroll(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Cubic ease-in-out
        const easeInOutCubic = progress < 0.5 
            ? 4 * progress * progress * progress 
            : 1 - Math.pow(-2 * progress + 2, 3) / 2;
        
        window.scrollTo(0, start + change * easeInOutCubic);
        
        if (progress < 1) {
            requestAnimationFrame(animateScroll);
        }
    }
    
    requestAnimationFrame(animateScroll);
}

// Setup scroll animations
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Animate stats cards
                if (entry.target.classList.contains('stat-card')) {
                    setTimeout(() => {
                        entry.target.style.transform = 'translateY(0) scale(1)';
                        entry.target.style.opacity = '1';
                    }, entry.target.dataset.delay || 0);
                }
                
                // Animate tip cards
                if (entry.target.classList.contains('tip-card')) {
                    setTimeout(() => {
                        entry.target.style.transform = 'translateX(0)';
                        entry.target.style.opacity = '1';
                    }, entry.target.dataset.delay || 0);
                }
            }
        });
    }, observerOptions);
    
    // Observe semua element dengan class fade-in
    document.querySelectorAll('.fade-in').forEach((el, index) => {
        if (el.classList.contains('stat-card')) {
            el.style.setProperty('--card-index', index);
            el.dataset.delay = index * 100;
        }
        if (el.classList.contains('tip-card')) {
            el.style.setProperty('--tip-index', index);
            el.dataset.delay = index * 100;
        }
        observer.observe(el);
    });
}

// Setup card animations
function setupCardAnimations() {
    const cards = document.querySelectorAll('.stat-card');
    cards.forEach((card, index) => {
        // Add hover effect with animation
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px) scale(1.02)';
            card.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
        
        // Add click animation
        card.addEventListener('click', () => {
            card.style.transform = 'scale(0.95)';
            setTimeout(() => {
                card.style.transform = 'scale(1)';
            }, 150);
        });
    });
}

// Setup tip animations
function setupTipAnimations() {
    const tips = document.querySelectorAll('.tip-card');
    tips.forEach((tip, index) => {
        // Add hover effect
        tip.addEventListener('mouseenter', () => {
            tip.style.transform = 'translateY(-5px) rotateX(5deg)';
            const icon = tip.querySelector('.tip-icon i');
            if (icon) {
                icon.style.transform = 'scale(1.2) rotate(10deg)';
                icon.style.transition = 'all 0.3s ease';
            }
        });
        
        tip.addEventListener('mouseleave', () => {
            tip.style.transform = 'translateY(0) rotateX(0)';
            const icon = tip.querySelector('.tip-icon i');
            if (icon) {
                icon.style.transform = 'scale(1) rotate(0)';
            }
        });
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
        
        // Animasikan angka dengan efek yang lebih smooth
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

// Animasikan angka dari 0 ke nilai target dengan easing
function animateNumbers() {
    const totalSuccess = document.getElementById('totalSuccess');
    const serverCount = document.getElementById('serverCount');
    const androidCount = document.getElementById('androidCount');
    
    animateValue(totalSuccess, 0, appData.totalReedem, 1500, 'easeOutCubic');
    animateValue(serverCount, 0, appData.TopServer[Object.keys(appData.TopServer)[0]] || 0, 1500, 'easeOutCubic');
    animateValue(androidCount, 0, appData.TopAndroid[Object.keys(appData.TopAndroid)[0]] || 0, 1500, 'easeOutCubic');
}

// Fungsi animasi angka dengan easing
function animateValue(element, start, end, duration, easing = 'linear') {
    if (start === end) return;
    
    const startTime = performance.now();
    const range = end - start;
    
    function easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    }
    
    function easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }
    
    function getEasingValue(t) {
        switch(easing) {
            case 'easeOutCubic': return easeOutCubic(t);
            case 'easeInOutCubic': return easeInOutCubic(t);
            default: return t;
        }
    }
    
    function animate(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = getEasingValue(progress);
        const current = Math.floor(start + range * easedProgress);
        
        element.textContent = current;
        
        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            element.textContent = end;
        }
    }
    
    requestAnimationFrame(animate);
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
    
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
    
    // Add animation to modal content
    const modalContent = modal.querySelector('.modal-content');
    modalContent.style.transform = 'translateY(30px) scale(0.9)';
    modalContent.style.opacity = '0';
    
    setTimeout(() => {
        modalContent.style.transform = 'translateY(0) scale(1)';
        modalContent.style.opacity = '1';
        modalContent.style.transition = 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    }, 10);
}

// Close combo modal dengan animasi
function closeComboModal() {
    const modal = document.getElementById('comboModal');
    const modalContent = modal.querySelector('.modal-content');
    
    modalContent.style.transform = 'translateY(0) scale(1)';
    modalContent.style.opacity = '1';
    
    setTimeout(() => {
        modalContent.style.transform = 'translateY(30px) scale(0.9)';
        modalContent.style.opacity = '0';
        
        setTimeout(() => {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }, 300);
    }, 10);
}

// Copy combo to clipboard
function copyComboToClipboard() {
    const comboName = Object.keys(appData.BestCombo)[0];
    
    if (comboName) {
        const [server, android] = comboName.split('|');
        const comboText = `Server: ${server} | Android: ${android}`;
        
        navigator.clipboard.writeText(comboText).then(() => {
            showToast('Combo berhasil disalin!', 'success');
            
            // Add animation to copy button
            const copyBtn = document.getElementById('copyComboBtn');
            copyBtn.innerHTML = '<i class="fas fa-check"></i> Disalin!';
            copyBtn.style.background = 'linear-gradient(45deg, #00FF7F, #00CC66)';
            
            setTimeout(() => {
                copyBtn.innerHTML = '<i class="fas fa-copy"></i> Copy Combo';
                copyBtn.style.background = '';
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy: ', err);
            showToast('Gagal menyalin combo', 'error');
        });
    }
}

// Apply best combo
function applyBestCombo() {
    showToast('Menerapkan combo terbaik...', 'info');
    
    // Add loading animation to apply button
    const applyBtn = document.getElementById('applyComboBtn');
    const originalText = applyBtn.innerHTML;
    applyBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Memproses...';
    applyBtn.disabled = true;
    
    // Simulasi proses apply combo
    setTimeout(() => {
        // Tambah data reedem baru
        simulateNewReedem();
        
        showToast('Combo berhasil diterapkan!', 'success');
        
        // Restore button state
        applyBtn.innerHTML = originalText;
        applyBtn.disabled = false;
        
        closeComboModal();
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
        updateUIWithAnimation();
        updateHistoryTable();
        
        // Simpan ke database
        saveToDatabase();
    }
}

// Update UI dengan animasi
function updateUIWithAnimation() {
    // Animate the updated numbers
    animateNumbers();
    
    // Add pulse animation to updated cards
    const cards = document.querySelectorAll('.stat-card');
    cards.forEach(card => {
        card.classList.add('pulse');
        setTimeout(() => {
            card.classList.remove('pulse');
        }, 1000);
    });
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
    
    // Animate in
    setTimeout(() => {
        toast.style.transform = 'translateX(0)';
        toast.style.opacity = '1';
    }, 10);
    
    // Auto hide setelah 3 detik
    setTimeout(() => {
        toast.style.transform = 'translateX(150%)';
        toast.style.opacity = '0';
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 500);
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

// Add CSS animations for pulse effect
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0% { 
            box-shadow: 
                0 15px 30px rgba(0, 0, 0, 0.3),
                inset 0 1px 0 rgba(255, 255, 255, 0.1);
        }
        50% { 
            box-shadow: 
                0 15px 30px rgba(0, 0, 0, 0.3),
                0 0 30px rgba(138, 43, 226, 0.5),
                inset 0 1px 0 rgba(255, 255, 255, 0.1);
        }
        100% { 
            box-shadow: 
                0 15px 30px rgba(0, 0, 0, 0.3),
                inset 0 1px 0 rgba(255, 255, 255, 0.1);
        }
    }
    
    .stat-card.pulse {
        animation: pulse 1s ease-in-out;
    }
    
    .animate-in {
        animation: fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    }
`;
document.head.appendChild(style);