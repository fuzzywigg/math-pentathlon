# Engine coverage round 3 — burn-1008

Task id: `burn-1008-mp-engine-coverage-round-3`

Stacks on draft **#574** (`cursor/engine-coverage-round-2-f0ea`). Measured on tip
`cursor/integration-fold-wave5-tip-4af0` after merging #574, with local
`vitest run --coverage` (`@vitest/coverage-v8`), `coverage.include` limited to
non-AI engine modules:

- `src/games/*/rules.ts`
- `src/games/*/types.ts`
- `src/games/*/game-state.ts`
- `src/games/*/board.ts`
- `src/games/*/pieces.ts`
- `src/games/*/serialization.ts`

AI / UI / controller / tutorial / 3d-loader modules excluded. **No engine source
changes.** Characterization tests only. Round-3-only delta is this doc + the new
suite.

## Overlap check

| PR | Topic | Action |
| --- | --- | --- |
| #574 | Engine coverage round 2 | Merged into this branch first; not duplicated |
| #562 | Engine coverage round 1 | On #574 stack; not duplicated |
| #482 / #465 / #515 | Edge / round-trip / mutation | Helpers reused; suites not cloned |
| #571 | UI coverage round 3 | Unrelated; avoided |

New suite: `tests/unit/engine-coverage-round-3-burn-1008.test.ts`  
Rank helper: `scripts/engine-coverage-rank.mjs`

## Method

1. Merge #574 onto tip → baseline `coverage-engine-r3-baseline/`
2. Rank NON-AI files; skip exhausted defensive arms already todod in #562/#574
   (kings stay-in-place / board-full draw, par-55 nested settle, kwatro moveChip
   guards, ramrod post-validate, queens geometry false-arms)
3. Add forged-state characterization for the **next** hittable gaps: shuffle /
   table hole-guards, serialization validate paths, scoring tallies, legal-move
   and win/draw transitions
4. Re-measure → `coverage-engine-r3-after/`
5. Document remaining unreachable arms as `it.todo` (no fixes)

## Baseline (after #574 merge, before round-3 suite)

| Metric | Value |
| --- | ---: |
| Lines | 99.73% (2650/2657) |
| Branches | **97.94%** (1861/1900) |
| Statements | 99.16% |
| Functions | 100% |

Lowest non-AI modules by branch % (baseline):

| Module | Branch % | Notes |
| --- | ---: | --- |
| fab-a-diffy/types.ts | 75.00 | shuffle hole-guard |
| star-track/types.ts | 83.33 | private shuffle hole-guard |
| queens-guards/types.ts | 89.47 | geometry false-arms (exhausted) |
| remainder-islands/types.ts | 90.00 | ISLAND_VALUES undefined skip |
| kings-quadraphages/rules.ts | 91.66 | exhausted defensive |
| par-55/types.ts | 91.66 | shuffle hole-guard |
| par-55/rules.ts | 93.02 | exhausted settle arms |
| kwatro-sinko/rules.ts | 93.96 | exhausted |
| fraction-pinball/rules.ts | 96.22 | fill duplicate + `\|\| 1` |
| fiar/types.ts | 97.43 | prevId undefined arm |
| kings game-state.ts | 98.18 | default never + lines 139–140 |
| stars-bars/rules.ts | 98.33 | `!adjCell.card` continue |
| frac-fact/rules.ts | 98.38 | divide zero-numerator guard |
| fab-a-diffy/rules.ts | 99.08 | calculateResult catch |

## Modules with coverage gain (round 3)

| Module | Before branch % | After branch % | Before line % | After line % | Δ branch | Δ line |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| **fab-a-diffy/types.ts** | **75.00** (3/4) | **100** (4/4) | 100 | 100 | **+1** | 0 |
| **par-55/types.ts** | **91.66** (11/12) | **100** (12/12) | 100 | 100 | **+1** | 0 |
| **remainder-islands/types.ts** | **90.00** (9/10) | **100** (10/10) | 100 | 100 | **+1** | 0 |
| **fraction-pinball/rules.ts** | **96.22** (51/53) | **100** (53/53) | 100 | 100 | **+2** | 0 |
| **kings-quadraphages/game-state.ts** | 98.18 (54/55) | **100** (55/55) | 97.67 | **100** | **+1** | **+2** |
| **frac-fact/rules.ts** | 98.38 (61/62) | **100** (62/62) | 99.00 | **100** | **+1** | **+1** |
| **pent-em-in/rules.ts** | 98.71 (77/78) | **100** (78/78) | 100 | 100 | **+1** | 0 |
| **fab-a-diffy/rules.ts** | 99.08 (108/109) | 99.08 | 99.21 | **100** | 0 | **+1** |

**8 engine modules** gained meaningful branch and/or line coverage (acceptance: 8+).

Additional characterization (no % delta on remaining dead arms): kings
serialization validate pins, fiar types helpers, stars-bars scoring forge,
calla/juggle/prime-gold/star-track transitions + `it.todo`.

### Aggregate (included engine files)

| Metric | Before (#574 tip) | After round 3 | Δ |
| --- | ---: | ---: | ---: |
| Lines | 99.73% (2650/2657) | **99.88%** (2654/2657) | **+4 lines** |
| Branches | 97.94% (1861/1900) | **98.36%** (1869/1900) | **+8 arms** |
| Statements | 99.16% | 99.41% | +8 |
| Functions | 100% | 100% | — |

**Largest gains:** `fab-a-diffy/types.ts` 75%→100% branch; `fraction-pinball/rules.ts` +2 arms → 100%.

## Bugs / oddities found (not fixed)

| Game | Oddity | Evidence | Action |
| --- | --- | --- | --- |
| kings game-state | `getCurrentPhaseMessage` `default` returns the forged `turnPhase` string when cast past the union | Pinned expect `'notAPhase'` | Documented; no fix |
| fab calculateResult | `catch` returns `null` when operand property access throws | Proxy operand | Documented |
| stars-bars | `calculatePlacementScore` filters `card !== null` then re-checks `!adjCell.card` — `undefined` slips through the filter | Forged adjacent cell | Documented |
| fraction-pinball | fill-`while` has no attempt cap — constant RNG can spin | Suite uses bounded stub (duplicate then ascending) | Documented |
| pent-em-in | `canPlayerMove` short-circuits true when `available[0]` is unknown (round 1) | Still pinned elsewhere | Noted |

### Remaining `it.todo` (unreachable / defensive)

- fab: `hasAnyValidMove` left/right `=== undefined` (filter never yields holes)
- star-track: private shuffle hole-guard (no safe public inject)
- prime-gold: `createBoard` `val>0` false; Goldbach loop-exhaust `return false`
- calla: sow `position < PITS*2+1` false arm
- juggle: `orientSelectedShapeToFit` early return
- Exhausted from #562/#574: kings rules stay/draw, par-55 settle, kwatro guards,
  ramrod post-validate, queens geometry, fiar `subsetUnblocked`

No student-facing scoring or rules changes. No AI / timing / copy edits.
Hex Hard assert remains **450ms** (untouched). Stars & Bars history cap untouched.

## Reproduce

```bash
node scripts/engine-coverage-rank.mjs coverage-engine-r3-baseline/coverage-summary.json

npm run test:unit:coverage -- \
  --coverage.reportsDirectory=coverage-engine-r3-after \
  --coverage.include='src/games/*/rules.ts' \
  --coverage.include='src/games/*/types.ts' \
  --coverage.include='src/games/*/game-state.ts' \
  --coverage.include='src/games/*/board.ts' \
  --coverage.include='src/games/*/pieces.ts' \
  --coverage.include='src/games/*/serialization.ts' \
  --coverage.exclude='src/games/**/ai.ts' \
  --coverage.exclude='src/games/**/ai-client.ts' \
  --coverage.exclude='src/games/**/ai.worker.ts' \
  --coverage.exclude='src/games/**/board-ui.ts' \
  --coverage.exclude='src/games/**/game-controller.ts' \
  --coverage.exclude='src/games/**/tutorial.ts' \
  --coverage.exclude='src/games/**/board-renderer.ts' \
  --coverage.exclude='src/games/**/board-3d-loader.ts' \
  --coverage.exclude='src/games/**/layout.ts' \
  --coverage.exclude='src/games/**/index.ts'

npx vitest run tests/unit/engine-coverage-round-3-burn-1008.test.ts
```

## Verification snapshot

| Command | Result |
| --- | --- |
| Baseline coverage suite | engine branches **97.94%** (1861/1900); lines 99.73% |
| After coverage suite | engine branches **98.36%** (1869/1900); lines 99.88%; **+8 arms / +4 lines** |
| New suite alone | **37** passed / **6** todo |
| `npm run lint` | **pass** (exit 0) |
| `npx tsc --noEmit` | **pass** (exit 0) |
| `npm run test:unit` (via `test:unit:coverage` same vitest run) | **pass** — 3108 files / **11853** passed / 21 skipped / **22** todo |
