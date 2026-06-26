// Pet / CanvasEngine / BehaviorSystem 由 index.html 中的 <script> 标签按顺序加载为全局类
// （renderer 已关闭 nodeIntegration，不能用 require）

// 应用类 - 纯自主AI驱动，支持多宠物
class PetApp {
    constructor() {
        this.pets = [];           // [{ pet, behavior }]
        this.canvas = null;
        this.config = null;
        this.screenSize = null;
        this.allBehaviorsEnabled = true;
    }

    async init() {
        try {
            console.log('Autonomous Pet AI initializing...');

            // 获取配置和屏幕尺寸
            this.config = await window.electronAPI.getConfig();
            this.screenSize = window.electronAPI.getScreenSize();

            console.log('Screen size:', this.screenSize);

            // 初始化 Canvas
            this.canvas = new CanvasEngine('petCanvas', this.screenSize);

            // 根据配置创建多个宠物
            const multiPetConfig = this.config.multiPet || { enabled: true, count: 1 };
            const petCount = multiPetConfig.enabled ? Math.max(1, Math.min(5, multiPetConfig.count || 1)) : 1;

            console.log(`Creating ${petCount} autonomous pets...`);

            for (let i = 0; i < petCount; i++) {
                const pet = new Pet(this.canvas, this.config, this.screenSize, i);
                const behavior = new BehaviorSystem(pet, this.config, this.screenSize);

                // 给每个宠物稍微不同的初始颜色变体
                if (this.config.pet.defaultColor) {
                    pet.state.color = this.getVariantColor(this.config.pet.defaultColor, i);
                }

                // 多物种支持：默认大部分是水母，部分可以是其他物种（演示）
                if (petCount >= 2 && i % 3 === 2) {
                    pet.species = 'fish';
                    pet.state.color = '#7EC8E3'; // 更偏蓝的鱼色
                }

                this.pets.push({ pet, behavior });
            }

            // 注册行为切换事件（控制全部宠物）
            if (window.electronAPI?.onToggleBehavior) {
                this.unsubscribeToggleBehavior = window.electronAPI.onToggleBehavior(() => {
                    this.allBehaviorsEnabled = !this.allBehaviorsEnabled;
                    this.pets.forEach(({ behavior }) => {
                        if (this.allBehaviorsEnabled) {
                            behavior.setEnabled(true);
                        } else {
                            behavior.setEnabled(false);
                        }
                    });
                    window.electronAPI?.sendBehaviorStatus?.(this.allBehaviorsEnabled);
                });
            }

            // 注册多宠物添加/移除事件
            if (window.electronAPI?.onAddPet) {
                window.electronAPI.onAddPet(() => this.addPet());
            }
            if (window.electronAPI?.onRemovePet) {
                window.electronAPI.onRemovePet(() => this.removePet());
            }

            // 启动渲染循环
            this.startRenderLoop();

            // 启动所有宠物的AI行为
            if (this.config?.behavior?.enabled !== false) {
                this.pets.forEach(({ behavior }) => behavior.setEnabled(true));
                this.allBehaviorsEnabled = true;
            }

            window.electronAPI?.sendBehaviorStatus?.(this.allBehaviorsEnabled);

            // 立即报告初始内存（便于测试）
            setTimeout(() => this.logMemoryUsage(), 2000);

            console.log(`Autonomous Pet AI started! ${this.pets.length} pets are now free to roam...`);
        } catch (error) {
            console.error('Failed to initialize:', error);
        }
    }

    // 为不同宠物生成轻微颜色变体
    getVariantColor(baseColor, index) {
        // 简单的 HSL 偏移
        try {
            const r = parseInt(baseColor.slice(1, 3), 16);
            const g = parseInt(baseColor.slice(3, 5), 16);
            const b = parseInt(baseColor.slice(5, 7), 16);

            const offset = (index % 3 - 1) * 20; // 轻微偏移
            const nr = Math.max(0, Math.min(255, r + offset));
            const ng = Math.max(0, Math.min(255, g + (index % 2 === 0 ? offset : -offset)));
            const nb = Math.max(0, Math.min(255, b - offset));

            return `#${nr.toString(16).padStart(2, '0')}${ng.toString(16).padStart(2, '0')}${nb.toString(16).padStart(2, '0')}`;
        } catch {
            return baseColor;
        }
    }

    startRenderLoop() {
        let lastMemoryLog = Date.now();
        const MEMORY_LOG_INTERVAL = 20000; // 正常使用：每 20 秒报告一次内存（测试时可临时调低）

        const render = () => {
            // 更新所有宠物状态
            this.pets.forEach(({ pet }) => pet.update());

            // 简单的宠物间轻微排斥（避免完全重叠）
            this.applyPetSeparation();

            // 渲染所有宠物
            this.canvas.render(this.pets.map(p => p.pet));

            // 内存监控（renderer 进程）
            const now = Date.now();
            if (now - lastMemoryLog > MEMORY_LOG_INTERVAL) {
                this.logMemoryUsage();
                lastMemoryLog = now;
            }

            requestAnimationFrame(render);
        };
        requestAnimationFrame(render);
    }

    logMemoryUsage() {
        try {
            const mem = performance.memory;
            if (mem) {
                const usedMB = (mem.usedJSHeapSize / 1024 / 1024).toFixed(1);
                const totalMB = (mem.totalJSHeapSize / 1024 / 1024).toFixed(1);
                const limitMB = (mem.jsHeapSizeLimit / 1024 / 1024).toFixed(1);
                console.log(`[MEMORY] JS Heap: ${usedMB} MB / ${totalMB} MB (limit ${limitMB} MB) | Pets: ${this.pets.length}`);

                // 报告给 main 进程写测试日志文件
                if (window.electronAPI?.reportMemory) {
                    window.electronAPI.reportMemory({
                        pets: this.pets.length,
                        usedMB: parseFloat(usedMB),
                        totalMB: parseFloat(totalMB)
                    });
                }

                // 内存保护警告（防止溢出）
                if (parseFloat(usedMB) > 180) {
                    console.warn(`[MEMORY WARNING] High heap usage detected (${usedMB} MB). Consider reducing pet count.`);
                }
            } else {
                console.log(`[MEMORY] Pets active: ${this.pets.length} (performance.memory not available)`);
            }
        } catch (e) {
            // 静默
        }
    }

    // 宠物之间简单的分离，避免堆叠
    applyPetSeparation() {
        const pets = this.pets.map(p => p.pet);
        const minDistance = 70;
        const repulsion = 0.6;

        for (let i = 0; i < pets.length; i++) {
            for (let j = i + 1; j < pets.length; j++) {
                const a = pets[i];
                const b = pets[j];

                const dx = a.state.x - b.state.x;
                const dy = a.state.y - b.state.y;
                const dist = Math.sqrt(dx * dx + dy * dy) || 1;

                if (dist < minDistance) {
                    const force = (minDistance - dist) * repulsion;
                    const fx = (dx / dist) * force;
                    const fy = (dy / dist) * force;

                    a.state.x += fx * 0.5;
                    a.state.y += fy * 0.5;
                    b.state.x -= fx * 0.5;
                    b.state.y -= fy * 0.5;

                    // 轻微降低速度使分离更自然
                    a.state.vx *= 0.85;
                    a.state.vy *= 0.85;
                    b.state.vx *= 0.85;
                    b.state.vy *= 0.85;
                }
            }
        }
    }

    // 调试用：获取所有宠物状态
    getPetsState() {
        return this.pets.map(({ pet }, i) => ({
            index: i,
            position: pet.getPosition(),
            expression: pet.state.expression,
            species: pet.species
        }));
    }

    // 运行时添加新宠物（托盘调用）
    addPet() {
        if (this.pets.length >= 5) {
            console.warn('Max pets reached (5). Further adds blocked to protect memory.');
            return;
        }

        const newId = this.pets.length;
        const pet = new Pet(this.canvas, this.config, this.screenSize, newId);
        const behavior = new BehaviorSystem(pet, this.config, this.screenSize);

        // 颜色和物种多样性
        pet.state.color = this.getVariantColor(this.config.pet?.defaultColor || '#FFB3D9', newId);
        if (newId % 3 === 0) {
            pet.species = 'fish';
            pet.state.color = '#7EC8E3';
        }

        if (this.allBehaviorsEnabled) {
            behavior.setEnabled(true);
        }

        this.pets.push({ pet, behavior });
        console.log(`Added new pet. Total: ${this.pets.length}`);
    }

    // 运行时移除一只宠物（彻底清理，防止内存泄漏）
    removePet() {
        if (this.pets.length <= 1) {
            console.log('At least one pet must remain');
            return;
        }

        const last = this.pets.pop();
        if (last) {
            if (last.behavior) {
                last.behavior.destroy ? last.behavior.destroy() : last.behavior.stop();
            }
            // 帮助 GC：切断引用
            if (last.pet) {
                last.pet.state = null;
            }
        }
        console.log(`Removed a pet. Total: ${this.pets.length}`);
    }
}

// DOM加载完成后启动
window.addEventListener('DOMContentLoaded', () => {
    const app = new PetApp();
    app.init();

    // 暴露到全局，供调试使用
    window.petApp = app;
});
