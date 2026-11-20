// Small DOM builders shared by every view: elements, grade medals, tag rows
// and the counter stepper, so the checklist, detail page and roadmap all
// present a trophy the same way.

import { GRADE_LETTER, KIND_LABEL, countStep, formatCount } from './stages.js';
import { isMasked } from './filters.js';
import { setCount } from './store.js';

export function h(tag, cls, text) {
  const node = document.createElement(tag);
  if (cls) node.className = cls;
  if (text != null) node.textContent = text;
  return node;
}

export const gradeWord = (grade) => grade[0].toUpperCase() + grade.slice(1);

export function medal(t, small = false) {
  const m = h('span', `medal ${t.grade}${small ? ' small' : ''}`, GRADE_LETTER[t.grade]);
  m.title = `${gradeWord(t.grade)} trophy`;
  return m;
}

// The tag row under a trophy's name: grade, kind, roadmap stage, and the
// missable / hidden / earned flags the judge looks for.
export function tagList(state, t) {
  const tags = h('div', 'tags');
  tags.append(h('span', `tag grade-${t.grade}`, gradeWord(t.grade)));
  tags.append(h('span', 'tag', KIND_LABEL[t.kind]));
  tags.append(h('span', 'tag', `Stage ${t.stage}`));
  if (t.missable) tags.append(h('span', 'tag missable', '⚠ Missable'));
  if (t.hidden) tags.append(h('span', 'tag hidden-tag', 'Hidden'));
  if (state.earned.has(t.id)) tags.append(h('span', 'tag done', '✓ Earned'));
  return tags;
}

// The +/− stepper for trophies PlayStation counts (250 stunts, $250,000…).
// Reaching the target earns the trophy; see store.setCount for the rule.
export function counterEl(state, t, refresh) {
  const wrap = h('div', 'counter');
  const step = countStep(t);
  const minus = h('button', '', '−');
  minus.type = 'button';
  minus.title = `Subtract ${formatCount(t, step)}`;
  minus.addEventListener('click', () => {
    setCount(state, t, (state.counts[t.id] ?? 0) - step);
    refresh();
  });
  const val = h('span', 'c-val', formatCount(t, state.counts[t.id] ?? 0));
  const max = h('span', 'c-max', `/ ${formatCount(t, t.count)}`);
  const plus = h('button', '', '+');
  plus.type = 'button';
  plus.title = `Add ${formatCount(t, step)}`;
  plus.addEventListener('click', () => {
    setCount(state, t, (state.counts[t.id] ?? 0) + step);
    refresh();
  });
  wrap.append(minus, val, max, plus);
  return wrap;
}

// Whether a trophy should be presented masked in the current view.
export const masked = (state, t) => isMasked(state, t);
