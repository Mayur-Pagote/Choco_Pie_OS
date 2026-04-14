"use client";

import { useMemo, useState } from "react";

const TEMPLATES = {
  notes: {
    label: "notes.txt",
    content: `Shopping list
- Raspberry Pi 5
- 32GB microSD
- HDMI cable

Project ideas
- Build a kiosk dashboard
- Try the camera stack
- Practice shell scripts
`,
  },
  python: {
    label: "hello.py",
    content: `def greet(name: str) -> str:
    return f"Hello, {name}!"


if __name__ == "__main__":
    print(greet("Raspberry Pi"))
`,
  },
  readme: {
    label: "README.md",
    content: `# Raspberry Pi Project

This is a lightweight editor demo inside the Raspberry Pi OS web desktop.

## Next steps

- Explore the menu apps
- Open File Manager
- Try editing this document
`,
  },
} as const;

type TemplateKey = keyof typeof TEMPLATES;

export function TextEditorApp() {
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateKey>("notes");
  const [content, setContent] = useState<string>(TEMPLATES.notes.content);
  const [savedAt, setSavedAt] = useState<string | null>(null);

  const stats = useMemo(() => {
    const words = content.trim() ? content.trim().split(/\s+/).length : 0;
    const lines = content.split("\n").length;
    return { words, lines, chars: content.length };
  }, [content]);

  const loadTemplate = (key: TemplateKey) => {
    setSelectedTemplate(key);
    setContent(TEMPLATES[key].content);
    setSavedAt(null);
  };

  return (
    <div className="system-app flex h-full flex-col bg-[#f4f4f4] text-[#202020]">
      <div className="app-toolbar-wrap flex flex-wrap items-center justify-between gap-2 border-b border-[#d8d8d8] bg-white px-4 py-2">
        <div className="flex w-full flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => loadTemplate("notes")}
            className="rounded border border-[#d1d1d1] bg-[#fafafa] px-3 py-1 text-xs font-semibold"
          >
            New Note
          </button>
          <button
            type="button"
            onClick={() => setSavedAt(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }))}
            className="rounded border border-[#d1d1d1] bg-[#fafafa] px-3 py-1 text-xs font-semibold"
          >
            Save
          </button>
        </div>
        <div className="app-toolbar-grow text-xs text-[#5f5f5f]">
          {savedAt ? `Saved at ${savedAt}` : "Unsaved changes"}
        </div>
      </div>

      <div className="app-split-layout flex min-h-0 flex-1">
        <aside className="w-44 max-w-full border-r border-[#d8d8d8] bg-[#f8f8f8] p-3">
          <div className="mb-3 text-[11px] font-bold uppercase tracking-[0.18em] text-[#767676]">
            Documents
          </div>
          <div className="space-y-1">
            {(Object.keys(TEMPLATES) as TemplateKey[]).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => loadTemplate(key)}
                className={`flex w-full items-center rounded px-2 py-2 text-left text-sm ${
                  selectedTemplate === key ? "bg-[#d9ecff] font-semibold" : "hover:bg-white"
                }`}
              >
                {TEMPLATES[key].label}
              </button>
            ))}
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <div className="border-b border-[#e0e0e0] bg-[#fbfbfb] px-4 py-2 text-sm font-semibold">
            {TEMPLATES[selectedTemplate].label}
          </div>
          <textarea
            value={content}
            onChange={(event) => setContent(event.target.value)}
            className="min-h-0 flex-1 resize-none border-0 bg-white px-4 py-4 font-mono text-[14px] leading-6 text-[#1f2937] outline-none"
            spellCheck={false}
          />
          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#d8d8d8] bg-white px-4 py-2 text-xs text-[#5f5f5f]">
            <span>{stats.lines} lines</span>
            <span>{stats.words} words</span>
            <span>{stats.chars} characters</span>
          </div>
        </div>
      </div>
    </div>
  );
}
