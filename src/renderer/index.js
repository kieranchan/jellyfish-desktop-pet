const Pet = require('./pet');
const CanvasEngine = require('./canvas');
const BehaviorSystem = require('./behavior');
const { ipcRenderer } = require('electron');

// 应用类 - 纯自主AI驱动，无人为交互
class PetApp {
    constructor() {
        this.pet = null;
        this.canvas = null;
        this.behavior = null;
        this.config = null;
        this.screenSize = null;
    }

    async init() {
        try {
            console.log('Autonomous Pet AI initializing...');

            // 获取配置和屏幕尺寸
            this.config = await ipcRenderer.invoke('get-config');
            this.screenSize = ipcRenderer.sendSync('get-screen-size');

            console.log('Screen size:', this.screenSize);

            // 初始化各个模块（移除交互系统）
            this.canvas = new CanvasEngine('petCanvas', this.screenSize);
            this.pet = new Pet(this.canvas, this.config, this.screenSize);
            this.behavior = new BehaviorSystem(this.pet, this.config, this.screenSize);

            // 启动渲染循环
            this.startRenderLoop();

            // 自动启动AI行为系统
            if (this.behavior.enabled) {
                this.behavior.start();
            }

            console.log('Autonomous Pet AI started! Pet is now free to roam...');
        } catch (error) {
            console.error('Failed to initialize:', error);
        }
    }

    startRenderLoop() {
        const render = () => {
            this.pet.update();
            this.canvas.render(this.pet);
            requestAnimationFrame(render);
        };
        requestAnimationFrame(render);
    }
}

// DOM加载完成后启动
window.addEventListener('DOMContentLoaded', () => {
    const app = new PetApp();
    app.init();

    // 暴露到全局，供调试使用
    window.petApp = app;
});
