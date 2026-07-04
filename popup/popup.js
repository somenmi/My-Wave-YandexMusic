document.addEventListener('DOMContentLoaded', () => {
    const grayscaleSlider = document.getElementById('grayscale');
    const brightnessSlider = document.getElementById('brightness');
    const sepiaSlider = document.getElementById('sepia');
    const hueSlider = document.getElementById('hue-rotate');
    const saturateSlider = document.getElementById('saturate');

    const grayscaleVal = document.getElementById('grayscale-val');
    const brightnessVal = document.getElementById('brightness-val');
    const sepiaVal = document.getElementById('sepia-val');
    const hueVal = document.getElementById('hue-val');
    const saturateVal = document.getElementById('saturate-val');

    const hideCanvas = document.getElementById('hideCanvas');
    const hideGlow = document.getElementById('hideGlow');
    const minimalMode = document.getElementById('minimalMode');
    const masterToggle = document.getElementById('masterToggle');

    function updateDisplay() {
        grayscaleVal.textContent = grayscaleSlider.value;
        brightnessVal.textContent = brightnessSlider.value;
        sepiaVal.textContent = sepiaSlider.value;
        hueVal.textContent = hueSlider.value + '°';
        saturateVal.textContent = saturateSlider.value + '%';
    }

    function buildSettings() {
        return {
            showCanvas: !hideCanvas.checked,
            showGlow: !hideGlow.checked,
            minimalMode: minimalMode.checked,
            grayscale: parseFloat(grayscaleSlider.value),
            brightness: parseFloat(brightnessSlider.value),
            sepia: parseFloat(sepiaSlider.value),
            hueRotate: parseInt(hueSlider.value),
            saturate: parseFloat(saturateSlider.value)
        };
    }

    function saveAndSend() {
        const settings = buildSettings();
        chrome.storage.local.set({ vibeFilterSettings: settings }, () => {
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                if (tabs[0]) chrome.tabs.sendMessage(tabs[0].id, { action: 'updateSettings', settings }).catch(() => { });
            });
        });
    }

    function loadSettings() {
        chrome.storage.local.get('vibeFilterSettings', (result) => {
            const s = result.vibeFilterSettings || {};
            grayscaleSlider.value = s.grayscale ?? 0;
            brightnessSlider.value = s.brightness ?? 1;
            sepiaSlider.value = s.sepia ?? 0;
            hueSlider.value = s.hueRotate ?? 0;
            saturateSlider.value = s.saturate ?? 100;
            hideCanvas.checked = !(s.showCanvas ?? false);
            hideGlow.checked = !(s.showGlow ?? false);
            minimalMode.checked = s.minimalMode ?? false;
            updateDisplay();
        });
    }

    loadSettings();

    [grayscaleSlider, brightnessSlider, sepiaSlider, hueSlider, saturateSlider].forEach(el => {
        el.addEventListener('input', () => { updateDisplay(); saveAndSend(); });
    });
    [hideCanvas, hideGlow, minimalMode].forEach(el => {
        el.addEventListener('change', saveAndSend);
    });

    masterToggle.addEventListener('click', () => {
        hideCanvas.checked = !hideCanvas.checked;
        hideGlow.checked = !hideGlow.checked;
        minimalMode.checked = !minimalMode.checked;
        saveAndSend();
    });

    document.getElementById('normal-btn').addEventListener('click', () => {
        grayscaleSlider.value = 0; brightnessSlider.value = 1; sepiaSlider.value = 0; hueSlider.value = 0; saturateSlider.value = 100;
        hideCanvas.checked = false; hideGlow.checked = false; minimalMode.checked = false;
        updateDisplay(); saveAndSend();
    });
    document.getElementById('bw-btn').addEventListener('click', () => {
        grayscaleSlider.value = 1; brightnessSlider.value = 0.75; sepiaSlider.value = 0; hueSlider.value = 0; saturateSlider.value = 100;
        updateDisplay(); saveAndSend();
    });
    document.getElementById('sepia-btn').addEventListener('click', () => {
        grayscaleSlider.value = 0.5; brightnessSlider.value = 0.65; sepiaSlider.value = 1; hueSlider.value = 0; saturateSlider.value = 100;
        updateDisplay(); saveAndSend();
    });
    document.getElementById('hue-btn').addEventListener('click', () => {
        grayscaleSlider.value = 0; brightnessSlider.value = 1; sepiaSlider.value = 0; hueSlider.value = 200; saturateSlider.value = 100;
        updateDisplay(); saveAndSend();
    });
});