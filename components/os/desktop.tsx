"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { APP_DEFINITIONS, APP_MAP } from "@/lib/apps";
import {
  clampDesktopIconPosition,
  DEFAULT_VIEWPORT,
  getDesktopIconDefaultPosition,
  getViewportSize,
} from "@/lib/desktop-layout";
import { WALLPAPERS } from "@/lib/wallpapers";
import { useOsStore } from "@/store/os-store";
import { DesktopIconPositions, AppId } from "@/types/os";
import { BootScreen } from "./boot-screen";
import { ContextMenu } from "./context-menu";
import { DesktopIcon } from "./desktop-icon";
import { NotificationsCenter } from "./notifications-center";
import { Panel } from "./panel";
import { StartMenu } from "./start-menu";
import { WindowManager } from "./window-manager";

const BOOT_DURATION_MS = 2200;
const REQUIRED_DESKTOP_APP_IDS: readonly AppId[] = [
  "pico-playground",
  "raspberry-pi-5-simulator",
];

export function DesktopShell() {
  const openApp = useOsStore((state) => state.openApp);
  const wallpaperId = useOsStore((state) => state.wallpaperId);
  const setWallpaper = useOsStore((state) => state.setWallpaper);
  const pushNotification = useOsStore((state) => state.pushNotification);
  const booted = useOsStore((state) => state.booted);
  const setBooted = useOsStore((state) => state.setBooted);
  const desktopTheme = useOsStore((state) => state.desktopTheme);
  const desktopIconPositions = useOsStore((state) => state.desktopIconPositions);
  const setDesktopIconPosition = useOsStore((state) => state.setDesktopIconPosition);
  const setDesktopIconPositions = useOsStore((state) => state.setDesktopIconPositions);

  const [startMenuOpen, setStartMenuOpen] = useState(false);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
  const [selectedDesktopItem, setSelectedDesktopItem] = useState<AppId | null>(null);
  const [viewportSize, setViewportSize] = useState(DEFAULT_VIEWPORT);
  const [mounted, setMounted] = useState(false);
  const lastArrangedViewportRef = useRef<{ width: number; height: number } | null>(null);

  const wallpaper = useMemo(
    () => WALLPAPERS.find((entry) => entry.id === wallpaperId) ?? WALLPAPERS[0],
    [wallpaperId],
  );
  const pinnedDesktopApps = useMemo(
    () => REQUIRED_DESKTOP_APP_IDS.map((appId) => APP_MAP[appId]),
    [],
  );
  const desktopApps = useMemo(
    () => {
      const requiredDesktopApps = new Set<AppId>(REQUIRED_DESKTOP_APP_IDS);

      return APP_DEFINITIONS.filter(
        (app) => app.desktop && !requiredDesktopApps.has(app.id),
      );
    },
    [],
  );

  useEffect(() => {
    if (booted) {
      return;
    }

    const timer = window.setTimeout(() => {
      setBooted(true);
      pushNotification("Welcome", "Choco Pie desktop is ready.");
    }, BOOT_DURATION_MS);

    return () => window.clearTimeout(timer);
  }, [booted, pushNotification, setBooted]);

  useEffect(() => {
    document.documentElement.style.setProperty("--wallpaper-accent", wallpaper.accent);
  }, [wallpaper.accent]);

  useEffect(() => {
    document.documentElement.setAttribute("data-os-theme", desktopTheme);
  }, [desktopTheme]);

  useEffect(() => {
    setMounted(true);

    const syncViewport = () => setViewportSize(getViewportSize());

    syncViewport();
    window.addEventListener("resize", syncViewport);
    return () => window.removeEventListener("resize", syncViewport);
  }, []);

  const effectiveViewport = mounted ? viewportSize : DEFAULT_VIEWPORT;
  const effectiveDesktopIconPositions = mounted ? desktopIconPositions : {};

  useEffect(() => {
    if (!mounted) {
      return;
    }

    const lastArrangedViewport = lastArrangedViewportRef.current;
    if (
      lastArrangedViewport &&
      lastArrangedViewport.width === viewportSize.width &&
      lastArrangedViewport.height === viewportSize.height
    ) {
      return;
    }

    const arrangedApps = [...pinnedDesktopApps, ...desktopApps];
    const nextPositions = arrangedApps.reduce<DesktopIconPositions>((positions, app, index) => {
      const defaultPosition = getDesktopIconDefaultPosition(index, viewportSize.height);
      positions[app.id] = clampDesktopIconPosition(
        defaultPosition,
        viewportSize.width,
        viewportSize.height,
      );
      return positions;
    }, {});

    lastArrangedViewportRef.current = viewportSize;
    setDesktopIconPositions(nextPositions);
    setSelectedDesktopItem(null);
  }, [desktopApps, mounted, pinnedDesktopApps, setDesktopIconPositions, viewportSize]);

  const rotateWallpaper = () => {
    const currentIndex = WALLPAPERS.findIndex((entry) => entry.id === wallpaperId);
    const next = WALLPAPERS[(currentIndex + 1) % WALLPAPERS.length];
    setWallpaper(next.id);
    pushNotification("Wallpaper Changed", `${next.name} is now active.`);
  };

  const autoArrangeDesktopApps = () => {
    const arrangedApps = [...pinnedDesktopApps, ...desktopApps];
    const nextPositions = arrangedApps.reduce<DesktopIconPositions>((positions, app, index) => {
      const defaultPosition = getDesktopIconDefaultPosition(index, effectiveViewport.height);
      positions[app.id] = clampDesktopIconPosition(
        defaultPosition,
        effectiveViewport.width,
        effectiveViewport.height,
      );
      return positions;
    }, {});

    setDesktopIconPositions(nextPositions);
    setSelectedDesktopItem(null);
    setContextMenu(null);
    pushNotification("Desktop Arranged", "All desktop apps have been arranged tightly.");
  };

  return (
    <main
      className="relative h-screen w-screen overflow-hidden bg-[var(--desktop-shell-bg)] text-[var(--desktop-text)]"
      onClick={() => {
        setStartMenuOpen(false);
        setContextMenu(null);
        setSelectedDesktopItem(null);
      }}
      onContextMenu={(event) => {
        event.preventDefault();
        setStartMenuOpen(false);
        setSelectedDesktopItem(null);
        setContextMenu({ x: event.clientX, y: event.clientY });
      }}
    >
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${wallpaper.src})` }} />
      <div className="absolute inset-0 desktop-overlay" />
      <div className="desktop-grid absolute inset-0 opacity-10" />

      <div className="absolute inset-0 z-10">
        {pinnedDesktopApps.map((app, index) => {
          const defaultPosition = getDesktopIconDefaultPosition(index, effectiveViewport.height);
          const position = clampDesktopIconPosition(
            effectiveDesktopIconPositions[app.id] ?? defaultPosition,
            effectiveViewport.width,
            effectiveViewport.height,
          );

          return (
            <DesktopIcon
              key={app.id}
              app={app}
              position={position}
              selected={selectedDesktopItem === app.id}
              onSelect={() => setSelectedDesktopItem(app.id)}
              onOpen={() => openApp(app.id)}
              onMove={(x, y) => setDesktopIconPosition(app.id, x, y)}
            />
          );
        })}
        {desktopApps.map((app, index) => {
          const defaultPosition = getDesktopIconDefaultPosition(
            index + pinnedDesktopApps.length,
            effectiveViewport.height,
          );
          const position = clampDesktopIconPosition(
            effectiveDesktopIconPositions[app.id] ?? defaultPosition,
            effectiveViewport.width,
            effectiveViewport.height,
          );

          return (
            <DesktopIcon
              key={app.id}
              app={app}
              position={position}
              selected={selectedDesktopItem === app.id}
              onSelect={() => setSelectedDesktopItem(app.id)}
              onOpen={() => openApp(app.id)}
              onMove={(x, y) => setDesktopIconPosition(app.id, x, y)}
            />
          );
        })}
      </div>

      <WindowManager />
      <NotificationsCenter />

      {contextMenu ? (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          actions={[
            {
              label: "Open Terminal",
              onClick: () => {
                openApp("terminal");
                setContextMenu(null);
              },
            },
            {
              label: "Open File Manager",
              onClick: () => {
                openApp("files");
                setContextMenu(null);
              },
            },
            {
              label: "Change Wallpaper",
              onClick: () => {
                rotateWallpaper();
                setContextMenu(null);
              },
            },
            {
              label: "Control Centre",
              onClick: () => {
                openApp("settings");
                setContextMenu(null);
              },
            },
            {
              label: "Auto Arrange Apps",
              onClick: autoArrangeDesktopApps,
            },
          ]}
        />
      ) : null}

      {startMenuOpen ? (
        <StartMenu
          onLaunchApp={(appId) => openApp(appId)}
          onNotify={(title, message) => pushNotification(title, message)}
          onClose={() => setStartMenuOpen(false)}
        />
      ) : null}

      <Panel
        startMenuOpen={startMenuOpen}
        onToggleStartMenu={() => {
          setContextMenu(null);
          setStartMenuOpen((current) => !current);
        }}
      />

      {!booted ? <BootScreen durationMs={BOOT_DURATION_MS} /> : null}
    </main>
  );
}
