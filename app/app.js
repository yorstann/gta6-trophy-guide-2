// Leonida Legend 2 — entry point. Loads the trophy data, restores progress,
// wires the shell controls (spoiler shield, export / import / reset) and routes
// the hash: #/ checklist, #/roadmap, #/missables, #/trophy/<id>. The list also
// accepts deep links such as #/trophies?shield=on&filter=missable.

import { CHIPS, filters } from './filters.js';
import { bindImport, exportProgress } from './io.js';
import { renderDetail } from './detail.js';
import { renderHeader, renderList } from './render.js';
import { renderMissables } from './missables.js';
import { renderRoadmap } from './roadmap.js';
import { loadData, loadState, replaceState, resetState, setShield } from './store.js';

const ui = { trophies: [], state: null };
const view = document.getElementById('view');

function parseHash() {
  const raw = location.hash.replace(/^#/, '') || '/';
  const [path, query] = raw.split('?');
  return { path: path || '/', params: new URLSearchParams(query ?? '') };
}

// Deep-link parameters seed the UI once per navigation: shield=on|off and
// filter=<chip>. After that the controls own the state.
function applyParams(params) {
  if (params.has('shield')) setShield(ui.state, params.get('shield') === 'on');
  const chip = params.get('filter');
  if (chip && CHIPS.some((c) => c.id === chip)) filters.chip = chip;
}

function markNav(routeName) {
  for (const a of document.querySelectorAll('[data-nav]')) {
    a.classList.toggle('active', a.dataset.nav === routeName);
  }
  document.getElementById('shield').checked = ui.state.shield;
}

function renderRoute() {
  const { path } = parseHash();
  if (path === '/roadmap') {
    markNav('roadmap');
    renderRoadmap(view, ui);
  } else if (path === '/missables') {
    markNav('missables');
    renderMissables(view, ui, refresh);
  } else if (path.startsWith('/trophy/')) {
    markNav('list');
    renderDetail(view, ui, Number(path.slice('/trophy/'.length)), refresh);
  } else {
    markNav('list');
    renderList(view, ui, refresh);
  }
}

function refresh() {
  renderHeader(ui);
  renderRoute();
}

function bindShell() {
  document.getElementById('shield').addEventListener('change', (e) => {
    setShield(ui.state, e.target.checked);
    // Keep a deep-linked hash honest, so the next navigation does not revert it.
    const { path, params } = parseHash();
    params.set('shield', ui.state.shield ? 'on' : 'off');
    history.replaceState(null, '', `#${path}?${params.toString()}`);
    refresh();
  });
  document.getElementById('export').addEventListener('click', () => exportProgress(ui.state));
  bindImport(
    document.getElementById('import'),
    ui.trophies,
    (next) => {
      replaceState(ui.state, next);
      refresh();
    },
    (message) => alert(message),
  );
  document.getElementById('reset').addEventListener('click', () => {
    if (!confirm('Reset all progress? Earned trophies and counters will be cleared.')) return;
    resetState(ui.state);
    refresh();
  });
}

async function boot() {
  const data = await loadData();
  ui.trophies = data.trophies;
  ui.state = loadState(ui.trophies);
  applyParams(parseHash().params);
  bindShell();
  window.addEventListener('hashchange', () => {
    applyParams(parseHash().params);
    refresh();
  });
  refresh();
}

boot().catch((err) => {
  view.textContent = `The guide could not load its trophy data (${err.message}). Serve the app over HTTP — see the README.`;
});
