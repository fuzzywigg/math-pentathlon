# Unit suite flake hunt — 2026-10-07

## Scope

- Base tip: `cursor/overnight-fold-coverage-tip-460a` (#466)
- Run the full Vitest unit suite **10×** with `--sequence.shuffle` and distinct seeds
- Identify intermittent failures (pass in isolation / fail under shuffle)
- Fix **tests / helpers only** — no rules or scoring changes
- Draft PR only (never merge)

```bash
npx vitest run --sequence.shuffle --sequence.seed=<N>
# Concentrated shared-graph stress (surfaces isolate:false polluters):
npx vitest run --project unit-shared --sequence.shuffle --sequence.seed=<N> --maxWorkers=1
```

Artifacts: `/opt/cursor/artifacts/unit-flakes/`.

## Method

| Mode | Workers | Isolation (selector) | Runs / seeds |
| --- | --- | --- | --- |
| Full suite shuffle | default pool | on (tip) | 10 — `101…1010` |
| Full suite shuffle | default pool | **off** (causal) | 10 — `101…1010` |
| `unit-shared` shuffle | `--maxWorkers=1` | **off** | 10 — incl. `909/2002/404…` |
| `unit-shared` shuffle | `--maxWorkers=1` | on + helper fixes | 10 — same seeds |
| Solo repro | n/a | n/a | selector + owl victims |

## Before (flake counts)

### Default multi-worker full suite (tip as shipped)

| Metric | Result |
| --- | --- |
| Runs | 10 / 10 green |
| Failed tests | **0** |
| Known seeds `404/505/606/909` | green |

Multi-worker scheduling often puts `vi.mock(router)` victims and `restoreAllMocks` polluters on **different** workers, so the selector flake is rare here.

### Causal — selector **not** in `unit-isolated`, `--maxWorkers=1`

| Metric | Result |
| --- | --- |
| Runs with ≥1 failure | **8 / 10** |
| Fully green | 2 / 10 (`707`, `3333`) |
| `burn-wave24-stats-selector-ui` navigate | **8 / 10** |
| `overnight-wave55-core-owl-end-without-start` | **1 / 10** (seed `606`) |

Mini-suite (selector + known polluters, seed `909`/`2002`): selector navigate fails with `Number of calls: 0` while the same file passes alone.

## Flakes found

### 1. Game-selector `navigate` mock (ordering / shared graph)

- **File:** `tests/unit/burn-wave24-stats-selector-ui.test.ts`
- **Case:** `navigates available game cards via click and Enter/Space`
- **Symptom:** `navigate` expected `/game/<id>` but **0 calls**; passes in isolation
- **Root cause:** Under `isolate: false`, sibling `vi.restoreAllMocks()` tears down the hoisted `vi.mock('../../src/core/router')`. Concentrated under `--maxWorkers=1` + shuffle
- **Fix:** Keep file in `unit-isolated` (`vitest.config.ts`); replace `restoreAllMocks` with `clearAllMocks` in demo/AI polluter tests that share the router mock pattern; document in `tests/unit/setup.ts`

### 2. Owl `onGameEnd` without start — negative duration (shared state / timers)

- **File:** `tests/unit/overnight-wave55-core-owl-end-without-start.test.ts`
- **Symptom:** `expected -419 to be greater than or equal to 0` on `game:end` duration (seed `606`); passes alone
- **Root cause:** Module-private `owlSystem.gameStartTime` left from a prior `onGameStart` under fake/system timers; end-without-start then computes `Date.now() - staleStart < 0`
- **Fix:** Reset `gameStartTime` to `0` in `tests/unit/setup.ts` afterEach and in the wave55 before/after hooks; drop `restoreAllMocks` from that file

## Setup / helper changes

- `tests/unit/setup.ts` — reset `owlSystem.gameStartTime`; restore `window.alert` / `Math.random` spies (still **no** `restoreAllMocks`)
- Demo overnight files + `burn-wave2-dom-ai` / `fab-a-diffy-ai` — `clearAllMocks` instead of `restoreAllMocks`
- `vitest.config.ts` — selector + tablet bench remain in `unit-isolated` (unchanged from tip)

## After (flake counts)

| Mode | Result |
| --- | --- |
| Full suite shuffle ×10 (default workers) | **0** failed tests / 10 green |
| `unit-shared` `--maxWorkers=1` shuffle ×10 | **0** failed tests / 10 green |
| Selector + owl solo | green |

| Flake | Before (single-worker, no selector isolation) | After |
| --- | --- | --- |
| Selector navigate | 8 / 10 | 0 / 10 |
| Owl end-without-start | 1 / 10 | 0 / 10 |
| **Total intermittent** | **9 failure events / 10 runs** | **0** |

## Out of scope / not changed

- Game rules, scoring, AI evaluation weights
- Migrating all of `unit-shared` to `isolate: true`
- Bulk rewrite of every `restoreAllMocks` call site (~677 files) — only confirmed polluters + shared setup
