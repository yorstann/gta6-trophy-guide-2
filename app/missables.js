// The missables view (#/missables): the seven trophies that can be lost for
// good, led by the "Before the final mission" checklist — every strand that
// must be finished before the endgame closes it.

import { displayName, isMasked } from './filters.js';
import { setEarned } from './store.js';
import { h, medal, tagList } from './ui.js';

// The strand owner a missable belongs to, from its note — used by the summary
// checklist so a player can tick strands off by name.
const STRAND_OF = { 22: 'Andy', 23: 'Kenton', 24: 'Billy', 25: 'All 8 strands', 26: 'Randy', 27: 'Tyrone', 48: 'Story choices' };

function summary(ui, missables) {
  const { state } = ui;
  const box = h('section', 'miss-summary');
  box.append(
    h('h3', '', '⏰ Before the final mission'),
    h('p', '', 'Starting the final story mission closes every unfinished strand. Clear this list first — or keep a backup save from before the finale, and these stay recoverable.'),
  );
  const ul = document.createElement('ul');
  for (const t of missables) {
    const li = h('li', state.earned.has(t.id) ? 'done' : '');
    const label = isMasked(state, t) ? 'Hidden trophy' : `${STRAND_OF[t.id]} — ${t.name}`;
    li.append(`${state.earned.has(t.id) ? '✓ ' : ''}${label}`);
    ul.append(li);
  }
  box.append(ul);
  return box;
}

function missCard(ui, t, refresh) {
  const { state } = ui;
  const card = h('article', 'miss-card');
  const label = h('label', 'check');
  const box = document.createElement('input');
  box.type = 'checkbox';
  box.checked = state.earned.has(t.id);
  box.setAttribute('aria-label', `Mark ${t.name} as earned`);
  box.addEventListener('change', () => {
    setEarned(state, t, box.checked);
    refresh();
  });
  label.append(box);
  const main = h('div', 't-main');
  const name = h('a', 't-name', displayName(state, t));
  name.href = `#/trophy/${t.id}`;
  main.append(name);
  if (!isMasked(state, t)) main.append(h('p', 'm-note', `⚠ ${t.missableNote ?? ''}`));
  main.append(tagList(state, t));
  card.append(label, medal(t), main);
  return card;
}

export function renderMissables(view, ui, refresh) {
  const missables = ui.trophies.filter((t) => t.missable).sort((a, b) => a.id - b.id);
  view.replaceChildren();
  const head = h('div', 'view-head');
  head.append(
    h('h2', '', 'Missable trophies'),
    h('p', '', 'Seven of the 55 can be missed: the five strand finales and their umbrella trophy close when the final story mission begins, and Actions Speak Louder turns on story choices. Everything else on the list can be cleaned up in free roam after the credits.'),
  );
  view.append(head, summary(ui, missables));
  for (const t of missables) view.append(missCard(ui, t, refresh));
}
