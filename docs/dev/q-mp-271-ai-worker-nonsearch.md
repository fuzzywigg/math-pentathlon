# q-mp-271 — `src/core/ai-worker` non-search characterization

Tests-only characterization of message plumbing, safety rejects, worker
`onerror`, deadline defaults, and seeded-RNG edge cases under
`src/core/ai-worker`. No product edits; no asserts on AI move choices,
search depth, difficulty, or move timing (Hex Hard `450` untouched).

## Coverage (ai-worker* unit suite + new file)

| Metric             |         Before |        After |
| ------------------ | -------------: | -----------: |
| Directory lines    | 79.66% (47/59) | 100% (59/59) |
| Directory branches | 61.11% (11/18) | 100% (18/18) |
| `client.ts` lines  | 76.92% (40/52) | 100% (52/52) |

## New tests

`tests/unit/ai-worker-nonsearch.test.ts` — protocol shapes, safety constant,
RNG seed edges, client deadline posting, `ok:false` → sync fallback, stale
ids, `onerror` (ErrorEvent / generic), createWorker throw, worker reuse,
dispose, generation-bump after reject.

## Verify

```bash
npx vitest run --project unit-shared tests/unit/*ai-worker*
rg -n 'hard:\s*450' src/games/hex/ai.ts
npm run lint && npm run typecheck && npm run test:unit
```
