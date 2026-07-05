// ==========================================
// Yandex Music Mod ny Yalkee (Web Extension)
// ==========================================

const style = document.createElement('style');
style.id = 'yalkee-mod-style';
style.textContent = `
  body:not(.show-glow) [class*="DefaultLayout_rootNewVibe"] {
    --vibe-gradient-stop-0: transparent !important;
    --vibe-gradient-stop-1: transparent !important;
    --vibe-gradient-stop-2: transparent !important;
    --vibe-gradient-stop-3: transparent !important;
    --vibe-gradient-stop-4: transparent !important;
    --vibe-gradient-stop-5: transparent !important;
    --vibe-gradient-stop-6: transparent !important;
    --vibe-gradient-stop-7: transparent !important;
    --vibe-gradient-stop-8: transparent !important;
    --vibe-gradient-stop-9: transparent !important;
    --vibe-gradient-stop-10: transparent !important;
    --vibe-gradient-stop-11: transparent !important;
    --vibe-gradient-stop-12: transparent !important;
    --vibe-gradient-stop-13: transparent !important;
    --vibe-gradient-stop-14: transparent !important;
    --vibe-gradient-stop-15: transparent !important;
    --vibe-gradient-stop-16: transparent !important;
    --vibe-gradient-stop-17: transparent !important;
    --vibe-gradient-stop-18: transparent !important;
    --vibe-gradient-stop-19: transparent !important;
    --vibe-gradient-stop-20: transparent !important;
  }

  [class*="VibeResetButton_root"],
  [class*="MainPage_actionsBar"] {
    display: none !important;
  }

  [class*="VibeWidgetAnimation_root"] canvas {
    display: none !important;
  }

  body.show-canvas [class*="VibeWidgetAnimation_root"] canvas {
    display: block !important;
  }

  [class*="VibePage_words"] {
    display: none !important;
  }

  [class*="VibePage_playerBlock"] {
    height: auto !important;
    flex-basis: auto !important;
  }

  body.minimal-mode [class*="VibePage_root"] > *:not([class*="Navbar_root"]):not([class*="VibePage_meta"]),
  body.minimal-mode [class*="Navbar_root"] {
    display: none !important;
  }
`;
document.head.appendChild(style);

let settings = {
  showCanvas: false,
  showGlow: false,
  minimalMode: false,
  grayscale: 0,
  brightness: 1,
  sepia: 0,
  hueRotate: 0,
  saturate: 100
};

function applySettings() {
  document.body.classList.toggle('show-canvas', settings.showCanvas);
  document.body.classList.toggle('show-glow', settings.showGlow);
  document.body.classList.toggle('minimal-mode', settings.minimalMode);

  const filterValue = `grayscale(${settings.grayscale}) brightness(${settings.brightness}) sepia(${settings.sepia}) hue-rotate(${settings.hueRotate}deg) saturate(${settings.saturate}%)`;
  document.querySelectorAll('canvas').forEach(canvas => {
    canvas.style.filter = filterValue;
    canvas.style.webkitFilter = filterValue;
    const parentDiv = canvas.closest('div');
    if (parentDiv) {
      parentDiv.style.filter = filterValue;
      parentDiv.style.webkitFilter = filterValue;
    }
  });
}

function saveSettings() {
  chrome.storage.local.set({ vibeFilterSettings: settings });
}

chrome.storage.local.get('vibeFilterSettings', (result) => {
  if (result.vibeFilterSettings) {
    settings = { ...settings, ...result.vibeFilterSettings };
  }
  applySettings();
});

chrome.runtime.onMessage.addListener((request) => {
  if (request.action === 'updateSettings') {
    settings = { ...settings, ...request.settings };
    applySettings();
    saveSettings();
  }
});

const observer = new MutationObserver(() => applySettings());
observer.observe(document.body, { childList: true, subtree: true });