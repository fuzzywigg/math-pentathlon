# ESLint non-ceilinged residuals inventory (q-mp-558)

**Task id:** `q-mp-558`  
**Role:** worker (docs / data / chart only)  
**Tip measured:** `cursor/mp-tip-post977` @ `f0d0a162` (`f0d0a162620f324bfa8cef244a665555113d9f44`)  
**Measured at:** `2026-10-10T14:53:00Z` (UTC)  
**Supersedes stamp of:** [`eslint-non-ceilinged-residuals-post914-2026-10-10.md`](./eslint-non-ceilinged-residuals-post914-2026-10-10.md) (`q-mp-464` on tip `post914` @ `753052a6`), [`eslint-non-ceilinged-residuals-post865-2026-10-10.md`](./eslint-non-ceilinged-residuals-post865-2026-10-10.md) (`q-mp-390`), [`eslint-non-ceilinged-residuals-post755-2026-10-09.md`](./eslint-non-ceilinged-residuals-post755-2026-10-09.md) (`q-mp-315`), and [`eslint-non-ceilinged-residuals-2026-10-09.md`](./eslint-non-ceilinged-residuals-2026-10-09.md) (`q-mp-240`) — leave open drafts `#944` / `#883` / `#821` / `#759` with **contained** (worker does not comment/label/close other PRs; noted in this PR body)  
**Data:** [`eslint-non-ceilinged-residuals-post977-2026-10-10.json`](./eslint-non-ceilinged-residuals-post977-2026-10-10.json)  
**Chart:** ![non-ceilinged residuals @ post977](./eslint-non-ceilinged-residuals-post977-2026-10-10.svg)

## Purpose

Backlog `q-mp-558` (draft `#1009` / `docs/dev/backlog-2026-10-10s.md`, written against tip `post949` @ `d7a3989a`) asked to re-run the non-ceilinged overlay and publish a dated addendum. Live tip is `cursor/mp-tip-post977` @ `f0d0a162` (alpha tip fold `#977` after post949). Spec may be stale — every baseline re-measured on the live tree.

**Stale → live drift:** Spec named tip `post949` and pointed at prior post914 inventory `#944`/`464`. Live tip already has void **48** / nnnull **239** (post949 fold includes further clears). Overlay residual **totals are unchanged** vs post914 (`q-mp-464`) and post865 (`q-mp-390`): `no-console` **24**, `no-param-reassign` **23**, stricter `eqeqeq` **1**/1, `return-await` **3**/3. Line map drifted slightly in PWA keep-sites (`register.ts`, `bootstrap-owl.ts`).

Docs / data / chart only — no `eslint.config.js` / ceiling JSON / knip baseline / `src/` / test behavior edits. No ratchet raises. No new ceiling introductions.

## Duplicate check (open drafts)

| PR                                                              | Topic                                             | Relation                                                               |
| --------------------------------------------------------------- | ------------------------------------------------- | ---------------------------------------------------------------------- |
| [#944](https://github.com/fuzzywigg/math-pentathlon/pull/944)   | `q-mp-464` post914 non-ceilinged refresh          | leave open; **contained** by this post977 remeasure                    |
| [#883](https://github.com/fuzzywigg/math-pentathlon/pull/883)   | `q-mp-390` post865 non-ceilinged refresh          | leave open; **contained**                                              |
| [#821](https://github.com/fuzzywigg/math-pentathlon/pull/821)   | `q-mp-315` post755 non-ceilinged refresh          | leave open; **contained**                                              |
| [#759](https://github.com/fuzzywigg/math-pentathlon/pull/759)   | `q-mp-240` post748 non-ceilinged addendum         | leave open; **contained**                                              |
| [#1007](https://github.com/fuzzywigg/math-pentathlon/pull/1007) | `q-mp-536` lint-bucket ceiling snapshot @ post949 | orthogonal (ceilinged buckets helper snapshot; not nonceiling overlay) |
| [#1009](https://github.com/fuzzywigg/math-pentathlon/pull/1009) | `q-mp-090s` backlog 10s (spec owner for `558`)    | lists this ticket; no residual files                                   |

No open draft into `cursor/mp-tip-post977` already owns a post977 / post949 non-ceilinged residual refresh.

## Live tip ceilings (context)

```text
$ git rev-parse HEAD
  f0d0a162620f324bfa8cef244a665555113d9f44

$ npm run lint:ratchet
  ok   curly: 538 / ceiling 538
  ok   @typescript-eslint/no-non-null-assertion: 239 / ceiling 239
  ok   @typescript-eslint/no-confusing-void-expression: 48 / ceiling 48
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

| Rule                              | Probe options                                                  | Status on tip post977           |
| --------------------------------- | -------------------------------------------------------------- | ------------------------------- |
| `no-console`                      | `'error'` (live unset / not in ratchet)                        | **still non-ceilinged**         |
| `no-param-reassign`               | `'error'` (live unset)                                         | **still non-ceilinged**         |
| `eqeqeq`                          | `['error', 'always']` — live is `always` with `null: 'ignore'` | **ceilinged at 1** (`q-mp-194`) |
| `@typescript-eslint/return-await` | `['error', 'always']`                                          | **ceilinged at 3** (`q-mp-316`) |

## Before → after (inventory totals)

| Rule                              | post865 (`3908809d`, `q-mp-390`) | post914 (`753052a6`, `q-mp-464`) | post977 (`f0d0a162`, this) | Δ vs post914 |
| --------------------------------- | -------------------------------: | -------------------------------: | -------------------------: | -----------: |
| `no-console`                      |                               24 |                               24 |                     **24** |            0 |
| `no-param-reassign`               |                               23 |                               23 |                     **23** |            0 |
| `eqeqeq` (stricter)               |                        **1** / 1 |                        **1** / 1 |                  **1** / 1 |            0 |
| `@typescript-eslint/return-await` |                        **3** / 3 |                        **3** / 3 |                  **3** / 3 |            0 |

Ceiling context drift (not overlay totals): void **51 → 48**, nnnull **241 → 239** since post914 stamp.

### Visual — still non-ceilinged + now-ceilinged residuals

![q-mp-558 non-ceilinged residuals chart](./eslint-non-ceilinged-residuals-post977-2026-10-10.svg)

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
| `src/pwa/register.ts`                             |    2 | 83, 92                                         | keep — SW register soft-fail (lines **79,88 → 83,92**)     |
| `src/demos/expression-demo.ts`                    |    1 | 510                                            | clearable noise (`console.log`) — optional with `q-mp-317` |
| `src/pwa/bootstrap-owl.ts`                        |    1 | 60                                             | keep — owl bootstrap soft-fail (line **55 → 60**)          |
| `src/ui/game-error-boundary.ts`                   |    1 | 108                                            | keep — error-boundary soft-fail                            |
| `src/core/router.ts`                              |    1 | 12                                             | keep — router soft-fail                                    |
| `src/games/kings-quadraphages/game-controller.ts` |    1 | 108                                            | review before strip — controller soft-fail                 |

**Not AI / rules / scoring.** Intentional soft-fail `console.error` / `console.warn` keep-sites dominate. Totals unchanged vs post914; PWA line map drifted. Ceiling intro remains `q-mp-317` (sole `no-console` key).

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

Clearable headroom: **11** (arithmetic only). HOLD in AI/rules: **12**. Not fixable under hard rules for the HOLD rows. Line map unchanged vs post914.

---

## Stricter `eqeqeq` — 1 / ceiling 1 (now ceilinged)

Live config still uses `eqeqeq: ['error', 'always', { null: 'ignore' }]`. Overlay drops the null ignore. Tip ratchet ceiling is **1** (`npm run lint:ratchet` → **1**/1).

| File                      | Hits | Lines | Disposition           |
| ------------------------- | ---: | ----- | --------------------- |
| `src/games/fiar/rules.ts` |    1 | 213   | **HOLD** — rules path |

**Δ vs post914:** **0**. Residual HOLD in `rules.ts` — not fixable under hard rules. Do not re-clear or raise the ceiling here.

Note: `npm run report:lint-buckets` may print `eqeqeq: 0 / ceiling 1` because the live config ignores `== null`; the ratchet/overlay stricter probe is the inventory source of truth for this residual.

---

## `@typescript-eslint/return-await` — 3 / ceiling 3 (now ceilinged)

| File                                   | Hits | Lines | Disposition                                                           |
| -------------------------------------- | ---: | ----- | --------------------------------------------------------------------- |
| `src/games/fab-a-diffy/ai-client.ts`   |    1 | 46    | AI-client style only — undrafted `q-mp-247`; ceiling intro `q-mp-316` |
| `src/games/fiar/ai-client.ts`          |    1 | 45    | AI-client style only                                                  |
| `src/games/queens-guards/ai-client.ts` |    1 | 46    | AI-client style only                                                  |

Totals unchanged vs post914. Remaining **3** are all under `*/ai-client.ts`.

---

## Acceptance

- [x] Overlay re-run on tip `post977` @ `f0d0a162` (not stale `post949` @ `d7a3989a`)
- [x] Dated residual table + visual (md + json + svg)
- [x] Tip SHA recorded; tip ceilings nnnull **239** / void **48** / nullish **65** / return-await **3** / eqeqeq **1** restated
- [x] Still-non-ceilinged vs now-ceilinged split documented; Δ vs post914 = **0** on overlay totals
- [x] AI / `rules.ts` / scoring-path HOLD rows flagged
- [x] Docs / data / chart only; no product / ceiling / eslint config edits; no ratchet raises
- [x] Hex Hard assert stays **450ms**

**Next action: fold into tip by the tip owner.**
