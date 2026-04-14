"use client";

import type {
  CSSProperties,
  MouseEvent as ReactMouseEvent,
  PointerEvent as ReactPointerEvent,
} from "react";
import { useRef } from "react";

import { AppIcon } from "@/components/icons/pi-icons";
import {
  clampDesktopIconPosition,
  DESKTOP_ICON_SIZE,
  getViewportSize,
} from "@/lib/desktop-layout";
import { AppDefinition, DesktopIconPosition } from "@/types/os";

export function DesktopIcon({
  app,
  position,
  selected,
  onSelect,
  onOpen,
  onMove,
}: {
  app: AppDefinition;
  position: DesktopIconPosition;
  selected: boolean;
  onSelect: () => void;
  onOpen: () => void;
  onMove: (x: number, y: number) => void;
}) {
  const suppressClickRef = useRef(false);

  const beginMove = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (event.button !== 0) {
      return;
    }

    event.stopPropagation();
    onSelect();

    const startX = event.clientX;
    const startY = event.clientY;
    const origin = position;
    let dragged = false;

    const onPointerMove = (moveEvent: PointerEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;

      if (!dragged && Math.hypot(deltaX, deltaY) < 4) {
        return;
      }

      dragged = true;

      const viewport = getViewportSize();
      const nextPosition = clampDesktopIconPosition(
        {
          x: origin.x + deltaX,
          y: origin.y + deltaY,
        },
        viewport.width,
        viewport.height,
      );

      onMove(nextPosition.x, nextPosition.y);
    };

    const onPointerUp = () => {
      suppressClickRef.current = dragged;
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
  };

  const handleClick = (event: ReactMouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();

    if (suppressClickRef.current) {
      suppressClickRef.current = false;
      event.preventDefault();
      return;
    }

    onSelect();
  };

  const handleDoubleClick = (event: ReactMouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();

    if (suppressClickRef.current) {
      suppressClickRef.current = false;
      event.preventDefault();
      return;
    }

    onOpen();
  };

  const style: CSSProperties = {
    left: position.x,
    top: position.y,
    width: DESKTOP_ICON_SIZE.width,
  };

  return (
    <button
      type="button"
      style={style}
      onPointerDown={beginMove}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      className={`absolute flex touch-none flex-col items-center rounded-[18px] px-1.5 py-1.5 text-white transition ${
        selected ? "bg-white/16" : "hover:bg-white/8"
      }`}
    >
      <div
        className={`flex h-[58px] w-[58px] items-center justify-center rounded-[18px] ${
          selected ? "bg-white/12" : ""
        }`}
      >
        <AppIcon
          name={app.icon}
          className="h-[50px] w-[50px] drop-shadow-[0_8px_14px_rgba(17,24,39,0.28)]"
        />
      </div>
      <span
        className={`mt-0.5 max-w-[94px] px-1 text-center text-[11px] font-semibold leading-[1.2] text-white ${
          selected ? "rounded-sm bg-[#6b99d6]/85" : ""
        }`}
        style={{ textShadow: "0 1px 2px rgba(0,0,0,0.45)" }}
      >
        {app.title}
      </span>
    </button>
  );
}
