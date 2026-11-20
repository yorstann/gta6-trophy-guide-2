// Leonida Legend 2 — the hand-in program for the make.fun bounty
// gta6-trophy-guide-01 (Node 22, standard library only).
//
// The guide itself is the static web app in app/ (open app/index.html in a
// browser; `node serve.ts` serves it at http://localhost:8080). This program
// delivers it: it copies app/ and screenshots/ into the output directory and
// writes the dossier the judge reads, using the kit's vendored library —
// vendor/makefun-frontend.ts is make.fun's own file and stays untouched,
// because the scorer rebuilds the dossier with its copy and compares bytes.
//
// Outside the grader's container, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

// The scorer's caps, from the kit's gate: at most 4 screenshots of at most
// 256 KiB, at most 993 entries and 48 MiB under app/, and 163,840 bytes of
// source text in the dossier. Passing them here makes this program refuse
// exactly what the scorer would refuse.
const CAPS = {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 50331648,
};

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// Start from a clean slate — the three things this program owns, never the
// output directory itself — so a stale file from an earlier run cannot leak
// into the hand-in, and two runs write identical bytes.
mkdirSync(out, { recursive: true });
for (const owned of ['app', 'screenshots', 'dossier.json']) {
  rmSync(join(out, owned), { recursive: true, force: true });
}

cpSync(join(here, 'app'), join(out, 'app'), { recursive: true });

const shotsDir = join(here, 'screenshots');
mkdirSync(join(out, 'screenshots'), { recursive: true });
if (existsSync(shotsDir)) {
  cpSync(shotsDir, join(out, 'screenshots'), { recursive: true });
}

writeFileSync(join(out, 'dossier.json'), buildDossier(out, CAPS));

const shotCount = readdirSync(join(out, 'screenshots')).length;
console.log(`Leonida Legend 2 handed in: app/ + ${shotCount} screenshot(s) + dossier.json -> ${out}`);
