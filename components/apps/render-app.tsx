"use client";

import type { ReactNode } from "react";

import type { HtmlGameAppId } from "@/lib/game-catalog";
import { AppId } from "@/types/os";

import { isPiOsPageApp } from "@/lib/pi-apps";
import { BrowserApp } from "./browser-app";
import { CalculatorApp } from "./calculator-app";
import { DocumentViewerApp } from "./document-viewer-app";
import { ExternalFolderApp } from "./external-folder-app";
import { FileManagerApp } from "./file-manager-app";
import { GameCenterApp } from "./game-center-app";
import { HtmlGameApp } from "./html-game-app";
import { ImageViewerApp } from "./image-viewer-app";
import { MediaPlayerApp } from "./media-player-app";
import { PiDefenderApp } from "./pi-defender-app";
import { PiSnakeApp } from "./pi-snake-app";
import { OsPageApp } from "./os-page-app";
import { RunDialogApp } from "./run-dialog-app";
import { SettingsApp } from "./settings-app";
import { ShutdownDialogApp } from "./shutdown-dialog-app";
import { SliceThePieApp } from "./slice-the-pie-app";
import { TaskManagerApp } from "./task-manager-app";
import { TerminalApp } from "./terminal-app";
import { TextEditorApp } from "./text-editor-app";
import { UtilityToolApp } from "./utility-tool-app";
import { VsCodeLiteApp } from "./vscode-lite-app";

const HTML_GAME_APP_ID_SET = new Set<HtmlGameAppId>([
  "memory-tile",
  "neon-rush",
  "pi-piano-tiles",
  "pie-ninja",
  "riddles",
  "whispering-shadows",
]);

function isHtmlGameAppId(appId: AppId): appId is HtmlGameAppId {
  return HTML_GAME_APP_ID_SET.has(appId as HtmlGameAppId);
}

const APP_RENDERERS: Partial<Record<AppId, () => ReactNode>> = {
  terminal: () => <TerminalApp />,
  files: () => <FileManagerApp />,
  browser: () => <BrowserApp />,
  settings: () => <SettingsApp />,
  vscode: () => <VsCodeLiteApp />,
  "text-editor": () => <TextEditorApp />,
  "document-viewer": () => <DocumentViewerApp />,
  "media-player": () => <MediaPlayerApp />,
  "image-viewer": () => <ImageViewerApp />,
  gamepi: () => <GameCenterApp />,
  "pi-snake": () => <PiSnakeApp />,
  "slice-the-pie": () => <SliceThePieApp />,
  "pi-defender": () => <PiDefenderApp />,
  calculator: () => <CalculatorApp />,
  archiver: () => <UtilityToolApp mode="archiver" />,
  "menu-editor": () => <UtilityToolApp mode="menu-editor" />,
  diagnostics: () => <UtilityToolApp mode="diagnostics" />,
  imager: () => <UtilityToolApp mode="imager" />,
  "sd-card-copier": () => <UtilityToolApp mode="sd-card-copier" />,
  "task-manager": () => <TaskManagerApp />,
  "pico-playground": () => (
    <ExternalFolderApp
      title="Pico Playground"
      src="/api/static-app/pico-playground/index.html"
    />
  ),
  "raspberry-pi-5-simulator": () => (
    <ExternalFolderApp
      title="Raspberry Pi 5 Simulator"
      src="/api/static-app/raspberry-pi-5-simulator/index.html"
    />
  ),
  "run-dialog": () => <RunDialogApp />,
  "shutdown-dialog": () => <ShutdownDialogApp />,
};

export function RenderApp({ appId }: { appId: AppId }) {
  if (isPiOsPageApp(appId)) {
    return (
      <div className="app-window-content h-full min-h-0 min-w-0 overflow-hidden">
        <OsPageApp appId={appId} />
      </div>
    );
  }

  if (isHtmlGameAppId(appId)) {
    return (
      <div className="app-window-content h-full min-h-0 min-w-0 overflow-hidden">
        <HtmlGameApp appId={appId} />
      </div>
    );
  }

  const appNode = APP_RENDERERS[appId]?.() ?? null;
  return (
    <div className="app-window-content h-full min-h-0 min-w-0 overflow-hidden">
      {appNode}
    </div>
  );
}
