"use client";

import type { ReactNode } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { AppIcon } from "@/components/icons/pi-icons";
import { APP_MAP } from "@/lib/apps";
import { AppId } from "@/types/os";

type GlyphName =
  | "programming"
  | "office"
  | "internet"
  | "media"
  | "graphics"
  | "games"
  | "other"
  | "accessories"
  | "help"
  | "preferences"
  | "run"
  | "shutdown"
  | "archiver"
  | "document"
  | "menu-editor"
  | "diagnostics"
  | "imager"
  | "sd-card"
  | "appearance"
  | "info";

type MenuLeaf = {
  label: string;
  glyph: GlyphName | AppId;
  appId?: AppId;
  message?: string;
};

type MenuCategory = {
  label: string;
  glyph: GlyphName | AppId;
  submenu?: MenuLeaf[];
  appId?: AppId;
  message?: string;
};

function CircleIcon({
  color,
  children,
}: {
  color: string;
  children: ReactNode;
}) {
  return (
    <span
      className="flex h-7 w-7 items-center justify-center rounded-full border bg-white"
      style={{ borderColor: color, color }}
    >
      {children}
    </span>
  );
}

function SquareIcon({
  color,
  children,
}: {
  color: string;
  children: ReactNode;
}) {
  return (
    <span
      className="flex h-7 w-7 items-center justify-center rounded-sm border bg-white"
      style={{ borderColor: "#d5d5d5", color }}
    >
      {children}
    </span>
  );
}

function MenuGlyph({ glyph, className = "h-7 w-7" }: { glyph: GlyphName | AppId; className?: string }) {
  if (glyph in APP_MAP) {
    return <AppIcon name={APP_MAP[glyph as AppId].icon} className={className} />;
  }

  switch (glyph) {
    case "programming":
      return (
        <CircleIcon color="#79a3dc">
          <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
            <path d="M9 8l-3 4 3 4M15 8l3 4-3 4M10.5 18l3-12" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
          </svg>
        </CircleIcon>
      );
    case "office":
      return (
        <CircleIcon color="#f28787">
          <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
            <path d="M6 20V7l5-3 7 4v12H6z" fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.8" />
            <path d="M12 4v5m0 0h5" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
          </svg>
        </CircleIcon>
      );
    case "internet":
      return <AppIcon name="browser" className={className} />;
    case "media":
      return (
        <CircleIcon color="#ef7f7f">
          <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
            <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.8" />
            <path d="M10 8l6 4-6 4V8z" fill="currentColor" />
          </svg>
        </CircleIcon>
      );
    case "graphics":
      return (
        <CircleIcon color="#f2b458">
          <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
            <path d="M12 4a8 8 0 1 0 8 8c0-1.7-1.3-3-3-3h-1.1A1.9 1.9 0 0 1 14 7.1V6a2 2 0 0 0-2-2z" fill="currentColor" opacity="0.18" />
            <path d="M12 4a8 8 0 1 0 8 8c0-1.7-1.3-3-3-3h-1.1A1.9 1.9 0 0 1 14 7.1V6a2 2 0 0 0-2-2z" fill="none" stroke="currentColor" strokeWidth="1.8" />
            <circle cx="8" cy="10" r="1.2" fill="currentColor" />
            <circle cx="9" cy="15" r="1.2" fill="currentColor" />
            <circle cx="13" cy="13" r="1.2" fill="currentColor" />
          </svg>
        </CircleIcon>
      );
    case "games":
      return (
        <CircleIcon color="#8bc83a">
          <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
            <path d="M7 9h10l2 8H5l2-8zm3 2v4m-2-2h4m5 0h.01M19 11h.01" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
          </svg>
        </CircleIcon>
      );
    case "other":
      return (
        <span className="flex h-8 w-8 items-center justify-center text-[#f1c02d]">
          <svg viewBox="0 0 24 24" className="h-8 w-8" aria-hidden="true">
            <path d="M4 8h16v10H4z" fill="currentColor" opacity="0.18" />
            <path d="M4 8h16v10H4zM7 5h10" fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.8" />
          </svg>
        </span>
      );
    case "accessories":
      return (
        <span className="flex h-8 w-8 items-center justify-center text-[#eb5165]">
          <svg viewBox="0 0 24 24" className="h-8 w-8" aria-hidden="true">
            <path d="M12 4l2 2-1 9 3 3-2 2-3-3-1-10 2-3z" fill="currentColor" opacity="0.18" />
            <path d="M12 4l2 2-1 9 3 3-2 2-3-3-1-10 2-3z" fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.8" />
          </svg>
        </span>
      );
    case "help":
      return (
        <CircleIcon color="#ff9e4d">
          <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
            <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.8" />
            <path d="M9.8 9.5a2.5 2.5 0 1 1 4 2c-.8.6-1.8 1.3-1.8 2.5M12 17h.01" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
          </svg>
        </CircleIcon>
      );
    case "preferences":
      return (
        <span className="flex h-8 w-8 items-center justify-center text-[#a6abb3]">
          <svg viewBox="0 0 24 24" className="h-8 w-8" aria-hidden="true">
            <path d="M4 6h16M4 12h16M4 18h16" fill="none" stroke="currentColor" strokeWidth="1.8" />
            <circle cx="9" cy="6" r="1.6" fill="currentColor" />
            <circle cx="15" cy="12" r="1.6" fill="currentColor" />
            <circle cx="7" cy="18" r="1.6" fill="currentColor" />
          </svg>
        </span>
      );
    case "run":
      return (
        <span className="flex h-8 w-8 items-center justify-center text-[#c4c6ff]">
          <svg viewBox="0 0 24 24" className="h-8 w-8" aria-hidden="true">
            <path d="M4 12l15-6-4 12-4-4-7-2z" fill="currentColor" opacity="0.18" />
            <path d="M4 12l15-6-4 12-4-4-7-2z" fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.8" />
          </svg>
        </span>
      );
    case "shutdown":
      return (
        <CircleIcon color="#8f8f8f">
          <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
            <path d="M12 4v7M8.2 6.7a7 7 0 1 0 7.6 0" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
          </svg>
        </CircleIcon>
      );
    case "archiver":
      return (
        <SquareIcon color="#b4bbc4">
          <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
            <path d="M4 7h16v10H4zM7 4h10" fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.8" />
          </svg>
        </SquareIcon>
      );
    case "document":
      return (
        <SquareIcon color="#9aa9bc">
          <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
            <path d="M7 4h7l4 4v12H7z" fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.8" />
            <path d="M10 12h4M10 15h5M10 9h3" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="1.6" />
          </svg>
        </SquareIcon>
      );
    case "menu-editor":
      return (
        <SquareIcon color="#9ba7a2">
          <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
            <path d="M5 7h10M5 12h10M5 17h7M17 7l2 2-6 6H11v-2l6-6z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
          </svg>
        </SquareIcon>
      );
    case "diagnostics":
      return (
        <SquareIcon color="#7eb4d9">
          <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
            <path d="M9 5v8a3 3 0 1 0 6 0V5M12 16v3M9 20h6" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
          </svg>
        </SquareIcon>
      );
    case "imager":
      return (
        <SquareIcon color="#cc4968">
          <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
            <path d="M12 5l4 2 3 4-1 6-6 5-6-5-1-6 3-4 4-2z" fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.8" />
          </svg>
        </SquareIcon>
      );
    case "sd-card":
      return (
        <SquareIcon color="#9ba7bf">
          <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
            <path d="M8 4h7l3 3v13H8z" fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.8" />
            <path d="M10 4v4M13 4v4M16 6v2" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="1.6" />
          </svg>
        </SquareIcon>
      );
    case "appearance":
      return (
        <SquareIcon color="#9d9db7">
          <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
            <path d="M6 7h12M6 12h12M6 17h8" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
          </svg>
        </SquareIcon>
      );
    case "info":
      return (
        <SquareIcon color="#7aa0d7">
          <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
            <circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" strokeWidth="1.8" />
            <path d="M12 10v5M12 8h.01" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
          </svg>
        </SquareIcon>
      );
    default:
      return <span className={className} />;
  }
}

function ArrowRight() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" aria-hidden="true">
      <path d="M9 6l6 6-6 6" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
    </svg>
  );
}

const ROOT_ROW_HEIGHT = 48;
const MENU_VERTICAL_MARGIN = 12;
const MENU_TOP_OFFSET = 40;

/** Delay (ms) before switching categories — gives the user time to reach the submenu */
const HOVER_INTENT_DELAY = 150;

export function StartMenu({
  onLaunchApp,
  onNotify,
  onClose,
}: {
  onLaunchApp: (appId: AppId) => void;
  onNotify: (title: string, message: string) => void;
  onClose: () => void;
}) {
  const categories = useMemo<MenuCategory[]>(
    () => [
      {
        label: "Programming",
        glyph: "programming",
        submenu: [
          { label: "VSCode Lite", glyph: "vscode", appId: "vscode" },
          { label: "Terminal", glyph: "terminal", appId: "terminal" },
          { label: "Text Editor", glyph: "text-editor", appId: "text-editor" },
          { label: "Pico Playground", glyph: "pico-playground", appId: "pico-playground" },
          { label: "Raspberry Pi 5 Simulator", glyph: "raspberry-pi-5-simulator", appId: "raspberry-pi-5-simulator" },
        ],
      },
      {
        label: "Office",
        glyph: "office",
        submenu: [
          { label: "Document Viewer", glyph: "document-viewer", appId: "document-viewer" },
        ],
      },
      {
        label: "Internet",
        glyph: "internet",
        submenu: [
          { label: "Chromium Web Browser", glyph: "browser", appId: "browser" },
        ],
      },
      {
        label: "Sound & Video",
        glyph: "media",
        submenu: [
          { label: "Media Player", glyph: "media-player", appId: "media-player" },
        ],
      },
      {
        label: "Graphics",
        glyph: "graphics",
        submenu: [
          { label: "Image Viewer", glyph: "image-viewer", appId: "image-viewer" },
        ],
      },
      {
        label: "Games",
        glyph: "games",
        submenu: [
          { label: "GamePi", glyph: "gamepi", appId: "gamepi" },
          { label: "Memory Tile", glyph: "memory-tile", appId: "memory-tile" },
          { label: "NeonRush", glyph: "neon-rush", appId: "neon-rush" },
          { label: "Pi Piano Tiles", glyph: "pi-piano-tiles", appId: "pi-piano-tiles" },
          { label: "Pie Ninja", glyph: "pie-ninja", appId: "pie-ninja" },
          { label: "Riddles", glyph: "riddles", appId: "riddles" },
          { label: "The Whispering Shadows", glyph: "whispering-shadows", appId: "whispering-shadows" },
          { label: "Pi Snake", glyph: "pi-snake", appId: "pi-snake" },
          { label: "Slice the Pie", glyph: "slice-the-pie", appId: "slice-the-pie" },
          { label: "Pi Defender", glyph: "pi-defender", appId: "pi-defender" },
        ],
      },
      {
        label: "Pi Lab",
        glyph: "about",
        submenu: [
          { label: "About π", glyph: "about", appId: "about" },
          { label: "Pi Day", glyph: "piday", appId: "piday" },
          { label: "Raspberry Pi", glyph: "raspberrypi", appId: "raspberrypi" },
          { label: "Pi Art", glyph: "piart", appId: "piart" },
          { label: "Pi Symphony", glyph: "symphony", appId: "symphony" },
          { label: "Pi Explorer", glyph: "explorer", appId: "explorer" },
          { label: "Pi Simulation", glyph: "simulation", appId: "simulation" },
          { label: "Pi Games", glyph: "games", appId: "games" },
          { label: "Pi Quiz", glyph: "quiz", appId: "quiz" },
          { label: "Pi Mandala", glyph: "mandala", appId: "mandala" },
          { label: "Pi Gallery", glyph: "gallery", appId: "gallery" },
          { label: "Pico Playground", glyph: "pico-playground", appId: "pico-playground" },
          { label: "Raspberry Pi 5 Simulator", glyph: "raspberry-pi-5-simulator", appId: "raspberry-pi-5-simulator" },
        ],
      },
      {
        label: "Other",
        glyph: "other",
        submenu: [
          { label: "Control Centre", glyph: "settings", appId: "settings" },
        ],
      },
      {
        label: "Accessories",
        glyph: "accessories",
        submenu: [
          { label: "Archiver", glyph: "archiver", appId: "archiver" },
          { label: "Calculator", glyph: "calculator", appId: "calculator" },
          { label: "Document Viewer", glyph: "document-viewer", appId: "document-viewer" },
          { label: "File Manager", glyph: "files", appId: "files" },
          { label: "Main Menu Editor", glyph: "menu-editor", appId: "menu-editor" },
          { label: "Choco Pie Diagnostics", glyph: "diagnostics", appId: "diagnostics" },
          { label: "Choco Pie Imager", glyph: "imager", appId: "imager" },
          { label: "SD Card Copier", glyph: "sd-card", appId: "sd-card-copier" },
          { label: "Task Manager", glyph: "task-manager", appId: "task-manager" },
          { label: "Terminal", glyph: "terminal", appId: "terminal" },
          { label: "Text Editor", glyph: "text-editor", appId: "text-editor" },
        ],
      },
      {
        label: "Help",
        glyph: "help",
        submenu: [
          { label: "About π", glyph: "info", appId: "about" },
        ],
      },
      {
        label: "Preferences",
        glyph: "preferences",
        submenu: [
          { label: "Control Centre", glyph: "settings", appId: "settings" },
          { label: "Appearance Settings", glyph: "appearance", appId: "settings" },
        ],
      },
      {
        label: "Run...",
        glyph: "run",
        appId: "run-dialog",
      },
      {
        label: "Shutdown...",
        glyph: "shutdown",
        appId: "shutdown-dialog",
      },
    ],
    [],
  );

  const [activeIndex, setActiveIndex] = useState<number | null>(7);
  // ── NEW: tracks which category was last clicked to keep its submenu pinned ──
  const [pinnedIndex, setPinnedIndex] = useState<number | null>(null);
  const [viewportHeight, setViewportHeight] = useState(900);
  /** Whether the mouse is currently inside the submenu panel */
  const insideSubmenuRef = useRef(false);
  /** Pending category-switch timer — cleared when the user enters the submenu */
  const hoverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const activeCategory = activeIndex === null ? null : categories[activeIndex];
  const menuMaxHeight = Math.max(240, viewportHeight - MENU_TOP_OFFSET - MENU_VERTICAL_MARGIN);
  const submenuMaxHeight = Math.max(220, menuMaxHeight - 8);
  const submenuTop = Math.max(
    0,
    Math.min(
      activeIndex === null ? 0 : activeIndex * ROOT_ROW_HEIGHT,
      menuMaxHeight - submenuMaxHeight,
    ),
  );

  /** Clear the pending hover timer */
  const clearHoverTimer = useCallback(() => {
    if (hoverTimerRef.current !== null) {
      clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
  }, []);

  /**
   * Schedule a category switch with a delay (gives the user time to reach the submenu).
   * Also clears any existing pin so hovering a new row overrides a click-pinned submenu.
   */
  const scheduleActiveIndex = useCallback(
    (index: number) => {
      clearHoverTimer();
      // Hovering a new row always clears the pin
      setPinnedIndex(null);
      if (insideSubmenuRef.current) {
        hoverTimerRef.current = setTimeout(() => {
          setActiveIndex(index);
          hoverTimerRef.current = null;
        }, HOVER_INTENT_DELAY);
      } else {
        setActiveIndex(index);
      }
    },
    [clearHoverTimer],
  );

  useEffect(() => {
    const syncViewportHeight = () => setViewportHeight(window.innerHeight);

    syncViewportHeight();
    window.addEventListener("resize", syncViewportHeight);
    return () => {
      window.removeEventListener("resize", syncViewportHeight);
      clearHoverTimer();
    };
  }, [clearHoverTimer]);

  const activateItem = (item: MenuLeaf | MenuCategory) => {
    if (item.appId) {
      onLaunchApp(item.appId);
      onClose();
      return;
    }

    if (item.message) {
      onNotify(item.label, item.message);
      onClose();
    }
  };

  return (
    <div
      className="absolute left-0 top-10 z-[420] animate-panel-rise"
      onClick={(event) => event.stopPropagation()}
      onMouseLeave={() => {
        clearHoverTimer();
        insideSubmenuRef.current = false;
        // ── CHANGED: if a category is pinned, keep it active; otherwise close ──
        setActiveIndex(pinnedIndex);
      }}
    >
      <div className="relative">
        <div
          className="desktop-flyout w-[270px] overflow-hidden"
          style={{ maxHeight: menuMaxHeight }}
        >
          <div className="scrollbar-thin overflow-y-auto py-1" style={{ maxHeight: menuMaxHeight }}>
            {categories.map((category, index) => {
              const active = activeIndex === index;
              const hasSubmenu = Boolean(category.submenu?.length);

              return (
                <button
                  key={category.label}
                  type="button"
                  onMouseEnter={() => scheduleActiveIndex(index)}
                  onClick={() => {
                    if (hasSubmenu) {
                      // ── CHANGED: click pins the submenu open ──
                      setPinnedIndex(index);
                      setActiveIndex(index);
                    } else {
                      activateItem(category);
                    }
                  }}
                  className={`flex h-12 w-full items-center gap-3 px-3 text-left ${
                    active
                      ? "bg-[var(--desktop-menu-active-bg)] text-[var(--desktop-menu-active-text)]"
                      : "text-[var(--desktop-menu-item-text)] hover:bg-[var(--desktop-menu-hover)]"
                  }`}
                >
                  <MenuGlyph glyph={category.glyph} />
                  <span className="flex-1 text-[17px] font-semibold">{category.label}</span>
                  {hasSubmenu ? (
                    <span className={active ? "text-[var(--desktop-menu-active-text)]" : "text-[var(--desktop-menu-arrow)]"}>
                      <ArrowRight />
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>

        {activeCategory?.submenu ? (
          <div
            className="desktop-flyout absolute min-w-[340px] overflow-hidden"
            style={{ top: submenuTop, left: 270, maxHeight: submenuMaxHeight, paddingLeft: 1 }}
            onMouseEnter={() => {
              /* User has reached the submenu — cancel any pending category switch */
              clearHoverTimer();
              insideSubmenuRef.current = true;
            }}
            onMouseLeave={() => {
              insideSubmenuRef.current = false;
            }}
          >
            <div className="scrollbar-thin overflow-y-auto py-1" style={{ maxHeight: submenuMaxHeight }}>
              {activeCategory.submenu.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => activateItem(item)}
                  className="flex w-full items-center gap-3 px-3 py-2.5 text-left text-[16px] font-semibold text-[var(--desktop-menu-item-text)] hover:bg-[var(--desktop-menu-hover)]"
                >
                  <MenuGlyph glyph={item.glyph} />
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
