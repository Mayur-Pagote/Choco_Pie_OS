"use client";

import { useEffect, useRef } from "react";

import { APP_MAP } from "@/lib/apps";
import {
  PI_OS_APP_ID_BY_PAGE,
  PI_OS_EMBED_EVENT,
  PI_OS_PAGE_BY_APP_ID,
  PI_OS_THEME_EVENT,
  isPiOsPageApp,
} from "@/lib/pi-apps";
import { useOsStore } from "@/store/os-store";
import { AppId, DesktopTheme } from "@/types/os";

type PiAppOpenMessage = {
  type: typeof PI_OS_EMBED_EVENT;
  page: keyof typeof PI_OS_APP_ID_BY_PAGE;
};

type PiAppThemeMessage = {
  type: typeof PI_OS_THEME_EVENT;
  theme: DesktopTheme;
};

function isPiAppOpenMessage(value: unknown): value is PiAppOpenMessage {
  return (
    typeof value === "object" &&
    value !== null &&
    "type" in value &&
    "page" in value &&
    (value as { type?: string }).type === PI_OS_EMBED_EVENT &&
    typeof (value as { page?: string }).page === "string"
  );
}

function postTheme(frame: HTMLIFrameElement | null, theme: DesktopTheme) {
  frame?.contentWindow?.postMessage({ type: PI_OS_THEME_EVENT, theme } satisfies PiAppThemeMessage, window.location.origin);
}

export function OsPageApp({ appId }: { appId: AppId }) {
  const openApp = useOsStore((state) => state.openApp);
  const desktopTheme = useOsStore((state) => state.desktopTheme);
  const frameRef = useRef<HTMLIFrameElement>(null);

  if (!isPiOsPageApp(appId)) {
    return null;
  }

  const page = PI_OS_PAGE_BY_APP_ID[appId];

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) {
        return;
      }

      if (event.source !== frameRef.current?.contentWindow) {
        return;
      }

      if (!isPiAppOpenMessage(event.data)) {
        return;
      }

      const nextAppId = PI_OS_APP_ID_BY_PAGE[event.data.page];
      if (nextAppId) {
        openApp(nextAppId);
      }
    };

    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [openApp]);

  useEffect(() => {
    postTheme(frameRef.current, desktopTheme);
  }, [desktopTheme]);

  return (
    <iframe
      ref={frameRef}
      src={`/pi-site/index.html?embed=1&page=${page}&theme=${desktopTheme}`}
      title={`${APP_MAP[appId].title} content`}
      className="h-full w-full"
      style={{
        backgroundColor: desktopTheme === "dark" ? "#0b1026" : "#f2f5fa",
      }}
      onLoad={() => postTheme(frameRef.current, desktopTheme)}
    />
  );
}
