# Type-ratchet Batch 2 — owner decisions (Andrew)

**Task:** `burn-1008-mp-type-ratchet-batch2-compliant-recut`  
**Supersedes for folding:** draft [#537](https://github.com/fuzzywigg/math-pentathlon/pull/537) (compliance [#538](https://github.com/fuzzywigg/math-pentathlon/pull/538) flagged `#537` as a **violation** for rewriting nullish handling inside `*/rules.ts` legal-move / scoring / win-detection paths).  
**This recut:** type-only assertions (`!`), exactOptionalPropertyTypes omit-spreads in board-ui, ratchet IN_SCOPE/ceiling bookkeeping, characterization tests, and this decision list. **No** `#537` runtime-semantic rewrites (`??` defaults, early `continue`/`return` that change throw→no-op, changed fallbacks).

Fill replies as `TR-B2-01: Yes` (or choose A/B/C). Do not fold the proposed runtime fixes until answered.

---

## Deferred runtime fixes from #537 (not applied)

Each row is a hunk #537 proposed that can change an expression's runtime value for some input. The compliant recut keeps tip behavior and clears the type error with a non-null assertion (or leaves the latent bug for owner review).

### TR-B2-01 — frac-fact `randomFraction` empty-table fallback

| | |
| --- | --- |
| **File / tip line** | `src/games/frac-fact/rules.ts` ~67 (`randomFraction`) |
| **Current** | `return fractions[Math.floor(Math.random() * fractions.length)]` — if table were empty, returns `undefined` (then callers blow up). |
| **#537 proposed** | `picked ?? { numerator: 1, denominator: 2 }` |
| **Games affected** | Frac Fact problem generation (operand pick). |
| **Why deferred** | Changes undefined → concrete fraction; would silently invent problems if a Difficulty ever mapped to `[]`. |
| **Type fix used** | `fractions[...]!` + comment (COMMON_FRACTIONS never empty today). |
| **Decision** | ☐ Yes adopt fallback · ☐ No keep assert · ☐ Other: ___ |

### TR-B2-02 — frac-fact `generateDistractors` strategy undefined → early `null`

| | |
| --- | --- |
| **File / tip line** | `src/games/frac-fact/rules.ts` ~119–120 |
| **Current** | Call `strategy()`; if index somehow undefined, throws. |
| **#537 proposed** | `if (strategy === undefined) return null;` |
| **Games affected** | Frac Fact distractor generation. |
| **Why deferred** | Turns a hard failure into a soft miss / retry path. |
| **Type fix used** | `strategies[...]!` (literal non-empty array). |
| **Decision** | ☐ Yes soft-miss · ☐ No keep assert · ☐ Other: ___ |

### TR-B2-03 — frac-fact / fraction-pinball / ramrod / sum-dominoes `shuffleArray` skip on holes

| | |
| --- | --- |
| **File / tip line** | `frac-fact/rules.ts` ~166; `fraction-pinball/rules.ts` ~185; `ramrod/types.ts` ~156; `sum-dominoes/types.ts` ~105 |
| **Current** | Swap `result[i]` ↔ `result[j]` even if either is a hole (`undefined`). |
| **#537 proposed** | `if (a === undefined \|\| b === undefined) continue;` (skip swap) |
| **Games affected** | Frac Fact / Fraction Pinball answer shuffle; Ramrod rod deal shuffle; Sum Dominoes deal shuffle. |
| **Why deferred** | Sparse-array inputs would keep different permutation order (skip vs swap-undefined). Dense copies are equivalent; still a control-flow change. |
| **Type fix used** | Read with `!`, then assign (same swap semantics). |
| **Decision** | ☐ Yes skip holes · ☐ No keep swap · ☐ Other: ___ |

### TR-B2-04 — frac-fact `generateProblem` operation default `'add'`

| | |
| --- | --- |
| **File / tip line** | `src/games/frac-fact/rules.ts` ~179 |
| **Current** | Indexed pick; empty ops list → `undefined` operation (downstream fails). |
| **#537 proposed** | `... ?? 'add'` |
| **Games affected** | Frac Fact problem generation / scoring path via operation. |
| **Why deferred** | Invents an add problem when a Difficulty's op list is empty. |
| **Type fix used** | `operations[...]!`. |
| **Decision** | ☐ Yes default add · ☐ No keep assert · ☐ Other: ___ |

### TR-B2-05 — fraction-pinball wrong-answer strategies: continue on undefined

| | |
| --- | --- |
| **File / tip line** | `src/games/fraction-pinball/rules.ts` ~82–83, ~149–150 |
| **Current** | Invoke `strategy()`; undefined throws. |
| **#537 proposed** | `if (strategy === undefined) { attempts++; continue; }` |
| **Games affected** | Fraction Pinball distractor generation. |
| **Why deferred** | Softens failure into wasted attempt. |
| **Type fix used** | `strategies[...]!`. |
| **Decision** | ☐ Yes continue · ☐ No keep assert · ☐ Other: ___ |

### TR-B2-06 — fraction-pinball `generateChallenge` fraction fallback `1/2`

| | |
| --- | --- |
| **File / tip line** | `src/games/fraction-pinball/rules.ts` ~197 |
| **Current** | Empty convertible table → `undefined` fraction. |
| **#537 proposed** | `?? ({ numerator: 1, denominator: 2 } satisfies Fraction)` |
| **Games affected** | Fraction Pinball challenge generation / answer checking. |
| **Why deferred** | Silent default challenge content. |
| **Type fix used** | `fractions[...]!`. |
| **Decision** | ☐ Yes default 1/2 · ☐ No keep assert · ☐ Other: ___ |

### TR-B2-07 — fraction-pinball `hitRandomTarget` weight skip + `targets[0]` / throw

| | |
| --- | --- |
| **File / tip line** | `src/games/fraction-pinball/rules.ts` ~259–268 |
| **Current** | `random -= weights[i]`; `targets[targetIndex]` — holes → NaN weight math / undefined target (then `.value` throws). |
| **#537 proposed** | Skip undefined weights; `targets[targetIndex] ?? targets[0]`; throw if still empty. |
| **Games affected** | Fraction Pinball scoring (points awarded on correct answer). |
| **Why deferred** | Can change which target/points are selected when weights/targets are sparse; also changes empty-input failure mode. |
| **Type fix used** | `weights[i]!` / `targets[targetIndex]!`. |
| **Decision** | ☐ Yes harden · ☐ No keep assert · ☐ Other: ___ |

### TR-B2-08 — queens-guards `getDirectionPairs` continue on undefined adjacent

| | |
| --- | --- |
| **File / tip line** | `src/games/queens-guards/rules.ts` ~100–101 |
| **Current** | Read `a.ring` / `b.ring`; holes throw. |
| **#537 proposed** | `if (a === undefined \|\| b === undefined) continue;` |
| **Games affected** | Queens & Guards legal-move / line-of-sight pairing (capture geometry). |
| **Why deferred** | Turns throw into skipped pair — different move sets if adjacency ever sparse. |
| **Type fix used** | `adjacent[i]!` / `adjacent[j]!`. |
| **Decision** | ☐ Yes skip · ☐ No keep assert · ☐ Other: ___ |

### TR-B2-09 — queens-guards `parseKey` default `0` for missing parts

| | |
| --- | --- |
| **File / tip line** | `src/games/queens-guards/types.ts` ~71–72 |
| **Current** | Malformed key (e.g. `"3"`) → `{ ring: 3, position: undefined }`. |
| **#537 proposed** | `parts[0] ?? 0`, `parts[1] ?? 0` → `{ ring: 3, position: 0 }` |
| **Games affected** | Queens & Guards any path that parses cell keys into coords (moves, selection, AI). |
| **Why deferred** | Coerces bad keys into ring-0 / pos-0 coordinates instead of undefined. |
| **Type fix used** | `parts[0]!` / `parts[1]!` (preserves tip runtime). |
| **Decision** | ☐ Yes default 0 · ☐ No keep assert · ☐ Other: ___ |

### TR-B2-10 — ramrod `createBoard` skip missing row/col sums

| | |
| --- | --- |
| **File / tip line** | `src/games/ramrod/rules.ts` ~30–35 |
| **Current** | `targetSums[row][col]` — missing row/col throws. |
| **#537 proposed** | `if (rowSums === undefined) continue;` / `if (targetSum === undefined) continue;` → omit boxes. |
| **Games affected** | Ramrod initial board / scoring targets. |
| **Why deferred** | Incomplete board (fewer SumBoxes) changes playable geometry and completion scoring. |
| **Type fix used** | `targetSums[row]![col]!`. |
| **Decision** | ☐ Yes skip cells · ☐ No keep assert · ☐ Other: ___ |

### TR-B2-11 — ramrod deal: continue when rod missing

| | |
| --- | --- |
| **File / tip line** | `src/games/ramrod/rules.ts` ~64–72 |
| **Current** | Assign `rod1.owner` / `rod2.owner`; short deal throws. |
| **#537 proposed** | `if (rod1 === undefined \|\| rod2 === undefined) continue;` |
| **Games affected** | Ramrod opening hands. |
| **Why deferred** | Unequal / short hands instead of failing fast. |
| **Type fix used** | `allRods[i * 2]!` / `allRods[i * 2 + 1]!`. |
| **Decision** | ☐ Yes skip · ☐ No keep assert · ☐ Other: ___ |

### TR-B2-12 — ramrod `createRod` / legend color default `#888888`

| | |
| --- | --- |
| **File / tip line** | `src/games/ramrod/types.ts` ~113; `board-ui.ts` ~324 |
| **Current** | Missing `ROD_COLORS[length]` → `undefined` color. |
| **#537 proposed** | `?? '#888888'` |
| **Games affected** | Ramrod rod color (UI + rod record). Not a score change, but still a runtime default #537 added. |
| **Why deferred** | Masks invalid lengths with a gray fallback. |
| **Type fix used** | `ROD_COLORS[length]!` / `ROD_COLORS[len]!`. |
| **Decision** | ☐ Yes gray fallback · ☐ No keep assert · ☐ Other: ___ |

### TR-B2-13 — ramrod `createRodSet` counts `?? 0`

| | |
| --- | --- |
| **File / tip line** | `src/games/ramrod/types.ts` ~141 |
| **Current** | `for (i < counts[length])` — missing key → `undefined` bound (loop never runs, same as 0). |
| **#537 proposed** | `counts[length] ?? 0` |
| **Games affected** | Ramrod rod inventory (latent if counts table loses a key). |
| **Why deferred** | Explicit coalesce; tip already no-ops on undefined bound, but #537 still rewrote the expression. Recut keeps tip expression via `!`. |
| **Type fix used** | `counts[length]!`. |
| **Decision** | ☐ Yes `?? 0` · ☐ No keep assert · ☐ Other: ___ |

### TR-B2-14 — sum-dominoes board-row guards → false / no-op / early `return state`

| | |
| --- | --- |
| **File / tip line** | `src/games/sum-dominoes/rules.ts` ~70–71, ~129, ~174–176, ~243, ~390–396, ~408–409 |
| **Current** | Direct `board[row][col]` access; missing row throws. `match` assumed present after valid placement. |
| **#537 proposed** | Early `continue` / `return false` / `return state` when row undefined; `adjacentRow?.[nc]`; `if (match === undefined) return state`. |
| **Games affected** | Sum Dominoes seed placement, legality (`canPlayDomino` / `isValidPlacement`), `placeDomino` apply path, win detection via hand empty after place. |
| **Why deferred** | Converts throws into soft illegal / no-op — can change whether a placement is accepted or a move is recorded. |
| **Type fix used** | `board[row]![col]` / `match!.myFace` etc. |
| **Decision** | ☐ Yes soft-guard · ☐ No keep assert · ☐ Other: ___ |

### TR-B2-15 — calla pit reads / sow increments via `?? 0`

| | |
| --- | --- |
| **File / tip line** | `src/games/calla/rules.ts` ~23, ~57, ~80–103, ~129–131; also `board-ui.ts` ~112/~134 |
| **Current** | `pits[i] > 0`, `cubesInHand = pits[i]`, `pits[i]++`. Hole → `undefined > 0` is false; `undefined++` stores `NaN`. |
| **#537 proposed** | `(pits[i] ?? 0) > 0`, `cubesInHand = pits[i] ?? 0`, `pits[i] = (pits[i] ?? 0) + 1`, capture via `?? 0`. |
| **Games affected** | Calla legal pit selection, sowing, capture counts, free-turn / end settlement (via makeMove), UI pit counts. |
| **Why deferred** | `?? 0` changes `cubesDistributed` when the pit slot is somehow undefined (`undefined` → `0` in the move record) and changes sow from `NaN` to `1` on holes. Outcome-adjacent. |
| **Type fix used** | `pits[i]!`, `= pits[i]! + 1` (same stored result as `++` for number \| undefined). |
| **Decision** | ☐ Yes coalesce · ☐ No keep assert · ☐ Other: ___ |

### TR-B2-16 — calla `getLastMoveInfo` early return on undefined lastMove

| | |
| --- | --- |
| **File / tip line** | `src/games/calla/rules.ts` ~313 |
| **Current** | After `length === 0` check, index last element; hole would throw on property read. |
| **#537 proposed** | `if (lastMove === undefined) return null;` |
| **Games affected** | Calla move-log display string (not scoring). |
| **Why deferred** | Softens sparse history into null vs throw. |
| **Type fix used** | `moveHistory[length - 1]!`. |
| **Decision** | ☐ Yes return null · ☐ No keep assert · ☐ Other: ___ |

---

## Applied without owner gate (type-only / equivalent)

| Area | Approach |
| --- | --- |
| Non-null assertions in rules/types/board-ui/game-controller | `!` after proven bounds / non-empty literals — no value change |
| queens-guards / ramrod board-ui `CellLabelParts` | Omit undefined optionals for `exactOptionalPropertyTypes`; `buildCellAriaLabel` already `filter(Boolean)` — same aria string |
| sum-dominoes `game-controller` AI first placement | `placements[0]!` after `length > 0` (equivalent to tip) |
| Ratchet IN_SCOPE + Phase-2 ceiling | Expanded path-by-path for cleared Batch-2 modules; ceiling lowered to measured out-of-scope count |

---

## Characterization tests

- **Pin current:** `tests/unit/type-ratchet-batch2-characterization.test.ts`
- Documents tip behavior for every rules/export function this recut touched.

---

## Reply template

```
TR-B2-01:
TR-B2-02:
TR-B2-03:
TR-B2-04:
TR-B2-05:
TR-B2-06:
TR-B2-07:
TR-B2-08:
TR-B2-09:
TR-B2-10:
TR-B2-11:
TR-B2-12:
TR-B2-13:
TR-B2-14:
TR-B2-15:
TR-B2-16:
```
