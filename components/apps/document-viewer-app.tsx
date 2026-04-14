"use client";

import { useState } from "react";

const DOCUMENTS = [
  {
    id: "welcome",
    title: "Welcome Guide.pdf",
    kind: "PDF",
    pages: [
      {
        heading: "Welcome to Raspberry Pi OS",
        body:
          "This lightweight document viewer demonstrates a simple reading experience inside the mock desktop. Use the sidebar to switch between documents and the page controls to move through multi-page files.",
      },
      {
        heading: "Getting Started",
        body:
          "Open the main menu to access Programming, Office, and Internet tools. File Manager and Terminal are functional demos, while several other apps use lightweight mock content.",
      },
    ],
  },
  {
    id: "network",
    title: "Network Checklist.odt",
    kind: "ODT",
    pages: [
      {
        heading: "Network Checklist",
        body:
          "1. Confirm Wi-Fi is connected.\n2. Check the browser opens sites.\n3. Verify Bluetooth and audio indicators in the panel.\n4. Save useful notes in Text Editor for later.",
      },
    ],
  },
  {
    id: "project",
    title: "Project Brief.txt",
    kind: "TXT",
    pages: [
      {
        heading: "Project Brief",
        body:
          "Build a Raspberry Pi inspired web desktop with a menu, panel, wallpaper, and a few working apps. Keep each app lightweight but interactive so it feels alive.",
      },
    ],
  },
] as const;

type DocumentId = (typeof DOCUMENTS)[number]["id"];

export function DocumentViewerApp() {
  const [documentId, setDocumentId] = useState<DocumentId>("welcome");
  const [pageIndex, setPageIndex] = useState(0);

  const document = DOCUMENTS.find((entry) => entry.id === documentId) ?? DOCUMENTS[0];
  const page = document.pages[pageIndex];

  return (
    <div className="system-app app-split-layout flex h-full bg-[#f4f4f4] text-[#202020]">
      <aside className="w-56 max-w-full border-r border-[#d8d8d8] bg-[#f8f8f8] p-3">
        <div className="mb-3 text-[11px] font-bold uppercase tracking-[0.18em] text-[#767676]">
          Documents
        </div>
        <div className="space-y-1">
          {DOCUMENTS.map((entry) => (
            <button
              key={entry.id}
              type="button"
              onClick={() => {
                setDocumentId(entry.id);
                setPageIndex(0);
              }}
              className={`w-full rounded px-3 py-2 text-left ${
                document.id === entry.id ? "bg-[#d9ecff]" : "hover:bg-white"
              }`}
            >
              <div className="text-sm font-semibold">{entry.title}</div>
              <div className="text-xs text-[#666666]">{entry.kind}</div>
            </button>
          ))}
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="app-toolbar-wrap flex flex-wrap items-center justify-between gap-2 border-b border-[#d8d8d8] bg-white px-4 py-2">
          <div className="app-toolbar-grow min-w-0">
            <div className="text-sm font-semibold">{document.title}</div>
            <div className="text-xs text-[#666666]">
              {document.kind} - Page {pageIndex + 1} of {document.pages.length}
            </div>
          </div>
          <div className="flex w-full flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setPageIndex((current) => Math.max(0, current - 1))}
              disabled={pageIndex === 0}
              className="rounded border border-[#d1d1d1] bg-[#fafafa] px-3 py-1 text-xs font-semibold disabled:opacity-50"
            >
              Previous
            </button>
            <button
              type="button"
              onClick={() =>
                setPageIndex((current) => Math.min(document.pages.length - 1, current + 1))
              }
              disabled={pageIndex === document.pages.length - 1}
              className="rounded border border-[#d1d1d1] bg-[#fafafa] px-3 py-1 text-xs font-semibold disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>

        <div className="scrollbar-thin flex-1 overflow-auto bg-[#ececec] p-4">
          <div className="mx-auto min-h-full max-w-3xl border border-[#d4d4d4] bg-white px-5 py-6 shadow-[0_4px_16px_rgba(0,0,0,0.08)]">
            <h2 className="text-2xl font-semibold text-[#1f2937]">{page.heading}</h2>
            <div className="mt-6 whitespace-pre-line text-[15px] leading-8 text-[#374151]">
              {page.body}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
