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

    // 主渲染方法
    render(pet) {
        this.clear();

        const pos = pet.getRenderPosition();
        const expression = pet.state.expression;
        const color = pet.state.color;

        // 绘制水母身体
        this.drawJellyfish(pos.x, pos.y, expression, color, pet.animation);
    }

    // 清除画布
    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    // 绘制水母（像素风格）
    drawJellyfish(x, y, expression, color, animation) {
        const pixels = this.getJellyfishPixels(expression, animation);

        this.ctx.save();
        this.ctx.translate(x, y);

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
            case 'angry':
                eyes = [[24, 32], [28, 28], [36, 28], [40, 32]];  // 生气的斜眼
                eyesBlinking = [[24, 30], [28, 30], [36, 30], [40, 30]];
                break;
            case 'sleep':
                eyes = [];  // 睡觉时闭眼
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
}

module.exports = CanvasEngine;
