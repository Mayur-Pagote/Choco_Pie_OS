
# Choco Pie OS

> What if π wasn’t just a number, but an entire operating system?

Choco Pie OS is a **browser-based desktop operating system** built using a modular, OS-like architecture. It combines creativity, education, and system design into a single interactive platform inspired by **Mathematical π, Raspberry Pi, and Pie**.



## 🌐 Live Demo

👉 https://choco-pie-os.vercel.app/

---

## Features

- Full desktop OS experience in the browser (React + Next.js)
- Window manager with real-time state handling
- VS Code Lite (run Python, C, and C++ in-browser)
- Pi-based apps (simulation, art, mandala, explorer, quiz)
- Game Center with multiple games
- Modular app architecture (plug-and-play system)
- Themed UI inspired by Raspberry Pi OS + Choco Pie aesthetics


## Architecture Overview

Choco Pie OS is designed like a real operating system:

- **OS Shell** → Desktop, window manager, taskbar, notifications  
- **App System** → All features run as modular applications  
- **App Dispatcher** → Controls app rendering and lifecycle  
- **State Management** → Centralized using Zustand  
- **Core Services** → File system, theme engine, event system  
- **Subsystems** → VS Code Lite, GamePi, Pi Apps  


## All Things Pi

This project brings together all interpretations of “Pi”:

- Mathematical π → simulations, generative art, music  
- Raspberry Pi → OS-inspired UI and system design  
- Pie → theme, identity, and visual design  


## Tech Stack

- **Frontend:** React, Next.js, TypeScript  
- **Styling:** Tailwind CSS  
- **State Management:** Zustand  
- **Execution Engines:** Skulpt (Python), JS-based compilers  
- **APIs:** Web Audio API, Canvas API  



## Project Structure

```

app/            → Entry & routing
components/     → UI components
lib/            → Core logic & utilities
store/          → Zustand state management
public/         → Static assets
types/          → Type definitions

````


## Installation

```bash
git clone https://github.com/Mayur-Pagote/Choco_Pie_OS.git
cd Choco_Pie_OS
npm install
npm run dev
````




## 🔓 License

This project is licensed under the **MIT License**.

