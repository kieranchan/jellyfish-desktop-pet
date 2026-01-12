const Pet = require('./pet');
const CanvasEngine = require('./canvas');
const BehaviorSystem = require('./behavior');

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
            this.config = await window.electronAPI.getConfig();
            this.screenSize = window.electronAPI.getScreenSize();

            console.log('Screen size:', this.screenSize);

            // 初始化各个模块（移除交互系统）
            this.canvas = new CanvasEngine('petCanvas', this.screenSize);
            this.pet = new Pet(this.canvas, this.config, this.screenSize);
            this.behavior = new BehaviorSystem(this.pet, this.config, this.screenSize);

            // 注册行为切换事件
            if (window.electronAPI?.onToggleBehavior) {
                this.unsubscribeToggleBehavior = window.electronAPI.onToggleBehavior(() => {
                    const behaviorEnabled = this.behavior.toggle
                        ? this.behavior.toggle()
                        : this.behavior.enabled
                            ? (this.behavior.stop(), false)
                            : (this.behavior.start(), true);
                    window.electronAPI?.sendBehaviorStatus?.(behaviorEnabled);
                });
            }

            // 启动渲染循环
            this.startRenderLoop();

            // 自动启动AI行为系统
            const behaviorEnabled = this.behavior.start();
            window.electronAPI?.sendBehaviorStatus?.(behaviorEnabled);

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
