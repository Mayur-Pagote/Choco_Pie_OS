"use client";

import { FormEvent, useMemo, useState } from "react";

const BOOT_LINES = [
  "Linux chocopie 6.12.0-v8+ #1 SMP PREEMPT Debian GNU/Linux",
  "Welcome to the Choco Pie OS desktop mock.",
  "Type 'help' to see available demo commands.",
];

function runCommand(command: string) {
  const normalized = command.trim().toLowerCase();

  if (!normalized) {
    return [];
  }

  if (normalized === "help") {
    return [
      "Available commands:",
      "help, ls, pwd, neofetch, uname, date, clear, sudo apt install imagination",
    ];
  }

  if (normalized === "ls") {
    return ["Desktop  Documents  Downloads  Music  Pictures  Projects"];
  }

  if (normalized === "pwd") {
    return ["/home/pi"];
  }

  if (normalized === "uname") {
    return ["Linux chocopie 6.12.0-v8+ aarch64 GNU/Linux"];
  }

  if (normalized === "date") {
    return [new Date().toString()];
  }

  if (normalized === "neofetch") {
    return [
      "OS: Choco Pie OS (Web UI)",
      "Kernel: 6.12.0-v8+",
      "Shell: bash",
      "Desktop: Choco Pie Light",
      "Theme: Sunrise",
    ];
  }

  if (normalized.startsWith("sudo apt")) {
    return ["E: Unable to locate package imagination", "This terminal is a visual mock, not a real shell."];
  }

  return [`bash: ${command}: command not found`];
}

export function TerminalApp() {
  const [input, setInput] = useState("");
  const [lines, setLines] = useState<string[]>(BOOT_LINES);
  const prompt = useMemo(() => "pi@chocopie:~ $", []);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const command = input.trim();

    if (!command) {
      return;
    }

    if (command.toLowerCase() === "clear") {
      setLines([]);
      setInput("");
      return;
    }

    const output = runCommand(command);
    setLines((current) => [...current, `${prompt} ${command}`, ...output]);
    setInput("");
  };

  return (
    <div className="system-app flex h-full flex-col bg-[#111827] text-[#d6f6df]">
      <div className="border-b border-white/8 bg-[#182230] px-4 py-3 text-xs text-[#c4d2e4]">
        Session: terminal
      </div>
      <div className="scrollbar-thin flex-1 overflow-auto px-4 py-4 font-mono text-[13px] leading-6">
        {lines.map((line, index) => (
          <div key={`${line}-${index}`}>{line}</div>
        ))}
      </div>
      <form
        onSubmit={onSubmit}
        className="app-toolbar-wrap flex flex-wrap items-center gap-3 border-t border-white/8 bg-black/18 px-4 py-3 font-mono text-[13px]"
      >
        <span className="text-[#7de39d]">{prompt}</span>
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          className="app-toolbar-grow min-w-0 flex-1 bg-transparent text-[#e5fff0] outline-none placeholder:text-[#6d8b76]"
          placeholder="Enter a command"
          spellCheck={false}
        />
      </form>
    </div>
  );
}
