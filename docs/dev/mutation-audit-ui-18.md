# Mutation audit — UI / shell wave 18 (q-mp-527)

Tests-only mutation measurement continuing wave 1 (`docs/dev/mutation-audit-ui.md`)
through wave 17 (`docs/dev/mutation-audit-ui-17.md`). This wave remeasures preferred
disjoint hosts: `dice-selector`, `board-a11y`, and `pointer-hygiene`.

Remeasured on tip `cursor/mp-tip-post949` @ `8698fffb` (hosts unchanged through
tip-owner AGENTS/wiki pointer folds). Spec LOC (**463** / **545** / **326**) match
live tip. Prior-wave stamps: dice-selector wave-9 after **100%**, board-a11y
wave-10 after **95%**, pointer-hygiene wave-13 after **100%**.

## Scope

**In (this wave):**
`src/core/dice/dice-selector.ts`,
`src/ui/board-a11y.ts`,
`src/ui/pointer-hygiene.ts` (tests only — kill clear survivors / structural
re-pins; no `src/` edits).

**Out:** `ai/`, `*/rules.ts`, engine legal-move/scoring, tutorials/copy,
player-facing string assertions, AI move choice / timing.
No `src/` product edits. Wave 16/17 hosts (owl-component / graph-ui /
pwa-register / game-shell / highlight-ui / sanitize) are not repeated. No
board-3d layout product edits.

**Overlap avoided:**

- Open `#981` (`q-mp-521` dice-selector soft-fail char) / `#986` (`q-mp-522`
  board-a11y soft-fail char) / `#984` (`q-mp-523` pointer-hygiene soft-fail
  char) — separate `q-mp-521-*` / `q-mp-522-*` / `q-mp-523-*` files; this wave
  uses `mutation-ui18-*.test.ts` only and stays off catch / soft-fail arms
  (coordinate-by-avoidance).
- Open `#972` (`q-mp-507` mutation UI w17 into post914) / `#957` (`q-mp-478`
  mutation UI w16) — hosts disjoint; left open.
- Waves 2 / 9 / 10 / 13 — intentional first-20 remeasure + wave-18 re-pins; did
  not edit those suites.

## Harness

1. **Stryker probe:** same failure mode as waves 1–17 (npx sandbox / mutate-file
   filter). **Not adopted.**

2. **Ephemeral AST harness (used for scores):**
   `node_modules/.cache/mutation-ui-18/mutation-report-ui.mjs` (not committed;
   also under `/tmp/mutation-ui-18/`). Same operators as committed
   `scripts/mutation-report.mjs` (comparison/equality, arithmetic, logical,
   boolean literals, unary `!`, integer ±1 with `|v| ≤ 64`). Cap `--max=20`
   per module. Import-aware test discovery with a 35-file cap; **wave-prefix
   suites outrank basename substring hits** only when they also import /
   name-match the host. Hold-path AI/bench/rules suites excluded unless they
   import the host.

Exact commands:

```bash
# Baseline (existing tests only)
node node_modules/.cache/mutation-ui-18/mutation-report-ui.mjs \
  --modules-file=/tmp/mutation-ui-18/modules-baseline.txt \
  --max=20 --timeout=90000 \
  --exclude-tests=mutation-ui18 \
  --prefer-prefix=mutation-ui18 \
  --json=docs/dev/mutation-audit-ui-18-baseline.json

# After (with tests/unit/mutation-ui18-*.test.ts)
node node_modules/.cache/mutation-ui-18/mutation-report-ui.mjs \
  --modules=src/core/dice/dice-selector.ts,src/ui/board-a11y.ts,src/ui/pointer-hygiene.ts \
  --max=20 --timeout=90000 \
  --prefer-prefix=mutation-ui18 \
  --json=docs/dev/mutation-audit-ui-18-after.json
```

Nothing added to `package.json`, lockfile, or CI.

### Fresh baseline (selected modules)

| Module                       |   Score % | Notes                                                             |
| ---------------------------- | --------: | ----------------------------------------------------------------- |
| `core/dice/dice-selector.ts` | **100.0** | wave-9 hold (first-20 still saturated)                            |
| `ui/board-a11y.ts`           |  **95.0** | same first-20 survivor as wave 10 (`>→>=` on empty-orphan gate)   |
| `ui/pointer-hygiene.ts`      | **100.0** | wave-13 hold (first-20 still saturated; catch arms not in window) |

## Before → after (score %)

| Module                       | Before % |   After % | Δ pp | Killed after |
| ---------------------------- | -------: | --------: | ---: | -----------: |
| `core/dice/dice-selector.ts` |    100.0 | **100.0** |  0.0 |        20/20 |
| `ui/board-a11y.ts`           |     95.0 |  **95.0** |  0.0 |        19/20 |
| `ui/pointer-hygiene.ts`      |    100.0 | **100.0** |  0.0 |        20/20 |

**0 modules** with a higher first-20 score (all three already at prior-wave hold /
documented equivalent survivor). Wave 18 commits structural re-pins + survivor
documentation so the trio stays covered under `mutation-ui18-*` prefer-prefix.

JSON artifacts: `docs/dev/mutation-audit-ui-18-baseline.json`,
`docs/dev/mutation-audit-ui-18-after.json`.

## Remaining survivors (not product bugs)

| Module       | Survivor                               | Reason                                                                                           |
| ------------ | -------------------------------------- | ------------------------------------------------------------------------------------------------ |
| `board-a11y` | L158 `orphanCells.length > 0` → `>= 0` | Empty-orphan entry is a no-op; group loops do nothing. Pinned `it.skip` (wave-2 / wave-10 hold). |

Pinned `it.skip` in `tests/unit/mutation-ui18-board-a11y.test.ts`.

No production defects confirmed. No `src/` product edits.

## New tests

All new files (did **not** edit wave 1–17 suites or open `#981`/`#986`/`#984` chars):

- `tests/unit/mutation-ui18-dice-selector.test.ts`
- `tests/unit/mutation-ui18-board-a11y.test.ts`
- `tests/unit/mutation-ui18-pointer-hygiene.test.ts`

Rules: no player-facing copy / aria-label string assertions; no AI move/timing
policy asserts; hard-coded numeric / boolean / DOM-shape expectations so
equality / logical / boolean / numeric mutants stay detectable. Dice suite
re-pins constructor defaults (`dieSize` 60, `multiSelect`, sums/roll flags),
`customDice.length > 0`, `showTotal: false` / `selectable: true`, achievable
sum equality, confirm `||` disable, and style inject. Board suite re-pins
role/tabindex structure, orphan wrap, SVG namespaceURI `||`, promote `&&` chain,
and documents the `> vs >=` equivalent. Pointer suite re-pins slop **16**,
primary / mouse-button gates, requirePrimary default, claim/cancel/reset, and
click-dedupe — **not** `setPointerCapture` / `releasePointerCapture` catch arms.

## Overlap

- **#584 / wave 2** — dice-selector / board-a11y / pointer-hygiene among hosts
- **#814 / wave 9** — dice-selector remeasure (100% hold)
- **#832 / wave 10** — board-a11y remeasure (90 → 95; hold here)
- **#896 / wave 13** — pointer-hygiene remeasure (100% hold)
- **#981 / #986 / #984** — soft-fail characterization on the same hosts —
  orthogonal file names; not edited here
