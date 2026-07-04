chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({
    vibeFilterSettings: {
      grayscale: 0,
      brightness: 1,
      sepia: 0,
      hueRotate: 0,
      saturate: 100,
      hideCanvas: true,
      hideGlow: true,
      hideMyWaveLabel: true,
      hideFeedback: true
    }
  });
});