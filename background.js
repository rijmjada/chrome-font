

// Escucha el evento onUpdated para detectar cambios en las pestañas
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {

    // Evita que se intente aplicar los estilos en la galeria de chrome, ya que la misma lo restringe
    if (tab.url?.startsWith("chrome://") || tab.url?.startsWith('https://chrome')) return;

    if (changeInfo.status === 'complete' && tab.active) {
        chrome.storage.sync.get(['fontFamily', 'fontWeight'], function (data) {
            if (data) {
                applyStylesToActiveTab({ data, tab });
            }
        });
    }
});


// Función para aplicar los estilos en la pestaña activa
function applyStylesToActiveTab({ data, tab }) {
    chrome.scripting.insertCSS({
        target: { tabId: tab.id },
        css: '* { font-family: ' + data.fontFamily + ' !important; font-weight: ' + data.fontWeight + ' !important ; }'
    });
    saveFontFamily(data);
}


function saveFontFamily(data) {
    // Guardar los datos en el almacenamiento de configuración de Chrome
    chrome.storage.sync.set(data, () => {
        console.log('Datos guardados en el almacenamiento de configuración de Chrome.');
    });
}

// Escucha el evento onMessage para recibir mensajes de la página popup.js
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    
    // Evita que se intente aplicar los estilos en la galeria de chrome, ya que la misma lo restringe
    if (request.tab.url?.startsWith("chrome://") || request.tab.url?.startsWith('https://chrome')) return;

    if (request.action === 'applyStyles') {
        applyStylesToActiveTab(request);
    }
});

