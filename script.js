// Konfigurasi JSONBin.io
// Ganti dengan JSONBin.io Anda yang sebenarnya
const JSONBIN_BIN_ID = '693fbc76d0ea881f402a4544'; // Ini contoh ID, ganti dengan ID bin Anda
const JSONBIN_API_KEY = '$2a$10$FrRFp7JmBmpnrWofdI2GyOHCeiMwzhvrVQ.Hh2H3FaBCiFlkxh4c6'; // Contoh API key, ganti dengan milik Anda
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
        },
        {
            "id": "REDXYZ678PQR",
            "key": "USER_KEY_HERE_6",
            "createdAt": "2024-01-05T14:45:00.000Z",
            "active": "Active",
            "status": true,
            "deviceId": "device_pqr678stu",
            "details": {
                "server": "Thailand",
                "android": "Android 13",
                "time": "14:55:30",
                "attempt": 3
            }
        },
        {
            "id": "REDXYZ901STU",
            "key": "USER_KEY_HERE_7",
            "createdAt": "2024-01-06T11:20:00.000Z",
            "active": "Disable",
            "status": true,
            "deviceId": "device_stu901vwx",
            "details": {
                "server": "Singapore",
                "android": "Android 10",
                "time": "11:30:15",
                "attempt": 4
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
    initMobileMenu();
    initEventListeners();
    loadDataFromJSONBin();
    
    // Inisialisasi smooth scroll
    initSmoothScroll();
    
    // Inisialisasi back to top button
    initBackToTop();
    
    // Inisialisasi navigation active state
    initNavigation();
});

// Fungsi untuk inisialisasi loading screen
function initLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    const progressFill = document.querySelector('.progress-fill');
    
    // Animasikan progress bar
    if (progressFill) {
        progressFill.style.width = '100%';
    }
    
    // Set timeout untuk menghilangkan loading screen setelah 3 detik
    setTimeout(() => {
        loadingScreen.style.opacity = '0';
        loadingScreen.style.visibility = 'hidden';
        
        // Hapus elemen setelah animasi selesai
        setTimeout(() => {
            if (loadingScreen.parentNode) {
                loadingScreen.parentNode.removeChild(loadingScreen);
            }
        }, 800);
    }, 3000);
}

// Fungsi untuk inisialisasi mobile menu
function initMobileMenu() {
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            this.classList.toggle('active');
            
            // Ubah ikon menu
            const icon = this.querySelector('i');
            if (navMenu.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
        
        // Tutup menu mobile saat mengklik link
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
                
                const icon = mobileMenuToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            });
        });
    }
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
    
    // Event listener untuk tombol refresh data
    const refreshBtn = document.getElementById('refreshData');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', refreshData);
    }
    
    // Event listener untuk tombol close modal
    const modalClose = document.getElementById('modalClose');
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
    
    // Event listener untuk tombol print status
    const printBtn = document.getElementById('print-status');
    if (printBtn) {
        printBtn.addEventListener('click', printRedeemStatus);
    }
    
    // Event listener untuk klik di luar modal
    const modal = document.getElementById('redeem-modal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal || e.target.classList.contains('modal-overlay')) {
                closeModal();
            }
        });
    }
    
    // Event listener untuk tombol contact support
    const contactSupportBtn = document.getElementById('contact-support');
    if (contactSupportBtn) {
        contactSupportBtn.addEventListener('click', function() {
            showNotification('Fitur hubungi customer support akan segera tersedia!', 'info');
        });
    }
    
    // Event listener untuk tombol show all redeems
    const showAllBtn = document.getElementById('showAllRedeems');
    if (showAllBtn) {
        showAllBtn.addEventListener('click', function() {
            showNotification('Fitur lihat semua reedem akan segera tersedia!', 'info');
        });
    }
    
    // Event listener untuk tombol add new redeem
    const addNewBtn = document.getElementById('addNewRedeem');
    if (addNewBtn) {
        addNewBtn.addEventListener('click', function() {
            showNotification('Fitur tambah reedem baru akan segera tersedia!', 'info');
        });
    }
    
    // Event listener untuk chart controls
    const chartControls = document.querySelectorAll('.chart-control');
    chartControls.forEach(control => {
        control.addEventListener('click', function() {
            chartControls.forEach(c => c.classList.remove('active'));
            this.classList.add('active');
            
            // Simulasi perubahan data chart
            animateChartBars();
        });
    });
}

// Fungsi untuk inisialisasi smooth scroll
function initSmoothScroll() {
    const scrollLinks = document.querySelectorAll('a[href^="#"]');
    
    scrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                
                // Hitung offset dengan header
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Update active navigation
                updateActiveNavigation(targetId);
            }
        });
    });
}

// Fungsi untuk inisialisasi back to top button
function initBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');
    
    if (backToTopBtn) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        });
        
        backToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// Fungsi untuk inisialisasi navigation active state
function initNavigation() {
    // Set default active
    updateActiveNavigation('#dashboard');
    
    // Update active nav saat scroll
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('section');
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 150;
            const sectionHeight = section.clientHeight;
            
            if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
                currentSection = '#' + section.id;
            }
        });
        
        updateActiveNavigation(currentSection);
    });
}

// Fungsi untuk update navigation active state
function updateActiveNavigation(targetId) {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === targetId) {
            link.classList.add('active');
        }
    });
}

// Fungsi untuk memuat data dari JSONBin.io
async function loadDataFromJSONBin() {
    try {
        // Tampilkan loading state
        showLoadingState();
        
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
        } else if (data && data.redeems) {
            // Jika struktur berbeda
            redeemsData = data.redeems;
            console.log('Data berhasil dimuat (struktur alternatif):', redeemsData.length, 'redeem');
        } else {
            throw new Error('Data tidak valid dari JSONBin.io');
        }
        
        showNotification('Data berhasil dimuat dari server!', 'success');
        
    } catch (error) {
        console.error('Error fetching data from JSONBin.io:', error);
        
        // Gunakan data contoh jika ada error
        redeemsData = SAMPLE_DATA.redeems;
        console.log('Menggunakan data contoh:', redeemsData.length, 'redeem');
        
        showNotification('Tidak dapat terhubung ke server. Menggunakan data contoh.', 'error');
    }
    
    // Hitung statistik dari data
    calculateStatistics();
    
    // Update UI dengan data yang dimuat
    updateStatisticsUI();
    
    // Update recent redeems
    updateRecentRedeems();
    
    // Animasikan chart bars
    animateChartBars();
}

// Fungsi untuk menampilkan loading state
function showLoadingState() {
    // Update counters menjadi loading
    const counters = document.querySelectorAll('.counter');
    counters.forEach(counter => {
        counter.textContent = '...';
        counter.style.color = 'var(--text-muted)';
    });
    
    // Update stat numbers
    const statNumbers = document.querySelectorAll('.stat-number');
    statNumbers.forEach(stat => {
        stat.textContent = '...';
        stat.style.color = 'var(--text-muted)';
    });
    
    // Update progress bar
    const progressFill = document.getElementById('success-progress');
    if (progressFill) {
        progressFill.style.width = '0%';
    }
    
    // Update recent redeems
    const recentRedeems = document.getElementById('recent-redeems');
    if (recentRedeems) {
        recentRedeems.innerHTML = `
            <div class="recent-redeem loading">
                <div class="redeem-loading">
                    <i class="fas fa-spinner fa-spin"></i>
                    <p>Memuat data reedem terbaru...</p>
                </div>
            </div>
        `;
    }
}

// Fungsi untuk menghitung statistik dari data redeem
function calculateStatistics() {
    if (!redeemsData || redeemsData.length === 0) {
        statistics = {
            totalSuccess: 0,
            topServer: { name: "Tidak ada data", count: 0 },
            topAndroid: { name: "Tidak ada data", count: 0 },
            bestCombo: { server: "Tidak ada data", android: "Tidak ada data", count: 0 }
        };
        return;
    }
    
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
    // Update total data
    const totalDataElement = document.getElementById('total-data');
    if (totalDataElement) {
        totalDataElement.textContent = redeemsData.length;
    }
    
    // Update counters dengan animasi
    animateCounter('total-success', statistics.totalSuccess);
    animateCounter('top-server', statistics.topServer.count);
    animateCounter('top-android', statistics.topAndroid.count);
    animateCounter('best-combo', statistics.bestCombo.count);
    
    // Update nama server dan android
    const topServerName = document.getElementById('top-server-name');
    const topAndroidName = document.getElementById('top-android-name');
    
    if (topServerName) topServerName.textContent = statistics.topServer.name;
    if (topAndroidName) topAndroidName.textContent = statistics.topAndroid.name;
    
    // Update statistik detail
    const statTotalSuccess = document.getElementById('stat-total-success');
    const totalRedeems = document.getElementById('total-redeems');
    const statTopServer = document.getElementById('stat-top-server');
    const statTopAndroid = document.getElementById('stat-top-android');
    const statBestCombo = document.getElementById('stat-best-combo');
    
    if (statTotalSuccess) statTotalSuccess.textContent = statistics.totalSuccess;
    if (totalRedeems) totalRedeems.textContent = redeemsData.length;
    if (statTopServer) statTopServer.textContent = statistics.topServer.name;
    if (statTopAndroid) statTopAndroid.textContent = statistics.topAndroid.name;
    if (statBestCombo) statBestCombo.textContent = statistics.bestCombo.count;
    
    // Update progress bar
    const successRate = redeemsData.length > 0 ? (statistics.totalSuccess / redeemsData.length) * 100 : 0;
    const progressFill = document.getElementById('success-progress');
    if (progressFill) {
        setTimeout(() => {
            progressFill.style.width = `${successRate}%`;
        }, 500);
    }
    
    // Update server dan android list
    updateServerList();
    updateAndroidList();
    
    // Update combo info
    const comboServer = document.getElementById('combo-server');
    const comboAndroid = document.getElementById('combo-android');
    const comboRate = document.getElementById('combo-rate');
    
    if (comboServer) comboServer.textContent = statistics.bestCombo.server;
    if (comboAndroid) comboAndroid.textContent = statistics.bestCombo.android;
    
    if (comboRate) {
        const comboRateValue = statistics.totalSuccess > 0 
            ? Math.round((statistics.bestCombo.count / statistics.totalSuccess) * 100) 
            : 0;
        comboRate.textContent = `${comboRateValue}%`;
    }
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
    const servers = Object.entries(serverCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5); // Ambil 5 teratas
    
    if (servers.length > 0) {
        servers.forEach(([server, count]) => {
            const percentage = Math.round((count / redeemsData.length) * 100);
            html += `
                <div class="server-item">
                    <span class="server-name">${server}</span>
                    <div class="server-stats">
                        <span class="server-count">${count}</span>
                        <span class="server-percentage">${percentage}%</span>
                    </div>
                </div>
            `;
        });
    } else {
        html = '<div class="list-placeholder"><p>Tidak ada data server</p></div>';
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
    const androids = Object.entries(androidCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5); // Ambil 5 teratas
    
    if (androids.length > 0) {
        androids.forEach(([android, count]) => {
            const percentage = Math.round((count / redeemsData.length) * 100);
            html += `
                <div class="android-item">
                    <span class="android-name">${android}</span>
                    <div class="android-stats">
                        <span class="android-count">${count}</span>
                        <span class="android-percentage">${percentage}%</span>
                    </div>
                </div>
            `;
        });
    } else {
        html = '<div class="list-placeholder"><p>Tidak ada data Android</p></div>';
    }
    
    androidList.innerHTML = html;
}

// Fungsi untuk animasi counter
function animateCounter(elementId, targetValue) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    // Reset ke 0
    element.textContent = '0';
    element.style.color = 'var(--text-light)';
    
    // Jika target 0, langsung set
    if (targetValue === 0) {
        element.textContent = '0';
        return;
    }
    
    const duration = 1500; // 1.5 detik
    const stepTime = 50; // Update setiap 50ms
    const steps = duration / stepTime;
    const increment = targetValue / steps;
    let currentValue = 0;
    
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

// Fungsi untuk animasi chart bars
function animateChartBars() {
    const chartBars = document.querySelectorAll('.chart-bar');
    
    chartBars.forEach(bar => {
        const currentHeight = bar.style.height;
        bar.style.height = '0%';
        
        setTimeout(() => {
            bar.style.height = currentHeight;
        }, 100);
    });
}

// Fungsi untuk update recent redeems
function updateRecentRedeems() {
    const recentRedeems = document.getElementById('recent-redeems');
    if (!recentRedeems) return;
    
    if (redeemsData.length === 0) {
        recentRedeems.innerHTML = `
            <div class="recent-redeem">
                <div class="redeem-empty">
                    <i class="fas fa-database"></i>
                    <p>Tidak ada data reedem</p>
                </div>
            </div>
        `;
        return;
    }
    
    // Ambil 5 data terbaru (berdasarkan tanggal)
    const sortedRedeems = [...redeemsData]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);
    
    let html = '';
    sortedRedeems.forEach(redeem => {
        const date = new Date(redeem.createdAt);
        const formattedDate = date.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short'
        });
        
        const statusClass = redeem.status ? 'success' : 'pending';
        const statusText = redeem.status ? 'Berhasil' : 'Pending';
        
        html += `
            <div class="recent-redeem">
                <div class="redeem-info">
                    <div class="redeem-id">${redeem.id}</div>
                    <div class="redeem-date">${formattedDate}</div>
                </div>
                <div class="redeem-status ${statusClass}">
                    <span class="status-dot"></span>
                    ${statusText}
                </div>
            </div>
        `;
    });
    
    recentRedeems.innerHTML = html;
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
        redeemIdInput.focus();
        return;
    }
    
    // Validasi format (minimal 3 karakter)
    if (redeemId.length < 3) {
        showNotification('ID Redeem terlalu pendek!', 'error');
        redeemIdInput.focus();
        return;
    }
    
    // Tampilkan status loading
    checkStatus.innerHTML = `
        <div class="status-loading">
            <i class="fas fa-spinner fa-spin"></i>
            <h3>Sedang mengecek...</h3>
            <p>Harap tunggu sebentar</p>
            <div class="loading-dots">
                <span></span><span></span><span></span>
            </div>
        </div>
    `;
    
    // Disable tombol check
    const checkBtn = document.getElementById('check-redeem-btn');
    if (checkBtn) {
        checkBtn.disabled = true;
        checkBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Checking...';
    }
    
    // Simulasikan delay 3 detik
    setTimeout(() => {
        // Cari redeem berdasarkan ID
        const foundRedeem = redeemsData.find(redeem => redeem.id === redeemId);
        
        // Enable tombol check
        if (checkBtn) {
            checkBtn.disabled = false;
            checkBtn.innerHTML = '<i class="fas fa-search"></i> Check Status';
        }
        
        if (foundRedeem) {
            // Tampilkan status ditemukan
            checkStatus.innerHTML = `
                <div class="status-found" id="found-redeem">
                    <i class="fas fa-check-circle"></i>
                    <h3>Redeem ditemukan!</h3>
                    <p>Klik untuk melihat detail status</p>
                    <div class="redeem-summary">
                        <div class="summary-item">
                            <span>ID:</span>
                            <strong>${foundRedeem.id}</strong>
                        </div>
                        <div class="summary-item">
                            <span>Status:</span>
                            <strong class="${foundRedeem.status ? 'success' : 'warning'}">
                                ${foundRedeem.status ? 'Berhasil' : 'Pending'}
                            </strong>
                        </div>
                    </div>
                    <button class="btn-view-details">
                        <i class="fas fa-eye"></i> Lihat Detail
                    </button>
                </div>
            `;
            
            // Tambahkan event listener untuk menampilkan modal
            const viewDetailsBtn = checkStatus.querySelector('.btn-view-details');
            const foundElement = document.getElementById('found-redeem');
            
            if (viewDetailsBtn) {
                viewDetailsBtn.addEventListener('click', () => {
                    showRedeemDetails(foundRedeem);
                });
            }
            
            if (foundElement) {
                foundElement.addEventListener('click', (e) => {
                    if (!e.target.closest('.btn-view-details')) {
                        showRedeemDetails(foundRedeem);
                    }
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
                    <div class="suggestions">
                        <p><i class="fas fa-lightbulb"></i> Coba ID berikut:</p>
                        <div class="suggestion-ids">
                            <span>REDXYZ123ABC</span>
                            <span>REDXYZ456DEF</span>
                            <span>REDXYZ789GHI</span>
                        </div>
                    </div>
                </div>
            `;
        }
    }, 3000); // 3 detik delay
}

// Fungsi untuk menampilkan detail redeem di modal
function showRedeemDetails(redeem) {
    const modal = document.getElementById('redeem-modal');
    const modalRedeemId = document.getElementById('modal-redeem-id');
    const modalCreatedDate = document.getElementById('modal-created-date');
    const modalDeviceId = document.getElementById('modal-device-id');
    const modalStatus = document.getElementById('modal-status');
    const modalServer = document.getElementById('modal-server');
    const modalRedeemStatus = document.getElementById('modal-redeem-status');
    const detailInfo = document.getElementById('detail-info');
    
    if (!modal || !modalRedeemId || !modalStatus) return;
    
    // Format tanggal
    const createdAt = new Date(redeem.createdAt);
    const formattedDate = createdAt.toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    // Update data di modal
    modalRedeemId.textContent = redeem.id;
    modalCreatedDate.textContent = formattedDate;
    modalDeviceId.textContent = redeem.deviceId || 'Tidak tersedia';
    
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
            <div class="detail-section">
                <h3><i class="fas fa-info-circle"></i> Detail Reedem Berhasil</h3>
                <div class="info-grid">
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
                </div>
            </div>
        `;
    } else {
        detailInfo.innerHTML = `
            <div class="detail-section">
                <h3><i class="fas fa-info-circle"></i> Tidak ada detail reedem</h3>
                <p>Reedem ini belum berhasil atau tidak memiliki data detail.</p>
            </div>
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
    const statusElement = document.querySelector('#modal-status .status-badge');
    const redeemStatusElement = document.querySelector('#modal-redeem-status .status-badge');
    
    if (!statusElement || !redeemStatusElement) return;
    
    const status = statusElement.textContent;
    const redeemStatus = redeemStatusElement.textContent;
    
    const shareText = `Status Redeem Anggazyy Market\n\nID: ${redeemId}\nStatus: ${status}\nRedeem Status: ${redeemStatus}\n\nCek di: ${window.location.href}`;
    
    // Coba menggunakan Web Share API jika tersedia
    if (navigator.share) {
        navigator.share({
            title: 'Status Redeem Anggazyy Market',
            text: shareText,
            url: window.location.href
        }).then(() => {
            showNotification('Berhasil berbagi status!', 'success');
        }).catch(error => {
            console.log('Error sharing:', error);
            copyToClipboard(shareText);
        });
    } else {
        // Fallback: copy ke clipboard
        copyToClipboard(shareText);
    }
}

// Fungsi untuk mencetak status redeem
function printRedeemStatus() {
    showNotification('Fitur cetak akan segera tersedia!', 'info');
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

// Fungsi untuk refresh data
function refreshData() {
    showNotification('Memperbarui data dari server...', 'info');
    loadDataFromJSONBin();
}

// Fungsi untuk menampilkan notifikasi
function showNotification(message, type = 'info') {
    // Hapus toast sebelumnya jika ada
    const existingToast = document.getElementById('notification-toast');
    if (existingToast) {
        existingToast.remove();
    }
    
    // Buat elemen toast baru
    const toast = document.createElement('div');
    toast.id = 'notification-toast';
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <div class="toast-content">
            <i class="toast-icon"></i>
            <div class="toast-message">${message}</div>
        </div>
        <div class="toast-progress"></div>
    `;
    
    // Tambahkan ke body
    document.body.appendChild(toast);
    
    // Tampilkan toast
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    // Sembunyikan toast setelah 4 detik
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }, 4000);
}

// Inisialisasi toast styles
const toastStyle = document.createElement('style');
toastStyle.textContent = `
    .toast {
        position: fixed;
        top: 100px;
        right: 30px;
        background: linear-gradient(90deg, var(--primary-color), var(--primary-dark));
        color: white;
        padding: 20px 25px;
        border-radius: var(--border-radius);
        box-shadow: var(--shadow-heavy);
        display: flex;
        flex-direction: column;
        z-index: 3000;
        transform: translateX(150%);
        transition: transform 0.3s ease;
        max-width: 400px;
        min-width: 300px;
    }
    
    .toast.show {
        transform: translateX(0);
    }
    
    .toast-success {
        background: linear-gradient(90deg, var(--success-color), var(--secondary-dark));
    }
    
    .toast-error {
        background: linear-gradient(90deg, var(--danger-color), #ff1e4a);
    }
    
    .toast-info {
        background: linear-gradient(90deg, var(--info-color), #2a7bb6);
    }
    
    .toast-content {
        display: flex;
        align-items: center;
        gap: 15px;
        margin-bottom: 10px;
    }
    
    .toast-icon {
        font-size: 1.5rem;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .toast-success .toast-icon::before {
        content: '\\f058';
        font-family: 'Font Awesome 6 Free';
        font-weight: 900;
    }
    
    .toast-error .toast-icon::before {
        content: '\\f06a';
        font-family: 'Font Awesome 6 Free';
        font-weight: 900;
    }
    
    .toast-info .toast-icon::before {
        content: '\\f05a';
        font-family: 'Font Awesome 6 Free';
        font-weight: 900;
    }
    
    .toast-message {
        font-weight: 500;
        flex: 1;
    }
    
    .toast-progress {
        height: 4px;
        width: 100%;
        background-color: rgba(255, 255, 255, 0.3);
        border-radius: 2px;
        overflow: hidden;
    }
    
    .toast-progress::after {
        content: '';
        display: block;
        height: 100%;
        width: 100%;
        background-color: white;
        animation: toastProgress 4s linear forwards;
    }
    
    @keyframes toastProgress {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(0); }
    }
    
    @media (max-width: 768px) {
        .toast {
            top: 80px;
            right: 20px;
            left: 20px;
            max-width: calc(100% - 40px);
        }
    }
`;
document.head.appendChild(toastStyle);

// Tambahkan styles tambahan untuk elemen baru
const additionalStyles = document.createElement('style');
additionalStyles.textContent = `
    .server-item, .android-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 15px;
        background-color: rgba(138, 43, 226, 0.05);
        border-radius: 8px;
        margin-bottom: 10px;
        border-left: 3px solid var(--primary-color);
    }
    
    .server-name, .android-name {
        font-weight: 600;
        color: var(--text-color);
    }
    
    .server-stats, .android-stats {
        display: flex;
        gap: 15px;
        align-items: center;
    }
    
    .server-count, .android-count {
        color: var(--secondary-color);
        font-weight: 700;
        font-size: 1.1rem;
    }
    
    .server-percentage, .android-percentage {
        color: var(--text-muted);
        font-size: 0.9rem;
        background-color: rgba(255, 255, 255, 0.05);
        padding: 3px 8px;
        border-radius: 4px;
    }
    
    .redeem-summary {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 15px;
        margin: 20px 0;
    }
    
    .summary-item {
        display: flex;
        justify-content: space-between;
        padding: 10px;
        background-color: rgba(255, 255, 255, 0.05);
        border-radius: 8px;
    }
    
    .summary-item span {
        color: var(--text-muted);
    }
    
    .summary-item strong.success {
        color: var(--success-color);
    }
    
    .summary-item strong.warning {
        color: var(--warning-color);
    }
    
    .btn-view-details {
        background: linear-gradient(90deg, var(--primary-color), var(--primary-dark));
        color: white;
        border: none;
        padding: 12px 25px;
        border-radius: 30px;
        font-weight: 600;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        gap: 10px;
        transition: var(--transition);
        margin-top: 15px;
    }
    
    .btn-view-details:hover {
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(138, 43, 226, 0.3);
    }
    
    .loading-dots {
        display: flex;
        gap: 5px;
        margin-top: 15px;
        justify-content: center;
    }
    
    .loading-dots span {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background-color: var(--info-color);
        animation: pulse 1.4s ease-in-out infinite;
    }
    
    .loading-dots span:nth-child(2) {
        animation-delay: 0.2s;
    }
    
    .loading-dots span:nth-child(3) {
        animation-delay: 0.4s;
    }
    
    .suggestions {
        margin-top: 20px;
        padding-top: 15px;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .suggestions p {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 10px;
        color: var(--text-muted);
        font-size: 0.9rem;
    }
    
    .suggestions i {
        color: var(--warning-color);
    }
    
    .suggestion-ids {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
    }
    
    .suggestion-ids span {
        padding: 8px 12px;
        background-color: rgba(138, 43, 226, 0.1);
        border-radius: 6px;
        font-family: monospace;
        color: var(--primary-light);
        font-size: 0.9rem;
        cursor: pointer;
        transition: var(--transition);
    }
    
    .suggestion-ids span:hover {
        background-color: rgba(138, 43, 226, 0.2);
    }
    
    .recent-redeem .redeem-info {
        display: flex;
        flex-direction: column;
    }
    
    .recent-redeem .redeem-id {
        font-weight: 600;
        color: var(--text-color);
        font-size: 0.95rem;
    }
    
    .recent-redeem .redeem-date {
        color: var(--text-muted);
        font-size: 0.85rem;
        margin-top: 3px;
    }
    
    .recent-redeem .redeem-status {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 0.85rem;
        padding: 5px 12px;
        border-radius: 30px;
        font-weight: 600;
    }
    
    .recent-redeem .redeem-status.success {
        background-color: rgba(0, 255, 136, 0.1);
        color: var(--success-color);
    }
    
    .recent-redeem .redeem-status.pending {
        background-color: rgba(255, 221, 87, 0.1);
        color: var(--warning-color);
    }
    
    .recent-redeem .status-dot {
        width: 6px;
        height: 6px;
        border-radius: 50%;
    }
    
    .recent-redeem .redeem-status.success .status-dot {
        background-color: var(--success-color);
    }
    
    .recent-redeem .redeem-status.pending .status-dot {
        background-color: var(--warning-color);
    }
`;
document.head.appendChild(additionalStyles);

// Event listener untuk suggestion IDs
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('suggestion-ids') || e.target.closest('.suggestion-ids span')) {
        const suggestionId = e.target.textContent;
        const redeemInput = document.getElementById('redeem-id');
        if (redeemInput && suggestionId) {
            redeemInput.value = suggestionId;
            redeemInput.focus();
        }
    }
});