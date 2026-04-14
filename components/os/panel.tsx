"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";

import { AppIcon } from "@/components/icons/pi-icons";
import { useOsStore } from "@/store/os-store";

import { SystemTray } from "./system-tray";

function ClockDisplay() {
  const [mounted, setMounted] = useState(false);
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    setMounted(true);
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="text-[13px] font-bold text-[var(--desktop-panel-text)]" suppressHydrationWarning>
      {mounted ? now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false }) : "--:--"}
    </div>
  );
}

function PanelSeparator() {
  return <div className="h-7 w-px bg-[var(--desktop-panel-separator)]" />;
}

function LauncherButton({
  icon,
  label,
  onClick,
  active = false,
  rounded = false,
  className = "w-10",
}: {
  icon: ReactNode;
  label: string;
  onClick: () => void;
  active?: boolean;
  rounded?: boolean;
  className?: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      data-active={active}
      onClick={(event) => {
        event.stopPropagation();
        onClick();
      }}
      className={`desktop-panel-button flex h-9 items-center justify-center ${
        rounded ? "rounded-full" : "rounded-sm"
      } ${className}`}
    >
      {icon}
    </button>
  );
}

export function Panel({
  startMenuOpen,
  onToggleStartMenu,
}: {
  startMenuOpen: boolean;
  onToggleStartMenu: () => void;
}) {
  const [clockOpen, setClockOpen] = useState(false);
  const windows = useOsStore((state) => state.windows);
  const activeWindowId = useOsStore((state) => state.activeWindowId);
  const focusWindow = useOsStore((state) => state.focusWindow);
  const minimizeWindow = useOsStore((state) => state.minimizeWindow);
  const restoreWindow = useOsStore((state) => state.restoreWindow);
  const openApp = useOsStore((state) => state.openApp);
  const desktopBehavior = useOsStore((state) => state.desktopBehavior);

  const panelControlShapeClass = desktopBehavior.roundedPanelControls
    ? "rounded-full"
    : "rounded-sm";
  const taskButtonPaddingClass = desktopBehavior.compactTaskButtons
    ? "max-w-[128px] px-1.5 py-1 text-[11px]"
    : "max-w-[170px] px-2 py-1 text-xs";

  return (
    <div className="desktop-panel absolute inset-x-0 top-0 z-[300] h-10 px-2">
      <div className="flex h-full items-center justify-between gap-3">
        <div className="flex min-w-0 flex-1 items-center gap-1 overflow-hidden">
          <LauncherButton
            icon={<AppIcon name="choco" className="h-5 w-10" />}
            label="Main menu"
            active={startMenuOpen}
            onClick={onToggleStartMenu}
            rounded={desktopBehavior.roundedPanelControls}
            className="w-14"
          />
          <PanelSeparator />
          <LauncherButton
            icon={<AppIcon name="browser" className="h-7 w-7" />}
            label="Internet"
            onClick={() => openApp("browser")}
            rounded={desktopBehavior.roundedPanelControls}
          />
          <LauncherButton
            icon={<AppIcon name="files" className="h-7 w-7" />}
            label="File Manager"
            onClick={() => openApp("files")}
            rounded={desktopBehavior.roundedPanelControls}
          />
          <LauncherButton
            icon={<AppIcon name="terminal" className="h-7 w-7" />}
            label="Terminal"
            onClick={() => openApp("terminal")}
            rounded={desktopBehavior.roundedPanelControls}
          />
          {windows.length > 0 ? <PanelSeparator /> : null}
          <div className="scrollbar-thin flex min-w-0 items-center gap-1 overflow-x-auto">
            {windows.map((window) => {
              const isActive = activeWindowId === window.id && !window.minimized;

              return (
                <button
                  key={window.id}
                  type="button"
                  data-active={isActive}
                  onClick={() => {
                    if (isActive) {
                      minimizeWindow(window.id);
                      return;
                    }

                    if (window.minimized) {
                      restoreWindow(window.id);
                      return;
                    }

                    focusWindow(window.id);
                  }}
                  className={`desktop-panel-button ${panelControlShapeClass} ${taskButtonPaddingClass} text-[var(--desktop-panel-text)]`}
                >
                  <span className="flex min-w-0 items-center gap-1.5">
                    <AppIcon name={window.icon} className="h-4 w-4 shrink-0" />
                    <span className="truncate">{window.title}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="relative flex shrink-0 items-center gap-3">
          <SystemTray />
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              setClockOpen((current) => !current);
            }}
            className={`desktop-panel-button ${panelControlShapeClass} px-2 py-1`}
          >
            <ClockDisplay />
          </button>

          {clockOpen ? (
            <div className="desktop-flyout absolute right-0 top-10 min-w-[210px] rounded p-3">
              <div className="text-sm font-semibold text-[var(--desktop-flyout-text)]">
                {new Date().toLocaleDateString([], {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </div>
              <div className="mt-2 text-xs text-[var(--desktop-flyout-muted)]">
                Click taskbar icons to toggle Wi-Fi, Bluetooth, layout, updates, and audio.
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
