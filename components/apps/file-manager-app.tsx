"use client";

import { useMemo, useState } from "react";

import { APP_MAP } from "@/lib/apps";
import { useOsStore } from "@/store/os-store";
import { AppId } from "@/types/os";

type FileEntry = {
  id: string;
  name: string;
  kind: "folder" | "file";
  detail: string;
  content?: string;
  openWith?: AppId;
};

type FileSystemMap = Record<string, FileEntry[]>;

type NavigationState = {
  history: string[];
  index: number;
};

const ROOT_PATH = "/home/pi";
const SIDEBAR = ["Home", "Desktop", "Documents", "Downloads", "Pictures", "Projects"] as const;
const ROOT_PROTECTED_FOLDERS = new Set<string>(
  SIDEBAR.filter((item) => item !== "Home"),
);

const PLACE_TO_PATH: Record<(typeof SIDEBAR)[number], string> = {
  Home: ROOT_PATH,
  Desktop: `${ROOT_PATH}/Desktop`,
  Documents: `${ROOT_PATH}/Documents`,
  Downloads: `${ROOT_PATH}/Downloads`,
  Pictures: `${ROOT_PATH}/Pictures`,
  Projects: `${ROOT_PATH}/Projects`,
};

function makeEntryId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.round(Math.random() * 10000)}`;
}

function joinPath(parentPath: string, childName: string) {
  const normalizedParent = parentPath.replace(/\/+$/, "");
  return `${normalizedParent}/${childName}`;
}

function getParentPath(path: string) {
  if (path === ROOT_PATH) {
    return ROOT_PATH;
  }

  const segments = path.split("/").filter(Boolean);
  if (segments.length <= 2) {
    return ROOT_PATH;
  }

  return `/${segments.slice(0, -1).join("/")}`;
}

function getPathLabel(path: string) {
  if (path === ROOT_PATH) {
    return "Home";
  }

  const segments = path.split("/").filter(Boolean);
  return segments.at(-1) ?? "Home";
}

function sortEntries(entries: FileEntry[]) {
  return [...entries].sort((left, right) => {
    if (left.kind !== right.kind) {
      return left.kind === "folder" ? -1 : 1;
    }
    return left.name.localeCompare(right.name, undefined, { sensitivity: "base" });
  });
}

function inferAppFromFileName(fileName: string): AppId | null {
  const normalized = fileName.toLowerCase();

  const launchers: Record<string, AppId> = {
    "chromium.desktop": "browser",
    "terminal.desktop": "terminal",
    "file-manager.desktop": "files",
    "control-centre.desktop": "settings",
    "control-center.desktop": "settings",
  };

  if (launchers[normalized]) {
    return launchers[normalized];
  }

  if (normalized.endsWith(".pdf") || normalized.endsWith(".odt")) {
    return "document-viewer";
  }

  if (
    normalized.endsWith(".txt") ||
    normalized.endsWith(".md") ||
    normalized.endsWith(".json") ||
    normalized.endsWith(".py") ||
    normalized.endsWith(".js") ||
    normalized.endsWith(".ts") ||
    normalized.endsWith(".html") ||
    normalized.endsWith(".css")
  ) {
    return "text-editor";
  }

  if (
    normalized.endsWith(".png") ||
    normalized.endsWith(".jpg") ||
    normalized.endsWith(".jpeg") ||
    normalized.endsWith(".svg") ||
    normalized.endsWith(".webp")
  ) {
    return "image-viewer";
  }

  if (
    normalized.endsWith(".mp3") ||
    normalized.endsWith(".wav") ||
    normalized.endsWith(".mp4") ||
    normalized.endsWith(".webm")
  ) {
    return "media-player";
  }

  if (
    normalized.endsWith(".zip") ||
    normalized.endsWith(".tar.gz") ||
    normalized.endsWith(".rar")
  ) {
    return "archiver";
  }

  return null;
}

function createFileSystem(): FileSystemMap {
  const fs: FileSystemMap = {
    [ROOT_PATH]: sortEntries([
      { id: "folder-desktop", name: "Desktop", kind: "folder", detail: "" },
      { id: "folder-documents", name: "Documents", kind: "folder", detail: "" },
      { id: "folder-downloads", name: "Downloads", kind: "folder", detail: "" },
      { id: "folder-pictures", name: "Pictures", kind: "folder", detail: "" },
      { id: "folder-projects", name: "Projects", kind: "folder", detail: "" },
      {
        id: "file-todo",
        name: "todo.txt",
        kind: "file",
        detail: "1 KB",
        content: "Finish Pi desktop UI polish\nAdd file manager interactions\nTest responsive behavior",
      },
    ]),
    [`${ROOT_PATH}/Desktop`]: sortEntries([
      {
        id: "desktop-chromium",
        name: "Chromium.desktop",
        kind: "file",
        detail: "Launcher",
        openWith: "browser",
      },
      {
        id: "desktop-terminal",
        name: "Terminal.desktop",
        kind: "file",
        detail: "Launcher",
        openWith: "terminal",
      },
      { id: "desktop-wallpaper-folder", name: "Wallpaper Switcher", kind: "folder", detail: "" },
    ]),
    [`${ROOT_PATH}/Desktop/Wallpaper Switcher`]: sortEntries([
      {
        id: "desktop-wallpaper-1",
        name: "sunrise-wallpaper.png",
        kind: "file",
        detail: "2.1 MB",
        openWith: "image-viewer",
      },
      {
        id: "desktop-wallpaper-2",
        name: "sunset-wallpaper.png",
        kind: "file",
        detail: "1.8 MB",
        openWith: "image-viewer",
      },
    ]),
    [`${ROOT_PATH}/Documents`]: sortEntries([
      {
        id: "docs-guide",
        name: "Raspberry Pi Guide.pdf",
        kind: "file",
        detail: "4.8 MB",
        openWith: "document-viewer",
      },
      {
        id: "docs-notes",
        name: "notes.md",
        kind: "file",
        detail: "3 KB",
        content: "# Notes\n\n- Enable file actions\n- Improve app responsiveness",
      },
    ]),
    [`${ROOT_PATH}/Downloads`]: sortEntries([
      {
        id: "downloads-theme",
        name: "pi-theme-pack.zip",
        kind: "file",
        detail: "18 MB",
        openWith: "archiver",
      },
      {
        id: "downloads-mockup",
        name: "raspbian-mockup.png",
        kind: "file",
        detail: "2.4 MB",
        openWith: "image-viewer",
      },
    ]),
    [`${ROOT_PATH}/Pictures`]: sortEntries([
      {
        id: "pictures-dawn",
        name: "wallpaper-dawn.svg",
        kind: "file",
        detail: "Vector",
        openWith: "image-viewer",
      },
      {
        id: "pictures-sunset",
        name: "wallpaper-sunset.svg",
        kind: "file",
        detail: "Vector",
        openWith: "image-viewer",
      },
    ]),
    [`${ROOT_PATH}/Projects`]: sortEntries([
      { id: "projects-web-ui", name: "raspbian-web-ui", kind: "folder", detail: "" },
      {
        id: "projects-mock-fs",
        name: "mock-fs.json",
        kind: "file",
        detail: "8 KB",
        content: '{\n  "name": "raspbian-web-ui",\n  "kind": "demo"\n}',
      },
    ]),
    [`${ROOT_PATH}/Projects/raspbian-web-ui`]: sortEntries([
      { id: "projects-src", name: "src", kind: "folder", detail: "" },
      { id: "projects-public", name: "public", kind: "folder", detail: "" },
      {
        id: "projects-readme",
        name: "README.md",
        kind: "file",
        detail: "2 KB",
        content: "# Raspberry Pi Web UI\n\nMock desktop environment built with Next.js.",
      },
    ]),
    [`${ROOT_PATH}/Projects/raspbian-web-ui/src`]: [],
    [`${ROOT_PATH}/Projects/raspbian-web-ui/public`]: [],
  };

  return fs;
}

function addFolderToPath(fs: FileSystemMap, path: string, folderName: string) {
  const normalizedName = folderName.trim().replace(/[\\/]/g, "");

  if (!normalizedName) {
    return { ok: false as const, message: "Folder name cannot be empty." };
  }

  const currentEntries = fs[path] ?? [];
  const duplicate = currentEntries.some(
    (entry) => entry.name.toLowerCase() === normalizedName.toLowerCase(),
  );

  if (duplicate) {
    return { ok: false as const, message: "An item with that name already exists." };
  }

  const nextEntry: FileEntry = {
    id: makeEntryId("folder"),
    name: normalizedName,
    kind: "folder",
    detail: "",
  };
  const nextPath = joinPath(path, normalizedName);

  const nextFs: FileSystemMap = {
    ...fs,
    [path]: sortEntries([...currentEntries, nextEntry]),
    [nextPath]: fs[nextPath] ?? [],
  };

  return { ok: true as const, nextFs, nextPath, entry: nextEntry };
}

function renameEntry(fs: FileSystemMap, path: string, entryId: string, newName: string) {
  const normalizedName = newName.trim().replace(/[\\/]/g, "");
  if (!normalizedName) {
    return { ok: false as const, message: "Name cannot be empty." };
  }

  const currentEntries = fs[path] ?? [];
  const target = currentEntries.find((entry) => entry.id === entryId);
  if (!target) {
    return { ok: false as const, message: "The selected item no longer exists." };
  }

  const duplicate = currentEntries.some(
    (entry) =>
      entry.id !== entryId && entry.name.toLowerCase() === normalizedName.toLowerCase(),
  );
  if (duplicate) {
    return { ok: false as const, message: "An item with that name already exists." };
  }

  let nextFs: FileSystemMap = {
    ...fs,
    [path]: sortEntries(
      currentEntries.map((entry) =>
        entry.id === entryId ? { ...entry, name: normalizedName } : entry,
      ),
    ),
  };

  if (target.kind === "folder") {
    const oldFolderPath = joinPath(path, target.name);
    const newFolderPath = joinPath(path, normalizedName);
    const remapped: FileSystemMap = {};

    for (const [key, value] of Object.entries(nextFs)) {
      if (key === oldFolderPath || key.startsWith(`${oldFolderPath}/`)) {
        const suffix = key.slice(oldFolderPath.length);
        remapped[`${newFolderPath}${suffix}`] = value;
      } else {
        remapped[key] = value;
      }
    }

    if (!remapped[newFolderPath]) {
      remapped[newFolderPath] = [];
    }

    nextFs = remapped;
  }

  return { ok: true as const, nextFs, previousName: target.name, nextName: normalizedName, kind: target.kind };
}

function deleteEntry(fs: FileSystemMap, path: string, entryId: string) {
  const currentEntries = fs[path] ?? [];
  const target = currentEntries.find((entry) => entry.id === entryId);
  if (!target) {
    return { ok: false as const, message: "The selected item no longer exists." };
  }

  const nextFs: FileSystemMap = {
    ...fs,
    [path]: currentEntries.filter((entry) => entry.id !== entryId),
  };

  if (target.kind === "folder") {
    const folderPath = joinPath(path, target.name);
    for (const key of Object.keys(nextFs)) {
      if (key === folderPath || key.startsWith(`${folderPath}/`)) {
        delete nextFs[key];
      }
    }
  }

  return { ok: true as const, nextFs, removed: target };
}

function EntryGlyph({ kind }: { kind: FileEntry["kind"] }) {
  if (kind === "folder") {
    return (
      <div className="flex h-12 w-12 items-center justify-center rounded-[18px] bg-[linear-gradient(180deg,#fff8d6,#f9db7b)]">
        <svg viewBox="0 0 24 24" className="h-7 w-7 text-[#b8871a]" aria-hidden="true">
          <path d="M3 8a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v1H3V8zm0 4h18v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-5z" fill="currentColor" />
        </svg>
      </div>
    );
  }

  return (
    <div className="flex h-12 w-12 items-center justify-center rounded-[18px] bg-[linear-gradient(180deg,#ffffff,#eef4fb)]">
      <svg viewBox="0 0 24 24" className="h-7 w-7 text-[#7d8ca1]" aria-hidden="true">
        <path d="M7 3h7l5 5v11a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" fill="currentColor" />
        <path d="M14 3v5h5" fill="none" stroke="#ffffff" strokeLinecap="round" strokeWidth="1.5" />
      </svg>
    </div>
  );
}

export function FileManagerApp() {
  const openApp = useOsStore((state) => state.openApp);
  const pushNotification = useOsStore((state) => state.pushNotification);

  const [fileSystem, setFileSystem] = useState<FileSystemMap>(() => createFileSystem());
  const [navigation, setNavigation] = useState<NavigationState>({
    history: [ROOT_PATH],
    index: 0,
  });
  const [selectedEntryId, setSelectedEntryId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [previewContent, setPreviewContent] = useState<string | null>(null);

  const currentPath = navigation.history[navigation.index] ?? ROOT_PATH;
  const currentEntries = fileSystem[currentPath] ?? [];

  const filteredEntries = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      return currentEntries;
    }

    return currentEntries.filter((entry) => {
      const searchable = `${entry.name} ${entry.kind} ${entry.detail}`.toLowerCase();
      return searchable.includes(query);
    });
  }, [currentEntries, searchQuery]);

  const selectedEntry = currentEntries.find((entry) => entry.id === selectedEntryId) ?? null;

  const breadcrumb = useMemo(() => {
    const result: Array<{ label: string; path: string }> = [{ label: "Home", path: ROOT_PATH }];
    if (currentPath === ROOT_PATH) {
      return result;
    }

    const relative = currentPath.slice(ROOT_PATH.length + 1);
    if (!relative) {
      return result;
    }

    const parts = relative.split("/").filter(Boolean);
    let acc = ROOT_PATH;
    for (const part of parts) {
      acc = joinPath(acc, part);
      result.push({ label: part, path: acc });
    }
    return result;
  }, [currentPath]);

  const totalFiles = useMemo(
    () =>
      Object.values(fileSystem).reduce(
        (count, entries) => count + entries.filter((entry) => entry.kind === "file").length,
        0,
      ),
    [fileSystem],
  );
  const usedStorage = Math.min(31.8, 18.6 + totalFiles * 0.08);
  const usedStoragePercent = Math.round((usedStorage / 32) * 100);

  const canGoBack = navigation.index > 0;
  const canGoForward = navigation.index < navigation.history.length - 1;
  const parentPath = getParentPath(currentPath);
  const canGoUp = currentPath !== ROOT_PATH && parentPath !== currentPath;

  const selectedIsProtectedRootFolder =
    selectedEntry?.kind === "folder" &&
    currentPath === ROOT_PATH &&
    ROOT_PROTECTED_FOLDERS.has(selectedEntry.name);

  const navigateTo = (path: string) => {
    if (path === currentPath) {
      return;
    }

    setNavigation((current) => {
      const trimmed = current.history.slice(0, current.index + 1);
      return {
        history: [...trimmed, path],
        index: trimmed.length,
      };
    });
    setSelectedEntryId(null);
    setPreviewContent(null);
    setSearchQuery("");
  };

  const openEntry = (entry: FileEntry) => {
    setSelectedEntryId(entry.id);

    if (entry.kind === "folder") {
      navigateTo(joinPath(currentPath, entry.name));
      return;
    }

    const targetApp = entry.openWith ?? inferAppFromFileName(entry.name);
    if (targetApp) {
      openApp(targetApp);
      pushNotification("Open File", `${entry.name} opened with ${APP_MAP[targetApp].title}.`);
      return;
    }

    if (entry.content) {
      setPreviewContent(entry.content);
      pushNotification("Preview", `${entry.name} loaded in inline preview.`);
      return;
    }

    pushNotification("Open File", `No associated app found for ${entry.name}.`);
  };

  const createFolder = () => {
    const folderName = window.prompt("Enter a new folder name:");
    if (!folderName) {
      return;
    }

    setFileSystem((current) => {
      const result = addFolderToPath(current, currentPath, folderName);
      if (!result.ok) {
        pushNotification("New Folder", result.message);
        return current;
      }

      pushNotification("New Folder", `${result.entry.name} created.`);
      return result.nextFs;
    });
  };

  const renameSelected = () => {
    if (!selectedEntry) {
      pushNotification("Rename", "Select an item first.");
      return;
    }

    if (selectedIsProtectedRootFolder) {
      pushNotification("Rename", "Core sidebar folders cannot be renamed.");
      return;
    }

    const nextName = window.prompt("Rename item:", selectedEntry.name);
    if (!nextName || nextName === selectedEntry.name) {
      return;
    }

    setFileSystem((current) => {
      const result = renameEntry(current, currentPath, selectedEntry.id, nextName);
      if (!result.ok) {
        pushNotification("Rename", result.message);
        return current;
      }

      pushNotification("Rename", `${result.previousName} renamed to ${result.nextName}.`);
      return result.nextFs;
    });
  };

  const deleteSelected = () => {
    if (!selectedEntry) {
      pushNotification("Delete", "Select an item first.");
      return;
    }

    if (selectedIsProtectedRootFolder) {
      pushNotification("Delete", "Core sidebar folders cannot be deleted.");
      return;
    }

    const shouldDelete = window.confirm(`Delete "${selectedEntry.name}"?`);
    if (!shouldDelete) {
      return;
    }

    setFileSystem((current) => {
      const result = deleteEntry(current, currentPath, selectedEntry.id);
      if (!result.ok) {
        pushNotification("Delete", result.message);
        return current;
      }

      setSelectedEntryId(null);
      setPreviewContent(null);
      pushNotification("Delete", `${result.removed.name} deleted.`);
      return result.nextFs;
    });
  };

  return (
    <div className="system-app app-split-layout flex h-full bg-[linear-gradient(180deg,#f8fafc,#edf2f7)] text-[#1c2a3c]">
      <aside className="w-56 max-w-full border-r border-[#e2e8f0] bg-[linear-gradient(180deg,rgba(255,255,255,0.72),rgba(244,247,251,0.72))] px-4 py-4">
        <div className="text-xs font-semibold uppercase tracking-[0.22em] text-[#97a4b5]">Places</div>
        <div className="mt-4 space-y-1 text-sm">
          {SIDEBAR.map((item) => {
            const targetPath = PLACE_TO_PATH[item];
            const active = currentPath === targetPath || currentPath.startsWith(`${targetPath}/`);

            return (
              <button
                key={item}
                type="button"
                onClick={() => navigateTo(targetPath)}
                className={`flex w-full items-center rounded-2xl px-3 py-2 text-left transition ${
                  active
                    ? "bg-[#f9e5e7] font-semibold text-[#b55167]"
                    : "text-[#415065] hover:bg-white/70"
                }`}
              >
                {item}
              </button>
            );
          })}
        </div>

        <div className="mt-6 rounded-[22px] bg-white/70 p-4">
          <div className="text-xs uppercase tracking-[0.18em] text-[#97a4b5]">Storage</div>
          <div className="mt-2 text-sm font-semibold text-[#233244]">32 GB SD Card</div>
          <div className="mt-2 h-2 rounded-full bg-[#e2e8f0]">
            <div
              className="h-2 rounded-full bg-gradient-to-r from-[#f06e5d] to-[#d5536d]"
              style={{ width: `${usedStoragePercent}%` }}
            />
          </div>
          <div className="mt-2 text-xs text-[#728295]">{usedStorage.toFixed(1)} GB used</div>
        </div>
      </aside>

      <section className="flex min-w-0 flex-1 flex-col">
        <div className="border-b border-[#e2e8f0] bg-white/66 px-4 py-4">
          <div className="app-toolbar-wrap flex flex-wrap items-start justify-between gap-3">
            <div className="app-toolbar-grow min-w-0">
              <div className="text-lg font-semibold text-[#233244]">{getPathLabel(currentPath)}</div>
              <div className="mt-1 flex flex-wrap items-center gap-1 text-xs text-[#728295]">
                {breadcrumb.map((entry, index) => (
                  <button
                    key={entry.path}
                    type="button"
                    onClick={() => navigateTo(entry.path)}
                    className={`rounded px-1 py-0.5 transition ${
                      index === breadcrumb.length - 1
                        ? "font-semibold text-[#5d6d82]"
                        : "hover:bg-white/70"
                    }`}
                  >
                    {index > 0 ? "/" : ""}
                    {entry.label}
                  </button>
                ))}
              </div>
            </div>
            <input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="w-full rounded-full border border-[#e2e8f0] bg-[#f8fafc] px-4 py-2 text-sm text-[#56657a] outline-none focus:border-[#d28a98]"
              placeholder="Search current folder"
            />
          </div>

          <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold">
            <button
              type="button"
              onClick={() =>
                setNavigation((current) => ({
                  ...current,
                  index: Math.max(0, current.index - 1),
                }))
              }
              disabled={!canGoBack}
              className="rounded-full border border-[#d6dde8] bg-white px-3 py-1.5 disabled:opacity-50"
            >
              Back
            </button>
            <button
              type="button"
              onClick={() =>
                setNavigation((current) => ({
                  ...current,
                  index: Math.min(current.history.length - 1, current.index + 1),
                }))
              }
              disabled={!canGoForward}
              className="rounded-full border border-[#d6dde8] bg-white px-3 py-1.5 disabled:opacity-50"
            >
              Forward
            </button>
            <button
              type="button"
              onClick={() => navigateTo(parentPath)}
              disabled={!canGoUp}
              className="rounded-full border border-[#d6dde8] bg-white px-3 py-1.5 disabled:opacity-50"
            >
              Up
            </button>
            <button
              type="button"
              onClick={() => selectedEntry && openEntry(selectedEntry)}
              disabled={!selectedEntry}
              className="rounded-full border border-[#d6dde8] bg-white px-3 py-1.5 disabled:opacity-50"
            >
              Open
            </button>
            <button
              type="button"
              onClick={createFolder}
              className="rounded-full border border-[#eac1bf] bg-[#fff4f0] px-3 py-1.5 text-[#b75a52]"
            >
              New Folder
            </button>
            <button
              type="button"
              onClick={renameSelected}
              disabled={!selectedEntry || selectedIsProtectedRootFolder}
              className="rounded-full border border-[#d6dde8] bg-white px-3 py-1.5 disabled:opacity-50"
            >
              Rename
            </button>
            <button
              type="button"
              onClick={deleteSelected}
              disabled={!selectedEntry || selectedIsProtectedRootFolder}
              className="rounded-full border border-[#f0c2ba] bg-[#fff2ed] px-3 py-1.5 text-[#b75a52] disabled:opacity-50"
            >
              Delete
            </button>
          </div>
        </div>

        <div className="scrollbar-thin grid flex-1 content-start gap-4 overflow-auto p-4 [grid-template-columns:repeat(auto-fit,minmax(210px,1fr))]">
          {filteredEntries.map((entry) => {
            const selected = entry.id === selectedEntryId;
            const detail =
              entry.kind === "folder"
                ? `${fileSystem[joinPath(currentPath, entry.name)]?.length ?? 0} item${
                    (fileSystem[joinPath(currentPath, entry.name)]?.length ?? 0) === 1 ? "" : "s"
                  }`
                : entry.detail;

            return (
              <button
                key={entry.id}
                type="button"
                onClick={() => {
                  setSelectedEntryId(entry.id);
                  if (entry.kind === "file" && entry.content) {
                    setPreviewContent(entry.content);
                  } else {
                    setPreviewContent(null);
                  }
                }}
                onDoubleClick={() => openEntry(entry)}
                className={`soft-card rounded-[24px] p-4 text-left transition ${
                  selected ? "selection-ring" : "hover:border-[#ccd8e7]"
                }`}
              >
                <div className="flex items-start gap-3">
                  <EntryGlyph kind={entry.kind} />
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold text-[#263447]">{entry.name}</div>
                    <div className="mt-1 text-xs uppercase tracking-[0.16em] text-[#97a4b5]">
                      {entry.kind}
                    </div>
                    <div className="mt-4 text-xs text-[#728295]">{detail}</div>
                  </div>
                </div>
              </button>
            );
          })}

          {filteredEntries.length === 0 ? (
            <div className="col-span-full rounded-[22px] border border-dashed border-[#cfdae8] bg-white/70 px-4 py-8 text-center text-sm text-[#728295]">
              {searchQuery ? "No files match your search." : "This folder is empty."}
            </div>
          ) : null}
        </div>

        {previewContent ? (
          <div className="border-t border-[#dbe3ee] bg-white/84 px-4 py-3">
            <div className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8da0b7]">
              File Preview
            </div>
            <div className="mt-2 max-h-24 overflow-auto rounded-lg bg-[#f6f9fd] px-3 py-2 font-mono text-xs text-[#4b5a6e]">
              {previewContent}
            </div>
          </div>
        ) : null}
      </section>
    </div>
  );
}
