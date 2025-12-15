// 应用配置文件
module.exports = {
    // 窗口配置
    window: {
        width: 200,
        height: 200,
        transparent: true,
        frame: false,
        alwaysOnTop: true,
        skipTaskbar: false,
        resizable: false,
        hasShadow: false,
        backgroundColor: '#00000000'
    },

    // 宠物配置
    pet: {
        defaultColor: '#FFB3D9',  // 粉色水母
        size: 64,                  // 宠物大小（像素）
        animationSpeed: 1.0,       // 动画速度倍率
        defaultPosition: 'center'  // 初始位置：center/random
    },

    // AI行为配置 - 自主行为系统
    behavior: {
        enabled: true,
        walkSpeed: 3,                      // 基础移动速度（像素/帧）
        blinkInterval: 4000,               // 眨眼间隔（毫秒）
        // 新增：完全自主AI配置
        autonomousMode: true,              // 完全自主模式
        unpredictable: true                // 不可预测行为
    },

    // 交互配置
    interaction: {
        dragEnabled: true,
        clickEnabled: true,
        contextMenuEnabled: true,
        clickThreshold: 3,              // 连续点击阈值（触发生气）
        clickTimeout: 1000              // 点击重置时间
    },

    // 系统托盘配置
    enableTray: true,
    tray: {
        title: '水母桌宠',
        tooltip: '水母桌面宠物'
    },

    // 开发配置
    development: {
        devTools: process.env.NODE_ENV === 'development',
        reloadOnChange: false
    }
};
