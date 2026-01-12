const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    getConfig: () => ipcRenderer.invoke('get-config'),
    getScreenSize: () => ipcRenderer.sendSync('get-screen-size'),
    sendBehaviorStatus: (enabled) => ipcRenderer.send('behavior-status-changed', enabled),
    onToggleBehavior: (handler) => {
        const listener = () => handler();
        ipcRenderer.on('toggle-behavior', listener);
        return () => {
            ipcRenderer.removeListener('toggle-behavior', listener);
        };
    }
});
