# Mutation audit — UI / shell wave 13 (q-mp-402)

Tests-only mutation measurement continuing wave 1 (`docs/dev/mutation-audit-ui.md`)
through wave 12 (`docs/dev/mutation-audit-ui-12.md`). This wave remeasures residual
PWA/UI helpers disjoint from waves 10–12 hosts:
`idle-warm`, `reduced-motion`, and `pointer-hygiene`.

Remeasured on tip `cursor/mp-tip-post865` @ `3908809d` (spec was written against
post830; baselines below are live tip scores).

## Scope

**In (this wave):**
`src/pwa/idle-warm.ts`,
`src/ui/reduced-motion.ts`,
`src/ui/pointer-hygiene.ts` (tests only — kill clear survivors / structural
re-pins; no `src/` edits).

**Out:** `ai/`, `*/rules.ts`, engine legal-move/scoring, tutorials/copy,
player-facing string assertions, AI move choice / timing.
No `src/` product edits. Wave 10–12 hosts are not repeated.

**Overlap avoided:**

- Tip drafts into `cursor/mp-tip-post865`: none open at start.
- `#875` / `#872` wave 11–12 — offline/timeout/coord-map and
  player-colors/error-boundary/die-faces — hosts disjoint; left open.
- `#877` / `#878` — owl void / hex UI cov — orthogonal; left open.
- `#879` backlog doc — docs only; left open.
- Void code clear `q-mp-395` owns `src/ui/reduced-motion.ts` product edits —
  this wave is tests-only (separate `mutation-ui13-*.test.ts` files).
- Characterization `q-mp-404` (idle-warm) / `#787` (`q-mp-278`) — separate
  test files; not edited here.

## Harness

1. **Stryker probe:** same failure mode as waves 1–12 (npx sandbox / mutate-file
   filter). **Not adopted.**

2. **Ephemeral AST harness (used for scores):**
   `node_modules/.cache/mutation-ui-13/mutation-report-ui.mjs` (not committed;
   also under `/tmp/mutation-ui-13/`). Same operators as committed
   `scripts/mutation-report.mjs` (comparison/equality, arithmetic, logical,
   boolean literals, unary `!`, integer ±1 with `|v| ≤ 64`). Cap `--max=20`
   per module. Import-aware test discovery with a 35-file cap preferring
   `mutation-ui13` / module-precise import needles
   (`pwa/idle-warm`, `ui/reduced-motion`, `ui/pointer-hygiene`).

Exact commands:

```bash
# Baseline (existing tests only)
node node_modules/.cache/mutation-ui-13/mutation-report-ui.mjs \
  --modules-file=/tmp/mutation-ui-13/modules-baseline.txt \
  --max=20 --timeout=90000 \
  --exclude-tests=mutation-ui13 \
  --json=docs/dev/mutation-audit-ui-13-baseline.json

# After (with tests/unit/mutation-ui13-*.test.ts)
node node_modules/.cache/mutation-ui-13/mutation-report-ui.mjs \
  --modules=src/pwa/idle-warm.ts,src/ui/reduced-motion.ts,src/ui/pointer-hygiene.ts \
  --max=20 --timeout=90000 \
  --json=docs/dev/mutation-audit-ui-13-after.json
```

Nothing added to `package.json`, lockfile, or CI.

### Fresh baseline (selected modules)

| Module                  |   Score % | Notes                                                             |
| ----------------------- | --------: | ----------------------------------------------------------------- |
| `pwa/idle-warm.ts`      |  **78.6** | 11/14; up from wave-2 **71.4%**; 3 logical survivors remain       |
| `ui/reduced-motion.ts`  |  **84.6** | 11/13; up from wave-1 **61.5%**; 2 `typeof \|\|` survivors remain |
| `ui/pointer-hygiene.ts` | **100.0** | first-20 already saturated (wave-2 hold)                          |

## Before → after (score %)

| Module                  | Before % |   After % |  Δ pp | Killed after |
| ----------------------- | -------: | --------: | ----: | -----------: |
| `pwa/idle-warm.ts`      |     78.6 |  **92.9** | +14.3 |        13/14 |
| `ui/reduced-motion.ts`  |     84.6 |  **84.6** |   0.0 |        11/13 |
| `ui/pointer-hygiene.ts` |    100.0 | **100.0** |   0.0 |        20/20 |

**1 module** with a measurably higher score (idle-warm). Pointer-hygiene first-20
window was already saturated (remeasured + structural re-pins). Reduced-motion
residual survivors are observationally equivalent under jsdom (documented +
`it.skip` pin).

JSON artifacts: `docs/dev/mutation-audit-ui-13-baseline.json`,
`docs/dev/mutation-audit-ui-13-after.json`.

## Remaining survivors (not product bugs)

| Module           | Survivor                                                                | Reason                                                                             |
| ---------------- | ----------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| `idle-warm`      | L90 `window && document` → `\|\|` (enabled default)                     | Both globals always exist under jsdom; cannot drop one without breaking the runner |
| `reduced-motion` | L38 `typeof window === 'undefined' \|\| typeof matchMedia !== …` → `&&` | Missing `matchMedia` still returns `false` via catch; same observable              |
| `reduced-motion` | L77 same `\|\|` pattern in `bindReducedMotionPreference`                | Same catch / early-return equivalence under jsdom                                  |

Pinned `it.skip` in `tests/unit/mutation-ui13-idle-warm.test.ts` and
`tests/unit/mutation-ui13-reduced-motion.test.ts`.

No production defects confirmed.

## New tests

All new files (did **not** edit wave 1–12 suites; separate from `404` / `278` /
`395`):

- `tests/unit/mutation-ui13-idle-warm.test.ts`
- `tests/unit/mutation-ui13-reduced-motion.test.ts`
- `tests/unit/mutation-ui13-pointer-hygiene.test.ts`

Rules: no player-facing copy assertions; hard-coded attr / timeout / slop /
game-id / boolean expectations so equality / logical / boolean / numeric
mutants stay detectable. Idle-warm L101 / L108 logical survivors killed via
successive-read getters (async body runs sync until first `await`).

## Overlap

- **#579 / wave 1** — reduced-motion among hosts (61.5% → tip 84.6% residue)
- **#584 / wave 2** — idle-warm / pointer-hygiene (71.4% / 100%; idle raised here)
- **#875 / #872** — waves 11–12 — hosts disjoint
- **`q-mp-395`** — void clear in `reduced-motion.ts` (src ownership; not touched)
- **`q-mp-404` / `#787`** — characterization; separate test files
