# 🎐 水母桌面宠物 - 自主AI版本
# Jellyfish Desktop Pet - Autonomous AI Edition

一个在整个屏幕上自由漫游的自主桌面宠物，具有不可预测的AI行为。

An autonomous desktop pet that roams freely across your entire screen with unpredictable AI behavior.

![Version](https://img.shields.io/badge/version-2.0.0-blue)
![Electron](https://img.shields.io/badge/electron-28.0.0-9feaf9)
![License](https://img.shields.io/badge/license-MIT-green)

---

## 🎯 设计理念 | Design Philosophy

这不仅仅是一个桌面小部件 - 它是一个在您屏幕上生活的**自主数字生物**：

This is not just a desktop widget - it's an **autonomous digital creature** that lives on your screen:

- **🌊 全屏自由** - 不局限于窗口，水母在整个屏幕上漫游
  - **Full Screen Freedom** - Not confined to a window, roams across your entire screen

- **🚫 零交互** - 没有点击、拖拽或命令，它只是自主存在和行动
  - **Zero Interaction** - No clicking, dragging, or commands. It just exists and behaves on its own

- **🎲 不可预测AI** - 像真实生物一样，你永远不知道它下一步会做什么
  - **Unpredictable AI** - Like a real creature, you never know what it will do next

- **👻 非侵入式** - 完全鼠标穿透，不会干扰您的工作
  - **Non-intrusive** - Completely mouse-transparent, won't interfere with your work

---

## ✨ 核心特性 | Features

### 🐟 多宠物与多物种支持 | Multi-Pet & Multi-Species (NEW)
- 默认可同时出现 1~5 只宠物自主活动
- 不同宠物可使用不同颜色和物种（水母 / 简单鱼类）
- 宠物之间会轻微避让，不会完全重叠
- 在 `config.js` 的 `multiPet` 中调整数量

### 🤖 自主行为系统 | Autonomous Behavior System

**多种移动模式 | Multiple Movement Patterns**
- 直线移动 | Direct movement
- 曲线路径 | Curved paths
- 之字形模式 | Zigzag patterns
- 漫游模式 | Wandering mode

**随机动作 | Random Actions**
- 突然暂停 | Sudden pauses
- 速度变化（2-4倍加速或0.3-0.6倍减速）| Speed changes (2-4x faster or 0.3-0.6x slower)
- 旋转 | Spinning
- 抖动 | Shaking
- 弹跳 | Bouncing
- 随机方向漂移 | Drifting in random directions

**表情变化 | Expression Changes**
- 平静 | Idle
- 开心 | Happy
- 好奇 | Curious
- 困倦 | Sleepy

### 🛠️ 技术特性 | Technical Features
- ✅ 全屏透明覆盖层 | Fullscreen transparent overlay
- ✅ 鼠标穿透（不阻挡您的交互）| Mouse-transparent (won't block interactions)
- ✅ 60 FPS 流畅动画 | 60 FPS smooth animation
- ✅ 像素艺术风格渲染 | Pixel art style rendering
- ✅ 跨平台（Windows/Mac/Linux）| Cross-platform support

---

## 🚀 快速开始 | Quick Start

### 安装依赖 | Install Dependencies
```bash
npm install
```

### 运行宠物 | Run the Pet
```bash
npm start
```

### 开发模式（带开发者工具）| Development Mode (with DevTools)
```bash
npm run dev
```

宠物将出现并开始在您的屏幕上自主漫游！

The pet will appear and start roaming your screen autonomously!

---

## 📖 工作原理 | How It Works

### 架构 | Architecture

```
全屏透明窗口 | Fullscreen Transparent Window
    |
    +-- Canvas 渲染引擎 | Canvas Rendering Engine
    +-- 宠物状态管理 | Pet State Management
    +-- AI 行为系统 | AI Behavior System
```

**技术实现 | Technical Implementation**
- **窗口层 | Window Layer**: 全屏透明覆盖层，始终置顶但鼠标穿透
  - Fullscreen transparent overlay that's always on top but mouse-transparent

- **渲染 | Rendering**: Canvas 2D 像素艺术，60 FPS 渲染
  - Canvas 2D pixel art rendering at 60 FPS

- **AI系统 | AI System**: 多个独立运行的定时器控制不同行为
  - Multiple timers for different behaviors running independently

### AI 行为时间表 | AI Behavior Timings

| 行为 Behavior | 间隔 Interval | 持续时间 Duration |
|--------------|--------------|------------------|
| 移动 Movement | 每 3-8 秒 | 到达目标为止 |
| 动作 Actions | 每 4-10 秒 | 瞬时或2-4秒 |
| 表情 Expression | 每 8-20 秒 | 3-8 秒 |
| 速度变化 Speed | 每 10-25 秒 | 5-15 秒 |

所有时间都是随机化的，创造不可预测的行为。

All timings are randomized to create unpredictable behavior.

---

## ⚙️ 配置 | Configuration

编辑 `src/main/config.js` 来自定义：

Edit `src/main/config.js` to customize:

```javascript
behavior: {
    walkSpeed: 3,              // 基础移动速度 | Base movement speed
    blinkInterval: 4000,       // 眨眼频率 | Blink frequency
    autonomousMode: true,      // 完全自主 | Full autonomy
    unpredictable: true        // 随机行为 | Random behavior
}

pet: {
    defaultColor: '#FFB3D9',   // 默认颜色（粉色）| Default color (pink)
    size: 64,                  // 尺寸（像素）| Size (pixels)
}
```

---

## 🎨 自定义 | Customization

### 更改宠物外观 | Change Pet Appearance

编辑 `src/renderer/canvas.js` - 修改 `getJellyfishPixels()` 方法来创建您自己的像素艺术生物。

Edit `src/renderer/canvas.js` - modify the `getJellyfishPixels()` method to create your own pixel art creature.

```javascript
getJellyfishPixels(expression) {
    const body = [
        [28, 16], [32, 16], [36, 16],  // 头部 | Head
        // ... 添加更多像素坐标 | Add more pixel coordinates
    ];

    const eyes = [[24, 28], [40, 28]];  // 眼睛 | Eyes

    return { body, eyes };
}
```

### 添加新行为 | Add New Behaviors

编辑 `src/renderer/behavior.js` - 在 `randomAction()` 方法中添加新动作：

Edit `src/renderer/behavior.js` - add new actions to the `randomAction()` method:

```javascript
const actions = [
    'pause', 'spin', 'shake', 'bounce',
    'your_new_action'  // 在这里添加 | Add here
];
```

### 修改移动模式 | Modify Movement Patterns

在 `behavior.js` 中添加新的移动模式：

Add new movement patterns in `behavior.js`:

```javascript
this.movePatterns = ['direct', 'curve', 'zigzag', 'wander', 'your_pattern'];
```

---

## 🖱️ 系统托盘 | System Tray

右键点击托盘图标可以：

Right-click the tray icon to:
- 显示/隐藏宠物 | Show/Hide Pet
- 暂停/启用行为 | Pause/Enable Behavior
- 居中窗口 | Center Window
- 关于 | About
- 退出 | Quit

---

## 📦 打包发布 | Building for Distribution

```bash
# Windows
npm run build:win

# macOS
npm run build:mac

# Linux
npm run build:linux

# 所有平台 | All platforms
npm run build:all
```

打包后的文件在 `dist/` 目录。

Built files will be in the `dist/` directory.

---

## 💭 设计思考 | Philosophy & Design Notes

这个宠物被设计为：

This pet is designed to be:

1. **真正自主 | Truly Autonomous** - 不等待您的输入 | Doesn't wait for your input
2. **不可预测 | Unpredictable** - 像真实宠物一样 | Just like a real pet
3. **非侵入式 | Non-Intrusive** - 不干扰您的工作 | Won't interfere with your work
4. **环境氛围 | Ambient** - 像有一个鱼缸在屏幕上 | Like having a fish tank on your screen

---

## 📊 性能 | Performance

- **CPU**: 现代系统上约 1-2% | ~1-2% on modern systems
- **RAM**: 约 100-150 MB | ~100-150 MB
- **磁盘**: 启动后无磁盘I/O | No disk I/O after startup

---

## 🔧 故障排除 | Troubleshooting

### 宠物不可见？| Pet not visible?
- 检查窗口是否隐藏（托盘图标 → 显示宠物）
- Check if window is hidden (tray icon → Show Pet)
- 开发模式下按 `Ctrl+Shift+I` 打开开发者工具
- Press `Ctrl+Shift+I` in dev mode to open DevTools

### 宠物移动太快/太慢？| Pet moving too fast/slow?
- 在 `config.js` 中调整 `walkSpeed`
- Adjust `walkSpeed` in `config.js`

### 想要与它交互？| Want to interact with it?
- 此版本设计为非交互式
- This version is designed to be non-interactive
- 原始交互版本在 `interactive` 分支中
- The original interactive version is in the `interactive` branch

---

## 💡 未来想法 | Future Ideas

- [ ] 多个宠物 | Multiple pets
- [ ] 宠物间互动 | Pet-to-pet interactions
- [ ] 不同物种（鱼、蝴蝶等）| Different species (fish, butterfly, etc.)
- [ ] 屏幕边缘感知 | Screen edge awareness
- [ ] 基于时间的行为（晚上睡觉等）| Time-based behaviors (sleeps at night, etc.)
- [ ] 天气系统 | Weather system
- [ ] 情绪系统 | Mood system

---

## 📄 许可证 | License

MIT License - 详见 [LICENSE](LICENSE) 文件

MIT License - see [LICENSE](LICENSE) file

---

## 🙏 致谢 | Credits

- 灵感来源：经典桌面宠物 Shimeji | Inspired by classic desktop pets like Shimeji
- 技术：Electron + Canvas 2D | Built with Electron and Canvas 2D
- 风格：像素艺术渲染 | Pixel art rendering

---

**让您的屏幕充满生机！ | Let your screen come alive!** 🎐✨
