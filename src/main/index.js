const { app, ipcMain } = require('electron');
const WindowManager = require('./window');
const TrayManager = require('./tray');
const config = require('./config');

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
