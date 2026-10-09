# AI timing flake inventory — 2026-10-09

**Task id:** `q-mp-151` (P1, report-only)  
**Tip base:** `cursor/mp-tip-post477` @ `65832734`  
**Deliverable:** this doc only (no `src/` / test / CI threshold changes)

## Scope and hard rules

Inventory of unit flakes that **failed then passed on retrigger** overnight Oct 9, focused on AI calibration / determinism / move-time benches. Proposals are **TEST-HARNESS-ONLY** (isolation, per-file vitest `retry`, separate pool, CI-only longer `testTimeout` / `hookTimeout`). Explicit non-goals:

- No AI search / scoring / difficulty / timing behavior changes
- No loosening of `HARD_FLAG_MS = 500` or Hex Hard **450ms** (`src/games/hex/ai.ts` `AI_PLAY_DEADLINE_MS.hard === 450`; asserted in `tests/unit/ai-hard-midgame-identity.test.ts`)
- No Stars & Bars history-cap work
- No player-facing copy / rules-text edits
- No changes under `*/rules.ts`, legal-move, or scoring paths

## Duplicate check (open tip drafts)

Scanned open drafts into `cursor/mp-tip-post477` before starting. Closest neighbors:

| PR | Title | Overlap |
| --- | --- | --- |
| [#642](https://github.com/fuzzywigg/math-pentathlon/pull/642) | q-mp-117 isolate ui-helper-dedupe generation-timeout flake | Different flake (RAF/generation gate); already harness-fixed |
| [#658](https://github.com/fuzzywigg/math-pentathlon/pull/658) | q-mp-063 Unit-suite CI headroom | Fixtures/virtual clocks; does not inventory overnight AI flakes |
| [#556](https://github.com/fuzzywigg/math-pentathlon/pull/556) / `docs/flake-rate-wave5-2026-10-08.md` | Prior flake-rate table | Older wave5; does not cover Oct 9 PR set |

No open draft already owns `q-mp-151` / `ai-timing-flake-inventory-2026-10-09.md`.

## Method

### GitHub Actions evidence

Pulled failed `unit` job logs + check-run annotations for tip drafts that failed overnight then went green on retrigger / later SHA:

| PR | Failed run | Later green | Failure (annotation / log) |
| --- | --- | --- | --- |
| [#653](https://github.com/fuzzywigg/math-pentathlon/pull/653) | [37912085506](https://github.com/fuzzywigg/math-pentathlon/actions/runs/37912085506) | [37913429730](https://github.com/fuzzywigg/math-pentathlon/actions/runs/37913429730) | queens-guards calibration assertion |
| [#660](https://github.com/fuzzywigg/math-pentathlon/pull/660) | [37917221302](https://github.com/fuzzywigg/math-pentathlon/actions/runs/37917221302) | [37918372927](https://github.com/fuzzywigg/math-pentathlon/actions/runs/37918372927) / [37920273961](https://github.com/fuzzywigg/math-pentathlon/actions/runs/37920273961) | queens-guards determinism 180s timeout |
| [#656](https://github.com/fuzzywigg/math-pentathlon/pull/656) | [37914694241](https://github.com/fuzzywigg/math-pentathlon/actions/runs/37914694241), [37915670722](https://github.com/fuzzywigg/math-pentathlon/actions/runs/37915670722), [37917768014](https://github.com/fuzzywigg/math-pentathlon/actions/runs/37917768014) | [37918771772](https://github.com/fuzzywigg/math-pentathlon/actions/runs/37918771772)+ | det timeout → pent hook → calibration (same PR, successive SHAs) |
| [#652](https://github.com/fuzzywigg/math-pentathlon/pull/652) | [37911853866](https://github.com/fuzzywigg/math-pentathlon/actions/runs/37911853866) | [37913696783](https://github.com/fuzzywigg/math-pentathlon/actions/runs/37913696783) | pent-em-in `beforeAll` hook 30s timeout |
| [#632](https://github.com/fuzzywigg/math-pentathlon/pull/632) / [#662](https://github.com/fuzzywigg/math-pentathlon/pull/662) | GHA `unit` green (`CI=1` skips move-time bench) | — | Failures recorded in PR verification under local `npm run test:unit:coverage` (no `CI`) |

Also seen same signatures earlier Oct 9: determinism timeout on [#629](https://github.com/fuzzywigg/math-pentathlon/pull/629) [37886254762](https://github.com/fuzzywigg/math-pentathlon/actions/runs/37886254762); pent hook on [#639](https://github.com/fuzzywigg/math-pentathlon/pull/639) [37893377717](https://github.com/fuzzywigg/math-pentathlon/actions/runs/37893377717).

### Local measurement (N≥20, CI-like load)

Host: 4-vCPU cloud agent. Artifacts under `/opt/cursor/artifacts/ai-timing-flake/`.

| Suite | Command shape | N | Failures |
| --- | --- | --- | --- |
| A. Calibration alone + CPU burn | `CI=1 npx vitest run --project unit-node tests/unit/ai-calibration-difficulty-order.test.ts -t queens-guards` | 25 | **0/25** |
| B. Calibration + vitest competitor | same under concurrent unit-node AI shards | 20 | **0/20** |
| C. queens-guards determinism + competitor / `taskset -c 0` | shard-d `-t queens-guards.*determinism` | 20 | **0/20** (~65–69s; CI fail wall was ≥180s) |
| D. AI cluster (shards a–e + calibration) + shared competitor | `CI=1` multi-file unit-node | 20 | **0/20** (~160–189s wall) |
| E. Move-time bench alone (no `CI`, 2-core burn) | `npx vitest run --project unit-shared tests/unit/ai-move-time-midgame.bench.test.ts` | 20 | **0/20** |
| F. **Coverage cluster** (no `CI`) | `npx vitest run --coverage` shards a/c/d/e + calibration + `ai-move-time-midgame.bench.test.ts` | 20 | **20/20** hardFlags; **1/20** fab quality timeout |

Coverage-cluster flag histogram (console `<< FLAG` on Hard p95): `fab-a-diffy` 20/20, `fiar` 20/20, `queens-guards` 20/20 (excluded from `hardFlags` expect), `pent-em-in` 1/20.

## Flake inventory

### 1. queens-guards AI calibration order (assertion)

| Field | Detail |
| --- | --- |
| **Test** | `tests/unit/ai-calibration-difficulty-order.test.ts` → `AI calibration — Hard >= Easy win rate vs random` → `queens-guards: Hard win rate >= Easy on seeded sample` |
| **Failure mode** | `AssertionError: queens-guards: Easy=100.0% Hard=75.0% (n=4): expected 0.75 to be greater than or equal to 1` under `CALIBRATION_WALL_CLOCK=1` + `deadlineMs: 120` (`SEARCH_BUDGET['queens-guards']`) |
| **CI evidence** | [#653 run 37912085506](https://github.com/fuzzywigg/math-pentathlon/actions/runs/37912085506) (annotation on `ai-calibration-difficulty-order.test.ts:68`); [#656 run 37917768014](https://github.com/fuzzywigg/math-pentathlon/actions/runs/37917768014). Both PRs later green on retrigger / newer SHA |
| **Local rate** | **0/25** alone under CPU burn; **0/20** under vitest competitor; **0/20** inside AI cluster. Not reproduced on this host (GHA wall-clock truncation + n=4 is rarer here) |
| **Harness-only proposal** | Prefer **virtual-clock / seeded-only** path for this order guard (drop wall-clock for queens-guards only), **or** file/case `retry: 2` under `CI`, **or** isolate the calibration file in `unit-isolated` / single-worker pool so deadline truncation is not contended. Do **not** lower Hard≥Easy semantics via AI retune; `fab-a-diffy`/`fiar` already sit in `KNOWN_TIP_INVERSIONS` — do not add queens-guards there without owner call |

### 2. queens-guards AI determinism timeout

| Field | Detail |
| --- | --- |
| **Test** | `tests/unit/ai-determinism-shard-d.test.ts` → `queens-guards` → `determinism: fixed seed → same move on 50 mid-game states × difficulties` (`ai-determinism-harness.ts` `it(..., 180_000)`) |
| **Failure mode** | `Error: Test timed out in 180000ms` while peer shards still running; CI pass timings for the same case often sit at **~130–160s**, so 180s has thin headroom on GHA |
| **CI evidence** | [#660 run 37917221302](https://github.com/fuzzywigg/math-pentathlon/actions/runs/37917221302) (`186700ms`); [#656 run 37914694241](https://github.com/fuzzywigg/math-pentathlon/actions/runs/37914694241) (`182325ms`); also [#629 run 37886254762](https://github.com/fuzzywigg/math-pentathlon/actions/runs/37886254762). Retriggers / later SHAs green |
| **Local rate** | **0/20** isolated under contention (~66s); **0/20** AI cluster. Host is faster than GHA; timeout margin not exhausted locally |
| **Harness-only proposal** | **CI-only** raise that case’s `testTimeout` (e.g. 180s → 300s) **or** give shard-d its own vitest project/`pool` with `maxWorkers: 1` so queens-guards does not share a thread with shard-a/c/e. Optional per-file `retry: 1` as safety net. No AI deadline / depth changes |

### 3. pent-em-in determinism `beforeAll` hook timeout (#652 unit flake)

| Field | Detail |
| --- | --- |
| **Test** | `tests/unit/ai-determinism-shard-c.test.ts` → `pent-em-in` suite → `beforeAll` in `describeHarness` (`ai-determinism-harness.ts:69`, `collectStates(MIDGAME_SAMPLES=50, ...)`) |
| **Failure mode** | `Error: Hook timed out in 30000ms` (project default `hookTimeout: 30_000` in `vitest.config.ts`). Suite then shows other cases skipped/short |
| **CI evidence** | [#652 run 37911853866](https://github.com/fuzzywigg/math-pentathlon/actions/runs/37911853866); [#656 run 37915670722](https://github.com/fuzzywigg/math-pentathlon/actions/runs/37915670722); [#639 run 37893377717](https://github.com/fuzzywigg/math-pentathlon/actions/runs/37893377717). Later green |
| **Local rate** | **0/20** inside AI cluster (hook finishes under load on this host) |
| **Harness-only proposal** | Per-file / per-describe **`hookTimeout` raise (CI-only)** for shard-c (e.g. 30s → 120s), **or** precompute mid-game fixtures so `beforeAll` is I/O-light, **or** isolate shard-c to a single-worker pool. Prefer fixture isolation over global hookTimeout |

### 4. fab-a-diffy quality / determinism timeout under `test:unit:coverage`

| Field | Detail |
| --- | --- |
| **Test** | `tests/unit/ai-determinism-shard-a.test.ts` → `fab-a-diffy` → `quality: easy/medium differ from hard vs oracle` (180s cap via harness) |
| **Failure mode** | `Test timed out in 180000ms` when V8 coverage instrumentation + parallel AI benches inflate wall time. GHA `unit` job runs `npm run test:unit` with `CI=1` (bench skipped) — flake surfaces on **local/full coverage** verification |
| **Evidence** | [#632 PR body](https://github.com/fuzzywigg/math-pentathlon/pull/632) (`npm run test:unit:coverage`: shard-a fab quality timed out); local coverage-cluster **1/20** (`/opt/cursor/artifacts/ai-timing-flake/coverage-cluster-n20.jsonl` i=10) |
| **Local rate** | **1/20** under coverage cluster; **0/20** AI cluster without coverage |
| **Harness-only proposal** | Under coverage (`process.env.VITEST_COVERAGE` / detect `--coverage`): **longer CI-or-coverage-only timeout** on shard-a quality, **or** `retry: 1` on that file, **or** run shard-a in a separate pool without the move-time bench. Do not change fab search / oracle |

### 5. fab-a-diffy / fiar move-time `hardFlags` under `test:unit:coverage`

| Field | Detail |
| --- | --- |
| **Test** | `tests/unit/ai-move-time-midgame.bench.test.ts` → `measures p50/p95 and writes docs/ai-move-time-2026-10-07.md` → `expect(hardFlags).toEqual([])` with `HARD_FLAG_MS = 500` (queens-guards excluded) |
| **Failure mode** | Hard p95 > 500ms for **fab-a-diffy** and **fiar** (and often queens-guards in logs) when bench runs **without** `CI` alongside coverage + other AI files. File already `describe.skipIf(!!process.env.CI)` for GHA unit |
| **Evidence** | [#632 PR body](https://github.com/fuzzywigg/math-pentathlon/pull/632); [#662 PR body](https://github.com/fuzzywigg/math-pentathlon/pull/662) (`hardFlags: fab-a-diffy + fiar`); local coverage-cluster **20/20** with flags `fab-a-diffy`+`fiar` every run |
| **Local rate** | **20/20** fail under coverage cluster; **0/20** bench-alone (no coverage / light burn) |
| **Harness-only proposal** | Keep `HARD_FLAG_MS = 500` and Hex **450ms**. Restore **report-only / soft assert when coverage or full-suite contention** (pattern previously discussed as `strictHardFlags` / `AI_BENCH_STRICT=1` for direct invocation only), **or** `describe.skipIf` when coverage is active, **or** isolate the bench file to its own project with `maxWorkers: 1` and no sibling AI shards. Do **not** raise the 500ms flag threshold |

## Summary table

| # | Test | Mode | CI / PR evidence | Local fail rate | Harness-only fix (preferred) |
| --- | --- | --- | --- | --- | --- |
| 1 | queens-guards calibration Hard≥Easy | wall-clock n=4 inversion | #653, #656 | 0/20–25 (not repro here) | virtual clock or `retry` / isolate file |
| 2 | queens-guards determinism | 180s test timeout | #660, #656, #629 | 0/20 | CI-only longer timeout or shard-d single-worker pool |
| 3 | pent-em-in `beforeAll` | 30s hook timeout | #652, #656, #639 | 0/20 | CI-only `hookTimeout` or fixture precompute / isolate shard-c |
| 4 | fab-a-diffy quality | 180s under coverage | #632 body + 1/20 local | **1/20** coverage-cluster | coverage-aware timeout / retry / separate pool |
| 5 | fab/fiar hardFlags | p95>500 under coverage | #632/#662 bodies + 20/20 local | **20/20** coverage-cluster | skip or soft-assert under coverage; keep 500ms / Hex 450ms |

## Out of scope / confirmed unchanged

- Hex `AI_PLAY_DEADLINE_MS.hard` remains **450**
- `HARD_FLAG_MS` remains **500**
- No Stars & Bars history-cap edits
- No `src/` AI or rules changes in this task

## Next action: fold into tip by the tip owner
