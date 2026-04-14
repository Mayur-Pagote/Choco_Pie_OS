"use client";

import { useEffect, useMemo, useState } from "react";

import { useOsStore } from "@/store/os-store";

type UnitMode = "radians" | "degrees";

type BonusRule = {
  indices: number[];
  targetRadians: number;
  label: string;
};

type Level = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  targetWeights: number[];
  startWeights: number[];
  hint: string;
  bonus?: BonusRule;
};

type Result = {
  accuracy: number;
  worstDelta: number;
  bonusDelta: number | null;
  passed: boolean;
  stars: number;
};

const TWO_PI = Math.PI * 2;
const MIN_WEIGHT = 0.28;
const PIE_COLORS = ["#ef7a2d", "#4ea5d9", "#8bc34a", "#7c6ce0", "#f0b54a", "#ef6d8f"];

const LEVELS: Level[] = [
  {
    id: "quarters",
    title: "Equal Quarters",
    subtitle: "Warm-up",
    description: "Split the pie into four equal slices. The first two slices together should make pi radians.",
    targetWeights: [1, 1, 1, 1],
    startWeights: [1.36, 0.84, 1.52, 0.48],
    hint: "A full pie is 2pi radians, so four equal slices are pi/2 each.",
    bonus: {
      indices: [0, 1],
      targetRadians: Math.PI,
      label: "Slices 1 and 2 total pi radians",
    },
  },
  {
    id: "irrational-duo",
    title: "Irrational Duo",
    subtitle: "Root ratio",
    description: "Match the ratio 1 : sqrt(2) : sqrt(2).",
    targetWeights: [1, Math.sqrt(2), Math.sqrt(2)],
    startWeights: [1.54, 0.82, 1.12],
    hint: "The bigger slices should each be about 1.41 times the smallest one.",
  },
  {
    id: "pi-pair",
    title: "Pi Pair",
    subtitle: "Angle challenge",
    description: "Tune the blue and green slices so their combined angle is 3.14 radians.",
    targetWeights: [0.92, 1.57, 1.57, 1.08, 1.14],
    startWeights: [1.28, 1.08, 0.94, 1.46, 1.38],
    hint: "3.14 radians is just under half a circle, so the target pair should feel like a near-semicircle.",
    bonus: {
      indices: [1, 2],
      targetRadians: 3.14,
      label: "Slices 2 and 3 total 3.14 radians",
    },
  },
  {
    id: "golden-crust",
    title: "Golden Crust",
    subtitle: "Phi pattern",
    description: "Match the pattern 1 : phi : 1 : phi and keep the first half balanced.",
    targetWeights: [1, 1.61803398875, 1, 1.61803398875],
    startWeights: [0.78, 1.9, 1.34, 1.18],
    hint: "In this pattern, the first two slices together make exactly half the pie.",
    bonus: {
      indices: [0, 1],
      targetRadians: Math.PI,
      label: "Slices 1 and 2 total pi radians",
    },
  },
];

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function toAngles(weights: number[]) {
  const total = weights.reduce((sum, weight) => sum + weight, 0);
  return weights.map((weight) => (weight / total) * TWO_PI);
}

function updateSliceWeight(current: number[], index: number, nextWeight: number) {
  return current.map((weight, sliceIndex) =>
    sliceIndex === index ? clamp(nextWeight, MIN_WEIGHT, 4.6) : weight,
  );
}

function polarToCartesian(radius: number, angle: number) {
  return {
    x: 160 + radius * Math.cos(angle),
    y: 160 + radius * Math.sin(angle),
  };
}

function describeSlicePath(startAngle: number, endAngle: number) {
  const start = polarToCartesian(122, startAngle);
  const end = polarToCartesian(122, endAngle);
  const largeArc = endAngle - startAngle > Math.PI ? 1 : 0;

  return [
    "M 160 160",
    `L ${start.x} ${start.y}`,
    `A 122 122 0 ${largeArc} 1 ${end.x} ${end.y}`,
    "Z",
  ].join(" ");
}

function scrambleWeights(level: Level) {
  return level.targetWeights.map((weight, index) =>
    clamp(weight * (0.76 + Math.random() * 0.55) + (index % 2 === 0 ? 0.08 : -0.06), MIN_WEIGHT, 4.2),
  );
}

function formatAngle(angle: number, unitMode: UnitMode) {
  if (unitMode === "degrees") {
    return `${((angle * 180) / Math.PI).toFixed(1)}deg`;
  }

  return `${angle.toFixed(2)} rad`;
}

function formatDelta(angle: number, unitMode: UnitMode) {
  const value = unitMode === "degrees" ? (angle * 180) / Math.PI : angle;
  const suffix = unitMode === "degrees" ? "deg" : "rad";
  const sign = value >= 0 ? "+" : "-";
  return `${sign}${Math.abs(value).toFixed(2)} ${suffix}`;
}

function evaluateLevel(level: Level, weights: number[]): Result {
  const targetAngles = toAngles(level.targetWeights);
  const actualAngles = toAngles(weights);
  const deltas = actualAngles.map((angle, index) => angle - targetAngles[index]);
  const meanError =
    deltas.reduce((sum, delta) => sum + Math.abs(delta), 0) / Math.max(1, deltas.length);
  const worstDelta = Math.max(...deltas.map((delta) => Math.abs(delta)));

  const bonusDelta = level.bonus
    ? Math.abs(
        level.bonus.indices.reduce((sum, index) => sum + actualAngles[index], 0) -
          level.bonus.targetRadians,
      )
    : null;

  const accuracy = Math.max(
    0,
    Math.round(100 - (meanError / Math.PI) * 70 - (worstDelta / Math.PI) * 30),
  );
  const passed = accuracy >= 88 && worstDelta <= 0.24 && (bonusDelta === null || bonusDelta <= 0.16);

  let stars = 0;
  if (passed) stars = 1;
  if (passed && accuracy >= 94) stars = 2;
  if (passed && accuracy >= 98 && (bonusDelta === null || bonusDelta <= 0.08)) stars = 3;

  return {
    accuracy,
    worstDelta,
    bonusDelta,
    passed,
    stars,
  };
}

export function SliceThePieApp() {
  const pushNotification = useOsStore((state) => state.pushNotification);
  const [levelIndex, setLevelIndex] = useState(0);
  const [weights, setWeights] = useState<number[]>([...LEVELS[0].startWeights]);
  const [selectedSlice, setSelectedSlice] = useState(0);
  const [unitMode, setUnitMode] = useState<UnitMode>("radians");
  const [showHint, setShowHint] = useState(false);
  const [completed, setCompleted] = useState<Record<string, { accuracy: number; stars: number }>>(
    {},
  );
  const [lastResult, setLastResult] = useState<Result | null>(null);

  const level = LEVELS[levelIndex];

  useEffect(() => {
    setWeights([...level.startWeights]);
    setSelectedSlice(0);
    setShowHint(false);
    setLastResult(null);
  }, [levelIndex, level.startWeights]);

  const currentAngles = useMemo(() => toAngles(weights), [weights]);
  const targetAngles = useMemo(() => toAngles(level.targetWeights), [level.targetWeights]);
  const liveResult = useMemo(() => evaluateLevel(level, weights), [level, weights]);
  const unlockedLevels = useMemo(
    () => Math.min(LEVELS.length, Math.max(1, Object.keys(completed).length + 1)),
    [completed],
  );

  const selectedActualAngle = currentAngles[selectedSlice] ?? 0;
  const selectedTargetAngle = targetAngles[selectedSlice] ?? 0;
  const selectedDelta = selectedActualAngle - selectedTargetAngle;
  const bonusCurrent = level.bonus
    ? level.bonus.indices.reduce((sum, index) => sum + currentAngles[index], 0)
    : null;
  const maxSlider = Math.max(4.1, ...weights, ...level.targetWeights) + 0.6;

  const submitPie = () => {
    const result = evaluateLevel(level, weights);
    const nextLevel = LEVELS[levelIndex + 1];
    const hadScore = completed[level.id];

    setLastResult(result);

    if (!result.passed) {
      pushNotification("Slice the Pie", `${level.title} needs a cleaner cut. Accuracy: ${result.accuracy}%.`);
      return;
    }

    setCompleted((current) => ({
      ...current,
      [level.id]: {
        accuracy: Math.max(current[level.id]?.accuracy ?? 0, result.accuracy),
        stars: Math.max(current[level.id]?.stars ?? 0, result.stars),
      },
    }));

    if (!hadScore && nextLevel) {
      pushNotification(
        "Slice the Pie",
        `${level.title} cleared at ${result.accuracy}%. ${nextLevel.title} is now unlocked.`,
      );
      return;
    }

    pushNotification("Slice the Pie", `${level.title} cleared at ${result.accuracy}%.`);
  };

  return (
    <div className="h-full overflow-auto bg-[linear-gradient(180deg,#fff7ea,#fff2d6_42%,#f8efe3)] text-[#312317]">
      <div className="mx-auto flex w-full max-w-[1240px] flex-col gap-5 p-5">
        <section className="rounded-[30px] border border-[#efcf9b] bg-[linear-gradient(135deg,rgba(255,255,255,0.88),rgba(255,248,233,0.95))] p-5 shadow-[0_24px_60px_rgba(105,62,18,0.12)]">
          <div className="flex flex-col gap-4">
            <div>
              <div className="text-[11px] font-black uppercase tracking-[0.34em] text-[#b66a2b]">
                Puzzle Bakery
              </div>
              <h2 className="mt-2 text-3xl font-black tracking-[-0.03em] text-[#3b2415]">
                Slice the Pie
              </h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-[#6d523c]">
                Slice a pie into exact portions, match irrational ratios, and hit pi-based angle goals.
              </p>
            </div>

            <div className="grid gap-3 [grid-template-columns:repeat(auto-fit,minmax(170px,1fr))]">
              <div className="rounded-[22px] border border-[#f2d8ac] bg-white/80 px-4 py-3">
                <div className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#af7d4a]">
                  Live Accuracy
                </div>
                <div className="mt-2 text-3xl font-black text-[#3b2415]">{liveResult.accuracy}%</div>
              </div>
              <div className="rounded-[22px] border border-[#f2d8ac] bg-white/80 px-4 py-3">
                <div className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#af7d4a]">
                  Levels Cleared
                </div>
                <div className="mt-2 text-3xl font-black text-[#3b2415]">
                  {Object.keys(completed).length}/{LEVELS.length}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {LEVELS.map((entry, index) => {
              const unlocked = index < unlockedLevels;
              const score = completed[entry.id];
              const active = index === levelIndex;

              return (
                <button
                  key={entry.id}
                  type="button"
                  disabled={!unlocked}
                  onClick={() => unlocked && setLevelIndex(index)}
                  className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                    active
                      ? "border-[#c66f2b] bg-[#ef7a2d] text-white shadow-[0_10px_24px_rgba(239,122,45,0.28)]"
                      : unlocked
                        ? "border-[#efcf9b] bg-white/85 text-[#5b402d] hover:border-[#d88a3f] hover:bg-[#fff7ee]"
                        : "border-[#ead9b6] bg-[#f6ecdb] text-[#b19779]"
                  }`}
                >
                  {entry.title}
                  {score ? ` ${"*".repeat(score.stars)}` : ""}
                </button>
              );
            })}
          </div>
        </section>

        <div className="grid gap-5 [grid-template-columns:repeat(auto-fit,minmax(280px,1fr))]">
          <section className="rounded-[30px] border border-[#efcf9b] bg-white/80 p-5 shadow-[0_24px_60px_rgba(105,62,18,0.1)]">
            <div className="grid gap-5 [grid-template-columns:repeat(auto-fit,minmax(280px,1fr))]">
              <div className="rounded-[28px] border border-[#f1d9b4] bg-[radial-gradient(circle_at_top,#fffdf8,#fff2d4_72%)] p-4">
                <svg viewBox="0 0 320 320" className="mx-auto w-full max-w-[320px]">
                  <circle cx="160" cy="160" r="134" fill="#fff9ef" stroke="#efcf9b" strokeWidth="3" />
                  {currentAngles.map((angle, index) => {
                    const startAngle = currentAngles
                      .slice(0, index)
                      .reduce((sum, value) => sum + value, -Math.PI / 2);
                    const endAngle = startAngle + angle;
                    const midAngle = startAngle + angle / 2;
                    const labelPoint = polarToCartesian(82, midAngle);
                    const highlighted = level.bonus?.indices.includes(index);

                    return (
                      <g key={index}>
                        <path
                          d={describeSlicePath(startAngle, endAngle)}
                          fill={PIE_COLORS[index % PIE_COLORS.length]}
                          opacity={selectedSlice === index ? 1 : 0.9}
                          stroke={highlighted ? "#fff8e1" : "#fff5e9"}
                          strokeWidth={highlighted ? 4 : 2}
                          className="cursor-pointer"
                          onClick={() => setSelectedSlice(index)}
                        />
                        <text
                          x={labelPoint.x}
                          y={labelPoint.y}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          className="fill-white text-[13px] font-bold"
                          style={{ paintOrder: "stroke", stroke: "rgba(35,22,13,0.28)", strokeWidth: 3 }}
                        >
                          {index + 1}
                        </text>
                      </g>
                    );
                  })}
                  <circle cx="160" cy="160" r="50" fill="#fff7ea" stroke="#efcf9b" strokeWidth="3" />
                  <text x="160" y="146" textAnchor="middle" className="fill-[#b66a2b] text-[11px] font-black uppercase tracking-[0.3em]">
                    Accuracy
                  </text>
                  <text x="160" y="177" textAnchor="middle" className="fill-[#372013] text-[28px] font-black">
                    {liveResult.accuracy}%
                  </text>
                </svg>

                <div className="mt-4 grid gap-2 [grid-template-columns:repeat(auto-fit,minmax(150px,1fr))]">
                  <div className="rounded-[20px] bg-white/80 px-4 py-3">
                    <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#b07a45]">
                      Selected Slice
                    </div>
                    <div className="mt-1 text-lg font-black text-[#362114]">Slice {selectedSlice + 1}</div>
                    <div className="mt-1 text-sm text-[#6d523c]">{formatAngle(selectedActualAngle, unitMode)}</div>
                  </div>
                  <div className="rounded-[20px] bg-white/80 px-4 py-3">
                    <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#b07a45]">
                      Target Angle
                    </div>
                    <div className="mt-1 text-lg font-black text-[#362114]">{formatAngle(selectedTargetAngle, unitMode)}</div>
                    <div className="mt-1 text-sm text-[#6d523c]">Delta {formatDelta(selectedDelta, unitMode)}</div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div className="rounded-[24px] border border-[#f1d9b4] bg-[#fffaf2] p-4">
                  <div className="text-[11px] font-black uppercase tracking-[0.28em] text-[#b66a2b]">
                    {level.subtitle}
                  </div>
                  <h3 className="mt-2 text-2xl font-black tracking-[-0.03em] text-[#352012]">
                    {level.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-[#5f4733]">{level.description}</p>

                  {level.bonus ? (
                    <div className="mt-4 rounded-[18px] bg-white px-4 py-3 text-sm text-[#5f4733]">
                      <span className="font-bold text-[#3a2415]">Bonus arc:</span> {level.bonus.label}
                      <div className="mt-1 text-xs text-[#886544]">
                        Current total: {formatAngle(bonusCurrent ?? 0, unitMode)}
                      </div>
                    </div>
                  ) : null}
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setWeights([...level.startWeights])}
                    className="rounded-full border border-[#e7c28f] bg-white px-4 py-2 text-sm font-semibold text-[#5e422b]"
                  >
                    Reset Recipe
                  </button>
                  <button
                    type="button"
                    onClick={() => setWeights(scrambleWeights(level))}
                    className="rounded-full border border-[#e7c28f] bg-white px-4 py-2 text-sm font-semibold text-[#5e422b]"
                  >
                    Scramble Cuts
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowHint((current) => !current)}
                    className="rounded-full border border-[#e7c28f] bg-white px-4 py-2 text-sm font-semibold text-[#5e422b]"
                  >
                    {showHint ? "Hide Hint" : "Show Hint"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setUnitMode((current) => (current === "radians" ? "degrees" : "radians"))}
                    className="rounded-full border border-[#e7c28f] bg-white px-4 py-2 text-sm font-semibold text-[#5e422b]"
                  >
                    {unitMode === "radians" ? "Show Degrees" : "Show Radians"}
                  </button>
                </div>

                {showHint ? (
                  <div className="rounded-[22px] border border-[#f0d1a2] bg-[linear-gradient(135deg,#fffdf8,#fff4de)] px-4 py-3 text-sm leading-6 text-[#5c4431]">
                    <span className="font-bold text-[#362114]">Hint:</span> {level.hint}
                  </div>
                ) : null}

                {lastResult ? (
                  <div
                    className={`rounded-[22px] px-4 py-3 text-sm leading-6 ${
                      lastResult.passed
                        ? "border border-[#cfe7ba] bg-[#f4ffea] text-[#35562a]"
                        : "border border-[#f3d0c2] bg-[#fff3ee] text-[#7a4334]"
                    }`}
                  >
                    <div className="font-bold">
                      {lastResult.passed ? `Clear! ${"*".repeat(lastResult.stars)}` : "Not plated yet"}
                    </div>
                    <div>Worst slice drift: {formatAngle(lastResult.worstDelta, unitMode)}.</div>
                    {lastResult.bonusDelta !== null ? (
                      <div>Bonus arc miss: {formatAngle(lastResult.bonusDelta, unitMode)}.</div>
                    ) : null}
                  </div>
                ) : (
                  <div className="rounded-[22px] border border-dashed border-[#e8c99a] bg-white/60 px-4 py-3 text-sm text-[#7a624d]">
                    Fine-tune the slices, then press <span className="font-bold text-[#3a2415]">Serve Pie</span>.
                  </div>
                )}
              </div>
            </div>

            <div className="sticky top-4 z-20 mt-5 rounded-[24px] border border-[#edcf9c] bg-[rgba(255,250,242,0.96)] p-4 shadow-[0_18px_40px_rgba(105,62,18,0.08)] backdrop-blur">
              <div className="flex flex-col gap-3">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="rounded-[18px] bg-white px-4 py-3">
                    <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#b07a45]">
                      Live Accuracy
                    </div>
                    <div className="mt-1 text-2xl font-black text-[#362114]">{liveResult.accuracy}%</div>
                  </div>
                  <div className="rounded-[18px] bg-white px-4 py-3">
                    <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#b07a45]">
                      Selected Slice
                    </div>
                    <div className="mt-1 text-base font-black text-[#362114]">Slice {selectedSlice + 1}</div>
                    <div className="mt-1 text-sm text-[#6d523c]">{formatDelta(selectedDelta, unitMode)}</div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={submitPie}
                  className="rounded-full bg-[#ef7a2d] px-5 py-2.5 text-sm font-bold text-white shadow-[0_16px_32px_rgba(239,122,45,0.28)]"
                >
                  Serve Pie
                </button>
              </div>
            </div>

            <div className="mt-3 grid gap-3">
              {weights.map((weight, index) => {
                const actualAngle = currentAngles[index];
                const targetAngle = targetAngles[index];
                const delta = actualAngle - targetAngle;
                const highlighted = level.bonus?.indices.includes(index);

                return (
                  <div
                    key={index}
                    className={`rounded-[24px] border p-4 transition ${
                      selectedSlice === index
                        ? "border-[#d57e39] bg-[#fff8ee] shadow-[0_18px_32px_rgba(213,126,57,0.12)]"
                        : "border-[#f0dcc0] bg-white/85"
                    }`}
                  >
                    <div className="flex flex-col gap-3">
                      <button
                        type="button"
                        onClick={() => setSelectedSlice(index)}
                        className="flex items-center gap-3 text-left"
                      >
                        <span
                          className="flex h-11 w-11 items-center justify-center rounded-2xl text-base font-black text-white"
                          style={{ backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }}
                        >
                          {index + 1}
                        </span>
                        <span>
                          <span className="block text-sm font-black text-[#372013]">
                            Slice {index + 1}
                            {highlighted ? " - bonus arc" : ""}
                          </span>
                          <span className="block text-xs text-[#7c634d]">
                            Target {formatAngle(targetAngle, unitMode)} | Current {formatAngle(actualAngle, unitMode)}
                          </span>
                        </span>
                      </button>

                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            setWeights((current) => updateSliceWeight(current, index, current[index] - 0.08))
                          }
                          className="rounded-full border border-[#e0c398] bg-white px-3 py-1.5 text-sm font-bold text-[#5e422b]"
                        >
                          -0.08
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setWeights((current) => updateSliceWeight(current, index, current[index] + 0.08))
                          }
                          className="rounded-full border border-[#e0c398] bg-white px-3 py-1.5 text-sm font-bold text-[#5e422b]"
                        >
                          +0.08
                        </button>
                        <div
                          className={`rounded-full px-3 py-1.5 text-xs font-bold ${
                            Math.abs(delta) <= 0.06
                              ? "bg-[#e7f7dc] text-[#346128]"
                              : "bg-[#fff1df] text-[#915d2a]"
                          }`}
                        >
                          Delta {formatDelta(delta, unitMode)}
                        </div>
                      </div>
                    </div>

                    <input
                      type="range"
                      min={MIN_WEIGHT}
                      max={maxSlider}
                      step="0.01"
                      value={weight}
                      onChange={(event) =>
                        setWeights((current) =>
                          updateSliceWeight(current, index, Number(event.target.value)),
                        )
                      }
                      className="mt-4 h-2 w-full cursor-pointer appearance-none rounded-full bg-[#f2dcc0]"
                    />
                  </div>
                );
              })}
            </div>
          </section>

          <aside className="flex flex-col gap-5">
            <section className="rounded-[30px] border border-[#efcf9b] bg-white/82 p-5 shadow-[0_24px_60px_rgba(105,62,18,0.1)]">
              <div className="text-[11px] font-black uppercase tracking-[0.3em] text-[#b66a2b]">
                Scoreboard
              </div>
              <div className="mt-4 grid gap-3">
                {LEVELS.map((entry, index) => {
                  const score = completed[entry.id];

                  return (
                    <div
                      key={entry.id}
                      className={`rounded-[22px] border px-4 py-3 ${
                        index === levelIndex
                          ? "border-[#d57e39] bg-[#fff7ea]"
                          : "border-[#f1dfc2] bg-[#fffcf6]"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <div className="text-sm font-black text-[#372013]">{entry.title}</div>
                          <div className="text-xs text-[#86684d]">{entry.subtitle}</div>
                        </div>
                        <div className="text-right text-sm font-bold text-[#b66a2b]">
                          {score ? `${score.accuracy}%` : index < unlockedLevels ? "Open" : "Locked"}
                        </div>
                      </div>
                      <div className="mt-2 text-xs text-[#86684d]">
                        {score ? `Stars: ${"*".repeat(score.stars)}` : "No plated result yet."}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            <section className="rounded-[30px] border border-[#efcf9b] bg-[linear-gradient(180deg,#fff7e9,#fff1d5)] p-5 shadow-[0_24px_60px_rgba(105,62,18,0.1)]">
              <div className="text-[11px] font-black uppercase tracking-[0.3em] text-[#b66a2b]">
                Bakery Notes
              </div>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-[#5d4633]">
                <li>Every pie always totals 2pi radians, even while you resize individual slices.</li>
                <li>Bonus arcs mark slices that need to add up to a special pi-based target.</li>
                <li>The sticky score bar stays visible while you adjust the lower sliders.</li>
                <li>Scramble Cuts gives you a fresh layout without changing the recipe.</li>
              </ul>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}
