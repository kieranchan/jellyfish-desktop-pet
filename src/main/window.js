const { BrowserWindow, screen } = require('electron');
const path = require('path');
const config = require('./config');

class WindowManager {
    constructor() {
        this.mainWindow = null;
    }

    async createMainWindow() {
        const display = screen.getPrimaryDisplay();
        const { width, height } = display.workAreaSize;
        const { x, y } = display.bounds;

        // 全屏透明窗口配置
        const windowOptions = {
            width: width,
            height: height,
            x: x,
            y: y,
            transparent: true,
            frame: false,
            alwaysOnTop: true,
            skipTaskbar: true,  // 不显示在任务栏
            resizable: false,
            hasShadow: false,
            focusable: false,  // 不接受焦点
            show: false,
            webPreferences: {
                nodeIntegration: false,
                contextIsolation: true,
                enableRemoteModule: false,
                preload: path.join(__dirname, 'preload.js')
            }
        };

        // Windows 特殊处理
        if (process.platform === 'win32') {
            windowOptions.backgroundColor = '#00000000';
            windowOptions.titleBarStyle = 'hidden';
        }

        this.mainWindow = new BrowserWindow(windowOptions);

        // 设置窗口为完全鼠标穿透（除了宠物本身）
        this.mainWindow.setIgnoreMouseEvents(true, { forward: true });

        // 窗口准备好后再显示，避免闪烁
        this.mainWindow.once('ready-to-show', () => {
            this.mainWindow.show();
            console.log('Window is now visible');
        });

        // 加载HTML文件
        await this.mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));

        // 开发模式下打开开发者工具
        if (config.development.devTools) {
            this.mainWindow.webContents.openDevTools({ mode: 'detach' });
        }

        // 窗口关闭事件
        this.mainWindow.on('closed', () => {
            this.mainWindow = null;
        });

        console.log('Window created successfully');
        return this.mainWindow;
    }

    // 设置鼠标穿透
    setIgnoreMouseEvents(ignore, options = {}) {
        if (this.mainWindow) {
            this.mainWindow.setIgnoreMouseEvents(ignore, options);
        }
    }

    // 移动窗口
    moveWindow(x, y) {
        if (this.mainWindow) {
            this.mainWindow.setPosition(x, y);
        }
    }

    // 获取窗口位置
    getPosition() {
        if (this.mainWindow) {
            return this.mainWindow.getPosition();
        }
        return [0, 0];
    }

    // 获取屏幕尺寸
    getScreenSize() {
        const { width, height } = screen.getPrimaryDisplay().workAreaSize;
        return { width, height };
    }

    // 隐藏窗口
    hide() {
        if (this.mainWindow) {
            this.mainWindow.hide();
        }
    }

    // 显示窗口
    show() {
        if (this.mainWindow) {
            this.mainWindow.show();
        }
    }

    // 移动到屏幕中心
    centerWindow() {
        if (this.mainWindow) {
            this.mainWindow.center();
        }
    }
}

module.exports = WindowManager;
