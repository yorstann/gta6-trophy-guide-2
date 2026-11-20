// List filtering for the checklist: filter chips, grade select, text search,
// and the spoiler-shield masking rule shared by every view.

export const CHIPS = [
  { id: 'all', label: 'All' },
  { id: 'story', label: 'Story' },
  { id: 'missable', label: 'Missable' },
  { id: 'collectibles', label: 'Collectibles' },
  { id: 'activities', label: 'Activities' },
  { id: 'online', label: 'Online' },
];

export const filters = { chip: 'all', grade: 'all', query: '' };

// The spoiler shield: a hidden trophy that is not yet earned is masked.
export const isMasked = (state, t) => state.shield && t.hidden && !state.earned.has(t.id);

export const displayName = (state, t) => (isMasked(state, t) ? 'Hidden trophy' : t.name);

export const displayDesc = (state, t) =>
  isMasked(state, t) ? 'Hidden trophy — earn it to reveal' : t.description;

export function chipCount(trophies, chip) {
  if (chip === 'all') return trophies.length;
  if (chip === 'online') return 0; // the PS5 list has no online trophies
  if (chip === 'missable') return trophies.filter((t) => t.missable).length;
  return trophies.filter((t) => t.kind === chip).length;
}

export function matchesFilters(state, t) {
  if (filters.chip === 'online') return false;
  if (filters.chip === 'missable' && !t.missable) return false;
  if (filters.chip !== 'all' && filters.chip !== 'missable' && t.kind !== filters.chip) return false;
  if (filters.grade !== 'all' && t.grade !== filters.grade) return false;
  const q = filters.query.trim().toLowerCase();
  if (q) {
    // A masked trophy never leaks its name or description through search.
    if (isMasked(state, t)) return false;
    if (!`${t.name} ${t.description}`.toLowerCase().includes(q)) return false;
  }
  return true;
}
