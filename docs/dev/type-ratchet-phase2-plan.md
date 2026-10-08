# Type ratchet Phase 2 plan — AI / rules / games

**Task id:** `burn-1007-mp-typeratchet-plan`  
**Status:** planning only (no `src/` changes in this PR)  
**Base tip:** `cursor/integration-fold-wave5-tip-4af0` @ `b0d71db6666ad5800aaf8e7c25d7d97d75aa9d6e`  
**Depends on:** #498 (`tsconfig.ratchet.json` / `npm run typecheck:ratchet` — UI+core already at zero)

## Goal

Bring the remaining **out-of-scope** stricter typecheck errors (games AI, rules engines, game UI, demos, `main`) down to zero under `tsconfig.ratchet.json` (`noUncheckedIndexedAccess` + `exactOptionalPropertyTypes` + related flags), without changing AI search behavior, scoring, player-facing copy, or rules text.

Phase 1 (#498) already fails CI on any in-scope (`src/ui`, `src/core`, helpers) error. Phase 2 is a **report-only baseline + batch plan** so follow-up PRs can ratchet counts downward.

## Reproduce baseline (single command)

From repo root:

```bash
node docs/dev/type-ratchet-phase2-export.mjs
```

This runs `tsc -p tsconfig.ratchet.json`, classifies **out-of-scope** errors, and writes `docs/dev/type-ratchet-phase2-baseline.json`.

Verify counts have not increased:

```bash
node docs/dev/type-ratchet-phase2-export.mjs --check
```

Quick summary (in-scope must stay 0; out-of-scope is informational today):

```bash
npm run typecheck:ratchet
```

**Captured on tip `b0d71db6`:**

| Metric | Count |
|--------|------:|
| In-scope errors (must stay 0) | 0 |
| Out-of-scope errors (Phase 2) | **564** |
| Files with out-of-scope errors | 84 |

## Root-cause taxonomy

Classification is produced by the export script (not hand-counted). Dominant theme: **`noUncheckedIndexedAccess`**.

| Root cause | Count | Typical codes | Fix pattern (type-only) |
|------------|------:|---------------|-------------------------|
| `unchecked_index_access` | 518 | TS18048, TS2532, TS2322 (`T \| undefined` → `T`), TS2345, TS2339 on `T\|undefined` | Guard before use; narrow after `.find` / `[i]`; prefer `??` / early `continue`; avoid `!` unless invariant is proven |
| `exact_optional_property_types` | 37 | TS2379, TS2375 | Omit optional keys instead of passing `undefined`; split `T \| undefined` params vs optional props |
| `possibly_undefined_callable` | 3 | TS2722 | Guard function values from maps/records before call |
| `type_assignability` | 3 | TS2322 (non-undefined) | Adjust local types / unions without changing runtime |
| `undefined_as_index` | 2 | TS2538 | Narrow index before `obj[key]` |
| `possibly_undefined_iterable` | 1 | TS2488 | Narrow before spread / `for…of` |
| `implicit_any` | **0** | — | Not a Phase-2 driver |

**Not observed:** classic implicit-`any` floods. Almost all work is index narrowing + EOPT cleanup.

## Errors by module kind

| Kind | Count | Notes |
|------|------:|-------|
| `ai_search_scoring` | 219 | `ai.ts`, `ai-client.ts`, `ai.worker.ts` — **behavior-sensitive; last** |
| `rules_engine` | 137 | `rules.ts`, `game-state.ts` — escalate if move legality / scoring types change |
| `other_game_module` | 98 | mostly `types.ts` helpers (esp. prime-gold) + controllers |
| `game_ui` | 85 | `board-ui.ts`, `board.ts`, `board-renderer.ts` |
| `shell_misc` | 25 | `src/main.ts` + `src/demos/*` |

## Per-game error counts

| Game / bucket | Total | AI | Rules | UI | Other / shell |
|---------------|------:|---:|------:|---:|--------------:|
| prime-gold | 87 | 7 | 10 | 5 | 65 (`types.ts`) |
| stars-bars | 53 | 18 | 12 | 23 | 0 |
| contig-60 | 42 | 19 | 4 | 8 | 11 |
| kings-quadraphages | 40 | 11 | 7 | 22 | 0 |
| calla | 34 | 15 | 17 | 2 | 0 |
| hex | 32 | 17 | 11 | 4 | 0 |
| kwatro-sinko | 27 | 15 | 9 | 3 | 0 |
| sum-dominoes | 27 | 8 | 14 | 1 | 4 |
| juggle | 25 | 18 | 2 | 4 | 1 |
| fab-a-diffy | 24 | 20 | 1 | 1 | 2 |
| _demos | 23 | 0 | 0 | 0 | 23 |
| pent-em-in | 23 | 12 | 7 | 3 | 1 |
| queens-guards | 23 | 6 | 14 | 1 | 2 |
| ramrod | 20 | 8 | 6 | 2 | 4 |
| fiar | 16 | 12 | 1 | 1 | 2 |
| fraction-pinball | 15 | 2 | 13 | 0 | 0 |
| par-55 | 14 | 8 | 1 | 3 | 2 |
| frac-fact | 11 | 4 | 7 | 0 | 0 |
| hex-a-gone | 11 | 9 | 1 | 1 | 0 |
| star-track | 9 | 6 | 0 | 0 | 3 |
| remainder-islands | 6 | 4 | 0 | 1 | 1 |
| _main | 2 | 0 | 0 | 0 | 2 |
| **Total** | **564** | **219** | **137** | **85** | **123** |

Full per-file inventory: `docs/dev/type-ratchet-phase2-baseline.json` → `byFile` / `errors[]`.

## Proposed batch order

Order = **smallest / safest first**. AI search & scoring files are **last** and flagged for Andrew.

Effort key (not calendar time): **S** ≤15 errors / mechanical; **M** 16–40 or mixed files; **L** 40+ or dense helper tables / wide rules surface. Each batch should leave `npm run typecheck:ratchet` green (in-scope still 0) and preferably reduce the Phase-2 baseline via `--check` after updating the JSON in the same PR that fixes errors.

### Batch 0 — Shell / demos (safest)

| Item | Errors | Effort |
|------|------:|--------|
| `src/main.ts` | 2 | S |
| `src/demos/alignment-demo.ts`, `attribute-demo.ts`, `dice-demo.ts` | 23 | S–M |
| **Subtotal** | **25** | **S–M** |

No game rules or AI. Good warm-up for EOPT + index guards.

### Batch 1 — Tiny non-AI game surfaces

Exclude all `ai*.ts`. Fix UI / types / controllers / thin rules only.

| Game | Non-AI errors | Effort |
|------|-------------:|--------|
| remainder-islands | 2 | S |
| hex-a-gone | 2 | S |
| star-track | 3 | S |
| fab-a-diffy | 4 | S |
| fiar | 4 | S |
| par-55 | 6 | S |
| **Subtotal** | **~21** | **S** |

### Batch 2 — Small rules-heavy (still no AI files)

| Game | Non-AI (mostly rules) | Effort | Caution |
|------|----------------------:|--------|---------|
| frac-fact | 7 | S | rules.ts callables / index keys |
| juggle | 7 | S | |
| pent-em-in | 11 | S–M | |
| kwatro-sinko | 12 | M | includes iterable narrow |
| ramrod | 12 | M | |
| fraction-pinball | 13 | M | rules-heavy; no scoring logic changes |
| **Subtotal** | **~62** | **M** | Escalate if `applyMove` / winner logic types force runtime edits |

### Batch 3 — Mid-size UI + rules (no AI)

| Game | Non-AI | Effort |
|------|-------:|--------|
| hex | 15 | M |
| queens-guards | 17 | M |
| calla | 19 | M |
| sum-dominoes | 19 | M |
| contig-60 (types + board-ui + rules) | 23 | M |
| kings-quadraphages (board\* + game-state + rules) | 29 | M–L |
| stars-bars (board-ui + rules) | 35 | L |
| **Subtotal** | **~157** | **L** |

### Batch 4 — prime-gold `types.ts` helper table (mechanical, high count)

| Item | Errors | Effort |
|------|------:|--------|
| `src/games/prime-gold/types.ts` | 65 | L (repetitive index narrowing on lookup tables) |
| prime-gold board-ui + rules (non-AI) | 15 | M |
| **Subtotal** | **~80** | **L** |

Do **not** touch `prime-gold/ai.ts` here.

### Batch 5 — AI clients / workers only (thin wrappers)

Still AI-adjacent but usually option plumbing (EOPT on `AISearchOptions`), not search kernels.

| Files | ~Errors | Effort | Flag |
|-------|--------:|--------|------|
| `*/ai-client.ts`, `*/ai.worker.ts` (fab-a-diffy, fiar, hex, queens-guards) | ~13 | S | **needs Andrew: behavior-sensitive** if search option defaults change |

Prefer omitting keys over `undefined`; do not change deadline/seed semantics.

### Batch 6 — AI search / scoring kernels (**LAST**)

| Game | `ai.ts` errors | Effort | Flag |
|------|---------------:|--------|------|
| remainder-islands | 4 | S | **needs Andrew: behavior-sensitive** |
| frac-fact | 4 | S | **needs Andrew: behavior-sensitive** |
| fraction-pinball | 2 | S | **needs Andrew: behavior-sensitive** |
| queens-guards | 3 | S | **needs Andrew: behavior-sensitive** |
| star-track | 6 | S | **needs Andrew: behavior-sensitive** |
| prime-gold | 7 | S | **needs Andrew: behavior-sensitive** |
| par-55 | 8 | S–M | **needs Andrew: behavior-sensitive** |
| ramrod | 8 | S–M | **needs Andrew: behavior-sensitive** |
| sum-dominoes | 8 | S–M | **needs Andrew: behavior-sensitive** |
| fiar | 9 | M | **needs Andrew: behavior-sensitive** |
| hex-a-gone | 9 | M | **needs Andrew: behavior-sensitive** |
| kings-quadraphages | 11 | M | **needs Andrew: behavior-sensitive** |
| pent-em-in | 12 | M | **needs Andrew: behavior-sensitive** |
| hex | 13 | M | **needs Andrew: behavior-sensitive** |
| calla | 15 | M | **needs Andrew: behavior-sensitive** |
| kwatro-sinko | 15 | M | **needs Andrew: behavior-sensitive** |
| fab-a-diffy | 17 | M | **needs Andrew: behavior-sensitive** |
| juggle | 18 | M | **needs Andrew: behavior-sensitive** |
| stars-bars | 18 | M | **needs Andrew: behavior-sensitive** |
| contig-60 | 19 | M | **needs Andrew: behavior-sensitive** |
| **AI `ai.ts` subtotal** | **~206** | **L overall** | plus clients/workers in Batch 5 |

**Hard constraint for Batch 5–6:** type fixes only; no heuristic weight changes, no move-ordering changes, no depth/deadline default changes, no new randomness. Prefer local narrowing. If a clean type fix would change which move is chosen, **stop and ask Andrew**.

## Suggested PR slicing

1. One PR per batch (or per 1–3 small games inside a batch).  
2. Each fix PR: update `type-ratchet-phase2-baseline.json` via the export command so totals only fall.  
3. Keep Phase-1 CI job as-is (`permissions: contents: read`, `persist-credentials: false`); do **not** expand in-scope paths until Andrew approves a Phase-2 CI ratchet.  
4. Optional later: teach `check-type-ratchet.mjs` to also enforce `--check` against this JSON (out of scope for this planning PR).

## Proposed ratchet-baseline JSON (report-only)

Checked in: [`docs/dev/type-ratchet-phase2-baseline.json`](./type-ratchet-phase2-baseline.json).

- `reportOnly: true` — not wired to CI yet.  
- `outOfScopeErrors: 564` is the ceiling; regenerating with `--check` fails if the count goes **up**.  
- Includes `byGame`, `byFile`, `byCode`, `byRootCause`, `byKind`, and full `errors[]` for bisecting regressions.

## Deliberately left alone (this planning PR)

- All files under `src/` (no type fixes yet).  
- CI job set, budgets, visual baselines / gallery PNGs.  
- Expanding `IN_SCOPE` in `scripts/check-type-ratchet.mjs`.  
- AI behavior, scoring, tutorials, rules text.  
- Merom / Sullivan / grants / nonprofit / pappas-infrastructure topics.

## Open questions for Andrew (yes/no + recommendation)

1. **Expand CI in-scope to include `src/games/*/board-ui.ts` (and demos/main) before AI/rules?**  
   - **Recommendation: YES** — after Batches 0–1 land, fold those paths into Phase-1 scope so UI/shell cannot regress while AI remains informational.

2. **Allow `!` non-null assertions on proven board-index invariants to clear large tables (e.g. prime-gold `types.ts`) faster?**  
   - **Recommendation: YES, sparingly** — only immediately after length/bounds checks or for `as const` tables; prefer guards in hot AI loops.

3. **Should Batch 6 (AI `ai.ts`) require a human review checklist (determinism unit smoke per game) before merge?**  
   - **Recommendation: YES** — run existing AI determinism / unit suites for touched games; no new behavior tests that freeze weak play.

4. **Wire `type-ratchet-phase2-export.mjs --check` into CI as report-only (warn) or hard-fail?**  
   - **Recommendation: NO hard-fail yet** — keep report-only until ≥1 non-AI batch merges; then hard-fail on count increases only.

5. **Is changing optional `AISearchOptions` from `prop?: T` call sites that pass `undefined` to omitted keys accepted without extra review?**  
   - **Recommendation: YES** — that is the idiomatic EOPT fix and should be runtime-identical when callers already treated missing and `undefined` the same.
