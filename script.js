// Premium QR Code Generator Engine
let qrInstance = null;
let currentLogoType = 'none'; // 'none', 'instagram', 'twitter', 'youtube', 'github', 'linkedin', 'spotify', 'star', 'custom'
let customLogoSrc = null;
let history = JSON.parse(localStorage.getItem('qreator_history') || '[]');
let currentApiKey = localStorage.getItem('qreator_api_key') || '';

// Preset SVG Logos for high-fidelity rendering on canvas
const PRESET_LOGOS = {
    instagram: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#e1306c" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>`,
    twitter: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#000000"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`,
    youtube: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#ff0000"><path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.517 3.545 12 3.545 12 3.545s-7.517 0-9.388.507a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.871.507 9.388.507 9.388.507s7.517 0 9.388-.507a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>`,
    github: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#000000"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>`,
    linkedin: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#0077b5"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>`,
    spotify: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#1ed760"><path d="M12.012 0C5.398 0 .024 5.374.024 11.99c0 6.625 5.374 12.01 11.988 12.01 6.625 0 11.99-5.385 11.99-12.01C24.002 5.374 18.637 0 12.012 0zm5.485 17.313c-.218.357-.68.474-1.03.255-2.878-1.757-6.498-2.157-10.767-1.183-.406.09-.813-.162-.905-.568-.09-.407.163-.813.57-.905 4.673-1.068 8.66-.615 11.877 1.348.35.218.465.68.255 1.03zm1.464-3.26c-.275.446-.86.592-1.303.318-3.293-2.022-8.31-2.61-12.197-1.43-.498.15-1.02-.137-1.17-.635-.15-.498.136-1.02.635-1.17 4.445-1.348 9.973-.7 13.717 1.602.446.273.593.858.318 1.315zm.127-3.385c-3.947-2.344-10.46-2.56-14.24-1.41-.606.184-1.25-.17-1.43-.777-.185-.607.17-1.25.777-1.43 4.34-1.317 11.53-1.06 16.07 1.633.546.324.725 1.03.4 1.575-.323.547-1.03.725-1.577.41z"/></svg>`,
    star: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#fbbf24"><path d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.787 1.4 8.168L12 18.896l-7.334 3.857 1.4-8.168L.132 9.21l8.2-1.192z"/></svg>`
};

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    initColorPickers();
    initEventListeners();
    generateQR();
    renderHistory();
    initApiKey();
    updatePlaygroundUrl();
});

// Tab Switching Logic
window.switchTab = function(tabName) {
    const studioTab = document.getElementById('tab-studio');
    const apiTab = document.getElementById('tab-api');
    const studioBtn = document.getElementById('tab-studio-btn');
    const apiBtn = document.getElementById('tab-api-btn');

    if (tabName === 'studio') {
        studioTab.classList.remove('hidden');
        apiTab.classList.add('hidden');
        
        studioBtn.className = "px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 bg-indigo-600 text-white shadow-md shadow-indigo-500/10";
        apiBtn.className = "px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 text-slate-400 hover:text-white";
    } else {
        studioTab.classList.add('hidden');
        apiTab.classList.remove('hidden');
        
        studioBtn.className = "px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 text-slate-400 hover:text-white";
        apiBtn.className = "px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 bg-emerald-600 text-white shadow-md shadow-emerald-500/10";
    }
};

// Sync Color Pickers and Hex Inputs
function initColorPickers() {
    const fgColor = document.getElementById('fg-color');
    const fgColorHex = document.getElementById('fg-color-hex');
    const bgColor = document.getElementById('bg-color');
    const bgColorHex = document.getElementById('bg-color-hex');

    fgColor.addEventListener('input', (e) => {
        fgColorHex.value = e.target.value.toUpperCase();
        generateQR();
    });
    fgColorHex.addEventListener('input', (e) => {
        let val = e.target.value;
        if (!val.startsWith('#')) val = '#' + val;
        if (val.length === 7) {
            fgColor.value = val;
            generateQR();
        }
    });

    bgColor.addEventListener('input', (e) => {
        bgColorHex.value = e.target.value.toUpperCase();
        generateQR();
    });
    bgColorHex.addEventListener('input', (e) => {
        let val = e.target.value;
        if (!val.startsWith('#')) val = '#' + val;
        if (val.length === 7) {
            bgColor.value = val;
            generateQR();
        }
    });
}

// Setup Event Listeners
function initEventListeners() {
    const qrText = document.getElementById('qr-text');
    qrText.addEventListener('input', () => {
        generateQR();
    });

    const logoSize = document.getElementById('logo-size');
    const logoSizeVal = document.getElementById('logo-size-val');
    logoSize.addEventListener('input', (e) => {
        logoSizeVal.textContent = `${e.target.value}%`;
        generateQR();
    });

    const logoUpload = document.getElementById('logo-upload');
    logoUpload.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                customLogoSrc = event.target.result;
                currentLogoType = 'custom';
                
                document.querySelectorAll('.logo-preset-btn').forEach(btn => btn.classList.remove('active'));
                
                const status = document.getElementById('logo-status');
                const statusText = document.getElementById('logo-status-text');
                status.classList.remove('hidden');
                statusText.textContent = `Custom logo loaded: ${file.name.substring(0, 15)}...`;
                
                generateQR();
                showToast('Custom logo uploaded successfully!');
            };
            reader.readAsDataURL(file);
        }
    });

    document.getElementById('download-png').addEventListener('click', downloadPNG);
    document.getElementById('download-svg').addEventListener('click', downloadSVG);
    document.getElementById('copy-btn').addEventListener('click', copyImageToClipboard);
}

// Set Preset Text
window.setPreset = function(text) {
    document.getElementById('qr-text').value = text;
    generateQR();
    showToast(`Preset loaded: ${text}`);
};

// Set Logo Preset
window.setLogoPreset = function(type) {
    currentLogoType = type;
    
    const buttons = document.querySelectorAll('.logo-preset-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    
    const targetBtn = Array.from(buttons).find(btn => btn.getAttribute('onclick').includes(`'${type}'`));
    if (targetBtn) {
        targetBtn.classList.add('active');
    }

    if (type !== 'custom') {
        document.getElementById('logo-status').classList.add('hidden');
    }

    generateQR();
    if (type !== 'none') {
        showToast(`Logo preset set to: ${type.toUpperCase()}`);
    }
};

// Core QR Generation & Canvas Drawing Engine
function generateQR() {
    const text = document.getElementById('qr-text').value.trim() || 'https://unsplash.com';
    const fgColor = document.getElementById('fg-color').value;
    const bgColor = document.getElementById('bg-color').value;
    const logoSizePercent = parseInt(document.getElementById('logo-size').value) / 100;

    const canvas = document.getElementById('qr-canvas');
    const ctx = canvas.getContext('2d');

    const size = 600;
    canvas.width = size;
    canvas.height = size;

    const tempCanvas = document.createElement('canvas');
    const qr = new QRious({
        element: tempCanvas,
        value: text,
        size: size,
        background: bgColor,
        foreground: fgColor,
        level: 'H'
    });

    ctx.drawImage(tempCanvas, 0, 0);

    if (currentLogoType !== 'none') {
        if (currentLogoType === 'custom' && customLogoSrc) {
            const img = new Image();
            img.onload = function() {
                drawLogoOnCanvas(ctx, img, size, logoSizePercent, bgColor);
            };
            img.src = customLogoSrc;
        } else if (PRESET_LOGOS[currentLogoType]) {
            const svgString = PRESET_LOGOS[currentLogoType];
            const svg64 = btoa(unescape(encodeURIComponent(svgString)));
            const b64Start = 'data:image/svg+xml;base64,';
            const image64 = b64Start + svg64;

            const img = new Image();
            img.onload = function() {
                drawLogoOnCanvas(ctx, img, size, logoSizePercent, bgColor);
            };
            img.src = image64;
        }
    }

    saveToHistoryDebounced(text);
}

// Draw Logo with a clean background badge
function drawLogoOnCanvas(ctx, img, canvasSize, logoSizePercent, bgColor) {
    const logoSize = canvasSize * logoSizePercent;
    const x = (canvasSize - logoSize) / 2;
    const y = (canvasSize - logoSize) / 2;

    const padding = logoSize * 0.15;
    const badgeSize = logoSize + padding * 2;
    const badgeX = x - padding;
    const badgeY = y - padding;
    const radius = badgeSize * 0.25;

    ctx.save();
    ctx.fillStyle = bgColor;
    ctx.beginPath();
    ctx.moveTo(badgeX + radius, badgeY);
    ctx.lineTo(badgeX + badgeSize - radius, badgeY);
    ctx.quadraticCurveTo(badgeX + badgeSize, badgeY, badgeX + badgeSize, badgeY + radius);
    ctx.lineTo(badgeX + badgeSize, badgeY + badgeSize - radius);
    ctx.quadraticCurveTo(badgeX + badgeSize, badgeY + badgeSize, badgeX + badgeSize - radius, badgeY + badgeSize);
    ctx.lineTo(badgeX + radius, badgeY + badgeSize);
    ctx.quadraticCurveTo(badgeX, badgeY + badgeSize, badgeX, badgeY + badgeSize - radius);
    ctx.lineTo(badgeX, badgeY + radius);
    ctx.quadraticCurveTo(badgeX, badgeY, badgeX + radius, badgeY);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = 'rgba(0,0,0,0.08)';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.drawImage(img, x, y, logoSize, logoSize);
    ctx.restore();
}

// Debounce history saving
let historyTimeout;
function saveToHistoryDebounced(text) {
    clearTimeout(historyTimeout);
    historyTimeout = setTimeout(() => {
        if (!text || text === 'https://unsplash.com') return;
        if (history.length > 0 && history[0].text === text) return;

        history = history.filter(item => item.text !== text);
        history.unshift({
            text: text,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });

        if (history.length > 5) history.pop();
        localStorage.setItem('qreator_history', JSON.stringify(history));
        renderHistory();
    }, 1500);
}

// Render History List
function renderHistory() {
    const list = document.getElementById('history-list');
    if (history.length === 0) {
        list.innerHTML = `<p class="text-xs text-slate-500 text-center py-4">No recent QR codes generated yet.</p>`;
        return;
    }

    list.innerHTML = history.map((item, index) => `
        <div class="flex items-center justify-between bg-slate-950/60 border border-slate-800/60 rounded-xl p-3 hover:border-slate-700 transition-all group">
            <div class="flex items-center gap-3 min-w-0">
                <div class="w-7 h-7 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400 flex-shrink-0">
                    <i class="fa-solid fa-link text-xs"></i>
                </div>
                <span class="text-xs text-slate-300 truncate font-medium pr-2 cursor-pointer" onclick="setPreset('${item.text}')" title="Click to load">
                    ${item.text}
                </span>
            </div>
            <div class="flex items-center gap-2 flex-shrink-0">
                <span class="text-[10px] text-slate-500 font-mono">${item.timestamp}</span>
                <button onclick="deleteHistoryItem(${index})" class="text-slate-600 hover:text-red-400 p-1 transition-colors">
                    <i class="fa-solid fa-trash-can text-xs"></i>
                </button>
            </div>
        </div>
    `).join('');
}

// Delete single history item
window.deleteHistoryItem = function(index) {
    history.splice(index, 1);
    localStorage.setItem('qreator_history', JSON.stringify(history));
    renderHistory();
    showToast('History item removed.');
};

// Clear all history
window.clearHistory = function() {
    history = [];
    localStorage.removeItem('qreator_history');
    renderHistory();
    showToast('History cleared.');
};

// Download PNG
function downloadPNG() {
    const canvas = document.getElementById('qr-canvas');
    const link = document.createElement('a');
    link.download = 'qreator-qr-code.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
    showToast('PNG downloaded successfully!');
}

// Download SVG
function downloadSVG() {
    const canvas = document.getElementById('qr-canvas');
    const dataUrl = canvas.toDataURL('image/png');
    
    const svgString = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="100%" height="100%">
        <image href="${dataUrl}" x="0" y="0" width="600" height="600" />
    </svg>`;

    const blob = new Blob([svgString], { type: 'image/svg+xml' });
    const link = document.createElement('a');
    link.download = 'qreator-qr-code.svg';
    link.href = URL.createObjectURL(blob);
    link.click();
    showToast('SVG Vector downloaded successfully!');
}

// Copy Image to Clipboard
async function copyImageToClipboard() {
    const canvas = document.getElementById('qr-canvas');
    try {
        canvas.toBlob(async (blob) => {
            if (blob) {
                await navigator.clipboard.write([
                    new ClipboardItem({ 'image/png': blob })
                ]);
                showToast('QR Code copied to clipboard!');
            }
        }, 'image/png');
    } catch (err) {
        showToast('Failed to copy. Try downloading instead.', true);
    }
}

// API Key Management
function initApiKey() {
    const apiKeyInput = document.getElementById('api-key-input');
    if (!currentApiKey) {
        generateNewApiKey(false);
    } else {
        apiKeyInput.value = currentApiKey;
    }
}

window.generateNewApiKey = function(notify = true) {
    const randomBytes = new Uint8Array(16);
    window.crypto.getRandomValues(randomBytes);
    const key = 'qr_live_' + Array.from(randomBytes, byte => byte.toString(16).padStart(2, '0')).join('');
    
    currentApiKey = key;
    localStorage.setItem('qreator_api_key', key);
    
    const apiKeyInput = document.getElementById('api-key-input');
    if (apiKeyInput) {
        apiKeyInput.value = key;
    }
    
    updatePlaygroundUrl();
    if (notify) {
        showToast('New API Key generated successfully!');
    }
};

window.copyApiKey = function() {
    const apiKeyInput = document.getElementById('api-key-input');
    if (apiKeyInput && apiKeyInput.value) {
        navigator.clipboard.writeText(apiKeyInput.value);
        showToast('API Key copied to clipboard!');
    }
};

// API Playground Logic
window.updatePlaygroundUrl = function() {
    const text = encodeURIComponent(document.getElementById('api-play-text').value || 'https://google.com');
    const fg = document.getElementById('api-play-fg').value || '0f172a';
    const logo = document.getElementById('api-play-logo').value || 'none';
    const key = currentApiKey || 'YOUR_API_KEY';

    const url = `https://api.qreator.studio/v1/generate?apikey=${key}&text=${text}&color=${fg}&logo=${logo}`;
    document.getElementById('api-generated-url').textContent = url;
};

window.copyPlaygroundUrl = function() {
    const url = document.getElementById('api-generated-url').textContent;
    navigator.clipboard.writeText(url);
    showToast('API Request URL copied!');
};

// Code Tab Switching
window.switchCodeTab = function(lang) {
    document.querySelectorAll('.code-block').forEach(block => block.classList.add('hidden'));
    document.getElementById(`code-block-${lang}`).classList.remove('hidden');

    const tabs = ['js', 'python', 'flutter'];
    tabs.forEach(t => {
        const tabBtn = document.getElementById(`code-tab-${t}`);
        if (t === lang) {
            tabBtn.className = "px-4 py-2 text-xs font-bold border-b-2 border-indigo-500 text-white";
        } else {
            tabBtn.className = "px-4 py-2 text-xs font-bold border-b-2 border-transparent text-slate-400 hover:text-white";
        }
    });
};

window.copyCode = function(blockId) {
    const codeText = document.querySelector(`#${blockId} code`).textContent;
    navigator.clipboard.writeText(codeText);
    showToast('Code snippet copied!');
};

// Toast Notification System
function showToast(message, isError = false) {
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toast-msg');
    const icon = toast.querySelector('i');

    toastMsg.textContent = message;
    if (isError) {
        icon.className = 'fa-solid fa-circle-exclamation text-red-400';
    } else {
        icon.className = 'fa-solid fa-circle-check text-emerald-400';
    }

    toast.classList.add('toast-show');
    setTimeout(() => {
        toast.classList.remove('toast-show');
    }, 3000);
}