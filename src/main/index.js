const { app, ipcMain } = require('electron');
const fs = require('fs');
const path = require('path');
const WindowManager = require('./window');
const TrayManager = require('./tray');
const config = require('./config');

const MEM_LOG_PATH = path.join(__dirname, '..', '..', 'memory_test.log');

class Application {
    constructor() {
        this.windowManager = null;
        this.trayManager = null;

        // 在构造函数中立即注册 IPC handlers
        this.registerIPC();
    }

    async init() {
        console.log('Water Jellyfish Pet is starting...');

        // 创建窗口管理器
        this.windowManager = new WindowManager();
        await this.windowManager.createMainWindow();

        // 创建系统托盘
        if (config.enableTray) {
            this.trayManager = new TrayManager(this.windowManager);
        }

        console.log('Water Jellyfish Pet started successfully!');

        // 主进程内存监控（每 15 秒，记录到文件 + console，便于长期观察是否泄漏）
        const memInterval = setInterval(() => {
            const mem = process.memoryUsage();
            const rssMB = (mem.rss / 1024 / 1024).toFixed(1);
            const heapUsedMB = (mem.heapUsed / 1024 / 1024).toFixed(1);
            const heapTotalMB = (mem.heapTotal / 1024 / 1024).toFixed(1);
            const externalMB = (mem.external / 1024 / 1024).toFixed(1);

            const logLine = `[${new Date().toISOString()}] [MAIN] RSS:${rssMB}MB heapUsed:${heapUsedMB}MB heapTotal:${heapTotalMB}MB external:${externalMB}MB`;

            console.log(`[MAIN MEMORY] RSS: ${rssMB} MB | HeapUsed: ${heapUsedMB} MB`);

            try {
                fs.appendFileSync(MEM_LOG_PATH, logLine + '\n');
            } catch (e) {
                // ignore file write errors during test
            }
        }, 15000);

        // 应用退出时清理
        app.on('before-quit', () => {
            clearInterval(memInterval);
        });
    }

    registerIPC() {
        // 获取配置 - 这个必须最先注册
        ipcMain.handle('get-config', async () => {
            console.log('IPC: get-config called');
            return config;
        });

        // 保存配置
        ipcMain.handle('save-config', async (event, newConfig) => {
            Object.assign(config, newConfig);
            // TODO: 持久化保存到文件
            return true;
        });

        // 设置鼠标穿透
        ipcMain.on('set-ignore-mouse-events', (event, ignore, options) => {
            if (this.windowManager) {
                this.windowManager.setIgnoreMouseEvents(ignore, options);
            }
        });

        // 移动窗口
        ipcMain.on('move-window', (event, x, y) => {
            if (this.windowManager) {
                this.windowManager.moveWindow(x, y);
            }
        });

        // 获取屏幕尺寸
        ipcMain.on('get-screen-size', (event) => {
            if (this.windowManager) {
                event.returnValue = this.windowManager.getScreenSize();
            } else {
                event.returnValue = { width: 1920, height: 1080 };
            }
        });

        // 退出应用
        ipcMain.on('quit-app', () => {
            app.quit();
        });

        // 隐藏窗口
        ipcMain.on('hide-window', () => {
            if (this.windowManager) {
                this.windowManager.hide();
            }
        });

        // 显示窗口
        ipcMain.on('show-window', () => {
            if (this.windowManager) {
                this.windowManager.show();
            }
        });

        // 更新行为状态以同步托盘菜单
        ipcMain.on('behavior-status-changed', (event, behaviorEnabled) => {
            if (this.trayManager) {
                this.trayManager.updateContextMenu(behaviorEnabled);
            }
        });

        // 多宠物控制 IPC
        ipcMain.on('add-pet', (event) => {
            if (this.windowManager && this.windowManager.mainWindow) {
                this.windowManager.mainWindow.webContents.send('add-pet-request');
            }
        });

        ipcMain.on('remove-pet', (event) => {
            if (this.windowManager && this.windowManager.mainWindow) {
                this.windowManager.mainWindow.webContents.send('remove-pet-request');
            }
        });

        // 测试用：接收 renderer 内存报告并写文件 + console（便于观察）
        ipcMain.on('report-memory', (event, data) => {
            try {
                const line = `[${new Date().toISOString()}] [RENDERER] pets:${data.pets || '?'} usedJSHeap:${data.usedMB || '?'}MB total:${data.totalMB || '?'}MB`;
                fs.appendFileSync(MEM_LOG_PATH, line + '\n');
                console.log(`[RENDERER MEMORY via IPC] Pets:${data.pets} Heap:${data.usedMB}MB / ${data.totalMB}MB`);
            } catch (e) {}
        });

        console.log('IPC handlers registered');
    }

    setupAppEvents() {
        app.on('window-all-closed', () => {
            // macOS keep app running
            if (process.platform !== 'darwin') {
                app.quit();
            }
        });

        app.on('activate', () => {
            if (!this.windowManager || !this.windowManager.mainWindow) {
                this.init();
            } else {
                this.windowManager.show();
            }
        });

        app.on('before-quit', () => {
            console.log('Water Jellyfish Pet is quitting...');
        });
    }
}

// 创建应用实例（这会立即注册 IPC handlers）
const application = new Application();

// 等待 app ready 后初始化窗口
app.whenReady().then(() => {
    application.init();
    application.setupAppEvents();
});

// 处理未捕获的异常
process.on('uncaughtException', (error) => {
    console.error('Uncaught exception:', error);
});

module.exports = application;
