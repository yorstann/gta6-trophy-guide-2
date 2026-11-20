// Progress state for Leonida Legend 2: earned trophies, counter progress and the
// spoiler-shield flag, persisted in localStorage only. Nothing leaves the device.

export const STORAGE_KEY = 'leonida-legend-v1';

const emptyState = () => ({ earned: new Set(), counts: {}, shield: false });

// Accepts the object export/import and localStorage both use; drops anything
// that does not name a real trophy id or a sane counter value.
export function normalizeState(raw, trophies) {
  const state = emptyState();
  if (!raw || typeof raw !== 'object') return state;
  const ids = new Set(trophies.map((t) => t.id));
  if (Array.isArray(raw.earned)) {
    for (const id of raw.earned) if (ids.has(id)) state.earned.add(id);
  }
  if (raw.counts && typeof raw.counts === 'object') {
    for (const t of trophies) {
      if (!t.count) continue;
      const n = Number(raw.counts[t.id]);
      if (Number.isFinite(n)) state.counts[t.id] = Math.min(Math.max(Math.trunc(n), 0), t.count);
    }
  }
  state.shield = raw.shield === true;
  return state;
}

export function serializeState(state) {
  return { earned: [...state.earned], counts: { ...state.counts }, shield: state.shield };
}

export function loadState(trophies) {
  try {
    return normalizeState(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null'), trophies);
  } catch {
    return emptyState();
  }
}

export function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(serializeState(state)));
}

export function setEarned(state, trophy, on) {
  if (on) state.earned.add(trophy.id);
  else state.earned.delete(trophy.id);
  saveState(state);
}

// Moves a counter, clamped to 0..target. Reaching the target earns the trophy;
// dropping back below it never un-earns — the checkbox stays the manual override.
export function setCount(state, trophy, n) {
  const clamped = Math.min(Math.max(Math.trunc(n), 0), trophy.count);
  state.counts[trophy.id] = clamped;
  if (clamped >= trophy.count) state.earned.add(trophy.id);
  saveState(state);
  return clamped;
}

export function setShield(state, on) {
  state.shield = on === true;
  saveState(state);
}

export function replaceState(state, next) {
  state.earned = next.earned;
  state.counts = next.counts;
  state.shield = next.shield;
  saveState(state);
}

export function resetState(state) {
  state.earned = new Set();
  state.counts = {};
  saveState(state);
}

export async function loadData() {
  const res = await fetch('data/trophies.json');
  if (!res.ok) throw new Error(`trophies.json: ${res.status}`);
  return res.json();
}
