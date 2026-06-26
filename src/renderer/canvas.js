// Canvas 渲染引擎 - 全屏渲染
class CanvasEngine {
    constructor(canvasId, screenSize) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.screenSize = screenSize;
        this.setupCanvas();
    }

    setupCanvas() {
        // 设置canvas为全屏尺寸
        this.canvas.width = this.screenSize.width;
        this.canvas.height = this.screenSize.height;

        // 高DPI支持
        const dpr = window.devicePixelRatio || 1;
        this.canvas.width = this.screenSize.width * dpr;
        this.canvas.height = this.screenSize.height * dpr;
        this.ctx.scale(dpr, dpr);
        this.canvas.style.width = this.screenSize.width + 'px';
        this.canvas.style.height = this.screenSize.height + 'px';
    }

    // 主渲染方法 - 支持单个宠物或宠物数组（多宠物模式）
    render(pets) {
        this.clear();

        // 兼容旧的单宠物调用和新的多宠物数组
        const petList = Array.isArray(pets) ? pets : [pets];

        petList.forEach(pet => {
            if (!pet) return;
            const pos = pet.getRenderPosition();
            const expression = pet.state.expression;
            const color = pet.state.color;
            const species = pet.species || 'jellyfish';

            // 根据物种选择绘制方式
            if (species === 'jellyfish') {
                this.drawJellyfish(pos.x, pos.y, expression, color, pet.animation, pet.state);
            } else {
                this.drawSimpleFish(pos.x, pos.y, expression, color, pet.animation, pet.state);
            }
        });
    }

    // 清除画布
    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    // 绘制水母（像素风格）
    drawJellyfish(x, y, expression, color, animation, state = {}) {
        const pixels = this.getJellyfishPixels(expression, animation);

        this.ctx.save();
        this.ctx.translate(x, y);

        // 支持旋转、缩放、透明度（多宠物和动作增强）
        const rotation = state.rotation || 0;
        const scale = state.scale || 1.0;
        const opacity = state.opacity !== undefined ? state.opacity : 1.0;

        // 放大倍数（让像素水母在高分屏上更清晰可见）
        const visibilityScale = 2;

        if (rotation !== 0) {
            this.ctx.rotate(rotation * Math.PI / 180);
        }
        this.ctx.scale(visibilityScale, visibilityScale);
        if (scale !== 1.0) {
            this.ctx.scale(scale, scale);
        }
        this.ctx.globalAlpha = opacity;

        // 绘制身体
        this.ctx.fillStyle = color;
        pixels.body.forEach(([px, py]) => {
            this.ctx.fillRect(px - 32, py - 32, 4, 4);
        });

        // 绘制眼睛
        this.ctx.fillStyle = '#000000';
        if (!animation.isBlinking) {
            pixels.eyes.forEach(([px, py]) => {
                this.ctx.fillRect(px - 32, py - 32, 4, 4);
            });
        } else {
            // 眨眼时画横线
            pixels.eyesBlinking.forEach(([px, py]) => {
                this.ctx.fillRect(px - 32, py - 32, 4, 2);
            });
        }

        // 绘制触须（动态摆动）
        this.drawTentacles(animation.tentaclePhase, color);

        this.ctx.restore();
    }

    // 获取水母像素数据
    getJellyfishPixels(expression, animation) {
        // 水母身体（圆顶形状）
        const body = [
            // 顶部
            [28, 16], [32, 16], [36, 16],
            [24, 20], [28, 20], [32, 20], [36, 20], [40, 20],
            [20, 24], [24, 24], [28, 24], [32, 24], [36, 24], [40, 24], [44, 24],
            [20, 28], [24, 28], [28, 28], [32, 28], [36, 28], [40, 28], [44, 28],
            [20, 32], [24, 32], [28, 32], [32, 32], [36, 32], [40, 32], [44, 32],
            [20, 36], [24, 36], [28, 36], [32, 36], [36, 36], [40, 36], [44, 36],
            [24, 40], [28, 40], [32, 40], [36, 40], [40, 40]
        ];

        // 眼睛（根据表情不同）
        let eyes = [];
        let eyesBlinking = [];

        switch (expression) {
            case 'happy':
                eyes = [[24, 28], [28, 28], [36, 28], [40, 28]];  // 开心的大眼睛
                eyesBlinking = [[24, 28], [28, 28], [36, 28], [40, 28]];
                break;
            case 'curious':
                eyes = [[26, 26], [30, 26], [34, 26], [38, 26]];  // 好奇的小眼睛上移
                eyesBlinking = [[24, 28], [28, 28], [36, 28], [40, 28]];
                break;
            case 'sleepy':
            case 'sleep':
                eyes = [];  // 睡觉时闭眼
                eyesBlinking = [[24, 30], [28, 30], [36, 30], [40, 30]];
                break;
            case 'angry':
                eyes = [[24, 32], [28, 28], [36, 28], [40, 32]];  // 生气的斜眼
                eyesBlinking = [[24, 30], [28, 30], [36, 30], [40, 30]];
                break;
            case 'dead':
                eyes = [[24, 28], [28, 32], [36, 32], [40, 28]];  // X_X
                eyesBlinking = [[24, 30], [28, 30], [36, 30], [40, 30]];
                break;
            default:  // idle
                eyes = [[24, 28], [28, 28], [36, 28], [40, 28]];
                eyesBlinking = [[24, 28], [28, 28], [36, 28], [40, 28]];
        }

        return { body, eyes, eyesBlinking };
    }

    // 绘制触须（动态动画）
    drawTentacles(phase, color) {
        this.ctx.fillStyle = color;
        this.ctx.globalAlpha = 0.8;

        // 三条触须，每条有摆动动画
        const tentacles = [
            { x: 24, startY: 44 },
            { x: 32, startY: 44 },
            { x: 40, startY: 44 }
        ];

        tentacles.forEach((tentacle, i) => {
            const offset = Math.sin(phase + i * 0.5) * 4;
            for (let j = 0; j < 6; j++) {
                const y = tentacle.startY + j * 4;
                const x = tentacle.x + offset * (j / 6);
                this.ctx.fillRect(x - 32, y - 32, 3, 3);
            }
        });

        this.ctx.globalAlpha = 1.0;
    }

    // 获取Canvas元素
    getCanvas() {
        return this.canvas;
    }

    // 简单鱼类物种（作为不同物种的示例）
    drawSimpleFish(x, y, expression, color, animation, state = {}) {
        this.ctx.save();
        this.ctx.translate(x, y);

        const rotation = state.rotation || 0;
        const scale = (state.scale || 1.0) * 0.9;
        const opacity = state.opacity !== undefined ? state.opacity : 1.0;

        // 放大倍数（与水母保持一致）
        const visibilityScale = 2;

        if (rotation !== 0) this.ctx.rotate(rotation * Math.PI / 180);
        this.ctx.scale(visibilityScale, visibilityScale);
        this.ctx.scale(scale, scale);
        this.ctx.globalAlpha = opacity;

        // 简单鱼身像素
        this.ctx.fillStyle = color;
        const body = [
            [24, 32], [28, 28], [32, 28], [36, 28], [40, 32],
            [24, 36], [28, 32], [32, 32], [36, 32], [40, 36],
            [28, 36], [32, 36], [36, 36]
        ];
        body.forEach(([px, py]) => {
            this.ctx.fillRect(px - 32, py - 32, 4, 4);
        });

        // 鱼尾
        this.ctx.fillStyle = color;
        const tailOffset = Math.sin(animation.tentaclePhase * 1.5) * 2;
        this.ctx.fillRect(20 - 32 + tailOffset, 30 - 32, 4, 4);
        this.ctx.fillRect(16 - 32 + tailOffset * 0.7, 32 - 32, 4, 4);

        // 眼睛
        this.ctx.fillStyle = '#000';
        if (!animation.isBlinking) {
            this.ctx.fillRect(36 - 32, 28 - 32, 4, 4);
        } else {
            this.ctx.fillRect(36 - 32, 29 - 32, 4, 2);
        }

        // 鱼鳍小装饰
        this.ctx.fillRect(30 - 32, 24 - 32, 3, 3);

        this.ctx.restore();
    }
}

// 在 Node 上下文（如被 require）时导出；在浏览器 <script> 上下文中已是全局类
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CanvasEngine;
}
