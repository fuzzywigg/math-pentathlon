# ESLint non-ceilinged residuals refresh (q-mp-464)

**Task id:** `q-mp-464`  
**Role:** worker (docs / data / chart only)  
**Tip measured:** `cursor/mp-tip-post914` @ `753052a6` (`753052a6844e80c6264d1d2480deafa5a9e7b59c`)  
**Measured at:** `2026-10-10T09:21:49Z` (UTC)  
**Supersedes stamp of:** [`eslint-non-ceilinged-residuals-post865-2026-10-10.md`](./eslint-non-ceilinged-residuals-post865-2026-10-10.md) (`q-mp-390` on tip `post865` @ `3908809d`), [`eslint-non-ceilinged-residuals-post755-2026-10-09.md`](./eslint-non-ceilinged-residuals-post755-2026-10-09.md) (`q-mp-315`), and [`eslint-non-ceilinged-residuals-2026-10-09.md`](./eslint-non-ceilinged-residuals-2026-10-09.md) (`q-mp-240`) — leave open drafts `#883` / `#821` / `#759` with **contained** (worker does not comment/label/close other PRs; noted in this PR body)  
**Data:** [`eslint-non-ceilinged-residuals-post914-2026-10-10.json`](./eslint-non-ceilinged-residuals-post914-2026-10-10.json)  
**Chart:** ![non-ceilinged residuals @ post914](./eslint-non-ceilinged-residuals-post914-2026-10-10.svg)

## Purpose

Backlog `q-mp-464` (draft `#934` / `docs/dev/backlog-2026-10-10f.md`, written against tip `post898` @ `788b4558`) asked to re-run the non-ceilinged overlay and publish a dated addendum. Live tip is `cursor/mp-tip-post914` @ `753052a6` (alpha tip fold `#914`). Spec may be stale — every baseline re-measured on the live tree.

**Stale → live drift:** Spec assumed tip ceilings after `#916` fold (nnnull **241** / void **52**). Live tip already has void **51** (post898 fold includes `#923` / `q-mp-448` −1) and nnnull **241**. Overlay residual **totals are unchanged** vs post865 (`q-mp-390`): `no-console` **24**, `no-param-reassign` **23**, stricter `eqeqeq` **1**/1, `return-await` **3**/3.

Docs / data / chart only — no `eslint.config.js` / ceiling JSON / knip baseline / `src/` / test behavior edits. No ratchet raises.

## Duplicate check (open drafts)

| PR                                                            | Topic                                               | Relation                                                                  |
| ------------------------------------------------------------- | --------------------------------------------------- | ------------------------------------------------------------------------- |
| [#883](https://github.com/fuzzywigg/math-pentathlon/pull/883) | `q-mp-390` post865 non-ceilinged refresh            | leave open; **contained** by this post914 remeasure                       |
| [#821](https://github.com/fuzzywigg/math-pentathlon/pull/821) | `q-mp-315` post755 non-ceilinged refresh            | leave open; **contained**                                                 |
| [#759](https://github.com/fuzzywigg/math-pentathlon/pull/759) | `q-mp-240` post748 non-ceilinged addendum           | leave open; **contained**                                                 |
| [#928](https://github.com/fuzzywigg/math-pentathlon/pull/928) | `q-mp-441` lint-bucket ceiling snapshot @ post898   | orthogonal (ceilinged buckets helper snapshot; not nonceiling overlay)    |
| [#934](https://github.com/fuzzywigg/math-pentathlon/pull/934) | `q-mp-090o` backlog 10f (spec owner for `q-mp-464`) | lists this ticket; no residual files                                      |

No open draft into `cursor/mp-tip-post914` already owns a post914 non-ceilinged residual refresh. Unfolded `#935` into post898 is tests-only engine coverage — orthogonal.

## Live tip ceilings (context)

```text
$ git rev-parse HEAD
  753052a6844e80c6264d1d2480deafa5a9e7b59c

$ npm run lint:ratchet
  ok   curly: 538 / ceiling 538
  ok   @typescript-eslint/no-non-null-assertion: 241 / ceiling 241
  ok   @typescript-eslint/no-confusing-void-expression: 51 / ceiling 51
  ok   radix: 6 / ceiling 6
  ok   default-case: 5 / ceiling 5
  ok   no-duplicate-imports: 42 / ceiling 42
  ok   @typescript-eslint/prefer-nullish-coalescing: 65 / ceiling 65
  ok   @typescript-eslint/prefer-optional-chain: 21 / ceiling 21
  ok   @typescript-eslint/switch-exhaustiveness-check: 8 / ceiling 8
  ok   @typescript-eslint/no-shadow: 3 / ceiling 3
  ok   eqeqeq: 1 / ceiling 1
  ok   @typescript-eslint/return-await: 3 / ceiling 3
```

## Overlay probe method

One-shot flat-config overlay over live `eslint.config.js` (same pattern as `scripts/check-lint-ratchet.mjs`), forcing the inventory rules as `error` on `src/`. Temp probe config is deleted after the run (not committed).

| Rule                              | Probe options                                                  | Status on tip post914           |
| --------------------------------- | -------------------------------------------------------------- | ------------------------------- |
| `no-console`                      | `'error'` (live unset / not in ratchet)                        | **still non-ceilinged**         |
| `no-param-reassign`               | `'error'` (live unset)                                         | **still non-ceilinged**         |
| `eqeqeq`                          | `['error', 'always']` — live is `always` with `null: 'ignore'` | **ceilinged at 1** (`q-mp-194`) |
| `@typescript-eslint/return-await` | `['error', 'always']`                                          | **ceilinged at 3** (`q-mp-316`) |

## Before → after (inventory totals)

| Rule                              | post865 (`3908809d`, `q-mp-390`) | post898 evidence (`788b4558`, backlog) | post914 (`753052a6`, this) | Δ vs post865 |
| --------------------------------- | -------------------------------: | -------------------------------------: | -------------------------: | -----------: |
| `no-console`                      |                               24 |                                    n/a |                     **24** |            0 |
| `no-param-reassign`               |                               23 |                                    n/a |                     **23** |            0 |
| `eqeqeq` (stricter)               |                        **1** / 1 |                                    n/a |                  **1** / 1 |            0 |
| `@typescript-eslint/return-await` |                        **3** / 3 |                                    n/a |                  **3** / 3 |            0 |

Ceiling context drift (not overlay totals): void **58 → 51**, nnnull **246 → 241** since post865 stamp.

### Visual — still non-ceilinged + now-ceilinged residuals

![q-mp-464 non-ceilinged residuals chart](./eslint-non-ceilinged-residuals-post914-2026-10-10.svg)

```text
Still non-ceilinged:
no-console ████████████████████████  24
no-param   ███████████████████████   23

Now ceilinged (were non-ceilinged on post748/post755):
eqeqeq     █                          1 / 1
return-aw  ███                        3 / 3
```

---

## `no-console` — 24 (still non-ceilinged)

| File                                              | Hits | Lines                                          | Disposition                                                |
| ------------------------------------------------- | ---: | ---------------------------------------------- | ---------------------------------------------------------- |
| `src/main.ts`                                     |   10 | 68, 85, 217, 252, 280, 308, 336, 364, 392, 420 | keep — bootstrap / route soft-fail                         |
| `src/core/storage/storage.ts`                     |    7 | 91, 109, 121, 131, 141, 155, 169               | keep — storage soft-fail                                   |
| `src/pwa/register.ts`                             |    2 | 79, 88                                         | keep — SW register soft-fail                               |
| `src/demos/expression-demo.ts`                    |    1 | 510                                            | clearable noise (`console.log`) — optional with `q-mp-317` |
| `src/pwa/bootstrap-owl.ts`                        |    1 | 55                                             | keep — owl bootstrap soft-fail                             |
| `src/ui/game-error-boundary.ts`                   |    1 | 108                                            | keep — error-boundary soft-fail                            |
| `src/core/router.ts`                              |    1 | 12                                             | keep — router soft-fail                                    |
| `src/games/kings-quadraphages/game-controller.ts` |    1 | 108                                            | review before strip — controller soft-fail                 |

**Not AI / rules / scoring.** Intentional soft-fail `console.error` / `console.warn` keep-sites dominate. Line map unchanged vs post865. Ceiling intro remains `q-mp-317` (sole `no-console` key).

---

## `no-param-reassign` — 23 (still non-ceilinged)

| File                               | Hits | Lines                                     | Disposition                                       |
| ---------------------------------- | ---: | ----------------------------------------- | ------------------------------------------------- |
| `src/core/fractions/arithmetic.ts` |   11 | 15–16, 20–21, 31–32, 54–55, 101, 627, 685 | clearable (non-AI) — backlog `q-mp-318`           |
| `src/games/fiar/ai.ts`             |    5 | 327, 607, 624, 658, 675                   | **HOLD** — AI path (hard rules)                   |
| `src/games/calla/ai.ts`            |    2 | 273, 295                                  | **HOLD** — AI path                                |
| `src/games/hex/ai.ts`              |    2 | 220, 240                                  | **HOLD** — AI path (Hex Hard **450ms** untouched) |
| `src/games/queens-guards/ai.ts`    |    2 | 303, 323                                  | **HOLD** — AI path                                |
| `src/games/fiar/rules.ts`          |    1 | 66                                        | **HOLD** — rules / legal-move path                |

Clearable headroom: **11** (arithmetic only). HOLD in AI/rules: **12**. Not fixable under hard rules for the HOLD rows.

---

## Stricter `eqeqeq` — 1 / ceiling 1 (now ceilinged)

Live config still uses `eqeqeq: ['error', 'always', { null: 'ignore' }]`. Overlay drops the null ignore. Tip ratchet ceiling is **1** (`npm run lint:ratchet` → **1**/1).

| File                      | Hits | Lines | Disposition           |
| ------------------------- | ---: | ----- | --------------------- |
| `src/games/fiar/rules.ts` |    1 | 213   | **HOLD** — rules path |

**Δ vs post865:** **0**. Residual HOLD in `rules.ts` — not fixable under hard rules. Do not re-clear or raise the ceiling here.

Note: `npm run report:lint-buckets` may print `eqeqeq: 0 / ceiling 1` because the live config ignores `== null`; the ratchet/overlay stricter probe is the inventory source of truth for this residual.

---

## `@typescript-eslint/return-await` — 3 / ceiling 3 (now ceilinged)

| File                                   | Hits | Lines | Disposition                                                           |
| -------------------------------------- | ---: | ----- | --------------------------------------------------------------------- |
| `src/games/fab-a-diffy/ai-client.ts`   |    1 | 46    | AI-client style only — undrafted `q-mp-247`; ceiling intro `q-mp-316` |
| `src/games/fiar/ai-client.ts`          |    1 | 45    | AI-client style only                                                  |
| `src/games/queens-guards/ai-client.ts` |    1 | 46    | AI-client style only                                                  |

Totals unchanged vs post865. Remaining **3** are all under `*/ai-client.ts`.

---

## Acceptance

- [x] Overlay re-run on tip `post914` @ `753052a6` (not stale `post898` @ `788b4558`)
- [x] Dated residual table + visual (md + json + svg)
- [x] Tip SHA recorded; tip ceilings nnnull **241** / void **51** / nullish **65** / return-await **3** / eqeqeq **1** restated
- [x] Still-non-ceilinged vs now-ceilinged split documented; Δ vs post865 = **0** on overlay totals
- [x] AI / `rules.ts` / scoring-path HOLD rows flagged
- [x] Docs / data / chart only; no product / ceiling edits; no ratchet raises
- [x] Hex Hard assert stays **450ms**

**Next action: fold into tip by the tip owner.**
