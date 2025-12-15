# 📁 项目结构 | Project Structure

## 最终精简目录结构 | Final Clean Directory Structure

```
Jellyfish-Desktop-Pet/
├── .git/                      # Git 仓库 | Git repository
├── .gitignore                 # Git 忽略规则 | Git ignore rules
├── LICENSE                    # MIT 许可证 | MIT License
├── README.md                  # 项目文档（中英双语）| Project docs (bilingual)
├── PROJECT_STRUCTURE.md       # 本文档 | This document
├── package.json               # 项目配置和依赖 | Project config & dependencies
├── package-lock.json          # 锁定的依赖版本 | Locked dependencies
│
├── src/
│   ├── main/                  # 主进程（Electron 后端）| Main process (backend)
│   │   ├── index.js          # 应用程序入口 | Application entry point
│   │   ├── window.js         # 窗口管理（全屏）| Window management (fullscreen)
│   │   ├── tray.js           # 系统托盘 | System tray
│   │   └── config.js         # 应用配置 | Application configuration
│   │
│   └── renderer/              # 渲染进程（前端）| Renderer process (frontend)
│       ├── index.html        # 主 HTML 页面 | Main HTML page
│       ├── index.js          # 渲染进程入口 | Renderer entry point
│       ├── pet.js            # 宠物状态管理 | Pet state management
│       ├── canvas.js         # Canvas 渲染引擎 | Canvas rendering engine
│       └── behavior.js       # AI 行为系统 | AI behavior system
│
├── assets/
│   └── icons/
│       └── icon.png          # 托盘图标 (2.2MB) | Tray icon (2.2MB)
│
├── scripts/
│   └── clean.js              # 构建清理工具 | Build cleanup utility
│
├── docs/
│   └── development.md        # 开发指南 | Development guide
│
├── dist/                     # 构建输出（自动生成）| Build output (auto-generated)
└── node_modules/             # 依赖包（自动安装）| Dependencies (auto-installed)
```

---

## 核心文件说明 | Core Files Description

### 主进程（后端）| Main Process (Backend)

#### `src/main/index.js`
- **中文**: 应用初始化，IPC 处理器注册
- **English**: App initialization, IPC handlers registration
- **职责**: 应用生命周期管理
- **Responsibility**: Application lifecycle management

#### `src/main/window.js`
- **中文**: 创建全屏透明覆盖窗口
- **English**: Creates fullscreen transparent overlay window
- **职责**: 窗口创建、显示、隐藏、定位
- **Responsibility**: Window creation, show, hide, positioning

#### `src/main/tray.js`
- **中文**: 系统托盘图标和菜单
- **English**: System tray icon and menu
- **职责**: 托盘交互、菜单管理
- **Responsibility**: Tray interactions, menu management

#### `src/main/config.js`
- **中文**: 所有配置（窗口、宠物、行为）
- **English**: All configuration (window, pet, behavior)
- **职责**: 集中配置管理
- **Responsibility**: Centralized configuration

---

### 渲染进程（前端）| Renderer Process (Frontend)

#### `src/renderer/index.html`
- **中文**: 最小化全屏 Canvas 容器
- **English**: Minimal fullscreen canvas container
- **特点**: 内联 CSS，无外部样式
- **Feature**: Inline CSS, no external styles

#### `src/renderer/index.js`
- **中文**: 初始化宠物、Canvas 和 AI 行为
- **English**: Initializes pet, canvas, and AI behavior
- **职责**: 协调所有渲染模块
- **Responsibility**: Coordinates all renderer modules

#### `src/renderer/pet.js`
- **中文**: 宠物状态（位置、速度、表情、动画）
- **English**: Pet state (position, velocity, expression, animations)
- **核心属性**:
  - `state`: 位置、速度、表情 | position, velocity, expression
  - `animation`: 浮动、触须、眨眼 | floating, tentacles, blinking
  - `target`: 移动目标 | movement target

#### `src/renderer/canvas.js`
- **中文**: 全屏像素艺术渲染
- **English**: Pixel art rendering on fullscreen canvas
- **功能**:
  - 像素风格水母绘制 | Pixel-style jellyfish drawing
  - 60 FPS 渲染循环 | 60 FPS rendering loop
  - 动态触须动画 | Dynamic tentacle animation

#### `src/renderer/behavior.js`
- **中文**: 自主 AI 系统（移动、动作、表情）
- **English**: Autonomous AI system (movement, actions, expressions)
- **行为类型**:
  - 移动模式: 直线、曲线、之字形、漫游 | Movement: direct, curve, zigzag, wander
  - 动作: 暂停、旋转、抖动、弹跳、漂移 | Actions: pause, spin, shake, bounce, drift
  - 表情: 平静、开心、好奇、困倦 | Expressions: idle, happy, curious, sleepy

---

## 文件统计 | File Statistics

### 按类型 | By Type
| 类型 Type | 数量 Count | 说明 Description |
|-----------|------------|------------------|
| JavaScript | 9 | 核心源码 \| Core source |
| HTML | 1 | 渲染页面 \| Render page |
| Markdown | 3 | 文档 \| Documentation |
| JSON | 1 | 配置 \| Configuration |
| PNG | 1 | 图标 \| Icon |
| **总计 Total** | **15** | **基本文件 \| Essential files** |

### 代码行数统计（估算）| Lines of Code (Estimated)
| 文件 File | 行数 Lines | 用途 Purpose |
|-----------|-----------|--------------|
| behavior.js | ~330 | AI 行为系统 |
| canvas.js | ~140 | 渲染引擎 |
| pet.js | ~160 | 状态管理 |
| window.js | ~100 | 窗口管理 |
| index.js (main) | ~125 | 主进程 |
| tray.js | ~95 | 系统托盘 |
| config.js | ~50 | 配置 |
| index.js (renderer) | ~60 | 渲染入口 |
| index.html | ~50 | HTML |
| **总计 Total** | **~1110** | **核心代码** |

---

## 已删除文件（清理）| Removed Files (Cleanup)

以下文件/目录已被移除，因为不再需要：

The following files/directories have been removed as they're no longer needed:

- ❌ `files.zip` - 原始压缩包 | Original archive
- ❌ `extracted_files/` - 临时解压目录 | Temporary extraction
- ❌ `src/renderer/interaction.js` - 不需要交互 | No interaction needed
- ❌ `src/styles/` - 改用内联 CSS | Changed to inline CSS
  - ❌ `main.css`
  - ❌ `menu.css`
  - ❌ `animations.css`
- ❌ `src/utils/` - 未使用的工具函数 | Unused utilities
  - ❌ `logger.js`
  - ❌ `storage.js`
  - ❌ `helpers.js`
- ❌ `config/` - 空目录 | Empty directory
- ❌ `build/` - electron-builder 自动处理 | Handled by electron-builder
- ❌ `assets/images/` - 未使用 | Not used
- ❌ `assets/sounds/` - 未使用 | Not used

---

## 依赖关系图 | Dependency Graph

```
main/index.js (入口 | Entry)
    │
    ├── main/window.js (窗口 | Window)
    ├── main/tray.js (托盘 | Tray)
    └── main/config.js (配置 | Config)

renderer/index.js (渲染入口 | Renderer Entry)
    │
    ├── renderer/pet.js (状态 | State)
    │   └── renderer/canvas.js (渲染 | Rendering)
    │
    └── renderer/behavior.js (AI)
        └── renderer/pet.js (控制 | Control)
```

---

## 模块通信 | Module Communication

### IPC 通信 | IPC Communication

**主进程 → 渲染进程 | Main → Renderer**
- `toggle-behavior`: 切换 AI 行为 | Toggle AI behavior

**渲染进程 → 主进程 | Renderer → Main**
- `get-config`: 获取配置 | Get configuration
- `get-screen-size`: 获取屏幕尺寸 | Get screen size
- `quit-app`: 退出应用 | Quit application
- `show-window`: 显示窗口 | Show window
- `hide-window`: 隐藏窗口 | Hide window

---

## 性能优化 | Performance Optimization

### 已实现 | Implemented
- ✅ Canvas 离屏渲染准备 | Offscreen canvas ready
- ✅ requestAnimationFrame 动画循环 | RAF animation loop
- ✅ 最小化 DOM 操作 | Minimize DOM operations
- ✅ 事件委托 | Event delegation
- ✅ 鼠标穿透减少事件处理 | Mouse-transparent reduces events

### 可优化空间 | Future Optimization
- 🔄 Web Workers 用于 AI 计算 | Web Workers for AI calculations
- 🔄 Canvas 位图缓存 | Canvas bitmap caching
- 🔄 动画帧跳过（低电量模式）| Frame skipping (low battery mode)

---

## 开发工作流 | Development Workflow

1. **修改代码 | Edit Code**
   ```bash
   # 编辑 src/ 下的文件
   # Edit files under src/
   ```

2. **测试运行 | Test Run**
   ```bash
   npm start          # 正常运行 | Normal run
   npm run dev        # 开发模式 | Dev mode
   ```

3. **打包发布 | Build Release**
   ```bash
   npm run build:win  # Windows
   npm run build:mac  # macOS
   npm run build:linux # Linux
   ```

---

## 项目规模 | Project Scale

**总体评估 | Overall Assessment**
- **规模 | Scale**: 小型 | Small (~1100 LOC)
- **复杂度 | Complexity**: 中等 | Medium
- **维护性 | Maintainability**: 高 | High
- **可扩展性 | Extensibility**: 高 | High
- **代码质量 | Code Quality**: 良好 | Good

**技术栈 | Tech Stack**
- Electron 28.0
- Canvas 2D API
- Node.js (内置 | Built-in)
- 纯 JavaScript | Pure JavaScript

---

**最后更新 | Last Updated**: 2024-12-15
**版本 | Version**: 2.0.0
