"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Direction = "up" | "down" | "left" | "right";
type Cell = { x: number; y: number };
type FoodItem = Cell & { digit: number; isCorrect: boolean };
type PenaltyMode = "shrink" | "game-over";

const BOARD_SIZE = 20;
const CELL_SIZE = 24;
const CANVAS_SIZE = BOARD_SIZE * CELL_SIZE;
const INITIAL_SPEED_MS = 190;
const MIN_SPEED_MS = 82;
const HIGH_SCORE_KEY = "pi-snake-high-score";
const PI_SEQUENCE = "31415926535897932384626433832795028841971693993751058209749445923078164062862089986280348253421170679".split(
  "",
);

function wrapIndex(index: number) {
  return index % PI_SEQUENCE.length;
}

function sameCell(left: Cell, right: Cell) {
  return left.x === right.x && left.y === right.y;
}

function directionToVector(direction: Direction) {
  switch (direction) {
    case "up":
      return { x: 0, y: -1 };
    case "down":
      return { x: 0, y: 1 };
    case "left":
      return { x: -1, y: 0 };
    case "right":
      return { x: 1, y: 0 };
  }
}

function canReverse(current: Direction, next: Direction) {
  return (
    (current === "up" && next === "down") ||
    (current === "down" && next === "up") ||
    (current === "left" && next === "right") ||
    (current === "right" && next === "left")
  );
}

function randomInt(max: number) {
  return Math.floor(Math.random() * max);
}

function readHighScore() {
  if (typeof window === "undefined") {
    return 0;
  }

  const saved = window.localStorage.getItem(HIGH_SCORE_KEY);
  const parsed = saved ? Number.parseInt(saved, 10) : 0;
  return Number.isFinite(parsed) ? parsed : 0;
}

function saveHighScore(score: number) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(HIGH_SCORE_KEY, String(score));
}

class Snake {
  segments: Cell[];
  direction: Direction;
  pendingDirection: Direction;
  growth: number;

  constructor() {
    this.segments = [
      { x: 8, y: 10 },
      { x: 7, y: 10 },
      { x: 6, y: 10 },
    ];
    this.direction = "right";
    this.pendingDirection = "right";
    this.growth = 0;
  }

  get head() {
    return this.segments[0];
  }

  setDirection(next: Direction) {
    if (canReverse(this.direction, next) || canReverse(this.pendingDirection, next)) {
      return;
    }

    this.pendingDirection = next;
  }

  occupies(cell: Cell) {
    return this.segments.some((segment) => sameCell(segment, cell));
  }

  move() {
    this.direction = this.pendingDirection;
    const vector = directionToVector(this.direction);
    const nextHead = {
      x: this.head.x + vector.x,
      y: this.head.y + vector.y,
    };

    this.segments = [nextHead, ...this.segments];

    if (this.growth > 0) {
      this.growth -= 1;
      return nextHead;
    }

    this.segments.pop();
    return nextHead;
  }

  grow(amount = 1) {
    this.growth += amount;
  }

  shrink(amount = 1) {
    const nextLength = Math.max(2, this.segments.length - amount);
    this.segments = this.segments.slice(0, nextLength);
    this.growth = 0;
  }

  hitsSelf() {
    return this.segments.slice(1).some((segment) => sameCell(segment, this.head));
  }
}

class FoodManager {
  items: FoodItem[] = [];
  count: number;

  constructor(count = 6) {
    this.count = count;
  }

  private availableCells(snake: Snake, items: FoodItem[]) {
    const blocked = new Set(
      [...snake.segments, ...items].map((cell) => `${cell.x}:${cell.y}`),
    );
    const cells: Cell[] = [];

    for (let y = 0; y < BOARD_SIZE; y += 1) {
      for (let x = 0; x < BOARD_SIZE; x += 1) {
        const key = `${x}:${y}`;
        if (!blocked.has(key)) {
          cells.push({ x, y });
        }
      }
    }

    return cells;
  }

  private spawnDigit(
    digit: number,
    isCorrect: boolean,
    snake: Snake,
    items: FoodItem[],
  ): FoodItem | null {
    const openCells = this.availableCells(snake, items);
    if (openCells.length === 0) {
      return null;
    }

    const cell = openCells[randomInt(openCells.length)];
    return { ...cell, digit, isCorrect };
  }

  reset(targetDigit: number, snake: Snake) {
    this.items = [];
    this.ensureTarget(targetDigit, snake);

    while (this.items.length < this.count) {
      const digit = randomInt(10);
      const item = this.spawnDigit(digit, digit === targetDigit && !this.items.some((entry) => entry.isCorrect), snake, this.items);
      if (!item) {
        break;
      }

      this.items.push(item);
    }

    this.ensureTarget(targetDigit, snake);
  }

  ensureTarget(targetDigit: number, snake: Snake) {
    const hasTarget = this.items.some((item) => item.digit === targetDigit && item.isCorrect);
    if (hasTarget) {
      return;
    }

    const item = this.spawnDigit(targetDigit, true, snake, this.items);
    if (item) {
      this.items.push(item);
    }
  }

  refill(targetDigit: number, snake: Snake) {
    this.items = this.items.map((item) => ({
      ...item,
      isCorrect: item.digit === targetDigit && item.isCorrect,
    }));

    while (this.items.length < this.count) {
      const digit = randomInt(10);
      const isCorrect = digit === targetDigit && !this.items.some((entry) => entry.isCorrect);
      const item = this.spawnDigit(digit, isCorrect, snake, this.items);
      if (!item) {
        break;
      }

      this.items.push(item);
    }

    this.ensureTarget(targetDigit, snake);
  }

  eatAt(cell: Cell) {
    const index = this.items.findIndex((item) => sameCell(item, cell));
    if (index === -1) {
      return null;
    }

    const [item] = this.items.splice(index, 1);
    return item;
  }
}

class GameEngine {
  snake: Snake;
  food: FoodManager;
  piIndex: number;
  score: number;
  health: number;
  gameOver: boolean;
  penaltyMode: PenaltyMode;
  status: string;
  flash: { color: string; ttl: number } | null;

  constructor(penaltyMode: PenaltyMode = "shrink") {
    this.penaltyMode = penaltyMode;
    this.snake = new Snake();
    this.food = new FoodManager();
    this.piIndex = 0;
    this.score = 0;
    this.health = 3;
    this.gameOver = false;
    this.status = "Collect the highlighted pi digit to begin.";
    this.flash = null;
    this.food.reset(this.currentTargetDigit, this.snake);
  }

  get currentTargetDigit() {
    return Number(PI_SEQUENCE[wrapIndex(this.piIndex)]);
  }

  get previewDigits() {
    return Array.from({ length: 12 }, (_, offset) => ({
      digit: PI_SEQUENCE[wrapIndex(this.piIndex + offset)],
      active: offset === 0,
    }));
  }

  get speedMs() {
    return Math.max(MIN_SPEED_MS, INITIAL_SPEED_MS - this.score * 4);
  }

  setDirection(direction: Direction) {
    if (this.gameOver) {
      return;
    }

    this.snake.setDirection(direction);
  }

  restart() {
    this.snake = new Snake();
    this.food = new FoodManager();
    this.piIndex = 0;
    this.score = 0;
    this.health = 3;
    this.gameOver = false;
    this.status = "Collect the highlighted pi digit to begin.";
    this.flash = null;
    this.food.reset(this.currentTargetDigit, this.snake);
  }

  private loseHealth() {
    this.health = Math.max(0, this.health - 1);
    if (this.health === 0) {
      this.gameOver = true;
      this.status = "No health left. Pi Snake is over.";
    }
  }

  private onCorrectDigit() {
    this.snake.grow(1);
    this.score += 10;
    this.piIndex += 1;
    this.status = `Correct. Next target: ${this.currentTargetDigit}.`;
    this.flash = { color: "rgba(34,197,94,0.32)", ttl: 180 };
    this.food.refill(this.currentTargetDigit, this.snake);
  }

  private onWrongDigit(digit: number) {
    this.flash = { color: "rgba(239,68,68,0.3)", ttl: 220 };

    if (this.penaltyMode === "game-over") {
      this.gameOver = true;
      this.status = `Wrong digit: ${digit}. Game over.`;
      return;
    }

    this.snake.shrink(2);
    this.loseHealth();

    if (!this.gameOver) {
      this.status = `Wrong digit: ${digit}. Health down, target stays ${this.currentTargetDigit}.`;
      this.food.refill(this.currentTargetDigit, this.snake);
    }
  }

  step() {
    if (this.gameOver) {
      return;
    }

    const nextHead = this.snake.move();

    if (
      nextHead.x < 0 ||
      nextHead.y < 0 ||
      nextHead.x >= BOARD_SIZE ||
      nextHead.y >= BOARD_SIZE ||
      this.snake.hitsSelf()
    ) {
      this.gameOver = true;
      this.status = "You crashed. Press restart to try again.";
      this.flash = { color: "rgba(248,113,113,0.34)", ttl: 260 };
      return;
    }

    const food = this.food.eatAt(nextHead);
    if (!food) {
      return;
    }

    if (food.digit === this.currentTargetDigit && food.isCorrect) {
      this.onCorrectDigit();
      return;
    }

    this.onWrongDigit(food.digit);
  }

  tickFlash(deltaMs: number) {
    if (!this.flash) {
      return;
    }

    this.flash.ttl -= deltaMs;
    if (this.flash.ttl <= 0) {
      this.flash = null;
    }
  }
}

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

export function PiSnakeApp() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const engineRef = useRef<GameEngine>(new GameEngine("shrink"));
  const animationRef = useRef<number | null>(null);
  const lastFrameTimeRef = useRef<number | null>(null);
  const accumulatedRef = useRef(0);
  const swipeStartRef = useRef<Cell | null>(null);

  const [snapshot, setSnapshot] = useState(() => ({
    score: 0,
    health: 3,
    speedMs: INITIAL_SPEED_MS,
    status: "Collect the highlighted pi digit to begin.",
    target: 3,
    gameOver: false,
    highScore: 0,
    previewDigits: engineRef.current.previewDigits,
  }));

  const refreshSnapshot = () => {
    const engine = engineRef.current;
    const nextHighScore = Math.max(readHighScore(), engine.score);
    if (nextHighScore !== readHighScore()) {
      saveHighScore(nextHighScore);
    }

    setSnapshot({
      score: engine.score,
      health: engine.health,
      speedMs: engine.speedMs,
      status: engine.status,
      target: engine.currentTargetDigit,
      gameOver: engine.gameOver,
      highScore: nextHighScore,
      previewDigits: engine.previewDigits,
    });
  };

  const drawBoard = () => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
    }

    const engine = engineRef.current;

    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    const grid = ctx.createLinearGradient(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    grid.addColorStop(0, "#081326");
    grid.addColorStop(1, "#10213c");
    ctx.fillStyle = grid;
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    for (let y = 0; y < BOARD_SIZE; y += 1) {
      for (let x = 0; x < BOARD_SIZE; x += 1) {
        ctx.fillStyle = (x + y) % 2 === 0 ? "rgba(148,163,184,0.05)" : "rgba(15,23,42,0.15)";
        ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
      }
    }

    engine.food.items.forEach((food) => {
      const px = food.x * CELL_SIZE + 2;
      const py = food.y * CELL_SIZE + 2;
      drawRoundedRect(ctx, px, py, CELL_SIZE - 4, CELL_SIZE - 4, 7);
      ctx.fillStyle = food.isCorrect ? "#22c55e" : "#ef4444";
      ctx.fill();

      if (food.isCorrect) {
        ctx.strokeStyle = "rgba(255,255,255,0.8)";
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      ctx.fillStyle = "#ffffff";
      ctx.font = "700 16px Inter, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(String(food.digit), food.x * CELL_SIZE + CELL_SIZE / 2, food.y * CELL_SIZE + CELL_SIZE / 2 + 1);
    });

    engine.snake.segments.forEach((segment, index) => {
      const px = segment.x * CELL_SIZE + 2;
      const py = segment.y * CELL_SIZE + 2;
      drawRoundedRect(ctx, px, py, CELL_SIZE - 4, CELL_SIZE - 4, index === 0 ? 8 : 6);
      ctx.fillStyle = index === 0 ? "#7ee081" : "#38bdf8";
      ctx.fill();

      if (index === 0) {
        ctx.fillStyle = "#10213c";
        ctx.beginPath();
        ctx.arc(px + 8, py + 9, 2.1, 0, Math.PI * 2);
        ctx.arc(px + CELL_SIZE - 12, py + 9, 2.1, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    if (engine.flash) {
      ctx.fillStyle = engine.flash.color;
      ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    }

    if (engine.gameOver) {
      ctx.fillStyle = "rgba(5, 10, 20, 0.72)";
      ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
      drawRoundedRect(ctx, 72, 158, CANVAS_SIZE - 144, 140, 24);
      ctx.fillStyle = "#0f172a";
      ctx.fill();
      ctx.strokeStyle = "rgba(248,113,113,0.5)";
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = "#f8fafc";
      ctx.textAlign = "center";
      ctx.font = "800 30px Inter, sans-serif";
      ctx.fillText("Game Over", CANVAS_SIZE / 2, 208);
      ctx.font = "500 14px Inter, sans-serif";
      ctx.fillStyle = "#cbd5e1";
      ctx.fillText("Press Restart and chase pi again.", CANVAS_SIZE / 2, 243);
      ctx.font = "700 18px Inter, sans-serif";
      ctx.fillStyle = "#f59e0b";
      ctx.fillText(`Score ${engine.score}  |  High ${Math.max(readHighScore(), engine.score)}`, CANVAS_SIZE / 2, 274);
    }
  };

  useEffect(() => {
    refreshSnapshot();
    drawBoard();
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const keyMap: Record<string, Direction | undefined> = {
        ArrowUp: "up",
        ArrowDown: "down",
        ArrowLeft: "left",
        ArrowRight: "right",
      };

      const nextDirection = keyMap[event.key];
      if (!nextDirection) {
        return;
      }

      event.preventDefault();
      engineRef.current.setDirection(nextDirection);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    const animate = (time: number) => {
      const engine = engineRef.current;
      const last = lastFrameTimeRef.current ?? time;
      const delta = time - last;

      lastFrameTimeRef.current = time;
      accumulatedRef.current += delta;
      engine.tickFlash(delta);

      while (accumulatedRef.current >= engine.speedMs && !engine.gameOver) {
        engine.step();
        accumulatedRef.current -= engine.speedMs;
      }

      refreshSnapshot();
      drawBoard();
      animationRef.current = window.requestAnimationFrame(animate);
    };

    animationRef.current = window.requestAnimationFrame(animate);
    return () => {
      if (animationRef.current !== null) {
        window.cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const sequencePreview = useMemo(
    () =>
      snapshot.previewDigits.map((entry, index) => (
        <span
          key={`${entry.digit}-${index}`}
          className={`inline-flex h-9 w-9 items-center justify-center rounded-full border text-sm font-black transition ${
            entry.active
              ? "border-[#fbbf24] bg-[#f59e0b] text-[#111827] shadow-[0_0_0_4px_rgba(245,158,11,0.18)]"
              : "border-white/10 bg-[#10213d] text-[#dbeafe]"
          }`}
        >
          {entry.digit}
        </span>
      )),
    [snapshot.previewDigits],
  );

  const handleRestart = () => {
    engineRef.current.restart();
    accumulatedRef.current = 0;
    lastFrameTimeRef.current = null;
    refreshSnapshot();
    drawBoard();
  };

  const onTouchStart = (event: React.TouchEvent<HTMLCanvasElement>) => {
    const touch = event.touches[0];
    swipeStartRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const onTouchEnd = (event: React.TouchEvent<HTMLCanvasElement>) => {
    const start = swipeStartRef.current;
    const touch = event.changedTouches[0];
    swipeStartRef.current = null;

    if (!start) {
      return;
    }

    const dx = touch.clientX - start.x;
    const dy = touch.clientY - start.y;

    if (Math.abs(dx) < 18 && Math.abs(dy) < 18) {
      return;
    }

    if (Math.abs(dx) > Math.abs(dy)) {
      engineRef.current.setDirection(dx > 0 ? "right" : "left");
    } else {
      engineRef.current.setDirection(dy > 0 ? "down" : "up");
    }
  };

  return (
    <div className="h-full overflow-auto bg-[radial-gradient(circle_at_top,#17305c_0%,#091223_54%,#050914_100%)] text-white">
      <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-5 p-5">
        <section className="rounded-[34px] border border-white/10 bg-[linear-gradient(135deg,rgba(9,19,37,0.94),rgba(11,27,49,0.9))] p-5 shadow-[0_28px_80px_rgba(2,8,18,0.45)]">
          <div className="flex flex-col gap-5">
            <div>
              <div className="text-[11px] font-black uppercase tracking-[0.34em] text-[#7dd3fc]">
                Desktop Arcade
              </div>
              <h2 className="mt-2 text-4xl font-black tracking-[-0.04em] text-white">
                Pi Snake
              </h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-[#bfd4f5]">
                Guide the snake through the digits of pi. Eat the next correct number to grow and score, avoid bad turns,
                and survive wrong digits by managing your health.
              </p>
            </div>

            <div className="grid gap-3 [grid-template-columns:repeat(auto-fit,minmax(130px,1fr))]">
              <div className="rounded-[22px] border border-white/10 bg-white/6 px-4 py-3">
                <div className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#8fb3de]">Score</div>
                <div className="mt-2 text-3xl font-black text-white">{snapshot.score}</div>
              </div>
              <div className="rounded-[22px] border border-white/10 bg-white/6 px-4 py-3">
                <div className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#8fb3de]">Target</div>
                <div className="mt-2 text-3xl font-black text-[#fbbf24]">{snapshot.target}</div>
              </div>
              <div className="rounded-[22px] border border-white/10 bg-white/6 px-4 py-3">
                <div className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#8fb3de]">Health</div>
                <div className="mt-2 text-3xl font-black text-[#86efac]">{snapshot.health}</div>
              </div>
              <div className="rounded-[22px] border border-white/10 bg-white/6 px-4 py-3">
                <div className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#8fb3de]">High</div>
                <div className="mt-2 text-3xl font-black text-white">{snapshot.highScore}</div>
              </div>
            </div>
          </div>

          <div className="mt-5 rounded-[24px] border border-white/10 bg-[#071224]/80 p-4">
            <div className="flex flex-col gap-3">
              <div>
                <div className="text-[11px] font-black uppercase tracking-[0.28em] text-[#7dd3fc]">
                  Pi Sequence
                </div>
                <div className="mt-2 flex flex-wrap gap-2">{sequencePreview}</div>
              </div>
              <div className="max-w-[340px] rounded-[20px] border border-[#1d4268] bg-[#0d1e36] px-4 py-3 text-sm leading-6 text-[#d8e8ff]">
                {snapshot.status}
              </div>
            </div>
          </div>
        </section>

        <div className="grid gap-5 [grid-template-columns:repeat(auto-fit,minmax(280px,1fr))]">
          <section className="rounded-[34px] border border-white/10 bg-[linear-gradient(180deg,rgba(8,16,31,0.96),rgba(8,19,37,0.92))] p-5 shadow-[0_28px_80px_rgba(2,8,18,0.42)]">
            <div className="rounded-[28px] border border-white/8 bg-[#050b15] p-4">
              <canvas
                ref={canvasRef}
                width={CANVAS_SIZE}
                height={CANVAS_SIZE}
                className="mx-auto aspect-square w-full max-w-[480px] touch-none rounded-[22px] border border-[#1c3557] bg-[#050b15]"
                onTouchStart={onTouchStart}
                onTouchEnd={onTouchEnd}
              />
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleRestart}
                className="rounded-full bg-[linear-gradient(135deg,#f59e0b,#f97316)] px-5 py-2.5 text-sm font-black text-[#111827] shadow-[0_16px_36px_rgba(249,115,22,0.3)]"
              >
                Restart
              </button>
              <div className="rounded-full border border-white/10 bg-white/6 px-4 py-2 text-sm font-semibold text-[#dbeafe]">
                Speed {Math.round(1000 / snapshot.speedMs)} moves/sec
              </div>
              <div className="rounded-full border border-white/10 bg-white/6 px-4 py-2 text-sm font-semibold text-[#dbeafe]">
                Penalty mode: shrink + lose health
              </div>
            </div>
          </section>

          <aside className="flex flex-col gap-5">
            <section className="rounded-[34px] border border-white/10 bg-[linear-gradient(180deg,rgba(12,22,42,0.96),rgba(8,15,29,0.94))] p-5 shadow-[0_28px_80px_rgba(2,8,18,0.35)]">
              <div className="text-[11px] font-black uppercase tracking-[0.34em] text-[#7dd3fc]">
                Rules
              </div>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-[#d3e5ff]">
                <li>Eat the green number that matches the next digit of pi.</li>
                <li>Wrong red numbers shrink the snake and cost 1 health.</li>
                <li>Walls and self-collisions end the run instantly.</li>
                <li>The snake speeds up as your score climbs.</li>
                <li>At least one correct digit is always on the board.</li>
              </ul>
            </section>

            <section className="rounded-[34px] border border-white/10 bg-[linear-gradient(180deg,rgba(12,22,42,0.96),rgba(8,15,29,0.94))] p-5 shadow-[0_28px_80px_rgba(2,8,18,0.35)]">
              <div className="text-[11px] font-black uppercase tracking-[0.34em] text-[#7dd3fc]">
                Controls
              </div>
              <div className="mt-4 grid gap-2 text-sm text-[#d3e5ff]">
                <div className="flex items-center justify-between gap-3 rounded-[18px] border border-white/8 bg-white/5 px-4 py-3">
                  <span>Arrow Keys</span>
                  <span className="font-bold text-white">Move snake</span>
                </div>
                <div className="flex items-center justify-between gap-3 rounded-[18px] border border-white/8 bg-white/5 px-4 py-3">
                  <span>Swipe</span>
                  <span className="font-bold text-white">Mobile touch input</span>
                </div>
                <div className="flex items-center justify-between gap-3 rounded-[18px] border border-white/8 bg-white/5 px-4 py-3">
                  <span>Restart</span>
                  <span className="font-bold text-white">New run</span>
                </div>
              </div>
            </section>

            <section className="rounded-[34px] border border-white/10 bg-[linear-gradient(180deg,rgba(12,22,42,0.96),rgba(8,15,29,0.94))] p-5 shadow-[0_28px_80px_rgba(2,8,18,0.35)]">
              <div className="text-[11px] font-black uppercase tracking-[0.34em] text-[#7dd3fc]">
                Notes
              </div>
              <div className="mt-4 rounded-[22px] border border-[#1d4268] bg-[#0d1e36] px-4 py-3 text-sm leading-6 text-[#d8e8ff]">
                Pi data includes the first 100 digits, score is tracked locally, and the game loop uses
                `requestAnimationFrame` with timing-based movement so it stays lightweight inside the desktop.
              </div>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}
