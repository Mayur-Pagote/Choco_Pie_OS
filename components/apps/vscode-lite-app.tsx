"use client";

import { useEffect, useRef } from "react";

import { useOsStore } from "@/store/os-store";
import { DesktopTheme } from "@/types/os";

const VSCODE_LITE_THEME_EVENT = "vscode-lite-theme";

type VsCodeLiteThemeMessage = {
  type: typeof VSCODE_LITE_THEME_EVENT;
  theme: DesktopTheme;
};

function postTheme(frame: HTMLIFrameElement | null, theme: DesktopTheme) {
  frame?.contentWindow?.postMessage(
    { type: VSCODE_LITE_THEME_EVENT, theme } satisfies VsCodeLiteThemeMessage,
    window.location.origin,
  );
}

export function VsCodeLiteApp() {
  const desktopTheme = useOsStore((state) => state.desktopTheme);
  const initialTheme = useRef(desktopTheme).current;
  const frameRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    postTheme(frameRef.current, desktopTheme);
  }, [desktopTheme]);

  return (
    <div
      className="h-full min-h-0"
      style={{
        backgroundColor: desktopTheme === "dark" ? "#1e1e1e" : "#f3f3f3",
      }}
    >
      <iframe
        ref={frameRef}
        title="VS Code Lite"
        src={`/vscode-lite/index.html?theme=${initialTheme}`}
        className="h-full w-full border-0"
        onLoad={() => postTheme(frameRef.current, desktopTheme)}
      />
    </div>
  );
}
