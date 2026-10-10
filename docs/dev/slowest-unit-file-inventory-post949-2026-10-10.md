# Slowest unit-file inventory — post949 task remasured on tip post977 (2026-10-10)

**Task id:** `q-mp-573` (P3, report-only)  
**Tip audited:** `cursor/mp-tip-post977` @ `67cc7802` (full `67cc780249cafd02a336ca5fba91e3b67479ade6`)  
**Backlog stamp:** `q-mp-573` named tip post949 @ `d7a3989a` (**3280** / **13410**) — that tip is **merged** into alpha via `#977`; this sibling remasures on the live tip head  
**Deliverable:** this sibling doc + optional visual/JSON (no `src/`, test, ratchet, wiki wall-budget, or CI workflow edits)

Visual: [`slowest-unit-file-inventory-post949-2026-10-10.svg`](./slowest-unit-file-inventory-post949-2026-10-10.svg).  
Machine-readable twin: [`slowest-unit-file-inventory-post949-2026-10-10.json`](./slowest-unit-file-inventory-post949-2026-10-10.json).

## Purpose

Refresh the file-level duration ranking for the Vitest unit suite after tip growth past prior inventories (post914 / [#956](https://github.com/fuzzywigg/math-pentathlon/pull/956) `q-mp-460` stamped **3242** files). Orthogonal to the **unit wall-budget** series (`q-mp-561` / open [#1011](https://github.com/fuzzywigg/math-pentathlon/pull/1011) `q-mp-541`) — that page owns job wall; **this page owns per-file seconds**.

## Hard-rule HOLD (explicit)

Workers following this inventory must **not**:

- Change AI search, scoring, difficulty, or move timing
- Touch Hex Hard play deadline (**450ms** stays) — live pin `src/games/hex/ai.ts` `hard: 450`; characterization `tests/unit/ai-hard-midgame-identity.test.ts` `expect(HEX_MS.hard).toBeLessThanOrEqual(450)`
- Edit `*/rules.ts`, legal-move, or scoring paths
- Add Stars & Bars history caps
- Enable the two AI benches under `CI=1` (`tablet-ai-hard-latency.bench`, `ai-move-time-midgame.bench`) — see [`ai-timing-ci-skip-inventory-2026-10-09.md`](./ai-timing-ci-skip-inventory-2026-10-09.md)
- Assert or loosen AI-timing / scoring thresholds while chasing suite wall time
- Edit wiki wall-budget cells owned by the CI unit-wall series (`q-mp-561` / [#1011](https://github.com/fuzzywigg/math-pentathlon/pull/1011))

Hygiene proposals below are **TEST-HARNESS-ONLY** (file splits, project/pool isolation, `retry` under CI, optional `maxWorkers` experiments). No product or AI deadline edits.

## Duplicate check (open tip drafts)

| Related draft / prior                                                                                                                                           | Overlap                                                         | Action                                                                      |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------- | --------------------------------------------------------------------------- |
| [#1009](https://github.com/fuzzywigg/math-pentathlon/pull/1009) `q-mp-090s` backlog 10s                                                                         | Defines this task; does not ship the inventory                  | Leave open                                                                  |
| [#956](https://github.com/fuzzywigg/math-pentathlon/pull/956) / [`slowest-unit-file-inventory-2026-10-10c.md`](./slowest-unit-file-inventory-2026-10-10c.md) | Prior tip post914 stamp (**3242** @ `e43a25d2`)                 | **contained** — leave open; this sibling refreshes for post977              |
| [#891](https://github.com/fuzzywigg/math-pentathlon/pull/891) / [`slowest-unit-file-inventory-2026-10-10b.md`](./slowest-unit-file-inventory-2026-10-10b.md) | Prior tip post865 stamp (**3210** @ `3908809d`)                 | **contained** — leave open                                                  |
| [#849](https://github.com/fuzzywigg/math-pentathlon/pull/849) / [`slowest-unit-file-inventory-2026-10-10.md`](./slowest-unit-file-inventory-2026-10-10.md)   | Prior tip post785 stamp (**3182** @ `c9b55cff`)                 | **contained** — leave open                                                  |
| [#811](https://github.com/fuzzywigg/math-pentathlon/pull/811) / [`slowest-unit-file-inventory-2026-10-09.md`](./slowest-unit-file-inventory-2026-10-09.md)   | Prior tip post755 stamp (**3163** @ `02af5c56`)                 | **contained** — leave open                                                  |
| [#934](https://github.com/fuzzywigg/math-pentathlon/pull/934) `q-mp-090o` backlog (defines `q-mp-460`)                                                          | Older backlog only                                              | **contained** — leave open                                                  |
| [#1011](https://github.com/fuzzywigg/math-pentathlon/pull/1011) `q-mp-541` / backlog `q-mp-561` CI unit wall                                                    | Job wall + AI-bench skip smoke                                  | Narrative sibling; keep this file-level                                     |
| Open drafts into `cursor/mp-tip-post977` at measure                                                                                                             | _(none)_                                                        | No competing slowest-file inventory                                         |

No open draft already owns `q-mp-573` / `slowest-unit-file-inventory-post949-2026-10-10.md` → full task proceeds.

## Method

### Suite size (tip `67cc7802`)

| Metric                                  |                                         Count | How                                                                                                      |
| --------------------------------------- | --------------------------------------------: | -------------------------------------------------------------------------------------------------------- |
| Unit files (excl. `_tokenmaxx_archive`) |                                      **3280** | `find tests/unit \( -name '*.test.ts' -o -name '*.spec.ts' \) ! -path '*/_tokenmaxx_archive/*' \| wc -l` |
| Cases listed (`npx vitest list`)        |                                     **13408** | tip HEAD `67cc7802`                                                                                      |
| Files reported by Vitest under `CI=1`   |    **3278** passed / **2** skipped (**3280**) | Local measure on `67cc7802`                                                                              |
| Cases (Vitest summary)                  | **13396** passed / **62** skipped (**13458**) | Local measure on `67cc7802`                                                                              |

Backlog `q-mp-573` evidence (**3280** / **13410** @ post949 `d7a3989a`) matches live **file** count; listed/run case totals on post977 are **13408** / **13458** (host/runner + skip accounting).

### Before → after (inventory stamps)

| Stamp                                                                                             | Tip / SHA           | Unit files | Vitest cases (run) | Wall Duration | Reported tests time | Top-20 sum |
| ------------------------------------------------------------------------------------------------- | ------------------- | ---------: | -----------------: | ------------: | ------------------: | ---------: |
| Prior [#849](https://github.com/fuzzywigg/math-pentathlon/pull/849) `2026-10-10`                  | post785 `c9b55cff`  |   **3182** |          **12522** |       157.63s |             385.27s |     315.1s |
| Prior [#891](https://github.com/fuzzywigg/math-pentathlon/pull/891) `2026-10-10b`                 | post865 `3908809d`  |   **3210** |          **12804** |       185.55s |             416.51s |     341.5s |
| Prior [#956](https://github.com/fuzzywigg/math-pentathlon/pull/956) `2026-10-10c`                 | post914 `e43a25d2`  |   **3242** |          **13111** |       150.28s |             386.97s |     308.9s |
| This refresh `post949-2026-10-10` (on post977)                                                    | post977 `67cc7802`  |   **3280** |          **13458** |       258.24s |             604.03s |     488.6s |

Host/runner variance dominates absolute seconds; rankings (AI shards + calibration first) are the durable signal.

### Primary: local tip run (`CI=1`, full unit job shape)

Host: cloud agent. Command (same script CI uses — **not** `--project unit-shared` alone; nearly all of the top-N live in `unit-node`):

```bash
git rev-parse HEAD   # 67cc780249cafd02a336ca5fba91e3b67479ade6
CI=1 npm run test:unit -- --reporter=default
# Test Files  3278 passed | 2 skipped (3280)
# Tests       13396 passed | 62 skipped (13458)
# Duration    258.24s (transform 24.25s, setup 8.49s, import 30.53s, tests 604.03s, environment 1569.75s)
```

Per-file durations parsed from Vitest default file lines (`✓ |project| path (N tests) Xms`). Artifact: `/opt/cursor/artifacts/q-mp-573-local-file-durations.json` (3278 passed-file rows).

AI benches skipped under `CI=1` (same HOLD as wall-budget page):

```text
↓ |unit-isolated| tests/unit/tablet-ai-hard-latency.bench.test.ts (10 tests | 10 skipped)
↓ |unit-shared| tests/unit/ai-move-time-midgame.bench.test.ts (1 test | 1 skipped)
```

## Top 20 slowest unit files (local tip `67cc7802`, `CI=1`)

Sum of top-20 file durations: **488.6s** of **604.03s** reported test time (**80.9%**).

| Rank | File                                          | Project         | Local CI=1 (s) | Tests | Hygiene note                                                                    |
| ---: | --------------------------------------------- | --------------- | -------------: | ----: | ------------------------------------------------------------------------------- |
|    1 | `ai-determinism-shard-d.test.ts`              | `unit-node`     |         132.85 |     8 | **HOLD** — AI determinism; harness-only pool/timeout only (see flake inventory) |
|    2 | `ai-determinism-shard-e.test.ts`              | `unit-node`     |          86.56 |    10 | **HOLD** — AI determinism                                                       |
|    3 | `ai-determinism-shard-a.test.ts`              | `unit-node`     |          79.56 |     8 | **HOLD** — AI determinism                                                       |
|    4 | `ai-determinism-shard-c.test.ts`              | `unit-node`     |          45.82 |     8 | **HOLD** — AI determinism                                                       |
|    5 | `ai-calibration-difficulty-order.test.ts`     | `unit-node`     |          34.46 |    20 | **HOLD** — AI calibration; no scoring/difficulty retune                         |
|    6 | `state-roundtrip-fuzz.test.ts`                | `unit-node`     |          27.38 |    22 | Split by game/engine or property-count shards (harness only)                    |
|    7 | `engine-property-invariants.test.ts`          | `unit-node`     |          16.00 |    32 | Shard invariants by game family (harness only)                                  |
|    8 | `existing-games-controllers.test.ts`          | `unit-isolated` |          11.25 |    67 | Split by game controller (already `unit-isolated`)                              |
|    9 | `burn-wave12-win-draw-ai.test.ts`             | `unit-node`     |           7.51 |    19 | **HOLD** — AI win/draw surface                                                  |
|   10 | `ai-determinism-shard-b.test.ts`              | `unit-node`     |           6.71 |     8 | **HOLD** — AI determinism                                                       |
|   11 | `queens-hex-ai-play-deadline.test.ts`         | `unit-node`     |           5.59 |     9 | **HOLD** — play-deadline characterization; Hex Hard **450ms** untouched         |
|   12 | `burn-1008-registry-module-contract.test.ts`  | `unit-isolated` |           5.18 |   129 | Split registry contract by domain (already isolated)                            |
|   13 | `burn-wave9-win-draw-ai.test.ts`              | `unit-node`     |           5.12 |    24 | **HOLD** — AI win/draw surface                                                  |
|   14 | `burn-wave16-ai-null-gates.test.ts`           | `unit-node`     |           4.44 |    19 | **HOLD** — AI null-gate surface                                                 |
|   15 | `burn-wave11-win-draw-ai.test.ts`             | `unit-node`     |           4.28 |    18 | **HOLD** — AI win/draw surface                                                  |
|   16 | `mp3d-queens-guards-board-select.test.ts`     | `unit-isolated` |           4.09 |     6 | Already isolated; thinner select/lifecycle shards (harness only)                |
|   17 | `burn-wave10-win-draw-ai.test.ts`             | `unit-node`     |           3.29 |    17 | **HOLD** — AI win/draw surface                                                  |
|   18 | `mp3d-prime-gold-full-game-ai.test.ts`        | `unit-isolated` |           3.22 |     3 | **HOLD** — AI full-game surface; no timing retune                               |
|   19 | `burn-wave16-ai-pipeline.test.ts`             | `unit-node`     |           2.81 |    23 | **HOLD** — AI pipeline surface                                                  |
|   20 | `burn-wave41-pent-ai-difficulties.test.ts`    | `unit-node`     |           2.48 |     8 | **HOLD** — AI difficulty surface                                                |

Paths are under `tests/unit/` (basename shown for width).

### Rank delta vs `2026-10-10c` inventory (same basenames)

| Signal                   | Notes                                                                                                                          |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------ |
| Top-5 composition        | Still AI determinism shards + calibration (order: d → e → a → **c** → calib; shard-c above calib vs post914)                   |
| Non-HOLD harness targets | Still: `state-roundtrip-fuzz`, `engine-property-invariants`, `existing-games-controllers`, registry contract                   |
| New in top-20            | `burn-wave10-win-draw-ai`, `mp3d-prime-gold-full-game-ai`, `burn-wave16-ai-pipeline`                                           |
| Dropped from top-20      | `fab-a-diffy-ai-play-deadline`, `burn-wave27-seat-handoff-core`, `burn-1007-main-shell-routes`                                 |

### Bar visual — local top 20 (seconds)

```mermaid
xychart-beta
  title "Top 20 unit files — local CI=1 tip 67cc7802 (seconds)"
  x-axis ["shard-d", "shard-e", "shard-a", "shard-c", "calib", "roundtrip", "invariants", "controllers", "w12-ai", "shard-b", "qh-deadline", "registry", "w9-ai", "w16-null", "w11-ai", "qg-select", "w10-ai", "prime-gold", "w16-pipe", "w41-diff"]
  y-axis "seconds" 0 --> 140
  bar [133, 87, 80, 46, 34, 27, 16, 11, 8, 7, 6, 5, 5, 4, 4, 4, 3, 3, 3, 2]
```

### Concentration (local)

```mermaid
pie title Top-20 share of reported test time (local CI=1)
  "Top 5 AI shards+calib (379.3s)" : 379
  "Other top-20 (109.3s)" : 109
  "Files outside top-20 (115.4s)" : 115
```

## Recommended harness hygiene (no AI-timing / Hex Hard edits)

Priority is **non-HOLD** files first; AI ranks 1–5 dominate wall but are already covered by flake / CI-skip inventories and must not be “fixed” by raising deadlines.

1. **`state-roundtrip-fuzz.test.ts` (~27s local)** — split into per-game or N-case shards under `unit-node` so one slow engine does not serialize the whole file.
2. **`engine-property-invariants.test.ts` (~16s)** — same pattern: shard by game family; keep property asserts; do not touch rules/scoring implementations.
3. **`existing-games-controllers.test.ts` (~11s, already `unit-isolated`)** — split by controller/game to cut isolate cost and improve parallel fill.
4. **`burn-1008-registry-module-contract.test.ts` (129 tests, ~5s)** — domain splits for maintainability more than wall; already isolated.
5. **`mp3d-queens-guards-board-select.test.ts` (~4s)** — optional thinner select/lifecycle shards; harness only.
6. **AI determinism / calibration / play-deadline / win-draw files** — **HOLD**. If GHA headroom tightens, prefer harness-only moves already listed in [`ai-timing-flake-inventory-2026-10-09.md`](./ai-timing-flake-inventory-2026-10-09.md) (per-file `retry`, dedicated pool/`maxWorkers: 1`, CI-only longer `testTimeout`). Do **not** change Hex Hard **450ms**, `HARD_FLAG_MS`, or scoring asserts. Do **not** remove `describe.skipIf(!!process.env.CI)` on the two AI latency benches.

## Why not `--project unit-shared` alone?

Backlog verify sketch mentions suite size + Hex Hard + `check:dev-docs`. On tip, **0 of the top-20** files are in `unit-shared` (they are `unit-node` / `unit-isolated`). Measuring only `unit-shared` would miss the real wall contributors. Inventory therefore uses the full unit job (`npm run test:unit` / all three projects), matching CI.

## Hex Hard pin (untouched)

```text
$ rg -n 'hard:\s*450' src/games/hex/ai.ts
21:  hard: 450,

$ rg -n 'toBeLessThanOrEqual\(450\)' tests/unit/ai-hard-midgame-identity.test.ts
63:    expect(HEX_MS.hard).toBeLessThanOrEqual(450);
```

## Related

- Prior inventory (post914): [`docs/dev/slowest-unit-file-inventory-2026-10-10c.md`](./slowest-unit-file-inventory-2026-10-10c.md)
- Prior inventory (post865): [`docs/dev/slowest-unit-file-inventory-2026-10-10b.md`](./slowest-unit-file-inventory-2026-10-10b.md)
- Prior inventory (post785): [`docs/dev/slowest-unit-file-inventory-2026-10-10.md`](./slowest-unit-file-inventory-2026-10-10.md)
- Prior inventory (post755): [`docs/dev/slowest-unit-file-inventory-2026-10-09.md`](./slowest-unit-file-inventory-2026-10-09.md)
- Unit wall budget (wiki): [`docs/wiki/ci-unit-budget.md`](../wiki/ci-unit-budget.md)
- AI-timing CI-skip HOLD: [`docs/dev/ai-timing-ci-skip-inventory-2026-10-09.md`](./ai-timing-ci-skip-inventory-2026-10-09.md)
- AI flake inventory: [`docs/dev/ai-timing-flake-inventory-2026-10-09.md`](./ai-timing-flake-inventory-2026-10-09.md)

## Verify (this PR)

```bash
find tests/unit \( -name '*.test.ts' -o -name '*.spec.ts' \) ! -path '*/_tokenmaxx_archive/*' | wc -l   # 3280
npx vitest list | wc -l   # 13408
rg -n 'hard:\s*450' src/games/hex/ai.ts
npm run check:dev-docs
npm run verify
npm run test:unit
```
