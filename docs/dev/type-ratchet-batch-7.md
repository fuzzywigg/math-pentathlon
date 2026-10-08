# Type ratchet Batch 7 — shell / helper-test floor lock

**Task:** `burn-1008-mp-type-ratchet-batch-7`  
**Tip / base:** `cursor/integration-fold-wave5-tip-4af0` (post-#557 Batch 6 fold)  
**Policy:** Type-only / emit-identical only — annotations, `import type`, `!` after proven bounds, EOPT optional widens. **No** `??` / `?.` / default-value rewrites, object rebuilds/spreads, or throw guards. No AI modules (owned by open [#560](https://github.com/fuzzywigg/math-pentathlon/pull/560)). No `rules.ts` / legal-move / scoring. No tutorial / help / copy. Avoid files open in #562 / #566 / #567 / #568 / #571.

## Live tip inventory (before Batch 7)

| Slice | Count |
| --- | ---: |
| Out-of-scope under `tsconfig.ratchet.json` | **220** (100% `ai*` / `ai-client` / `ai.worker`) |
| In-scope | **0** |
| Eligible non-AI product errors | **0** (Batches 0–6 cleared UI/shell/types/rules-engine) |

Open draft [#560](https://github.com/fuzzywigg/math-pentathlon/pull/560) already proposes clearing the remaining **220** AI errors with emit-identical `!` / EOPT. Batch 7 does **not** duplicate that surface.

## Cleared / locked in this batch

### A. Core EOPT widen (drops Phase-2 ceiling)

| Path | Change | Out-of-scope delta |
| --- | --- | ---: |
| `src/core/ai-worker/client.ts` | `seed?` / `deadlineMs?` → `number \| undefined` on `AiWorkerRequestPayload` | clears 4 AI worker-payload TS2379 call sites |
| `src/core/ai-worker/protocol.ts` | same on `AiWorkerRequestBase` | (types-only emit) |

**Ceiling: 220 → 216.**

### B. Helper-test ratchet surface (newly included + cleared)

| Path | Errors cleared | Style |
| --- | ---: | --- |
| `tests/unit/burn-wave14-types-helpers.test.ts` | 11 | dense `!` after known factory lengths |
| `tests/unit/burn-wave41-fab-pass-winner-helpers.test.ts` | 8 | map-key `!` |
| `tests/unit/burn-wave35-ramrod-box-format-helpers.test.ts` | 7 | `!` + `getValidPlacements(state, rodId)` arity match |
| `tests/unit/burn-wave35-fab-a-diffy-format-helpers.test.ts` | 4 | bar-id / fraction `!` |
| `tests/unit/overnight-dice-selector-reset-helpers.test.ts` | 1 | `COMMON_DICE_SETS.standard!` |
| **Total newly gated + cleared** | **31** | |

### C. Fail-scope expansion (already-clean modules locked at 0)

Expanded `IN_SCOPE` in `scripts/check-type-ratchet.mjs` + `docs/dev/type-ratchet-phase2-export.mjs` to cover remaining non-AI / non-rules / non-tutorial game shell modules (controllers, types, board-ui leftovers, board-3d-loaders, kings pieces/serialization, fiar layout, calla index). **Skipped:** `tutorial.ts`, `prime-gold/game-controller.ts` (#567), `src/pwa/*` / `src/ui/game-route-mounts.ts` (#568), `src/ui/three/prime-gold-board-3d.ts` (#567).

### D. Emit-identity tooling

| Path | Why |
| --- | --- |
| `scripts/check-emit-identity.mjs` | Reusable esbuild emit diff (same checker as #560; not AI-specific when `--files-from` is passed) |
| `tests/unit/check-emit-identity.test.ts` | Unit coverage under `unit-node` |
| `vitest.config.ts` | Add checker test to `nodePureFiles` |

## Emit-identity table (touched `src/` modules)

Base tip SHA: `6e75e5d934bb46efd63d962367562011150b2c45`

| Module | Emit status |
| --- | --- |
| `src/core/ai-worker/client.ts` | **identical** |
| `src/core/ai-worker/protocol.ts` | **identical** (types-only → empty emit both sides) |

```bash
node scripts/check-emit-identity.mjs --base 6e75e5d934bb46efd63d962367562011150b2c45 \
  --files-from <batch7 src list>
# → All 2 file(s) emit-identical.
```

Helper-test edits are test-only (not product emit). Ramrod helper now calls `getValidPlacements(state, rodId)` (2-arg API); assertion remains `length >= 0`.

## Before / after counts

| Metric | Before | After |
| --- | ---: | ---: |
| Phase-2 out-of-scope | 220 | **216** |
| Phase-2 in-scope | 0 | **0** |
| Helper-test errors (newly included) | 31 | **0** |
| AI residual (deferred to #560) | 220 | **216** |

## Deferred (untouched) — with reason

| File / area | Reason |
| --- | --- |
| All `ai.ts` / `ai-client.ts` / `ai.worker.ts` | AI — [#560](https://github.com/fuzzywigg/math-pentathlon/pull/560) OWNER OPTION; Hex Hard 450ms stays |
| Remaining AISearchOptions EOPT (11) | Defined inside `ai.ts`; cannot widen without touching `ai/` |
| `tests/unit/report-licenses-helpers.test.ts` (13) | Needs `node:` typings / `.mjs` ambient; no `@types/node` on tip |
| `tests/unit/check-build-helpers.test.ts` (2) | `.mjs` ambient |
| `tests/unit/pwa-manifest-contract-helpers.test.ts` (1) | `.mjs` ambient |
| `tutorial.ts` / help / copy | Hard rule — skipped |
| `prime-gold/game-controller.ts` | Open [#567](https://github.com/fuzzywigg/math-pentathlon/pull/567) |
| `src/pwa/*`, `game-route-mounts.ts` | Open [#568](https://github.com/fuzzywigg/math-pentathlon/pull/568) |
| Held pent-em-in BoardCell EOPT rebuild | Andrew / Batch 6 hold |
| Stars & Bars history cap | Hard rule — not touched |

## Reproduce

```bash
npx tsc --noEmit -p tsconfig.ratchet.json --pretty false 2>&1 | rg -c "error TS"
# expect 216

npm run typecheck:ratchet
# in-scope 0; out-of-scope 216 ≤ baseline 216

node docs/dev/type-ratchet-phase2-export.mjs --check
```
