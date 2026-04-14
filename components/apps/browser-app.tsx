"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type HistoryEntry = {
  address: string;
};

type InternalPage = {
  title: string;
  description: string;
  body: string[];
  related: string[];
};

type SearchItem = {
  title: string;
  url: string;
  description: string;
  keywords: string[];
};

const INTERNAL_PAGES: Record<string, InternalPage> = {
  "raspberry://home": {
    title: "Chromium Start Page",
    description: "Search the web mock, open Choco Pie help pages, or jump into desktop tasks.",
    body: [
      "This Chromium mock now supports basic search results inside the app instead of only trying to load remote sites.",
      "Type a question like 'python', 'Choco Pie', 'documents', or 'terminal tips' to see relevant results.",
    ],
    related: ["raspberry://pi-os-guide", "raspberry://python-quickstart", "raspberry://desktop-apps"],
  },
  "raspberry://pi-os-guide": {
    title: "Choco Pie OS Guide",
    description: "Overview of the desktop, menus, apps, and panel tools in this mock environment.",
    body: [
      "Choco Pie OS gives you a lightweight Linux desktop with a simple menu, panel, file manager, terminal, and browser.",
      "In this mock version, the menu and core utilities are recreated as small interactive apps so the desktop feels usable.",
    ],
    related: ["raspberry://desktop-apps", "raspberry://networking-basics"],
  },
  "raspberry://python-quickstart": {
    title: "Python Quickstart",
    description: "A small programming guide for testing search and reading results inside Chromium.",
    body: [
      "Python is commonly used on Choco Pie for automation, hardware projects, and quick scripts.",
      "Try opening Terminal or Text Editor from the Programming menu to experiment with simple code and notes.",
    ],
    related: ["raspberry://terminal-tips", "raspberry://desktop-apps"],
  },
  "raspberry://desktop-apps": {
    title: "Desktop Apps",
    description: "Learn what File Manager, Terminal, Text Editor, and Document Viewer can do in this project.",
    body: [
      "File Manager provides a browsable mock filesystem. Terminal supports a few demo commands. Text Editor lets you edit sample files, and Document Viewer shows bundled documents.",
      "These apps are intentionally lightweight, but they behave enough like desktop tools to make the environment feel active.",
    ],
    related: ["raspberry://terminal-tips", "raspberry://pi-os-guide"],
  },
  "raspberry://terminal-tips": {
    title: "Terminal Tips",
    description: "Quick notes for using the built-in terminal mock.",
    body: [
      "The demo terminal supports help, ls, pwd, uname, date, neofetch, and clear.",
      "It is not a real shell, but it is enough to give the desktop a believable Choco Pie workflow.",
    ],
    related: ["raspberry://python-quickstart", "raspberry://desktop-apps"],
  },
  "raspberry://networking-basics": {
    title: "Networking Basics",
    description: "Simple guidance for browser, Wi-Fi, and web access behaviors in this mock desktop.",
    body: [
      "The browser can show internal search results and internal information pages immediately.",
      "If you enter a full URL such as https://example.com, Chromium will try to load it in an embedded frame if the remote site allows it.",
    ],
    related: ["raspberry://pi-os-guide", "raspberry://desktop-apps"],
  },
};

const SEARCH_INDEX: SearchItem[] = [
  {
    title: "Choco Pie OS Guide",
    url: "raspberry://pi-os-guide",
    description: "Learn how the Choco Pie style desktop, panel, and menu work in this project.",
    keywords: ["raspberry", "pi", "os", "desktop", "menu", "panel"],
  },
  {
    title: "Python Quickstart",
    url: "raspberry://python-quickstart",
    description: "Basic Choco Pie programming notes with pointers to Terminal and Text Editor.",
    keywords: ["python", "programming", "code", "script", "developer"],
  },
  {
    title: "Desktop Apps",
    url: "raspberry://desktop-apps",
    description: "Overview of File Manager, Terminal, Text Editor, and Document Viewer.",
    keywords: ["apps", "file manager", "documents", "editor", "viewer"],
  },
  {
    title: "Terminal Tips",
    url: "raspberry://terminal-tips",
    description: "Supported commands and guidance for the built-in terminal mock.",
    keywords: ["terminal", "shell", "bash", "command", "linux"],
  },
  {
    title: "Networking Basics",
    url: "raspberry://networking-basics",
    description: "How search and external site loading behave inside the browser app.",
    keywords: ["network", "internet", "wifi", "browser", "web"],
  },
  {
    title: "Choco Pie Official Website",
    url: "https://www.raspberrypi.com/",
    description: "Official Choco Pie website with products, software, and documentation.",
    keywords: ["official", "website", "Choco Pie", "documentation"],
  },
  {
    title: "Example Domain",
    url: "https://example.com/",
    description: "A simple embeddable page that often works well for iframe demos.",
    keywords: ["example", "test", "site", "demo"],
  },
];

function looksLikeUrl(value: string) {
  return /^(https?:\/\/|localhost(?::\d+)?(\/.*)?$|[\w-]+\.[a-z]{2,}(\/.*)?$)/i.test(value);
}

function formatUrl(value: string) {
  return value.startsWith("http://") || value.startsWith("https://") ? value : `https://${value}`;
}

function scoreSearchItem(item: SearchItem, query: string) {
  const loweredQuery = query.toLowerCase().trim();
  const terms = loweredQuery.split(/\s+/).filter(Boolean);
  const haystacks = [
    item.title.toLowerCase(),
    item.description.toLowerCase(),
    item.url.toLowerCase(),
    item.keywords.join(" ").toLowerCase(),
    INTERNAL_PAGES[item.url]?.body.join(" ").toLowerCase() ?? "",
  ];

  let score = 0;

  if (item.title.toLowerCase().includes(loweredQuery)) {
    score += 12;
  }

  if (item.description.toLowerCase().includes(loweredQuery)) {
    score += 8;
  }

  if (item.url.toLowerCase().includes(loweredQuery)) {
    score += 6;
  }

  for (const term of terms) {
    if (item.title.toLowerCase().includes(term)) {
      score += 5;
    }
    if (item.description.toLowerCase().includes(term)) {
      score += 3;
    }
    if (item.url.toLowerCase().includes(term)) {
      score += 2;
    }
    if (item.keywords.some((keyword) => keyword.toLowerCase().includes(term))) {
      score += 4;
    }
    if (haystacks.some((haystack) => haystack.includes(term))) {
      score += 1;
    }
  }

  return score;
}

function SearchResults({
  query,
  onOpen,
}: {
  query: string;
  onOpen: (address: string) => void;
}) {
  const results = useMemo(() => {
    const ranked = SEARCH_INDEX.map((item) => ({
      ...item,
      score: scoreSearchItem(item, query),
    }))
      .filter((item) => item.score > 0)
      .sort((left, right) => right.score - left.score)
      .slice(0, 8);

    return ranked.length > 0 ? ranked : SEARCH_INDEX.slice(0, 4).map((item) => ({ ...item, score: 0 }));
  }, [query]);

  const exactMatches = results.some((item) => item.score > 0);

  return (
    <div className="scrollbar-thin h-full overflow-auto bg-[#f7f8fa] px-4 py-5">
      <div className="mx-auto max-w-4xl">
        <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[#7b8797]">
          Search Results
        </div>
        <h2 className="mt-2 text-2xl font-semibold text-[#1f2937]">{query}</h2>
        <p className="mt-2 text-sm text-[#667085]">
          {exactMatches
            ? `${results.length} result${results.length === 1 ? "" : "s"} found`
            : "No exact matches found. Here are a few useful pages instead."}
        </p>

        <div className="mt-6 space-y-4">
          {results.map((result) => (
            <button
              key={`${result.url}-${result.title}`}
              type="button"
              onClick={() => onOpen(result.url)}
              className="block w-full rounded-lg border border-[#dbe1e8] bg-white px-5 py-4 text-left shadow-[0_2px_10px_rgba(0,0,0,0.04)] transition hover:border-[#b8c4d3] hover:bg-[#fcfdff]"
            >
              <div className="text-xs text-[#8a94a6]">{result.url}</div>
              <div className="mt-1 text-lg font-semibold text-[#285ea8]">{result.title}</div>
              <div className="mt-2 text-sm leading-6 text-[#4b5563]">{result.description}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function InternalPageView({
  page,
  onOpen,
}: {
  page: InternalPage;
  onOpen: (address: string) => void;
}) {
  return (
    <div className="scrollbar-thin h-full overflow-auto bg-[#f4f6f8] px-4 py-5">
      <div className="mx-auto max-w-3xl rounded-xl border border-[#dbe1e8] bg-white px-5 py-6 shadow-[0_3px_16px_rgba(0,0,0,0.05)]">
        <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8390a3]">
          Internal Page
        </div>
        <h2 className="mt-2 text-3xl font-semibold text-[#1f2937]">{page.title}</h2>
        <p className="mt-3 text-sm leading-7 text-[#667085]">{page.description}</p>

        <div className="mt-6 space-y-4 text-[15px] leading-8 text-[#374151]">
          {page.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>

        <div className="mt-8">
          <div className="text-sm font-semibold text-[#1f2937]">Related pages</div>
          <div className="mt-3 flex flex-wrap gap-2">
            {page.related.map((related) => (
              <button
                key={related}
                type="button"
                onClick={() => onOpen(related)}
                className="rounded-full border border-[#dbe3ed] bg-[#f8fafc] px-4 py-2 text-sm text-[#37516f]"
              >
                {INTERNAL_PAGES[related]?.title ?? related}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function HomePage({
  onOpen,
}: {
  onOpen: (address: string) => void;
}) {
  const quickLinks = [
    "raspberry://pi-os-guide",
    "raspberry://python-quickstart",
    "raspberry://desktop-apps",
    "raspberry://terminal-tips",
  ];

  return (
    <div className="scrollbar-thin h-full overflow-auto bg-[radial-gradient(circle_at_top,rgba(255,236,214,0.7),transparent_38%),linear-gradient(180deg,#f7f8fa,#edf2f7)] px-4 py-6">
      <div className="mx-auto max-w-4xl rounded-[24px] border border-[#ead8ca] bg-white/80 p-5 shadow-[0_18px_50px_rgba(0,0,0,0.08)]">
        <div className="text-xs font-semibold uppercase tracking-[0.22em] text-[#bd6a57]">
          Chromium
        </div>
        <h1 className="mt-3 text-3xl font-semibold text-[#1f2937]">Search the desktop web</h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-[#5b6472]">
          Enter a topic in the address bar to search local help pages and a few example web results, or open an internal page directly with a `raspberry://` address.
        </p>

        <div className="mt-8 grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(220px,1fr))]">
          {quickLinks.map((link) => (
            <button
              key={link}
              type="button"
              onClick={() => onOpen(link)}
              className="rounded-xl border border-[#e2e8f0] bg-white px-5 py-4 text-left transition hover:border-[#c9d5e3]"
            >
              <div className="text-xs text-[#8a94a6]">{link}</div>
              <div className="mt-2 text-lg font-semibold text-[#1f2937]">
                {INTERNAL_PAGES[link]?.title}
              </div>
              <div className="mt-1 text-sm text-[#667085]">
                {INTERNAL_PAGES[link]?.description}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export function BrowserApp() {
  const [input, setInput] = useState("raspberry://home");
  const [history, setHistory] = useState<HistoryEntry[]>([{ address: "raspberry://home" }]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const currentAddress = history[historyIndex]?.address ?? "raspberry://home";

  useEffect(() => {
    setInput(currentAddress);
  }, [currentAddress]);

  const view = useMemo(() => {
    if (currentAddress === "raspberry://home") {
      return { type: "home" as const };
    }

    if (INTERNAL_PAGES[currentAddress]) {
      return { type: "internal" as const, page: INTERNAL_PAGES[currentAddress] };
    }

    if (currentAddress.startsWith("search://")) {
      return { type: "search" as const, query: decodeURIComponent(currentAddress.slice("search://".length)) };
    }

    if (looksLikeUrl(currentAddress)) {
      return { type: "url" as const, src: formatUrl(currentAddress) };
    }

    return { type: "search" as const, query: currentAddress };
  }, [currentAddress]);

  const navigate = (target: string) => {
    const trimmed = target.trim() || "raspberry://home";
    const normalized =
      trimmed === "raspberry://home" || INTERNAL_PAGES[trimmed] || looksLikeUrl(trimmed)
        ? trimmed
        : `search://${encodeURIComponent(trimmed)}`;

    setHistory((current) => [...current.slice(0, historyIndex + 1), { address: normalized }]);
    setHistoryIndex(historyIndex + 1);
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    navigate(input);
  };

  return (
    <div className="system-app flex h-full flex-col bg-[linear-gradient(180deg,#f9fbfd,#edf2f7)]">
      <div className="border-b border-[#e2e8f0] bg-white/76 px-4 py-3">
        <form onSubmit={onSubmit} className="app-toolbar-wrap flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setHistoryIndex((current) => Math.max(0, current - 1))}
            disabled={historyIndex === 0}
            className="rounded-full border border-[#e2e8f0] bg-white px-3 py-1.5 text-xs font-semibold text-[#5b6b80] disabled:opacity-50"
          >
            Back
          </button>
          <button
            type="button"
            onClick={() => setHistoryIndex((current) => Math.min(history.length - 1, current + 1))}
            disabled={historyIndex >= history.length - 1}
            className="rounded-full border border-[#e2e8f0] bg-white px-3 py-1.5 text-xs font-semibold text-[#5b6b80] disabled:opacity-50"
          >
            Forward
          </button>
          <button
            type="button"
            onClick={() => navigate("raspberry://home")}
            className="rounded-full border border-[#e2e8f0] bg-white px-3 py-1.5 text-xs font-semibold text-[#5b6b80]"
          >
            Home
          </button>
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            className="app-toolbar-grow min-w-0 flex-1 rounded-full border border-[#dbe3ed] bg-[#f8fafc] px-4 py-2 text-sm text-[#223041] outline-none focus:border-[#ef6d60]"
            placeholder="Search or enter address"
          />
          <button
            type="submit"
            className="rounded-full border border-[#f2c5bf] bg-[linear-gradient(180deg,#fff5f0,#ffe7df)] px-4 py-2 text-xs font-semibold text-[#b75a52]"
          >
            Go
          </button>
        </form>
      </div>

      <div className="min-h-0 flex-1 bg-white">
        {view.type === "home" ? <HomePage onOpen={navigate} /> : null}
        {view.type === "internal" ? <InternalPageView page={view.page} onOpen={navigate} /> : null}
        {view.type === "search" ? <SearchResults query={view.query} onOpen={navigate} /> : null}
        {view.type === "url" ? (
          <iframe
            title="Chromium mock browser"
            className="h-full w-full"
            src={view.src}
          />
        ) : null}
      </div>
    </div>
  );
}
