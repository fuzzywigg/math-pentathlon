# q-mp-570 — expression-ui DISPLAY soft-fail residuals (tests-only)

Tip-base characterization for `src/core/expressions/expression-ui.ts`
**DISPLAY** soft-fail residuals on `cursor/mp-tip-post1012` @ `f1838cd4`.

Structural asserts only — no player-facing copy / aria pins. No `src/` edits.
DISPLAY chrome only — not the evaluator product clear.

## Live tip re-measure (post1012)

| Claim in `backlog-2026-10-10s`              | Live tip post1012 @ `f1838cd4`                                      |
| ------------------------------------------- | ------------------------------------------------------------------- |
| LOC **815**                                 | **815** (held)                                                      |
| Overlay nnnull **7**                        | **7** (`report:lint-buckets` path bucket; leave `q-mp-396`)         |
| “**27** test-name matches”                  | **29** unit files import `expression-ui` before this suite          |
| Cold UI residual after mounts `#1006`       | Mounts soft-fail tip-folded; expression DISPLAY chars deferred here |
| Leave undrafted `396` nnnull with contained | **Held** — this PR writes no ratchet / nnnull ceiling               |

Focused tip host suites (`*expression-ui*` / `*expr-ui*` / `q-mp-326*` /
`q-mp-406*` / `mutation-ui{8,19}-expression*` / engine r19+r20) already report
**100%** statements / branches / lines / functions on `expression-ui.ts`.
This round adds **DISPLAY soft-fail contract pins**, not coverage deltas.

## DISPLAY soft-fail residuals pinned

| Arm                                                             | Disposition | How                                              |
| --------------------------------------------------------------- | ----------- | ------------------------------------------------ |
| Calculator: error + defined result → error wins                 | **Pinned**  | Both args set; red result child, no green equals |
| Calculator: `result === 0` success chrome                       | **Pinned**  | Green result child; non-empty text               |
| Calculator: empty expr, no result/error → blank result child    | **Pinned**  | Result child `textContent === ''`                |
| Builder: evaluable without `targetValue` → neutral + `<strong>` | **Pinned**  | Never `valid`; no checkmark / target hint        |
| Builder: `canEvaluate:false` + empty errors → neutral prompt    | **Pinned**  | Mock `validateSlots` DISPLAY soft path           |
| Builder: abs(delta) &lt; 0.0001 → `valid`                       | **Pinned**  | Mocked result `10.00005` vs target `10`          |
| Builder: abs(delta) ≥ 0.0001 → neutral miss                     | **Pinned**  | Mocked result `10.0002` vs target `10`           |
| Interactive miss-target: result chrome stays non-valid          | **Pinned**  | Complements wave-35 onComplete skip              |
| Challenge card empty numbers + no onClick                       | **Pinned**  | Zero `.numbers span`; click inert                |

## Overlap

| PR / topic                                        | Action                                                            |
| ------------------------------------------------- | ----------------------------------------------------------------- |
| tip-folded `#1002` / `q-mp-547` (engine r19)      | **Do not duplicate** remove / Clear All pins                      |
| tip-folded `#1010` / `q-mp-548` (mutation UI w19) | **Do not duplicate** SVG / drag / slot first-20 pins              |
| tip-folded engine r20                             | **Do not duplicate** dragover/leave + tray draggable pins         |
| tip `q-mp-326` / `#818`                           | Prior soft-fail residuals — leave open **contained**              |
| tip `q-mp-406` / `#885`                           | Drop/slot/empty soft residuals — leave open **contained**         |
| undrafted `q-mp-396`                              | nnnull product clear — leave **contained**; no ceiling write here |
| Open drafts into `cursor/mp-tip-post1012`         | None at start of this work                                        |

## Tests

`tests/unit/q-mp-570-expression-ui-display-soft-fail-residuals.test.ts`
(9 cases). Default `unit-shared` (not registered in `vitest.config.ts`).

## Verification

```bash
npx vitest run --project unit-shared tests/unit/*expression*
npm run verify
```
