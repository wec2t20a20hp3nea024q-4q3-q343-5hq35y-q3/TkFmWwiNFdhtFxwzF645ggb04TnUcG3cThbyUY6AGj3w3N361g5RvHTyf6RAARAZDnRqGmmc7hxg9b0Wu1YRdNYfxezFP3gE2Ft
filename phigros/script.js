// script.js

// ------------------------------
// MOVEMENT DATA ARRAY (User editable)
// ------------------------------
const cs = 450;
const movement = [
  { time: 0, type: 'judgement_line', xpos: 0, ypos: 500, speed: 0, dir: 0 },
  { time: 0, type: 'tap', xpos: 150, ypos: 20, speed: 450, dir: 90 },
  { time: 0, type: 'tap', xpos: 450, ypos: 20, speed: 450, dir: 90 },
  { time: 0.17, type: 'tap', xpos: 300, ypos: 20, speed: 450, dir: 90 },
  { time: 0.51, type: 'tap', xpos: 600, ypos: 20, speed: 450, dir: 90 },
  { time: 0.85, type: 'tap', xpos: 450, ypos: 20, speed: 450, dir: 90 },
  { time: 1.02, type: 'tap', xpos: 300, ypos: 20, speed: 450, dir: 90 },
  { time: 1.36, type: 'tap', xpos: 150, ypos: 20, speed: 450, dir: 90 },
  { time: 1.36, type: 'tap', xpos: 300, ypos: 20, speed: 450, dir: 90 },
  { time: 1.53, type: 'tap', xpos: 450, ypos: 20, speed: 450, dir: 90 },
  { time: 1.87, type: 'tap', xpos: 600, ypos: 20, speed: 450, dir: 90 },
  { time: 2.21, type: 'tap', xpos: 150, ypos: 20, speed: 450, dir: 90 },
  { time: 2.38, type: 'tap', xpos: 300, ypos: 20, speed: 450, dir: 90 },
  { time: 2.55, type: 'tap', xpos: 600, ypos: 20, speed: 450, dir: 90 },
  { time: 2.72, type: 'tap', xpos: 600, ypos: 20, speed: 450, dir: 90 },
  { time: 2.72, type: 'tap', xpos: 450, ypos: 20, speed: 450, dir: 90 },
  { time: 2.89, type: 'tap', xpos: 300, ypos: 20, speed: 450, dir: 90 },
  { time: 3.23, type: 'tap', xpos: 450, ypos: 20, speed: 450, dir: 90 },
  { time: 3.57, type: 'tap', xpos: 450, ypos: 20, speed: 450, dir: 90 },
  { time: 3.74, type: 'tap', xpos: 600, ypos: 20, speed: 450, dir: 90 },
  { time: 4.08, type: 'tap', xpos: 150, ypos: 20, speed: 450, dir: 90 },
  { time: 4.08, type: 'tap', xpos: 450, ypos: 20, speed: 450, dir: 90 },
  { time: 4.59, type: 'tap', xpos: 300, ypos: 20, speed: 450, dir: 90 },
  { time: 4.93, type: 'tap', xpos: 300, ypos: 20, speed: 450, dir: 90 },
  { time: 5.1, type: 'tap', xpos: 450, ypos: 20, speed: 450, dir: 90 },
  { time: 5.44, type: 'tap', xpos: 150, ypos: 20, speed: 450, dir: 90 },
  { time: 5.44, type: 'tap', xpos: 600, ypos: 20, speed: 450, dir: 90 },
  { time: 5.61, type: 'tap', xpos: 300, ypos: 20, speed: 450, dir: 90 },
  { time: 5.78, type: 'tap', xpos: 450, ypos: 20, speed: 450, dir: 90 },
  { time: 5.95, type: 'tap', xpos: 600, ypos: 20, speed: 450, dir: 90 },
  { time: 6.12, type: 'tap', xpos: 600, ypos: 20, speed: 450, dir: 90 },
  { time: 6.12, type: 'tap', xpos: 450, ypos: 20, speed: 450, dir: 90 },
  { time: 6.29, type: 'tap', xpos: 450, ypos: 20, speed: 450, dir: 90 },
  { time: 6.29, type: 'tap', xpos: 300, ypos: 20, speed: 450, dir: 90 },
  { time: 6.46, type: 'tap', xpos: 300, ypos: 20, speed: 450, dir: 90 },
  { time: 6.46, type: 'tap', xpos: 150, ypos: 20, speed: 450, dir: 90 },
  { time: 6.8, type: 'tap', xpos: 150, ypos: 20, speed: 450, dir: 90 },
  { time: 6.8, type: 'tap', xpos: 450, ypos: 20, speed: 450, dir: 90 },
  { time: 6.97, type: 'tap', xpos: 300, ypos: 20, speed: 450, dir: 90 },
  { time: 7.14, type: 'tap', xpos: 450, ypos: 20, speed: 450, dir: 90 },
  { time: 7.31, type: 'tap', xpos: 150, ypos: 20, speed: 450, dir: 90 },
  { time: 7.31, type: 'tap', xpos: 600, ypos: 20, speed: 450, dir: 90 },
  { time: 7.48, type: 'tap', xpos: 150, ypos: 20, speed: 450, dir: 90 },
  { time: 7.48, type: 'tap', xpos: 600, ypos: 20, speed: 450, dir: 90 },
  { time: 7.82, type: 'tap', xpos: 450, ypos: 20, speed: 450, dir: 90 },
  { time: 7.82, type: 'tap', xpos: 600, ypos: 20, speed: 450, dir: 90 },
  { time: 8.33, type: 'tap', xpos: 300, ypos: 20, speed: 450, dir: 90 },
  { time: 8.33, type: 'tap', xpos: 600, ypos: 20, speed: 450, dir: 90 },
  { time: 8.5, type: 'tap', xpos: 450, ypos: 20, speed: 450, dir: 90 },
  { time: 8.67, type: 'tap', xpos: 300, ypos: 20, speed: 450, dir: 90 },
  { time: 8.84, type: 'tap', xpos: 150, ypos: 20, speed: 450, dir: 90 },
  { time: 8.84, type: 'tap', xpos: 450, ypos: 20, speed: 450, dir: 90 },
  { time: 9.18, type: 'tap', xpos: 150, ypos: 20, speed: 450, dir: 90 },
  { time: 9.18, type: 'tap', xpos: 450, ypos: 20, speed: 450, dir: 90 },
  { time: 9.35, type: 'tap', xpos: 300, ypos: 20, speed: 450, dir: 90 },
  { time: 9.35, type: 'tap', xpos: 600, ypos: 20, speed: 450, dir: 90 },
  { time: 9.52, type: 'tap', xpos: 150, ypos: 20, speed: 450, dir: 90 },
  { time: 9.52, type: 'tap', xpos: 600, ypos: 20, speed: 450, dir: 90 },
];

// ------------------------------
// Global state
// ------------------------------
let activeObjects = [];
let spawnIndex = 0;
let animationId = null;
let animating = false;
let animStartTime = null;
let lastTimestamp = null;
let combo = 0;

// Multi‑touch tracking – each pointer has its own state
let activeTouches = new Map();   // key: pointerId, value: { flickRemoved, ignoreClick, startPos, startTime, lastX, lastY }

// Constants (match CSS)
const STAGE_WIDTH = 900;
const STAGE_HEIGHT = 600;
const JUDGEMENT_LINE_Y = 504;
const JUDGEMENT_TOLERANCE = 55;
const HIT_X_TOLERANCE = 70;
const TAP_MAX_DURATION = 200;      // ms
const TAP_MAX_MOVE = 10;           // pixels

// DOM elements
const stage = document.getElementById('stage');
const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');
const stopBtn = document.getElementById('stopBtn');
const activeCountSpan = document.getElementById('activeCount');
const comboSpan = document.getElementById('comboCount');

// Audio & speed multiplier
const bgm = document.getElementById('bgm');
const speedMultiplierInput = document.getElementById('speedMultiplier');
const audioDelayInput = document.getElementById('audioDelay');
let speedMultiplier = 1.0;
let audioTimeout = null;

// Helper functions
function updateActiveCount() {
  activeCountSpan.textContent = activeObjects.length;
}
function updateCombo() {
  comboSpan.textContent = combo;
}
function createObjectElement(type) {
  const div = document.createElement('div');
  div.className = type;
  return div;
}
function removeObject(obj, index) {
  if (obj.element && obj.element.parentNode) obj.element.remove();
  activeObjects.splice(index, 1);
  updateActiveCount();
}
function isOutOfBounds(obj) {
  const left = obj.x, top = obj.y;
  const right = left + obj.width, bottom = top + obj.height;
  return right < 0 || left > STAGE_WIDTH || bottom < 0 || top > STAGE_HEIGHT;
}
function getPointerCoordsById(event) {
  const rect = stage.getBoundingClientRect();
  return { x: event.clientX - rect.left, y: event.clientY - rect.top };
}

// Spawn & animation
function spawn_item(currentTimeSec) {
  while (spawnIndex < movement.length && movement[spawnIndex].time <= currentTimeSec) {
    const data = movement[spawnIndex];
    const element = createObjectElement(data.type);
    element.style.position = 'absolute';
    element.style.left = `${data.xpos}px`;
    element.style.top = `${data.ypos}px`;
    stage.appendChild(element);
    const rect = element.getBoundingClientRect();
    const width = rect.width, height = rect.height;
    const dirRad = data.dir * Math.PI / 180;
    activeObjects.push({
      element, x: data.xpos, y: data.ypos, speed: data.speed,
      dirRad, type: data.type, width, height
    });
    spawnIndex++;
    updateActiveCount();
  }
}
function updatepos(deltaSec) {
  for (let obj of activeObjects) {
    const dx = obj.speed * deltaSec * Math.cos(obj.dirRad);
    const dy = obj.speed * deltaSec * Math.sin(obj.dirRad);
    obj.x += dx;
    obj.y += dy;
    obj.element.style.left = `${obj.x}px`;
    obj.element.style.top = `${obj.y}px`;
  }
}
function clearobj() {
  for (let i = activeObjects.length - 1; i >= 0; i--) {
    if (isOutOfBounds(activeObjects[i])) removeObject(activeObjects[i], i);
  }
}
function animate(now) {
  if (!animating) return;
  if (!lastTimestamp) {
    lastTimestamp = now;
    animationId = requestAnimationFrame(animate);
    return;
  }
  let delta = Math.min(0.1, (now - lastTimestamp) / 1000);
  if (delta <= 0) {
    lastTimestamp = now;
    animationId = requestAnimationFrame(animate);
    return;
  }
  const elapsed = (now - animStartTime) / 1000;
  spawn_item(elapsed);
  updatepos(delta);
  clearobj();
  lastTimestamp = now;
  animationId = requestAnimationFrame(animate);
}
function startAnimation() {
  if (animating) return;

  // Stop any currently playing audio
  bgm.pause();
  bgm.currentTime = 0;
  if (audioTimeout) clearTimeout(audioTimeout);

  // Reset all objects and state
  resetAllObjects();

  // Read current multiplier (fixed values for testing)
  speedMultiplier = 1.3;
  const delayMs = 800;

  // Play audio after delay (if delayMs > 0)
  if (delayMs > 0) {
    audioTimeout = setTimeout(() => {
      bgm.play().catch(e => console.warn('Audio play failed:', e));
      audioTimeout = null;
    }, delayMs);
  } else {
    bgm.play().catch(e => console.warn('Audio play failed:', e));
  }

  // Start animation
  spawnIndex = 0;
  animStartTime = performance.now();
  lastTimestamp = null;
  animating = true;
  animate(performance.now());
}
function resetAllObjects() {
  bgm.pause();
  bgm.currentTime = 0;
  if (audioTimeout) {
    clearTimeout(audioTimeout);
    audioTimeout = null;
  }
  combo = 0;
  updateCombo();
  if (animationId) cancelAnimationFrame(animationId);
  animationId = null;
  animating = false;
  for (let obj of activeObjects) obj.element.remove();
  activeObjects = [];
  spawnIndex = 0;
  updateActiveCount();
  animStartTime = null;
  lastTimestamp = null;
  activeTouches.clear();
}

// ------------------------------------------------------------------
// Multi‑touch interaction handlers
// ------------------------------------------------------------------

// Helper: remove the nearest object of given type within tolerance
function removeNearest(x, typeFilter) {
  let best = null;
  let bestDist = Infinity;
  for (let i = 0; i < activeObjects.length; i++) {
    const obj = activeObjects[i];
    if (obj.type !== typeFilter) continue;
    const centreX = obj.x + obj.width / 2;
    const centreY = obj.y + obj.height / 2;
    const dx = centreX - x;
    const dy = centreY - JUDGEMENT_LINE_Y;
    if (Math.abs(dx) <= HIT_X_TOLERANCE && Math.abs(dy) <= JUDGEMENT_TOLERANCE) {
      const dist = Math.hypot(dx, dy);
      if (dist < bestDist) {
        bestDist = dist;
        best = { obj, index: i };
      }
    }
  }
  if (best) {
    removeObject(best.obj, best.index);
    combo++;
    updateCombo();
    return best.obj;
  }
  return null;
}

// Tap handler – used for mouse clicks (backup)
stage.addEventListener('click', (event) => {
  const pid = event.pointerId;
  const touch = activeTouches.get(pid);
  if (touch && touch.ignoreClick) {
    touch.ignoreClick = false;   // consume the flag
    return;
  }
  const rect = stage.getBoundingClientRect();
  const tapX = event.clientX - rect.left;
  const tapY = event.clientY - rect.top;
  if (Math.abs(tapY - JUDGEMENT_LINE_Y) <= JUDGEMENT_TOLERANCE) {
    removeNearest(tapX, 'tap');
  }
});

// Pointer down – start tracking a new touch
stage.addEventListener('pointerdown', (event) => {
  const id = event.pointerId;
  const { x, y } = getPointerCoordsById(event);
  activeTouches.set(id, {
    flickRemoved: false,
    ignoreClick: false,
    startPos: { x, y },
    startTime: performance.now(),
    lastX: x,
    lastY: y,
  });
  event.preventDefault();
});

// Pointer move – process drag and flick
stage.addEventListener('pointermove', (event) => {
  const id = event.pointerId;
  const touch = activeTouches.get(id);
  if (!touch) return;

  const { x, y } = getPointerCoordsById(event);
  touch.lastX = x;
  touch.lastY = y;

  if (Math.abs(y - JUDGEMENT_LINE_Y) <= JUDGEMENT_TOLERANCE) {
    // Drags: remove any drag object at this x (continuous)
    removeNearest(x, 'drag');

    // Flicks: only remove one per gesture
    if (!touch.flickRemoved) {
      if (removeNearest(x, 'flick')) {
        touch.flickRemoved = true;
        touch.ignoreClick = true;
      }
    }
  }
});

// Pointer up – detect tap and clean up
stage.addEventListener('pointerup', (event) => {
  const id = event.pointerId;
  const touch = activeTouches.get(id);
  if (!touch) return;

  const { x, y } = getPointerCoordsById(event);
  const duration = performance.now() - touch.startTime;
  const dx = x - touch.startPos.x;
  const dy = y - touch.startPos.y;
  const movement = Math.hypot(dx, dy);

  // Check for tap (short duration, little movement, near judgement line)
  if (duration <= TAP_MAX_DURATION && movement <= TAP_MAX_MOVE) {
    if (Math.abs(y - JUDGEMENT_LINE_Y) <= JUDGEMENT_TOLERANCE) {
      if (removeNearest(x, 'tap')) {
        touch.ignoreClick = true;   // prevent click event
      }
    }
  }

  // Remove the touch entry
  activeTouches.delete(id);
});

// Disable right-click context menu
document.addEventListener('contextmenu', (event) => {
  event.preventDefault();
  return false;
});

// Button listeners
startBtn.addEventListener('click', () => startAnimation());
stopBtn.addEventListener('click', () => {
  if (animating) {
    animating = false;
    if (animationId) cancelAnimationFrame(animationId);
    animationId = null;
  }
});
resetBtn.addEventListener('click', () => resetAllObjects());

// Initial reset
resetAllObjects();
