"use client";

import { useMemo } from "react";

import { useOsStore } from "@/store/os-store";

export function TaskManagerApp() {
  const windows = useOsStore((state) => state.windows);
  const activeWindowId = useOsStore((state) => state.activeWindowId);
  const focusWindow = useOsStore((state) => state.focusWindow);
  const closeWindow = useOsStore((state) => state.closeWindow);

  const totals = useMemo(
    () => ({
      processes: windows.length,
      memory: `${Math.max(18, windows.length * 12)}%`,
      cpu: `${Math.max(6, windows.length * 7)}%`,
    }),
    [windows.length],
  );

  return (
    <div className="system-app flex h-full flex-col bg-[#f4f4f4] text-[#202020]">
      <div className="grid gap-3 border-b border-[#d8d8d8] bg-white px-4 py-3 [grid-template-columns:repeat(auto-fit,minmax(120px,1fr))]">
        <div className="rounded bg-[#f8f8f8] p-3">
          <div className="text-xs uppercase tracking-[0.16em] text-[#777777]">Processes</div>
          <div className="mt-2 text-xl font-semibold">{totals.processes}</div>
        </div>
        <div className="rounded bg-[#f8f8f8] p-3">
          <div className="text-xs uppercase tracking-[0.16em] text-[#777777]">CPU</div>
          <div className="mt-2 text-xl font-semibold">{totals.cpu}</div>
        </div>
        <div className="rounded bg-[#f8f8f8] p-3">
          <div className="text-xs uppercase tracking-[0.16em] text-[#777777]">Memory</div>
          <div className="mt-2 text-xl font-semibold">{totals.memory}</div>
        </div>
      </div>

      <div className="scrollbar-thin flex-1 overflow-auto p-4">
        <div className="rounded border border-[#d8d8d8] bg-white">
          <div className="app-table-row grid grid-cols-[minmax(0,1fr)_110px_140px] border-b border-[#e5e5e5] bg-[#fafafa] px-4 py-3 text-xs font-bold uppercase tracking-[0.16em] text-[#777777]">
            <div>Application</div>
            <div>Status</div>
            <div>Actions</div>
          </div>

          {windows.length === 0 ? (
            <div className="px-4 py-10 text-center text-sm text-[#666666]">
              No desktop apps are currently open.
            </div>
          ) : (
            windows.map((window) => (
              <div
                key={window.id}
                className="app-table-row grid grid-cols-[minmax(0,1fr)_110px_140px] items-center border-b border-[#f0f0f0] px-4 py-3 text-sm"
              >
                <div className="truncate font-semibold">{window.title}</div>
                <div className={activeWindowId === window.id ? "text-[#3c8a52]" : "text-[#777777]"}>
                  {activeWindowId === window.id ? "Active" : window.minimized ? "Minimized" : "Idle"}
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => focusWindow(window.id)}
                    className="rounded border border-[#d1d1d1] bg-[#fafafa] px-2 py-1 text-xs font-semibold"
                  >
                    Focus
                  </button>
                  <button
                    type="button"
                    onClick={() => closeWindow(window.id)}
                    className="rounded border border-[#f0c2ba] bg-[#fff2ed] px-2 py-1 text-xs font-semibold text-[#b75a52]"
                  >
                    End
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
