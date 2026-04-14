"use client";

import { useMemo } from "react";

import { useOsStore } from "@/store/os-store";

import { WindowFrame } from "./window-frame";

export function WindowManager() {
  const windows = useOsStore((state) => state.windows);
  const sortedWindows = useMemo(
    () => [...windows].sort((left, right) => left.zIndex - right.zIndex),
    [windows],
  );

  return (
    <div className="absolute inset-0">
      {sortedWindows
        .filter((window) => !window.minimized)
        .map((window) => (
          <WindowFrame key={window.id} windowItem={window} />
        ))}
    </div>
  );
}
