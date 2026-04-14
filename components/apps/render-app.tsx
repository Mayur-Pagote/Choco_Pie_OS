"use client";

import type { ReactNode } from "react";

import { AppId } from "@/types/os";

import { isPiOsPageApp } from "@/lib/pi-apps";
import { BrowserApp } from "./browser-app";
import { CalculatorApp } from "./calculator-app";
import { DocumentViewerApp } from "./document-viewer-app";
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

export function RenderApp({ appId }: { appId: AppId }) {
  let appNode: ReactNode = null;

  if (isPiOsPageApp(appId)) {
    appNode = <OsPageApp appId={appId} />;
  } else {
    switch (appId) {
      case "terminal":
        appNode = <TerminalApp />;
        break;
      case "files":
        appNode = <FileManagerApp />;
        break;
      case "browser":
        appNode = <BrowserApp />;
        break;
      case "settings":
        appNode = <SettingsApp />;
        break;
      case "vscode":
        appNode = <VsCodeLiteApp />;
        break;
      case "text-editor":
        appNode = <TextEditorApp />;
        break;
      case "document-viewer":
        appNode = <DocumentViewerApp />;
        break;
      case "media-player":
        appNode = <MediaPlayerApp />;
        break;
      case "image-viewer":
        appNode = <ImageViewerApp />;
        break;
      case "gamepi":
        appNode = <GameCenterApp />;
        break;
      case "memory-tile":
      case "neon-rush":
      case "pi-piano-tiles":
      case "pie-ninja":
      case "riddles":
      case "whispering-shadows":
        appNode = <HtmlGameApp appId={appId} />;
        break;
      case "pi-snake":
        appNode = <PiSnakeApp />;
        break;
      case "slice-the-pie":
        appNode = <SliceThePieApp />;
        break;
      case "pi-defender":
        appNode = <PiDefenderApp />;
        break;
      case "calculator":
        appNode = <CalculatorApp />;
        break;
      case "archiver":
        appNode = <UtilityToolApp mode="archiver" />;
        break;
      case "menu-editor":
        appNode = <UtilityToolApp mode="menu-editor" />;
        break;
      case "diagnostics":
        appNode = <UtilityToolApp mode="diagnostics" />;
        break;
      case "imager":
        appNode = <UtilityToolApp mode="imager" />;
        break;
      case "sd-card-copier":
        appNode = <UtilityToolApp mode="sd-card-copier" />;
        break;
      case "task-manager":
        appNode = <TaskManagerApp />;
        break;
      case "run-dialog":
        appNode = <RunDialogApp />;
        break;
      case "shutdown-dialog":
        appNode = <ShutdownDialogApp />;
        break;
      default:
        appNode = null;
    }
  }

  return <div className="app-window-content h-full min-h-0 min-w-0 overflow-hidden">{appNode}</div>;
}
