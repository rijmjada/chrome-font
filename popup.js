document.addEventListener('DOMContentLoaded', () => {

  const fontSelect = document.getElementById('font-family');
  const fontWeightRange = document.getElementById('font-weight');
  let applyButton = document.getElementById('apply-btn');


  applyButton.addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      let tab = tabs[0];
      const fontFamily = fontSelect.value;
      const fontWeight = fontWeightRange.value;

      let data = {
        fontFamily: fontFamily,
        fontWeight: fontWeight,
      };

      chrome.runtime.sendMessage({ action: 'applyStyles', tab, data });

    });
  });

  // Obtener las fuentes disponibles y actualizar la lista desplegable
  chrome.fontSettings.getFontList(function (fontList) {
    for (const font of fontList) {
      const option = document.createElement('option');
      option.text = font.displayName;
      option.value = font.fontId;
      fontSelect.appendChild(option);
    }
  });

});
