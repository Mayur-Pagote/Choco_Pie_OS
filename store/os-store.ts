"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { APP_MAP } from "@/lib/apps";
import { clampWindowBounds, getViewportSize } from "@/lib/desktop-layout";
import { DESKTOP_THEME_STORAGE_KEY, PI_SITE_THEME_STORAGE_KEY } from "@/lib/pi-apps";
import { WALLPAPERS } from "@/lib/wallpapers";
import {
  AppId,
  DesktopBehavior,
  DesktopIconPositions,
  DesktopTheme,
  NotificationItem,
  WallpaperId,
  WindowInstance,
  WindowPlacementMemory,
} from "@/types/os";

interface OsState {
  windows: WindowInstance[];
  activeWindowId: string | null;
  wallpaperId: WallpaperId;
  desktopTheme: DesktopTheme;
  desktopBehavior: DesktopBehavior;
  desktopIconPositions: DesktopIconPositions;
  windowPlacementMemory: WindowPlacementMemory;
  notifications: NotificationItem[];
  booted: boolean;
  openApp: (appId: AppId) => void;
  focusWindow: (id: string) => void;
  closeWindow: (id: string) => void;
  closeAllWindows: () => void;
  minimizeWindow: (id: string) => void;
  toggleMaximize: (id: string) => void;
  restoreWindow: (id: string) => void;
  updateWindowPosition: (id: string, x: number, y: number) => void;
  updateWindowSize: (id: string, width: number, height: number) => void;
  updateWindowBounds: (
    id: string,
    x: number,
    y: number,
    width: number,
    height: number,
  ) => void;
  setDesktopIconPosition: (appId: AppId, x: number, y: number) => void;
  setDesktopIconPositions: (positions: DesktopIconPositions) => void;
  setWallpaper: (id: WallpaperId) => void;
  setDesktopTheme: (theme: DesktopTheme) => void;
  setDesktopBehavior: (behavior: Partial<DesktopBehavior>) => void;
  toggleDesktopTheme: () => void;
  pushNotification: (title: string, message: string) => void;
  dismissNotification: (id: string) => void;
  setBooted: (value: boolean) => void;
}

const DESKTOP_OFFSET = { x: 56, y: 48 };
const WINDOW_STEP = 28;
const PI_OS_STATE_STORAGE_KEY = "pi-os-desktop-state";
const DEFAULT_DESKTOP_BEHAVIOR: DesktopBehavior = {
  roundedPanelControls: true,
  desktopNotifications: true,
  compactTaskButtons: false,
};

function nextZIndex(windows: WindowInstance[]) {
  return windows.reduce((max, window) => Math.max(max, window.zIndex), 10) + 1;
}

function getStoredDesktopTheme(): DesktopTheme {
  if (typeof window === "undefined") {
    return "light";
  }

  const stored =
    window.localStorage.getItem(DESKTOP_THEME_STORAGE_KEY) ??
    window.localStorage.getItem(PI_SITE_THEME_STORAGE_KEY);

  return stored === "dark" || stored === "light" ? stored : "light";
}

function persistDesktopTheme(theme: DesktopTheme) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(DESKTOP_THEME_STORAGE_KEY, theme);
  window.localStorage.setItem(PI_SITE_THEME_STORAGE_KEY, theme);
}

function getRememberedBounds(
  appId: AppId,
  existingCount: number,
  windowPlacementMemory: WindowPlacementMemory,
) {
  const rememberedBounds = windowPlacementMemory[appId];

  if (!rememberedBounds) {
    return undefined;
  }

  const app = APP_MAP[appId];
  const placementOffset = app.singleInstance ? 0 : existingCount * 18;
  const viewport = getViewportSize();

  return clampWindowBounds(
    {
      x: rememberedBounds.x + placementOffset,
      y: rememberedBounds.y + placementOffset,
      width: rememberedBounds.width,
      height: rememberedBounds.height,
    },
    viewport.width,
    viewport.height,
    app.minSize.width,
    app.minSize.height,
  );
}

function rememberWindowBounds(
  windowPlacementMemory: WindowPlacementMemory,
  windowItem: WindowInstance,
): WindowPlacementMemory {
  return {
    ...windowPlacementMemory,
    [windowItem.appId]: {
      x: windowItem.x,
      y: windowItem.y,
      width: windowItem.width,
      height: windowItem.height,
    },
  };
}

function updateWindowWithBoundsMemory(
  state: Pick<OsState, "windows" | "windowPlacementMemory">,
  id: string,
  updater: (windowItem: WindowInstance) => WindowInstance,
) {
  let nextWindowPlacementMemory = state.windowPlacementMemory;

  const windows = state.windows.map((windowItem) => {
    if (windowItem.id !== id) {
      return windowItem;
    }

    const updatedWindow = updater(windowItem);
    nextWindowPlacementMemory = rememberWindowBounds(
      nextWindowPlacementMemory,
      updatedWindow,
    );
    return updatedWindow;
  });

  return {
    windows,
    windowPlacementMemory: nextWindowPlacementMemory,
  };
}

function makeWindow(
  appId: AppId,
  existingCount: number,
  zIndex: number,
  windowPlacementMemory: WindowPlacementMemory,
): WindowInstance {
  const app = APP_MAP[appId];
  const rememberedBounds = getRememberedBounds(
    appId,
    existingCount,
    windowPlacementMemory,
  );

  return {
    id: `${appId}-${Date.now()}-${Math.round(Math.random() * 1000)}`,
    appId,
    title: app.title,
    icon: app.icon,
    x: rememberedBounds?.x ?? DESKTOP_OFFSET.x + existingCount * WINDOW_STEP,
    y: rememberedBounds?.y ?? DESKTOP_OFFSET.y + existingCount * WINDOW_STEP,
    width: rememberedBounds?.width ?? app.defaultSize.width,
    height: rememberedBounds?.height ?? app.defaultSize.height,
    minWidth: app.minSize.width,
    minHeight: app.minSize.height,
    zIndex,
    minimized: false,
    maximized: false,
  };
}

export const useOsStore = create<OsState>()(
  persist(
    (set, get) => ({
      windows: [],
      activeWindowId: null,
      wallpaperId: WALLPAPERS[0].id,
      desktopTheme: getStoredDesktopTheme(),
      desktopBehavior: DEFAULT_DESKTOP_BEHAVIOR,
      desktopIconPositions: {},
      windowPlacementMemory: {},
      notifications: [],
      booted: false,
      openApp: (appId) => {
        const { windows, windowPlacementMemory } = get();
        const app = APP_MAP[appId];
        const existing = app.singleInstance
          ? windows.find((window) => window.appId === appId)
          : undefined;

        if (existing) {
          const zIndex = nextZIndex(windows);
          set({
            windows: windows.map((window) =>
              window.id === existing.id
                ? { ...window, minimized: false, zIndex }
                : window,
            ),
            activeWindowId: existing.id,
          });
          return;
        }

        const newWindow = makeWindow(
          appId,
          windows.length % 6,
          nextZIndex(windows),
          windowPlacementMemory,
        );
        set({
          windows: [...windows, newWindow],
          activeWindowId: newWindow.id,
        });
      },
      focusWindow: (id) => {
        const { windows } = get();
        const zIndex = nextZIndex(windows);
        set({
          windows: windows.map((window) =>
            window.id === id ? { ...window, minimized: false, zIndex } : window,
          ),
          activeWindowId: id,
        });
      },
      closeWindow: (id) =>
        set((state) => {
          const remaining = state.windows.filter((window) => window.id !== id);
          return {
            windows: remaining,
            activeWindowId:
              state.activeWindowId === id
                ? remaining.at(-1)?.id ?? null
                : state.activeWindowId,
          };
        }),
      closeAllWindows: () =>
        set({
          windows: [],
          activeWindowId: null,
        }),
      minimizeWindow: (id) =>
        set((state) => ({
          windows: state.windows.map((window) =>
            window.id === id ? { ...window, minimized: true } : window,
          ),
          activeWindowId: state.activeWindowId === id ? null : state.activeWindowId,
        })),
      toggleMaximize: (id) =>
        set((state) => ({
          windows: state.windows.map((window) => {
            if (window.id !== id) {
              return window;
            }
            if (window.maximized && window.lastBounds) {
              return {
                ...window,
                ...window.lastBounds,
                lastBounds: undefined,
                maximized: false,
              };
            }
            return {
              ...window,
              lastBounds: {
                x: window.x,
                y: window.y,
                width: window.width,
                height: window.height,
              },
              maximized: true,
              minimized: false,
            };
          }),
        })),
      restoreWindow: (id) =>
        set((state) => {
          const zIndex = nextZIndex(state.windows);
          return {
            windows: state.windows.map((window) =>
              window.id === id ? { ...window, minimized: false, zIndex } : window,
            ),
            activeWindowId: id,
          };
        }),
      updateWindowPosition: (id, x, y) =>
        set((state) => {
          return updateWindowWithBoundsMemory(state, id, (windowItem) => ({
            ...windowItem,
            x,
            y,
          }));
        }),
      updateWindowSize: (id, width, height) =>
        set((state) => {
          return updateWindowWithBoundsMemory(state, id, (windowItem) => ({
            ...windowItem,
            width,
            height,
          }));
        }),
      updateWindowBounds: (id, x, y, width, height) =>
        set((state) => {
          return updateWindowWithBoundsMemory(state, id, (windowItem) => ({
            ...windowItem,
            x,
            y,
            width,
            height,
          }));
        }),
      setDesktopIconPosition: (appId, x, y) =>
        set((state) => ({
          desktopIconPositions: {
            ...state.desktopIconPositions,
            [appId]: { x, y },
          },
        })),
      setDesktopIconPositions: (positions) =>
        set(() => ({
          desktopIconPositions: positions,
        })),
      setWallpaper: (id) => set({ wallpaperId: id }),
      setDesktopTheme: (theme) => {
        persistDesktopTheme(theme);
        set({ desktopTheme: theme });
      },
      setDesktopBehavior: (behavior) =>
        set((state) => {
          const desktopBehavior = {
            ...state.desktopBehavior,
            ...behavior,
          };

          return {
            desktopBehavior,
            notifications: desktopBehavior.desktopNotifications
              ? state.notifications
              : [],
          };
        }),
      toggleDesktopTheme: () => {
        const nextTheme: DesktopTheme = get().desktopTheme === "dark" ? "light" : "dark";
        persistDesktopTheme(nextTheme);
        set({ desktopTheme: nextTheme });
      },
      pushNotification: (title, message) =>
        set((state) => {
          if (!state.desktopBehavior.desktopNotifications) {
            return state;
          }

          return {
            notifications: [
              {
                id: `note-${Date.now()}-${Math.round(Math.random() * 1000)}`,
                title,
                message,
                timestamp: Date.now(),
              },
              ...state.notifications,
            ].slice(0, 4),
          };
        }),
      dismissNotification: (id) =>
        set((state) => ({
          notifications: state.notifications.filter(
            (notification) => notification.id !== id,
          ),
        })),
      setBooted: (value) => set({ booted: value }),
    }),
    {
      name: PI_OS_STATE_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        wallpaperId: state.wallpaperId,
        desktopTheme: state.desktopTheme,
        desktopBehavior: state.desktopBehavior,
        desktopIconPositions: state.desktopIconPositions,
        windowPlacementMemory: state.windowPlacementMemory,
      }),
    },
  ),
);
