# Jellyfish Desktop Pet - GEMINI Context

## Project Overview

**Jellyfish Desktop Pet** is an autonomous desktop application featuring a pixel-art jellyfish that roams freely across the user's screen. It is built using **Electron** for the desktop environment and the HTML5 **Canvas 2D API** for rendering.

**Key Features:**
*   **Autonomous AI:** The pet moves, acts, and changes expressions unpredictably without user interaction.
*   **Overlay Window:** Runs in a transparent, full-screen, always-on-top window that allows mouse events to pass through (click-through).
*   **Performance:** Optimized for low resource usage (~1-2% CPU) using `requestAnimationFrame` and minimal DOM manipulation.

**Tech Stack:**
*   **Runtime:** Node.js, Electron (v28.0.0+)
*   **Frontend:** HTML5, CSS (inline), JavaScript (Canvas API)
*   **Build Tool:** `electron-builder`

---

## Building and Running

### Prerequisites
*   Node.js and npm installed.

### Commands

| Command | Description |
| :--- | :--- |
| `npm install` | Install project dependencies. |
| `npm start` | Run the application in production mode. |
| `npm run dev` | Run in development mode with DevTools open and `NODE_ENV=development`. |
| `npm run build:win` | Build for Windows (NSIS, Portable). |
| `npm run build:mac` | Build for macOS (DMG). |
| `npm run build:linux` | Build for Linux (AppImage, deb). |
| `npm run build:all` | Build for all platforms. |
| `npm run clean` | Clean build artifacts using `scripts/clean.js`. |

---

## Project Architecture & Key Files

The project follows the standard Electron **Main** vs. **Renderer** process architecture.

### 1. Main Process (`src/main/`)
Handles application lifecycle, native window management, and system integration.

*   **`src/main/index.js`**: Entry point. Initializes the app and IPC handlers.
*   **`src/main/window.js`**: Creates the full-screen transparent browser window (`BrowserWindow`). Manages window properties (transparent, alwaysOnTop, ignoreMouseEvents).
*   **`src/main/tray.js`**: Manages the system tray icon and context menu (Quit, About, etc.).
*   **`src/main/config.js`**: Centralized configuration file for defaults (window settings, pet colors, behavior toggles).

### 2. Renderer Process (`src/renderer/`)
Handles the visual presentation, animations, and AI logic within the browser window.

*   **`src/renderer/index.html`**: The entry HTML file containing the `<canvas>` element.
*   **`src/renderer/index.js`**: Renderer entry point. Initializes the `Pet`, `Canvas`, and `Behavior` modules.
*   **`src/renderer/canvas.js`**: The rendering engine. Draws the pixel-art jellyfish frame-by-frame on the HTML5 Canvas.
*   **`src/renderer/pet.js`**: State management for the pet (position, velocity, current expression, animation frames).
*   **`src/renderer/behavior.js`**: The "Brain". Implements the autonomous AI, controlling movement patterns (zigzag, curve), random actions (spin, bounce), and expressions.

---

## Development Conventions

*   **Language:** Pure JavaScript (ES6+). No transpilers (TypeScript/Babel) are currently used.
*   **Styling:** Inline CSS is used in `index.html` to minimize file count and complexity.
*   **Assets:** Icons are stored in `assets/icons/`. The pet itself is drawn procedurally/pixel-by-pixel in `canvas.js`, not loaded from image files.
*   **IPC:** Communication between Main and Renderer processes uses Electron's IPC (`ipcMain`, `ipcRenderer`).
    *   *Main -> Renderer:* `toggle-behavior`
    *   *Renderer -> Main:* `get-config`, `get-screen-size`, `quit-app`, `show-window`
*   **Configuration:** All tunable parameters (speed, colors, intervals) should be placed in `src/main/config.js`.

## Codebase Map

```
F:\WorkSpace\WebStorm\Jellyfish-Desktop-Pet\
├── src\
│   ├── main\          # Backend logic (Node.js/Electron)
│   └── renderer\      # Frontend logic (Browser/Canvas)
├── assets\            # Static resources (Icons)
├── docs\              # Documentation
├── dist\              # Build outputs
└── scripts\           # Utility scripts
```
