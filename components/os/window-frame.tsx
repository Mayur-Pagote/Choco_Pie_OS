"use client";

import type { CSSProperties, PointerEvent as ReactPointerEvent } from "react";

import { RenderApp } from "@/components/apps/render-app";
import { AppIcon } from "@/components/icons/pi-icons";
import { cn } from "@/lib/cn";
import {
  clampWindowBounds,
  getEffectiveWindowMinSize,
  getViewportSize,
} from "@/lib/desktop-layout";
import { useOsStore } from "@/store/os-store";
import { WindowInstance } from "@/types/os";

type ResizeDirection = "n" | "s" | "e" | "w" | "ne" | "nw" | "se" | "sw";

const RESIZE_POINTS: Array<{
  direction: ResizeDirection;
  className: string;
}> = [
  { direction: "n", className: "left-3 right-3 top-0 h-3 cursor-n-resize" },
  { direction: "s", className: "bottom-0 left-3 right-3 h-3 cursor-s-resize" },
  { direction: "e", className: "bottom-3 right-0 top-3 w-3 cursor-e-resize" },
  { direction: "w", className: "bottom-3 left-0 top-3 w-3 cursor-w-resize" },
  { direction: "ne", className: "right-0 top-0 h-5 w-5 cursor-ne-resize" },
  { direction: "nw", className: "left-0 top-0 h-5 w-5 cursor-nw-resize" },
  { direction: "se", className: "bottom-0 right-0 h-5 w-5 cursor-se-resize" },
  { direction: "sw", className: "bottom-0 left-0 h-5 w-5 cursor-sw-resize" },
];

function WindowControl({
  variant,
  onClick,
}: {
  variant: "minimize" | "maximize" | "close";
  onClick: () => void;
}) {
  const sharedClassName =
    "flex h-7 w-7 items-center justify-center rounded-full border text-[var(--window-control-text)] transition";

  if (variant === "close") {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`${sharedClassName} border-[var(--window-close-border)] bg-[var(--window-close-fill)] hover:bg-[var(--window-close-fill)]`}
      >
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" aria-hidden="true">
          <path
            d="M7 7l10 10M17 7L7 17"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="1.9"
          />
        </svg>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={`${sharedClassName} border-[var(--window-control-border)] bg-[var(--window-control-fill)] hover:bg-[var(--window-control-fill)]`}
    >
      {variant === "minimize" ? (
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" aria-hidden="true">
          <path d="M7 12.5h10" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="1.9" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" aria-hidden="true">
          <rect x="7" y="7" width="10" height="10" rx="2" fill="none" stroke="currentColor" strokeWidth="1.7" />
        </svg>
      )}
    </button>
  );
}

export function WindowFrame({ windowItem }: { windowItem: WindowInstance }) {
  const focusWindow = useOsStore((state) => state.focusWindow);
  const closeWindow = useOsStore((state) => state.closeWindow);
  const minimizeWindow = useOsStore((state) => state.minimizeWindow);
  const toggleMaximize = useOsStore((state) => state.toggleMaximize);
  const updateWindowPosition = useOsStore((state) => state.updateWindowPosition);
  const updateWindowBounds = useOsStore((state) => state.updateWindowBounds);
  const activeWindowId = useOsStore((state) => state.activeWindowId);

  const beginMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.button !== 0 || windowItem.maximized) {
      return;
    }

    focusWindow(windowItem.id);
    const startX = event.clientX;
    const startY = event.clientY;
    const originX = windowItem.x;
    const originY = windowItem.y;

    const onMove = (moveEvent: PointerEvent) => {
      const viewport = getViewportSize();
      const nextBounds = clampWindowBounds(
        {
          x: originX + (moveEvent.clientX - startX),
          y: originY + (moveEvent.clientY - startY),
          width: windowItem.width,
          height: windowItem.height,
        },
        viewport.width,
        viewport.height,
        windowItem.minWidth,
        windowItem.minHeight,
      );

      updateWindowPosition(windowItem.id, nextBounds.x, nextBounds.y);
    };

    const onUp = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  };

  const beginResize =
    (direction: ResizeDirection) => (event: ReactPointerEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();

      if (event.button !== 0 || windowItem.maximized) {
        return;
      }

      const resizeHandle = event.currentTarget;
      const pointerId = event.pointerId;
      resizeHandle.setPointerCapture?.(pointerId);
      focusWindow(windowItem.id);
      const startX = event.clientX;
      const startY = event.clientY;
      const origin = {
        x: windowItem.x,
        y: windowItem.y,
        width: windowItem.width,
        height: windowItem.height,
      };

      const onMove = (moveEvent: PointerEvent) => {
        const deltaX = moveEvent.clientX - startX;
        const deltaY = moveEvent.clientY - startY;
        const viewport = getViewportSize();
        const effectiveMinSize = getEffectiveWindowMinSize(
          viewport.width,
          viewport.height,
          windowItem.minWidth,
          windowItem.minHeight,
        );

        let nextX = origin.x;
        let nextY = origin.y;
        let nextWidth = origin.width;
        let nextHeight = origin.height;

        if (direction.includes("e")) {
          nextWidth = Math.max(effectiveMinSize.minWidth, origin.width + deltaX);
        }
        if (direction.includes("s")) {
          nextHeight = Math.max(effectiveMinSize.minHeight, origin.height + deltaY);
        }
        if (direction.includes("w")) {
          const candidateWidth = origin.width - deltaX;
          nextWidth = Math.max(effectiveMinSize.minWidth, candidateWidth);
          nextX = origin.x + (origin.width - nextWidth);
        }
        if (direction.includes("n")) {
          const candidateHeight = origin.height - deltaY;
          nextHeight = Math.max(effectiveMinSize.minHeight, candidateHeight);
          nextY = origin.y + (origin.height - nextHeight);
        }

        const nextBounds = clampWindowBounds(
          {
            x: nextX,
            y: nextY,
            width: nextWidth,
            height: nextHeight,
          },
          viewport.width,
          viewport.height,
          windowItem.minWidth,
          windowItem.minHeight,
        );

        updateWindowBounds(
          windowItem.id,
          nextBounds.x,
          nextBounds.y,
          nextBounds.width,
          nextBounds.height,
        );
      };

      const onUp = () => {
        resizeHandle.releasePointerCapture?.(pointerId);
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onUp);
      };

      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onUp);
    };

  const isActive = activeWindowId === windowItem.id;
  const isFullBleedApp = windowItem.appId === "vscode";
  const viewport = getViewportSize();
  const boundedWindow = clampWindowBounds(
    {
      x: windowItem.x,
      y: windowItem.y,
      width: windowItem.width,
      height: windowItem.height,
    },
    viewport.width,
    viewport.height,
    windowItem.minWidth,
    windowItem.minHeight,
  );

  const style: CSSProperties = windowItem.maximized
    ? {
        left: 12,
        top: 40,
        width: "calc(100% - 24px)",
        height: "calc(100% - 52px)",
        zIndex: windowItem.zIndex,
      }
    : {
        left: boundedWindow.x,
        top: boundedWindow.y,
        width: boundedWindow.width,
        height: boundedWindow.height,
        zIndex: windowItem.zIndex,
      };

  return (
    <div
      className="absolute animate-window-in"
      style={style}
      onMouseDown={() => focusWindow(windowItem.id)}
    >
      <div
        className={cn(
          "window-shell relative flex h-full flex-col rounded-[26px]",
          isFullBleedApp ? "overflow-hidden p-0" : "p-2",
        )}
      >
        <div
          onPointerDown={beginMove}
          className={cn(
            "flex h-12 items-center text-[var(--window-title-text)]",
            isFullBleedApp ? "border-b border-[var(--window-body-border)] px-5" : "rounded-[20px] px-3",
            isActive
              ? "bg-[var(--window-title-active-bg)]"
              : "bg-[var(--window-title-idle-bg)] text-[var(--window-title-muted)]",
          )}
        >
          <div
            className={cn(
              "mr-3 h-7 w-1.5 rounded-full",
              isActive ? "bg-[var(--wallpaper-accent)]" : "bg-[var(--window-title-stripe-idle)]",
            )}
          />
          <div className="flex min-w-0 flex-1 items-center gap-2">
            <AppIcon name={windowItem.icon} className="h-5 w-5 shrink-0" />
            <span className="truncate text-sm font-semibold">{windowItem.title}</span>
          </div>
          <div className="ml-3 flex items-center gap-2">
            <WindowControl variant="minimize" onClick={() => minimizeWindow(windowItem.id)} />
            <WindowControl variant="maximize" onClick={() => toggleMaximize(windowItem.id)} />
            <WindowControl variant="close" onClick={() => closeWindow(windowItem.id)} />
          </div>
        </div>

        <div
          className={cn(
            "min-h-0 flex-1",
            isFullBleedApp ? "overflow-hidden bg-transparent" : "overflow-auto window-body mt-2 rounded-[20px]",
          )}
        >
          <RenderApp appId={windowItem.appId} />
        </div>

        {!windowItem.maximized &&
          RESIZE_POINTS.map((point) => (
            <div
              key={point.direction}
              onPointerDown={beginResize(point.direction)}
              className={cn("absolute z-20 touch-none", point.className)}
            />
          ))}
      </div>
    </div>
  );
}
