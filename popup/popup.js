document.addEventListener('DOMContentLoaded', function () {
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
    const hideMyWaveLabel = document.getElementById('hideMyWaveLabel');
    const hideFeedback = document.getElementById('hideFeedback');

    function updateDisplay() {
        grayscaleVal.textContent = grayscaleSlider.value;
        brightnessVal.textContent = brightnessSlider.value;
        sepiaVal.textContent = sepiaSlider.value;
        hueVal.textContent = hueSlider.value + '°';
        saturateVal.textContent = saturateSlider.value + '%';
    }

    function buildSettings() {
        return {
            grayscale: parseFloat(grayscaleSlider.value),
            brightness: parseFloat(brightnessSlider.value),
            sepia: parseFloat(sepiaSlider.value),
            hueRotate: parseInt(hueSlider.value),
            saturate: parseFloat(saturateSlider.value),
            hideCanvas: hideCanvas.checked,
            hideGlow: hideGlow.checked,
            hideMyWaveLabel: hideMyWaveLabel.checked,
            hideFeedback: hideFeedback.checked
        };
    }

    function saveAndSend() {
        const settings = buildSettings();
        chrome.storage.local.set({ vibeFilterSettings: settings }, () => {
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                if (tabs[0]) {
                    chrome.tabs.sendMessage(tabs[0].id, {
                        action: 'updateSettings',
                        settings: settings
                    }).catch(() => { });
                }
            });
        });
    }

    chrome.storage.local.get('vibeFilterSettings', (result) => {
        const defaults = {
            grayscale: 0,
            brightness: 1,
            sepia: 0,
            hueRotate: 0,
            saturate: 100,
            hideCanvas: false,
            hideGlow: false,
            hideMyWaveLabel: false,
            hideFeedback: false
        };
        const s = result.vibeFilterSettings || defaults;

        grayscaleSlider.value = s.grayscale;
        brightnessSlider.value = s.brightness;
        sepiaSlider.value = s.sepia;
        hueSlider.value = s.hueRotate;
        saturateSlider.value = s.saturate;
        hideCanvas.checked = s.hideCanvas || false;
        hideGlow.checked = s.hideGlow || false;
        hideMyWaveLabel.checked = s.hideMyWaveLabel || false;
        hideFeedback.checked = s.hideFeedback || false;

        updateDisplay();

        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs[0]) {
                chrome.tabs.sendMessage(tabs[0].id, {
                    action: 'updateSettings',
                    settings: buildSettings()
                }).catch(() => { });
            }
        });
    });

    [grayscaleSlider, brightnessSlider, sepiaSlider, hueSlider, saturateSlider].forEach(el => {
        el.addEventListener('input', () => {
            updateDisplay();
            saveAndSend();
        });
    });

    [hideCanvas, hideGlow, hideMyWaveLabel, hideFeedback].forEach(el => {
        el.addEventListener('change', saveAndSend);
    });

    document.getElementById('normal-btn').addEventListener('click', () => {
        grayscaleSlider.value = 0;
        brightnessSlider.value = 1;
        sepiaSlider.value = 0;
        hueSlider.value = 0;
        saturateSlider.value = 100;
        hideCanvas.checked = false;
        hideGlow.checked = false;
        hideMyWaveLabel.checked = false;
        hideFeedback.checked = false;
        updateDisplay();
        saveAndSend();
    });

    document.getElementById('bw-btn').addEventListener('click', () => {
        grayscaleSlider.value = 1;
        brightnessSlider.value = 0.75;
        sepiaSlider.value = 0;
        hueSlider.value = 0;
        saturateSlider.value = 100;
        updateDisplay();
        saveAndSend();
    });

    document.getElementById('sepia-btn').addEventListener('click', () => {
        grayscaleSlider.value = 0.5;
        brightnessSlider.value = 0.65;
        sepiaSlider.value = 1;
        hueSlider.value = 0;
        saturateSlider.value = 100;
        updateDisplay();
        saveAndSend();
    });

    document.getElementById('hue-btn').addEventListener('click', () => {
        grayscaleSlider.value = 0;
        brightnessSlider.value = 1;
        sepiaSlider.value = 0;
        hueSlider.value = 200;
        saturateSlider.value = 100;
        updateDisplay();
        saveAndSend();
    });
});