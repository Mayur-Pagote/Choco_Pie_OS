(() => {
"use strict";
let W = 1280, H = 720;
const FPS = 60, STEP = 1 / FPS;
const SEG_LEN = 180, RUMBLE = 3, ROAD_W = 1900, LANES = 3, DRAW_DIST = 220, FOV = 100, CAM_H = 1020;
const CAM_DEPTH = 1 / Math.tan((FOV / 2) * Math.PI / 180), PLAYER_Z = CAM_H * CAM_DEPTH + 220;
const MAX_SPEED = SEG_LEN / STEP * 0.72, ACCEL = MAX_SPEED / 7, BRAKE = -MAX_SPEED * 1.25, COAST = -MAX_SPEED / 4.5;
const OFFROAD_DECEL = -MAX_SPEED * 1.1, OFFROAD_LIMIT = MAX_SPEED * 0.38, CENTRIFUGAL = 0.22, TURN_RESPONSE = 2.7;
const MAX_INTEGRITY = 100, SPEED_SCALE = 0.05, DIST_SCALE = 0.00004;
const NEON = ["#00fff2", "#ff00ff", "#8b00ff", "#ff1493", "#ffd700", "#39ff14", "#ff6600", "#00aaff"];
const ROAD_COLORS = {
    light: { ground: "#050512", shoulder: "#16353d", road: "#141b28", lane: "rgba(140,248,255,0.85)", edge: "#00fff2" },
    dark: { ground: "#03030d", shoulder: "#3a0f3f", road: "#101521", lane: "rgba(255,120,230,0.55)", edge: "#ff3fdd" }
};
let canvas, ctx, segments = [], trackLen = 0, finishDistance = 0, finishSegmentIndex = 0;
let traffic = [], stars = [], skyline = [];
let pos = 0, speed = 0, playerX = 0, playerLean = 0, score = 0, distanceTravelled = 0, topSpeed = 0, integrity = MAX_INTEGRITY;
let crashTimer = 0, recoveryTimer = 0, time = 0, gameState = "TITLE", keys = {};
const ui = {};
const rand = (lo, hi) => lo + Math.random() * (hi - lo);
const randI = (lo, hi) => Math.floor(rand(lo, hi));
const pick = values => values[randI(0, values.length)];
const interp = (a, b, t) => a + (b - a) * t;
const easeIn = (a, b, t) => a + (b - a) * t * t;
const easeIO = (a, b, t) => a + (b - a) * (-Math.cos(t * Math.PI) / 2 + 0.5);
const pctRem = (n, total) => (n % total) / total;
const clamp = (value, lo, hi) => Math.max(lo, Math.min(hi, value));
function roundRectPath(x, y, w, h, r) {
    const radius = Math.min(r, w * 0.5, h * 0.5);
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + w - radius, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
    ctx.lineTo(x + w, y + h - radius);
    ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
    ctx.lineTo(x + radius, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
}
function poly(x1, y1, x2, y2, x3, y3, x4, y4, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x3, y3);
    ctx.lineTo(x4, y4);
    ctx.closePath();
    ctx.fill();
}
function project(point, cameraX, cameraY, cameraZ) {
    point.camera = { x: point.world.x - cameraX, y: point.world.y - cameraY, z: point.world.z - cameraZ };
    if (point.camera.z <= 0) {
        point.screen = { scale: 0, x: 0, y: 0, w: 0 };
        return;
    }
    const scale = CAM_DEPTH / point.camera.z;
    point.screen = { scale, x: Math.round(W / 2 + scale * point.camera.x * W / 2), y: Math.round(H / 2 - scale * point.camera.y * H / 2), w: Math.round(scale * ROAD_W * W / 2) };
}
function mixScreen(a, b, t) { return { scale: interp(a.scale, b.scale, t), x: interp(a.x, b.x, t), y: interp(a.y, b.y, t), w: interp(a.w, b.w, t) }; }
function wrappedDistance(target, source) {
    let delta = target - source;
    while (delta > trackLen / 2) delta -= trackLen;
    while (delta < -trackLen / 2) delta += trackLen;
    return delta;
}
function laneOffset(index) { return [-0.66, 0, 0.66][index] || 0; }
function findSeg(z) { return segments[Math.floor(z / SEG_LEN) % segments.length]; }
function cacheUi() {
    ui.hud = document.getElementById("hud");
    ui.titleScreen = document.getElementById("title-screen");
    ui.resultScreen = document.getElementById("result-screen");
    ui.resultTitle = document.getElementById("result-title");
    ui.resultMessage = document.getElementById("result-message");
    ui.scoreValue = document.getElementById("score-value");
    ui.distanceValue = document.getElementById("distance-value");
    ui.progressValue = document.getElementById("progress-value");
    ui.integrityValue = document.getElementById("integrity-value");
    ui.objectiveValue = document.getElementById("objective-value");
    ui.speedValue = document.getElementById("speed-value");
    ui.finalScore = document.getElementById("final-score");
    ui.finalDistance = document.getElementById("final-distance");
    ui.finalSpeed = document.getElementById("final-speed");
    ui.finalCondition = document.getElementById("final-condition");
}
function lastY() { return segments.length ? segments[segments.length - 1].p2.world.y : 0; }
function addSeg(curve, y) {
    const index = segments.length;
    segments.push({
        index,
        p1: { world: { x: 0, y: lastY(), z: index * SEG_LEN }, camera: {}, screen: {} },
        p2: { world: { x: 0, y, z: (index + 1) * SEG_LEN }, camera: {}, screen: {} },
        curve, clip: H, visible: false, cars: [], bldgL: null, bldgR: null,
        finishZone: false, finishLine: false, finishBanner: false, color: Math.floor(index / RUMBLE) % 2 === 0 ? "light" : "dark"
    });
}
function addRoad(enter, hold, leave, curve, hill) {
    const startY = lastY(), endY = startY + hill * SEG_LEN * 4, total = enter + hold + leave;
    for (let n = 0; n < enter; n++) addSeg(easeIn(0, curve, n / Math.max(1, enter)), easeIO(startY, endY, n / total));
    for (let n = 0; n < hold; n++) addSeg(curve, easeIO(startY, endY, (enter + n) / total));
    for (let n = 0; n < leave; n++) addSeg(easeIO(curve, 0, n / Math.max(1, leave)), easeIO(startY, endY, (enter + hold + n) / total));
}
function genBuilding() {
    return { h: rand(240, 780), w: rand(170, 420), off: rand(120, 380), rows: randI(6, 22), cols: randI(3, 7), neon: pick(NEON), sign: Math.random() > 0.45, signCol: pick(NEON), dark: `hsl(${randI(220, 300)}, 28%, ${randI(5, 12)}%)` };
}
function assignBuildings() {
    let currentL = genBuilding(), currentR = genBuilding(), countdown = 0;
    for (let i = 0; i < segments.length; i++) {
        if (countdown <= 0) {
            currentL = Math.random() > 0.15 ? genBuilding() : null;
            currentR = Math.random() > 0.15 ? genBuilding() : null;
            countdown = randI(3, 8);
        }
        segments[i].bldgL = currentL ? { ...currentL } : null;
        segments[i].bldgR = currentR ? { ...currentR } : null;
        countdown--;
    }
}
function buildRoad() {
    segments = [];
    addRoad(25, 40, 25, 0, 0);
    addRoad(18, 35, 18, 0.8, 0.15);
    addRoad(15, 20, 15, 1.25, 0.4);
    addRoad(20, 30, 20, 0, -0.55);
    addRoad(18, 30, 18, -1.4, 0.1);
    addRoad(15, 25, 15, 0.65, 0.7);
    addRoad(20, 45, 20, 0, -0.6);
    addRoad(18, 32, 18, 1.8, 0);
    addRoad(18, 25, 18, -1.1, 0.55);
    addRoad(15, 20, 15, 0, 0.8);
    addRoad(18, 30, 18, -1.9, -0.2);
    addRoad(20, 40, 20, 0.95, -0.45);
    addRoad(20, 55, 20, 0, 0.2);
    addRoad(20, 35, 20, -0.75, 0.5);
    addRoad(25, 70, 25, 0, 0);
    trackLen = segments.length * SEG_LEN;
    finishDistance = trackLen - SEG_LEN * 16;
    finishSegmentIndex = Math.floor(finishDistance / SEG_LEN) % segments.length;
    for (let i = -2; i <= 4; i++) segments[(finishSegmentIndex + i + segments.length) % segments.length].finishZone = true;
    segments[finishSegmentIndex].finishLine = true;
    segments[(finishSegmentIndex + 2) % segments.length].finishBanner = true;
    assignBuildings();
}
function genStars() {
    stars = [];
    for (let i = 0; i < 180; i++) stars.push({ x: rand(0, W), y: rand(0, H * 0.46), r: rand(0.5, 2), twinkle: rand(0.6, 1.8), alpha: rand(0.2, 1) });
}
function genSkyline() {
    skyline = [];
    let cursor = -70;
    while (cursor < W + 120) {
        const width = rand(34, 74), height = rand(50, 220), cols = Math.max(2, Math.floor(width / 12)), rows = Math.max(4, Math.floor(height / 10));
        const windows = [];
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                if (((row * 7 + col * 13 + skyline.length * 5) % 11) > 4) windows.push({ x: 4 + col * (width - 8) / cols, y: 4 + row * (height - 8) / rows, w: Math.max(2, width / (cols * 2.4)), h: Math.max(2, height / (rows * 2.8)) });
            }
        }
        skyline.push({ x: cursor, w: width, h: height, hue: randI(220, 320), depth: rand(0.35, 1), accent: pick(NEON), windows });
        cursor += width - rand(8, 20);
    }
}
function clearEntities() {
    for (const seg of segments) {
        seg.cars = [];
    }
    traffic = [];
}
function spawnTraffic() {
    const count = 16, minZ = SEG_LEN * 20, maxZ = finishDistance - SEG_LEN * 16, spacing = (maxZ - minZ) / count;
    for (let i = 0; i < count; i++) {
        const type = Math.random() < 0.52 ? "bike" : "car", lane = randI(0, LANES);
        const vehicle = {
            z: clamp(minZ + i * spacing + rand(-SEG_LEN * 2, SEG_LEN * 2), minZ, maxZ),
            lane,
            x: laneOffset(lane) + rand(-0.04, 0.04),
            targetX: laneOffset(lane),
            laneTimer: rand(type === "bike" ? 1.1 : 1.5, type === "bike" ? 2.8 : 3.6),
            speed: MAX_SPEED * (type === "bike" ? rand(0.38, 0.62) : rand(0.3, 0.5)),
            type,
            accent: pick(NEON),
            body: `hsl(${randI(185, 330)}, 30%, ${randI(18, 34)}%)`,
            rider: `hsl(${randI(0, 360)}, 18%, ${randI(22, 60)}%)`,
            width: type === "bike" ? 0.12 : 0.24,
            damage: type === "bike" ? 12 : 18
        };
        traffic.push(vehicle);
        findSeg(vehicle.z).cars.push(vehicle);
    }
}
function resetRace() {
    pos = 0;
    speed = 0;
    playerX = 0;
    playerLean = 0;
    score = 0;
    distanceTravelled = 0;
    topSpeed = 0;
    integrity = MAX_INTEGRITY;
    crashTimer = 0;
    recoveryTimer = 0;
    clearEntities();
    spawnTraffic();
    updateHud();
}
function startGame() {
    resetRace();
    gameState = "PLAYING";
    ui.titleScreen.classList.add("hidden");
    ui.resultScreen.classList.add("hidden");
    ui.hud.classList.remove("hidden");
    ui.objectiveValue.textContent = "Reach the finish line";
}
function showResult(title, message) {
    ui.hud.classList.add("hidden");
    ui.resultTitle.textContent = title;
    ui.resultMessage.textContent = message;
    ui.finalScore.textContent = Math.floor(score);
    ui.finalDistance.textContent = `${(distanceTravelled * DIST_SCALE).toFixed(2)} km`;
    ui.finalSpeed.textContent = `${Math.floor(topSpeed * SPEED_SCALE)} km/h`;
    ui.finalCondition.textContent = `${Math.max(0, Math.round(integrity))}%`;
    ui.resultScreen.classList.remove("hidden");
}
function finishRace() {
    if (gameState !== "PLAYING") return;
    score += 1500 + Math.round(integrity * 8);
    gameState = "WIN";
    showResult("FINISHED", "You cleared the district gate and held the lead through the final stretch.");
}
function wreckRace(message) {
    if (gameState !== "PLAYING") return;
    gameState = "GAMEOVER";
    showResult("WRECKED", message || "The bike gave out before the finish line.");
}
function handleKeyDown(event) {
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Space"].includes(event.code)) event.preventDefault();
    keys[event.code] = true;
    if ((event.code === "Enter" || event.code === "Space") && gameState !== "PLAYING") startGame();
}
function handleKeyUp(event) {
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Space"].includes(event.code)) event.preventDefault();
    keys[event.code] = false;
}
function updateHud() {
    const remaining = Math.max(0, finishDistance - distanceTravelled), progress = clamp(distanceTravelled / finishDistance, 0, 1);
    ui.scoreValue.textContent = Math.floor(score);
    ui.distanceValue.textContent = `${(remaining * DIST_SCALE).toFixed(2)} km`;
    ui.progressValue.textContent = `${Math.floor(progress * 100)}%`;
    ui.integrityValue.textContent = `${Math.max(0, Math.round(integrity))}%`;
    ui.speedValue.textContent = Math.floor(speed * SPEED_SCALE);
    ui.objectiveValue.textContent = integrity < 35 ? "Bike is failing - avoid another hit" : progress > 0.82 ? "Final stretch - hold your line" : "Reach the finish line";
}
function updateTraffic(dt) {
    for (const vehicle of traffic) {
        const oldSeg = findSeg(vehicle.z);
        vehicle.laneTimer -= dt;
        if (vehicle.laneTimer <= 0) {
            const laneStep = pick([-1, 0, 1]);
            vehicle.lane = clamp(vehicle.lane + laneStep, 0, LANES - 1);
            vehicle.targetX = laneOffset(vehicle.lane) + rand(-0.05, 0.05);
            vehicle.laneTimer = rand(vehicle.type === "bike" ? 1.2 : 1.8, vehicle.type === "bike" ? 3 : 4.2);
        }
        vehicle.x = interp(vehicle.x, vehicle.targetX, dt * (vehicle.type === "bike" ? 2.4 : 1.8));
        vehicle.z += vehicle.speed * dt;
        if (vehicle.z >= trackLen) vehicle.z -= trackLen;
        const newSeg = findSeg(vehicle.z);
        if (newSeg !== oldSeg) {
            const index = oldSeg.cars.indexOf(vehicle);
            if (index >= 0) oldSeg.cars.splice(index, 1);
            newSeg.cars.push(vehicle);
        }
    }
}
function applyImpact(damage, speedFactor, push) {
    crashTimer = 0.35;
    recoveryTimer = 0.9;
    integrity = clamp(integrity - damage, 0, MAX_INTEGRITY);
    speed *= speedFactor;
    playerX = clamp(playerX + push, -1.55, 1.55);
    score = Math.max(0, score - damage * 10);
}
function checkCollisions() {
    if (recoveryTimer > 0) return;
    const playerZ = pos + PLAYER_Z, startIndex = Math.floor(playerZ / SEG_LEN);
    for (let offset = 0; offset < 3; offset++) {
        const seg = segments[(startIndex + offset) % segments.length];
        for (const vehicle of seg.cars) {
            const dz = wrappedDistance(vehicle.z, playerZ);
            if (dz > -SEG_LEN * 0.3 && dz < SEG_LEN * 0.8 && Math.abs(playerX - vehicle.x) < vehicle.width + 0.08) {
                applyImpact(vehicle.damage, vehicle.type === "bike" ? 0.52 : 0.36, playerX <= vehicle.x ? -0.18 : 0.18);
                return;
            }
        }
    }
}
function update(dt) {
    if (gameState !== "PLAYING") return;
    if (crashTimer > 0) crashTimer = Math.max(0, crashTimer - dt);
    if (recoveryTimer > 0) recoveryTimer = Math.max(0, recoveryTimer - dt);
    const seg = findSeg(pos + PLAYER_Z), speedPct = clamp(speed / MAX_SPEED, 0, 1);
    if (keys.ArrowUp || keys.KeyW) speed += ACCEL * dt;
    else if (keys.ArrowDown || keys.KeyS) speed += BRAKE * dt;
    else speed += COAST * dt;
    const steerInput = (keys.ArrowLeft || keys.KeyA ? -1 : 0) + (keys.ArrowRight || keys.KeyD ? 1 : 0);
    playerX += steerInput * TURN_RESPONSE * (0.35 + speedPct * 0.9) * dt;
    playerLean = interp(playerLean, steerInput * (0.18 + speedPct * 0.55), dt * 10);
    playerX -= seg.curve * speedPct * CENTRIFUGAL * dt;
    if (Math.abs(playerX) > 1.1) {
        speed += OFFROAD_DECEL * dt;
        if (speed > OFFROAD_LIMIT) speed = OFFROAD_LIMIT;
        score = Math.max(0, score - 8 * dt);
    }
    playerX = clamp(playerX, -1.6, 1.6);
    speed = clamp(speed, 0, MAX_SPEED);
    if (crashTimer > 0) speed = Math.max(0, speed - MAX_SPEED * 0.5 * dt);
    pos += speed * dt;
    if (pos >= trackLen) pos -= trackLen;
    distanceTravelled += speed * dt;
    score += speed * dt * 0.012;
    topSpeed = Math.max(topSpeed, speed);
    updateTraffic(dt);
    checkCollisions();
    updateHud();
    if (integrity <= 0) wreckRace("The bike could not take any more impact.");
    else if (distanceTravelled >= finishDistance) finishRace();
}
function drawSky() {
    const gradient = ctx.createLinearGradient(0, 0, 0, H * 0.58);
    gradient.addColorStop(0, "#020010");
    gradient.addColorStop(0.45, "#0c0130");
    gradient.addColorStop(0.78, "#17003a");
    gradient.addColorStop(1, "#240054");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, W, H * 0.6);
    const moonGlow = ctx.createRadialGradient(W * 0.74, H * 0.14, 10, W * 0.74, H * 0.14, 150);
    moonGlow.addColorStop(0, "rgba(255,95,210,0.32)");
    moonGlow.addColorStop(0.35, "rgba(255,0,255,0.14)");
    moonGlow.addColorStop(1, "transparent");
    ctx.fillStyle = moonGlow;
    ctx.fillRect(W * 0.55, 0, W * 0.4, H * 0.4);
    ctx.fillStyle = "#ff8ff8";
    ctx.beginPath();
    ctx.arc(W * 0.74, H * 0.14, 28, 0, Math.PI * 2);
    ctx.fill();
}
function drawStars() {
    for (const star of stars) {
        const alpha = (0.55 + Math.sin(time * star.twinkle + star.x * 0.01) * 0.45) * star.alpha;
        ctx.fillStyle = `rgba(255,255,255,${alpha})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
        ctx.fill();
    }
}
function drawCitySkyline() {
    const baseY = H * 0.4, parallax = (-playerX * 50) - findSeg(pos + PLAYER_Z).curve * 100;
    for (const building of skyline) {
        const x = ((building.x + parallax * building.depth) % (W + 160) + (W + 160)) % (W + 160) - 80, y = baseY - building.h;
        ctx.fillStyle = `hsl(${building.hue}, 30%, ${6 + building.depth * 3}%)`;
        ctx.fillRect(x, y, building.w, building.h + 24);
        ctx.strokeStyle = `${building.accent}33`;
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, building.w, building.h + 24);
        ctx.fillStyle = `${building.accent}44`;
        for (const window of building.windows) ctx.fillRect(x + window.x, y + window.y, window.w, window.h);
    }
    const glow = ctx.createLinearGradient(0, baseY - 40, 0, baseY + 70);
    glow.addColorStop(0, "rgba(255,0,255,0.1)");
    glow.addColorStop(1, "transparent");
    ctx.fillStyle = glow;
    ctx.fillRect(0, baseY - 40, W, 120);
}
function drawLaneMarkers(seg, p1, p2, palette) {
    if (Math.floor(seg.index / 2) % 2 !== 0) return;
    for (let lane = 1; lane < LANES; lane++) {
        const laneX1 = p1.x - p1.w + (2 * p1.w * lane / LANES), laneX2 = p2.x - p2.w + (2 * p2.w * lane / LANES);
        const laneW1 = Math.max(1, p1.w * 0.012), laneW2 = Math.max(1, p2.w * 0.012);
        poly(laneX1 - laneW1, p1.y, laneX1 + laneW1, p1.y, laneX2 + laneW2, p2.y, laneX2 - laneW2, p2.y, palette.lane);
    }
}
function drawRoadsidePosts(seg, p1) {
    if (seg.index % 2 !== 0 || p1.w < 8) return;
    const postHeight = Math.max(8, p1.w * 0.28), glowRadius = Math.max(2, p1.w * 0.025);
    for (const side of [-1, 1]) {
        const color = side === -1 ? "#00fff2" : "#ff5cf6", x = p1.x + side * p1.w * 1.14, y = p1.y;
        ctx.strokeStyle = color;
        ctx.lineWidth = Math.max(1, p1.w * 0.02);
        ctx.shadowColor = color;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x, y - postHeight);
        ctx.stroke();
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x, y - postHeight, glowRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
    }
}
function drawBuilding(seg, side) {
    const p1 = seg.p1.screen, building = side === -1 ? seg.bldgL : seg.bldgR;
    if (!building || p1.scale <= 0) return;
    const offset = (ROAD_W * 1.28 + building.off) * p1.scale * W / 2 * side, bx = p1.x + offset, bw = building.w * p1.scale * W / 2;
    const bh = building.h * p1.scale * W / 2, baseY = p1.y;
    if (baseY - bh > seg.clip) return;
    if (bx + (side === -1 ? bw : 0) < -220 || bx - (side === 1 ? bw : 0) > W + 220) return;
    const x = side === -1 ? bx - bw : bx;
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 0, W, seg.clip);
    ctx.clip();
    ctx.fillStyle = building.dark;
    ctx.fillRect(x, baseY - bh, bw, bh);
    ctx.strokeStyle = `${building.neon}55`;
    ctx.lineWidth = 1;
    ctx.shadowColor = building.neon;
    ctx.shadowBlur = 5;
    ctx.strokeRect(x, baseY - bh, bw, bh);
    ctx.shadowBlur = 0;
    if (bw > 8 && bh > 10) {
        const cols = building.cols, rows = Math.min(building.rows, Math.floor(bh / 6)), winW = bw / (cols * 2), winH = Math.max(1.5, bh / (rows * 2.6));
        const gapX = bw / (cols + 1), gapY = bh / (rows + 1);
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const lit = ((seg.index * 17 + row * 13 + col * 7 + (side === -1 ? 1 : 3)) % 11) > 3;
                ctx.fillStyle = lit ? `${building.neon}88` : "rgba(18,14,30,0.85)";
                ctx.fillRect(x + gapX * (col + 1) - winW / 2, baseY - bh + gapY * (row + 1) - winH / 2, winW, winH);
            }
        }
    }
    if (building.sign && bw > 18) {
        const signW = bw * 0.52, signH = Math.max(4, bh * 0.06), signX = x + (bw - signW) / 2, signY = baseY - bh * 0.18;
        ctx.fillStyle = building.signCol;
        ctx.shadowColor = building.signCol;
        ctx.shadowBlur = 12;
        ctx.fillRect(signX, signY, signW, signH);
        ctx.shadowBlur = 0;
    }
    ctx.restore();
}
function drawFinishDecor(seg, p1, p2) {
    if (!seg.finishZone) return;
    const stripA = mixScreen(p1, p2, 0.12), stripB = mixScreen(p1, p2, 0.56);
    if (seg.finishLine) {
        const cells = 10, leftA = stripA.x - stripA.w, leftB = stripB.x - stripB.w, cellW1 = (stripA.w * 2) / cells, cellW2 = (stripB.w * 2) / cells;
        for (let cell = 0; cell < cells; cell++) poly(leftA + cellW1 * cell, stripA.y, leftA + cellW1 * (cell + 1), stripA.y, leftB + cellW2 * (cell + 1), stripB.y, leftB + cellW2 * cell, stripB.y, cell % 2 === 0 ? "#f6f7ff" : "#0d1220");
    }
    if (seg.finishBanner && p1.w > 28) {
        const anchor = mixScreen(p1, p2, 0.2), left = anchor.x - anchor.w * 0.82, right = anchor.x + anchor.w * 0.82, topY = anchor.y - anchor.w * 0.34;
        ctx.strokeStyle = "#d7f7ff";
        ctx.lineWidth = Math.max(2, anchor.w * 0.012);
        ctx.shadowColor = "#00fff2";
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.moveTo(left, anchor.y);
        ctx.lineTo(left, topY);
        ctx.lineTo(right, topY);
        ctx.lineTo(right, anchor.y);
        ctx.stroke();
        ctx.fillStyle = "rgba(8,16,30,0.88)";
        roundRectPath(left + 8, topY - 28, Math.max(60, right - left - 16), 24, 6);
        ctx.fill();
        ctx.strokeStyle = "#ff00ff";
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.shadowBlur = 0;
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 14px Orbitron";
        ctx.textAlign = "center";
        ctx.fillText("FINISH GATE", anchor.x, topY - 10);
    }
}
function drawTrafficVehicle(vehicle, seg) {
    const t = pctRem(vehicle.z, SEG_LEN), screen = mixScreen(seg.p1.screen, seg.p2.screen, t), cx = screen.x + screen.scale * vehicle.x * ROAD_W * W / 2, scale = screen.scale * W / 2;
    if (scale <= 0) return;
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 0, W, seg.clip);
    ctx.clip();
    if (vehicle.type === "bike") {
        const bodyW = Math.max(8, 78 * scale), bodyH = Math.max(18, 215 * scale), wheelR = Math.max(3, 18 * scale);
        if (cx + bodyW < 0 || cx - bodyW > W) { ctx.restore(); return; }
        ctx.fillStyle = "rgba(0,0,0,0.28)";
        ctx.beginPath();
        ctx.ellipse(cx, screen.y + bodyH * 0.03, bodyW * 0.55, bodyH * 0.1, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "#0b0e15";
        ctx.beginPath();
        ctx.arc(cx, screen.y - wheelR, wheelR, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(cx, screen.y - bodyH * 0.62, wheelR * 0.8, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = "#96a4b5";
        ctx.lineWidth = Math.max(2, scale * 7);
        ctx.beginPath();
        ctx.moveTo(cx, screen.y - wheelR * 1.8);
        ctx.lineTo(cx, screen.y - bodyH * 0.68);
        ctx.moveTo(cx, screen.y - bodyH * 0.38);
        ctx.lineTo(cx - bodyW * 0.28, screen.y - bodyH * 0.56);
        ctx.moveTo(cx, screen.y - bodyH * 0.38);
        ctx.lineTo(cx + bodyW * 0.28, screen.y - bodyH * 0.56);
        ctx.stroke();

        ctx.fillStyle = vehicle.body;
        ctx.beginPath();
        ctx.moveTo(cx - bodyW * 0.15, screen.y - bodyH * 0.7);
        ctx.lineTo(cx + bodyW * 0.15, screen.y - bodyH * 0.7);
        ctx.lineTo(cx + bodyW * 0.24, screen.y - bodyH * 0.28);
        ctx.lineTo(cx + bodyW * 0.12, screen.y - bodyH * 0.06);
        ctx.lineTo(cx - bodyW * 0.12, screen.y - bodyH * 0.06);
        ctx.lineTo(cx - bodyW * 0.24, screen.y - bodyH * 0.28);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = "#0f1219";
        roundRectPath(cx - bodyW * 0.18, screen.y - bodyH * 0.36, bodyW * 0.36, bodyH * 0.16, bodyW * 0.08);
        ctx.fill();

        ctx.fillStyle = vehicle.rider;
        ctx.beginPath();
        ctx.ellipse(cx, screen.y - bodyH * 0.82, bodyW * 0.22, bodyH * 0.14, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "#0f1118";
        ctx.beginPath();
        ctx.moveTo(cx - bodyW * 0.18, screen.y - bodyH * 0.75);
        ctx.lineTo(cx + bodyW * 0.18, screen.y - bodyH * 0.75);
        ctx.lineTo(cx + bodyW * 0.14, screen.y - bodyH * 0.56);
        ctx.lineTo(cx - bodyW * 0.14, screen.y - bodyH * 0.56);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = vehicle.accent;
        ctx.shadowColor = vehicle.accent;
        ctx.shadowBlur = 12;
        ctx.fillRect(cx - bodyW * 0.18, screen.y - bodyH * 0.16, bodyW * 0.36, bodyH * 0.06);
        ctx.fillRect(cx - bodyW * 0.26, screen.y - bodyH * 0.62, bodyW * 0.12, bodyH * 0.03);
        ctx.fillRect(cx + bodyW * 0.14, screen.y - bodyH * 0.62, bodyW * 0.12, bodyH * 0.03);
        ctx.shadowBlur = 0;

        ctx.strokeStyle = `${vehicle.accent}88`;
        ctx.lineWidth = Math.max(1, scale * 3);
        ctx.beginPath();
        ctx.arc(cx, screen.y - wheelR, wheelR, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(cx, screen.y - bodyH * 0.62, wheelR * 0.8, 0, Math.PI * 2);
        ctx.stroke();
    } else {
        const bodyW = Math.max(12, 225 * scale), bodyH = Math.max(18, 205 * scale), wheelW = bodyW * 0.18, wheelH = bodyH * 0.16;
        if (cx + bodyW < 0 || cx - bodyW > W) { ctx.restore(); return; }
        ctx.fillStyle = "rgba(0,0,0,0.28)";
        ctx.beginPath();
        ctx.ellipse(cx, screen.y + bodyH * 0.03, bodyW * 0.5, bodyH * 0.1, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "#0a0d14";
        roundRectPath(cx - bodyW * 0.48, screen.y - bodyH * 0.46, wheelW, wheelH, 3);
        ctx.fill();
        roundRectPath(cx + bodyW * 0.3, screen.y - bodyH * 0.46, wheelW, wheelH, 3);
        ctx.fill();

        ctx.fillStyle = vehicle.body;
        ctx.beginPath();
        ctx.moveTo(cx - bodyW * 0.34, screen.y - bodyH);
        ctx.lineTo(cx + bodyW * 0.34, screen.y - bodyH);
        ctx.lineTo(cx + bodyW * 0.48, screen.y - bodyH * 0.18);
        ctx.lineTo(cx + bodyW * 0.42, screen.y);
        ctx.lineTo(cx - bodyW * 0.42, screen.y);
        ctx.lineTo(cx - bodyW * 0.48, screen.y - bodyH * 0.18);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = "rgba(201,243,255,0.36)";
        roundRectPath(cx - bodyW * 0.22, screen.y - bodyH * 0.83, bodyW * 0.44, bodyH * 0.22, Math.max(4, bodyW * 0.05));
        ctx.fill();

        ctx.fillStyle = "rgba(255,255,255,0.12)";
        roundRectPath(cx - bodyW * 0.28, screen.y - bodyH * 0.56, bodyW * 0.56, bodyH * 0.18, Math.max(4, bodyW * 0.04));
        ctx.fill();

        ctx.fillStyle = vehicle.accent;
        ctx.shadowColor = vehicle.accent;
        ctx.shadowBlur = 12;
        ctx.fillRect(cx - bodyW * 0.31, screen.y - bodyH * 0.12, bodyW * 0.12, bodyH * 0.08);
        ctx.fillRect(cx + bodyW * 0.19, screen.y - bodyH * 0.12, bodyW * 0.12, bodyH * 0.08);
        ctx.shadowBlur = 0;

        ctx.fillStyle = "#0b0f16";
        roundRectPath(cx - bodyW * 0.38, screen.y - bodyH * 0.08, bodyW * 0.76, bodyH * 0.06, bodyW * 0.03);
        ctx.fill();

        ctx.strokeStyle = `${vehicle.accent}55`;
        ctx.lineWidth = Math.max(1, scale * 4);
        ctx.beginPath();
        ctx.moveTo(cx - bodyW * 0.34, screen.y - bodyH);
        ctx.lineTo(cx + bodyW * 0.34, screen.y - bodyH);
        ctx.lineTo(cx + bodyW * 0.48, screen.y - bodyH * 0.18);
        ctx.lineTo(cx + bodyW * 0.42, screen.y);
        ctx.lineTo(cx - bodyW * 0.42, screen.y);
        ctx.lineTo(cx - bodyW * 0.48, screen.y - bodyH * 0.18);
        ctx.closePath();
        ctx.stroke();
    }
    ctx.restore();
}
function drawRoadGlow() {
    const glow = ctx.createLinearGradient(W * 0.24, H, W * 0.72, H * 0.44);
    glow.addColorStop(0, "rgba(0,255,242,0.08)");
    glow.addColorStop(0.55, "rgba(255,0,255,0.05)");
    glow.addColorStop(1, "transparent");
    ctx.fillStyle = glow;
    ctx.fillRect(W * 0.18, H * 0.34, W * 0.64, H * 0.46);
}
function drawRoad() {
    const baseSeg = findSeg(pos), basePct = pctRem(pos, SEG_LEN), playerSeg = findSeg(pos + PLAYER_Z), playerPct = pctRem(pos + PLAYER_Z, SEG_LEN);
    const playerY = interp(playerSeg.p1.world.y, playerSeg.p2.world.y, playerPct);
    let maxY = H, x = 0, dx = -(baseSeg.curve * basePct);
    for (let n = 0; n < DRAW_DIST; n++) {
        const seg = segments[(baseSeg.index + n) % segments.length], looped = seg.index < baseSeg.index, cameraZ = pos - (looped ? trackLen : 0);
        project(seg.p1, playerX * ROAD_W - x, playerY + CAM_H, cameraZ);
        project(seg.p2, playerX * ROAD_W - x - dx, playerY + CAM_H, cameraZ);
        x += dx;
        dx += seg.curve;
        seg.clip = maxY;
        if (seg.p1.camera.z <= CAM_DEPTH || seg.p2.screen.y >= seg.p1.screen.y || seg.p2.screen.y >= maxY) {
            seg.visible = false;
            continue;
        }
        seg.visible = true;
        maxY = seg.p1.screen.y;
    }
    for (let n = DRAW_DIST - 1; n > 0; n--) {
        const seg = segments[(baseSeg.index + n) % segments.length];
        if (!seg.visible) continue;
        const p1 = seg.p1.screen, p2 = seg.p2.screen, palette = ROAD_COLORS[seg.color];
        poly(0, p2.y, W, p2.y, W, p1.y, 0, p1.y, palette.ground);
        const shoulder1 = p1.w * 1.18, shoulder2 = p2.w * 1.18;
        poly(p1.x - shoulder1, p1.y, p1.x + shoulder1, p1.y, p2.x + shoulder2, p2.y, p2.x - shoulder2, p2.y, palette.shoulder);
        poly(p1.x - p1.w, p1.y, p1.x + p1.w, p1.y, p2.x + p2.w, p2.y, p2.x - p2.w, p2.y, palette.road);
        ctx.save();
        ctx.strokeStyle = palette.edge;
        ctx.lineWidth = 1.6;
        ctx.shadowColor = palette.edge;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.moveTo(p1.x - shoulder1, p1.y);
        ctx.lineTo(p2.x - shoulder2, p2.y);
        ctx.moveTo(p1.x + shoulder1, p1.y);
        ctx.lineTo(p2.x + shoulder2, p2.y);
        ctx.stroke();
        ctx.restore();
        drawLaneMarkers(seg, p1, p2, palette);
        drawBuilding(seg, -1);
        drawBuilding(seg, 1);
        drawRoadsidePosts(seg, p1);
        drawFinishDecor(seg, p1, p2);
        for (const vehicle of seg.cars) drawTrafficVehicle(vehicle, seg);
    }
    drawRoadGlow();
}
function drawSpeedLines() {
    if (gameState !== "PLAYING") return;
    const speedPct = speed / MAX_SPEED;
    if (speedPct < 0.42) return;
    const alpha = (speedPct - 0.42) * 0.45, cx = W / 2, cy = H * 0.48;
    ctx.save();
    ctx.strokeStyle = `rgba(140,248,255,${alpha})`;
    ctx.lineWidth = 1;
    for (let i = 0; i < 18; i++) {
        const angle = (i / 18) * Math.PI * 2 + time * 0.7, inner = 40 + (i % 6) * 12, outer = inner + 120 + speedPct * 220 + Math.sin(time * 4 + i) * 12;
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(angle) * inner, cy + Math.sin(angle) * inner * 0.5);
        ctx.lineTo(cx + Math.cos(angle) * outer, cy + Math.sin(angle) * outer * 0.5);
        ctx.stroke();
    }
    ctx.restore();
}
function drawDamageVignette() {
    if (gameState !== "PLAYING") return;
    const danger = 1 - integrity / MAX_INTEGRITY;
    if (danger < 0.32) return;
    const alpha = (danger - 0.32) * 0.42 + (crashTimer > 0 ? 0.15 : 0), vignette = ctx.createRadialGradient(W / 2, H * 0.7, H * 0.2, W / 2, H * 0.7, H);
    vignette.addColorStop(0, "transparent");
    vignette.addColorStop(1, `rgba(255,20,80,${alpha})`);
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, W, H);
}
function drawCrashFlash() {
    if (crashTimer <= 0) return;
    ctx.fillStyle = `rgba(255,80,120,${crashTimer * 0.35})`;
    ctx.fillRect(0, 0, W, H);
}
function drawBikeCockpit() {
    const lean = playerLean * 0.22;
    ctx.save();
    ctx.translate(W / 2, H * 0.84);
    ctx.rotate(lean);
    const glow = ctx.createRadialGradient(0, 10, 20, 0, 60, 260);
    glow.addColorStop(0, "rgba(0,255,242,0.2)");
    glow.addColorStop(0.45, "rgba(255,0,255,0.1)");
    glow.addColorStop(1, "transparent");
    ctx.fillStyle = glow;
    ctx.fillRect(-280, -140, 560, 320);
    ctx.strokeStyle = "#111a2a";
    ctx.lineWidth = 18;
    ctx.beginPath();
    ctx.moveTo(-215, 28);
    ctx.quadraticCurveTo(0, -34, 215, 28);
    ctx.stroke();
    ctx.strokeStyle = "#00fff2";
    ctx.lineWidth = 4;
    ctx.shadowColor = "#00fff2";
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.moveTo(-210, 26);
    ctx.quadraticCurveTo(0, -32, 210, 26);
    ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.strokeStyle = "#c6d9ff";
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.moveTo(-18, 24);
    ctx.lineTo(-30, 172);
    ctx.moveTo(18, 24);
    ctx.lineTo(30, 172);
    ctx.stroke();
    ctx.fillStyle = "#08111d";
    roundRectPath(-82, -22, 164, 84, 18);
    ctx.fill();
    ctx.strokeStyle = "#00fff2";
    ctx.lineWidth = 2;
    ctx.shadowColor = "#00fff2";
    ctx.shadowBlur = 12;
    ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.fillStyle = "#00fff2";
    ctx.font = "bold 28px Orbitron";
    ctx.textAlign = "center";
    ctx.fillText(`${Math.floor(speed * SPEED_SCALE)}`, 0, 16);
    ctx.font = "12px Orbitron";
    ctx.fillStyle = "#8ffeff";
    ctx.fillText("KM/H", 0, 36);
    ctx.fillStyle = "#111a28";
    ctx.beginPath();
    ctx.moveTo(-72, 56);
    ctx.lineTo(72, 56);
    ctx.lineTo(44, 170);
    ctx.lineTo(-44, 170);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "#ff00ff";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = "#00fff2";
    ctx.beginPath();
    ctx.arc(-208, 28, 12, 0, Math.PI * 2);
    ctx.arc(208, 28, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "rgba(0,0,0,0.24)";
    ctx.beginPath();
    ctx.ellipse(0, 188, 44, 18, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
}
function render() {
    ctx.clearRect(0, 0, W, H);
    drawSky();
    drawStars();
    drawCitySkyline();
    drawRoad();
    drawSpeedLines();
    drawBikeCockpit();
    drawDamageVignette();
    drawCrashFlash();
}
function resizeCanvas() {
    const dpr = Math.max(1, window.devicePixelRatio || 1);
    W = Math.max(1, window.innerWidth);
    H = Math.max(1, window.innerHeight);
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    canvas.style.width = `${W}px`;
    canvas.style.height = `${H}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    for (const seg of segments) {
        seg.clip = H;
    }
    genStars();
    genSkyline();
}
function init() {
    canvas = document.getElementById("gameCanvas");
    ctx = canvas.getContext("2d");
    cacheUi();
    buildRoad();
    resizeCanvas();
    resetRace();
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);
    document.getElementById("start-btn").addEventListener("click", startGame);
    document.getElementById("restart-btn").addEventListener("click", startGame);
    window.addEventListener("resize", resizeCanvas);
    let last = 0;
    function frame(timestamp) {
        const dt = Math.min((timestamp - last) / 1000 || 0, 0.05);
        last = timestamp;
        time += dt;
        update(dt);
        render();
        requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
}
window.addEventListener("DOMContentLoaded", init);
})();
