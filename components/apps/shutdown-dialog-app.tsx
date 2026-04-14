"use client";

import { useOsStore } from "@/store/os-store";

export function ShutdownDialogApp() {
  const closeAllWindows = useOsStore((state) => state.closeAllWindows);
  const pushNotification = useOsStore((state) => state.pushNotification);

  const performAction = (label: string, message: string, shouldClear = false) => {
    if (shouldClear) {
      closeAllWindows();
    }
    pushNotification(label, message);
  };

  return (
    <div className="system-app flex h-full items-center justify-center bg-[#f4f4f4] p-6 text-[#202020]">
      <div className="w-full max-w-md rounded border border-[#d8d8d8] bg-white p-6 shadow-[0_10px_24px_rgba(0,0,0,0.08)]">
        <div className="text-xl font-semibold">Session Controls</div>
        <p className="mt-2 text-sm text-[#666666]">
          These actions are lightweight desktop simulations for the web version.
        </p>

        <div className="mt-5 grid gap-3">
          <button
            type="button"
            onClick={() => performAction("Shutdown", "The desktop session has been powered down.", true)}
            className="rounded border border-[#f0c2ba] bg-[#fff2ed] px-4 py-3 text-left text-sm font-semibold text-[#b75a52]"
          >
            Shutdown session
          </button>
          <button
            type="button"
            onClick={() => performAction("Restart", "The session is restarting now.", true)}
            className="rounded border border-[#d1d1d1] bg-[#fafafa] px-4 py-3 text-left text-sm font-semibold"
          >
            Restart session
          </button>
          <button
            type="button"
            onClick={() => performAction("Sleep", "Display sleep mode simulated.")}
            className="rounded border border-[#d1d1d1] bg-[#fafafa] px-4 py-3 text-left text-sm font-semibold"
          >
            Sleep display
          </button>
        </div>
      </div>
    </div>
  );
}
