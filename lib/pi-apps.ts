import { AppId } from "@/types/os";

export const PI_OS_EMBED_EVENT = "pi-os-open-app";
export const PI_OS_THEME_EVENT = "pi-os-theme";
export const DESKTOP_THEME_STORAGE_KEY = "desktop-theme";
export const PI_SITE_THEME_STORAGE_KEY = "pi-site-theme";

export const PI_OS_APP_IDS = [
  "about",
  "piday",
  "raspberrypi",
  "piart",
  "symphony",
  "explorer",
  "simulation",
  "games",
  "quiz",
  "mandala",
  "gallery",
] as const satisfies readonly AppId[];

export type PiOsPageAppId = (typeof PI_OS_APP_IDS)[number];
export type PiOsPageId = PiOsPageAppId;

const PI_OS_APP_ID_SET = new Set<AppId>(PI_OS_APP_IDS);

export function isPiOsPageApp(appId: AppId): appId is PiOsPageAppId {
  return PI_OS_APP_ID_SET.has(appId);
}

export const PI_OS_PAGE_BY_APP_ID = Object.fromEntries(
  PI_OS_APP_IDS.map((appId) => [appId, appId]),
) as Record<PiOsPageAppId, PiOsPageId>;

export const PI_OS_APP_ID_BY_PAGE = Object.fromEntries(
  PI_OS_APP_IDS.map((appId) => [appId, appId]),
) as Record<PiOsPageId, PiOsPageAppId>;
