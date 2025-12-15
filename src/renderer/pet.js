// 宠物状态管理类 - 全屏自主移动
class Pet {
    constructor(canvas, config, screenSize) {
        this.canvas = canvas;
        this.config = config;
        this.screenSize = screenSize;

        // 初始位置随机
        const startX = Math.random() * screenSize.width;
        const startY = Math.random() * screenSize.height;

        // 宠物状态
        this.state = {
            x: startX,
            y: startY,
            vx: 0,
            vy: 0,
            expression: 'idle',    // idle, happy, curious, sleepy
            color: config.pet.defaultColor,
            isMoving: false,
            rotation: 0,
            scale: 1.0,
            opacity: 1.0,
            speed: 1.0  // 速度倍率
        };

        // 动画状态
        this.animation = {
            floatOffset: 0,
            floatSpeed: 0.05,
            tentaclePhase: 0,
            blinkTimer: 0,
            isBlinking: false
        };

        // 目标位置（用于AI移动）
        this.target = {
            x: this.state.x,
            y: this.state.y
        };
    }

    // 更新宠物状态（每帧调用）
    update() {
        // 更新浮动动画
        this.animation.floatOffset = Math.sin(this.animation.floatSpeed * Date.now() / 100) * 3;
        this.animation.tentaclePhase += 0.1;

        // 更新眨眼动画
        this.updateBlink();

        // 执行移动逻辑
        if (this.state.isMoving) {
            this.moveTowardsTarget();
        }

        // 应用速度
        this.state.x += this.state.vx;
        this.state.y += this.state.vy;

        // 边界处理 - 允许短暂离开屏幕边缘，然后反弹
        this.handleBoundaries();

        // 摩擦力
        this.state.vx *= 0.98;
        this.state.vy *= 0.98;
    }

    // 边界处理
    handleBoundaries() {
        const margin = 100;  // 允许的边界外距离
        const petSize = this.config.pet.size;

        // 离开屏幕太远则反弹
        if (this.state.x < -margin) {
            this.state.x = -margin;
            this.state.vx = Math.abs(this.state.vx);
        } else if (this.state.x > this.screenSize.width + margin) {
            this.state.x = this.screenSize.width + margin;
            this.state.vx = -Math.abs(this.state.vx);
        }

        if (this.state.y < -margin) {
            this.state.y = -margin;
            this.state.vy = Math.abs(this.state.vy);
        } else if (this.state.y > this.screenSize.height + margin) {
            this.state.y = this.screenSize.height + margin;
            this.state.vy = -Math.abs(this.state.vy);
        }
    }

    // 更新眨眼动画
    updateBlink() {
        if (!this.animation.isBlinking) {
            this.animation.blinkTimer++;
            if (this.animation.blinkTimer > this.config.behavior.blinkInterval / 16) {
                this.animation.isBlinking = true;
                this.animation.blinkTimer = 0;
            }
        } else {
            this.animation.blinkTimer++;
            if (this.animation.blinkTimer > 5) {
                this.animation.isBlinking = false;
                this.animation.blinkTimer = 0;
            }
        }
    }

    // 向目标移动
    moveTowardsTarget() {
        const dx = this.target.x - this.state.x;
        const dy = this.target.y - this.state.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > 5) {
            const speed = this.config.behavior.walkSpeed * this.state.speed;
            this.state.vx = (dx / distance) * speed;
            this.state.vy = (dy / distance) * speed;
        } else {
            // 到达目标
            this.state.isMoving = false;
            this.state.vx = 0;
            this.state.vy = 0;
        }
    }

    // 设置目标位置
    setTarget(x, y) {
        this.target.x = x;
        this.target.y = y;
        this.state.isMoving = true;
    }

    // 设置表情
    setExpression(expression) {
        this.state.expression = expression;
    }

    // 设置速度倍率
    setSpeed(speed) {
        this.state.speed = speed;
    }

    // 获取当前位置
    getPosition() {
        return {
            x: this.state.x,
            y: this.state.y
        };
    }

    // 获取渲染位置（包含浮动效果）
    getRenderPosition() {
        return {
            x: this.state.x,
            y: this.state.y + this.animation.floatOffset
        };
    }
}

module.exports = Pet;
