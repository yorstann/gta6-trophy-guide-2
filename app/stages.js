// The 7-stage platinum roadmap: titles, community-typical hour estimates and a
// one-line focus note per stage. Trophy-to-stage assignment lives in the data
// file (each trophy carries its stage number); this module owns the wording.

export const STAGES = [
  {
    n: 1,
    title: 'Story first',
    hours: '≈ 30–40 hrs',
    focus: 'Chapters and missions in order, and enjoy Leonida. Before big story choices, keep a backup save — Actions Speak Louder is choice-based.',
  },
  {
    n: 2,
    title: 'Strangers & strands',
    hours: '≈ 10–14 hrs',
    focus: 'Finish every strand finale (Andy, Kenton, Billy, Randy, Tyrone) and 8 strands in total BEFORE starting the final mission — this stage is the missable trap.',
  },
  {
    n: 3,
    title: 'Activities sweep',
    hours: '≈ 18–24 hrs',
    focus: 'Shooting Range golds and the 250 stunts are the long poles. Start stunts early, sample every activity once, and let challenges complete as you play.',
  },
  {
    n: 4,
    title: 'Collectibles & exploration',
    hours: '≈ 12–18 hrs',
    focus: 'Card sets, 100 WAiNK spots, 100 vehicles and the whole map. Sweep district by district and combine it with the stage 3 leftovers in the same areas.',
  },
  {
    n: 5,
    title: 'Crime & money',
    hours: '≈ 10–14 hrs',
    focus: 'Bank vaults, an armored truck, one illegal operation per gang — and keep the laundering pipeline running so the $250,000 and the garage buys pay for themselves.',
  },
  {
    n: 6,
    title: 'Partner & one-offs',
    hours: '≈ 6–10 hrs',
    focus: 'Partner escapes and robberies, plus the cryptic one-off moments. The vague descriptions are deliberate: the cited guides pin down any that refuse to pop.',
  },
  {
    n: 7,
    title: '100% & platinum',
    hours: '≈ 15–20 hrs',
    focus: 'Close out the completion checklist category by category. When A Long Road pops at 100%, the platinum follows.',
  },
];

export const stageOf = (n) => STAGES[n - 1];

export const KIND_LABEL = {
  story: 'Story',
  collectibles: 'Collectibles',
  activities: 'Activities',
  freeroam: 'Free roam',
  progress: 'Progress',
};

export const GRADES = ['platinum', 'gold', 'silver', 'bronze'];

export const GRADE_LETTER = { platinum: '✦', gold: 'G', silver: 'S', bronze: 'B' };

// Trophies whose counter is a dollar amount (the two money grinds).
export const MONEY_IDS = new Set([52, 53]);

export const formatCount = (t, n) => (MONEY_IDS.has(t.id) ? `$${n.toLocaleString('en-US')}` : `${n}`);

// How far one +/− press moves a counter: big steps for the dollar grinds.
export const countStep = (t) => (t.count >= 250000 ? 5000 : t.count >= 100000 ? 1000 : 1);
