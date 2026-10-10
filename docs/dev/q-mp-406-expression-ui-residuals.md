# q-mp-406 — expression-ui soft-fail residuals (tests-only)

Tip-base characterization for `src/core/expressions/expression-ui.ts` drop /
slot / empty-card soft paths on `cursor/mp-tip-post865` @ `3908809d`.

Structural asserts only — no player-facing copy pins. No `src/` edits.

## Stale-spec re-measure (post865 vs backlog post830)

| Claim in `backlog-2026-10-10c`      | Live tip post865                                                                                                      |
| ----------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| LOC **815**                         | **815** (held)                                                                                                        |
| Overlay nnnull **7**                | **7** (`report:lint-buckets` path bucket; sites L286/L320/L378/L404/L412/L741/L750)                                   |
| “only **3** dedicated unit matches” | **25** test files import `expression-ui`                                                                              |
| Tip lacks characterization          | **q-mp-326** already on tip (`tests/unit/q-mp-326-expression-ui-residuals.test.ts`, `#818` tip-equivalent)            |
| Leave `#826` contained              | **Stale id** — `#826` is prime-gold layout reads; expression-ui soft-fail draft is **`#818`** (commented `contained`) |

## Display-only screen for `q-mp-396` (nnnull clear)

**Verdict: display / interaction chrome only — not scoring or legal-move owner.**

- Product `src/` consumers outside demos: **none** (only `src/demos/expression-demo.ts`).
- Imports `validateSlots` / `evaluate` / `formatNumber` solely to paint result chrome and drive the interactive builder’s optional `onComplete` callback.
- Does **not** define game scoring, win records, AI search, or `*/rules.ts` legal moves.
- Safe screening signal for `q-mp-396`: nnnull clear may rewrite guards around the 7 `!` sites without touching evaluator / rules / scoring modules (still verify expression unit suites).

## Overlap

- `#818` / tip `q-mp-326` — prior soft-fail residuals (empty-build chrome, locked drop, usedIds tray). Leave open with `contained`.
- `#778` / tip `mutation-ui8-expression-ui` — SVG text-centering mutation pins (orthogonal).
- `q-mp-396` — product nnnull clear (serialize lightly; this PR is tests-only).

## Coverage (`expression-ui.ts`, focused host suite)

Focused suite: tip `*expression*` / `*expr-ui*` / `mutation-ui8-expression*` / `q-mp-326*` ± this file.

| Metric     | Before (tip host) | After (+ this file) |   Δ |
| ---------- | ----------------: | ------------------: | --: |
| Statements |    100% (234/234) |      100% (234/234) |   0 |
| Branches   |      100% (96/96) |        100% (96/96) |   0 |
| Lines      |    100% (234/234) |      100% (234/234) |   0 |
| Functions  |      100% (31/31) |        100% (31/31) |   0 |

Line coverage was already saturated by tip `q-mp-326`; this round adds **contract pins** for drop-null / empty-slot / empty-tray / sparse `card!` / evaluate-fail soft paths around the nnnull sites.

## Tests

`tests/unit/q-mp-406-expression-ui-residuals.test.ts` (10 cases). Not registered in
`vitest.config.ts` (default `unit-shared`).
