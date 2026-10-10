# Lint-bucket measured snapshot — tip post914 (2026-10-10)

**Task id:** `q-mp-491`  
**Role:** worker (docs / chart only)  
**Tip measured:** `cursor/mp-tip-post914` @ `e43a25d2` (`e43a25d22b081819664bc631e4fe34f793847004`)  
**Measured at:** `2026-10-10T09:52:17Z` (UTC)  
**Helper:** [`lint-bucket-report.md`](./lint-bucket-report.md) (`npm run report:lint-buckets`, `q-mp-280` helper **contained** on tip)  
**Data:** [`lint-bucket-snapshot-post914-2026-10-10.json`](./lint-bucket-snapshot-post914-2026-10-10.json)  
**Chart:** ![lint-bucket focus bars @ post914](./lint-bucket-snapshot-post914-2026-10-10.svg)

## Purpose

Backlog `q-mp-491` (spec in draft [#955](https://github.com/fuzzywigg/math-pentathlon/pull/955) Oct 10g backlog, not yet on tip) asked for a dated tip snapshot at post914 ceilings. Stale backlog evidence listed void **51** / nnnull **241** / nullish **65** / dup **42** / shadow **3** with `lint:ratchet` green. Prior dated snapshot stamps post898 (`q-mp-441` @ `9b19c5e8`, void **52** / nnnull **241**). Re-measure on the live tip head; commit report-only docs + chart. **No** `lint-ratchet-ceilings.json` edits. **No** `src/` / test behavior changes.

## Duplicate check (open drafts)

| PR                                                            | Title                                        | Overlap                                                                                 |
| ------------------------------------------------------------- | -------------------------------------------- | --------------------------------------------------------------------------------------- |
| [#955](https://github.com/fuzzywigg/math-pentathlon/pull/955) | `q-mp-090p` backlog 10g                      | Spec owner only (lists `q-mp-491`); no snapshot files                                   |
| [#928](https://github.com/fuzzywigg/math-pentathlon/pull/928) | `q-mp-441` lint-bucket snapshot post898      | Prior tip stamp — **already on tip** (void **52** era); leave open with **contained**   |
| [#910](https://github.com/fuzzywigg/math-pentathlon/pull/910) | `q-mp-416` lint-bucket snapshot post865      | Older tip stamp — leave open with **contained**                                         |
| [#944](https://github.com/fuzzywigg/math-pentathlon/pull/944) | `q-mp-464` eslint non-ceilinged residuals    | Orthogonal (non-ceilinged overlay); not a lint-bucket measured snapshot                 |
| [#796](https://github.com/fuzzywigg/math-pentathlon/pull/796) | `q-mp-280` lint-bucket report helper         | Helper already on tip; leave open with **contained**                                    |

No open draft into `cursor/mp-tip-post914` owned a post914 lint-bucket measured snapshot before this PR. Leave `#928` / `#910` / `#944` open with **contained** (do not close).

## Stale backlog → live tip (focus ceilings)

| Rule                                              | Stale backlog (`q-mp-491` @ post914) | Prior snapshot (post898 @ `9b19c5e8`) | Live tip (`e43a25d2` / post914) | Δ vs prior stamp |
| ------------------------------------------------- | -----------------------------------: | ------------------------------------: | ------------------------------: | ---------------: |
| `@typescript-eslint/no-confusing-void-expression` |                                   51 |                                **52** |                          **51** |           **−1** |
| `no-duplicate-imports`                            |                                   42 |                                **42** |                          **42** |                0 |
| `@typescript-eslint/no-shadow`                    |                                    3 |                                 **3** |                           **3** |                0 |
| `@typescript-eslint/no-non-null-assertion`        |                                  241 |                                   241 |                         **241** |                0 |
| `@typescript-eslint/prefer-nullish-coalescing`    |                                   65 |                                    65 |                          **65** |                0 |

Live ceilings come from [`lint-ratchet-ceilings.json`](./lint-ratchet-ceilings.json) notes (tip post914 inherits post898 min ceilings incl. q-mp-448 −1 stats-dashboard void). Backlog void **51** / nnnull **241** match live tip exactly.

## Tip folds since prior snapshot — live vs post-fold

| Draft / commit                                                  | Delta | Tip commit | On tip? | Effect       |
| --------------------------------------------------------------- | ----: | ---------- | ------- | ------------ |
| `q-mp-448` stats-dashboard void (folded via `#914` / post898)   |    −1 | `753052a6` | **yes** | void 52 → 51 |

| Scenario                                      | Void total / ceiling | Nnnull total / ceiling |
| --------------------------------------------- | -------------------: | ---------------------: |
| Prior post898 stamp (`q-mp-441` @ `9b19c5e8`) |          **52** / 52 |          **241** / 241 |
| Live tip measured (`e43a25d2`)                |          **51** / 51 |          **241** / 241 |
| Post-fold expected                            |          **51** / 51 |          **241** / 241 |

Live == post-fold expected. Leave `#928` open with **contained** (prior tip stamp); do not close.

## Chart — focus metrics + void buckets

![q-mp-491 lint-bucket focus snapshot](./lint-bucket-snapshot-post914-2026-10-10.svg)

```text
void       ███████████████████████████████████████████████████  51 / 51
dup-import ██████████████████████████████████████████            42 / 42
no-shadow  ███                                                    3 /  3
nnnull     ███████████████████████████████████████████████████  241 / 241

void path buckets:
  src/ui/three  ████████████████████████████████████  34
  src/          ████████████                          12
  src/pwa       ████                                   4
  prime-gold    █                                      1
```

## All ceilinged rules (live probe)

Commands:

```bash
npm run report:lint-buckets -- --top 40
npm run lint:ratchet
```

| Rule                                              | Live total | Ceiling | Headroom |
| ------------------------------------------------- | ---------: | ------: | -------: |
| `curly`                                           |        538 |     538 |        0 |
| `@typescript-eslint/no-non-null-assertion`        |    **241** | **241** |        0 |
| `@typescript-eslint/no-confusing-void-expression` |     **51** |  **51** |        0 |
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
`npm run report:lint-buckets` text/JSON mode currently prints `eqeqeq: 0 / ceiling 1`. This snapshot records the **ratchet** total for eqeqeq and the helper totals for every other rule. No script edit in this ticket (docs/chart only).

---

## Focus: `@typescript-eslint/no-confusing-void-expression` — 51 / 51

### Path buckets

| Hits | Bucket               |
| ---: | -------------------- |
|   34 | src/ui/three         |
|   12 | src/                 |
|    4 | src/pwa              |
|    1 | src/games/prime-gold |

### Densest files (top 14 = all residual files)

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

**Clearable triage pointer:** `src/ui/stats-dashboard.ts` void **1** is **gone** (cleared via `q-mp-448`, folded on tip). No remaining `src/ui` void bucket. Do not touch AI / rules / scoring / Hex Hard **450ms**.

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

**Clearable triage pointer:** `src/core/polyomino/placement.ts` still holds nnnull **3** (clearable helper). Stats-dashboard void residual is cleared.

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
git rev-parse HEAD   # tip base before branch commit: e43a25d22b081819664bc631e4fe34f793847004
npm run report:lint-buckets -- --top 40
npm run lint:ratchet
npm run check:dev-docs
```
