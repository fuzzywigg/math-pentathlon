# Unit suite flake hunt — 2026-10-07

## Scope

- Run the full Vitest unit suite repeatedly (≥10 times), including `--sequence.shuffle` with distinct seeds.
- Identify every flaky test that fails in the full run but passes alone.
- Fix **tests / test setup only** — no game rules, scoring, or Kwatro contiguous-scoring logic (still under review in #393 / #394).
- Base branch for the fix PR: `cursor/overnight-polish-integration-0494`.

## Method

| Mode | Runs | Seeds / notes |
| --- | --- | --- |
| Default order | 6+ re-verify | Stable baseline + intermittent catch |
| Shuffle | 8+ then more | Seeds include `101–808`, `909`, `2002`, … |
| Solo / stress | yes | Kwatro Hard AI 50–80×; Calla hint alone |
| Causal repro | yes | Leaked `performance.now` / fake timers; Calla hint module leak |

```bash
npm run test:unit
npx vitest run --sequence.shuffle --sequence.seed=<N>
```

Artifacts: `/opt/cursor/artifacts/flake-hunt/` (`summary.tsv`, `postfix*-summary.tsv`, per-run logs).

## Flakes found

### 1. Graph `animateMove` wall-clock hang (shuffle)

- **File:** `tests/unit/burn-wave40-graph-ui-legend-valids-animate.test.ts`
- **Case:** `showValidMoves marks neighbors; animateMove settles short path`
- **Symptom:** `Test timed out in 30000ms` on shuffle seeds `404` / `505` / `606`; passes alone.
- **Root cause:** `animateMove` uses RAF + `performance.now()`. Under `isolate: false`, a prior file can leave fake timers or a `performance.now` spy ahead of RAF timestamps → infinite/non-advancing animation. Shared setup cleared timers but not globals stubs / `performance.now` spies (`clearAllMocks` does not remove implementations).
- **Fix:** Deterministic `stubRafClock()` (same pattern as Wave 33 / 57); setup `unstubAllGlobals` + `performance.now` mockRestore; `sequence.hooks: 'stack'`.

### 2. Kwatro Hard AI chip identity (randomness) — the suite intermittent

- **File:** `tests/unit/kwatro-sinko-end-rules-375.test.ts`
- **Case:** `vs computer: Hard AI can convert a forced legal win`
- **Symptom:** `expected 'p1-4' to be 'p1-1'` (also fails alone ~2/50 without a seed).
- **Root cause:** Hard AI `DIFFICULTY_CONFIG.hard.randomness = 0.03` sometimes picks among the top scored moves (`Math.random`). Not contiguous-scoring / rules — test asserted a single chip without seeding RNG.
- **Fix (tests only):** `vi.spyOn(Math, 'random').mockReturnValue(0.99)` for that case; targeted `mockRestore` in `afterEach` (no `restoreAllMocks`).

### 3. Calla `currentHint` module leak (shuffle)

- **File:** `tests/unit/burn-wave19-controller-persist.test.ts` (polluter: `overnight-wave50-calla-controller-ai-timer.test.ts`)
- **Symptom:** `expected 'Look carefully! There is a capture.' to be null` after `initCalla`.
- **Root cause:** Wave 50 AI-timer test sets module-level `currentHint` via mocked `getAIMove`. `newGameVsHuman` / `initGame` do **not** clear it; only `newGameVsAI` does. Shared DOM cleanup does not reset that singleton.
- **Fix:** Wave 50 `afterEach` remounts and calls `newGameVsAI` to clear hint; Wave 19 asserts hint null **after** `callaVsAI` (the public clear path). Spy cleanup is targeted (`mockRestore` on `getAIMove` only).

### 4. Game-selector `navigate` mock torn down (`restoreAllMocks`)

- **File:** `tests/unit/burn-wave24-stats-selector-ui.test.ts` (also aggravated by other files’ `restoreAllMocks`)
- **Symptom:** `navigate` expected called with `/game/…` but **0 calls** under shuffle seed `2002`.
- **Root cause:** Under `isolate: false`, `vi.restoreAllMocks()` in file `afterEach` (and sibling graph RAF suites) tears down hoisted `vi.mock('../../src/core/router')` factories. Setup intentionally avoids `restoreAllMocks` for this reason.
- **Fix:** Replace `restoreAllMocks` with targeted restores in Wave 24 selector UI, Wave 33/34/40/57 graph animate suites, Wave 50 Calla timer, and the Kwatro #375 suite.

## Post-fix verification

- Solo + stress: Kwatro forced-win **0 fails / 50–80**.
- Previously failing shuffle seeds `404`, `505`, `606`, `2002` re-run green after fixes.
- Additional default + shuffle loops recorded in `postfix3-summary.tsv`.

## Out of scope / not changed

- Kwatro rules, contiguous scoring, AI evaluation weights (#393 / #394).
- Production controllers beyond test cleanup calling existing public APIs (`newGameVsAI`).
- Migrating all of `unit-shared` to `isolate: true`.
