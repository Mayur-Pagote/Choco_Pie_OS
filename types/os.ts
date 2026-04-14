export type AppId =
  | "terminal"
  | "files"
  | "browser"
  | "settings"
  | "vscode"
  | "text-editor"
  | "document-viewer"
  | "media-player"
  | "image-viewer"
  | "gamepi"
  | "memory-tile"
  | "neon-rush"
  | "pi-piano-tiles"
  | "pie-ninja"
  | "riddles"
  | "whispering-shadows"
  | "pi-snake"
  | "slice-the-pie"
  | "pi-defender"
  | "calculator"
  | "archiver"
  | "menu-editor"
  | "diagnostics"
  | "imager"
  | "sd-card-copier"
  | "task-manager"
  | "about"
  | "piday"
  | "raspberrypi"
  | "piart"
  | "symphony"
  | "explorer"
  | "simulation"
  | "games"
  | "quiz"
  | "mandala"
  | "gallery"
  | "run-dialog"
  | "shutdown-dialog";

export type WallpaperId =
  | "choco-pie-wallpaper-1"
  | "choco-pie-wallpaper-3"
  | "choco-pie-wallpaper-sunlight";
export type DesktopTheme = "light" | "dark";

export type IconName =
  | "terminal"
  | "files"
  | "browser"
  | "settings"
  | "vscode"
  | "text-editor"
  | "document-viewer"
  | "media-player"
  | "image-viewer"
  | "game-center"
  | "pi-snake"
  | "slice-the-pie"
  | "pi-defender"
  | "calculator"
  | "task-manager"
  | "folder"
  | "choco"
  | "raspberry"
  | "usb"
  | "pi"
  | "piday"
  | "piart"
  | "symphony"
  | "explorer"
  | "simulation"
  | "quiz"
  | "mandala"
  | "gallery";

export interface AppDefinition {
  id: AppId;
  title: string;
  icon: IconName;
  description: string;
  desktop: boolean;
  singleInstance: boolean;
  defaultSize: { width: number; height: number };
  minSize: { width: number; height: number };
}

export interface WindowBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface DesktopIconPosition {
  x: number;
  y: number;
}

export type DesktopIconPositions = Partial<Record<AppId, DesktopIconPosition>>;
export type WindowPlacementMemory = Partial<Record<AppId, WindowBounds>>;

export interface DesktopBehavior {
  roundedPanelControls: boolean;
  desktopNotifications: boolean;
  compactTaskButtons: boolean;
}

export interface WindowInstance {
  id: string;
  appId: AppId;
  title: string;
  icon: IconName;
  x: number;
  y: number;
  width: number;
  height: number;
  minWidth: number;
  minHeight: number;
  zIndex: number;
  minimized: boolean;
  maximized: boolean;
  lastBounds?: WindowBounds;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: number;
}

export interface WallpaperOption {
  id: WallpaperId;
  name: string;
  src: string;
  accent: string;
}
