import { DesktopIconPosition, WindowBounds } from "@/types/os";

export const DEFAULT_VIEWPORT = {
  width: 1440,
  height: 900,
};

export const DESKTOP_PANEL_HEIGHT = 40;
export const DESKTOP_ICON_SIZE = {
  width: 104,
  height: 102,
};

const DESKTOP_ICON_START = {
  x: 24,
  y: 56,
};
const DESKTOP_ICON_STEP = {
  x: 124,
  y: 102,
};
const DESKTOP_ICON_MARGIN = 16;
const DESKTOP_BOTTOM_MARGIN = 24;
const WINDOW_MARGIN = 8;
const WINDOW_BOTTOM_MARGIN = 12;
const FALLBACK_MIN_WINDOW_WIDTH = 320;
const FALLBACK_MIN_WINDOW_HEIGHT = 220;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function getEffectiveWindowMinSize(
  viewportWidth: number,
  viewportHeight: number,
  minWidth: number,
  minHeight: number,
) {
  const maxVisibleWidth = Math.max(FALLBACK_MIN_WINDOW_WIDTH, viewportWidth - WINDOW_MARGIN * 2);
  const maxVisibleHeight = Math.max(
    FALLBACK_MIN_WINDOW_HEIGHT,
    viewportHeight - DESKTOP_PANEL_HEIGHT - WINDOW_BOTTOM_MARGIN,
  );

  return {
    minWidth: Math.min(minWidth, maxVisibleWidth),
    minHeight: Math.min(minHeight, maxVisibleHeight),
  };
}

export function getViewportSize() {
  if (typeof window === "undefined") {
    return DEFAULT_VIEWPORT;
  }

  return { width: window.innerWidth, height: window.innerHeight };
}

export function getDesktopIconDefaultPosition(
  index: number,
  viewportHeight: number,
): DesktopIconPosition {
  const usableHeight = Math.max(
    DESKTOP_ICON_STEP.y,
    viewportHeight - DESKTOP_ICON_START.y - DESKTOP_BOTTOM_MARGIN,
  );
  const iconsPerColumn = Math.max(1, Math.floor(usableHeight / DESKTOP_ICON_STEP.y));

  return {
    x: DESKTOP_ICON_START.x + Math.floor(index / iconsPerColumn) * DESKTOP_ICON_STEP.x,
    y: DESKTOP_ICON_START.y + (index % iconsPerColumn) * DESKTOP_ICON_STEP.y,
  };
}

export function clampDesktopIconPosition(
  position: DesktopIconPosition,
  viewportWidth: number,
  viewportHeight: number,
): DesktopIconPosition {
  const minY = DESKTOP_PANEL_HEIGHT + 8;
  const maxX = Math.max(
    DESKTOP_ICON_MARGIN,
    viewportWidth - DESKTOP_ICON_SIZE.width - DESKTOP_ICON_MARGIN,
  );
  const maxY = Math.max(
    minY,
    viewportHeight - DESKTOP_ICON_SIZE.height - DESKTOP_BOTTOM_MARGIN,
  );

  return {
    x: clamp(position.x, DESKTOP_ICON_MARGIN, maxX),
    y: clamp(position.y, minY, maxY),
  };
}

export function clampWindowBounds(
  bounds: WindowBounds,
  viewportWidth: number,
  viewportHeight: number,
  minWidth: number,
  minHeight: number,
): WindowBounds {
  const effectiveMinSize = getEffectiveWindowMinSize(
    viewportWidth,
    viewportHeight,
    minWidth,
    minHeight,
  );

  const width = clamp(
    bounds.width,
    effectiveMinSize.minWidth,
    Math.max(effectiveMinSize.minWidth, viewportWidth - WINDOW_MARGIN * 2),
  );
  const height = clamp(
    bounds.height,
    effectiveMinSize.minHeight,
    Math.max(
      effectiveMinSize.minHeight,
      viewportHeight - DESKTOP_PANEL_HEIGHT - WINDOW_BOTTOM_MARGIN,
    ),
  );
  const maxX = Math.max(WINDOW_MARGIN, viewportWidth - width - WINDOW_MARGIN);
  const maxY = Math.max(
    DESKTOP_PANEL_HEIGHT,
    viewportHeight - height - WINDOW_BOTTOM_MARGIN,
  );

  return {
    x: clamp(bounds.x, WINDOW_MARGIN, maxX),
    y: clamp(bounds.y, DESKTOP_PANEL_HEIGHT, maxY),
    width,
    height,
  };
}
