import { promises as fs } from "fs";
import path from "path";

const STATIC_APP_DIRECTORY = path.join("content", "external-apps");
const APP_FOLDER_MAP = {
  "pico-playground": "pico-playground",
  "raspberry-pi-5-simulator": "raspberry-pi-5-simulator",
} as const;

function getContentType(filePath: string) {
  const ext = path.extname(filePath).toLowerCase();

  switch (ext) {
    case ".html":
      return "text/html; charset=utf-8";
    case ".css":
      return "text/css; charset=utf-8";
    case ".js":
      return "application/javascript; charset=utf-8";
    case ".json":
      return "application/json; charset=utf-8";
    case ".svg":
      return "image/svg+xml";
    case ".png":
      return "image/png";
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".gif":
      return "image/gif";
    case ".webp":
      return "image/webp";
    case ".ico":
      return "image/x-icon";
    case ".woff":
      return "font/woff";
    case ".woff2":
      return "font/woff2";
    default:
      return "application/octet-stream";
  }
}

function resolveSafePath(baseDir: string, requestedPath: string) {
  const normalized = path.posix.normalize(`/${requestedPath}`).replace(/^\/+/, "");
  const target = path.resolve(baseDir, normalized);
  const safePrefix = `${baseDir}${path.sep}`;

  if (target !== baseDir && !target.startsWith(safePrefix)) {
    return null;
  }

  return target;
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ appId: string; path: string[] }> },
) {
  const params = await context.params;
  const folderName =
    APP_FOLDER_MAP[params.appId as keyof typeof APP_FOLDER_MAP];

  if (!folderName) {
    return new Response("Not Found", { status: 404 });
  }

  const baseDir = path.resolve(process.cwd(), STATIC_APP_DIRECTORY, folderName);
  const requestedPath = params.path.join("/");
  const filePath = resolveSafePath(baseDir, requestedPath);

  if (!filePath) {
    return new Response("Not Found", { status: 404 });
  }

  try {
    const fileBuffer = await fs.readFile(filePath);
    return new Response(fileBuffer, {
      headers: {
        "content-type": getContentType(filePath),
      },
    });
  } catch {
    return new Response("Not Found", { status: 404 });
  }
}
