// Konfigurasi JSONBin.io
// Ganti dengan JSONBin.io Anda yang sebenarnya
const JSONBIN_BIN_ID = '66c0e8e6ad19ca34f8681af8'; // Ini contoh ID, ganti dengan ID bin Anda
const JSONBIN_API_KEY = '$2a$10$Tz9L7q9L8V7c8V7c8V7c8OeF8c8V7c8V7c8V7c8V7c8V7c8V7c8V7c8'; // Contoh API key, ganti dengan milik Anda
const JSONBIN_URL = `https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}/latest`;

// Data contoh jika JSONBin.io tidak tersedia
const SAMPLE_DATA = {
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
            "createdAt": "2024-01-02T10:30:00.000Z",
            "active": "Active",
            "status": true,
            "deviceId": "device_ghi789jkl",
            "details": {
                "server": "Singapore",
                "android": "Android 11",
                "time": "10:45:20",
                "attempt": 2
            }
        },
        {
            "id": "REDXYZ012JKL",
            "key": "USER_KEY_HERE_4",
            "createdAt": "2024-01-03T15:20:00.000Z",
            "active": "Active",
            "status": false,
            "deviceId": "device_jkl012mno",
            "details": null
        },
        {
            "id": "REDXYZ345MNO",
            "key": "USER_KEY_HERE_5",
            "createdAt": "2024-01-04T09:15:00.000Z",
            "active": "Active",
            "status": true,
            "deviceId": "device_mno345pqr",
            "details": {
                "server": "Indonesia",
                "android": "Android 12",
                "time": "09:25:10",
                "attempt": 1
            }
        }
    ]
};

// Variabel global
let redeemsData = [];
let statistics = {
    totalSuccess: 0,
    topServer: { name: "Loading...", count: 0 },
    topAndroid: { name: "Loading...", count: 0 },
    bestCombo: { server: "Loading...", android: "Loading...", count: 0 }
};

// Fungsi utama saat halaman dimuat
document.addEventListener('DOMContentLoaded', function() {
    // Inisialisasi
    initLoadingScreen();
    initEventListeners();
    loadDataFromJSONBin();
    
    // Inisialisasi smooth scroll
    initSmoothScroll();
    
    // Inisialisasi animasi counter
    initCounters();
});

// Fungsi untuk inisialisasi loading screen
function initLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    
    // Set timeout untuk menghilangkan loading screen setelah 3 detik
    setTimeout(() => {
        loadingScreen.style.opacity = '0';
        loadingScreen.style.visibility = 'hidden';
    }, 3000);
}

// Fungsi untuk inisialisasi event listeners
function initEventListeners() {
    // Event listener untuk tombol check redeem
    const checkBtn = document.getElementById('check-redeem-btn');
    if (checkBtn) {
        checkBtn.addEventListener('click', checkRedeem);
    }
    
    // Event listener untuk input redeem (enter key)
    const redeemInput = document.getElementById('redeem-id');
    if (redeemInput) {
        redeemInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                checkRedeem();
            }
        });
    }
    
    // Event listener untuk tombol close modal
    const modalClose = document.querySelector('.modal-close');
    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }
    
    // Event listener untuk tombol tutup modal
    const closeModalBtn = document.getElementById('close-modal');
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal);
    }
    
    // Event listener untuk tombol share status
    const shareBtn = document.getElementById('share-status');
    if (shareBtn) {
        shareBtn.addEventListener('click', shareRedeemStatus);
    }
    
    // Event listener untuk klik di luar modal
    const modal = document.getElementById('redeem-modal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal();
            }
        });
    }
}

// Fungsi untuk inisialisasi smooth scroll
function initSmoothScroll() {
    const scrollLinks = document.querySelectorAll('a[href^="#"]');
    
    scrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Fungsi untuk memuat data dari JSONBin.io
async function loadDataFromJSONBin() {
    const loadingStatus = document.getElementById('check-status');
    
    try {
        // Tampilkan status loading
        if (loadingStatus) {
            loadingStatus.innerHTML = `
                <div class="status-loading">
                    <i class="fas fa-spinner fa-spin"></i>
                    <h3>Memuat data dari server...</h3>
                    <p>Harap tunggu sebentar</p>
                </div>
            `;
        }
        
        // Fetch data dari JSONBin.io
        const response = await fetch(JSONBIN_URL, {
            headers: {
                'X-Master-Key': JSONBIN_API_KEY,
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Gunakan data dari JSONBin.io jika tersedia
        if (data && data.record && data.record.redeems) {
            redeemsData = data.record.redeems;
            console.log('Data berhasil dimuat dari JSONBin.io:', redeemsData.length, 'redeem');
        } else {
            // Jika struktur berbeda, gunakan data langsung
            redeemsData = data.redeems || SAMPLE_DATA.redeems;
            console.log('Data berhasil dimuat (struktur alternatif):', redeemsData.length, 'redeem');
        }
        
    } catch (error) {
        console.error('Error fetching data from JSONBin.io:', error);
        console.log('Menggunakan data contoh...');
        
        // Gunakan data contoh jika ada error
        redeemsData = SAMPLE_DATA.redeems;
        
        // Tampilkan pesan error (opsional)
        if (loadingStatus) {
            loadingStatus.innerHTML = `
                <div class="status-not-found">
                    <i class="fas fa-exclamation-triangle"></i>
                    <h3>Tidak dapat terhubung ke server</h3>
                    <p>Menggunakan data lokal untuk demonstrasi</p>
                </div>
            `;
            
            // Hilangkan pesan setelah 3 detik
            setTimeout(() => {
                loadingStatus.innerHTML = '';
            }, 3000);
        }
    }
    
    // Hitung statistik dari data
    calculateStatistics();
    
    // Update UI dengan data yang dimuat
    updateStatisticsUI();
}

// Fungsi untuk menghitung statistik dari data redeem
function calculateStatistics() {
    if (!redeemsData || redeemsData.length === 0) return;
    
    // Reset statistics
    statistics = {
        totalSuccess: 0,
        topServer: { name: "Tidak ada data", count: 0 },
        topAndroid: { name: "Tidak ada data", count: 0 },
        bestCombo: { server: "Tidak ada data", android: "Tidak ada data", count: 0 }
    };
    
    // Hitung total sukses (status = true)
    statistics.totalSuccess = redeemsData.filter(redeem => redeem.status === true).length;
    
    // Hitung server dan android yang paling sering muncul
    const serverCounts = {};
    const androidCounts = {};
    const comboCounts = {};
    
    redeemsData.forEach(redeem => {
        if (redeem.status === true && redeem.details) {
            // Hitung server
            const server = redeem.details.server;
            if (server) {
                serverCounts[server] = (serverCounts[server] || 0) + 1;
            }
            
            // Hitung android version
            const android = redeem.details.android;
            if (android) {
                androidCounts[android] = (androidCounts[android] || 0) + 1;
            }
            
            // Hitung kombinasi server + android
            const combo = `${server}|${android}`;
            if (server && android) {
                comboCounts[combo] = (comboCounts[combo] || 0) + 1;
            }
        }
    });
    
    // Cari server terbanyak
    if (Object.keys(serverCounts).length > 0) {
        let maxCount = 0;
        let topServer = "";
        
        for (const [server, count] of Object.entries(serverCounts)) {
            if (count > maxCount) {
                maxCount = count;
                topServer = server;
            }
        }
        
        statistics.topServer = { name: topServer, count: maxCount };
    }
    
    // Cari android terbanyak
    if (Object.keys(androidCounts).length > 0) {
        let maxCount = 0;
        let topAndroid = "";
        
        for (const [android, count] of Object.entries(androidCounts)) {
            if (count > maxCount) {
                maxCount = count;
                topAndroid = android;
            }
        }
        
        statistics.topAndroid = { name: topAndroid, count: maxCount };
    }
    
    // Cari kombinasi terbaik
    if (Object.keys(comboCounts).length > 0) {
        let maxCount = 0;
        let bestCombo = "";
        
        for (const [combo, count] of Object.entries(comboCounts)) {
            if (count > maxCount) {
                maxCount = count;
                bestCombo = combo;
            }
        }
        
        const [server, android] = bestCombo.split('|');
        statistics.bestCombo = { server, android, count: maxCount };
    }
}

// Fungsi untuk update UI dengan statistik
function updateStatisticsUI() {
    // Update counters dengan animasi
    animateCounter('total-success', statistics.totalSuccess);
    animateCounter('top-server', statistics.topServer.count);
    animateCounter('top-android', statistics.topAndroid.count);
    animateCounter('best-combo', statistics.bestCombo.count);
    
    // Update nama server dan android
    document.getElementById('top-server-name').textContent = statistics.topServer.name;
    document.getElementById('top-android-name').textContent = statistics.topAndroid.name;
    
    // Update statistik detail
    document.getElementById('stat-total-success').textContent = statistics.totalSuccess;
    document.getElementById('total-redeems').textContent = redeemsData.length;
    
    // Update progress bar
    const successRate = redeemsData.length > 0 ? (statistics.totalSuccess / redeemsData.length) * 100 : 0;
    document.getElementById('success-progress').style.width = `${successRate}%`;
    
    // Update server dan android list
    updateServerList();
    updateAndroidList();
    
    // Update combo info
    document.getElementById('stat-top-server').textContent = statistics.topServer.name;
    document.getElementById('stat-top-android').textContent = statistics.topAndroid.name;
    document.getElementById('stat-best-combo').textContent = statistics.bestCombo.count;
    document.getElementById('combo-server').textContent = statistics.bestCombo.server;
    document.getElementById('combo-android').textContent = statistics.bestCombo.android;
    document.getElementById('combo-rate').textContent = `${Math.round((statistics.bestCombo.count / statistics.totalSuccess) * 100) || 0}%`;
}

// Fungsi untuk update server list
function updateServerList() {
    const serverList = document.getElementById('server-list');
    if (!serverList) return;
    
    // Hitung jumlah per server
    const serverCounts = {};
    redeemsData.forEach(redeem => {
        if (redeem.details && redeem.details.server) {
            const server = redeem.details.server;
            serverCounts[server] = (serverCounts[server] || 0) + 1;
        }
    });
    
    // Buat list HTML
    let html = '';
    for (const [server, count] of Object.entries(serverCounts)) {
        html += `<p>${server} <span>${count} kali</span></p>`;
    }
    
    if (html === '') {
        html = '<p>Tidak ada data server</p>';
    }
    
    serverList.innerHTML = html;
}

// Fungsi untuk update android list
function updateAndroidList() {
    const androidList = document.getElementById('android-list');
    if (!androidList) return;
    
    // Hitung jumlah per android version
    const androidCounts = {};
    redeemsData.forEach(redeem => {
        if (redeem.details && redeem.details.android) {
            const android = redeem.details.android;
            androidCounts[android] = (androidCounts[android] || 0) + 1;
        }
    });
    
    // Buat list HTML
    let html = '';
    for (const [android, count] of Object.entries(androidCounts)) {
        html += `<p>${android} <span>${count} kali</span></p>`;
    }
    
    if (html === '') {
        html = '<p>Tidak ada data Android</p>';
    }
    
    androidList.innerHTML = html;
}

// Fungsi untuk animasi counter
function animateCounter(elementId, targetValue) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    const duration = 2000; // 2 detik
    const stepTime = 50; // Update setiap 50ms
    const steps = duration / stepTime;
    const increment = targetValue / steps;
    let currentValue = 0;
    
    // Reset ke 0
    element.textContent = '0';
    
    // Animasikan counter
    const timer = setInterval(() => {
        currentValue += increment;
        
        if (currentValue >= targetValue) {
            clearInterval(timer);
            element.textContent = targetValue;
        } else {
            element.textContent = Math.floor(currentValue);
        }
    }, stepTime);
}

// Fungsi untuk inisialisasi semua counter
function initCounters() {
    // Counter akan diupdate setelah data dimuat
    // Fungsi ini bisa digunakan untuk inisialisasi tambahan
}

// Fungsi untuk mengecek redeem
function checkRedeem() {
    const redeemIdInput = document.getElementById('redeem-id');
    const checkStatus = document.getElementById('check-status');
    
    if (!redeemIdInput || !checkStatus) return;
    
    const redeemId = redeemIdInput.value.trim().toUpperCase();
    
    // Validasi input
    if (!redeemId) {
        showNotification('Masukkan ID Redeem terlebih dahulu!', 'error');
        return;
    }
    
    // Tampilkan status loading
    checkStatus.innerHTML = `
        <div class="status-loading">
            <i class="fas fa-spinner fa-spin"></i>
            <h3>Sedang mengecek...</h3>
            <p>Harap tunggu sebentar</p>
        </div>
    `;
    
    // Simulasikan delay 3 detik
    setTimeout(() => {
        // Cari redeem berdasarkan ID
        const foundRedeem = redeemsData.find(redeem => redeem.id === redeemId);
        
        if (foundRedeem) {
            // Tampilkan status ditemukan
            checkStatus.innerHTML = `
                <div class="status-found" id="found-redeem">
                    <i class="fas fa-check-circle"></i>
                    <h3>Redeem ditemukan!</h3>
                    <p>Klik untuk melihat detail status</p>
                    <p class="redeem-id-display">ID: ${foundRedeem.id}</p>
                </div>
            `;
            
            // Tambahkan event listener untuk menampilkan modal
            const foundElement = document.getElementById('found-redeem');
            if (foundElement) {
                foundElement.addEventListener('click', () => {
                    showRedeemDetails(foundRedeem);
                });
            }
        } else {
            // Tampilkan status tidak ditemukan
            checkStatus.innerHTML = `
                <div class="status-not-found">
                    <i class="fas fa-times-circle"></i>
                    <h3>Redeem tidak ditemukan</h3>
                    <p>ID Redeem <strong>${redeemId}</strong> tidak ditemukan dalam database</p>
                    <p class="hint">Pastikan ID Redeem yang dimasukkan sudah benar</p>
                </div>
            `;
            
            // Hilangkan pesan setelah 5 detik
            setTimeout(() => {
                checkStatus.innerHTML = '';
            }, 5000);
        }
    }, 3000); // 3 detik delay
}

// Fungsi untuk menampilkan detail redeem di modal
function showRedeemDetails(redeem) {
    const modal = document.getElementById('redeem-modal');
    const modalRedeemId = document.getElementById('modal-redeem-id');
    const modalStatus = document.getElementById('modal-status');
    const modalServer = document.getElementById('modal-server');
    const modalRedeemStatus = document.getElementById('modal-redeem-status');
    const detailInfo = document.getElementById('detail-info');
    
    if (!modal || !modalRedeemId || !modalStatus) return;
    
    // Update data di modal
    modalRedeemId.textContent = redeem.id;
    
    // Update status active
    if (redeem.active === "Active") {
        modalStatus.innerHTML = '<span class="status-badge status-active">Active</span>';
    } else {
        modalStatus.innerHTML = '<span class="status-badge status-disabled">Disabled</span>';
    }
    
    // Update server
    modalServer.textContent = redeem.details ? redeem.details.server : "Tidak ada data";
    
    // Update redeem status
    if (redeem.status === true) {
        modalRedeemStatus.innerHTML = '<span class="status-badge status-redeem">Redeem</span>';
    } else {
        modalRedeemStatus.innerHTML = '<span class="status-badge status-not-redeem">Not Redeem</span>';
    }
    
    // Update detail info jika status redeem true
    if (redeem.status === true && redeem.details) {
        const details = redeem.details;
        detailInfo.innerHTML = `
            <h4 class="info-title"><i class="fas fa-info-circle"></i> Detail Reedem Berhasil</h4>
            <div class="info-item">
                <span class="info-label">Server Sukses:</span>
                <span class="info-value">${details.server || "Tidak ada data"}</span>
            </div>
            <div class="info-item">
                <span class="info-label">Android Sukses:</span>
                <span class="info-value">${details.android || "Tidak ada data"}</span>
            </div>
            <div class="info-item">
                <span class="info-label">Reedem pada jam:</span>
                <span class="info-value">${details.time || "Tidak ada data"}</span>
            </div>
            <div class="info-item">
                <span class="info-label">Percobaan ke:</span>
                <span class="info-value">${details.attempt || "Tidak ada data"}</span>
            </div>
        `;
    } else {
        detailInfo.innerHTML = `
            <h4 class="info-title"><i class="fas fa-info-circle"></i> Tidak ada detail reedem</h4>
            <p>Reedem ini belum berhasil atau tidak memiliki data detail.</p>
        `;
    }
    
    // Tampilkan modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent scrolling
}

// Fungsi untuk menutup modal
function closeModal() {
    const modal = document.getElementById('redeem-modal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto'; // Enable scrolling again
    }
}

// Fungsi untuk berbagi status redeem
function shareRedeemStatus() {
    const redeemId = document.getElementById('modal-redeem-id').textContent;
    const status = document.querySelector('#modal-status .status-badge').textContent;
    const redeemStatus = document.querySelector('#modal-redeem-status .status-badge').textContent;
    
    const shareText = `Status Redeem Anggazyy Market\nID: ${redeemId}\nStatus: ${status}\nRedeem Status: ${redeemStatus}\n\nCek di: ${window.location.href}`;
    
    // Coba menggunakan Web Share API jika tersedia
    if (navigator.share) {
        navigator.share({
            title: 'Status Redeem Anggazyy Market',
            text: shareText,
            url: window.location.href
        }).catch(error => {
            console.log('Error sharing:', error);
            copyToClipboard(shareText);
        });
    } else {
        // Fallback: copy ke clipboard
        copyToClipboard(shareText);
    }
}

// Fungsi untuk menyalin teks ke clipboard
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showNotification('Status berhasil disalin ke clipboard!', 'success');
    }).catch(err => {
        console.error('Failed to copy:', err);
        showNotification('Gagal menyalin ke clipboard', 'error');
    });
}

// Fungsi untuk menampilkan notifikasi
function showNotification(message, type = 'info') {
    // Buat elemen notifikasi
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Tambahkan ke body
    document.body.appendChild(notification);
    
    // Tampilkan dengan animasi
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Hilangkan setelah 3 detik
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Tambahkan style untuk notifikasi
const notificationStyle = document.createElement('style');
notificationStyle.textContent = `
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(90deg, var(--primary-color), var(--primary-dark));
        color: white;
        padding: 15px 20px;
        border-radius: var(--border-radius);
        box-shadow: var(--shadow);
        display: flex;
        align-items: center;
        gap: 10px;
        z-index: 3000;
        transform: translateX(150%);
        transition: transform 0.3s ease;
        max-width: 400px;
    }
    
    .notification.show {
        transform: translateX(0);
    }
    
    .notification-success {
        background: linear-gradient(90deg, var(--success-color), var(--secondary-dark));
    }
    
    .notification-error {
        background: linear-gradient(90deg, var(--danger-color), #ff1e4a);
    }
    
    .notification i {
        font-size: 1.2rem;
    }
`;
document.head.appendChild(notificationStyle);

// Tambahkan fungsi untuk menangani form submit jika ada
document.addEventListener('submit', function(e) {
    if (e.target.matches('form')) {
        e.preventDefault();
        // Handle form submission jika ada
    }
});

// Fungsi untuk refresh data (bisa dipanggil dari console atau button tambahan)
function refreshData() {
    showNotification('Memperbarui data dari server...', 'info');
    loadDataFromJSONBin();
}

// Tambahkan event listener untuk tombol refresh jika diperlukan
// document.getElementById('refresh-btn').addEventListener('click', refreshData);