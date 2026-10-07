# Unit suite flake hunt — 2026-10-07

## Scope

- Run the full Vitest unit suite repeatedly (≥10 times), including `--sequence.shuffle` with distinct seeds.
- Identify every flaky test that fails in the full run but passes alone.
- Fix **tests / test setup only** — no game rules, scoring, or Kwatro contiguous-scoring logic (still under review in #393 / #394).
- Base branch for the fix PR: `cursor/overnight-polish-integration-0494`.

## Method

| Mode | Runs | Seeds / notes |
| --- | --- | --- |
| Default order | 6 (+ later re-verify) | Stable baseline |
| Shuffle | 8+ | Seeds `101,202,303,404,505,606,707,808` and more |
| Solo repro | yes | Suspect files run in isolation |
| Causal repro | yes | Injected leaked `performance.now` mock / fake timers |

Command shapes:

```bash
npm run test:unit
npx vitest run --sequence.shuffle --sequence.seed=<N>
```

Artifacts live under `/opt/cursor/artifacts/flake-hunt/` (summary TSVs, per-run logs).

## Results (pre-fix)

| Run | Mode | Seed | Exit | Failure |
| --- | --- | --- | --- | --- |
| 1–6 | default | — | 0 | none |
| 7–9 | shuffle | 101–303 | 0 | none |
| 10–12 | shuffle | 404,505,606 | 1 | `burn-wave40-graph-ui-legend-valids-animate` timeout |
| 13–14 | shuffle | 707,808 | 0 | none |

**Solo:** `tests/unit/burn-wave40-graph-ui-legend-valids-animate.test.ts` passes alone (~1s).

**Only flake observed across ≥14 full-suite iterations:** the Wave 40 graph legend/valids/animate case below. No Kwatro unit flake reproduced in this hunt (Kwatro AI-guard / controller suites stayed green under default and shuffle). Contiguous-scoring / rules code was not modified.

## Flake: `burn-wave40-graph-ui-legend-valids-animate`

- **File:** `tests/unit/burn-wave40-graph-ui-legend-valids-animate.test.ts`
- **Case:** `showValidMoves marks neighbors; animateMove settles short path`
- **Symptom:** `Error: Test timed out in 30000ms` under shuffle seeds 404 / 505 / 606; passes alone and under many other seeds.
- **Root cause (isolation / timers):**
  1. `animateMove` (`src/core/graph/graph-ui.ts`) advances via `requestAnimationFrame` and `performance.now()`.
  2. The flaky test awaited that promise on the **wall clock** (duration 20ms) with no fake-timer control.
  3. Under `isolate: false`, a prior file in the same worker can leave:
     - **Fake timers** still active → RAF never fires without `advanceTimers*` → hang until `testTimeout`.
     - A **`performance.now` spy** stuck ahead of real RAF timestamps → `elapsed < 0` → `progress < 1` forever → hang.
  4. Shared `tests/unit/setup.ts` already called `vi.useRealTimers()` and `vi.clearAllMocks()`, but:
     - `clearAllMocks` does **not** remove spy implementations.
     - It did **not** call `vi.unstubAllGlobals()` (RAF stubs from Wave 33 / Wave 57).
     - Default `sequence.hooks: 'parallel'` let file cleanup race the shared net.

Causal repros (injected leaks) both timed out the same await in 2s, matching the suite hang shape.

Sibling tests (`burn-wave33-graph-ui-animate-raf`, `overnight-wave57-core-graph-animate-two-hop`) already used a deterministic RAF clock; this Wave 40 leftover did not.

## Fixes (tests / setup only)

1. **`tests/unit/burn-wave40-graph-ui-legend-valids-animate.test.ts`**  
   Use the same `stubRafClock()` pattern (fake timers + `performance.now` spy + stubbed RAF) and `advanceTimersByTimeAsync`; restore stubs/timers/mocks in `afterEach`.

2. **`tests/unit/setup.ts`**  
   After every test: `vi.unstubAllGlobals()`, `vi.useRealTimers()`, and `mockRestore()` on `performance.now` when a spy remains. Still **no** `vi.restoreAllMocks()` (would tear down hoisted `vi.mock` factories on the shared graph).

3. **`vitest.config.ts`**  
   `sequence.hooks: 'stack'` so setup `afterEach` runs after file hooks and remains the last safety net.

## Post-fix verification

Re-run previously failing seeds (`404`, `505`, `606`) plus additional shuffle seeds and default-order passes. Summary recorded in the PR / agent artifacts (`postfix-summary.tsv`). All must be green before merge consideration.

## Out of scope / not changed

- Kwatro rules, contiguous scoring, AI move selection (#393 / #394).
- Production game controllers beyond what tests already exercise.
- Broader move of `unit-shared` to `isolate: true` (performance tradeoff; not required once timer/stub cleanup is hardened).
