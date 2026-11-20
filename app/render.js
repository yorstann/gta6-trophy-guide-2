// The checklist view: header progress, the Next Up panel, filter controls and
// the 55 trophy rows. Everything re-renders from state on every change — the
// app is small enough that a full render is the simplest correct update.

import { CHIPS, chipCount, displayDesc, displayName, filters, isMasked, matchesFilters } from './filters.js';
import { GRADES, stageOf } from './stages.js';
import { setEarned } from './store.js';
import { counterEl, gradeWord, h, medal, tagList } from './ui.js';

export function renderHeader(ui) {
  const { trophies, state } = ui;
  const earned = state.earned.size;
  document.getElementById('pct').textContent = `${Math.round((earned / trophies.length) * 100)}%`;
  document.getElementById('earned-line').textContent = `${earned} of ${trophies.length} earned`;
  document.getElementById('bar-fill').style.width = `${(earned / trophies.length) * 100}%`;
  const pills = document.getElementById('grade-pills');
  pills.replaceChildren();
  for (const grade of GRADES) {
    const all = trophies.filter((t) => t.grade === grade);
    const got = all.filter((t) => state.earned.has(t.id)).length;
    const pill = h('span', 'pill');
    pill.append(`${gradeWord(grade)} `, Object.assign(h('b', '', `${got}/${all.length}`)));
    pills.append(pill);
  }
}

// The next three unearned trophies in roadmap order — what to play next.
export function nextUp(ui) {
  const ordered = [...ui.trophies].sort((a, b) => a.stage - b.stage || a.id - b.id);
  return ordered.filter((t) => !ui.state.earned.has(t.id)).slice(0, 3);
}

function nextUpPanel(ui, refresh) {
  const panel = h('section', 'nextup');
  panel.append(h('h2', '', 'Next up on the roadmap'));
  const row = h('div', 'nextup-row');
  for (const t of nextUp(ui)) {
    const card = h('a', 'next-card');
    card.href = `#/trophy/${t.id}`;
    const body = h('span');
    body.append(
      h('span', 'n-name', displayName(ui.state, t)),
      h('span', 'n-stage', `Stage ${t.stage} · ${stageOf(t.stage).title} · ${gradeWord(t.grade)}`),
    );
    card.append(medal(t, true), body);
    row.append(card);
  }
  if (row.childElementCount === 0) row.append(h('span', '', 'Everything is earned — Leonida Legend status reached.'));
  panel.append(row);
  return panel;
}

function controls(ui, refresh) {
  const bar = h('div', 'controls');
  const chips = h('div', 'chips');
  for (const chip of CHIPS) {
    const b = h('button', `chip${filters.chip === chip.id ? ' active' : ''}`);
    b.type = 'button';
    b.append(`${chip.label} `, h('span', 'chip-n', `${chipCount(ui.trophies, chip.id)}`));
    b.addEventListener('click', () => {
      filters.chip = chip.id;
      refresh();
    });
    chips.append(b);
  }
  const grade = document.createElement('select');
  grade.setAttribute('aria-label', 'Filter by grade');
  for (const [value, label] of [['all', 'All grades'], ...GRADES.map((g) => [g, gradeWord(g)])]) {
    const opt = h('option', '', label);
    opt.value = value;
    grade.append(opt);
  }
  grade.value = filters.grade;
  grade.addEventListener('change', () => {
    filters.grade = grade.value;
    refresh();
  });
  const search = document.createElement('input');
  search.type = 'search';
  search.placeholder = 'Search trophies…';
  search.value = filters.query;
  search.setAttribute('aria-label', 'Search trophies');
  search.addEventListener('input', () => {
    filters.query = search.value;
    refresh();
    const again = document.querySelector('input[type="search"]');
    if (again) {
      again.focus();
      again.setSelectionRange(again.value.length, again.value.length);
    }
  });
  bar.append(chips, grade, search);
  return bar;
}

function trophyRow(ui, t, refresh) {
  const { state } = ui;
  const row = h('article', `trophy${state.earned.has(t.id) ? ' earned' : ''}${isMasked(state, t) ? ' masked' : ''}`);
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
  main.append(name, h('p', 't-desc', displayDesc(state, t)), tagList(state, t));
  row.append(label, medal(t), main);
  if (t.count) row.append(counterEl(state, t, refresh));
  return row;
}

export function renderList(view, ui, refresh) {
  const { trophies, state } = ui;
  view.replaceChildren();
  view.append(nextUpPanel(ui, refresh), controls(ui, refresh));
  if (filters.chip === 'online') {
    const empty = h('div', 'empty');
    empty.append(
      h('strong', '', 'No online trophies in this list'),
      h('span', '', 'The PS5 list has no online trophies — the partner trophies are story co-op, played on the couch or over the story campaign.'),
    );
    view.append(empty);
    return;
  }
  const shown = trophies.filter((t) => matchesFilters(state, t));
  view.append(h('p', 'result-line', `Showing ${shown.length} of ${trophies.length} trophies`));
  if (shown.length === 0) {
    const empty = h('div', 'empty');
    empty.append(h('strong', '', 'Nothing matches'), h('span', '', 'Try a different filter, grade or search.'));
    view.append(empty);
    return;
  }
  for (const t of shown) view.append(trophyRow(ui, t, refresh));
}
