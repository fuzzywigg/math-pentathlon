# Demo coverage — `alignment-demo` (`q-mp-604`)

Tests-only raise of `src/demos/alignment-demo.ts` from **0%** lines under the
dedicated `tests/unit/*alignment-demo*` verification glob. Structural asserts
only; no product / copy / AI / ratchet edits.

**Base:** `cursor/mp-tip-post1012` @ `780db960` (remeasured). Draft only — tip
owner folds.

## Scope

- New: `tests/unit/q-mp-604-alignment-demo-coverage.test.ts` (11 tests)
- Mount chrome + four-in-row / hex-connect / potential interaction arms
- No `src/` edits; no copy pins; no ratchet JSON

## Overlap with open drafts

No open draft into `cursor/mp-tip-post1012` owns dedicated `*alignment-demo*`
coverage. Overnight/burn align hosts exist outside this glob; leave them
(**contained** — no comments). Mutation `q-mp-618` is tests-only on the same
host — serialize lightly at fold.

## Measured before → after

Focused command (spec verification) on tip `780db960`:

```text
npm run test:unit:coverage -- --coverage.include=src/demos/alignment-demo.ts \
  tests/unit/*alignment-demo*
```

| File                          |      Before lines | Before branches |          After lines |     After branches | Δ lines (pp) | Δ branches (pp) |
| ----------------------------- | ----------------: | --------------: | -------------------: | -----------------: | -----------: | --------------: |
| `src/demos/alignment-demo.ts` | 0.00% (**0**/219) |    0.00% (0/72) | **99.08%** (217/219) | **90.27%** (65/72) |   **+99.08** |      **+90.27** |

Residual arms left intentional: `getBoardCell` / `setBoardCell` undefined-row
guards (`:44`, `:58`) — unreachable via the public `renderAlignmentDemo` API
without product edits. Functions **100%** (27/27).
