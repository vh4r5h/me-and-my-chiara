// --- PRIVATE CREDENTIALS ---
const AUTH = { user: "CHIARA", pass: "1809_HC" };

// --- STATE MANAGEMENT ---
let currentStreak = localStorage.getItem('hc_streak') || 0;
let lastSync = localStorage.getItem('hc_last_sync') || Date.now();
let holdTime = 0;
let syncInterval;

// --- LOGIN LOGIC ---
function checkLogin() {
    const u = document.getElementById('username').value.toUpperCase();
    const p = document.getElementById('password').value;

    if (u === AUTH.user && p === AUTH.pass) {
        document.getElementById('login-screen').style.display = 'none';
        document.getElementById('main-ui').style.display = 'block';
        startProtocol();
    } else {
        alert("ACCESS DENIED: UNKNOWN BIOMETRIC KEY");
    }
}

// --- PROTOCOL CORE ---
function startProtocol() {
    document.getElementById('streak').innerText = "LVL " + currentStreak;
    
    // Evolve Monolith shape based on complexity
    const m = document.getElementById('monolith');
    if(currentStreak > 5) m.style.borderRadius = "20%";
    if(currentStreak > 20) m.style.borderRadius = "50%";
    if(currentStreak > 50) m.style.filter = "hue-rotate(90deg)";

    setInterval(updateCountdown, 1000);
}

function updateCountdown() {
    const now = Date.now();
    const msLeft = 86400000 - (now - lastSync);

    if (msLeft <= 0) {
        document.getElementById('main-ui').style.display = 'none';
        document.getElementById('collapse-screen').style.display = 'flex';
        localStorage.clear();
        return;
    }

    const h = Math.floor(msLeft / 3600000);
    const m = Math.floor((msLeft % 3600000) / 60000);
    const s = Math.floor((msLeft % 60000) / 1000);
    document.getElementById('timer').innerText = 
        `${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
}

// --- SYNC TASK (60 Seconds) ---
function startSync() {
    isHolding = true;
    syncInterval = setInterval(() => {
        holdTime++;
        const percent = (holdTime / 60) * 100;
        document.getElementById('progress-bar').style.width = percent + "%";
        document.getElementById('atp-timer').innerText = (60 - holdTime) + "s";

        if (navigator.vibrate) navigator.vibrate(20);

        if (holdTime >= 60) {
            completeSync();
        }
    }, 1000);
}

function stopSync() {
    clearInterval(syncInterval);
    holdTime = 0;
    document.getElementById('progress-bar').style.width = "0%";
    document.getElementById('atp-timer').innerText = "60s";
}

function completeSync() {
    clearInterval(syncInterval);
    lastSync = Date.now();
    localStorage.setItem('hc_last_sync', lastSync);
    
    currentStreak++;
    localStorage.setItem('hc_streak', currentStreak);
    
    alert("STABILITY RESTORED. MONOLITH COMPLEXITY INCREASED.");
    location.reload();
}

function restartProtocol() {
    location.reload();
}
