# Type ratchet Batch 9 — post-restore UI/shell floor re-clear

**Task:** `burn-1008-mp-type-ratchet-batch-9`  
**Tip / base:** `cursor/integration-fold-wave5-tip-4af0` + merge of [#573](https://github.com/fuzzywigg/math-pentathlon/pull/573) Batch 7 then [#576](https://github.com/fuzzywigg/math-pentathlon/pull/576) Batch 8  
**Policy:** Type-only / emit-identical only — dense-grid / bounds-proven `!`, EOPT optional widens (`prop?: T | undefined`), `as const` on fixed direction tuples. **No** `??` / `?.` / default-value rewrites, object rebuilds/spreads, throw guards, or intermediate locals that change emit. No AI modules (owned by open [#560](https://github.com/fuzzywigg/math-pentathlon/pull/560)). No tutorial / help / copy. Avoid files open in #567 / #568 / #571 / #566.

## Stacking

- Merges [#573](https://github.com/fuzzywigg/math-pentathlon/pull/573) Batch 7 onto tip first (baseline tipSha conflict → Batch-7 ceiling **216**).
- Then merges [#576](https://github.com/fuzzywigg/math-pentathlon/pull/576) Batch 8 (baseline tipSha conflict → Batch-8 metadata; ceiling still **216**).
- **Stacks on #576; fold after #576.**

## Why Batch 8’s “product pool exhausted” was not the live tip

Batch 8 correctly cleared helper-test / ambient floors against a tip that still held Batches 0–7 UI/shell `!` annotations. Tip commit `5aa092d4` (**restore alpha AI/copy surfaces**) then restored alpha `board-ui` / selected `game-controller` / `calla/rules` content for Friday GO, **wiping prior type-only `!` / EOPT floor locks** while leaving those paths in `IN_SCOPE`.

Live inventory **after** Batch 7+8 merge, **before** Batch 9 fixes:

| Slice | Count |
| --- | ---: |
| Phase-2 out-of-scope (AI residual) | **216** |
| In-scope (restore regressions) | **71** |
| Of which UI/shell/board-a11y/EOPT | **54** |
| Of which `calla/rules.ts` (Batch-2 lock) | **17** |
| Eligible new product surface beyond re-clear | **0** |

Open draft [#560](https://github.com/fuzzywigg/math-pentathlon/pull/560) still owns the residual **216** AI errors. Batch 9 does **not** duplicate that surface.

## Cleared in this batch

### A. Shared EOPT widens (types-only emit)

| Path | Change |
| --- | --- |
| `src/ui/board-a11y.ts` | `CellLabelParts` optionals → `T \| undefined` (clears board-ui EOPT call sites incl. pent-em-in) |
| `src/ui/three/star-track-board-3d.ts` | `StarTrackBoard3DCallbacks` optionals → `T \| undefined` (clears star-track game-controller EOPT) |
| `src/games/kings-quadraphages/board-ui.ts` | local `BoardClickBinding.onCellClick?: … \| undefined` |

### B. Dense-grid / bounds-proven `!` re-clear (emit-identical)

| Path | Errors cleared | Style |
| --- | ---: | --- |
| `src/games/stars-bars/board-ui.ts` | 29 | inline `cells[r]![c]!`; `as const` directions; history `!` |
| `src/games/kings-quadraphages/board-ui.ts` | 13 | dense board `!`; lastMove `!`; EOPT widen |
| `src/games/juggle/board-ui.ts` | 4 | grid `!`; dice tuple `!` |
| `src/games/hex/board-ui.ts` | 4 | dense board `!`; lastMove `!` |
| `src/games/calla/board-ui.ts` | 2 | pits `!` after `PITS_PER_SIDE` loop |
| `src/games/calla/rules.ts` | 17 | Batch-2 lock restore re-clear (`!++` / index `!`; no `++`→`=+1` rewrite) |
| **Total in-scope cleared** | **71** | |

`pent-em-in/board-ui.ts` and `star-track/game-controller.ts` needed **no local edits** — cleared by the shared EOPT widens above.

### C. Fail-scope

No new `IN_SCOPE` expansion. Soft-locks from Batches 7–8 retained. Skipped open-PR surfaces: #567 prime-gold controller/3d, #568 `pwa/register` + `bootstrap-owl` + `game-route-mounts`, #566/#571/#574/#577 coverage helpers, tutorials/copy, all `ai*`.

## Emit-identity

Pre-change base (post #573+#576 merge): `c8acb908ccdffd30103645e3d56b78c7eceaa8d3`

| Module | Emit status |
| --- | --- |
| `src/ui/board-a11y.ts` | **identical** (types-only) |
| `src/ui/three/star-track-board-3d.ts` | **identical** (types-only) |
| `src/games/calla/board-ui.ts` | **identical** |
| `src/games/calla/rules.ts` | **identical** |
| `src/games/hex/board-ui.ts` | **identical** |
| `src/games/juggle/board-ui.ts` | **identical** |
| `src/games/kings-quadraphages/board-ui.ts` | **identical** |
| `src/games/stars-bars/board-ui.ts` | **identical** |

```bash
node scripts/check-emit-identity.mjs --base c8acb908ccdffd30103645e3d56b78c7eceaa8d3 \
  --files-from <batch9 src list>
# → All 8 file(s) emit-identical.
```

Note: an intermediate `rowCells` local in stars-bars was rejected (emit DIFF); final form keeps `state.cells[row]![col]!` inline.

## Before / after counts

| Metric | Before Batch 9 | After Batch 9 |
| --- | ---: | ---: |
| Phase-2 out-of-scope (AI) | 216 | **216** |
| Phase-2 in-scope | 71 | **0** |
| Total ratchet `error TS` | 287 | **216** |

## Deferred (untouched) — remaining pool

| File / area | Count / note | Reason |
| --- | --- | --- |
| All `ai.ts` / `ai-client.ts` / `ai.worker.ts` | **216** | [#560](https://github.com/fuzzywigg/math-pentathlon/pull/560) OWNER OPTION; tip AI restore frozen GO; Hex Hard 450ms stays |
| Remaining AISearchOptions EOPT | inside `ai.ts` | Cannot widen without touching `ai/` |
| `tutorial.ts` / help / copy | 0 errors today | Hard rule — skipped |
| `prime-gold/game-controller.ts` / `prime-gold-board-3d.ts` | — | Open [#567](https://github.com/fuzzywigg/math-pentathlon/pull/567) |
| `src/pwa/{register,bootstrap-owl}.ts`, `game-route-mounts.ts` | — | Open [#568](https://github.com/fuzzywigg/math-pentathlon/pull/568) |
| Held pent-em-in BoardCell EOPT rebuild | — | Andrew / Batch 6 hold |
| Stars & Bars history cap | — | Hard rule — not touched |
| `tests/unit/burn-1008-ui-cov-r2-shell-helpers.test.ts` | not gated | Open [#566](https://github.com/fuzzywigg/math-pentathlon/pull/566) — avoid duplicate |
| #571 / #574 / #577 / #578 test files | — | Open coverage PRs — not touched |

**Safe UI/shell/state pool after this batch:** exhausted again (aside from open-PR-owned soft skips). Next measurable Phase-2 drop requires AI (#560) or owned open-PR surfaces after those fold.

## Reproduce

```bash
npx tsc --noEmit -p tsconfig.ratchet.json --pretty false 2>&1 | rg -c "error TS"
# expect 216

npm run typecheck:ratchet
# in-scope 0; out-of-scope 216 ≤ baseline 216

node docs/dev/type-ratchet-phase2-export.mjs --check
```
