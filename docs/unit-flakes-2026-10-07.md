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

| Mode | Workers | Notes |
| --- | --- | --- |
| Full suite shuffle | default pool | 10 seeds `101…1010` |
| `unit-shared` shuffle | `--maxWorkers=1` | 10 seeds incl. `909/2002/404/606/3333` |
| Causal (selector out of `unit-isolated`) | `--maxWorkers=1` | Measures restoreAllMocks ↔ navigate mock |
| Solo | n/a | Selector, owl, FIAR timer victims |

## Before (flake counts)

### Default multi-worker full suite (tip as shipped, isolation on)

| Metric | Result |
| --- | --- |
| Runs | **10 / 10 green** |
| Failed tests | **0** |

Multi-worker scheduling often separates `vi.mock(router)` victims from `restoreAllMocks` polluters, so the selector flake is rare here.

### Causal — selector **not** in `unit-isolated`, `--maxWorkers=1`

| Metric | Result |
| --- | --- |
| Runs with ≥1 failure | **8 / 10** |
| Fully green | 2 / 10 (`707`, `3333`) |
| `burn-wave24-stats-selector-ui` navigate | **8 / 10** |
| `overnight-wave55-core-owl-end-without-start` | **1 / 10** (seed `606`) |

Mini-suite (selector + known polluters, seeds `909`/`2002`): selector navigate fails with `Number of calls: 0`; same file passes alone.

## Flakes found

### 1. Game-selector `navigate` mock (ordering / shared graph)

- **File:** `tests/unit/burn-wave24-stats-selector-ui.test.ts`
- **Case:** `navigates available game cards via click and Enter/Space`
- **Symptom:** `navigate` expected `/game/<id>` but **0 calls**; passes in isolation
- **Root cause:** Under `isolate: false`, sibling `vi.restoreAllMocks()` tears down the hoisted `vi.mock('../../src/core/router')`
- **Fix:** Keep file in `unit-isolated`; replace `restoreAllMocks` with `clearAllMocks` in known polluter tests; document in `tests/unit/setup.ts`

### 2. Owl `onGameEnd` without start — negative duration (shared state / timers)

- **File:** `tests/unit/overnight-wave55-core-owl-end-without-start.test.ts`
- **Symptom:** `expected -419 to be >= 0` on `game:end` duration (seed `606`); passes alone
- **Root cause:** Module-private `owlSystem.gameStartTime` left from a prior `onGameStart` under fake/system timers
- **Fix:** Reset `gameStartTime` to `0` in `tests/unit/setup.ts` afterEach and wave55 hooks

### 3. FIAR vsAI 500ms timer — early AI place (timers / shared controller)

- **File:** `tests/unit/overnight-wave56-fiar-controller-vsai-timer-500.test.ts`
- **Symptom:** After `advanceTimersByTimeAsync(499)`, `chipsPlaced.player2` already `1` (seed `3333` under single-worker); passes alone
- **Root cause:** Bare `setTimeout(..., 500)` AI handoffs on the singleton controller leak across files when fake timers are shared; advancing 499ms can fire a stale handoff
- **Fix:** `vi.clearAllTimers()` in setup afterEach (before `useRealTimers`); FIAR timer suites clear timers, call `destroyGame` / `newGameVsHuman`, and avoid `restoreAllMocks`

## Setup / helper changes

- `tests/unit/setup.ts` — reset `owlSystem.gameStartTime`; restore `window.alert` / `Math.random` spies; `clearAllTimers` before `useRealTimers` (still **no** `restoreAllMocks`)
- Demo overnight files + Fab AI suites — `clearAllMocks` instead of `restoreAllMocks`
- FIAR timer / null-draw suites — timer + controller cleanup
- `vitest.config.ts` — selector + tablet bench remain in `unit-isolated` (unchanged from tip)

## After (flake counts)

| Mode | Result |
| --- | --- |
| Full suite shuffle ×10 (default workers) | **0** failed / 10 green (`10816` passed) |
| `unit-shared` `--maxWorkers=1` shuffle ×10 | **0** failed / 10 green (seeds `909…3333`) |

| Flake | Before (single-worker stress) | After |
| --- | --- | --- |
| Selector navigate | 8 / 10 (isolation off) | 0 / 10 (isolation on) |
| Owl end-without-start | 1 / 10 | 0 / 10 |
| FIAR 500ms timer | 1 / 10 (post-setup iteration) | 0 / 10 |
| **Intermittent failure events** | **9+ / 10** (causal) | **0 / 10** |

## Out of scope / not changed

- Game rules, scoring, AI evaluation weights
- Product FIAR `setTimeout` handle tracking (tests/helpers only)
- Migrating all of `unit-shared` to `isolate: true`
- Bulk rewrite of every `restoreAllMocks` call site
