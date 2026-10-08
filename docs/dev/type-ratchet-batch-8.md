# Type ratchet Batch 8 — helper-test / ambient floor (product pool exhausted)

**Task:** `burn-1008-mp-type-ratchet-batch-8`  
**Tip / base:** `cursor/integration-fold-wave5-tip-4af0` + merge of [#573](https://github.com/fuzzywigg/math-pentathlon/pull/573) Batch 7 (`cursor/type-ratchet-batch-7-76e5`)  
**Policy:** Type-only / emit-identical only — annotations, ambient `.d.mts` / `.d.ts`, `!` after proven bounds. **No** `??` / `?.` / default-value rewrites, object rebuilds/spreads, or throw guards. No `ai/` / `ai-client` / `ai.worker` (owned by open [#560](https://github.com/fuzzywigg/math-pentathlon/pull/560); tip owner restoring Queens/Kings/Contig AI). No `rules.ts` / legal-move / scoring. No tutorial / help / copy. Avoid files open in #567 / #568 / #571 / #574.

## Stacking

- Merges [#573](https://github.com/fuzzywigg/math-pentathlon/pull/573) Batch 7 onto tip first (tip did not contain it; baseline conflict resolved to Batch-7 ceiling **216**).
- **Stacks on #573; fold after #573.**

## Live inventory (after Batch 7 merge, before Batch 8)

| Slice | Count |
| --- | ---: |
| Phase-2 out-of-scope | **216** (100% `ai*` / `ai-client` / `ai.worker`) |
| In-scope | **0** |
| Eligible non-AI **product** errors | **0** (Batches 0–7 cleared UI/shell/types/rules-engine + core EOPT) |
| Remaining `*helpers*.test.ts` not yet in ratchet | **15** candidates |

Open draft [#560](https://github.com/fuzzywigg/math-pentathlon/pull/560) owns clearing the residual **216** AI errors. Batch 8 does **not** duplicate that surface.

## Cleared / locked in this batch

### A. Script-helper ambient typings (clears deferred Batch-7 blockers)

| Path | Role |
| --- | --- |
| `scripts/check-build.d.mts` | Type-only companion for `check-build.mjs` |
| `scripts/report-licenses.d.mts` | Type-only companion for `report-licenses.mjs` |
| `scripts/lib/pwa-manifest-contract.d.mts` | Type-only companion for PWA contract helpers |
| `tests/unit/shims/node-minimal.d.ts` | Minimal `node:path` / `node:url` ambients (avoids `@types/node`) |

### B. Helper-test ratchet surface (newly included + cleared / locked)

| Path | Errors before include | Style |
| --- | ---: | --- |
| `tests/unit/report-licenses-helpers.test.ts` | 13 → **0** | ambient `.d.mts` + `node:` shim + 3 length-gated `!` |
| `tests/unit/check-build-helpers.test.ts` | 2 → **0** | ambient `.d.mts` |
| `tests/unit/pwa-manifest-contract-helpers.test.ts` | 1 → **0** | ambient `.d.mts` |
| 12 other `*helpers*.test.ts` candidates | 0 → **0** (floor-locked) | include + IN_SCOPE only |
| **Helper-test surface delta** | **16 → 0** | |

Floor-locked clean helpers (already 0 under ratchet flags):

- `burn-wave35-fraction-pinball-format-helpers.test.ts`
- `burn-wave41-calla-types-helpers.test.ts`
- `burn-wave41-stars-types-diff-helpers.test.ts`
- `burn-wave42-fiar-types-graph-helpers.test.ts`
- `burn-wave42-kings-pieces-board-helpers.test.ts`
- `burn-wave42-pent-type-helpers.test.ts`
- `burn-wave44-fab-initial-types-helpers.test.ts`
- `burn-wave47-stars-types-diff-helpers.test.ts`
- `history-routing-helpers.test.ts`
- `offline-helpers.test.ts`
- `overnight-graph-directed-edge-helpers.test.ts`
- `overnight-wave50-calla-types-helpers-matrix.test.ts`

### C. Fail-scope expansion

| Path | Why |
| --- | --- |
| All Batch-8 helper tests above | Newly gated at 0 |
| `src/pwa/bootstrap.ts` | Clean shell — soft-lock |
| `src/pwa/idle-warm.ts` | Clean shell — soft-lock |

**Skipped (open PRs / hard rules):** `src/pwa/register.ts`, `src/pwa/bootstrap-owl.ts` (#568); `prime-gold/game-controller.ts` / `prime-gold-board-3d.ts` (#567); tutorials / copy; all `ai*`; `rules.ts`; #571 / #574 test files.

## Phase-2 out-of-scope ceiling

| Metric | Before Batch 8 | After Batch 8 |
| --- | ---: | ---: |
| Out-of-scope (AI residual) | 216 | **216** (unchanged — no safe product/AI-adjacent fix left) |
| In-scope | 0 | **0** |
| Helper-test errors (newly included) | 16 | **0** |

**Product-safe pool exhausted.** The only remaining Phase-2 out-of-scope errors are the **216** AI-module diagnostics owned by [#560](https://github.com/fuzzywigg/math-pentathlon/pull/560). Remaining AISearchOptions EOPT (9 TS2379) live inside each game's `ai.ts` interface — cannot widen from `core/` without touching `ai/`.

## Emit-identity

Batch 8 touches **no** product `src/**/*.ts` modules (only type ambients beside `.mjs`, helper tests, ratchet scripts/docs, and PWA soft-lock scope).

Merged Batch 7 `src/` modules remain emit-identical (re-checked against Batch-7 base):

| Module | Status |
| --- | --- |
| `src/core/ai-worker/client.ts` | identical (from #573) |
| `src/core/ai-worker/protocol.ts` | identical (types-only; from #573) |

```bash
node scripts/check-emit-identity.mjs --base <pre-batch7-tip> \
  --files-from <client.ts,protocol.ts>
# → All file(s) emit-identical.
```

## Deferred (untouched) — remaining pool

| File / area | Count / note | Reason |
| --- | --- | --- |
| All `ai.ts` / `ai-client.ts` / `ai.worker.ts` | **216** | [#560](https://github.com/fuzzywigg/math-pentathlon/pull/560) OWNER OPTION; tip owner AI restore; Hex Hard 450ms stays |
| Remaining AISearchOptions EOPT | 9 | Defined inside `ai.ts`; cannot widen without `ai/` |
| `tutorial.ts` / help / copy | 0 errors today | Hard rule — skipped |
| `prime-gold/game-controller.ts` | — | Open [#567](https://github.com/fuzzywigg/math-pentathlon/pull/567) |
| `src/pwa/{register,bootstrap-owl}.ts`, `game-route-mounts.ts` | — | Open [#568](https://github.com/fuzzywigg/math-pentathlon/pull/568) |
| Held pent-em-in BoardCell EOPT rebuild | — | Andrew / Batch 6 hold |
| Stars & Bars history cap | — | Hard rule — not touched |
| #571 / #574 test files | — | Open coverage PRs — not touched |

## Reproduce

```bash
npx tsc --noEmit -p tsconfig.ratchet.json --pretty false 2>&1 | rg -c "error TS"
# expect 216

npm run typecheck:ratchet
# in-scope 0; out-of-scope 216 ≤ baseline 216

node docs/dev/type-ratchet-phase2-export.mjs --check
```
