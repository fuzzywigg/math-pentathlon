# Unit suite flake hunt — 2026-10-07

## Scope

- Run the full Vitest unit suite repeatedly (≥10 times), including `--sequence.shuffle` with distinct seeds.
- Identify every flaky test that fails in the full run but passes alone.
- Fix **tests / test setup only** — no game rules, scoring, or Kwatro contiguous-scoring logic (still under review in #393 / #394).
- Base branch for the fix PR: `cursor/overnight-polish-integration-0494`.

## Method

| Mode | Runs | Notes |
| --- | --- | --- |
| Default order | 6+ | Baseline |
| Shuffle | 14+ seeds | Includes previously failing `404/505/606/909/1111/2002/3333` |
| Solo / stress | yes | Kwatro Hard AI 50–80×; Calla hint; bench shuffle |
| Causal repro | yes | Leaked `performance.now` / fake timers; Calla hint module leak |

```bash
npm run test:unit
npx vitest run --sequence.shuffle --sequence.seed=<N>
```

Artifacts: `/opt/cursor/artifacts/flake-hunt/`.

## Flakes found and fixed

### 1. Graph `animateMove` wall-clock hang (shuffle)

- **File:** `tests/unit/burn-wave40-graph-ui-legend-valids-animate.test.ts`
- **Symptom:** `Test timed out in 30000ms` (seeds `404/505/606`); passes alone.
- **Root cause:** RAF + `performance.now` await under leaked fake timers / stuck `performance.now` spy (`isolate: false`). Setup cleared timers but not globals stubs / spy implementations.
- **Fix:** Deterministic `stubRafClock()`; setup `unstubAllGlobals` + `performance.now` mockRestore; `sequence.hooks: 'stack'`.

### 2. Kwatro Hard AI chip identity (randomness)

- **File:** `tests/unit/kwatro-sinko-end-rules-375.test.ts`
- **Case:** `vs computer: Hard AI can convert a forced legal win`
- **Symptom:** `expected 'p1-4' to be 'p1-1'` (~2/50 alone without seed; also in full default runs).
- **Root cause:** Hard AI `randomness: 0.03` occasionally picks among top scored moves. Test asserted a single chip without seeding RNG. **Not** contiguous-scoring / rules.
- **Fix:** `Math.random` → `0.99` for that case; targeted `mockRestore` only.

### 3. Calla `currentHint` module leak (shuffle)

- **Files:** polluter `overnight-wave50-calla-controller-ai-timer.test.ts` → victim `burn-wave19-controller-persist.test.ts`
- **Symptom:** hint expected `null`, got `"Look carefully! There is a capture."`
- **Root cause:** Module-level `currentHint` set by mocked AI; `init` / `newGameVsHuman` do not clear it (only `newGameVsAI` does).
- **Fix:** Wave 50 `afterEach` calls `newGameVsAI` to clear; Wave 19 asserts after `callaVsAI`.

### 4. Game-selector `navigate` mock (shuffle)

- **File:** `tests/unit/burn-wave24-stats-selector-ui.test.ts`
- **Symptom:** `navigate` expected `/game/kings-quadraphages` but **0 calls** (seed `909`).
- **Root cause:** Under `isolate: false`, sibling `vi.restoreAllMocks()` tears down hoisted `vi.mock(router)`.
- **Fix:** Targeted restores in graph/Calla/Kwatro suites; move this file into `unit-isolated`.

### 5. Tablet Hard AI bench summary order (shuffle)

- **File:** `tests/unit/tablet-ai-hard-latency.bench.test.ts`
- **Symptom:** `expected 0 to be greater than 0` on summarize (seeds `1111/3333`).
- **Root cause:** Module-level `rows` filled by sibling `it()`s; `--sequence.shuffle` can run summarize first.
- **Fix:** Move summary assertions to `afterAll`; isolate the file in `unit-isolated`.

## Setup / config changes

- `tests/unit/setup.ts` — `unstubAllGlobals()`, restore `performance.now` spies (still **no** `restoreAllMocks`).
- `vitest.config.ts` — `sequence.hooks: 'stack'`; isolate Wave 24 selector + tablet bench.

## Verification (post-fix)

| Check | Result |
| --- | --- |
| Kwatro forced-win stress | 0 fails / 50–80 |
| Seeds `404/505/606/2002/909/1111/3333` | green after fixes |
| Final loop (`postfix5-summary.tsv`) | **15/15 green** (10 shuffle incl. prior bad seeds + 5 default) |

## Out of scope / not changed

- Kwatro rules, contiguous scoring, AI evaluation weights (#393 / #394).
- Production controllers beyond calling existing public APIs from tests (`newGameVsAI`).
- Migrating all of `unit-shared` to `isolate: true`.
