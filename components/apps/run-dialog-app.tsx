"use client";

import { FormEvent, useState } from "react";

import { useOsStore } from "@/store/os-store";
import { AppId } from "@/types/os";

const COMMANDS: Record<string, AppId> = {
  browser: "browser",
  chromium: "browser",
  code: "vscode",
  vscode: "vscode",
  studio: "vscode",
  files: "files",
  terminal: "terminal",
  editor: "text-editor",
  text: "text-editor",
  documents: "document-viewer",
  media: "media-player",
  images: "image-viewer",
  game: "gamepi",
  gamepi: "gamepi",
  memory: "memory-tile",
  memorytile: "memory-tile",
  neon: "neon-rush",
  neonrush: "neon-rush",
  piano: "pi-piano-tiles",
  pianotiles: "pi-piano-tiles",
  pie: "pie-ninja",
  pieninja: "pie-ninja",
  riddles: "riddles",
  whispering: "whispering-shadows",
  shadows: "whispering-shadows",
  snake: "pi-snake",
  pisnake: "pi-snake",
  defender: "pi-defender",
  pidefender: "pi-defender",
  calc: "calculator",
  settings: "settings",
  diagnostics: "diagnostics",
  tasks: "task-manager",
  about: "about",
  piday: "piday",
  raspberrypi: "raspberrypi",
  piart: "piart",
  symphony: "symphony",
  explorer: "explorer",
  simulation: "simulation",
  games: "games",
  quiz: "quiz",
  mandala: "mandala",
  gallery: "gallery",
};

export function RunDialogApp() {
  const openApp = useOsStore((state) => state.openApp);
  const pushNotification = useOsStore((state) => state.pushNotification);
  const [command, setCommand] = useState("");

  const runCommand = (value: string) => {
    const normalized = value.trim().toLowerCase();
    const appId = COMMANDS[normalized];

    if (appId) {
      openApp(appId);
      pushNotification("Run", `${value} launched successfully.`);
      return;
    }

    pushNotification("Run", `No known command found for "${value}".`);
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!command.trim()) {
      return;
    }

    runCommand(command);
    setCommand("");
  };

  return (
    <div className="system-app flex h-full flex-col justify-center bg-[#f4f4f4] p-6 text-[#202020]">
      <div className="rounded border border-[#d8d8d8] bg-white p-5">
        <div className="text-lg font-semibold">Run Command</div>
        <p className="mt-2 text-sm text-[#666666]">
          Try commands like <span className="font-semibold">browser</span>, <span className="font-semibold">terminal</span>, <span className="font-semibold">calc</span>, or <span className="font-semibold">tasks</span>.
          Pi apps such as <span className="font-semibold">pisnake</span>, <span className="font-semibold">gallery</span>, <span className="font-semibold">mandala</span>, and <span className="font-semibold">pidefender</span> work too.
        </p>

        <form onSubmit={onSubmit} className="app-toolbar-wrap mt-4 flex flex-wrap gap-2">
          <input
            value={command}
            onChange={(event) => setCommand(event.target.value)}
            className="app-toolbar-grow min-w-0 flex-1 rounded border border-[#d1d1d1] bg-white px-3 py-2 text-sm outline-none focus:border-[#9bb5d8]"
            placeholder="Enter command"
          />
          <button
            type="submit"
            className="rounded border border-[#d1d1d1] bg-[#fafafa] px-4 py-2 text-sm font-semibold"
          >
            Run
          </button>
        </form>
      </div>
    </div>
  );
}
