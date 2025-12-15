const { Tray, Menu, app, nativeImage } = require('electron');
const path = require('path');
const config = require('./config');

class TrayManager {
    constructor(windowManager) {
        this.windowManager = windowManager;
        this.tray = null;
        this.createTray();
    }

    createTray() {
        // 创建托盘图标
        const iconPath = path.join(__dirname, '../../assets/icons/icon.png');

        console.log('Loading tray icon from:', iconPath);

        const trayIcon = nativeImage.createFromPath(iconPath);

        // 调整图标大小以适配系统托盘
        if (!trayIcon.isEmpty()) {
            // 为不同平台设置合适的尺寸
            if (process.platform === 'win32') {
                // Windows 通常使用 16x16
                trayIcon.resize({ width: 16, height: 16 });
            } else if (process.platform === 'darwin') {
                // macOS 使用模板图标
                trayIcon.setTemplateImage(true);
            }
        }

        this.tray = new Tray(trayIcon);
        this.tray.setToolTip(config.tray.tooltip);

        console.log('Tray icon loaded successfully');

        // 创建右键菜单
        this.updateContextMenu();

        // 点击托盘图标显示/隐藏窗口
        this.tray.on('click', () => {
            if (this.windowManager.mainWindow) {
                if (this.windowManager.mainWindow.isVisible()) {
                    this.windowManager.hide();
                } else {
                    this.windowManager.show();
                }
            }
        });
    }

    updateContextMenu(behaviorEnabled = true) {
        const contextMenu = Menu.buildFromTemplate([
            {
                label: 'Show Pet',
                click: () => {
                    this.windowManager.show();
                }
            },
            {
                label: 'Hide Pet',
                click: () => {
                    this.windowManager.hide();
                }
            },
            { type: 'separator' },
            {
                label: behaviorEnabled ? 'Pause Behavior' : 'Enable Behavior',
                click: () => {
                    if (this.windowManager.mainWindow) {
                        this.windowManager.mainWindow.webContents.send('toggle-behavior');
                    }
                }
            },
            {
                label: 'Center Window',
                click: () => {
                    this.windowManager.centerWindow();
                }
            },
            { type: 'separator' },
            {
                label: 'About',
                click: () => {
                    // TODO: 显示关于对话框
                    console.log('Jellyfish Desktop Pet v1.0.0');
                }
            },
            { type: 'separator' },
            {
                label: 'Quit',
                click: () => {
                    app.quit();
                }
            }
        ]);

        this.tray.setContextMenu(contextMenu);
    }

    destroy() {
        if (this.tray) {
            this.tray.destroy();
            this.tray = null;
        }
    }
}

module.exports = TrayManager;
