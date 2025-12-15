// Konfigurasi JSONBin
const JSONBIN_ID = "693fbc76d0ea881f402a4544";
const API_KEY = "$2a$10$FrRFp7JmBmpnrWofdI2GyOHCeiMwzhvrVQ.Hh2H3FaBCiFlkxh4c6";
const API_URL = `https://api.jsonbin.io/v3/b/${JSONBIN_ID}/latest`;

// Data statistik
let redeemsData = [];
let stats = {
    totalSuccess: 0,
    topServer: "Thailand",
    topAndroid: "Android 10",
    bestCombo: "Thailand + Android 10"
};

// DOM Elements
const loadingScreen = document.getElementById('loadingScreen');
const mainContent = document.getElementById('mainContent');
const startBtn = document.getElementById('startBtn');
const navToggle = document.getElementById('navToggle');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const checkBtn = document.getElementById('checkBtn');
const redeemIdInput = document.getElementById('redeemId');
const loadingCheck = document.getElementById('loadingCheck');
const popupOverlay = document.getElementById('popupOverlay');
const popupContainer = document.getElementById('popupContainer');
const popupClose = document.getElementById('popupClose');
const popupContent = document.getElementById('popupContent');

// Fungsi untuk menampilkan loading screen selama 3 detik
function initLoadingScreen() {
    setTimeout(() => {
        loadingScreen.style.opacity = '0';
        loadingScreen.style.visibility = 'hidden';
        
        // Inisialisasi setelah loading screen selesai
        setTimeout(() => {
            initApp();
            setupEventListeners();
            loadDataFromJsonBin();
        }, 800);
    }, 3000);
}

// Inisialisasi aplikasi
function initApp() {
    // Animasi fade in untuk semua elemen dengan class fade-in
    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach(element => {
        element.classList.add('visible');
    });
    
    // Scroll ke section stats ketika tombol Mulai diklik
    startBtn.addEventListener('click', () => {
        document.getElementById('stats').scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    });
}

// Setup event listeners
function setupEventListeners() {
    // Toggle navbar mobile
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });
    
    // Close navbar ketika klik link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            
            // Update active class
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });
    
    // Check redeem button
    checkBtn.addEventListener('click', checkRedeemStatus);
    redeemIdInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            checkRedeemStatus();
        }
    });
    
    // Close popup
    popupClose.addEventListener('click', () => {
        popupOverlay.style.display = 'none';
        popupContainer.style.animation = 'popupSlide 0.4s ease';
    });
    
    // Close popup ketika klik di luar
    popupOverlay.addEventListener('click', (e) => {
        if (e.target === popupOverlay) {
            popupOverlay.style.display = 'none';
            popupContainer.style.animation = 'popupSlide 0.4s ease';
        }
    });
    
    // Intersection Observer untuk animasi scroll
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
    
    // Observe semua elemen dengan class fade-in
    document.querySelectorAll('.fade-in').forEach(element => {
        observer.observe(element);
    });
}

// Fetch data dari JSONBin
async function loadDataFromJsonBin() {
    try {
        const response = await fetch(API_URL, {
            headers: {
                'X-Master-Key': API_KEY,
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        redeemsData = data.record.redeems;
        
        // Hitung statistik dari data
        calculateStatistics();
        
        // Update UI dengan animasi hitung
        updateStatisticsUI();
        
        console.log('Data berhasil di-load dari JSONBin:', redeemsData);
        
    } catch (error) {
        console.error('Error loading data from JSONBin:', error);
        
        // Fallback ke data default jika fetch gagal
        redeemsData = [
            {
                "id": "REDXYZ123ABC",
                "key": "USER_KEY_HERE",
                "createdAt": "2024-01-01T12:00:00.000Z",
                "active": "Active",
                "status": false,
                "deviceId": "device_abc123xyz",
                "details": null
            },
            {
                "id": "REDXYZ456DEF",
                "key": "USER_KEY_HERE_2",
                "createdAt": "2024-01-01T13:00:00.000Z",
                "active": "Disable",
                "status": true,
                "deviceId": "device_def456ghi",
                "details": {
                    "server": "Thailand",
                    "android": "Android 10",
                    "time": "13:30:45",
                    "attempt": 5
                }
            }
        ];
        
        calculateStatistics();
        updateStatisticsUI();
    }
}

// Hitung statistik dari data redeems
function calculateStatistics() {
    if (!redeemsData || redeemsData.length === 0) return;
    
    // Hitung total success (status: true)
    stats.totalSuccess = redeemsData.filter(redeem => redeem.status === true).length;
    
    // Cari top server (dari yang memiliki details)
    const servers = redeemsData
        .filter(redeem => redeem.details && redeem.details.server)
        .map(redeem => redeem.details.server);
    
    if (servers.length > 0) {
        const serverCounts = servers.reduce((acc, server) => {
            acc[server] = (acc[server] || 0) + 1;
            return acc;
        }, {});
        
        stats.topServer = Object.keys(serverCounts).reduce((a, b) => 
            serverCounts[a] > serverCounts[b] ? a : b
        );
    }
    
    // Cari top Android version
    const androidVersions = redeemsData
        .filter(redeem => redeem.details && redeem.details.android)
        .map(redeem => redeem.details.android);
    
    if (androidVersions.length > 0) {
        const androidCounts = androidVersions.reduce((acc, version) => {
            acc[version] = (acc[version] || 0) + 1;
            return acc;
        }, {});
        
        stats.topAndroid = Object.keys(androidCounts).reduce((a, b) => 
            androidCounts[a] > androidCounts[b] ? a : b
        );
    }
    
    // Best combo (server + Android)
    const combos = redeemsData
        .filter(redeem => redeem.details && redeem.details.server && redeem.details.android)
        .map(redeem => `${redeem.details.server} + ${redeem.details.android}`);
    
    if (combos.length > 0) {
        const comboCounts = combos.reduce((acc, combo) => {
            acc[combo] = (acc[combo] || 0) + 1;
            return acc;
        }, {});
        
        stats.bestCombo = Object.keys(comboCounts).reduce((a, b) => 
            comboCounts[a] > comboCounts[b] ? a : b
        );
    }
}

// Update UI dengan animasi hitung
function updateStatisticsUI() {
    // Animate total success count
    animateCount('totalSuccess', 0, stats.totalSuccess, 1500);
    
    // Update other stats with animation
    setTimeout(() => {
        document.getElementById('topServer').textContent = stats.topServer;
        document.getElementById('topServer').classList.add('count-animate');
        
        setTimeout(() => {
            document.getElementById('topAndroid').textContent = stats.topAndroid;
            document.getElementById('topAndroid').classList.add('count-animate');
            
            setTimeout(() => {
                document.getElementById('bestCombo').textContent = stats.bestCombo;
                document.getElementById('bestCombo').classList.add('count-animate');
            }, 300);
        }, 300);
    }, 1600);
}

// Animasi hitung angka
function animateCount(elementId, start, end, duration) {
    const element = document.getElementById(elementId);
    let startTimestamp = null;
    
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const value = Math.floor(progress * (end - start) + start);
        
        element.textContent = value;
        element.classList.add('count-animate');
        
        if (progress < 1) {
            window.requestAnimationFrame(step);
        } else {
            // Reset animation class
            setTimeout(() => {
                element.classList.remove('count-animate');
            }, 500);
        }
    };
    
    window.requestAnimationFrame(step);
}

// Cek status redeem
async function checkRedeemStatus() {
    const redeemId = redeemIdInput.value.trim();
    
    if (!redeemId) {
        showNotification('Masukkan ID Reedem terlebih dahulu!', 'error');
        return;
    }
    
    // Show loading
    loadingCheck.classList.add('active');
    checkBtn.disabled = true;
    
    // Simulate API delay
    setTimeout(() => {
        // Cari redeem di data
        const foundRedeem = redeemsData.find(redeem => redeem.id === redeemId);
        
        // Hide loading
        loadingCheck.classList.remove('active');
        checkBtn.disabled = false;
        
        if (foundRedeem) {
            showRedeemDetails(foundRedeem);
            showNotification('ID Reedem ditemukan!', 'success');
        } else {
            showNotification('ID Reedem tidak ditemukan!', 'error');
        }
    }, 3000);
}

// Tampilkan detail redeem di popup
function showRedeemDetails(redeem) {
    // Format tanggal
    const date = new Date(redeem.createdAt);
    const formattedDate = date.toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    const formattedTime = date.toLocaleTimeString('id-ID');
    
    // Status aktif
    const isActive = redeem.active === "Active";
    const isRedeemed = redeem.status === true;
    
    // Build popup content
    popupContent.innerHTML = `
        <div class="popup-detail">
            <div class="detail-header">
                <h4 class="detail-title">ID: ${redeem.id}</h4>
                <span class="detail-status ${isActive ? 'active' : 'disabled'}">
                    ${isActive ? 'Active' : 'Disabled'}
                </span>
            </div>
            <div class="detail-info">
                <div class="detail-item">
                    <span class="detail-label">Status Reedem:</span>
                    <span class="detail-value ${isRedeemed ? 'success' : 'failed'}">
                        ${isRedeemed ? '✓ REEDEM' : '✗ NOT REEDEM'}
                    </span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Device ID:</span>
                    <span class="detail-value">${redeem.deviceId}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Dibuat pada:</span>
                    <span class="detail-value">${formattedDate}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Waktu:</span>
                    <span class="detail-value">${formattedTime}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">User Key:</span>
                    <span class="detail-value">${redeem.key}</span>
                </div>
            </div>
        </div>
        
        ${redeem.details ? `
        <div class="popup-detail">
            <div class="detail-header">
                <h4 class="detail-title">Detail Reedem</h4>
                <span class="detail-status redeemed">✓ BERHASIL</span>
            </div>
            <div class="detail-info">
                <div class="detail-item">
                    <span class="detail-label">Server Sukses:</span>
                    <span class="detail-value success">${redeem.details.server}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Android Sukses:</span>
                    <span class="detail-value success">${redeem.details.android}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Reedem pada jam:</span>
                    <span class="detail-value">${redeem.details.time}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Percobaan ke:</span>
                    <span class="detail-value">${redeem.details.attempt}</span>
                </div>
            </div>
        </div>
        ` : `
        <div class="popup-detail">
            <div class="detail-header">
                <h4 class="detail-title">Detail Reedem</h4>
                <span class="detail-status not-redeemed">✗ BELUM REEDEM</span>
            </div>
            <div class="detail-info">
                <div class="detail-item">
                    <span class="detail-label">Status:</span>
                    <span class="detail-value failed">Belum melakukan reedem</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Informasi:</span>
                    <span class="detail-value">Reedem belum dilakukan atau gagal</span>
                </div>
            </div>
        </div>
        `}
    `;
    
    // Show popup with animation
    popupOverlay.style.display = 'flex';
    popupContainer.style.animation = 'popupSlide 0.4s ease';
}

// Tampilkan notifikasi
function showNotification(message, type) {
    // Hapus notifikasi sebelumnya jika ada
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Buat elemen notifikasi
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Style untuk notifikasi
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? 'rgba(46, 204, 113, 0.95)' : 'rgba(231, 76, 60, 0.95)'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        display: flex;
        align-items: center;
        gap: 0.8rem;
        font-weight: 600;
        z-index: 3000;
        animation: slideInRight 0.3s ease, fadeOut 0.3s ease 3s forwards;
        backdrop-filter: blur(10px);
        border: 1px solid ${type === 'success' ? 'rgba(46, 204, 113, 0.3)' : 'rgba(231, 76, 60, 0.3)'};
    `;
    
    // Tambahkan ke body
    document.body.appendChild(notification);
    
    // Hapus setelah 3 detik
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 3300);
}

// Add CSS animation for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100%);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes fadeOut {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100%);
        }
    }
`;
document.head.appendChild(style);

// Inisialisasi aplikasi
document.addEventListener('DOMContentLoaded', initLoadingScreen);