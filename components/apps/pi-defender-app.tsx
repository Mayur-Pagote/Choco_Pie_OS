"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type TowerType = "basic" | "rapid" | "heavy";
type EnemyKind = "swarm" | "fast" | "strong" | "elite" | "boss";
type SoundCue = "place" | "upgrade" | "defeat" | "boss" | "damage" | "game-over";

type Point = {
  x: number;
  y: number;
};

type Slot = Point & {
  id: string;
  ring: number;
  angle: number;
};

type DigitPattern = {
  count: number;
  kind: EnemyKind;
  label: string;
};

type ExplosionSnapshot = {
  id: string;
  x: number;
  y: number;
  radius: number;
  alpha: number;
  color: string;
};

type EnemySnapshot = {
  id: string;
  x: number;
  y: number;
  radius: number;
  kind: EnemyKind;
  health: number;
  maxHealth: number;
  digit: number;
};

type TowerSnapshot = {
  id: string;
  slotId: string;
  x: number;
  y: number;
  type: TowerType;
  level: number;
  range: number;
  cooldownRatio: number;
};

type ProjectileSnapshot = {
  id: string;
  x: number;
  y: number;
  radius: number;
  color: string;
};

type WavePlan = {
  digit: number;
  label: string;
  queue: Array<{
    kind: EnemyKind;
    digit: number;
    laneOffset: number;
    waveNumber: number;
  }>;
  spawnDelay: number;
};

type GamePhase = "start" | "playing" | "paused" | "game-over";

type GameSnapshot = {
  phase: GamePhase;
  waveNumber: number;
  piDigitIndex: number;
  currentDigit: number;
  wavesSurvived: number;
  health: number;
  maxHealth: number;
  currency: number;
  score: number;
  towers: TowerSnapshot[];
  enemies: EnemySnapshot[];
  projectiles: ProjectileSnapshot[];
  explosions: ExplosionSnapshot[];
  nextWaveTimer: number;
  activeWaveLabel: string;
  highestPiDigitIndex: number;
  slots: Slot[];
};

const TAU = Math.PI * 2;
const BOARD_SIZE = 720;
const CENTER = BOARD_SIZE / 2;
const CORE_RADIUS = 38;
const OUTER_RADIUS = 310;
const SPIRAL_TURNS = 2.95;
const PI_DIGITS =
  "31415926535897932384626433832795028841971693993751058209749445923078164062862089986280348253421170679";
const DIGIT_SEQUENCE = PI_DIGITS.split("").map(Number);

const DIGIT_PATTERNS: Record<number, DigitPattern> = {
  0: { count: 10, kind: "fast", label: "Zero Rush" },
  1: { count: 1, kind: "fast", label: "Single Spark" },
  2: { count: 2, kind: "fast", label: "Twin Sprint" },
  3: { count: 3, kind: "swarm", label: "Tri Swarm" },
  4: { count: 4, kind: "strong", label: "Fortress Four" },
  5: { count: 5, kind: "swarm", label: "Pentaflow" },
  6: { count: 3, kind: "strong", label: "Dense Hex" },
  7: { count: 7, kind: "fast", label: "Prime Blitz" },
  8: { count: 4, kind: "strong", label: "Octa Guard" },
  9: { count: 1, kind: "elite", label: "Nova Elite" },
};

const TOWER_BLUEPRINTS: Record<
  TowerType,
  {
    label: string;
    cost: number;
    range: number;
    damage: number;
    fireRate: number;
    projectileSpeed: number;
    color: string;
    accent: string;
    splashRadius: number;
  }
> = {
  basic: {
    label: "Basic Tower",
    cost: 60,
    range: 126,
    damage: 12,
    fireRate: 1.25,
    projectileSpeed: 340,
    color: "#8be2ff",
    accent: "#38bdf8",
    splashRadius: 0,
  },
  rapid: {
    label: "Rapid Tower",
    cost: 80,
    range: 110,
    damage: 6,
    fireRate: 3.3,
    projectileSpeed: 420,
    color: "#fde68a",
    accent: "#f59e0b",
    splashRadius: 0,
  },
  heavy: {
    label: "Heavy Tower",
    cost: 120,
    range: 150,
    damage: 32,
    fireRate: 0.68,
    projectileSpeed: 250,
    color: "#fca5a5",
    accent: "#ef4444",
    splashRadius: 26,
  },
};

const ENEMY_BLUEPRINTS: Record<
  EnemyKind,
  {
    speed: number;
    health: number;
    radius: number;
    reward: number;
    damageToBase: number;
    color: string;
    stroke: string;
  }
> = {
  swarm: {
    speed: 0.055,
    health: 24,
    radius: 10,
    reward: 8,
    damageToBase: 1,
    color: "#67e8f9",
    stroke: "#0f766e",
  },
  fast: {
    speed: 0.082,
    health: 17,
    radius: 8,
    reward: 9,
    damageToBase: 1,
    color: "#f9a8d4",
    stroke: "#be185d",
  },
  strong: {
    speed: 0.043,
    health: 48,
    radius: 13,
    reward: 14,
    damageToBase: 1,
    color: "#c4b5fd",
    stroke: "#6d28d9",
  },
  elite: {
    speed: 0.05,
    health: 94,
    radius: 18,
    reward: 34,
    damageToBase: 2,
    color: "#fdba74",
    stroke: "#c2410c",
  },
  boss: {
    speed: 0.031,
    health: 230,
    radius: 24,
    reward: 70,
    damageToBase: 3,
    color: "#f87171",
    stroke: "#991b1b",
  },
};

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function distance(a: Point, b: Point) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function polarToCartesian(radius: number, angle: number) {
  return {
    x: CENTER + radius * Math.cos(angle),
    y: CENTER + radius * Math.sin(angle),
  };
}

function getSpiralPoint(progress: number, laneOffset = 0) {
  const clampedProgress = clamp(progress, 0, 1);
  const angle = -Math.PI / 2 + clampedProgress * SPIRAL_TURNS * TAU;
  const radius = lerp(OUTER_RADIUS, CORE_RADIUS + 12, clampedProgress) + laneOffset;
  const point = polarToCartesian(radius, angle);

  return {
    ...point,
    angle,
    radius,
  };
}

function buildSpiralPoints(samples: number) {
  return Array.from({ length: samples }, (_, index) => {
    const progress = index / (samples - 1);
    const point = getSpiralPoint(progress);
    return `${point.x},${point.y}`;
  }).join(" ");
}

function buildTowerSlots() {
  const rings = [128, 186, 244, 292];
  const slotsPerRing = 12;

  return rings.flatMap((radius, ringIndex) =>
    Array.from({ length: slotsPerRing }, (_, angleIndex) => {
      const angle = -Math.PI / 2 + (angleIndex / slotsPerRing) * TAU + ringIndex * 0.12;
      const point = polarToCartesian(radius, angle);
      return {
        id: `ring-${ringIndex}-slot-${angleIndex}`,
        ring: ringIndex,
        angle,
        x: point.x,
        y: point.y,
      };
    }),
  );
}

const SPIRAL_POINTS = buildSpiralPoints(220);
const TOWER_SLOTS = buildTowerSlots();

function formatSeconds(value: number) {
  return Math.max(0, value).toFixed(1);
}

function describeHighestDigit(index: number) {
  if (index <= 0) {
    return "Not reached";
  }

  const digit = DIGIT_SEQUENCE[(index - 1) % DIGIT_SEQUENCE.length];
  return `#${index} = ${digit}`;
}

class Enemy {
  id: string;
  kind: EnemyKind;
  digit: number;
  waveNumber: number;
  progress: number;
  speed: number;
  health: number;
  maxHealth: number;
  radius: number;
  reward: number;
  damageToBase: number;
  laneOffset: number;
  color: string;
  stroke: string;

  constructor(kind: EnemyKind, digit: number, waveNumber: number, laneOffset: number) {
    const blueprint = ENEMY_BLUEPRINTS[kind];
    const waveScale = 1 + waveNumber * 0.062;

    this.id = `enemy-${waveNumber}-${kind}-${Math.random().toString(36).slice(2, 8)}`;
    this.kind = kind;
    this.digit = digit;
    this.waveNumber = waveNumber;
    this.progress = 0;
    this.speed = blueprint.speed * Math.min(1.65, 1 + waveNumber * 0.012);
    this.health = Math.round(blueprint.health * waveScale);
    this.maxHealth = this.health;
    this.radius = kind === "boss" ? blueprint.radius + Math.min(8, waveNumber * 0.14) : blueprint.radius;
    this.reward = Math.round(blueprint.reward * (1 + waveNumber * 0.03));
    this.damageToBase = blueprint.damageToBase;
    this.laneOffset = laneOffset;
    this.color = blueprint.color;
    this.stroke = blueprint.stroke;
  }

  getPosition() {
    return getSpiralPoint(this.progress, this.laneOffset);
  }

  update(dt: number) {
    this.progress += this.speed * dt;
  }

  takeDamage(amount: number) {
    this.health -= amount;
    return this.health <= 0;
  }
}

class Projectile {
  id: string;
  towerId: string;
  targetId: string;
  x: number;
  y: number;
  speed: number;
  damage: number;
  radius: number;
  color: string;
  splashRadius: number;
  active: boolean;

  constructor(tower: Tower, target: Enemy) {
    this.id = `projectile-${tower.id}-${Math.random().toString(36).slice(2, 8)}`;
    this.towerId = tower.id;
    this.targetId = target.id;
    this.x = tower.x;
    this.y = tower.y;
    this.speed = tower.projectileSpeed;
    this.damage = tower.damage;
    this.radius = tower.type === "heavy" ? 6 : tower.type === "rapid" ? 4 : 5;
    this.color = tower.color;
    this.splashRadius = tower.splashRadius;
    this.active = true;
  }

  update(dt: number, enemies: Enemy[]) {
    const target = enemies.find((enemy) => enemy.id === this.targetId);

    if (!target) {
      this.active = false;
      return null;
    }

    const targetPosition = target.getPosition();
    const dx = targetPosition.x - this.x;
    const dy = targetPosition.y - this.y;
    const travel = this.speed * dt;
    const remaining = Math.hypot(dx, dy);

    if (remaining <= travel || remaining <= target.radius + this.radius) {
      this.x = targetPosition.x;
      this.y = targetPosition.y;
      this.active = false;
      return {
        x: targetPosition.x,
        y: targetPosition.y,
        targetId: target.id,
      };
    }

    this.x += (dx / remaining) * travel;
    this.y += (dy / remaining) * travel;
    return null;
  }
}

class Tower {
  id: string;
  slotId: string;
  type: TowerType;
  x: number;
  y: number;
  level: number;
  damage: number;
  range: number;
  fireRate: number;
  projectileSpeed: number;
  cooldown: number;
  cooldownDuration: number;
  color: string;
  accent: string;
  splashRadius: number;

  constructor(slot: Slot, type: TowerType) {
    const blueprint = TOWER_BLUEPRINTS[type];

    this.id = `tower-${type}-${Math.random().toString(36).slice(2, 8)}`;
    this.slotId = slot.id;
    this.type = type;
    this.x = slot.x;
    this.y = slot.y;
    this.level = 1;
    this.damage = blueprint.damage;
    this.range = blueprint.range;
    this.fireRate = blueprint.fireRate;
    this.projectileSpeed = blueprint.projectileSpeed;
    this.cooldown = 0;
    this.cooldownDuration = 1 / blueprint.fireRate;
    this.color = blueprint.color;
    this.accent = blueprint.accent;
    this.splashRadius = blueprint.splashRadius;
  }

  getCost() {
    return TOWER_BLUEPRINTS[this.type].cost;
  }

  getUpgradeCost() {
    return Math.round(this.getCost() * (0.8 + this.level * 0.55));
  }

  getCooldownRatio() {
    return clamp(1 - this.cooldown / Math.max(0.01, this.cooldownDuration), 0, 1);
  }

  chooseTarget(enemies: Enemy[]) {
    let bestTarget: Enemy | null = null;
    let bestProgress = -1;

    for (const enemy of enemies) {
      const point = enemy.getPosition();
      const enemyDistance = distance(this, point);

      if (enemyDistance > this.range) {
        continue;
      }

      if (enemy.progress > bestProgress) {
        bestTarget = enemy;
        bestProgress = enemy.progress;
      }
    }

    return bestTarget;
  }

  update(dt: number, enemies: Enemy[]) {
    this.cooldown = Math.max(0, this.cooldown - dt);
    const target = this.chooseTarget(enemies);

    if (!target || this.cooldown > 0) {
      return null;
    }

    this.cooldown = this.cooldownDuration;
    return new Projectile(this, target);
  }

  upgrade() {
    this.level += 1;
    this.damage = Math.round(this.damage * 1.28);
    this.range += 10;
    this.fireRate *= 1.11;
    this.cooldownDuration = 1 / this.fireRate;
  }
}

class ExplosionEffect {
  id: string;
  x: number;
  y: number;
  color: string;
  life: number;
  maxLife: number;
  maxRadius: number;

  constructor(x: number, y: number, color: string, maxRadius: number) {
    this.id = `fx-${Math.random().toString(36).slice(2, 8)}`;
    this.x = x;
    this.y = y;
    this.color = color;
    this.life = 0;
    this.maxLife = 0.34;
    this.maxRadius = maxRadius;
  }

  update(dt: number) {
    this.life += dt;
  }

  get finished() {
    return this.life >= this.maxLife;
  }

  snapshot(): ExplosionSnapshot {
    const progress = clamp(this.life / this.maxLife, 0, 1);
    return {
      id: this.id,
      x: this.x,
      y: this.y,
      radius: lerp(8, this.maxRadius, progress),
      alpha: 1 - progress,
      color: this.color,
    };
  }
}

class Game {
  phase: GamePhase = "start";
  health = 24;
  maxHealth = 24;
  currency = 220;
  score = 0;
  waveIndex = -1;
  highestPiDigitIndex = 0;
  enemies: Enemy[] = [];
  towers: Tower[] = [];
  projectiles: Projectile[] = [];
  explosions: ExplosionEffect[] = [];
  queuedWave: WavePlan | null = null;
  queuedSpawnIndex = 0;
  spawnCooldown = 0;
  nextWaveTimer = 0;
  activeWaveLabel = "Awaiting launch";
  soundQueue: SoundCue[] = [];

  restart() {
    this.phase = "start";
    this.health = this.maxHealth;
    this.currency = 220;
    this.score = 0;
    this.waveIndex = -1;
    this.highestPiDigitIndex = 0;
    this.enemies = [];
    this.towers = [];
    this.projectiles = [];
    this.explosions = [];
    this.queuedWave = null;
    this.queuedSpawnIndex = 0;
    this.spawnCooldown = 0;
    this.nextWaveTimer = 0;
    this.activeWaveLabel = "Awaiting launch";
    this.soundQueue = [];
  }

  start() {
    if (this.phase === "game-over") {
      this.restart();
    }

    if (this.phase === "start") {
      this.phase = "playing";
      this.advanceWave();
      return;
    }

    if (this.phase === "paused") {
      this.phase = "playing";
    }
  }

  togglePause() {
    if (this.phase === "playing") {
      this.phase = "paused";
      return;
    }

    if (this.phase === "paused") {
      this.phase = "playing";
    }
  }

  getCurrentDigitIndex() {
    if (this.waveIndex < 0) {
      return 0;
    }

    return this.waveIndex % DIGIT_SEQUENCE.length;
  }

  getCurrentDigit() {
    return DIGIT_SEQUENCE[this.getCurrentDigitIndex()];
  }

  getSlot(slotId: string) {
    return TOWER_SLOTS.find((slot) => slot.id === slotId) ?? null;
  }

  findTower(towerId: string | null) {
    if (!towerId) {
      return null;
    }

    return this.towers.find((tower) => tower.id === towerId) ?? null;
  }

  placeTower(slotId: string, type: TowerType) {
    if (this.phase === "game-over") {
      return { ok: false, reason: "Restart the game first." };
    }

    const slot = this.getSlot(slotId);
    const blueprint = TOWER_BLUEPRINTS[type];

    if (!slot) {
      return { ok: false, reason: "Invalid tower slot." };
    }

    if (this.towers.some((tower) => tower.slotId === slotId)) {
      return { ok: false, reason: "That circular node already has a tower." };
    }

    if (this.currency < blueprint.cost) {
      return { ok: false, reason: "Not enough pi credits." };
    }

    const tower = new Tower(slot, type);
    this.towers.push(tower);
    this.currency -= blueprint.cost;
    this.soundQueue.push("place");

    return { ok: true, towerId: tower.id };
  }

  upgradeTower(towerId: string | null) {
    const tower = this.findTower(towerId);

    if (!tower) {
      return { ok: false, reason: "Select a tower to upgrade." };
    }

    if (tower.level >= 4) {
      return { ok: false, reason: "Tower is already maxed." };
    }

    const upgradeCost = tower.getUpgradeCost();

    if (this.currency < upgradeCost) {
      return { ok: false, reason: "Need more pi credits for that upgrade." };
    }

    this.currency -= upgradeCost;
    tower.upgrade();
    this.soundQueue.push("upgrade");

    return { ok: true };
  }

  buildWavePlan(nextWaveIndex: number): WavePlan {
    const piDigitIndex = nextWaveIndex % DIGIT_SEQUENCE.length;
    const digit = DIGIT_SEQUENCE[piDigitIndex];
    const pattern = DIGIT_PATTERNS[digit];
    const queue = Array.from({ length: pattern.count }, (_, index) => ({
      kind: pattern.kind,
      digit,
      laneOffset: ((index % 3) - 1) * 12,
      waveNumber: nextWaveIndex + 1,
    }));

    if ((nextWaveIndex + 1) % 10 === 0) {
      queue.push({
        kind: "boss",
        digit,
        laneOffset: 0,
        waveNumber: nextWaveIndex + 1,
      });
    }

    return {
      digit,
      label: pattern.label,
      queue,
      spawnDelay: pattern.kind === "fast" ? 0.34 : pattern.kind === "strong" ? 0.54 : 0.42,
    };
  }

  advanceWave() {
    this.waveIndex += 1;
    this.highestPiDigitIndex = Math.max(this.highestPiDigitIndex, this.waveIndex + 1);
    this.queuedWave = this.buildWavePlan(this.waveIndex);
    this.queuedSpawnIndex = 0;
    this.spawnCooldown = 0.4;
    this.nextWaveTimer = 0;
    this.currency += 18 + this.getCurrentDigit() * 2;
    this.activeWaveLabel = this.queuedWave.label;

    if ((this.waveIndex + 1) % 10 === 0) {
      this.soundQueue.push("boss");
    }
  }

  spawnQueuedEnemy() {
    if (!this.queuedWave) {
      return;
    }

    const item = this.queuedWave.queue[this.queuedSpawnIndex];

    if (!item) {
      this.queuedWave = null;
      this.queuedSpawnIndex = 0;
      this.spawnCooldown = 0;
      return;
    }

    this.enemies.push(new Enemy(item.kind, item.digit, item.waveNumber, item.laneOffset));
    this.queuedSpawnIndex += 1;
    this.spawnCooldown = this.queuedWave.spawnDelay;
  }

  damageBase(amount: number) {
    this.health -= amount;
    this.soundQueue.push("damage");

    if (this.health > 0) {
      return;
    }

    this.health = 0;
    this.phase = "game-over";
    this.soundQueue.push("game-over");
  }

  addExplosion(x: number, y: number, color: string, radius: number) {
    this.explosions.push(new ExplosionEffect(x, y, color, radius));
  }

  resolveProjectileHit(projectile: Projectile, impact: { x: number; y: number; targetId: string }) {
    const primaryTarget = this.enemies.find((enemy) => enemy.id === impact.targetId);

    if (primaryTarget) {
      const impactedEnemies =
        projectile.splashRadius > 0
          ? this.enemies.filter(
              (enemy) => distance(enemy.getPosition(), impact) <= projectile.splashRadius + enemy.radius,
            )
          : [primaryTarget];

      for (const enemy of impactedEnemies) {
        const didDie = enemy.takeDamage(projectile.damage / (enemy.id === primaryTarget.id ? 1 : 1.5));

        if (!didDie) {
          continue;
        }

        this.score += enemy.reward * 10;
        this.currency += enemy.reward;
        this.addExplosion(impact.x, impact.y, enemy.color, enemy.kind === "boss" ? 56 : 34);
        this.soundQueue.push("defeat");
      }
    }

    this.enemies = this.enemies.filter((enemy) => enemy.health > 0);
    this.addExplosion(impact.x, impact.y, projectile.color, projectile.splashRadius > 0 ? 38 : 24);
  }

  update(dt: number) {
    if (this.phase !== "playing") {
      return;
    }

    if (this.queuedWave) {
      this.spawnCooldown -= dt;

      if (this.spawnCooldown <= 0) {
        this.spawnQueuedEnemy();
      }
    }

    for (const tower of this.towers) {
      const projectile = tower.update(dt, this.enemies);

      if (projectile) {
        this.projectiles.push(projectile);
      }
    }

    for (const projectile of this.projectiles) {
      const impact = projectile.update(dt, this.enemies);

      if (impact) {
        this.resolveProjectileHit(projectile, impact);
      }
    }

    this.projectiles = this.projectiles.filter((projectile) => projectile.active);

    const remainingEnemies: Enemy[] = [];

    for (const enemy of this.enemies) {
      enemy.update(dt);

      if (enemy.progress >= 1) {
        this.damageBase(enemy.damageToBase);
        this.addExplosion(CENTER, CENTER, enemy.color, enemy.kind === "boss" ? 70 : 28);
        continue;
      }

      remainingEnemies.push(enemy);
    }

    this.enemies = remainingEnemies;

    for (const explosion of this.explosions) {
      explosion.update(dt);
    }

    this.explosions = this.explosions.filter((explosion) => !explosion.finished);

    if (!this.queuedWave && this.enemies.length === 0 && this.phase === "playing") {
      this.nextWaveTimer += dt;

      if (this.nextWaveTimer >= 1.55) {
        this.advanceWave();
      }
    } else {
      this.nextWaveTimer = 0;
    }
  }

  drainSoundQueue() {
    const queue = [...this.soundQueue];
    this.soundQueue = [];
    return queue;
  }

  snapshot(): GameSnapshot {
    return {
      phase: this.phase,
      waveNumber: Math.max(0, this.waveIndex + 1),
      piDigitIndex: this.getCurrentDigitIndex(),
      currentDigit: this.waveIndex >= 0 ? this.getCurrentDigit() : DIGIT_SEQUENCE[0],
      wavesSurvived: Math.max(0, this.waveIndex),
      health: this.health,
      maxHealth: this.maxHealth,
      currency: this.currency,
      score: this.score,
      towers: this.towers.map((tower) => ({
        id: tower.id,
        slotId: tower.slotId,
        x: tower.x,
        y: tower.y,
        type: tower.type,
        level: tower.level,
        range: tower.range,
        cooldownRatio: tower.getCooldownRatio(),
      })),
      enemies: this.enemies.map((enemy) => {
        const position = enemy.getPosition();

        return {
          id: enemy.id,
          x: position.x,
          y: position.y,
          radius: enemy.radius,
          kind: enemy.kind,
          health: enemy.health,
          maxHealth: enemy.maxHealth,
          digit: enemy.digit,
        };
      }),
      projectiles: this.projectiles.map((projectile) => ({
        id: projectile.id,
        x: projectile.x,
        y: projectile.y,
        radius: projectile.radius,
        color: projectile.color,
      })),
      explosions: this.explosions.map((explosion) => explosion.snapshot()),
      nextWaveTimer: this.nextWaveTimer,
      activeWaveLabel: this.activeWaveLabel,
      highestPiDigitIndex: this.highestPiDigitIndex,
      slots: TOWER_SLOTS,
    };
  }
}

function TowerGlyph({ type }: { type: TowerType }) {
  if (type === "rapid") {
    return (
      <path
        d="M-11 4h22M-5-8l10 8-10 8"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="3"
      />
    );
  }

  if (type === "heavy") {
    return (
      <>
        <rect x="-9" y="-9" width="18" height="18" rx="4" fill="none" stroke="currentColor" strokeWidth="3" />
        <path d="M0-13v8M0 5v8" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="3" />
      </>
    );
  }

  return (
    <>
      <circle cx="0" cy="0" r="8" fill="none" stroke="currentColor" strokeWidth="3" />
      <path d="M0-13v7M0 6v7M-13 0h7M6 0h7" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="3" />
    </>
  );
}

function HudPill({
  label,
  value,
  accent,
}: {
  label: string;
  value: string | number;
  accent: string;
}) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-white/6 px-4 py-3">
      <div className="text-[11px] font-black uppercase tracking-[0.28em]" style={{ color: accent }}>
        {label}
      </div>
      <div className="mt-1 text-2xl font-black text-white">{value}</div>
    </div>
  );
}

function StatBadge({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-[18px] border border-white/8 bg-white/5 px-3 py-2">
      <div className="text-[10px] font-black uppercase tracking-[0.24em] text-[#87a7cf]">{label}</div>
      <div className="mt-1 text-sm font-bold text-white">{value}</div>
    </div>
  );
}

function StatRow({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-[18px] border border-white/8 bg-white/5 px-4 py-3">
      <span className="text-xs font-black uppercase tracking-[0.22em] text-[#87a7cf]">{label}</span>
      <span className="text-sm font-bold text-white">{value}</span>
    </div>
  );
}

function OverlayCard({
  title,
  subtitle,
  children,
  actionLabel,
  onAction,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  actionLabel: string;
  onAction: () => void;
}) {
  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-[rgba(3,8,18,0.55)]">
      <div className="pointer-events-auto mx-4 w-full max-w-xl rounded-[34px] border border-white/10 bg-[linear-gradient(180deg,rgba(15,27,53,0.97),rgba(8,12,24,0.95))] p-6 text-center shadow-[0_34px_90px_rgba(0,0,0,0.48)]">
        <div className="text-[11px] font-black uppercase tracking-[0.38em] text-[#79d9ff]">Pi Arcade</div>
        <h3 className="mt-3 text-4xl font-black tracking-[-0.04em] text-white">{title}</h3>
        <div className="mt-2 text-sm font-semibold text-[#ffd166]">{subtitle}</div>
        <p className="mt-4 text-sm leading-7 text-[#d4e3ff]">{children}</p>
        <button
          type="button"
          onClick={onAction}
          className="mt-6 rounded-full bg-[linear-gradient(135deg,#fbbf24,#f97316)] px-6 py-3 text-sm font-black text-[#111827]"
        >
          {actionLabel}
        </button>
      </div>
    </div>
  );
}

function playSound(cue: SoundCue, contextRef: React.MutableRefObject<AudioContext | null>) {
  if (typeof window === "undefined") {
    return;
  }

  const AudioCtor =
    window.AudioContext ??
    (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;

  if (!AudioCtor) {
    return;
  }

  if (!contextRef.current) {
    contextRef.current = new AudioCtor();
  }

  const context = contextRef.current;

  if (context.state === "suspended") {
    void context.resume();
  }

  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.connect(gain);
  gain.connect(context.destination);

  const now = context.currentTime;
  const configByCue: Record<
    SoundCue,
    { frequency: number; to: number; duration: number; volume: number; type: OscillatorType }
  > = {
    place: { frequency: 420, to: 620, duration: 0.08, volume: 0.05, type: "triangle" },
    upgrade: { frequency: 520, to: 880, duration: 0.14, volume: 0.06, type: "triangle" },
    defeat: { frequency: 320, to: 180, duration: 0.09, volume: 0.04, type: "sine" },
    boss: { frequency: 160, to: 240, duration: 0.22, volume: 0.08, type: "square" },
    damage: { frequency: 200, to: 110, duration: 0.16, volume: 0.07, type: "sawtooth" },
    "game-over": { frequency: 260, to: 90, duration: 0.35, volume: 0.08, type: "sawtooth" },
  };

  const config = configByCue[cue];

  oscillator.type = config.type;
  oscillator.frequency.setValueAtTime(config.frequency, now);
  oscillator.frequency.exponentialRampToValueAtTime(config.to, now + config.duration);
  gain.gain.setValueAtTime(config.volume, now);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + config.duration);
  oscillator.start(now);
  oscillator.stop(now + config.duration);
}

export function PiDefenderApp() {
  const gameRef = useRef(new Game());
  const audioContextRef = useRef<AudioContext | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const [selectedTowerType, setSelectedTowerType] = useState<TowerType>("basic");
  const [selectedTowerId, setSelectedTowerId] = useState<string | null>(null);
  const [message, setMessage] = useState("Choose a circular node, place towers, and let the pi spiral begin.");
  const [snapshot, setSnapshot] = useState<GameSnapshot>(() => gameRef.current.snapshot());

  const selectedTower = useMemo(
    () => snapshot.towers.find((tower) => tower.id === selectedTowerId) ?? null,
    [selectedTowerId, snapshot.towers],
  );

  useEffect(() => {
    const game = gameRef.current;
    let previous = performance.now();

    const frame = (now: number) => {
      const dt = Math.min(0.033, (now - previous) / 1000);
      previous = now;
      game.update(dt);

      for (const cue of game.drainSoundQueue()) {
        playSound(cue, audioContextRef);
      }

      setSnapshot(game.snapshot());
      animationFrameRef.current = window.requestAnimationFrame(frame);
    };

    animationFrameRef.current = window.requestAnimationFrame(frame);

    return () => {
      if (animationFrameRef.current) {
        window.cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "1") {
        setSelectedTowerType("basic");
        setMessage("Basic Tower armed: balanced range, damage, and cadence.");
      } else if (event.key === "2") {
        setSelectedTowerType("rapid");
        setMessage("Rapid Tower armed: quick bursts for fast-moving digits.");
      } else if (event.key === "3") {
        setSelectedTowerType("heavy");
        setMessage("Heavy Tower armed: slower splash hits for dense waves.");
      } else if (event.key.toLowerCase() === "u") {
        const result = gameRef.current.upgradeTower(selectedTowerId);
        if (result.ok) {
          setMessage("Tower upgraded. Range and firepower increased.");
          setSnapshot(gameRef.current.snapshot());
        } else if (result.reason) {
          setMessage(result.reason);
        }
      } else if (event.key === " ") {
        event.preventDefault();

        if (gameRef.current.phase === "start") {
          gameRef.current.start();
          setMessage("Wave 1 launched. Pi digits are now driving the invasion.");
        } else if (gameRef.current.phase === "game-over") {
          gameRef.current.restart();
          setSelectedTowerId(null);
          setMessage("Pi Defender reset. Ready for another circular siege.");
        } else {
          gameRef.current.togglePause();
          setMessage(gameRef.current.phase === "paused" ? "Simulation paused." : "Simulation resumed.");
        }

        setSnapshot(gameRef.current.snapshot());
      } else if (event.key === "Escape") {
        setSelectedTowerId(null);
        setMessage("Tower selection cleared.");
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selectedTowerId]);

  const onStart = () => {
    gameRef.current.start();
    setMessage(
      gameRef.current.phase === "playing"
        ? "Pi Defender online. Watch the current digit shape the next wave."
        : "Simulation resumed.",
    );
    setSnapshot(gameRef.current.snapshot());
  };

  const onRestart = () => {
    gameRef.current.restart();
    setSelectedTowerId(null);
    setMessage("Pi Defender reset. Rebuild your circular defense grid.");
    setSnapshot(gameRef.current.snapshot());
  };

  const onTogglePause = () => {
    gameRef.current.togglePause();
    setMessage(gameRef.current.phase === "paused" ? "Simulation paused." : "Simulation resumed.");
    setSnapshot(gameRef.current.snapshot());
  };

  const handleSlotClick = (slotId: string) => {
    const existingTower = snapshot.towers.find((tower) => tower.slotId === slotId);

    if (existingTower) {
      setSelectedTowerId(existingTower.id);
      setMessage(`Tower selected. Level ${existingTower.level} ${TOWER_BLUEPRINTS[existingTower.type].label}.`);
      return;
    }

    const result = gameRef.current.placeTower(slotId, selectedTowerType);

    if (result.ok) {
      setSelectedTowerId(result.towerId ?? null);
      setMessage(`${TOWER_BLUEPRINTS[selectedTowerType].label} deployed onto the circular grid.`);
      setSnapshot(gameRef.current.snapshot());
      return;
    }

    if (result.reason) {
      setMessage(result.reason);
    }
  };

  const onUpgradeSelected = () => {
    const result = gameRef.current.upgradeTower(selectedTowerId);

    if (result.ok) {
      setMessage("Selected tower upgraded.");
      setSnapshot(gameRef.current.snapshot());
      return;
    }

    if (result.reason) {
      setMessage(result.reason);
    }
  };

  const digitsWindow = useMemo(() => {
    const start = Math.max(0, snapshot.piDigitIndex - 6);
    const end = Math.min(DIGIT_SEQUENCE.length, start + 18);

    return DIGIT_SEQUENCE.slice(start, end).map((digit, offset) => ({
      digit,
      index: start + offset,
    }));
  }, [snapshot.piDigitIndex]);

  return (
    <div className="h-full overflow-auto bg-[radial-gradient(circle_at_top,#152548,#0c1226_52%,#090d18)] text-[#eef6ff]">
      <div className="mx-auto flex min-h-full w-full max-w-[1380px] flex-col gap-5 p-5">
        <section className="rounded-[34px] border border-white/10 bg-[linear-gradient(135deg,rgba(16,26,54,0.96),rgba(10,16,32,0.88))] p-5 shadow-[0_28px_80px_rgba(5,10,20,0.5)]">
          <div className="flex flex-col gap-4">
            <div>
              <div className="text-[11px] font-black uppercase tracking-[0.38em] text-[#77d6ff]">
                Arcade Defense
              </div>
              <h2 className="mt-2 text-4xl font-black tracking-[-0.04em] text-white">
                Pi Defender
              </h2>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-[#bed2f3]">
                Hold the center while enemy waves follow the digits of pi. Towers snap onto concentric rings,
                enemies spiral inward, and every digit changes the rhythm of the fight.
              </p>
            </div>

            <div className="grid gap-3 [grid-template-columns:repeat(auto-fit,minmax(130px,1fr))]">
              <HudPill label="Wave" value={snapshot.waveNumber || 1} accent="#5eead4" />
              <HudPill label="Digit" value={snapshot.currentDigit} accent="#fbbf24" />
              <HudPill label="Credits" value={snapshot.currency} accent="#93c5fd" />
              <HudPill label="Health" value={`${snapshot.health}/${snapshot.maxHealth}`} accent="#fb7185" />
            </div>
          </div>

          <div className="mt-5 rounded-[26px] border border-white/10 bg-white/5 p-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="rounded-full border border-[#5fb7ff]/50 bg-[#10294d] px-4 py-2 text-xs font-bold uppercase tracking-[0.28em] text-[#8dd9ff]">
                Pi Progress
              </div>
              <div className="text-sm text-[#bdd4ef]">
                Wave {snapshot.waveNumber || 1} is using digit #{snapshot.piDigitIndex + 1} of the current 100-digit loop.
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {digitsWindow.map((entry) => {
                const active = entry.index === snapshot.piDigitIndex;

                return (
                  <div
                    key={`${entry.index}-${entry.digit}`}
                    className={`flex h-11 w-11 items-center justify-center rounded-full border text-base font-black transition ${
                      active
                        ? "border-[#fbbf24] bg-[#f59e0b] text-[#10172d] shadow-[0_0_0_4px_rgba(245,158,11,0.18)]"
                        : "border-white/10 bg-[#0f1934] text-[#d8e5ff]"
                    }`}
                  >
                    {entry.digit}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <div className="grid gap-5 [grid-template-columns:repeat(auto-fit,minmax(300px,1fr))]">
          <section className="rounded-[34px] border border-white/10 bg-[linear-gradient(180deg,rgba(12,20,38,0.95),rgba(8,12,25,0.92))] p-4 shadow-[0_28px_80px_rgba(5,10,20,0.42)]">
            <div className="rounded-[30px] border border-white/8 bg-[radial-gradient(circle_at_top,#102447,#0b1631_55%,#08101f)] p-3">
              <svg viewBox={`0 0 ${BOARD_SIZE} ${BOARD_SIZE}`} className="w-full rounded-[26px]">
                <defs>
                  <radialGradient id="arenaGlow" cx="50%" cy="50%" r="62%">
                    <stop offset="0%" stopColor="#15386f" stopOpacity="0.48" />
                    <stop offset="100%" stopColor="#050914" stopOpacity="0" />
                  </radialGradient>
                  <filter id="softGlow">
                    <feGaussianBlur stdDeviation="5" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                <rect x="0" y="0" width={BOARD_SIZE} height={BOARD_SIZE} fill="#07111f" />
                <rect x="0" y="0" width={BOARD_SIZE} height={BOARD_SIZE} fill="url(#arenaGlow)" />

                {[110, 170, 230, 290, 330].map((radius) => (
                  <circle
                    key={radius}
                    cx={CENTER}
                    cy={CENTER}
                    r={radius}
                    fill="none"
                    stroke="rgba(109,167,255,0.18)"
                    strokeDasharray="5 10"
                    strokeWidth="1.4"
                  />
                ))}

                {Array.from({ length: 16 }, (_, index) => (
                  <line
                    key={index}
                    x1={CENTER}
                    y1={CENTER}
                    x2={polarToCartesian(330, (index / 16) * TAU).x}
                    y2={polarToCartesian(330, (index / 16) * TAU).y}
                    stroke="rgba(118,170,255,0.08)"
                    strokeWidth="1"
                  />
                ))}

                <polyline
                  points={SPIRAL_POINTS}
                  fill="none"
                  stroke="rgba(160,220,255,0.44)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  filter="url(#softGlow)"
                />

                {snapshot.slots.map((slot) => {
                  const occupied = snapshot.towers.some((tower) => tower.slotId === slot.id);

                  return (
                    <g key={slot.id} onClick={() => handleSlotClick(slot.id)} className="cursor-pointer">
                      <circle
                        cx={slot.x}
                        cy={slot.y}
                        r={occupied ? 14 : 10}
                        fill={occupied ? "rgba(255,255,255,0.08)" : "rgba(126,211,255,0.08)"}
                        stroke={occupied ? "rgba(255,255,255,0.18)" : "rgba(110,224,255,0.28)"}
                        strokeWidth="2"
                      />
                    </g>
                  );
                })}

                {selectedTower ? (
                  <circle
                    cx={selectedTower.x}
                    cy={selectedTower.y}
                    r={selectedTower.range}
                    fill="rgba(56,189,248,0.08)"
                    stroke="rgba(103,232,249,0.32)"
                    strokeDasharray="10 10"
                    strokeWidth="2"
                  />
                ) : null}

                {snapshot.projectiles.map((projectile) => (
                  <circle
                    key={projectile.id}
                    cx={projectile.x}
                    cy={projectile.y}
                    r={projectile.radius}
                    fill={projectile.color}
                    filter="url(#softGlow)"
                  />
                ))}

                {snapshot.explosions.map((explosion) => (
                  <circle
                    key={explosion.id}
                    cx={explosion.x}
                    cy={explosion.y}
                    r={explosion.radius}
                    fill="none"
                    stroke={explosion.color}
                    strokeOpacity={explosion.alpha}
                    strokeWidth="4"
                  />
                ))}

                {snapshot.enemies.map((enemy) => {
                  const healthRatio = clamp(enemy.health / Math.max(1, enemy.maxHealth), 0, 1);
                  const blueprint = ENEMY_BLUEPRINTS[enemy.kind];

                  return (
                    <g key={enemy.id}>
                      <circle
                        cx={enemy.x}
                        cy={enemy.y}
                        r={enemy.radius + 6}
                        fill="rgba(255,255,255,0.05)"
                      />
                      <circle
                        cx={enemy.x}
                        cy={enemy.y}
                        r={enemy.radius}
                        fill={blueprint.color}
                        stroke={blueprint.stroke}
                        strokeWidth="3"
                      />
                      <text
                        x={enemy.x}
                        y={enemy.y + 1}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className="fill-[#0a1225] text-[12px] font-black"
                      >
                        {enemy.digit}
                      </text>
                      <rect
                        x={enemy.x - 15}
                        y={enemy.y - enemy.radius - 13}
                        width="30"
                        height="4"
                        rx="2"
                        fill="rgba(14,19,36,0.8)"
                      />
                      <rect
                        x={enemy.x - 15}
                        y={enemy.y - enemy.radius - 13}
                        width={30 * healthRatio}
                        height="4"
                        rx="2"
                        fill="#34d399"
                      />
                    </g>
                  );
                })}

                {snapshot.towers.map((tower) => {
                  const blueprint = TOWER_BLUEPRINTS[tower.type];
                  const selected = selectedTowerId === tower.id;

                  return (
                    <g
                      key={tower.id}
                      transform={`translate(${tower.x} ${tower.y})`}
                      onClick={() => {
                        setSelectedTowerId(tower.id);
                        setMessage(`${blueprint.label} selected. Level ${tower.level}.`);
                      }}
                      className="cursor-pointer"
                    >
                      <circle
                        r={selected ? 18 : 16}
                        fill="#08162c"
                        stroke={selected ? "#ffffff" : blueprint.accent}
                        strokeWidth={selected ? 3.5 : 3}
                      />
                      <circle
                        r="8"
                        fill="none"
                        stroke="#ffffff"
                        strokeOpacity="0.22"
                        strokeWidth="10"
                        strokeDasharray={`${tower.cooldownRatio * 50} 80`}
                        transform="rotate(-90)"
                      />
                      <g style={{ color: blueprint.color }}>
                        <TowerGlyph type={tower.type} />
                      </g>
                      <text
                        x="0"
                        y="30"
                        textAnchor="middle"
                        className="fill-[#f8fbff] text-[11px] font-black"
                      >
                        L{tower.level}
                      </text>
                    </g>
                  );
                })}

                <circle
                  cx={CENTER}
                  cy={CENTER}
                  r={CORE_RADIUS + 20}
                  fill="rgba(10,20,42,0.96)"
                  stroke="#fbbf24"
                  strokeWidth="3.5"
                />
                <circle
                  cx={CENTER}
                  cy={CENTER}
                  r={CORE_RADIUS + 6}
                  fill="rgba(251,191,36,0.08)"
                  stroke="rgba(251,191,36,0.45)"
                  strokeWidth="2"
                />
                <text
                  x={CENTER}
                  y={CENTER - 8}
                  textAnchor="middle"
                  className="fill-[#ffd166] text-[22px] font-black"
                >
                  pi
                </text>
                <text
                  x={CENTER}
                  y={CENTER + 16}
                  textAnchor="middle"
                  className="fill-[#d6e7ff] text-[11px] font-bold uppercase tracking-[0.22em]"
                >
                  Core
                </text>
              </svg>
            </div>

            <div className="mt-4 flex flex-col gap-3 rounded-[24px] border border-white/8 bg-white/5 p-4">
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={onStart}
                  className="rounded-full bg-[linear-gradient(135deg,#fbbf24,#f97316)] px-5 py-2.5 text-sm font-black text-[#111827] shadow-[0_18px_36px_rgba(249,115,22,0.28)]"
                >
                  {snapshot.phase === "start"
                    ? "Launch Defense"
                    : snapshot.phase === "paused"
                      ? "Resume"
                      : snapshot.phase === "game-over"
                        ? "Restart"
                        : "Running"}
                </button>
                <button
                  type="button"
                  onClick={onTogglePause}
                  disabled={snapshot.phase === "start" || snapshot.phase === "game-over"}
                  className="rounded-full border border-white/15 bg-white/6 px-5 py-2.5 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-45"
                >
                  {snapshot.phase === "paused" ? "Resume" : "Pause"}
                </button>
                <button
                  type="button"
                  onClick={onRestart}
                  className="rounded-full border border-white/15 bg-white/6 px-5 py-2.5 text-sm font-bold text-white"
                >
                  Reset Grid
                </button>
              </div>

              <div className="rounded-[20px] border border-[#67e8f9]/20 bg-[#071323] px-4 py-3 text-sm leading-6 text-[#d9ebff]">
                {message}
              </div>
            </div>
          </section>

          <aside className="flex flex-col gap-5">
            <section className="rounded-[34px] border border-white/10 bg-[linear-gradient(180deg,rgba(15,26,51,0.96),rgba(8,13,25,0.94))] p-5 shadow-[0_28px_80px_rgba(5,10,20,0.35)]">
              <div className="text-[11px] font-black uppercase tracking-[0.34em] text-[#79d9ff]">
                Tower Bay
              </div>
              <div className="mt-4 grid gap-3">
                {(["basic", "rapid", "heavy"] as TowerType[]).map((type, index) => {
                  const blueprint = TOWER_BLUEPRINTS[type];
                  const active = selectedTowerType === type;

                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => {
                        setSelectedTowerType(type);
                        setMessage(`${blueprint.label} selected. Shortcut: ${index + 1}.`);
                      }}
                      className={`rounded-[24px] border p-4 text-left transition ${
                        active
                          ? "border-[#67e8f9] bg-[linear-gradient(135deg,rgba(12,58,87,0.88),rgba(11,35,60,0.82))] shadow-[0_20px_40px_rgba(14,165,233,0.14)]"
                          : "border-white/10 bg-white/5 hover:border-[#63b8ff]/45"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="flex h-14 w-14 items-center justify-center rounded-full border"
                          style={{ borderColor: blueprint.accent, color: blueprint.color }}
                        >
                          <svg viewBox="-20 -20 40 40" className="h-8 w-8">
                            <TowerGlyph type={type} />
                          </svg>
                        </div>
                        <div>
                          <div className="text-sm font-black text-white">{blueprint.label}</div>
                          <div className="text-xs uppercase tracking-[0.2em] text-[#8eaacf]">
                            Key {index + 1}
                          </div>
                        </div>
                      </div>

                      <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-[#d4e3ff]">
                        <StatBadge label="Cost" value={blueprint.cost} />
                        <StatBadge label="Range" value={blueprint.range} />
                        <StatBadge label="Damage" value={blueprint.damage} />
                        <StatBadge label="Rate" value={`${blueprint.fireRate.toFixed(1)}/s`} />
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>

            <section className="rounded-[34px] border border-white/10 bg-[linear-gradient(180deg,rgba(15,26,51,0.96),rgba(8,13,25,0.94))] p-5 shadow-[0_28px_80px_rgba(5,10,20,0.35)]">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-[11px] font-black uppercase tracking-[0.34em] text-[#79d9ff]">
                    Selected Tower
                  </div>
                  <div className="mt-2 text-xl font-black text-white">
                    {selectedTower ? TOWER_BLUEPRINTS[selectedTower.type].label : "None"}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onUpgradeSelected}
                  disabled={!selectedTower}
                  className="rounded-full bg-[linear-gradient(135deg,#67e8f9,#38bdf8)] px-4 py-2 text-sm font-black text-[#08203d] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Upgrade
                </button>
              </div>

              {selectedTower ? (
                <div className="mt-4 grid gap-2 text-sm text-[#d4e3ff]">
                  <StatRow label="Level" value={selectedTower.level} />
                  <StatRow label="Range" value={selectedTower.range} />
                  <StatRow
                    label="Upgrade Cost"
                    value={gameRef.current.findTower(selectedTower.id)?.getUpgradeCost() ?? "--"}
                  />
                </div>
              ) : (
                <div className="mt-4 rounded-[20px] border border-dashed border-white/15 bg-white/4 px-4 py-3 text-sm text-[#aac2e5]">
                  Click any occupied ring node to inspect and upgrade that tower.
                </div>
              )}
            </section>

            <section className="rounded-[34px] border border-white/10 bg-[linear-gradient(180deg,rgba(15,26,51,0.96),rgba(8,13,25,0.94))] p-5 shadow-[0_28px_80px_rgba(5,10,20,0.35)]">
              <div className="text-[11px] font-black uppercase tracking-[0.34em] text-[#79d9ff]">
                Wave Logic
              </div>
              <div className="mt-4 grid gap-3">
                <StatRow label="Current Pattern" value={snapshot.activeWaveLabel} />
                <StatRow label="Score" value={snapshot.score} />
                <StatRow
                  label="Next Wave In"
                  value={
                    snapshot.enemies.length === 0 && snapshot.phase === "playing"
                      ? `${formatSeconds(1.55 - snapshot.nextWaveTimer)}s`
                      : "Active"
                  }
                />
                <StatRow label="Highest Pi Digit" value={describeHighestDigit(snapshot.highestPiDigitIndex)} />
              </div>

              <div className="mt-4 rounded-[22px] border border-white/10 bg-white/5 p-4 text-xs leading-6 text-[#bfd2f2]">
                Digits of pi shape each wave: 3 sends a tri swarm, 1 sends a single fast enemy, 4 sends four
                strong units, and every 10th digit adds a boss into the spiral.
              </div>
            </section>

            <section className="rounded-[34px] border border-white/10 bg-[linear-gradient(180deg,rgba(15,26,51,0.96),rgba(8,13,25,0.94))] p-5 shadow-[0_28px_80px_rgba(5,10,20,0.35)]">
              <div className="text-[11px] font-black uppercase tracking-[0.34em] text-[#79d9ff]">
                Controls
              </div>
              <div className="mt-4 grid gap-2 text-sm text-[#d4e3ff]">
                <StatRow label="Mouse" value="Place or select towers" />
                <StatRow label="1 / 2 / 3" value="Choose tower type" />
                <StatRow label="U" value="Upgrade selected tower" />
                <StatRow label="Space" value="Start, pause, or resume" />
                <StatRow label="Esc" value="Clear tower selection" />
              </div>
            </section>
          </aside>
        </div>
      </div>

      {snapshot.phase === "start" ? (
        <OverlayCard
          title="Pi Defender"
          subtitle="A circular tower defense arcade built around the digits of pi."
          actionLabel="Start Defense"
          onAction={onStart}
        >
          Enemies spiral from the edge toward the pi core. Build towers on the concentric rings, survive the
          first 100 digits, and keep the center intact.
        </OverlayCard>
      ) : null}

      {snapshot.phase === "game-over" ? (
        <OverlayCard
          title="Game Over"
          subtitle={`Waves survived: ${snapshot.wavesSurvived}`}
          actionLabel="Restart Run"
          onAction={onRestart}
        >
          Highest pi digit reached: {describeHighestDigit(snapshot.highestPiDigitIndex)}.
        </OverlayCard>
      ) : null}
    </div>
  );
}
