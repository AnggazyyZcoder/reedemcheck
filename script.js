// Konfigurasi JSONBin.io
const JSONBIN_ID = '693fbc76d0ea881f402a4544';
const API_KEY = '$2a$10$FrRFp7JmBmpnrWofdI2GyOHCeiMwzhvrVQ.Hh2H3FaBCiFlkxh4c6';
const API_URL = `https://api.jsonbin.io/v3/b/${JSONBIN_ID}/latest`;

// Global Variables
let redeemsData = [];
let isLoading = false;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Start loading screen timer
    setTimeout(() => {
        hideLoadingScreen();
        loadDashboardData();
        initializeAnimations();
        setupEventListeners();
    }, 3000);
});

// Hide loading screen with smooth animation
function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    loadingScreen.style.opacity = '0';
    loadingScreen.style.visibility = 'hidden';
    
    // Show main content
    document.querySelector('.main-content').style.opacity = '1';
}

// Load dashboard data from JSONBin
async function loadDashboardData() {
    try {
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
        redeemsData = data.record.redeems || [];
        
        // Update statistics with counting animation
        updateStatistics(redeemsData);
        
    } catch (error) {
        console.error('Error loading data:', error);
        showError('Gagal memuat data. Silakan coba lagi.');
    }
}

// Update statistics with counting animation
function updateStatistics(data) {
    // Calculate statistics
    const totalSuccess = data.filter(item => item.status === true).length;
    const servers = data.filter(item => item.details?.server).map(item => item.details.server);
    const topServer = findMostFrequent(servers) || 'Belum ada';
    
    const androidVersions = data.filter(item => item.details?.android).map(item => item.details.android);
    const topAndroid = findMostFrequent(androidVersions) || 'Belum ada';
    
    const bestCombo = 'Premium + VIP';
    
    // Animate counting for total success
    animateCount('total-success', 0, totalSuccess, 1500);
    
    // Update other statistics
    setTimeout(() => {
        document.getElementById('top-server').textContent = topServer;
        document.getElementById('top-android').textContent = topAndroid;
        document.getElementById('best-combo').textContent = bestCombo;
        
        // Add animation to stat cards
        document.querySelectorAll('.stat-card').forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('animate__fadeInUp');
            }, index * 200);
        });
    }, 1600);
}

// Animate counting from start to end
function animateCount(elementId, start, end, duration) {
    const element = document.getElementById(elementId);
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

// Find most frequent item in array
function findMostFrequent(arr) {
    if (arr.length === 0) return null;
    
    const frequency = {};
    let maxFreq = 0;
    let mostFrequent = arr[0];
    
    arr.forEach(item => {
        frequency[item] = (frequency[item] || 0) + 1;
        if (frequency[item] > maxFreq) {
            maxFreq = frequency[item];
            mostFrequent = item;
        }
    });
    
    return mostFrequent;
}

// Initialize animations and effects
function initializeAnimations() {
    // Add scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate__animated', 'animate__fadeInUp');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements for scroll animations
    document.querySelectorAll('.stat-card, .redeem-card, .section-title').forEach(el => {
        observer.observe(el);
    });
    
    // Smooth scroll for navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
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

// Setup event listeners
function setupEventListeners() {
    // Start button scroll to redeem section
    document.getElementById('start-btn').addEventListener('click', () => {
        document.getElementById('redeem').scrollIntoView({ behavior: 'smooth' });
    });
    
    // Check redeem button
    document.getElementById('check-redeem').addEventListener('click', checkRedeemStatus);
    
    // Enter key in redeem input
    document.getElementById('redeem-id').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            checkRedeemStatus();
        }
    });
    
    // Modal close buttons
    document.querySelector('.close-modal').addEventListener('click', closeModal);
    document.querySelector('.modal-close-btn').addEventListener('click', closeModal);
    
    // Close modal when clicking outside
    document.getElementById('redeem-modal').addEventListener('click', (e) => {
        if (e.target === document.getElementById('redeem-modal')) {
            closeModal();
        }
    });
    
    // Escape key to close modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
}

// Check redeem status
async function checkRedeemStatus() {
    const redeemId = document.getElementById('redeem-id').value.trim();
    const loadingElement = document.getElementById('check-loading');
    
    if (!redeemId) {
        showError('Masukkan ID Reedem terlebih dahulu!');
        return;
    }
    
    // Show loading
    loadingElement.style.display = 'flex';
    isLoading = true;
    
    // Simulate API delay (3 seconds)
    setTimeout(async () => {
        try {
            // Fetch fresh data from JSONBin
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
            const redeems = data.record.redeems || [];
            
            // Find the redeem by ID
            const redeem = redeems.find(item => item.id === redeemId);
            
            // Hide loading
            loadingElement.style.display = 'none';
            isLoading = false;
            
            if (redeem) {
                showRedeemModal(redeem);
            } else {
                showError('ID Reedem tidak ditemukan!');
            }
            
        } catch (error) {
            console.error('Error checking redeem:', error);
            loadingElement.style.display = 'none';
            isLoading = false;
            showError('Gagal memeriksa status. Silakan coba lagi.');
        }
    }, 3000);
}

// Show redeem modal with data
function showRedeemModal(redeem) {
    const modal = document.getElementById('redeem-modal');
    const detailsSection = document.getElementById('redeem-details');
    
    // Update modal content
    document.getElementById('modal-redeem-id').textContent = redeem.id;
    document.getElementById('modal-status').textContent = redeem.active;
    document.getElementById('modal-server').textContent = redeem.details?.server || 'Tidak tersedia';
    
    // Set redeem status
    const redeemStatus = document.getElementById('modal-redeem-status');
    redeemStatus.textContent = redeem.status ? 'Reedem' : 'Not Reedem';
    redeemStatus.setAttribute('data-status', redeem.status);
    
    // Show/hide details section
    if (redeem.status && redeem.details) {
        detailsSection.style.display = 'block';
        document.getElementById('detail-server').textContent = redeem.details.server || '-';
        document.getElementById('detail-android').textContent = redeem.details.android || '-';
        document.getElementById('detail-time').textContent = formatTime(redeem.details.time) || '-';
        document.getElementById('detail-attempt').textContent = redeem.details.attempt || '-';
    } else {
        detailsSection.style.display = 'none';
    }
    
    // Show modal with animation
    modal.style.display = 'flex';
    setTimeout(() => {
        modal.querySelector('.modal-content').classList.add('animate__animated', 'animate__fadeInUp');
    }, 10);
}

// Close modal
function closeModal() {
    const modal = document.getElementById('redeem-modal');
    modal.querySelector('.modal-content').classList.remove('animate__fadeInUp');
    modal.style.display = 'none';
}

// Format time for display
function formatTime(timeString) {
    if (!timeString) return '-';
    
    try {
        // Assuming timeString is in format "HH:MM:SS"
        const [hours, minutes, seconds] = timeString.split(':');
        return `${hours}:${minutes}, ${seconds} detik`;
    } catch (error) {
        return timeString;
    }
}

// Show error message
function showError(message) {
    // Create error toast
    const toast = document.createElement('div');
    toast.className = 'error-toast';
    toast.innerHTML = `
        <i class="fas fa-exclamation-circle"></i>
        <span>${message}</span>
    `;
    
    // Add styles for toast
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #ff4757, #ff3838);
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        gap: 10px;
        font-weight: 500;
        z-index: 10000;
        box-shadow: 0 5px 20px rgba(255, 71, 87, 0.3);
        animation: slideInRight 0.3s ease;
    `;
    
    // Add keyframe animation
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
        @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }
    `;
    document.head.appendChild(styleSheet);
    
    document.body.appendChild(toast);
    
    // Remove toast after 5 seconds
    setTimeout(() => {
        toast.style.animation = 'fadeOut 0.5s ease';
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 500);
    }, 5000);
}

// Function to simulate posting data (if needed for future enhancements)
async function postRedeemData(newRedeem) {
    try {
        // First get current data
        const response = await fetch(API_URL, {
            method: 'GET',
            headers: {
                'X-Master-Key': API_KEY,
                'Content-Type': 'application/json'
            }
        });
        
        const data = await response.json();
        const currentData = data.record;
        
        // Add new redeem
        currentData.redeems.push(newRedeem);
        
        // Update on JSONBin
        const updateResponse = await fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_ID}`, {
            method: 'PUT',
            headers: {
                'X-Master-Key': API_KEY,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(currentData)
        });
        
        return await updateResponse.json();
        
    } catch (error) {
        console.error('Error posting data:', error);
        throw error;
    }
}