// AI 行为系统 - 完全自主，不可预测
class BehaviorSystem {
    constructor(pet, config, screenSize) {
        this.pet = pet;
        this.config = config;
        this.screenSize = screenSize;
        this.enabled = false;
        this.enabled = !!config.behavior.enabled;

        // 定时器
        this.timers = {
            walk: null,
            action: null,
            expression: null,
            speedChange: null
        };
        this.pendingTimeouts = [];

        // 行为模式
        this.movePatterns = ['direct', 'curve', 'zigzag', 'wander'];
        this.currentPattern = 'direct';

        // 表情类型
        this.expressions = ['idle', 'happy', 'curious', 'sleepy'];
    }

    // 启动AI行为
    start() {
        if (this.enabled) return;

        this.enabled = true;

        console.log('Autonomous AI behavior system activated');

        // 随机移动
        this.scheduleRandomWalk();

        // 随机动作
        this.scheduleRandomAction();

        // 随机表情变化
        this.scheduleRandomExpression();

        // 随机速度变化
        this.scheduleRandomSpeedChange();
    }

    // 停止AI行为
    stop() {
        console.log('AI behavior system stopped');

        this.enabled = false;

        Object.keys(this.timers).forEach(key => {
            if (this.timers[key]) {
                clearTimeout(this.timers[key]);
                this.timers[key] = null;
            }
        });

        this.pendingTimeouts.forEach(timeoutId => clearTimeout(timeoutId));
        this.pendingTimeouts = [];
    }

    toggle() {
        if (this.enabled) {
            this.stop();
            return false;
        }

        this.start();
        return true;
    }

    // 安排随机移动
    scheduleRandomWalk() {
        if (!this.enabled) return;

        // 更短的间隔，更频繁的移动
        const delay = this.randomInterval(3000, 8000);

        this.timers.walk = this.registerTimeout(() => {
            if (!this.enabled) return;
            this.randomWalk();
            this.scheduleRandomWalk();
        }, delay);
    }

    // 执行随机移动
    randomWalk() {
        // 随机选择移动模式
        this.currentPattern = this.randomChoice(this.movePatterns);

        const targetX = this.randomInt(100, this.screenSize.width - 100);
        const targetY = this.randomInt(100, this.screenSize.height - 100);

        console.log(`AI: Moving to (${targetX}, ${targetY}) using ${this.currentPattern} pattern`);

        switch (this.currentPattern) {
            case 'direct':
                // 直接移动
                this.pet.setTarget(targetX, targetY);
                break;
            case 'curve':
                // 曲线移动（通过中间点）
                this.curveMove(targetX, targetY);
                break;
            case 'zigzag':
                // 之字形移动
                this.zigzagMove(targetX, targetY);
                break;
            case 'wander':
                // 漫游模式
                this.wanderMove();
                break;
        }
    }

    // 曲线移动
    curveMove(targetX, targetY) {
        const currentPos = this.pet.getPosition();
        const midX = (currentPos.x + targetX) / 2 + this.randomInt(-200, 200);
        const midY = (currentPos.y + targetY) / 2 + this.randomInt(-200, 200);

        // 先移动到中间点
        this.pet.setTarget(midX, midY);

        // 然后移动到目标
        this.registerTimeout(() => {
            if (!this.enabled) return;
            this.pet.setTarget(targetX, targetY);
        }, this.randomInt(1000, 2000));
    }

    // 之字形移动
    zigzagMove(targetX, targetY) {
        const currentPos = this.pet.getPosition();
        const steps = 3;
        let delay = 0;

        for (let i = 1; i <= steps; i++) {
            const ratio = i / steps;
            const x = currentPos.x + (targetX - currentPos.x) * ratio;
            const y = currentPos.y + (targetY - currentPos.y) * ratio;
            const offsetX = (i % 2 === 0 ? 1 : -1) * 100;

            this.registerTimeout(() => {
                if (!this.enabled) return;
                this.pet.setTarget(x + offsetX, y);
            }, delay);

            delay += 800;
        }
    }

    // 漫游模式 - 小范围随机移动
    wanderMove() {
        const duration = this.randomInt(5000, 10000);
        const startTime = Date.now();

        const wander = () => {
            if (!this.enabled) return;
            if (Date.now() - startTime > duration) return;

            const currentPos = this.pet.getPosition();
            const wanderRadius = 200;
            const targetX = currentPos.x + this.randomInt(-wanderRadius, wanderRadius);
            const targetY = currentPos.y + this.randomInt(-wanderRadius, wanderRadius);

            this.pet.setTarget(
                Math.max(100, Math.min(targetX, this.screenSize.width - 100)),
                Math.max(100, Math.min(targetY, this.screenSize.height - 100))
            );

            this.registerTimeout(wander, this.randomInt(1000, 2000));
        };

        wander();
    }

    // 安排随机动作
    scheduleRandomAction() {
        if (!this.enabled) return;

        const delay = this.randomInterval(4000, 10000);

        this.timers.action = this.registerTimeout(() => {
            if (!this.enabled) return;
            this.randomAction();
            this.scheduleRandomAction();
        }, delay);
    }

    // 执行随机动作
    randomAction() {
        const actions = [
            'pause', 'spin', 'shake', 'bounce',
            'speedup', 'slowdown', 'drift'
        ];
        const action = this.randomChoice(actions);

        console.log(`AI: Performing action - ${action}`);

        switch (action) {
            case 'pause':
                this.performPause();
                break;
            case 'spin':
                this.performSpin();
                break;
            case 'shake':
                this.performShake();
                break;
            case 'bounce':
                this.performBounce();
                break;
            case 'speedup':
                this.pet.setSpeed(this.randomFloat(2.0, 4.0));
                this.registerTimeout(() => {
                    if (!this.enabled) return;
                    this.pet.setSpeed(1.0);
                }, this.randomInt(2000, 4000));
                break;
            case 'slowdown':
                this.pet.setSpeed(this.randomFloat(0.3, 0.6));
                this.registerTimeout(() => {
                    if (!this.enabled) return;
                    this.pet.setSpeed(1.0);
                }, this.randomInt(2000, 4000));
                break;
            case 'drift':
                this.performDrift();
                break;
        }
    }

    // 暂停
    performPause() {
        const wasMoving = this.pet.state.isMoving;
        this.pet.state.isMoving = false;
        this.registerTimeout(() => {
            if (!this.enabled) return;
            if (!wasMoving) this.pet.state.isMoving = true;
        }, this.randomInt(1000, 3000));
    }

    // 旋转
    performSpin() {
        this.pet.state.rotation += 360;
    }

    // 晃动
    performShake() {
        const originalX = this.pet.state.x;
        const shakeAmount = 15;
        const shakeDuration = 400;
        const shakeCount = 8;

        let count = 0;
        const interval = setInterval(() => {
            if (count < shakeCount) {
                this.pet.state.x = originalX + (Math.random() - 0.5) * shakeAmount;
                count++;
            } else {
                this.pet.state.x = originalX;
                clearInterval(interval);
            }
        }, shakeDuration / shakeCount);
    }

    // 弹跳
    performBounce() {
        const originalY = this.pet.state.y;
        const bounceHeight = 50;
        const duration = 600;

        let startTime = null;
        const animate = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime;
            const progress = elapsed / duration;

            if (progress < 1) {
                const offset = Math.sin(progress * Math.PI) * bounceHeight;
                this.pet.state.y = originalY - offset;
                requestAnimationFrame(animate);
            } else {
                this.pet.state.y = originalY;
            }
        };

        requestAnimationFrame(animate);
    }

    // 漂移
    performDrift() {
        const driftForce = this.randomFloat(2, 5);
        const driftAngle = Math.random() * Math.PI * 2;

        this.pet.state.vx += Math.cos(driftAngle) * driftForce;
        this.pet.state.vy += Math.sin(driftAngle) * driftForce;
    }

    // 安排随机表情变化
    scheduleRandomExpression() {
        if (!this.enabled) return;

        const delay = this.randomInterval(8000, 20000);

        this.timers.expression = this.registerTimeout(() => {
            if (!this.enabled) return;
            const expression = this.randomChoice(this.expressions);
            console.log(`AI: Changing expression to ${expression}`);
            this.pet.setExpression(expression);

            // 一段时间后恢复idle
            this.registerTimeout(() => {
                if (!this.enabled) return;
                this.pet.setExpression('idle');
            }, this.randomInt(3000, 8000));

            this.scheduleRandomExpression();
        }, delay);
    }

    // 安排随机速度变化
    scheduleRandomSpeedChange() {
        if (!this.enabled) return;

        const delay = this.randomInterval(10000, 25000);

        this.timers.speedChange = this.registerTimeout(() => {
            if (!this.enabled) return;
            const speed = this.randomFloat(0.5, 2.5);
            console.log(`AI: Changing speed to ${speed.toFixed(2)}x`);
            this.pet.setSpeed(speed);

            // 恢复正常速度
            this.registerTimeout(() => {
                if (!this.enabled) return;
                this.pet.setSpeed(1.0);
            }, this.randomInt(5000, 15000));

            this.scheduleRandomSpeedChange();
        }, delay);
    }

    // 工具函数
    randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    randomFloat(min, max) {
        return Math.random() * (max - min) + min;
    }

    randomChoice(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    randomInterval(min, max) {
        return this.randomInt(min, max);
    }

    registerTimeout(callback, delay) {
        let timeoutId = null;
        timeoutId = setTimeout(() => {
            this.removePendingTimeout(timeoutId);
            callback();
        }, delay);
        this.pendingTimeouts.push(timeoutId);
        return timeoutId;
    }

    removePendingTimeout(timeoutId) {
        this.pendingTimeouts = this.pendingTimeouts.filter(id => id !== timeoutId);
    }
}

module.exports = BehaviorSystem;
