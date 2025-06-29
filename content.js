// Внедряем CSS при загрузке
const cssPath = chrome.runtime.getURL('injected/filter.css');
const link = document.createElement('link');
link.id = 'vibe-filter-css';
link.rel = 'stylesheet';
link.type = 'text/css';
link.href = cssPath;
document.head.appendChild(link);

// Применяем фильтры сразу при загрузке страницы
function applySavedFilters() {
    chrome.storage.local.get(['vibeFilterSettings'], (result) => {
        const defaults = { grayscale: 0, brightness: 1, sepia: 0, hueRotate: 0 };
        const settings = result.vibeFilterSettings || defaults;
        updateFilter(settings);
    });
}

// Запускаем при загрузке
applySavedFilters();

// Также применяем при навигации (если страница динамическая)
chrome.runtime.onMessage.addListener((request) => {
    if (request.action === "updateFilter") {
        updateFilter(request.settings);
    }
});

function updateFilter(settings) {
    const filterValue = `
        grayscale(${settings.grayscale}) 
        brightness(${settings.brightness}) 
        sepia(${settings.sepia}) 
        hue-rotate(${settings.hueRotate}deg)
        saturate(${settings.saturate}%)
    `.trim().replace(/\s+/g, ' ');

    // Применяем ко всем canvas и их родительским div
    document.querySelectorAll('canvas').forEach(canvas => {
        canvas.style.filter = filterValue;
        canvas.style.webkitFilter = filterValue;

        // Также применяем к родительскому div, если он есть
        const parentDiv = canvas.closest('div');
        if (parentDiv) {
            parentDiv.style.filter = filterValue;
            parentDiv.style.webkitFilter = filterValue;
        }
    });

    console.log('Applied filter:', filterValue);
}

const observer = new MutationObserver(() => {
    const canvases = document.querySelectorAll('canvas');
    if (canvases.length > 0) {
        applySavedFilters();
        observer.disconnect();
    }
});

observer.observe(document.body, { childList: true, subtree: true });

// Слушаем обновления
chrome.runtime.onMessage.addListener((request) => {
    if (request.action === "updateFilter") {
        updateFilter(request.settings);
    }
});