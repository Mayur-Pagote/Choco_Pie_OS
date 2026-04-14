"use client";

import { useEffect } from "react";

import { useOsStore } from "@/store/os-store";

export function NotificationsCenter() {
  const notifications = useOsStore((state) => state.notifications);
  const desktopNotificationsEnabled = useOsStore(
    (state) => state.desktopBehavior.desktopNotifications,
  );
  const dismissNotification = useOsStore((state) => state.dismissNotification);

  useEffect(() => {
    if (!desktopNotificationsEnabled || notifications.length === 0) {
      return;
    }

    const timers = notifications.map((notification) =>
      window.setTimeout(() => dismissNotification(notification.id), 4800),
    );

    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [desktopNotificationsEnabled, dismissNotification, notifications]);

  if (!desktopNotificationsEnabled) {
    return null;
  }

  return (
    <div className="pointer-events-none absolute right-4 top-16 z-[450] flex w-[min(320px,calc(100vw-2rem))] flex-col gap-2">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className="desktop-notification pointer-events-auto rounded-[22px] px-4 py-3 text-[var(--desktop-flyout-text)] backdrop-blur-xl"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="text-sm font-semibold">{notification.title}</div>
              <div className="mt-1 text-sm text-[var(--desktop-flyout-muted)]">{notification.message}</div>
            </div>
            <button
              type="button"
              onClick={() => dismissNotification(notification.id)}
              className="rounded-full border border-[var(--desktop-flyout-border)] bg-[var(--desktop-flyout-button-bg)] px-2 py-1 text-[11px] font-semibold text-[var(--desktop-flyout-muted)]"
            >
              Close
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
