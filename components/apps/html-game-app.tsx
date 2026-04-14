"use client";

import { HTML_GAME_APP_SOURCES, HtmlGameAppId } from "@/lib/game-catalog";

export function HtmlGameApp({
  appId,
}: {
  appId: HtmlGameAppId;
}) {
  return (
    <div className="h-full w-full bg-[#08111e]">
      <iframe title={appId} src={HTML_GAME_APP_SOURCES[appId]} className="h-full w-full" />
    </div>
  );
}
