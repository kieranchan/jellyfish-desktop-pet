const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    getConfig: () => ipcRenderer.invoke('get-config'),
    getScreenSize: () => ipcRenderer.sendSync('get-screen-size'),
    sendBehaviorStatus: (enabled) => ipcRenderer.send('behavior-status-changed', enabled),

    // 多宠物控制（新）
    addPet: () => ipcRenderer.send('add-pet'),
    removePet: () => ipcRenderer.send('remove-pet'),

    onToggleBehavior: (handler) => {
        const listener = () => handler();
        ipcRenderer.on('toggle-behavior', listener);
        return () => {
            ipcRenderer.removeListener('toggle-behavior', listener);
        };
    },

    // 监听添加/移除宠物事件
    onAddPet: (handler) => {
        const listener = () => handler();
        ipcRenderer.on('add-pet-request', listener);
        return () => ipcRenderer.removeListener('add-pet-request', listener);
    },
    onRemovePet: (handler) => {
        const listener = () => handler();
        ipcRenderer.on('remove-pet-request', listener);
        return () => ipcRenderer.removeListener('remove-pet-request', listener);
    },

    // 用于测试：把 renderer 内存报告发到 main 写文件
    reportMemory: (data) => ipcRenderer.send('report-memory', data)
});
