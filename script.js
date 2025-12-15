// Konfigurasi API JSONBIN
const JSONBIN_ID = '693fbc76d0ea881f402a4544';
const API_KEY = '$2a$10$FrRFp7JmBmpnrWofdI2GyOHCeiMwzhvrVQ.Hh2H3FaBCiFlkxh4c6';
const API_URL = `https://api.jsonbin.io/v3/b/${JSONBIN_ID}/latest`;

// Data simulasi jika API tidak tersedia (hanya untuk fallback)
const fallbackData = {
    "redeems": [
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
        },
        {
            "id": "REDXYZ789GHI",
            "key": "USER_KEY_HERE_3",
            "createdAt": "2024-01-01T14:00:00.000Z",
            "active": "Active",
            "status": true,
            "deviceId": "device_ghi789jkl",
            "details": {
                "server": "Singapore",
                "android": "Android 11",
                "time": "14:15:30",
                "attempt": 3
            }
        },
        {
            "id": "REDXYZ012JKL",
            "key": "USER_KEY_HERE_4",
            "createdAt": "2024-01-01T15:00:00.000Z",
            "active": "Active",
            "status": true,
            "deviceId": "device_jkl012mno",
            "details": {
                "server": "Indonesia",
                "android": "Android 12",
                "time": "15:45:20",
                "attempt": 2
            }
        }
    ]
};

// Variabel global
let redeemData = null;
let stats = {
    totalSuccess: 0,
    topServer: '',
    topAndroid: '',
    bestCombo: ''
};

// Fungsi untuk inisialisasi
document.addEventListener('DOMContentLoaded', function() {
    // Setup loading screen
    setTimeout(() => {
        const loadingScreen = document.getElementById('loadingScreen');
        loadingScreen.classList.add('fade-out');
        
        // Setelah loading selesai, muat data
        setTimeout(() => {
            loadingScreen.style.display = 'none';
            initializeApp();
        }, 800);
    }, 3000);
    
    // Setup event listeners
    setupEventListeners();
    
    // Setup scroll animations
    setupScrollAnimations();
});

// Fungsi untuk inisialisasi aplikasi
async function initializeApp() {
    // Load data dari JSONBIN
    await loadRedeemData();
    
    // Hitung statistik
    calculateStats();
    
    // Animasikan statistik
    animateStats();
}

// Fungsi untuk load data dari JSONBIN
async function loadRedeemData() {
    try {
        console.log('Mengambil data dari JSONBIN...');
        
        const response = await fetch(API_URL, {
            method: 'GET',
            headers: {
                'X-Master-Key': API_KEY,
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Data berhasil diambil:', data);
        
        // Gunakan data dari API jika tersedia
        if (data && data.record && data.record.redeems) {
            redeemData = data.record;
        } else {
            // Fallback ke data simulasi
            console.warn('Data dari API tidak valid, menggunakan fallback data');
            redeemData = fallbackData;
        }
    } catch (error) {
        console.error('Error mengambil data dari JSONBIN:', error);
        console.warn('Menggunakan fallback data karena API error');
        // Fallback ke data simulasi jika API error
        redeemData = fallbackData;
    }
}

// Fungsi untuk menghitung statistik
function calculateStats() {
    if (!redeemData || !redeemData.redeems) return;
    
    const redeems = redeemData.redeems;
    
    // Hitung total sukses
    stats.totalSuccess = redeems.filter(r => r.status === true).length;
    
    // Hitung server terpopuler
    const serverCounts = {};
    redeems.forEach(r => {
        if (r.details && r.details.server) {
            const server = r.details.server;
            serverCounts[server] = (serverCounts[server] || 0) + 1;
        }
    });
    
    if (Object.keys(serverCounts).length > 0) {
        stats.topServer = Object.keys(serverCounts).reduce((a, b) => 
            serverCounts[a] > serverCounts[b] ? a : b
        );
    } else {
        stats.topServer = "Tidak ada data";
    }
    
    // Hitung versi Android terpopuler
    const androidCounts = {};
    redeems.forEach(r => {
        if (r.details && r.details.android) {
            const android = r.details.android;
            androidCounts[android] = (androidCounts[android] || 0) + 1;
        }
    });
    
    if (Object.keys(androidCounts).length > 0) {
        stats.topAndroid = Object.keys(androidCounts).reduce((a, b) => 
            androidCounts[a] > androidCounts[b] ? a : b
        );
    } else {
        stats.topAndroid = "Tidak ada data";
    }
    
    // Hitung best combo (server + android dengan sukses tertinggi)
    const comboCounts = {};
    redeems.forEach(r => {
        if (r.status === true && r.details && r.details.server && r.details.android) {
            const combo = `${r.details.server} + ${r.details.android}`;
            comboCounts[combo] = (comboCounts[combo] || 0) + 1;
        }
    });
    
    if (Object.keys(comboCounts).length > 0) {
        stats.bestCombo = Object.keys(comboCounts).reduce((a, b) => 
            comboCounts[a] > comboCounts[b] ? a : b
        );
    } else {
        stats.bestCombo = "Tidak ada data";
    }
}

// Fungsi untuk animasi statistik
function animateStats() {
    // Animasikan total sukses
    const totalSuccessEl = document.getElementById('totalSuccess');
    animateValue(totalSuccessEl, 0, stats.totalSuccess, 2000);
    
    // Update statistik lainnya
    document.getElementById('topServer').textContent = stats.topServer;
    document.getElementById('topAndroid').textContent = stats.topAndroid;
    document.getElementById('bestCombo').textContent = stats.bestCombo;
}

// Fungsi untuk animasi angka
function animateValue(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const value = Math.floor(progress * (end - start) + start);
        element.textContent = value;
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// Fungsi untuk setup event listeners
function setupEventListeners() {
    // Navbar menu
    const navbarMenu = document.getElementById('navbarMenu');
    const dropdownMenu = document.getElementById('dropdownMenu');
    
    navbarMenu.addEventListener('click', () => {
        dropdownMenu.classList.toggle('active');
    });
    
    // Tutup dropdown ketika klik di luar
    document.addEventListener('click', (e) => {
        if (!navbarMenu.contains(e.target) && !dropdownMenu.contains(e.target)) {
            dropdownMenu.classList.remove('active');
        }
    });
    
    // Scroll down button
    const scrollDownBtn = document.getElementById('scrollDownBtn');
    scrollDownBtn.addEventListener('click', () => {
        document.getElementById('stats').scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    });
    
    // Check redeem button
    const checkRedeemBtn = document.getElementById('checkRedeemBtn');
    const redeemIdInput = document.getElementById('redeemIdInput');
    const checkLoading = document.getElementById('checkLoading');
    
    checkRedeemBtn.addEventListener('click', () => {
        const redeemId = redeemIdInput.value.trim();
        
        if (!redeemId) {
            alert('Harap masukkan ID Reedem!');
            redeemIdInput.focus();
            return;
        }
        
        // Tampilkan loading
        checkLoading.classList.add('active');
        
        // Simulasi delay 3 detik
        setTimeout(() => {
            checkRedeem(redeemId);
            checkLoading.classList.remove('active');
        }, 3000);
    });
    
    // Enter key untuk input
    redeemIdInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            checkRedeemBtn.click();
        }
    });
    
    // Popup close buttons
    const popupCloseBtn = document.getElementById('popupCloseBtn');
    const closePopupBtn = document.getElementById('closePopupBtn');
    const popupOverlay = document.getElementById('popupOverlay');
    
    popupCloseBtn.addEventListener('click', closePopup);
    closePopupBtn.addEventListener('click', closePopup);
    
    // Tutup popup ketika klik di luar
    popupOverlay.addEventListener('click', (e) => {
        if (e.target === popupOverlay) {
            closePopup();
        }
    });
}

// Fungsi untuk cek reedem
function checkRedeem(redeemId) {
    if (!redeemData || !redeemData.redeems) {
        alert('Data belum dimuat. Silakan coba lagi.');
        return;
    }
    
    // Cari reedem berdasarkan ID
    const redeem = redeemData.redeems.find(r => r.id === redeemId);
    
    if (!redeem) {
        alert(`ID Reedem "${redeemId}" tidak ditemukan!`);
        return;
    }
    
    // Tampilkan popup dengan informasi reedem
    showRedeemPopup(redeem);
}

// Fungsi untuk menampilkan popup reedem
function showRedeemPopup(redeem) {
    // Update informasi di popup
    document.getElementById('popupRedeemId').textContent = redeem.id;
    document.getElementById('popupActiveStatus').textContent = redeem.active;
    document.getElementById('popupActiveServer').textContent = redeem.details ? redeem.details.server : 'Tidak tersedia';
    
    // Update status reedem
    const redeemStatusEl = document.getElementById('popupRedeemStatus');
    if (redeem.status) {
        redeemStatusEl.textContent = 'Reedem';
        redeemStatusEl.className = 'status-badge success';
    } else {
        redeemStatusEl.textContent = 'Not Reedem';
        redeemStatusEl.className = 'status-badge danger';
    }
    
    // Update detail jika ada
    const redeemDetails = document.getElementById('redeemDetails');
    if (redeem.details) {
        document.getElementById('detailServer').textContent = redeem.details.server;
        document.getElementById('detailAndroid').textContent = redeem.details.android;
        document.getElementById('detailTime').textContent = redeem.details.time;
        document.getElementById('detailAttempt').textContent = redeem.details.attempt;
        redeemDetails.style.display = 'block';
    } else {
        redeemDetails.style.display = 'none';
    }
    
    // Tampilkan popup
    const popupOverlay = document.getElementById('popupOverlay');
    popupOverlay.classList.add('active');
}

// Fungsi untuk menutup popup
function closePopup() {
    const popupOverlay = document.getElementById('popupOverlay');
    popupOverlay.classList.remove('active');
    
    // Reset input
    document.getElementById('redeemIdInput').value = '';
}

// Fungsi untuk setup scroll animations
function setupScrollAnimations() {
    // Observers untuk animasi fade-in
    const fadeElements = document.querySelectorAll('.fade-in');
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    fadeElements.forEach(element => {
        observer.observe(element);
    });
    
    // Smooth scroll untuk link navbar
    const navLinks = document.querySelectorAll('.dropdown-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                // Tutup dropdown menu
                document.getElementById('dropdownMenu').classList.remove('active');
                
                // Scroll ke target
                targetElement.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}