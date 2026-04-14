"use client";

import { useState } from "react";

const KEYS = [
  ["7", "8", "9", "/"],
  ["4", "5", "6", "*"],
  ["1", "2", "3", "-"],
  ["0", ".", "=", "+"],
];

function evaluateExpression(expression: string) {
  if (!/^[0-9+\-*/().\s]+$/.test(expression)) {
    return "Error";
  }

  try {
    const result = Function(`"use strict"; return (${expression})`)();
    return Number.isFinite(result) ? String(result) : "Error";
  } catch {
    return "Error";
  }
}

export function CalculatorApp() {
  const [expression, setExpression] = useState("0");

  const onKeyPress = (key: string) => {
    if (key === "=") {
      setExpression((current) => evaluateExpression(current));
      return;
    }

    setExpression((current) => (current === "0" ? key : `${current}${key}`));
  };

  return (
    <div className="system-app flex h-full flex-col bg-[#f4f4f4] p-3 text-[#202020]">
      <div className="scrollbar-thin overflow-x-auto rounded border border-[#d8d8d8] bg-white px-4 py-4 text-right font-mono text-2xl">
        {expression}
      </div>

      <div className="mt-3 grid gap-2">
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setExpression("0")}
            className="rounded border border-[#d1d1d1] bg-[#fafafa] px-3 py-3 text-sm font-semibold"
          >
            Clear
          </button>
          <button
            type="button"
            onClick={() => setExpression((current) => current.slice(0, -1) || "0")}
            className="rounded border border-[#d1d1d1] bg-[#fafafa] px-3 py-3 text-sm font-semibold"
          >
            Delete
          </button>
        </div>

        {KEYS.map((row) => (
          <div key={row.join("-")} className="grid grid-cols-4 gap-2">
            {row.map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => onKeyPress(key)}
                className={`rounded border px-3 py-4 text-lg font-semibold ${
                  "+-*/=".includes(key)
                    ? "border-[#efc1b5] bg-[#fff1eb] text-[#b75a52]"
                    : "border-[#d1d1d1] bg-white"
                }`}
              >
                {key}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
