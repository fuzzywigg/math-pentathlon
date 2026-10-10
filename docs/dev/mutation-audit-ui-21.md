# Mutation audit — UI / shell wave 21 (q-mp-587)

Tests-only mutation measurement continuing wave 1 (`docs/dev/mutation-audit-ui.md`)
through wave 19 (`docs/dev/mutation-audit-ui-19.md`). This wave measures preferred
disjoint hosts: `owl-messages`, `owl-events`, and `reduced-motion`.

Remeasured on tip `cursor/mp-tip-post1012` @ `ed034b44`. Spec LOC (**563** /
**157** / **123**) match live tip (file line counts 563 / 157 / 123; harness
reports +1 trailing newline). Wave 13 after stamped reduced-motion at **84.6%**
(typeof `||` holds). Owl-messages / owl-events were not prior UI-wave primary
hosts.

## Scope

**In (this wave):**
`src/core/owl/owl-messages.ts`,
`src/core/owl/owl-events.ts`,
`src/ui/reduced-motion.ts` (tests only — kill clear survivors /
structural re-pins; no `src/` edits).

**Out:** `ai/`, `*/rules.ts`, engine legal-move/scoring, tutorials/copy,
player-facing string assertions (including owl message text), AI move choice /
timing. No `src/` product edits. Wave 19 hosts (game-route-mounts /
expression-ui / ollie-inspect-map) are not repeated. No board-3d layout product
edits. Leave HELD `#727` nullish owl-messages clear alone. No void
reduced-motion clear (`q-mp-395`).

**Overlap avoided:**

- Open `#1010` (`q-mp-548` mutation UI w19 into post977) — hosts disjoint; left
  open.
- Open `#1024` (`q-mp-580` dice-demo nnnull into post1012) — unrelated; left
  open.
- Soft-fail / char tickets `588`–`590` (owl-messages / owl-events /
  reduced-motion) — this wave uses `mutation-ui21-*.test.ts` only
  (coordinate-by-avoidance; serialize with those chars).
- Wave 1 / 13 reduced-motion suites — intentional remeasure; did not edit those
  files.

## Harness

1. **Stryker probe:** same failure mode as waves 1–19 (npx sandbox / mutate-file
   filter). **Not adopted.**

2. **Ephemeral AST harness (used for scores):**
   `node_modules/.cache/mutation-ui-21/mutation-report-ui.mjs` (not committed;
   also under `/tmp/mutation-ui-21/`). Same operators as committed
   `scripts/mutation-report.mjs` (comparison/equality, arithmetic, logical,
   boolean literals, unary `!`, integer ±1 with `|v| ≤ 64`). Cap `--max=20`
   per module. Import-aware test discovery with a 35-file cap; **wave-prefix
   suites outrank basename substring hits** only when they also import /
   name-match the host. Hold-path AI/bench/rules suites excluded unless they
   import the host.

Exact commands:

```bash
# Baseline (existing tests only)
node node_modules/.cache/mutation-ui-21/mutation-report-ui.mjs \
  --modules-file=/tmp/mutation-ui-21/modules-baseline.txt \
  --max=20 --timeout=90000 \
  --exclude-tests=mutation-ui21 \
  --prefer-prefix=mutation-ui21 \
  --json=docs/dev/mutation-audit-ui-21-baseline.json

# After (with tests/unit/mutation-ui21-*.test.ts)
node node_modules/.cache/mutation-ui-21/mutation-report-ui.mjs \
  --modules=src/core/owl/owl-messages.ts,src/core/owl/owl-events.ts,src/ui/reduced-motion.ts \
  --max=20 --timeout=90000 \
  --prefer-prefix=mutation-ui21 \
  --json=docs/dev/mutation-audit-ui-21-after.json
```

Nothing added to `package.json`, lockfile, or CI.

### Fresh baseline (selected modules)

| Module                       |   Score % | Notes                                                              |
| ---------------------------- | --------: | ------------------------------------------------------------------ |
| `core/owl/owl-messages.ts`   |  **15.0** | 3/20; catalog condition numeric/boolean literals mostly unpinned   |
| `core/owl/owl-events.ts`     | **100.0** | 8/8 already saturated by burn-wave23 / 38 / 40 suites              |
| `ui/reduced-motion.ts`       |  **84.6** | same wave-13 L38/L77 `typeof \|\|` holds under jsdom               |

## Before → after (score %)

| Module                     | Before % |   After % |  Δ pp | Killed after |
| -------------------------- | -------: | --------: | ----: | -----------: |
| `core/owl/owl-messages.ts` |     15.0 | **100.0** | +85.0 |        20/20 |
| `core/owl/owl-events.ts`   |    100.0 | **100.0** |   0.0 |          8/8 |
| `ui/reduced-motion.ts`     |     84.6 |  **84.6** |   0.0 |        11/13 |

**1 module** with a higher first-20 score (`owl-messages` 15 → 100). Events
first-window stay saturated under `mutation-ui21-*` prefer-prefix. Reduced-motion
holds prior documented equivalent survivors.

JSON artifacts: `docs/dev/mutation-audit-ui-21-baseline.json`,
`docs/dev/mutation-audit-ui-21-after.json`.

## Remaining survivors (not product bugs)

| Module           | Survivor                                                                | Reason                                                                             |
| ---------------- | ----------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| `reduced-motion` | L38 `typeof window === 'undefined' \|\| typeof matchMedia !== …` → `&&` | Missing `matchMedia` still returns `false` via catch; same observable under jsdom  |
| `reduced-motion` | L77 same `\|\|` pattern in `bindReducedMotionPreference`                | Same catch / early-return equivalence under jsdom                                  |

Pinned `it.skip` in `tests/unit/mutation-ui21-reduced-motion.test.ts`.

No production defects confirmed. No `src/` product edits.

## New tests

All new files (did **not** edit wave 1–19 suites or soft-fail / char tickets):

- `tests/unit/mutation-ui21-owl-messages.test.ts`
- `tests/unit/mutation-ui21-owl-events.test.ts`
- `tests/unit/mutation-ui21-reduced-motion.test.ts`

Rules: no player-facing owl message text / aria-label / stub-narration string
assertions; no AI move/timing policy asserts; hard-coded catalog condition
objects / message ids / priorities / DOM attr / duration expectations so
equality / logical / boolean / numeric mutants stay detectable. Owl-messages
suite pins `getMessagesByCategory` condition literals and `selectMessage` id
gates for streak / firstTime / gamesPlayed / playerWon / winStreak — **not**
stock copy. Events suite re-pins `||` defaults, unsubscribe `!==`, and `off`
without-handler delete. Reduced-motion suite re-pins attr / userPref /
durationMs / bind paths and documents the wave-13 typeof holds.

## Overlap

- **#579 / wave 1** / **#896 / wave 13** — reduced-motion among hosts (84.6%
  after; typeof holds here)
- **#1010 / wave 19** — mounts / expression / ollie — hosts disjoint; left open
- Soft-fail / char `588`–`590` — orthogonal filenames; not edited here
- **#727** HELD nullish owl-messages clear — left alone
