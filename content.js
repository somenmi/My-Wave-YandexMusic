const style = document.createElement('style');
style.id = 'vibe-hider-style';
style.textContent = `
  body.hide-canvas canvas { display: none !important; }

  body.hide-glow .DefaultLayout_rootNewVibe__MSDOn {
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

  body.hide-my-wave-label .VibeResetButton_root__ju8pE { display: none !important; }

  body.hide-feedback .MainPage_actionsBar__agoxp { display: none !important; }
`;
document.head.appendChild(style);

function applySettings(settings) {
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

    document.body.classList.toggle('hide-canvas', settings.hideCanvas);
    document.body.classList.toggle('hide-glow', settings.hideGlow);
    document.body.classList.toggle('hide-my-wave-label', settings.hideMyWaveLabel);
    document.body.classList.toggle('hide-feedback', settings.hideFeedback);
}

chrome.storage.local.get('vibeFilterSettings', (result) => {
    const defaults = {
        grayscale: 0, brightness: 1, sepia: 0, hueRotate: 0, saturate: 100,
        hideCanvas: false, hideGlow: false,
        hideMyWaveLabel: false, hideFeedback: false
    };
    applySettings(result.vibeFilterSettings || defaults);
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'updateSettings') {
        applySettings(request.settings);
        chrome.storage.local.set({ vibeFilterSettings: request.settings });
    }
});

const observer = new MutationObserver(() => {
    chrome.storage.local.get('vibeFilterSettings', (result) => {
        const defaults = {
            grayscale: 0, brightness: 1, sepia: 0, hueRotate: 0, saturate: 100,
            hideCanvas: false, hideGlow: false,
            hideMyWaveLabel: false, hideFeedback: false
        };
        applySettings(result.vibeFilterSettings || defaults);
    });
});
observer.observe(document.body, { childList: true, subtree: true });