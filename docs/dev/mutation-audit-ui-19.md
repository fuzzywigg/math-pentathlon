# Mutation audit — UI / shell wave 19 (q-mp-548)

Tests-only mutation measurement continuing wave 1 (`docs/dev/mutation-audit-ui.md`)
through wave 18 (`docs/dev/mutation-audit-ui-18.md`). This wave measures preferred
disjoint hosts: `game-route-mounts`, `expression-ui`, and `ollie-inspect-map`.

Remeasured on tip `cursor/mp-tip-post949` @ `701cba47`. Spec LOC (**1962** /
**816** / **181**) match live tip (file line counts 1961 / 815 / 180 + trailing
newline). Wave 8 after stamped expression-ui at **95%** (L18 hold). Mounts and
ollie-inspect-map were not prior UI-wave primary hosts.

## Scope

**In (this wave):**
`src/ui/game-route-mounts.ts`,
`src/core/expressions/expression-ui.ts`,
`src/core/owl/ollie-inspect-map.ts` (tests only — kill clear survivors /
structural re-pins; no `src/` edits).

**Out:** `ai/`, `*/rules.ts`, engine legal-move/scoring, tutorials/copy,
player-facing string assertions, AI move choice / timing.
No `src/` product edits. Wave 17/18 hosts (game-shell / highlight-ui / sanitize /
dice-selector / board-a11y / pointer-hygiene) are not repeated. No board-3d
layout product edits. No nnnull expression-ui product clear (undrafted `396`).

**Overlap avoided:**

- Open `#987` (`q-mp-527` mutation UI w18) — hosts disjoint; left open.
- Soft-fail char `q-mp-353` / future char `549` on mounts — this wave uses
  `mutation-ui19-*.test.ts` only and stays on happy-path / first-20 pins
  (coordinate-by-avoidance).
- Wave 8 expression-ui suite — intentional remeasure; did not edit that file.

## Harness

1. **Stryker probe:** same failure mode as waves 1–18 (npx sandbox / mutate-file
   filter). **Not adopted.**

2. **Ephemeral AST harness (used for scores):**
   `node_modules/.cache/mutation-ui-19/mutation-report-ui.mjs` (not committed;
   also under `/tmp/mutation-ui-19/`). Same operators as committed
   `scripts/mutation-report.mjs` (comparison/equality, arithmetic, logical,
   boolean literals, unary `!`, integer ±1 with `|v| ≤ 64`). Cap `--max=20`
   per module. Import-aware test discovery with a 35-file cap; **wave-prefix
   suites outrank basename substring hits** only when they also import /
   name-match the host. Hold-path AI/bench/rules suites excluded unless they
   import the host.

Exact commands:

```bash
# Baseline (existing tests only)
node node_modules/.cache/mutation-ui-19/mutation-report-ui.mjs \
  --modules-file=/tmp/mutation-ui-19/modules-baseline.txt \
  --max=20 --timeout=90000 \
  --exclude-tests=mutation-ui19 \
  --prefer-prefix=mutation-ui19 \
  --json=docs/dev/mutation-audit-ui-19-baseline.json

# After (with tests/unit/mutation-ui19-*.test.ts)
node node_modules/.cache/mutation-ui-19/mutation-report-ui.mjs \
  --modules=src/ui/game-route-mounts.ts,src/core/expressions/expression-ui.ts,src/core/owl/ollie-inspect-map.ts \
  --max=20 --timeout=90000 \
  --prefer-prefix=mutation-ui19 \
  --json=docs/dev/mutation-audit-ui-19-after.json
```

Nothing added to `package.json`, lockfile, or CI.

### Fresh baseline (selected modules)

| Module                              |   Score % | Notes                                                      |
| ----------------------------------- | --------: | ---------------------------------------------------------- |
| `ui/game-route-mounts.ts`           | **100.0** | first-20 already saturated by burn-1007 / soft-fail suites |
| `core/expressions/expression-ui.ts` |  **95.0** | same L18 `stylesInjected false→true` hold as wave 8        |
| `core/owl/ollie-inspect-map.ts`     |  **50.0** | 3/6; `&&→                                                  |     | ` finite-pair gates on hag / hex / kings cells survived |

## Before → after (score %)

| Module                              | Before % |   After % |  Δ pp | Killed after |
| ----------------------------------- | -------: | --------: | ----: | -----------: |
| `ui/game-route-mounts.ts`           |    100.0 | **100.0** |   0.0 |        20/20 |
| `core/expressions/expression-ui.ts` |     95.0 |  **95.0** |   0.0 |        19/20 |
| `core/owl/ollie-inspect-map.ts`     |     50.0 | **100.0** | +50.0 |          6/6 |

**1 module** with a higher first-20 score (`ollie-inspect-map` 50 → 100). Mounts
and expression-ui hold prior saturation / documented equivalent survivor. Wave
19 commits structural re-pins + survivor documentation so the trio stays covered
under `mutation-ui19-*` prefer-prefix.

JSON artifacts: `docs/dev/mutation-audit-ui-19-baseline.json`,
`docs/dev/mutation-audit-ui-19-after.json`.

## Remaining survivors (not product bugs)

| Module       | Survivor                        | Reason                                                                                       |
| ------------ | ------------------------------- | -------------------------------------------------------------------------------------------- |
| `expression` | L18 `stylesInjected false→true` | Module flag + `tests/unit/setup.ts` clearing head styles each test → style-count pins flake. |

Pinned `it.skip` in `tests/unit/mutation-ui19-expression-ui.test.ts`.

No production defects confirmed. No `src/` product edits.

## New tests

All new files (did **not** edit wave 1–18 suites or soft-fail chars):

- `tests/unit/mutation-ui19-game-route-mounts.test.ts`
- `tests/unit/mutation-ui19-expression-ui.test.ts`
- `tests/unit/mutation-ui19-ollie-inspect-map.test.ts`

Rules: no player-facing copy / aria-label / stub-narration string assertions; no
AI move/timing policy asserts; hard-coded numeric / boolean / DOM-shape /
`resolveInspectTarget` kind expectations so equality / logical / boolean /
numeric mutants stay detectable. Mounts suite re-pins deps throw, kings shell
booleans / mode discrimination / init `&&` / `||` arms, hex `showTutorial`, and
stale-gen skip — **not** clobber-recovery soft-fail arms. Expression suite
re-pins SVG defaults/centering, `draggable`, slot drop/click gates. Ollie suite
kills finite-pair `&&` gates and empty-player `||` fallbacks via structural
kind asserts only.

## Overlap

- **#778 / wave 8** — expression-ui among hosts (95% after; L18 hold here)
- **#987 / wave 18** — dice-selector / board-a11y / pointer-hygiene — hosts
  disjoint; left open
- Soft-fail / char mounts (`q-mp-353`, future `549`) — orthogonal filenames;
  not edited here
