// The trophy detail view (#/trophy/<id>): the full guide with its steps as a
// numbered list, the sources it cites, a facts panel, and — for the seven
// missables — a warning banner that cannot be scrolled past unnoticed.

import { displayDesc, displayName, isMasked } from './filters.js';
import { KIND_LABEL, stageOf } from './stages.js';
import { setEarned } from './store.js';
import { counterEl, gradeWord, h, medal, tagList } from './ui.js';

// A guide is stored as an intro line followed by one step per line; the steps
// render as an ordered list, the intro as the lead paragraph.
export function guideBlocks(guide) {
  const lines = guide.split('\n').map((s) => s.trim()).filter(Boolean);
  return { intro: lines[0] ?? '', steps: lines.slice(1) };
}

function guideCard(t) {
  const card = h('section', 'guide-card');
  card.append(h('h3', '', 'How to earn it'));
  const { intro, steps } = guideBlocks(t.guide);
  card.append(h('p', '', intro));
  if (steps.length) {
    const ol = document.createElement('ol');
    for (const step of steps) ol.append(h('li', '', step));
    card.append(ol);
  }
  const sources = h('p', 'sources');
  sources.append(h('strong', '', 'Sources: '), document.createTextNode(t.sources.join(' · ')));
  card.append(sources);
  return card;
}

function factsPanel(ui, t, refresh) {
  const { state } = ui;
  const panel = h('aside', 'facts');
  panel.append(h('h3', '', 'Trophy facts'));
  const dl = document.createElement('dl');
  const rows = [
    ['Grade', gradeWord(t.grade)],
    ['Type', KIND_LABEL[t.kind]],
    ['Roadmap stage', `${t.stage} · ${stageOf(t.stage).title}`],
    ['On PlayStation', t.hidden ? 'Hidden until earned' : 'Visible'],
    ['Missable', t.missable ? 'Yes — see the warning' : 'No'],
  ];
  for (const [k, v] of rows) {
    dl.append(h('dt', '', k), h('dd', '', v));
  }
  panel.append(dl);
  if (t.count) panel.append(counterEl(state, t, refresh));
  const btn = h('button', `earn-btn${state.earned.has(t.id) ? ' is-earned' : ''}`,
    state.earned.has(t.id) ? '✓ Earned — tap to undo' : 'Mark as earned');
  btn.type = 'button';
  btn.addEventListener('click', () => {
    setEarned(state, t, !state.earned.has(t.id));
    refresh();
  });
  panel.append(btn);
  return panel;
}

export function renderDetail(view, ui, id, refresh) {
  const { state } = ui;
  const t = ui.trophies.find((x) => x.id === id);
  view.replaceChildren();
  const back = h('a', 'back', '← Back to the checklist');
  back.href = '#/';
  view.append(back);
  if (!t) {
    view.append(h('p', '', 'No trophy with that number.'));
    return;
  }
  const head = h('div', 'detail-head');
  head.append(medal(t), h('h2', '', displayName(state, t)));
  view.append(head, h('p', 'detail-desc', displayDesc(state, t)), tagList(state, t));
  if (isMasked(state, t)) {
    const note = h('div', 'empty');
    note.append(
      h('strong', '', 'The spoiler shield is hiding this trophy'),
      h('span', '', 'It is a hidden PlayStation trophy you have not earned yet. Turn the shield off in the header to read its guide.'),
    );
    view.append(note);
    return;
  }
  if (t.missable) {
    const banner = h('div', 'warn-banner');
    banner.append(h('strong', '', '⚠ Missable — '), document.createTextNode(t.missableNote ?? 'This trophy can be missed.'));
    view.append(banner);
  }
  const grid = h('div', 'detail-grid');
  grid.append(guideCard(t), factsPanel(ui, t, refresh));
  view.append(grid);
}
