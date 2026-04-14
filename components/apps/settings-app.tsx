"use client";

import { WALLPAPERS } from "@/lib/wallpapers";
import { useOsStore } from "@/store/os-store";
import { DesktopBehavior } from "@/types/os";

function Toggle({
  label,
  description,
  enabled,
  onToggle,
}: {
  label: string;
  description: string;
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="flex w-full items-center justify-between gap-3 rounded-2xl border border-[#e2e8f0] bg-white/82 px-4 py-3 text-left transition hover:border-[#cfd9e6]"
    >
      <div className="min-w-0">
        <div className="text-sm font-semibold text-[#233244]">{label}</div>
        <div className="mt-1 text-xs text-[#728295]">{description}</div>
      </div>
      <div
        aria-hidden="true"
        className={`flex h-7 w-12 items-center rounded-full p-1 transition ${
          enabled ? "bg-[#ef6b5d]" : "bg-[#dbe3ed]"
        }`}
      >
        <div
          className={`h-5 w-5 rounded-full bg-white shadow-[0_4px_10px_rgba(15,23,42,0.16)] transition ${
            enabled ? "translate-x-5" : ""
          }`}
        />
      </div>
    </button>
  );
}

const BEHAVIOR_TOGGLES: Array<{
  key: keyof DesktopBehavior;
  label: string;
  description: string;
}> = [
  {
    key: "roundedPanelControls",
    label: "Rounded panel controls",
    description: "Use pill-shaped controls in the panel and system tray.",
  },
  {
    key: "desktopNotifications",
    label: "Desktop notifications",
    description: "Show and queue desktop toast notifications.",
  },
  {
    key: "compactTaskButtons",
    label: "Compact task buttons",
    description: "Use smaller task buttons to fit more running apps in the panel.",
  },
];

export function SettingsApp() {
  const wallpaperId = useOsStore((state) => state.wallpaperId);
  const desktopBehavior = useOsStore((state) => state.desktopBehavior);
  const setWallpaper = useOsStore((state) => state.setWallpaper);
  const setDesktopBehavior = useOsStore((state) => state.setDesktopBehavior);
  const pushNotification = useOsStore((state) => state.pushNotification);

  return (
    <div className="system-app scrollbar-thin h-full overflow-auto bg-[linear-gradient(180deg,#f9fbfd,#edf2f7)] text-[#1c2a3c]">
      <div className="border-b border-[#e2e8f0] bg-[linear-gradient(135deg,rgba(246,118,93,0.14),rgba(214,82,108,0.1),rgba(255,255,255,0.8))] px-4 py-4">
        <div className="text-xs font-semibold uppercase tracking-[0.24em] text-[#c35d70]">Control Centre</div>
        <h2 className="mt-2 text-xl font-semibold text-[#203044]">Desktop &amp; device settings</h2>
        <p className="mt-1 max-w-2xl text-sm text-[#64748b]">
          Match the lighter Choco Pie desktop with polished notifications and cleaner system surfaces.
        </p>
      </div>

      <div className="settings-main-grid grid gap-5 p-4">
        <aside className="soft-card rounded-[24px] p-4">
          <div className="text-xs font-semibold uppercase tracking-[0.22em] text-[#95a2b3]">Sections</div>
          <div className="mt-4 space-y-2 text-sm">
            <div className="rounded-2xl bg-[#f9e5e7] px-3 py-2 font-semibold text-[#b75267]">Appearance</div>
            <div className="rounded-2xl px-3 py-2 text-[#5d6c81]">Connectivity</div>
            <div className="rounded-2xl px-3 py-2 text-[#5d6c81]">Desktop</div>
            <div className="rounded-2xl px-3 py-2 text-[#5d6c81]">About</div>
          </div>

          <div className="mt-6 rounded-[22px] bg-[#f4f7fb] p-4">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[#98a5b6]">Theme</div>
            <div className="mt-2 text-sm font-semibold text-[#233244]">Choco Pie Light</div>
            <div className="mt-1 text-xs text-[#728295]">Rounded controls, soft glass panel, and refreshed window chrome.</div>
          </div>
        </aside>

        <div className="space-y-5">
          <section className="soft-card rounded-[24px] p-5">
            <div className="app-toolbar-wrap flex flex-wrap items-start justify-between gap-3">
              <div className="app-toolbar-grow min-w-0">
                <div className="text-lg font-semibold text-[#233244]">Wallpapers</div>
                <div className="mt-1 text-sm text-[#728295]">Inspired by the Choco Pie visual style and palette.</div>
              </div>
              <button
                type="button"
                onClick={() =>
                  pushNotification("Wallpaper Updated", "The desktop background has been refreshed.")
                }
                className="rounded-full border border-[#e3e8f0] bg-white px-4 py-2 text-sm font-semibold text-[#48586d]"
              >
                Preview Toast
              </button>
            </div>

            <div className="mt-4 grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(220px,1fr))]">
              {WALLPAPERS.map((wallpaper) => (
                <button
                  key={wallpaper.id}
                  type="button"
                  onClick={() => setWallpaper(wallpaper.id)}
                  className={`rounded-[24px] border p-3 text-left transition ${
                    wallpaper.id === wallpaperId
                      ? "selection-ring border-[#ef8b8c]"
                      : "border-[#e2e8f0] hover:border-[#c9d5e3]"
                  }`}
                >
                  <div
                    className="h-32 rounded-[18px] bg-cover bg-center"
                    style={{ backgroundImage: `url(${wallpaper.src})` }}
                  />
                  <div className="mt-3 text-sm font-semibold text-[#233244]">{wallpaper.name}</div>
                  <div className="mt-1 text-xs text-[#728295]">Optimized for the updated shell and softer icon contrast.</div>
                </button>
              ))}
            </div>
          </section>

          <section className="grid gap-5 [grid-template-columns:repeat(auto-fit,minmax(260px,1fr))]">
            <div className="soft-card rounded-[24px] p-5">
              <div className="text-lg font-semibold text-[#233244]">Desktop behaviour</div>
              <div className="mt-4 space-y-3">
                {BEHAVIOR_TOGGLES.map((toggle) => (
                  <Toggle
                    key={toggle.key}
                    label={toggle.label}
                    description={toggle.description}
                    enabled={desktopBehavior[toggle.key]}
                    onToggle={() =>
                      setDesktopBehavior(
                        {
                          [toggle.key]: !desktopBehavior[toggle.key],
                        } as Partial<DesktopBehavior>,
                      )
                    }
                  />
                ))}
              </div>
            </div>

            <div className="soft-card rounded-[24px] p-5">
              <div className="text-lg font-semibold text-[#233244]">System information</div>
              <div className="mt-4 grid gap-3 [grid-template-columns:repeat(auto-fit,minmax(180px,1fr))]">
                <div className="rounded-2xl bg-[#f7fafc] p-4">
                  <div className="text-xs uppercase tracking-[0.18em] text-[#97a4b5]">Desktop</div>
                  <div className="mt-2 text-sm font-semibold">Choco Pie OS</div>
                  <div className="mt-1 text-xs text-[#728295]">Trixie-inspired visual refresh</div>
                </div>
                <div className="rounded-2xl bg-[#f7fafc] p-4">
                  <div className="text-xs uppercase tracking-[0.18em] text-[#97a4b5]">Display</div>
                  <div className="mt-2 text-sm font-semibold">1920 x 1080</div>
                  <div className="mt-1 text-xs text-[#728295]">Scaled for web playback</div>
                </div>
                <div className="rounded-2xl bg-[#f7fafc] p-4">
                  <div className="text-xs uppercase tracking-[0.18em] text-[#97a4b5]">Panel</div>
                  <div className="mt-2 text-sm font-semibold">
                    {desktopBehavior.compactTaskButtons ? "Compact tasks" : "Standard tasks"}
                  </div>
                  <div className="mt-1 text-xs text-[#728295]">
                    {desktopBehavior.roundedPanelControls ? "Rounded controls" : "Square controls"}
                  </div>
                </div>
                <div className="rounded-2xl bg-[#f7fafc] p-4">
                  <div className="text-xs uppercase tracking-[0.18em] text-[#97a4b5]">Notifications</div>
                  <div className="mt-2 text-sm font-semibold">
                    {desktopBehavior.desktopNotifications ? "Enabled" : "Disabled"}
                  </div>
                  <div className="mt-1 text-xs text-[#728295]">
                    {desktopBehavior.desktopNotifications
                      ? "Timed toasts with soft blur"
                      : "Notification toasts are muted"}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
