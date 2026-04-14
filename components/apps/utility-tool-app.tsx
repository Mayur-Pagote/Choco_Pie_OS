"use client";

import { useEffect, useMemo, useState } from "react";

import { useOsStore } from "@/store/os-store";

type UtilityMode =
  | "archiver"
  | "menu-editor"
  | "diagnostics"
  | "imager"
  | "sd-card-copier"
  | "about";

export function UtilityToolApp({ mode }: { mode: UtilityMode }) {
  const pushNotification = useOsStore((state) => state.pushNotification);
  const openApp = useOsStore((state) => state.openApp);

  const [progress, setProgress] = useState(0);
  const [running, setRunning] = useState(false);
  const [selectedArchive, setSelectedArchive] = useState("theme-pack.zip");
  const [menuSections, setMenuSections] = useState({
    programming: true,
    office: true,
    internet: true,
    accessories: true,
    help: true,
  });
  const [diagnosticsStatus, setDiagnosticsStatus] = useState([
    { label: "CPU temperature", value: "42 C", status: "Healthy" },
    { label: "Storage health", value: "29.8 GB free", status: "Healthy" },
    { label: "Network", value: "Connected", status: "Healthy" },
  ]);
  const [imageTarget, setImageTarget] = useState("32 GB SD Card");
  const [imageSource, setImageSource] = useState("Choco Pie OS (Desktop)");
  const [copyTarget, setCopyTarget] = useState("Backup Card");

  useEffect(() => {
    if (!running) {
      return;
    }

    const timer = window.setInterval(() => {
      setProgress((current) => {
        if (current >= 100) {
          window.clearInterval(timer);
          setRunning(false);
          return 100;
        }
        return current + 10;
      });
    }, 300);

    return () => window.clearInterval(timer);
  }, [running]);

  useEffect(() => {
    if (progress === 100) {
      const title =
        mode === "imager"
          ? "Write Complete"
          : mode === "sd-card-copier"
            ? "Copy Complete"
            : "Action Complete";
      pushNotification(title, `${title} finished successfully.`);
    }
  }, [mode, progress, pushNotification]);

  const content = useMemo(() => {
    if (mode === "archiver") {
      const archiveContents: Record<string, string[]> = {
        "theme-pack.zip": ["wallpapers/", "icons/", "readme.txt"],
        "project-backup.tar.gz": ["src/", "docs/", "assets/"],
      };

      return (
        <div className="space-y-4">
          <div className="text-lg font-semibold">Archive Browser</div>
          <div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(220px,1fr))]">
            <div className="rounded border border-[#d8d8d8] bg-white p-3">
              {Object.keys(archiveContents).map((archive) => (
                <button
                  key={archive}
                  type="button"
                  onClick={() => setSelectedArchive(archive)}
                  className={`mb-2 block w-full rounded px-3 py-2 text-left text-sm ${
                    selectedArchive === archive ? "bg-[#d9ecff]" : "hover:bg-[#f6f6f6]"
                  }`}
                >
                  {archive}
                </button>
              ))}
            </div>
            <div className="rounded border border-[#d8d8d8] bg-white p-4">
              <div className="text-sm font-semibold">{selectedArchive}</div>
              <div className="mt-3 space-y-2 text-sm">
                {archiveContents[selectedArchive].map((entry) => (
                  <div key={entry} className="rounded bg-[#f8f8f8] px-3 py-2">
                    {entry}
                  </div>
                ))}
              </div>
              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  onClick={() => pushNotification("Extract Archive", `${selectedArchive} extracted to /home/pi/Downloads.`)}
                  className="rounded border border-[#d1d1d1] bg-[#fafafa] px-3 py-2 text-sm font-semibold"
                >
                  Extract
                </button>
                <button
                  type="button"
                  onClick={() => pushNotification("Create Archive", "A new archive has been prepared from the current selection.")}
                  className="rounded border border-[#d1d1d1] bg-[#fafafa] px-3 py-2 text-sm font-semibold"
                >
                  Create Archive
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (mode === "menu-editor") {
      return (
        <div className="space-y-4">
          <div className="text-lg font-semibold">Main Menu Editor</div>
          <div className="rounded border border-[#d8d8d8] bg-white p-4">
            <div className="space-y-3">
              {Object.entries(menuSections).map(([section, enabled]) => (
                <label key={section} className="flex items-center justify-between rounded bg-[#f8f8f8] px-4 py-3">
                  <span className="text-sm font-semibold capitalize">{section}</span>
                  <input
                    type="checkbox"
                    checked={enabled}
                    onChange={(event) =>
                      setMenuSections((current) => ({ ...current, [section]: event.target.checked }))
                    }
                  />
                </label>
              ))}
            </div>
            <button
              type="button"
              onClick={() => pushNotification("Menu Updated", "The sample menu visibility settings were saved.")}
              className="mt-4 rounded border border-[#d1d1d1] bg-[#fafafa] px-3 py-2 text-sm font-semibold"
            >
              Save Menu Layout
            </button>
          </div>
        </div>
      );
    }

    if (mode === "diagnostics") {
      return (
        <div className="space-y-4">
          <div className="app-toolbar-wrap flex flex-wrap items-center justify-between gap-2">
            <div className="text-lg font-semibold">System Diagnostics</div>
            <button
              type="button"
              onClick={() =>
                setDiagnosticsStatus((current) =>
                  current.map((entry, index) => ({
                    ...entry,
                    status: index === 1 ? "Warning" : "Healthy",
                  })),
                )
              }
              className="rounded border border-[#d1d1d1] bg-[#fafafa] px-3 py-2 text-sm font-semibold"
            >
              Run Checks
            </button>
          </div>
          <div className="grid gap-3 [grid-template-columns:repeat(auto-fit,minmax(170px,1fr))]">
            {diagnosticsStatus.map((entry) => (
              <div key={entry.label} className="rounded border border-[#d8d8d8] bg-white p-4">
                <div className="text-xs uppercase tracking-[0.16em] text-[#7a7a7a]">{entry.label}</div>
                <div className="mt-2 text-lg font-semibold">{entry.value}</div>
                <div className={`mt-2 text-sm ${entry.status === "Warning" ? "text-[#b75a52]" : "text-[#3c8a52]"}`}>
                  {entry.status}
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (mode === "imager") {
      return (
        <div className="space-y-4">
          <div className="text-lg font-semibold">Choco Pie Imager</div>
          <div className="rounded border border-[#d8d8d8] bg-white p-4">
            <div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(220px,1fr))]">
              <label className="text-sm font-semibold">
                OS image
                <select
                  value={imageSource}
                  onChange={(event) => setImageSource(event.target.value)}
                  className="mt-2 w-full rounded border border-[#d1d1d1] bg-white px-3 py-2 font-normal"
                >
                  <option>Choco Pie OS (Desktop)</option>
                  <option>Choco Pie OS Lite</option>
                  <option>Media Centre Build</option>
                </select>
              </label>
              <label className="text-sm font-semibold">
                Storage
                <select
                  value={imageTarget}
                  onChange={(event) => setImageTarget(event.target.value)}
                  className="mt-2 w-full rounded border border-[#d1d1d1] bg-white px-3 py-2 font-normal"
                >
                  <option>32 GB SD Card</option>
                  <option>64 GB USB Drive</option>
                  <option>Portable SSD</option>
                </select>
              </label>
            </div>

            <button
              type="button"
              onClick={() => {
                setProgress(0);
                setRunning(true);
              }}
              className="mt-4 rounded border border-[#d1d1d1] bg-[#fafafa] px-4 py-2 text-sm font-semibold"
            >
              Write Image
            </button>

            <div className="mt-4 h-3 rounded-full bg-[#ececec]">
              <div className="h-3 rounded-full bg-gradient-to-r from-[#f06e5d] to-[#d5536d]" style={{ width: `${progress}%` }} />
            </div>
            <div className="mt-2 text-xs text-[#666666]">{progress}% complete</div>
          </div>
        </div>
      );
    }

    if (mode === "sd-card-copier") {
      return (
        <div className="space-y-4">
          <div className="text-lg font-semibold">SD Card Copier</div>
          <div className="rounded border border-[#d8d8d8] bg-white p-4">
            <div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(220px,1fr))]">
                <div className="rounded bg-[#f8f8f8] p-4">
                  <div className="text-xs uppercase tracking-[0.18em] text-[#767676]">Source</div>
                  <div className="mt-2 text-sm font-semibold">Primary Card</div>
                  <div className="text-xs text-[#666666]">Choco Pie OS Desktop</div>
                </div>
              <label className="rounded bg-[#f8f8f8] p-4 text-sm font-semibold">
                Destination
                <select
                  value={copyTarget}
                  onChange={(event) => setCopyTarget(event.target.value)}
                  className="mt-3 w-full rounded border border-[#d1d1d1] bg-white px-3 py-2 font-normal"
                >
                  <option>Backup Card</option>
                  <option>Travel Card</option>
                  <option>USB Reader</option>
                </select>
              </label>
            </div>

            <button
              type="button"
              onClick={() => {
                setProgress(0);
                setRunning(true);
              }}
              className="mt-4 rounded border border-[#d1d1d1] bg-[#fafafa] px-4 py-2 text-sm font-semibold"
            >
              Start Copy
            </button>

            <div className="mt-4 h-3 rounded-full bg-[#ececec]">
              <div className="h-3 rounded-full bg-gradient-to-r from-[#8db4ff] to-[#4f7ad6]" style={{ width: `${progress}%` }} />
            </div>
            <div className="mt-2 text-xs text-[#666666]">{progress}% copied to {copyTarget}</div>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div className="text-lg font-semibold">About Choco Pie OS</div>
        <div className="rounded border border-[#d8d8d8] bg-white p-5">
          <div className="text-xl font-semibold">Choco Pie OS Web Desktop</div>
          <p className="mt-3 text-sm leading-7 text-[#4b5563]">
            This project recreates a Choco Pie OS inspired desktop in the browser with a native-style menu, taskbar, and a growing set of lightweight applications.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => openApp("browser")}
              className="rounded border border-[#d1d1d1] bg-[#fafafa] px-3 py-2 text-sm font-semibold"
            >
              Open Chromium
            </button>
            <button
              type="button"
              onClick={() => openApp("settings")}
              className="rounded border border-[#d1d1d1] bg-[#fafafa] px-3 py-2 text-sm font-semibold"
            >
              Open Control Centre
            </button>
          </div>
        </div>
      </div>
    );
  }, [copyTarget, diagnosticsStatus, imageSource, imageTarget, menuSections, mode, openApp, progress, pushNotification, running, selectedArchive]);

  return <div className="system-app scrollbar-thin h-full overflow-auto bg-[#f4f4f4] p-4 text-[#202020]">{content}</div>;
}
