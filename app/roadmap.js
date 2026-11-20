// The roadmap view (#/roadmap): the seven stages to the platinum, each with
// its hour estimate, focus note and trophies in order, closing with the
// Platinum checklist — the final sweep, wired to the player's real progress.

import { displayName, isMasked } from './filters.js';
import { STAGES } from './stages.js';
import { h, medal } from './ui.js';

function stageCard(ui, stage) {
  const { state, trophies } = ui;
  const mine = trophies.filter((t) => t.stage === stage.n).sort((a, b) => a.id - b.id);
  const done = mine.filter((t) => state.earned.has(t.id)).length;
  const card = h('section', 'stage');
  const head = h('div', 'stage-head');
  head.append(
    h('span', 'stage-num', `${stage.n}`),
    h('h3', '', stage.title),
    h('span', 'stage-hours', stage.hours),
    h('span', 'stage-count', `${done}/${mine.length} earned`),
  );
  const chips = h('div', 'stage-trophies');
  for (const t of mine) {
    const chip = h('a', `tchip${state.earned.has(t.id) ? ' earned' : ''}`);
    chip.href = `#/trophy/${t.id}`;
    chip.append(medal(t, true), h('span', '', displayName(state, t)));
    if (state.earned.has(t.id)) chip.append(h('span', 'tick', '✓'));
    chips.append(chip);
  }
  card.append(head, h('p', 'stage-focus', stage.focus), chips);
  return card;
}

// The final sweep, computed from real state: each row fills in as its part of
// the game is finished, so the checklist doubles as a progress report.
export function platinumChecklist(ui) {
  const { state, trophies } = ui;
  const earned = (t) => state.earned.has(t.id);
  const of = (list) => ({ got: list.filter(earned).length, all: list.length });
  const strandFinales = trophies.filter((t) => [22, 23, 24, 26, 27].includes(t.id));
  const missables = trophies.filter((t) => t.missable);
  const counters = trophies.filter((t) => t.count);
  const countersDone = counters.filter((t) => (state.counts[t.id] ?? 0) >= t.count || earned(t));
  const collectibles = trophies.filter((t) => t.kind === 'collectibles');
  return [
    { label: 'Story complete — the final mission finished', ...of(trophies.filter((t) => t.id === 7)) },
    { label: 'All strand finales secured', ...of(strandFinales) },
    { label: 'Every missable earned — nothing left behind', ...of(missables) },
    { label: 'Counters maxed (stunts, spots, dollars…)', got: countersDone.length, all: counters.length },
    { label: 'Collectibles complete', ...of(collectibles) },
    { label: '100% completion reached — A Long Road', ...of(trophies.filter((t) => t.id === 14)) },
  ];
}

function checklistBlock(ui) {
  const block = h('section', 'plat-check');
  const title = h('h3');
  title.append(h('span', 'star', '✦ '), document.createTextNode('Platinum checklist — the final sweep'));
  block.append(title);
  for (const row of platinumChecklist(ui)) {
    const done = row.got >= row.all;
    const line = h('div', `check-row${done ? ' done' : ''}`);
    line.append(
      h('span', 'box', done ? '✓' : ''),
      h('span', 'cr-label', row.label),
      h('span', 'cr-count', `${row.got}/${row.all}`),
    );
    block.append(line);
  }
  return block;
}

export function renderRoadmap(view, ui) {
  view.replaceChildren();
  const head = h('div', 'view-head');
  head.append(
    h('h2', '', 'Roadmap to the platinum'),
    h('p', '', 'Seven stages, in the order that keeps every trophy reachable: story first, the missable strands before the final mission, then the sweeps. Hour figures are community-typical estimates for a completionist run.'),
  );
  view.append(head);
  for (const stage of STAGES) view.append(stageCard(ui, stage));
  view.append(checklistBlock(ui));
}
