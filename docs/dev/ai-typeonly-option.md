# OWNER OPTION — AI type-only emit-identical ratchet clear

**Task:** `burn-1008-mp-ai-typeonly-emit-identical`  
**Base:** `cursor/integration-fold-wave5-tip-4af0` + [#553](https://github.com/fuzzywigg/math-pentathlon/pull/553) trail + [#557](https://github.com/fuzzywigg/math-pentathlon/pull/557) Batch 6 (ceiling **220** AI-only)  
**Policy:** Type annotations / type-only imports / interfaces / generics / `!` / `as` / `satisfies` only. **Emitted JavaScript must be byte-for-byte identical** (proved by `npm run check:emit-identity` → `scripts/check-emit-identity.mjs`). No `??` / `?.` / defaults / guards / reordering / new runtime variables. No search depth/time budget, scoring, difficulty, timing, or RNG changes. Hex Hard assert stays **450ms**. No Stars & Bars history cap.

## Fold guidance

**OWNER OPTION:** touches `ai/` type annotations only; emitted JS byte-identical (proof below); fold only if Andrew approves, after #557 and after D07 is decided.

A parallel agent is preparing revertable alpha-restore commits for tip-vs-alpha AI/copy deltas (owner decision D07 in #549). Expect trivial conflicts.

## Stacking

1. Tip (`cursor/integration-fold-wave5-tip-4af0`) already carried Batch 5 UI via #544 folds (ceiling 286).
2. Brought [#553](https://github.com/fuzzywigg/math-pentathlon/pull/553) trail doc (`type-ratchet-batch5.md`); product hunks skipped (already on tip).
3. Cherry-picked [#557](https://github.com/fuzzywigg/math-pentathlon/pull/557) Batch 6 → ceiling **220** (AI-only).
4. This option clears those **220** with emit-identical type-only edits → ceiling **0**.

## Per-file before → after (ratchet errors)

| Path | Before | After | Cleared |
| --- | ---: | ---: | ---: |
| `src/games/contig-60/ai.ts` | 19 | 0 | 19 |
| `src/games/juggle/ai.ts` | 18 | 0 | 18 |
| `src/games/stars-bars/ai.ts` | 18 | 0 | 18 |
| `src/games/fab-a-diffy/ai.ts` | 17 | 0 | 17 |
| `src/games/kwatro-sinko/ai.ts` | 16 | 0 | 16 |
| `src/games/calla/ai.ts` | 15 | 0 | 15 |
| `src/games/hex/ai.ts` | 13 | 0 | 13 |
| `src/games/pent-em-in/ai.ts` | 12 | 0 | 12 |
| `src/games/kings-quadraphages/ai.ts` | 11 | 0 | 11 |
| `src/games/fiar/ai.ts` | 9 | 0 | 9 |
| `src/games/hex-a-gone/ai.ts` | 9 | 0 | 9 |
| `src/games/par-55/ai.ts` | 8 | 0 | 8 |
| `src/games/ramrod/ai.ts` | 8 | 0 | 8 |
| `src/games/sum-dominoes/ai.ts` | 8 | 0 | 8 |
| `src/games/prime-gold/ai.ts` | 7 | 0 | 7 |
| `src/games/star-track/ai.ts` | 6 | 0 | 6 |
| `src/games/frac-fact/ai.ts` | 4 | 0 | 4 |
| `src/games/remainder-islands/ai.ts` | 4 | 0 | 4 |
| `src/games/hex/ai-client.ts` | 3 | 0 | 3 |
| `src/games/queens-guards/ai.ts` | 3 | 0 | 3 |
| `src/games/fab-a-diffy/ai-client.ts` | 2 | 0 | 2 |
| `src/games/fiar/ai-client.ts` | 2 | 0 | 2 |
| `src/games/fraction-pinball/ai.ts` | 2 | 0 | 2 |
| `src/games/queens-guards/ai-client.ts` | 2 | 0 | 2 |
| `src/games/fab-a-diffy/ai.worker.ts` | 1 | 0 | 1 |
| `src/games/fiar/ai.worker.ts` | 1 | 0 | 1 |
| `src/games/hex/ai.worker.ts` | 1 | 0 | 1 |
| `src/games/queens-guards/ai.worker.ts` | 1 | 0 | 1 |
| **Total** | **220** | **0** | **220** |

Phase-2 out-of-scope ceiling: **220 → 0**.

`src/games/queens-guards/ai.worker.ts` cleared transitively by widening `AISearchOptions` in `ai.ts` (worker file bytes unchanged; still included in emit-identity check).

## Fix style (emit-erased)

| Pattern | Use |
| --- | --- |
| NUI dense boards / grids | `board[row]![col]!` after bounds |
| NUI length-gated index | `arr[i]!` when `length` / non-empty filter gates |
| NUI direction tuples | `dr!` / `dc!` from literal `directions` |
| `T \| undefined` → `T \| null` return | `return best!` (emit still `return best`) |
| EOPT optional props | widen `seed?: number` → `seed?: number \| undefined` (and `deadlineMs` / `now` / `hint`) |
| EOPT request payloads | `as AiWorkerRequestPayload` on the object literal |

## Emit-identity command and output

Baseline ref = Batch-6 tip after #557 (`c383a5de747a88c081b2622d051f203301343340`).

```bash
git diff --name-only c383a5de747a88c081b2622d051f203301343340 -- 'src/games/**/ai*.ts' \
  | sort -u > /tmp/touched-ai.txt
echo 'src/games/queens-guards/ai.worker.ts' >> /tmp/touched-ai.txt
sort -u /tmp/touched-ai.txt -o /tmp/touched-ai.txt
npm run check:emit-identity -- \
  --base c383a5de747a88c081b2622d051f203301343340 \
  --files-from /tmp/touched-ai.txt
```

Output (exit 0):

```text
check-emit-identity
  base: c383a5de747a88c081b2622d051f203301343340
  head: WORKING_TREE
  files: 28
  OK           src/games/calla/ai.ts
  OK           src/games/contig-60/ai.ts
  OK           src/games/fab-a-diffy/ai-client.ts
  OK           src/games/fab-a-diffy/ai.ts
  OK           src/games/fab-a-diffy/ai.worker.ts
  OK           src/games/fiar/ai-client.ts
  OK           src/games/fiar/ai.ts
  OK           src/games/fiar/ai.worker.ts
  OK           src/games/frac-fact/ai.ts
  OK           src/games/fraction-pinball/ai.ts
  OK           src/games/hex-a-gone/ai.ts
  OK           src/games/hex/ai-client.ts
  OK           src/games/hex/ai.ts
  OK           src/games/hex/ai.worker.ts
  OK           src/games/juggle/ai.ts
  OK           src/games/kings-quadraphages/ai.ts
  OK           src/games/kwatro-sinko/ai.ts
  OK           src/games/par-55/ai.ts
  OK           src/games/pent-em-in/ai.ts
  OK           src/games/prime-gold/ai.ts
  OK           src/games/queens-guards/ai-client.ts
  OK           src/games/queens-guards/ai.ts
  OK           src/games/queens-guards/ai.worker.ts
  OK           src/games/ramrod/ai.ts
  OK           src/games/remainder-islands/ai.ts
  OK           src/games/stars-bars/ai.ts
  OK           src/games/star-track/ai.ts
  OK           src/games/sum-dominoes/ai.ts

All 28 file(s) emit-identical.
```

Checker: `npm run check:emit-identity` → [`scripts/check-emit-identity.mjs`](../../scripts/check-emit-identity.mjs) (esbuild transpile at two git refs with repo `target` / `useDefineForClassFields`; raw byte compare). Unit coverage: `tests/unit/check-emit-identity.test.ts`.

**Knip note:** the checker imports `esbuild`, which is present only as a Vite transitive (`vite` → `esbuild`) and is **not** declared in `package.json` `devDependencies`. Knip therefore reports it under `unlisted` (stable count **3** with the two offline-probe `playwright` hits). That is intentional — do not add `esbuild` to `knip.json` `ignoreDependencies` or promote knip enforce without tip-owner approval. Details: [`knip-report.md`](./knip-report.md#unlisted-script-dependencies-owners).

## Deferred (would change emitted JS)

None for the 220 AI-module ratchet errors — all cleared with emit-erased constructs.

Intentionally **not** applied (would change JS / behavior; out of this option’s scope):

| Item | Why deferred |
| --- | --- |
| Conditional EOPT spreads (`...(x !== undefined ? { x } : {})`) | Changes object construction emit |
| `??` / `?.` / early `continue` / default fallbacks in AI search | Runtime-semantic (see Batch 2 owner decisions pattern) |
| Search depth / deadline / scoring / difficulty / RNG edits | Frozen AI behavior |
| Hex Hard `450` → other | Hard rule — assert stays 450ms |
| Stars & Bars history cap | Hard rule — not touched |
| D07 tip-vs-alpha AI/copy restore | Separate owner decision (#549); parallel agent |

## Hard-rule checks

```bash
rg -n 'hard: 450' src/games/hex/ai.ts
# → 21:  hard: 450,
```

Stars & Bars history loop uncapped (no AI-file history-cap edit).

## Reproduce

```bash
npx tsc --noEmit -p tsconfig.ratchet.json --pretty false 2>&1 | rg -c "error TS"
# expect 0
npm run typecheck:ratchet
# in-scope 0; out-of-scope 0 ≤ baseline 0
```
