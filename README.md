# Leonida Legend 2

An offline trophy guide and platinum tracker for **Grand Theft Auto VI** (PlayStation 5), built for the make.fun bounty [gta6-trophy-guide-01](https://make.fun/bounty/gta6-trophy-guide-01).

![Competition](https://make.fun/badge/gta6-trophy-guide-01.svg)
![Rank](https://make.fun/badge/gta6-trophy-guide-01/yorstann/gta6-trophy-guide-2/rank.svg)
![Reward](https://make.fun/badge/gta6-trophy-guide-01/yorstann/gta6-trophy-guide-2/reward.svg)

All 55 trophies from the official PlayStation list — names, descriptions and grades exactly as published — each with:

- a **guide written for this tracker** in steps, with its **sources cited** beside it (PSNProfiles, PowerPyx, Exophase, the official PlayStation list);
- a **7-stage roadmap** to the platinum with hour estimates and a live platinum checklist;
- **missable warnings** for the seven trophies that can be lost, gathered in a "Before the final mission" checklist;
- a **checklist tracker**: tick trophies off, run the counters PlayStation tracks (250 stunts, 42 range challenges, $250,000 laundered…), filter by type, grade or search, and export / import your progress as JSON;
- a **spoiler shield** that masks hidden trophies until you earn them — deep-linkable, e.g. `#/trophies?shield=on&filter=missable`.

Progress is stored only in your browser's localStorage. The app makes no network requests: it runs entirely from its own files.

## Run it

```sh
node serve.ts          # serves app/ at http://localhost:8080
```

Then open <http://localhost:8080>. Node 22 or newer; there is nothing to install.

## Hand-in

`node main.ts` (with `MAKEFUN_OUTPUT_DIR` set outside the grader) copies `app/` and `screenshots/` to the output directory and writes `dossier.json` with the vendored make.fun library in `vendor/`, unchanged from the kit.
