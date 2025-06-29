document.addEventListener('DOMContentLoaded', function () {
    chrome.storage.local.get(['vibeFilterSettings'], (result) => {
        const settings = result.vibeFilterSettings || {
            grayscale: 0,
            brightness: 1,
            sepia: 0,
            hueRotate: 0
        };

        // Устанавливаем значения ползунков
        grayscaleSlider.value = settings.grayscale;
        brightnessSlider.value = settings.brightness;
        sepiaSlider.value = settings.sepia;
        hueSlider.value = settings.hueRotate;

        updateDisplay();
    });

    // Получаем элементы
    const grayscaleSlider = document.getElementById('grayscale');
    const brightnessSlider = document.getElementById('brightness');
    const sepiaSlider = document.getElementById('sepia');
    const hueSlider = document.getElementById('hue-rotate');
    const saturateSlider = document.getElementById('saturate');

    const grayscaleValue = document.getElementById('grayscale-value');
    const brightnessValue = document.getElementById('brightness-value');
    const sepiaValue = document.getElementById('sepia-value');
    const hueValue = document.getElementById('hue-rotate-value');
    const saturateValue = document.getElementById('saturate-value');

    // Функция обновления значений
    function updateDisplay() {
        grayscaleValue.textContent = grayscaleSlider.value;
        brightnessValue.textContent = brightnessSlider.value;
        sepiaValue.textContent = sepiaSlider.value;
        hueValue.textContent = hueSlider.value + '°';
        saturateValue.textContent = saturateSlider.value + '%';
    }

    // Функция отправки настроек
    function sendSettings() {
        const settings = {
            grayscale: grayscaleSlider.value,
            brightness: brightnessSlider.value,
            sepia: sepiaSlider.value,
            hueRotate: hueSlider.value,
            saturate: saturateSlider.value
        };

        chrome.storage.local.set({ vibeFilterSettings: settings });

        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            if (tabs.length === 0) return;

            chrome.tabs.sendMessage(tabs[0].id, {
                action: "updateFilter",
                settings: settings
            }).catch(error => {
                console.error('Message sending failed:', error);
            });
        });
    }

    // Функция для сохранения настроек
    function saveSettings() {
        const settings = {
            grayscale: grayscaleSlider.value,
            brightness: brightnessSlider.value,
            sepia: sepiaSlider.value,
            hueRotate: hueSlider.value,
            saturate: saturateSlider.value
        };

        // Сохраняем в chrome.storage.local
        chrome.storage.local.set({ vibeFilterSettings: settings }, () => {
            console.log('Настройки сохранены:', settings);
        });
    }

    // Вызываем saveSettings при изменении ползунков
    grayscaleSlider.addEventListener('input', () => {
        updateDisplay();
        saveSettings();  // Сохраняем автоматически
    });

    brightnessSlider.addEventListener('input', () => {
        updateDisplay();
        saveSettings();
    });

    sepiaSlider.addEventListener('input', () => {
        updateDisplay();
        saveSettings();
    });

    hueSlider.addEventListener('input', () => {
        updateDisplay();
        saveSettings();
    });

    saturateSlider.addEventListener('input', () => {
        updateDisplay();
        saveSettings();
    });

    // Загрузка сохранённых настроек
    chrome.storage.local.get(['vibeFilterSettings'], function (result) {
        const defaults = { grayscale: 0, brightness: 1, sepia: 0, hueRotate: 0, saturate: 100 };
        const settings = result.vibeFilterSettings || defaults;

        grayscaleSlider.value = settings.grayscale;
        brightnessSlider.value = settings.brightness;
        sepiaSlider.value = settings.sepia;
        hueSlider.value = settings.hueRotate;
        saturateSlider.value = settings.saturate;

        updateDisplay();
        sendSettings(); // Применяем сохранённые настройки сразу после загрузки
    });

    // Обработчики событий
    grayscaleSlider.addEventListener('input', function () {
        updateDisplay();
        sendSettings();
    });

    brightnessSlider.addEventListener('input', function () {
        updateDisplay();
        sendSettings();
    });

    sepiaSlider.addEventListener('input', function () {
        updateDisplay();
        sendSettings();
    });

    hueSlider.addEventListener('input', function () {
        updateDisplay();
        sendSettings();
    });

    saturateSlider.addEventListener('input', function () {
        updateDisplay();
        sendSettings();
    });

    // Пресеты
    document.getElementById('normal-btn').addEventListener('click', function () {
        grayscaleSlider.value = 0;
        brightnessSlider.value = 1;
        sepiaSlider.value = 0;
        hueSlider.value = 0;
        saturateSlider.value = 100;
        updateDisplay();
        sendSettings();
    });

    document.getElementById('bw-btn').addEventListener('click', function () {
        grayscaleSlider.value = 1;
        brightnessSlider.value = 0.75;
        sepiaSlider.value = 0;
        hueSlider.value = 0;
        saturateSlider.value = 100;
        updateDisplay();
        sendSettings();
    });

    document.getElementById('sepia-btn').addEventListener('click', function () {
        grayscaleSlider.value = 0.5;
        brightnessSlider.value = 0.65;
        sepiaSlider.value = 1;
        hueSlider.value = 0;
        saturateSlider.value = 100;
        updateDisplay();
        sendSettings();
    });

    document.getElementById('hue-btn').addEventListener('click', function () {
        grayscaleSlider.value = 0;
        brightnessSlider.value = 1;
        sepiaSlider.value = 0;
        hueSlider.value = 200;
        saturateSlider.value = 100;
        updateDisplay();
        sendSettings();
    });
});