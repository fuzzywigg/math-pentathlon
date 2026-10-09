# Engine coverage round — burn-1008

Task id: `burn-1008-mp-engine-coverage-round`

Measured on tip `cursor/integration-fold-wave5-tip-4af0` with local
`vitest run --coverage` (`@vitest/coverage-v8`), `coverage.include` limited to
non-AI engine modules:

- `src/games/*/rules.ts`
- `src/games/*/types.ts`
- `src/games/*/game-state.ts`
- `src/games/*/board.ts`
- `src/games/*/pieces.ts`
- `src/games/*/serialization.ts`

AI / UI / controller / tutorial / 3d-loader modules excluded. **No engine source
changes.** Characterization tests only.

Related prior work (already on tip; not duplicated):

| PR | Topic |
| --- | --- |
| #482 | Engine edge-case suite |
| #465 | State round-trip fuzz + adapters |
| #515 | Mutation audit (weakest 5 rules) |
| #557 | Type-ratchet batch 6 (rules/engine type-only) — cross-checked |

New suite: `tests/unit/engine-coverage-round-burn-1008.test.ts`  
Rank helper: `scripts/engine-coverage-rank.mjs`

## Method

1. Baseline: full unit suite + coverage include above → `coverage-engine-baseline/`
2. Rank NON-AI files by branch %; target lowest `rules.ts` (+ companions)
3. Add hand-built / forged-state characterization tests (legal moves, apply,
   win/draw, scoring, serialize) using #465 helpers where useful
4. Re-measure → `coverage-engine-after/`
5. Document remaining unreachable arms as `it.todo` (no fixes)

## Per-game rules.ts before → after

| Game | Before line % | Before branch % | After line % | After branch % | Δ branch arms |
| --- | ---: | ---: | ---: | ---: | ---: |
| pent-em-in | 99.00 (99/100) | **89.74** (70/78) | **100** (100/100) | **97.43** (76/78) | **+6** |
| kings-quadraphages | 96.87 (62/64) | 91.66 (44/48) | 96.87 | 91.66 | 0 |
| par-55 | 100 | 93.02 (80/86) | 100 | 93.02 | 0 |
| kwatro-sinko | 100 | 93.96 (109/116) | 100 | 93.96 | 0 |
| fraction-pinball | 96.03 (121/126) | 94.33 (50/53) | 96.03 | 94.33 | 0 |
| prime-gold | 99.03 (103/104) | 95.52 (64/67) | **100** | **98.50** (66/67) | **+2** |
| sum-dominoes | 99.21 | 96.46 | 99.21 | 96.46 | 0 |
| calla | 99.25 | 97.22 (105/108) | 99.25 | **98.14** (106/108) | **+1** |
| juggle | 98.50 | 97.26 (71/73) | 98.50 | **98.63** (72/73) | **+1** |
| hex-a-gone | 98.66 | 97.36 (74/76) | **100** | **98.68** (75/76) | **+1** |
| ramrod | 100 | 97.59 | 100 | 97.59 | 0 |
| star-track | 100 | 97.61 (41/42) | 100 | **100** (42/42) | **+1** |
| remainder-islands | 97.82 | 98.03 (50/51) | **100** | **100** (51/51) | **+1** |
| fab-a-diffy | 99.21 | 98.16 | 99.21 | 98.16 | 0 |
| stars-bars | 100 | 98.33 | 100 | 98.33 | 0 |
| frac-fact | 99.00 | 98.38 | 99.00 | 98.38 | 0 |
| contig-60 | 100 | 98.38 | 100 | 98.38 | 0 |
| queens-guards | 100 | 99.02 | 100 | 99.02 | 0 |
| fiar | 100 | 99.06 | 100 | 99.06 | 0 |
| hex | 100 | 100 | 100 | 100 | 0 |

### Companion modules (notable)

| Module | Before branch % | After branch % | Notes |
| --- | ---: | ---: | --- |
| kings-quadraphages/game-state.ts | 98.18 | 98.18 | phase messages covered; `default: never` still unreachable |
| fab-a-diffy/types.ts | 75.00 | 75.00 | shuffle hole-guard (array holes) |
| star-track/types.ts | 83.33 | 83.33 | same shuffle guard |
| queens-guards/types.ts | 89.47 | 89.47 | geometry false-arms (see #460 next5 doc) |
| remainder-islands/types.ts | 90.00 | 90.00 | shuffle guard |
| par-55/types.ts | 91.66 | 91.66 | shuffle / deal edge |

### Aggregate (included engine files)

| Metric | Before | After | Δ |
| --- | ---: | ---: | ---: |
| Lines | 99.28% (2638/2657) | 99.43% (2642/2657) | +4 lines |
| Branches | 96.68% (1837/1900) | 97.36% (1850/1900) | **+13 arms** |
| Statements | 98.41% | 98.83% | — |
| Functions | 100% | 100% | — |

**Largest gain:** `pent-em-in/rules.ts` 89.74% → 97.43% branch (+6), leaving the
lowest-rules spot; remaining two arms are defensive (`!pieceShape` continue
after a known-shape short-circuit path, and `??` truthy arm inside private
`withFirstLegalPreview`).

## Bugs / oddities found (not fixed)

| Game | Oddity | Evidence | Action |
| --- | --- | --- | --- |
| pent-em-in | `canPlayerMove` returns **true** when `available[0]` is an unknown shape id (`if (!shape) return pieces.available.length > 0`) | Characterization test pins `true` | Documented; no fix |
| kings | `isValidKingMove` stay-in-place arm (`rowDiff===0 && colDiff===0`) is dead — `isEmpty` rejects the king cell first | `it.todo` | Documented |
| kings | `isDrawCondition` “board full but both kings mobile” arm is geometrically impossible | `it.todo` | Documented |
| kings | `getCurrentPhaseMessage` `default: never` unreachable for typed `TurnPhase` | `it.todo` | Documented |
| kwatro | `createBoard` `!node continue`, `moveChip` `!chip` / `!newNode` after `isValidMove`, and `checkTrioForWin` `!likes\|\|!opposite` after `byOwner.size===2` are unreachable on the public graph | `it.todo` | Documented |
| par-55 | Nested equal-score / `!base` / `centerBase&&startingBlock` false arms remain defensive (see `docs/engine-coverage-next5-2026-10-07.md`) | `it.todo` | Documented |
| fraction-pinball | `generateWrongDecimals` fill-`while` (private RNG) still uncovered | `it.todo` | Documented |
| fab / star-track / remainder types | Fisher-Yates `a===undefined \|\| b===undefined` continue never hits dense arrays | Unchanged % | Documented |

No student-facing scoring or rules changes. No AI / timing / copy edits.
Hex Hard assert remains **450ms** (untouched).

## #557 cross-check

Branch: `cursor/type-ratchet-batch6-nonrules-4a08` (PR #557 — type-only rules/engine).

```bash
# worktree + shared node_modules; copied this PR’s test file only
npx vitest run tests/unit/engine-coverage-round-burn-1008.test.ts
# → 32 passed | 7 todo (39)  EXIT 0
```

**All new tests pass on #557.** No behavior change detected from Batch-6 type-only
edits (as claimed by #557).

## Reproduce

```bash
# Rank from a coverage-summary.json
node scripts/engine-coverage-rank.mjs coverage-engine-baseline/coverage-summary.json

# Coverage (engine modules only; local)
npm run test:unit:coverage -- \
  --coverage.reportsDirectory=coverage-engine-after \
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

# New suite alone
npx vitest run tests/unit/engine-coverage-round-burn-1008.test.ts
```

## Verification snapshot

| Command | Result |
| --- | --- |
| Baseline coverage suite | 3104 files / **11722** passed / 13 skipped |
| After coverage suite | 3105 files / **11754** passed / 13 skipped / **7 todo** |
| New suite alone | **32** passed / **7** todo |
| #557 cross-check | **32** passed / **7** todo |
| `npm run lint` | pass |
| `npx tsc --noEmit` | pass |
| `npm run test:unit` | **pass** — 3105 files / 11754 passed / 13 skipped / 7 todo |
