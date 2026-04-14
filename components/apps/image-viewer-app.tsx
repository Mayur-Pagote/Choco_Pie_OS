"use client";

import { useState } from "react";

import { WALLPAPERS } from "@/lib/wallpapers";

export function ImageViewerApp() {
  const [selectedId, setSelectedId] = useState(WALLPAPERS[0].id);
  const [zoom, setZoom] = useState(100);

  const selected = WALLPAPERS.find((wallpaper) => wallpaper.id === selectedId) ?? WALLPAPERS[0];

  return (
    <div className="system-app app-split-layout flex h-full bg-[#f4f4f4] text-[#202020]">
      <aside className="w-56 max-w-full border-r border-[#d8d8d8] bg-[#f8f8f8] p-3">
        <div className="mb-3 text-[11px] font-bold uppercase tracking-[0.18em] text-[#767676]">
          Gallery
        </div>
        <div className="space-y-2">
          {WALLPAPERS.map((wallpaper) => (
            <button
              key={wallpaper.id}
              type="button"
              onClick={() => setSelectedId(wallpaper.id)}
              className={`w-full rounded border p-2 text-left ${
                wallpaper.id === selectedId ? "border-[#8fb0d8] bg-[#e7f2ff]" : "border-[#dddddd] bg-white"
              }`}
            >
              <div
                className="h-20 rounded bg-cover bg-center"
                style={{ backgroundImage: `url(${wallpaper.src})` }}
              />
              <div className="mt-2 text-sm font-semibold">{wallpaper.name}</div>
            </button>
          ))}
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="app-toolbar-wrap flex flex-wrap items-center justify-between gap-2 border-b border-[#d8d8d8] bg-white px-4 py-2">
          <div className="app-toolbar-grow min-w-0">
            <div className="text-sm font-semibold">{selected.name}</div>
            <div className="text-xs text-[#666666]">{selected.src}</div>
          </div>
          <div className="flex w-full flex-wrap items-center gap-3 text-xs text-[#555555]">
            <span>Zoom</span>
            <input
              type="range"
              min={50}
              max={160}
              value={zoom}
              onChange={(event) => setZoom(Number(event.target.value))}
            />
            <span>{zoom}%</span>
          </div>
        </div>

        <div className="scrollbar-thin flex-1 overflow-auto bg-[#e8e8e8] p-4">
          <div className="mx-auto flex min-h-full items-center justify-center rounded border border-[#d0d0d0] bg-white p-4 shadow-[0_4px_16px_rgba(0,0,0,0.08)]">
            <div
              className="aspect-[16/9] w-full max-w-4xl rounded bg-cover bg-center shadow-[0_10px_28px_rgba(0,0,0,0.16)]"
              style={{
                backgroundImage: `url(${selected.src})`,
                transform: `scale(${zoom / 100})`,
                transformOrigin: "center center",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
