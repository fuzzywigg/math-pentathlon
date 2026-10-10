# ESLint `radix` residual inventory (q-mp-511) — tip post949

**Task id:** `q-mp-511`  
**Role:** worker (docs / data / chart only)  
**Tip measured:** `cursor/mp-tip-post949` @ `8698fffb` (`8698fffb85b1e3d2289e54a665fac6162d3bdee4`)  
**Measured at:** `2026-10-10T12:21:50Z` (UTC)  
**Series:** `eslint-radix`  
**Verdict:** **SAFE** — report-only; all **6**/6 residuals are hard-rule **HOLD** in kwatro `ai.ts` / `rules.ts`  
**Data:** [`radix-residuals-post949-2026-10-10.json`](./radix-residuals-post949-2026-10-10.json)  
**Chart:** ![radix residuals @ post949](./radix-residuals-post949-2026-10-10.svg)

## Purpose

Backlog `q-mp-511` (`docs/dev/backlog-2026-10-10h.md`, written against tip `cursor/mp-tip-post914`) asked for a dated radix residual inventory. Live tip is `cursor/mp-tip-post949` @ `8698fffb` (tip fold `#949` + tip-owner `q-mp-026o` pointer docs). **Every baseline re-measured on the live tip** — do not trust the post914 stamp alone.

Docs / data / chart only — **zero** `src/` / game-logic / ratchet-JSON edits. No AI behavior, `rules.ts` logic, legal-move, scoring, player-facing copy, or aria/label changes. No ratchet raises.

## Acceptance (from backlog q-mp-511)

- [x] Dated inventory under `docs/dev/` (`radix-residuals-post949-2026-10-10` + visual)
- [x] Tip SHA recorded (`8698fffb`)
- [x] Marks AI / rules hosts as hard-rule **HOLD**
- [x] No product edits (no `src/games/kwatro-sinko/**` changes)
- [x] `npm run check:dev-docs` clean (problems: 0)

## Duplicate check (open drafts)

| PR / prior | Topic | Relation |
| --- | --- | --- |
| Open drafts into `cursor/mp-tip-post949` | (none at measure time) | No competing radix inventory owner |
| [#673](https://github.com/fuzzywigg/math-pentathlon/pull/673) `q-mp-130` | dice-demo radix clear + ceiling **6** + HOLD note | Historical product clear; **contained** as tip truth by this inventory (leave open) |
| [`eslint-off-rules-inventory.md`](./eslint-off-rules-inventory.md) § q-mp-130 | Line map for HOLD | Complementary; this PR is the tip-stamped dated inventory |
| [#965](https://github.com/fuzzywigg/math-pentathlon/pull/965) `q-mp-491` | lint-bucket full snapshot @ post914 | Orthogonal (all ceiling keys); leave open |
| [#944](https://github.com/fuzzywigg/math-pentathlon/pull/944) `q-mp-464` | non-ceilinged overlay residuals | Orthogonal (`radix` is ceilinged); leave open |
| [#971](https://github.com/fuzzywigg/math-pentathlon/pull/971) `q-mp-090q` | backlog round 17 (defines `511`) | Spec owner; no inventory files |

No open draft into `cursor/mp-tip-post949` already owns a post949 `radix` residual inventory → full task proceeds.

## Method (live tip)

```text
$ git rev-parse HEAD
  8698fffb85b1e3d2289e54a665fac6162d3bdee4

$ npm run lint:ratchet
  ok   radix: 6 / ceiling 6
  … (all other ceiling keys ok; see JSON for full transcript stamp)

$ npm run report:lint-buckets -- --rule radix --top 20
  radix: 6 / ceiling 6
    path buckets:
         6  src/games/kwatro-sinko
    densest files (top 20):
         4  src/games/kwatro-sinko/ai.ts
         2  src/games/kwatro-sinko/rules.ts

$ npm run report:lint-buckets -- --rule radix --json --top 20
  # machine summary → radix-residuals-post949-2026-10-10.json

$ # same overlay probe as lint:ratchet (temp config deleted after run)
  src/games/kwatro-sinko/ai.ts 4
    L106, L107, L331, L332  Missing radix parameter.
  src/games/kwatro-sinko/rules.ts 2
    L349, L350  Missing radix parameter.
```

Live `eslint.config.js` does **not** hard-enable `radix`; count-down only via `npm run lint:ratchet` / `report:lint-buckets`. Ceiling source: [`lint-ratchet-ceilings.json`](./lint-ratchet-ceilings.json) (`radix: 6`).

## Before → after metrics (report-only stamp)

| Metric | Spec backlog (`q-mp-511` @ post914) | Live tip `8698fffb` / post949 | This PR |
| --- | ---: | ---: | --- |
| `radix` total | **6** | **6** | Docs only |
| `radix` ceiling | **6** | **6** | unchanged (no raise) |
| Headroom | 0 | 0 | — |
| Path buckets | `kwatro-sinko` only | `kwatro-sinko` only (**6**) | unchanged |
| `ai.ts` hits | **4** | **4** (L106–107, L331–332) | **HOLD** |
| `rules.ts` hits | **2** | **2** (L349–350) | **HOLD** |
| Other path buckets | none | none | — |

**Δ vs post914 backlog stamp:** totals / hosts / line map **unchanged**. Tip SHA / branch advanced (`post914` → `post949`).

### Visual

![q-mp-511 radix residuals chart](./radix-residuals-post949-2026-10-10.svg)

```text
radix 6 / 6  (headroom 0)

path buckets:
  src/games/kwatro-sinko  ██████  6

files:
  ai.ts     ████  4   HOLD (AI path)
  rules.ts  ██    2   HOLD (rules / legal-move path)
```

---

## Residual table (all HOLD)

| File | Hits | Lines | Snippet context | Disposition |
| --- | ---: | --- | --- | --- |
| `src/games/kwatro-sinko/ai.ts` | 4 | 106, 107, 331, 332 | `parseInt(match[1])` / `parseInt(match[2])` after `/n(\d+)-(\d+)/` for win-line scan + center-control scoring | **HOLD** — AI path (hard rules: no AI behavior / search / scoring / difficulty / timing edits) |
| `src/games/kwatro-sinko/rules.ts` | 2 | 349, 350 | `parseInt(match[1]!)` / `parseInt(match[2]!)` after same node-id regex in win detection | **HOLD** — rules / legal-move path (hard rules: no `*/rules.ts` logic edits) |

No clearable (non-AI / non-rules) residual remains under `radix`. Product clear of these six hits is **out of scope** for worker agents until hard rules lift; inventory only.

## Hard-rule HOLD (explicit)

- Do **not** edit `src/games/kwatro-sinko/ai.ts` or `src/games/kwatro-sinko/rules.ts` from this ticket
- Do **not** change AI search, scoring, difficulty, or move timing; Hex Hard stays **450ms**
- Do **not** edit player-facing copy, rules-text, or aria/label strings
- Do **not** raise `radix` (or any) ceiling in [`lint-ratchet-ceilings.json`](./lint-ratchet-ceilings.json)
- No `memory/` files

## Related docs

| Doc | Role |
| --- | --- |
| [`lint-ratchet-ceilings.json`](./lint-ratchet-ceilings.json) | Enforcing ceiling (`radix: 6`) |
| [`lint-bucket-report.md`](./lint-bucket-report.md) | Helper for `npm run report:lint-buckets` |
| [`eslint-off-rules-inventory.md`](./eslint-off-rules-inventory.md) | Human inventory incl. q-mp-130 HOLD note |
| [`lint-bucket-snapshot-post914-2026-10-10.md`](./lint-bucket-snapshot-post914-2026-10-10.md) | Full ceiling snapshot @ post914 (includes radix row) |
| **This inventory** | Tip-stamped radix-only residual map @ post949 |

## Verification commands (this PR)

```bash
npm run report:lint-buckets -- --rule radix --top 20
npm run lint:ratchet
npm run check:dev-docs
npm run verify
npm run test:unit
```

Report-only: no ceiling writes. Tip owner folds; product clears stay HOLD.
