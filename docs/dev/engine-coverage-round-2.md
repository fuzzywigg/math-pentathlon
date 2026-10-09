# Engine coverage round 2 — burn-1008

Task id: `burn-1008-mp-engine-coverage-round-2`

Stacks on draft **#562** (`cursor/engine-coverage-round-7aa8`). Measured on tip
`cursor/integration-fold-wave5-tip-4af0` after merging #562, with local
`vitest run --coverage` (`@vitest/coverage-v8`), `coverage.include` limited to
non-AI engine modules:

- `src/games/*/rules.ts`
- `src/games/*/types.ts`
- `src/games/*/game-state.ts`
- `src/games/*/board.ts`
- `src/games/*/pieces.ts`
- `src/games/*/serialization.ts`

AI / UI / controller / tutorial / 3d-loader modules excluded. **No engine source
changes.** Characterization tests only. Round-2-only delta is this doc + the new
suite.

## Overlap check

| PR | Topic | Action |
| --- | --- | --- |
| #562 | Engine coverage round 1 | Merged into this branch first; not duplicated |
| #482 | Engine edge-case suite | On tip; scenarios not re-copied |
| #566 | UI coverage round 2 | Unrelated; avoided |
| #465 / #515 / undo-audit | Helpers / mutation / undo props | Helpers reused; suites not cloned |

New suite: `tests/unit/engine-coverage-round-2-burn-1008.test.ts`  
Rank helper (from #562): `scripts/engine-coverage-rank.mjs`

## Method

1. Merge #562 onto tip → baseline `coverage-engine-r2-baseline/`
2. Rank NON-AI files; skip exhausted defensive arms already todod in #562
   (kings / par-55 / kwatro / ramrod)
3. Add forged-state characterization for the **next** hittable gaps: legal-move
   generation, win/draw, state transitions, edge boards, undo/redo invariants
4. Re-measure → `coverage-engine-r2-after/`
5. Document remaining unreachable arms as `it.todo` (no fixes)

## Modules with coverage gain (round 2)

| Module | Before line % | Before branch % | After line % | After branch % | Δ lines | Δ branch arms |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| **sum-dominoes/rules.ts** | 99.21 (127/128) | **96.46** (109/113) | **100** | **100** (113/113) | **+1** | **+4** |
| **fraction-pinball/rules.ts** | 96.03 (121/126) | **94.33** (50/53) | **100** | **96.22** (51/53) | **+5** | **+1** |
| **calla/rules.ts** | 99.25 (133/134) | 98.14 (106/108) | **100** | **99.07** (107/108) | **+1** | **+1** |
| **juggle/rules.ts** | 98.50 (66/67) | 98.63 (72/73) | **100** | 98.63 | **+1** | 0 |
| contig-60/rules.ts | 100 | 98.38 (61/62) | 100 | **100** | 0 | **+1** |
| fab-a-diffy/rules.ts | 99.21 | 98.16 (107/109) | 99.21 | **99.08** (108/109) | 0 | **+1** |
| hex-a-gone/rules.ts | 100 | 98.68 (75/76) | 100 | **100** | 0 | **+1** |
| pent-em-in/rules.ts | 100 | 97.43 (76/78) | 100 | **98.71** (77/78) | 0 | **+1** |
| queens-guards/rules.ts | 100 | 99.02 (102/103) | 100 | **100** | 0 | **+1** |

**9 engine modules** gained meaningful line and/or branch coverage (acceptance: 8+).

Additional characterization (no % delta — already saturated / dead last arm):
stars-bars, frac-fact, fiar legal-move / transition pins + `it.todo` for dead arms.

### Aggregate (included engine files)

| Metric | Before (#562 tip) | After round 2 | Δ |
| --- | ---: | ---: | ---: |
| Lines | 99.43% (2642/2657) | **99.73%** (2650/2657) | **+8 lines** |
| Branches | 97.36% (1850/1900) | **97.94%** (1861/1900) | **+11 arms** |
| Statements | 98.83% | 99.16% | +10 |
| Functions | 100% | 100% | — |

**Largest gain:** `sum-dominoes/rules.ts` → **100%** line+branch (+4 arms), via
mismatched stamp face-lookup + mocked empty seed remainder.

## Themes covered

| Theme | Examples in suite |
| --- | --- |
| Legal-move generation | sum mismatched adjacency; queens `getValidMoves`; stars placements; fiar `canPlaceChip` |
| Win/draw detection | contig null-grid + `alignmentTiebreak`; calla `winner: null` phase msg; fab `checkWinner` |
| State transitions | pent jammed `selectPiece` → `previewPosition: null`; hex `commitSelection`; juggle orient fail |
| Edge boards | contig `grid[r][c]=null`; sum stamp metadata ≠ cell index; full pent/juggle boards |
| Undo/redo invariants | adapter snapshot undo + serialize round-trip preserves legal-move sets (8 games) |

## Bugs / oddities found (not fixed)

| Game | Oddity | Evidence | Action |
| --- | --- | --- | --- |
| fab-a-diffy | `getPossibleResults` filters with `result.numerator >= 0`, but `simplify()` moves sign into `isNegative` — arithmetic “negatives” still enter the result list | Characterization pins 2 subtract ops for (7/8, 1/8) including `isNegative: true` | Documented; no fix |
| calla | `getPhaseMessage` with `phase: 'gameOver'` and `winner: null` returns `''` (not “Tie”) | Pinned expect `''` | Documented |
| fraction-pinball | `generateWrongDecimals` fill-`while` can spin if `Math.random` is constant — suite uses a bounded ascending stub | Fill path covered | Documented |
| contig-60 | `doRollDice` both ternary arms assign `'calculating'` (pre-existing) | Not touched | Noted only |

### Remaining `it.todo` (unreachable / defensive)

- fab: sparse-array hole guard; `calculateResult` catch
- pent-em-in: `!pieceShape` continue after known-shape short-circuit (#562)
- calla: sow wrap false arm (#460 next5)
- juggle: `orientSelectedShapeToFit` early return when callers always set placing+shape
- fraction-pinball: `correct.numerator \|\| 1` false arm
- stars-bars: `!adjCell.card` after filter
- frac-fact: divide `operand2.numerator===0` guard
- fiar: `subsetUnblocked` short-length early return

Exhausted from #562 (not re-targeted): kings / par-55 / kwatro / ramrod defensive arms.

No student-facing scoring or rules changes. No AI / timing / copy edits.
Hex Hard assert remains **450ms** (untouched). Stars & Bars history cap untouched.

## Reproduce

```bash
# Baseline (after merging #562, before round-2 tests) — or use saved summary
node scripts/engine-coverage-rank.mjs coverage-engine-r2-baseline/coverage-summary.json

npm run test:unit:coverage -- \
  --coverage.reportsDirectory=coverage-engine-r2-after \
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

npx vitest run tests/unit/engine-coverage-round-2-burn-1008.test.ts
```

## Verification snapshot

| Command | Result |
| --- | --- |
| Baseline coverage suite | engine branches **97.36%** (1850/1900); lines 99.43% |
| After coverage suite | engine branches **97.94%** (1861/1900); lines 99.73%; **+11 arms / +8 lines** |
| New suite alone | **41** passed / **9** todo |
| `npm run lint` | **pass** (exit 0) |
| `npx tsc --noEmit` | **pass** (exit 0) |
| `npm run test:unit` | **pass** — 3106 files / **11795** passed / 13 skipped / **16** todo |
