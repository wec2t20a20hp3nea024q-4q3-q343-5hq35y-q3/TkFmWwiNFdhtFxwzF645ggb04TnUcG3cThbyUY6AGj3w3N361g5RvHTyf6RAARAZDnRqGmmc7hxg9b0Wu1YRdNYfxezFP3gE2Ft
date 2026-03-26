// script.js

// ------------------------------
// MOVEMENT DATA ARRAY (User editable)
// ------------------------------
const cs = 450;
const movement = [
  { time: 0, type: 'judgement_line', xpos: 0, ypos: 500, speed: 0, dir: 0 },
  { time: 0.0, type: 'tap',   xpos: 150,  ypos: 60, speed: cs, dir: 90 },
  { time: 0.0, type: 'tap',   xpos: 300,  ypos: 60, speed: cs, dir: 90 },
  { time: 0.0, type: 'tap',   xpos: 450,  ypos: 60, speed: cs, dir: 90 },
  { time: 0.0, type: 'tap',   xpos: 600,  ypos: 60, speed: cs, dir: 90 },
  { time: 0.8, type: 'drag',   xpos: 100,  ypos: 60, speed: cs, dir: 90 },
  { time: 0.9, type: 'drag',   xpos: 200,  ypos: 60, speed: cs, dir: 90 },
  { time: 1.0, type: 'drag',   xpos: 300,  ypos: 60, speed: cs, dir: 90 },
  { time: 1.1, type: 'drag',   xpos: 400,  ypos: 60, speed: cs, dir: 90 },
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
let activeTouches = new Map();   // key: pointerId, value: { flickRemoved, lastX, lastY }

// Constants
const STAGE_WIDTH = 1200;
const STAGE_HEIGHT = 600;
const JUDGEMENT_LINE_Y = 504;
const JUDGEMENT_TOLERANCE = 55;
const HIT_X_TOLERANCE = 70;

// DOM elements
const stage = document.getElementById('stage');
const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');
const stopBtn = document.getElementById('stopBtn');
const activeCountSpan = document.getElementById('activeCount');
const comboSpan = document.getElementById('comboCount');

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
function getPointerCoords(event) {
  const rect = stage.getBoundingClientRect();
  let clientX, clientY;
  if (event.touches) {
    clientX = event.touches[0].clientX;
    clientY = event.touches[0].clientY;
  } else {
    clientX = event.clientX;
    clientY = event.clientY;
  }
  return { x: clientX - rect.left, y: clientY - rect.top };
}
// Get coords for a specific pointer event (multi‑touch)
function getPointerCoordsById(event) {
  const rect = stage.getBoundingClientRect();
  return { x: event.clientX - rect.left, y: event.clientY - rect.top };
}

// Spawn & animation (unchanged)
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
  resetAllObjects();
  spawnIndex = 0;
  animStartTime = performance.now();
  lastTimestamp = null;
  animating = true;
  animate(performance.now());
}
function resetAllObjects() {
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
  // Clear all touch states
  activeTouches.clear();
}

// ------------------------------------------------------------------
// Multi‑touch interaction handlers
// ------------------------------------------------------------------

// Helper: remove the nearest object of given type within tolerance
// Returns the removed object or null if none.
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

// Tap handler (only for tap objects) – single tap uses click, works with any finger
stage.addEventListener('click', (event) => {
  // If this click is the result of a drag/flick removal, ignore it
  if (window._ignoreNextClick) {
    window._ignoreNextClick = false;
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
    lastX: x,
    lastY: y,
  });
  event.preventDefault();
});

// Pointer move – process drag and flick for each active touch
stage.addEventListener('pointermove', (event) => {
  const id = event.pointerId;
  const touch = activeTouches.get(id);
  if (!touch) return; // not tracked (shouldn't happen)

  const { x, y } = getPointerCoordsById(event);
  // Update last position
  touch.lastX = x;
  touch.lastY = y;

  // Only consider if near judgement line
  if (Math.abs(y - JUDGEMENT_LINE_Y) <= JUDGEMENT_TOLERANCE) {
    // Drags: remove any drag object at this x (continuous)
    removeNearest(x, 'drag');

    // Flicks: only remove one per gesture
    if (!touch.flickRemoved) {
      if (removeNearest(x, 'flick')) {
        touch.flickRemoved = true;
        // Prevent the click that would follow this drag/flick
        window._ignoreNextClick = true;
      }
    }
  }
});

// Pointer up – remove the touch
stage.addEventListener('pointerup', (event) => {
  const id = event.pointerId;
  activeTouches.delete(id);
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
