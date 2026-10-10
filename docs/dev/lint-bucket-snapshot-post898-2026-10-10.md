# Lint-bucket measured snapshot — tip post898 (2026-10-10)

**Task id:** `q-mp-441`  
**Role:** worker (docs / chart only)  
**Tip measured:** `cursor/mp-tip-post898` @ `9b19c5e8` (`9b19c5e8cd3cd714d745540539324766369a8688`)  
**Measured at:** `2026-10-10T08:28:28Z` (UTC)  
**Helper:** [`lint-bucket-report.md`](./lint-bucket-report.md) (`npm run report:lint-buckets`, `q-mp-280` helper **contained** on tip)  
**Data:** [`lint-bucket-snapshot-post898-2026-10-10.json`](./lint-bucket-snapshot-post898-2026-10-10.json)  
**Chart:** ![lint-bucket focus bars @ post898](./lint-bucket-snapshot-post898-2026-10-10.svg)

## Purpose

Backlog `q-mp-441` (spec in draft [#921](https://github.com/fuzzywigg/math-pentathlon/pull/921) Oct 10e backlog, not yet on tip) asked for a dated tip snapshot at post898 ceilings. Stale backlog evidence (tip audited @ `788e8215`) listed void **52** / dup **42** / shadow **3** / nnnull **246** / nullish **65** and noted densest clearable residuals (stats-dashboard void **1**, placement nnnull **3**). Prior dated snapshot stamps post865 (`q-mp-416` @ `7f8a7147`, void **53** / nnnull **246**). Re-measure on the live tip head; commit report-only docs + chart. **No** `lint-ratchet-ceilings.json` edits. **No** `src/` / test behavior changes.

## Duplicate check (open drafts)

| PR                                                            | Title                                     | Overlap                                                                            |
| ------------------------------------------------------------- | ----------------------------------------- | ---------------------------------------------------------------------------------- |
| [#921](https://github.com/fuzzywigg/math-pentathlon/pull/921) | `q-mp-090n` backlog 10e                   | Spec owner only (lists `q-mp-441`); no snapshot files                              |
| [#910](https://github.com/fuzzywigg/math-pentathlon/pull/910) | `q-mp-416` lint-bucket snapshot post865   | Prior tip stamp — **already on tip** @ `a482379e`; leave open with **contained**   |
| [#916](https://github.com/fuzzywigg/math-pentathlon/pull/916) | `q-mp-424` board-a11y nnnull (−5)         | Code clear; **already on tip** @ `6404a8e6` + ceiling reconcile `9b19c5e8`         |
| [#901](https://github.com/fuzzywigg/math-pentathlon/pull/901) | `q-mp-423` pointer-hygiene void (−1)      | Code clear; **already on tip** — live void **52** (prior post865 stamp was **53**) |
| [#883](https://github.com/fuzzywigg/math-pentathlon/pull/883) | `q-mp-390` eslint non-ceilinged residuals | Orthogonal (non-ceilinged overlay); not a lint-bucket measured snapshot            |

No open draft into `cursor/mp-tip-post898` owned a post898 lint-bucket measured snapshot before this PR. Leave `#910` / `#901` / `#916` open with **contained** (do not close).

## Stale backlog → live tip (focus ceilings)

| Rule                                              | Stale backlog (`q-mp-441` @ `788e8215`) | Prior snapshot (post865 @ `7f8a7147`) | Live tip (`9b19c5e8` / post898) | Δ vs prior stamp |
| ------------------------------------------------- | --------------------------------------: | ------------------------------------: | ------------------------------: | ---------------: |
| `@typescript-eslint/no-confusing-void-expression` |                                      52 |                                **53** |                          **52** |           **−1** |
| `no-duplicate-imports`                            |                                      42 |                                **42** |                          **42** |                0 |
| `@typescript-eslint/no-shadow`                    |                                       3 |                                 **3** |                           **3** |                0 |
| `@typescript-eslint/no-non-null-assertion`        |                                     246 |                                   246 |                         **241** |           **−5** |
| `@typescript-eslint/prefer-nullish-coalescing`    |                                      65 |                                    65 |                          **65** |                0 |

Live ceilings come from [`lint-ratchet-ceilings.json`](./lint-ratchet-ceilings.json) notes (tip post898; owl −3 + reduced-motion −2 + pointer-hygiene −1 + board-a11y −5 already folded on tip). Stale backlog void **52** matches live tip; stale nnnull **246** is outdated after the `#916` fold (live **241**).

## Tip folds since prior snapshot — live vs post-fold

| Draft                                                               | Delta | Tip commit | On tip? | Effect           |
| ------------------------------------------------------------------- | ----: | ---------- | ------- | ---------------- |
| [#901](https://github.com/fuzzywigg/math-pentathlon/pull/901) ptr-h |    −1 | `931acd3a` | **yes** | void 53 → 52     |
| [#916](https://github.com/fuzzywigg/math-pentathlon/pull/916) a11y  |    −5 | `6404a8e6` | **yes** | nnnull 246 → 241 |

| Scenario                                      | Void total / ceiling | Nnnull total / ceiling |
| --------------------------------------------- | -------------------: | ---------------------: |
| Prior post865 stamp (`q-mp-416` @ `7f8a7147`) |          **53** / 53 |          **246** / 246 |
| Live tip measured (`9b19c5e8`)                |          **52** / 52 |          **241** / 241 |
| Post-fold expected                            |          **52** / 52 |          **241** / 241 |

Live == post-fold expected. Leave `#901` / `#916` open with **contained** (already on tip); do not close.

## Chart — focus metrics + void buckets

![q-mp-441 lint-bucket focus snapshot](./lint-bucket-snapshot-post898-2026-10-10.svg)

```text
void       ████████████████████████████████████████████████████  52 / 52
dup-import ██████████████████████████████████████████             42 / 42
no-shadow  ███                                                     3 /  3
nnnull     ███████████████████████████████████████████████████   241 / 241

void path buckets:
  src/ui/three  ████████████████████████████████████  34
  src/          ████████████                          12
  src/pwa       ████                                   4
  src/ui        █                                      1
  prime-gold    █                                      1
```

## All ceilinged rules (live probe)

Commands:

```bash
npm run report:lint-buckets -- --top 30
npm run lint:ratchet
```

| Rule                                              | Live total | Ceiling | Headroom |
| ------------------------------------------------- | ---------: | ------: | -------: |
| `curly`                                           |        538 |     538 |        0 |
| `@typescript-eslint/no-non-null-assertion`        |    **241** | **241** |        0 |
| `@typescript-eslint/no-confusing-void-expression` |     **52** |  **52** |        0 |
| `radix`                                           |          6 |       6 |        0 |
| `default-case`                                    |          5 |       5 |        0 |
| `no-duplicate-imports`                            |     **42** |  **42** |        0 |
| `@typescript-eslint/prefer-nullish-coalescing`    |         65 |      65 |        0 |
| `@typescript-eslint/prefer-optional-chain`        |         21 |      21 |        0 |
| `@typescript-eslint/switch-exhaustiveness-check`  |          8 |       8 |        0 |
| `@typescript-eslint/no-shadow`                    |      **3** |   **3** |        0 |
| `eqeqeq` (stricter always; via `lint:ratchet`)    |      **1** |   **1** |        0 |
| `@typescript-eslint/return-await`                 |          3 |       3 |        0 |

### Probe note (eqeqeq)

`npm run lint:ratchet` reports `eqeqeq: 1 / ceiling 1` (stricter `always` overlay; residual HOLD on fiar rules).  
`npm run report:lint-buckets` text mode currently prints `eqeqeq: 0 / ceiling 1`; JSON mode includes the `src/games/fiar/rules.ts` hit. This snapshot records the **ratchet** total for eqeqeq and the helper totals for every other rule. No script edit in this ticket (docs/chart only).

---

## Focus: `@typescript-eslint/no-confusing-void-expression` — 52 / 52

### Path buckets

| Hits | Bucket               |
| ---: | -------------------- |
|   34 | src/ui/three         |
|   12 | src/                 |
|    4 | src/pwa              |
|    1 | src/games/prime-gold |
|    1 | src/ui               |

### Densest files (top 15 = all residual files)

| Hits | File                                        |
| ---: | ------------------------------------------- |
|   12 | src/main.ts                                 |
|    5 | src/ui/three/hex-a-gone-board-3d.ts         |
|    5 | src/ui/three/star-track-board-3d.ts         |
|    4 | src/ui/three/fiar-board-3d.ts               |
|    4 | src/ui/three/kings-quadraphages-board-3d.ts |
|    4 | src/ui/three/kwatro-sinko-board-3d.ts       |
|    4 | src/ui/three/pent-em-in-board-3d.ts         |
|    4 | src/ui/three/prime-gold-board-3d.ts         |
|    4 | src/ui/three/queens-guards-board-3d.ts      |
|    1 | src/games/prime-gold/types.ts               |
|    1 | src/pwa/bootstrap-owl.ts                    |
|    1 | src/pwa/bootstrap.ts                        |
|    1 | src/pwa/idle-warm.ts                        |
|    1 | src/pwa/register.ts                         |
|    1 | src/ui/stats-dashboard.ts                   |

**Clearable triage pointer (matches stale backlog):** `src/ui/stats-dashboard.ts` still holds void **1** (sole remaining `src/ui` bucket hit). Pointer-hygiene is gone from the densest list (already folded via `#901`/`q-mp-423`). Do not touch AI / rules / scoring / Hex Hard **450ms**.

---

## Focus: `no-duplicate-imports` — 42 / 42

### Path buckets (all)

| Hits | Bucket                       |
| ---: | ---------------------------- |
|    5 | src/games/juggle             |
|    3 | src/games/fiar               |
|    3 | src/games/pent-em-in         |
|    2 | src/games/calla              |
|    2 | src/games/contig-60          |
|    2 | src/games/frac-fact          |
|    2 | src/games/fraction-pinball   |
|    2 | src/games/hex                |
|    2 | src/games/hex-a-gone         |
|    2 | src/games/kwatro-sinko       |
|    2 | src/games/par-55             |
|    2 | src/games/prime-gold         |
|    2 | src/games/queens-guards      |
|    2 | src/games/ramrod             |
|    2 | src/games/star-track         |
|    2 | src/games/stars-bars         |
|    2 | src/games/sum-dominoes       |
|    1 | src/games/fab-a-diffy        |
|    1 | src/games/kings-quadraphages |
|    1 | src/games/remainder-islands  |

### Densest files (top 10)

| Hits | File                                |
| ---: | ----------------------------------- |
|    2 | src/games/frac-fact/rules.ts        |
|    2 | src/games/fraction-pinball/rules.ts |
|    2 | src/games/juggle/ai.ts              |
|    2 | src/games/juggle/rules.ts           |
|    1 | src/games/calla/ai.ts               |
|    1 | src/games/calla/rules.ts            |
|    1 | src/games/contig-60/ai.ts           |
|    1 | src/games/contig-60/rules.ts        |
|    1 | src/games/fab-a-diffy/rules.ts      |
|    1 | src/games/fiar/ai.ts                |

Many residual hits sit in `*/rules.ts` / `*/ai.ts` — HOLD under hard rules for AI / legal-move / scoring paths. Merge-only clears must stay outside those paths.

---

## Focus: `@typescript-eslint/no-shadow` — 3 / 3

| Hits | File                         |
| ---: | ---------------------------- |
|    2 | src/games/contig-60/types.ts |
|    1 | src/games/par-55/rules.ts    |

Bucket totals: contig-60 **2**, par-55 **1**. The par-55 hit is under rules — HOLD for worker clears that must not touch rules logic.

---

## Other densest-file snapshots (context)

### `curly` (538) — densest files

| Hits | File                            |
| ---: | ------------------------------- |
|   40 | src/games/fiar/ai.ts            |
|   32 | src/games/kwatro-sinko/rules.ts |
|   25 | src/games/fiar/rules.ts         |
|   25 | src/games/juggle/ai.ts          |
|   24 | src/games/hex/ai.ts             |
|   20 | src/games/hex-a-gone/rules.ts   |
|   20 | src/games/kwatro-sinko/ai.ts    |
|   19 | src/games/fab-a-diffy/rules.ts  |
|   19 | src/games/queens-guards/ai.ts   |
|   17 | src/games/hex-a-gone/ai.ts      |

### `@typescript-eslint/no-non-null-assertion` (241) — densest files

| Hits | File                                  |
| ---: | ------------------------------------- |
|   29 | src/main.ts                           |
|   28 | src/ui/game-route-mounts.ts           |
|   16 | src/games/kwatro-sinko/rules.ts       |
|   15 | src/games/hex/rules.ts                |
|   14 | src/core/expressions/evaluator.ts     |
|   14 | src/games/sum-dominoes/rules.ts       |
|   11 | src/games/stars-bars/rules.ts         |
|    9 | src/games/calla/rules.ts              |
|    7 | src/core/expressions/expression-ui.ts |
|    7 | src/core/timer-scoring.ts             |

**Clearable triage pointer (matches stale backlog):** `src/core/polyomino/placement.ts` still holds nnnull **3** (clearable helper; backlog sole nnnull owner `q-mp-449`). Board-a11y nnnull **5** is gone (already folded via `#916`/`q-mp-424`).

### `@typescript-eslint/prefer-nullish-coalescing` (65) — densest files

| Hits | File                                            |
| ---: | ----------------------------------------------- |
|    9 | src/core/owl/owl-messages.ts                    |
|    5 | src/core/dice/dice-selector.ts                  |
|    5 | src/core/owl/owl-events.ts                      |
|    3 | src/ui/game-route-mounts.ts                     |
|    2 | src/core/owl/ollie-inspect-map.ts               |
|    2 | src/core/owl/owl-system.ts                      |
|    2 | src/games/kings-quadraphages/game-controller.ts |
|    2 | src/games/sum-dominoes/rules.ts                 |
|    2 | src/ui/three/prime-gold-board-3d.ts             |
|    2 | src/ui/three/tablet-gl.ts                       |

Nullish remains HELD — do not clear from this snapshot ticket.

## Hard-rule notes

- Report-only: docs + JSON data + SVG chart. No ceiling writes. No `src/` / test edits.
- Do not clear debt in `*/rules.ts`, AI search/scoring/difficulty/timing paths, or player-facing copy from this snapshot alone.
- Hex Hard stays **450ms** with real time; no Stars & Bars history cap.
- Ratchets only go down (elsewhere); this PR does not touch ceilings.

## Verification (local)

```bash
git rev-parse HEAD   # tip base before branch commit: 9b19c5e8cd3cd714d745540539324766369a8688
npm run report:lint-buckets -- --top 30
npm run lint:ratchet
npm run check:dev-docs
```
