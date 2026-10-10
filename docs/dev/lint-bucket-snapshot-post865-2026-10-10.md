# Lint-bucket measured snapshot — tip post865 (2026-10-10)

**Task id:** `q-mp-416`  
**Role:** worker (docs / chart only)  
**Tip measured:** `cursor/mp-tip-post865` @ `7f8a7147` (`7f8a71471306af2143c6de0b43564d6c146e2719`)  
**Measured at:** `2026-10-10T06:24:00Z` (UTC)  
**Helper:** [`lint-bucket-report.md`](./lint-bucket-report.md) (`npm run report:lint-buckets`, `q-mp-280` helper **contained** on tip)  
**Data:** [`lint-bucket-snapshot-post865-2026-10-10.json`](./lint-bucket-snapshot-post865-2026-10-10.json)  
**Chart:** ![lint-bucket focus bars @ post865](./lint-bucket-snapshot-post865-2026-10-10.svg)

## Purpose

Backlog `q-mp-416` (spec in draft [#897](https://github.com/fuzzywigg/math-pentathlon/pull/897) Oct 10d backlog, not yet on tip) asked for a dated tip snapshot at post865 ceilings. Stale backlog evidence listed void **58** / dup **42** / shadow **3** / nnnull **246** / nullish **65** and noted densest clearable residuals (pointer-hygiene void **1**, board-a11y nnnull **5**). Prior dated snapshot stamps post830 (`q-mp-364` @ `97487de6`). Re-measure on the live tree; commit report-only docs + chart. **No** `lint-ratchet-ceilings.json` edits. **No** `src/` / test behavior changes.

## Duplicate check (open drafts)

| PR                                                            | Title                                             | Overlap                                                                                  |
| ------------------------------------------------------------- | ------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| [#897](https://github.com/fuzzywigg/math-pentathlon/pull/897) | `q-mp-090m` backlog 10d                           | Spec owner only (lists `q-mp-416`); no snapshot files                                    |
| [#883](https://github.com/fuzzywigg/math-pentathlon/pull/883) | `q-mp-390` eslint non-ceilinged residuals post865 | Orthogonal (non-ceilinged overlay); not a lint-bucket measured snapshot                  |
| [#880](https://github.com/fuzzywigg/math-pentathlon/pull/880) | `q-mp-395` reduced-motion void (−2)               | Code clear; **already on tip** @ `532eea21` — note live vs post-fold below               |
| [#877](https://github.com/fuzzywigg/math-pentathlon/pull/877) | `q-mp-366` owl-component void (−3)                | Code clear; **already on tip** @ `ac89d8b8` — note live vs post-fold below               |
| Older post830 snapshot `#863` / `q-mp-364`                    | prior tip base                                    | Superseded as the latest dated stamp by this post865 snapshot (leave open; do not close) |

No open draft into `cursor/mp-tip-post865` owned a post865 lint-bucket measured snapshot before this PR.

## Stale backlog → live tip (focus ceilings)

| Rule                                              | Stale backlog (`q-mp-416` / pre-fold 58) | Prior snapshot (post830 @ `97487de6`) | Live tip (`7f8a7147` / post865) | Δ vs stale |
| ------------------------------------------------- | ---------------------------------------: | ------------------------------------: | ------------------------------: | ---------: |
| `@typescript-eslint/no-confusing-void-expression` |                                       58 |                                **58** |                          **53** |     **−5** |
| `no-duplicate-imports`                            |                                       42 |                                **42** |                          **42** |          0 |
| `@typescript-eslint/no-shadow`                    |                                        3 |                                 **3** |                           **3** |          0 |
| `@typescript-eslint/no-non-null-assertion`        |                                      246 |                                   246 |                         **246** |          0 |
| `@typescript-eslint/prefer-nullish-coalescing`    |                                       65 |                                    65 |                          **65** |          0 |

Live ceilings come from [`lint-ratchet-ceilings.json`](./lint-ratchet-ceilings.json) notes (tip post865; owl −3 + reduced-motion −2 already folded on tip).

## Unfolded drafts `#877` / `#880` — live vs post-fold

Prompt notes both as unfolded drafts; live tip already contains their commits:

| Draft                                                             | Delta | Tip commit | On tip? | Effect on void |
| ----------------------------------------------------------------- | ----: | ---------- | ------- | -------------- |
| [#877](https://github.com/fuzzywigg/math-pentathlon/pull/877) owl |    −3 | `ac89d8b8` | **yes** | 58 → 55        |
| [#880](https://github.com/fuzzywigg/math-pentathlon/pull/880) RM  |    −2 | `532eea21` | **yes** | 55 → 53        |

| Scenario                                     | Void total / ceiling |
| -------------------------------------------- | -------------------: |
| Pre-fold tip / stale backlog / post830 stamp |          **58** / 58 |
| Live tip measured (`7f8a7147`)               |          **53** / 53 |
| Post-fold expected (58 − 3 − 2)              |          **53** / 53 |

Live == post-fold expected. Leave `#877` / `#880` open with **contained** (already on tip); do not close.

## Chart — focus metrics + void buckets

![q-mp-416 lint-bucket focus snapshot](./lint-bucket-snapshot-post865-2026-10-10.svg)

```text
void       █████████████████████████████████████████████████████  53 / 53
dup-import ██████████████████████████████████████████             42 / 42
no-shadow  ███                                                     3 /  3

void path buckets:
  src/ui/three  ████████████████████████████████████  34
  src/          ████████████                          12
  src/pwa       ████                                   4
  src/ui        ██                                     2
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
| `@typescript-eslint/no-non-null-assertion`        |        246 |     246 |        0 |
| `@typescript-eslint/no-confusing-void-expression` |     **53** |  **53** |        0 |
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
`npm run report:lint-buckets` currently omits `eqeqeq` from its probe overlay, so the helper prints `eqeqeq: 0 / ceiling 1`. This snapshot records the **ratchet** total for eqeqeq and the helper totals for every other rule. No script edit in this ticket (docs/chart only).

---

## Focus: `@typescript-eslint/no-confusing-void-expression` — 53 / 53

### Path buckets

| Hits | Bucket               |
| ---: | -------------------- |
|   34 | src/ui/three         |
|   12 | src/                 |
|    4 | src/pwa              |
|    2 | src/ui               |
|    1 | src/games/prime-gold |

### Densest files (top 16 = all residual files)

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
|    1 | src/ui/pointer-hygiene.ts                   |
|    1 | src/ui/stats-dashboard.ts                   |

**Clearable triage pointer (matches stale backlog):** `src/ui/pointer-hygiene.ts` still holds void **1**. Owl (`owl-component.ts`, −3) and reduced-motion (−2) are gone from the densest list (already folded). Do not touch AI / rules / scoring / Hex Hard **450ms**.

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

### `@typescript-eslint/no-non-null-assertion` (246) — densest files

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

**Clearable triage pointer (matches stale backlog):** `src/ui/board-a11y.ts` still holds nnnull **5** (outside the top-10 densest list above; present in the JSON densest-file map when `--top` ≥ file rank).

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
git rev-parse HEAD   # tip base before branch commit: 7f8a71471306af2143c6de0b43564d6c146e2719
npm run report:lint-buckets -- --top 30
npm run lint:ratchet
npm run check:dev-docs
```
