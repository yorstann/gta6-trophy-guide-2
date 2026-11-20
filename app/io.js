// Export / import / reset of the tracker's progress. Export downloads the
// state as a JSON file; import reads one back through the same normaliser the
// localStorage load uses, so a hand-edited file cannot corrupt the tracker.

import { normalizeState, serializeState } from './store.js';

export const EXPORT_NAME = 'leonida-legend-2-progress.json';

export function exportProgress(state) {
  const blob = new Blob([JSON.stringify(serializeState(state), null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = EXPORT_NAME;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// Parses imported JSON text into a clean state, or throws with a reader-facing
// reason. Kept separate from the file reading so it can be exercised directly.
export function importFromText(text, trophies) {
  let raw;
  try {
    raw = JSON.parse(text);
  } catch {
    throw new Error('That file is not valid JSON.');
  }
  if (!raw || typeof raw !== 'object' || (!Array.isArray(raw.earned) && typeof raw.counts !== 'object')) {
    throw new Error('That file does not look like Leonida Legend progress.');
  }
  return normalizeState(raw, trophies);
}

export function bindImport(input, trophies, onImported, onError) {
  input.addEventListener('change', async () => {
    const file = input.files?.[0];
    input.value = '';
    if (!file) return;
    try {
      onImported(importFromText(await file.text(), trophies));
    } catch (err) {
      onError(err instanceof Error ? err.message : 'Import failed.');
    }
  });
}
