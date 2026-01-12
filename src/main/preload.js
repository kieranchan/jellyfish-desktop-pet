const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    getConfig: () => ipcRenderer.invoke('get-config'),
    getScreenSize: () => ipcRenderer.sendSync('get-screen-size'),
    onToggleBehavior: (handler) => {
        const listener = () => handler();
        ipcRenderer.on('toggle-behavior', listener);
        return () => {
            ipcRenderer.removeListener('toggle-behavior', listener);
        };
    }
});
