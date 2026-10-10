# Mutation audit — UI / shell wave 16 (q-mp-478)

Tests-only mutation measurement continuing wave 1 (`docs/dev/mutation-audit-ui.md`)
through wave 15 (`docs/dev/mutation-audit-ui-15.md`). This wave remeasures residual
hosts preferred by the round-15 backlog: `owl-component`, `graph-ui`, and
`pwa/register` — disjoint from wave 15’s security-headers / hex-svg / dom-security
claim (`#933` / `q-mp-457`).

Remeasured on tip `cursor/mp-tip-post914` @ `753052a6`. Spec LOC (**800** /
**601** / **118**) match live tip (±1 line for trailing newline). Wave 5/8/1
prior scores are stale relative to the post914 first-20 window (owl file grew;
field-init mutants now dominate the early AST window).

## Scope

**In (this wave):**
`src/ui/owl/owl-component.ts`,
`src/core/graph/graph-ui.ts`,
`src/pwa/register.ts` (tests only — kill clear survivors / structural re-pins;
no `src/` edits).

**Out:** `ai/`, `*/rules.ts`, engine legal-move/scoring, tutorials/copy,
player-facing string assertions, AI move choice / timing.
No `src/` product edits. Wave 15 hosts (security-headers / hex-svg /
dom-security) are not repeated. No board-3d layout product edits.

**Overlap avoided:**

- Open `#933` (`q-mp-457` mutation UI w15 into post898) — security-headers /
  hex-svg / dom-security; hosts disjoint; left open.
- Open `#815` (`q-mp-327` graph-ui soft-fail char) / `#884` (idle-warm / PWA
  bootstrap char) — leave open with `contained`; this wave is mutation scores
  only (`mutation-ui16-*.test.ts`).
- Open `#726` / wave 5 (owl among hosts) / `#778` / wave 8 (graph-ui) — intentional
  first-20 remeasure + wave-16 kill / re-pins; did not edit those suites.
- Tip drafts into `cursor/mp-tip-post914` — none open at start; no draft owns
  mutation UI wave 16.

## Harness

1. **Stryker probe:** same failure mode as waves 1–15 (npx sandbox / mutate-file
   filter). **Not adopted.**

2. **Ephemeral AST harness (used for scores):**
   `node_modules/.cache/mutation-ui-16/mutation-report-ui.mjs` (not committed;
   also under `/tmp/mutation-ui-16/`). Same operators as committed
   `scripts/mutation-report.mjs` (comparison/equality, arithmetic, logical,
   boolean literals, unary `!`, integer ±1 with `|v| ≤ 64`). Cap `--max=20`
   per module. Import-aware test discovery with a 35-file cap; **wave-prefix
   suites outrank basename substring hits** only when they also import /
   name-match the host.

Exact commands:

```bash
# Baseline (existing tests only)
node node_modules/.cache/mutation-ui-16/mutation-report-ui.mjs \
  --modules-file=/tmp/mutation-ui-16/modules-baseline.txt \
  --max=20 --timeout=90000 \
  --exclude-tests=mutation-ui16 \
  --prefer-prefix=mutation-ui16 \
  --json=docs/dev/mutation-audit-ui-16-baseline.json

# After (with tests/unit/mutation-ui16-*.test.ts)
node node_modules/.cache/mutation-ui-16/mutation-report-ui.mjs \
  --modules=src/ui/owl/owl-component.ts,src/core/graph/graph-ui.ts,src/pwa/register.ts \
  --max=20 --timeout=90000 \
  --prefer-prefix=mutation-ui16 \
  --json=docs/dev/mutation-audit-ui-16-after.json
```

Nothing added to `package.json`, lockfile, or CI.

### Fresh baseline (selected modules)

| Module                    |  Score % | Notes                                                                      |
| ------------------------- | -------: | -------------------------------------------------------------------------- |
| `ui/owl/owl-component.ts` | **25.0** | down from wave-5 after **60%** — first-20 now field-init heavy (file grew) |
| `core/graph/graph-ui.ts`  | **95.0** | wave-8 hold; L21 `\|\|` → `&&` still equivalent under jsdom                |
| `pwa/register.ts`         | **90.0** | down from wave-1 after **95%** — L29 init + L35 reset-interval residue     |

## Before → after (score %)

| Module                    | Before % |   After % |  Δ pp | Killed after |
| ------------------------- | -------: | --------: | ----: | -----------: |
| `ui/owl/owl-component.ts` |     25.0 | **100.0** | +75.0 |        20/20 |
| `core/graph/graph-ui.ts`  |     95.0 |  **95.0** |   0.0 |        19/20 |
| `pwa/register.ts`         |     90.0 | **100.0** | +10.0 |        20/20 |

**2 modules** with measurably higher scores (owl-component, pwa/register). Graph
first-20 window remains at the wave-8 hold with one documented equivalent
survivor.

JSON artifacts: `docs/dev/mutation-audit-ui-16-baseline.json`,
`docs/dev/mutation-audit-ui-16-after.json`.

## Remaining survivors (not product bugs)

| Module     | Survivor                                          | Reason                                                                                                |
| ---------- | ------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `graph-ui` | L21 `typeof window === 'undefined' \|\| …` → `&&` | Under jsdom both arms false → same fall-through; missing `matchMedia` still hits try/catch → `false`. |

Pinned `it.skip` in `tests/unit/mutation-ui16-graph-ui.test.ts`.

No production defects confirmed. No `src/` product edits.

## New tests

All new files (did **not** edit wave 1–15 suites):

- `tests/unit/mutation-ui16-owl-component.test.ts`
- `tests/unit/mutation-ui16-graph-ui.test.ts`
- `tests/unit/mutation-ui16-pwa-register.test.ts`

Rules: no player-facing copy assertions; no AI move/timing policy asserts;
hard-coded numeric / boolean / DOM-shape expectations so equality / logical /
boolean / numeric mutants stay detectable. Owl suite pins compile-time-private
field inits on a fresh instance (runtime-enumerable) so the post914 first-20
window is fully covered. PWA suite uses `vi.resetModules` + dynamic import so
module-scope `reloadScheduled` init is observable under `isolate:false`.

## Overlap

- **#726 / wave 5** — owl-component among hosts (20 → 60; remeasured here to 100)
- **#778 / wave 8** — graph-ui 70 → 95 (still 95% first-20; L21 held)
- **wave 1** — pwa/register 60 → 95 (remeasured here to 100)
- **#933 / wave 15** — security-headers / hex-svg / dom-security — hosts disjoint
- **#815 / #884** — soft-fail characterization — orthogonal; not edited here
