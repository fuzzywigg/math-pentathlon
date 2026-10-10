# Mutation audit — UI / shell wave 15 (q-mp-457)

Tests-only mutation measurement continuing wave 1 (`docs/dev/mutation-audit-ui.md`)
through wave 14 (`docs/dev/mutation-audit-ui-14.md`). This wave remeasures residual
soft-fail / char hosts disjoint from wave 14’s stats-dashboard / storage / router
claim: `security-headers`, `hex-svg`, and `dom-security`.

Remeasured on tip `cursor/mp-tip-post898` @ `9b19c5e8` (baseline measurement SHA;
hosts unchanged through later tip folds). Spec LOC (**57** / **70** / **144**) and
dedicated-test counts (**1** / **1** / **2**) match live tip.

## Scope

**In (this wave):**
`src/core/security-headers.ts`,
`src/ui/hex-svg.ts`,
`src/core/dom-security.ts` (tests only — kill clear survivors / structural
re-pins; no `src/` edits; **no security header or CSP value changes**).

**Out:** `ai/`, `*/rules.ts`, engine legal-move/scoring, tutorials/copy,
player-facing string assertions, AI move choice / timing.
No `src/` product edits. Wave 14 hosts (stats-dashboard / storage / router) are
not repeated.

**Overlap avoided:**

- Open `#912` (`q-mp-429` mutation UI w14 into post865) — stats-dashboard /
  storage / router; hosts disjoint; left open.
- Open tip drafts `#915`–`#921` — UI coverage / lint / backlog / dice char;
  hosts disjoint; left open.
- Wave 1 (`dom-security`) / wave 2 (`hex-svg`) / wave 3 (`security-headers`) —
  intentional first-20 remeasure + wave-15 structural re-pins.
- Soft-fail characterization leftovers noted in backlog for these hosts — this
  wave is mutation scores only (`mutation-ui15-*.test.ts`); left characterization
  owners alone.

## Harness

1. **Stryker probe:** same failure mode as waves 1–14 (npx sandbox / mutate-file
   filter). **Not adopted.**

2. **Ephemeral AST harness (used for scores):**
   `node_modules/.cache/mutation-ui-15/mutation-report-ui.mjs` (not committed;
   also under `/tmp/mutation-ui-15/`). Same operators as committed
   `scripts/mutation-report.mjs` (comparison/equality, arithmetic, logical,
   boolean literals, unary `!`, integer ±1 with `|v| ≤ 64`). Cap `--max=20`
   per module. Import-aware test discovery with a 35-file cap; **wave-prefix
   suites outrank basename substring hits** only when they also import /
   name-match the host.

Exact commands:

```bash
# Baseline (existing tests only)
node node_modules/.cache/mutation-ui-15/mutation-report-ui.mjs \
  --modules-file=/tmp/mutation-ui-15/modules-baseline.txt \
  --max=20 --timeout=90000 \
  --exclude-tests=mutation-ui15 \
  --prefer-prefix=mutation-ui15 \
  --json=docs/dev/mutation-audit-ui-15-baseline.json

# After (with tests/unit/mutation-ui15-*.test.ts)
node node_modules/.cache/mutation-ui-15/mutation-report-ui.mjs \
  --modules=src/core/security-headers.ts,src/ui/hex-svg.ts,src/core/dom-security.ts \
  --max=20 --timeout=90000 \
  --prefer-prefix=mutation-ui15 \
  --json=docs/dev/mutation-audit-ui-15-after.json
```

Nothing added to `package.json`, lockfile, or CI.

### Fresh baseline (selected modules)

| Module                     |   Score % | Notes                                                                   |
| -------------------------- | --------: | ----------------------------------------------------------------------- |
| `core/security-headers.ts` | **100.0** | 1/1; wave-3 hold (only AST mutant is `mode === 'development'`)          |
| `ui/hex-svg.ts`            | **100.0** | 20/20; wave-2 hold (first-20 window still saturated)                    |
| `core/dom-security.ts`     |  **92.3** | 12/13; wave-1 residue — L55 `i < values.length` → `<=` still equivalent |

## Before → after (score %)

| Module                     | Before % |   After % | Δ pp | Killed after |
| -------------------------- | -------: | --------: | ---: | -----------: |
| `core/security-headers.ts` |    100.0 | **100.0** |  0.0 |          1/1 |
| `ui/hex-svg.ts`            |    100.0 | **100.0** |  0.0 |        20/20 |
| `core/dom-security.ts`     |     92.3 |  **92.3** |  0.0 |        12/13 |

**0 modules** with a higher first-20 score (all three already at prior-wave hold /
documented equivalent survivor). Wave 15 commits structural re-pins + survivor
documentation so the trio stays covered under `mutation-ui15-*` prefer-prefix.

JSON artifacts: `docs/dev/mutation-audit-ui-15-baseline.json`,
`docs/dev/mutation-audit-ui-15-after.json`.

## Remaining survivors (not product bugs)

| Module         | Survivor                                     | Reason                                                                                     |
| -------------- | -------------------------------------------- | ------------------------------------------------------------------------------------------ |
| `dom-security` | L55 `i < values.length` → `<=` in `safeHtml` | Extra index has no `data-mp-safe` slot; `querySelector` misses and `continue`s — same DOM. |

Pinned `it.skip` in `tests/unit/mutation-ui15-dom-security.test.ts`.

No production defects confirmed. No security header / CSP values were changed.

## New tests

All new files (did **not** edit wave 1–14 suites):

- `tests/unit/mutation-ui15-security-headers.test.ts`
- `tests/unit/mutation-ui15-hex-svg.test.ts`
- `tests/unit/mutation-ui15-dom-security.test.ts`

Rules: no player-facing copy assertions; hard-coded numeric / boolean / DOM-shape
expectations so equality / logical / boolean / numeric mutants stay detectable.
Security-headers suite re-pins mode selection and companion keys without editing
`src/core/security-headers.ts`.

## Overlap

- **#579 / wave 1** — dom-security among hosts (76.9 → 92.3; residue held here)
- **#584 / wave 2** — hex-svg 0 → 100 (still 100% first-20)
- **wave 3** — security-headers already saturated at 100%
- **#912 / wave 14** — stats-dashboard / storage / router — hosts disjoint
- Soft-fail char leftovers on these hosts — orthogonal; not edited here
