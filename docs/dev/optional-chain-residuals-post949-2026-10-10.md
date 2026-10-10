# q-mp-510 — `@typescript-eslint/prefer-optional-chain` residual inventory (tip post949)

**Task id:** `q-mp-510`  
**Role:** worker (docs / data / chart only)  
**Tip audited:** `cursor/mp-tip-post949` @ `8698fffb` (full `8698fffb85b1e3d2289e54a665fac6162d3bdee4`)  
**Measured at:** `2026-10-10T12:20:34Z` (UTC; re-confirmed after tip rebase @ `8698fffb`)  
**Machine summary:** [`optional-chain-residuals-post949-2026-10-10.json`](./optional-chain-residuals-post949-2026-10-10.json)  
**Chart:** [`optional-chain-residuals-post949-2026-10-10.svg`](./optional-chain-residuals-post949-2026-10-10.svg)  
**Scope:** Dated **report-only** overlay inventory of ceilinged `@typescript-eslint/prefer-optional-chain` debt. **No `src/` edits. No ceiling raises. No product clears in `*/rules.ts` / `*/ai.ts`.**

## Purpose

Backlog `q-mp-510` (`docs/dev/backlog-2026-10-10h.md`) asked for a prefer-optional-chain residual map on tip post914. Worker base is now `cursor/mp-tip-post949` (cut from alpha after tip fold `#949`) — **re-measure on the live tip**. This PR stamps the inventory; it does **not** clear any residual (all hosts are hard-rule HOLD).

Prior context: `q-mp-148` cleared non-HOLD optional-chain debt and set ceiling **21**. [`eslint-off-rules-inventory.md`](./eslint-off-rules-inventory.md) already notes the HOLD residual lives only in `*/rules.ts` + `*/ai.ts`. Bucket totals also appear in [`lint-bucket-snapshot-post914-2026-10-10.md`](./lint-bucket-snapshot-post914-2026-10-10.md) (`q-mp-491`) — this ticket is the **dedicated** per-file + line + disposition map.

## Hard-rule HOLD (explicit)

- Do **not** edit `*/rules.ts`, legal-move, or scoring paths to “fix” optional-chain
- Do **not** edit `*/ai.ts` (AI search / scoring / difficulty / timing)
- Hex Hard stays **450ms**; no Stars & Bars history cap
- Do **not** raise `prefer-optional-chain` in [`lint-ratchet-ceilings.json`](./lint-ratchet-ceilings.json)
- No `memory/` files; no player-facing copy / aria changes

## Acceptance (from backlog q-mp-510)

- [x] Re-measure on live tip post949 (not stale post914 stamp alone)
- [x] Dated table + tip SHA + HOLD disposition per file
- [x] Optional `.json` + `.svg` under `docs/dev/`
- [x] No `src/` edits; no ceiling raises
- [x] `npm run check:dev-docs` clean

## Duplicate check (open drafts)

| Related draft / prior | Overlap | Action |
| --- | --- | --- |
| Tip post949 peers `#978`–`#985` (void / return-await / radix / knip / …) | Sibling round-17 workers; none is optional-chain inventory | Leave open |
| [#971](https://github.com/fuzzywigg/math-pentathlon/pull/971) `q-mp-090q` backlog 10h | Defines this task; does not ship the inventory | Leave open |
| [#955](https://github.com/fuzzywigg/math-pentathlon/pull/955) `q-mp-090p` round-16 | Spec: did **not** claim optional-chain inventory | Leave open |
| [#965](https://github.com/fuzzywigg/math-pentathlon/pull/965) `q-mp-491` lint-bucket snapshot | All-rule ceiling snapshot (includes optional-chain totals) | Complementary; leave open |
| [#944](https://github.com/fuzzywigg/math-pentathlon/pull/944) `q-mp-464` non-ceilinged residuals | Different rule set (non-ceilinged) | Orthogonal; leave open |
| Prior `q-mp-148` / tip-folded clear | Set ceiling **21**; residual HOLD remains | Historical |

No open draft already owns a dedicated prefer-optional-chain residual inventory → full task proceeds.

## Method (live tip)

```text
$ git rev-parse origin/cursor/mp-tip-post949
  8698fffb85b1e3d2289e54a665fac6162d3bdee4
  # tip advanced from cut SHA 5f24bdfe via q-mp-026o tip-pointer docs only

$ npm run lint:ratchet
  ok   @typescript-eslint/prefer-optional-chain: 21 / ceiling 21
  # (other ceilings unchanged by this docs PR; void live ceiling is 50 on tip)

$ npm run report:lint-buckets -- --rule @typescript-eslint/prefer-optional-chain --top 40
  @typescript-eslint/prefer-optional-chain: 21 / ceiling 21
  path buckets:
       5  src/games/kwatro-sinko
       5  src/games/prime-gold
       4  src/games/queens-guards
       2  src/games/fiar
       2  src/games/ramrod
       1  src/games/contig-60
       1  src/games/fab-a-diffy
       1  src/games/kings-quadraphages
  densest files:
       4  src/games/kwatro-sinko/rules.ts
       3  src/games/prime-gold/ai.ts
       3  src/games/queens-guards/rules.ts
       2  src/games/fiar/rules.ts
       2  src/games/prime-gold/rules.ts
       2  src/games/ramrod/ai.ts
       1  … (see table)

$ # Same ratchet probe as lint:ratchet, rule forced to error, JSON format
  # → 21 hits with file:line (see JSON `hits[]`)
```

Probe matches [`scripts/check-lint-ratchet.mjs`](../../scripts/check-lint-ratchet.mjs) / [`scripts/report-lint-buckets.mjs`](../../scripts/report-lint-buckets.mjs) (base `eslint.config.js` + overlay).

## Before → after metrics (report-only stamp)

| Metric | Spec backlog (`q-mp-510` @ post914) | Live tip post949 `8698fffb` | This PR |
| --- | ---: | ---: | --- |
| `prefer-optional-chain` live | **21** | **21** | Docs only |
| Ceiling | **21** | **21** | **unchanged** (no raise) |
| Headroom | 0 | 0 | 0 |
| Densest file | `kwatro-sinko/rules.ts` **4** | same **4** | same |
| Hosts outside `rules.ts`/`ai.ts` | 0 | **0** | 0 clearable |
| Tip SHA stamp | `f5d3d04a` evidence | **`8698fffb`** (cut `5f24bdfe`) | inventory + SVG + JSON |

**Spec staleness:** backlog named tip post914; live post949 optional-chain **totals and file map are identical** to the backlog stamp (flat **21**/21). Tip-adjacent ceilings elsewhere moved (e.g. void ceiling **50** on tip vs backlog **51**) — out of scope for this inventory.

## Disposition overview (live 21)

![q-mp-510 prefer-optional-chain residual disposition](./optional-chain-residuals-post949-2026-10-10.svg)

| Disposition | Count | Meaning |
| --- | ---: | --- |
| `HOLD_RULES` | **14** | Hard-rule HOLD — `*/rules.ts` (legal-move / scoring-adjacent) |
| `HOLD_AI` | **7** | Hard-rule HOLD — `*/ai.ts` (AI behavior) |
| `CLEARABLE` | **0** | No non-HOLD product hosts remain |
| Total live | **21** | Matches `lint:ratchet` / `report:lint-buckets` |

## Per-file inventory (tip `8698fffb`)

| File | Hits | Lines | Disposition |
| --- | ---: | --- | --- |
| `src/games/kwatro-sinko/rules.ts` | 4 | 133, 167, 248, 323 | `HOLD_RULES` |
| `src/games/prime-gold/ai.ts` | 3 | 58, 94, 108 | `HOLD_AI` |
| `src/games/queens-guards/rules.ts` | 3 | 218, 354, 394 | `HOLD_RULES` |
| `src/games/fiar/rules.ts` | 2 | 31, 158 | `HOLD_RULES` |
| `src/games/prime-gold/rules.ts` | 2 | 175, 201 | `HOLD_RULES` |
| `src/games/ramrod/ai.ts` | 2 | 99, 114 | `HOLD_AI` |
| `src/games/contig-60/rules.ts` | 1 | 72 | `HOLD_RULES` |
| `src/games/fab-a-diffy/rules.ts` | 1 | 270 | `HOLD_RULES` |
| `src/games/kings-quadraphages/rules.ts` | 1 | 25 | `HOLD_RULES` |
| `src/games/kwatro-sinko/ai.ts` | 1 | 311 | `HOLD_AI` |
| `src/games/queens-guards/ai.ts` | 1 | 148 | `HOLD_AI` |
| **Total** | **21** | — | all HOLD |

### Path buckets

| Path bucket | Hits |
| --- | ---: |
| `src/games/kwatro-sinko` | 5 |
| `src/games/prime-gold` | 5 |
| `src/games/queens-guards` | 4 |
| `src/games/fiar` | 2 |
| `src/games/ramrod` | 2 |
| `src/games/contig-60` | 1 |
| `src/games/fab-a-diffy` | 1 |
| `src/games/kings-quadraphages` | 1 |

### Pattern note (read-only)

Residuals are almost entirely short-circuit `&&` / `||` guards after `Map.get` / board lookups (`!cell || cell.owner !== null`, `neighbor && neighbor.owner === player`, …). Converting them would touch rules / AI hosts — **out of scope**. Do **not** open competing product-clear tickets on these files without tip-owner HOLD lift.

## Conflict notes

- No ratchet JSON edits in this PR.
- Do not open competing product-clear tickets on rules/AI hosts while this inventory is the tip truth.
- Serialize lightly with any future optional-chain clear only if tip owner explicitly lifts HOLD for a named host.

## Verification commands

```bash
npm run report:lint-buckets -- --rule @typescript-eslint/prefer-optional-chain --top 40
npm run lint:ratchet
npm run check:dev-docs
npm run verify
npm run test:unit
```

Expected: optional-chain **21**/21; `check:dev-docs` problems **0**; verify + unit green; no ceiling / `src/` diffs in this PR.

**Next action: fold into tip by the tip owner.**
