# Standalone-PR triage (2026-10-07)

Base tip: `#476` / `cursor/integration-fold-wave4-tip-36e4` @ `367d291`.
Wave-5 fold on that tip is in progress elsewhere — not touched.
This fold does **not** change rules, scoring, end conditions, or CI permissions.
Existing drafts are left open (not merged, closed, or retargeted).

| PR | Disposition | One-line recommended answer |
| --- | --- | --- |
| [#355](https://github.com/fuzzywigg/math-pentathlon/pull/355) | **folded** (partial) | Keep Contig/FIAR/Hex Step-0 specs; close kings/kwatro halves as superseded by tip `docs/mp3d/*-3d-spec.md`. |
| [#414](https://github.com/fuzzywigg/math-pentathlon/pull/414) | **folded** | Merge tablet playtest report + screenshots; still the only full Easy/Med/Hard tablet pass on record. |
| [#420](https://github.com/fuzzywigg/math-pentathlon/pull/420) | **folded** | Merge gallery capture script + committed start/mid PNGs + README Gallery table. |
| [#459](https://github.com/fuzzywigg/math-pentathlon/pull/459) | **folded** | Merge hex-a-gone targeted branch-coverage tests + remaining-coverage note (tests/docs only). |
| [#468](https://github.com/fuzzywigg/math-pentathlon/pull/468) | **folded** (harness only) + **needs-owner-decision** (AI tunes) | Keep tip AI (esp. kwatro tablet think-budget); fold calibration harness/guards; decide separately whether FIAR/Pent/Kwatro heuristic retunes are wanted. |
| [#481](https://github.com/fuzzywigg/math-pentathlon/pull/481) | **folded** | Merge unit-suite flake hardening (`setup.ts` owl/`Math.random`/`alert` restore + polluter `clearAllMocks`). |

## Per-PR detail

### #355 — docs(mp3d): Step-0 rules-first 3D board specs

- **What it does:** Adds `docs/mp3d/spec-*.md` (+ Gemini cross-check notes) for Contig 60, FIAR, Hex, Kings & Quadraphages, Kwatro-Sinko. Docs only; open rules questions for Andrew.
- **vs tip:** Tip already ships implementation-oriented `docs/mp3d/*-3d-spec.md` (and FIAR board assets) for Kings, Kwatro, Hex-a-Gone, etc. Contig/FIAR/Hex Step-0 packets are still unique.
- **Rules/scoring?** No (docs only; flags unverified win text, does not change engines).
- **Folded:** `spec-contig-60*`, `spec-fiar*`, `spec-hex*` only.
- **Close-as-superseded (owner action on original PR):** `spec-kings-quadraphages*`, `spec-kwatro-sinko*` — tip `kings-quadraphages-3d-spec.md` / `kwatro-sinko-3d-spec.md` supersede.

### #414 — docs(playtest): tablet vs-AI playability report

- **What it does:** Report-only tablet (768×1024) Easy/Med/Hard playability pass + one PNG per game.
- **vs tip:** Tip has other playtest notes (`*-recheck`, pent-place UX, deep dives) but not this dated overview table.
- **Rules/scoring?** No.
- **Folded:** entire PR contents.

### #420 — docs(gallery): tablet start + mid-game screenshots

- **What it does:** Playwright gallery config/spec, 40 PNGs under `docs/gallery/`, README Gallery section.
- **vs tip:** Missing on tip; complementary to visual baselines (different viewport/purpose).
- **Rules/scoring?** No. Capture script is not wired into CI.
- **Folded:** entire PR contents (README Gallery inserted without clobbering tip Status/Agent rules).

### #459 — test(engines): hex-a-gone remaining branch coverage

- **What it does:** Hand-built-state unit tests lifting `hex-a-gone/rules.ts` branch coverage; docs remaining gap (`getPhaseMessage` default).
- **vs tip:** Tip has many hex-a-gone suites + other `engine-coverage-*-targeted` files, but not this remaining suite.
- **Rules/scoring?** No (tests/docs only).
- **Folded:** entire PR contents.

### #468 — test(ai): headless AI calibration matrices + Hard≥Easy guards

- **What it does:** Calibration harness (`tests/helpers/ai-calibration/`, `scripts/run-ai-calibration.ts`), seeded Hard≥Easy unit guard, and heuristic retunes in FIAR / Kwatro-Sinko / Pent'Em In AI.
- **vs tip:** Tip kwatro AI already has tablet think-budget (`AI_THINK_BUDGET_MS`), evacuation weighting, and opponent-threat gating — **prefer tip**. #468’s kwatro rewrite conflicts and is not a pure bugfix on tip. FIAR `teachingBlunder` / Hard place-depth and Pent entrapment retunes change AI behavior without tip conflict but are out of fold scope (no rules/scoring, still student-facing difficulty).
- **Rules/scoring?** Harness: no. AI heuristic files: behavior change (not folded).
- **Folded:** harness + unit guard only; **no** `src/games/*/ai.ts`.
- **Needs-owner-decision:** Apply #468 AI tunes on tip in a dedicated PR? Recommended: **no for kwatro** (tip ahead); **maybe for FIAR/Pent** if calibration matrices still show Easy≥Hard after tip AI.

### #481 — fix(test): unit suite flake hunt

- **What it does:** Resets shared `owlSystem.gameStartTime`, restores `Math.random`/`alert` spies in `tests/unit/setup.ts`, switches known router-mock polluters from `restoreAllMocks` → `clearAllMocks`. Docs before/after flake counts. PR diff vs `alpha` looks huge because base is behind tip; unique delta vs tip is ~14 test/docs files.
- **vs tip:** Tip already isolates some selectors and avoids global `restoreAllMocks` in setup, but lacks owl stamp / Math.random / alert restores and several polluter fixes.
- **Rules/scoring?** No. Does not widen CI permissions.
- **Folded:** unique tip delta only.

## Out of scope / hard rules honored

- Did not merge, close, or retarget #355/#414/#420/#459/#468/#481/#476.
- Did not touch the in-progress wave-5 fold.
- No `src/games/*/rules.ts` or scoring/end-condition edits.
- No secrets; CI workflow permissions unchanged.
