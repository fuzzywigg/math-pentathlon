# ESLint non-ceilinged residuals refresh (q-mp-390)

**Task id:** `q-mp-390`  
**Role:** worker (docs / data / chart only)  
**Tip measured:** `cursor/mp-tip-post865` @ `3908809d` (`3908809d672ed70eede7b9c0ad63a6fa475e28e5`)  
**Measured at:** `2026-10-10T05:53:24Z` (UTC)  
**Supersedes stamp of:** [`eslint-non-ceilinged-residuals-post755-2026-10-09.md`](./eslint-non-ceilinged-residuals-post755-2026-10-09.md) (`q-mp-315` on tip `post755` @ `dab1ac97`) and [`eslint-non-ceilinged-residuals-2026-10-09.md`](./eslint-non-ceilinged-residuals-2026-10-09.md) (`q-mp-240` on tip `post748`) — leave open drafts `#821` / `#759` with **contained** (`gh pr comment` denied to this integration; noted in PR body)  
**Data:** [`eslint-non-ceilinged-residuals-post865-2026-10-10.json`](./eslint-non-ceilinged-residuals-post865-2026-10-10.json)  
**Chart:** ![non-ceilinged residuals @ post865](./eslint-non-ceilinged-residuals-post865-2026-10-10.svg)

## Purpose

Backlog `q-mp-390` (draft `#879`, written against tip `post830` @ `bcf6f825`) asked to re-run the non-ceilinged overlay and publish a dated addendum. Live tip is `cursor/mp-tip-post865` @ `3908809d` (alpha tip fold `#865`). Spec may be stale — re-measure every baseline on the live tree.

**Stale → live drift (important):** `eqeqeq` and `@typescript-eslint/return-await` are **no longer non-ceilinged**. Tip ceilings already include void **58** / return-await **3** / eqeqeq **1** (see [`lint-ratchet-ceilings.json`](./lint-ratchet-ceilings.json)). Remaining truly non-ceilinged high-signal residuals: `no-console` and `no-param-reassign`. Ceiling intro for `no-console` stays `q-mp-317` (not this ticket).

Docs / data / chart only — no `eslint.config.js` / ceiling JSON / knip baseline / `src/` / test behavior edits.

## Duplicate check (open drafts)

| PR                                                            | Topic                                               | Relation                                                  |
| ------------------------------------------------------------- | --------------------------------------------------- | --------------------------------------------------------- |
| [#821](https://github.com/fuzzywigg/math-pentathlon/pull/821) | `q-mp-315` post755 non-ceilinged refresh            | leave open; **contained** by tip + this post865 remeasure |
| [#759](https://github.com/fuzzywigg/math-pentathlon/pull/759) | `q-mp-240` post748 non-ceilinged addendum           | leave open; **contained** (file already on tip)           |
| [#863](https://github.com/fuzzywigg/math-pentathlon/pull/863) | `q-mp-364` lint-bucket ceiling snapshot             | orthogonal (ceilinged buckets helper snapshot)            |
| [#877](https://github.com/fuzzywigg/math-pentathlon/pull/877) | `q-mp-366` owl-component void brace (−3)            | orthogonal code clear; not inventory                      |
| [#878](https://github.com/fuzzywigg/math-pentathlon/pull/878) | `q-mp-371` hex UI coverage r25                      | orthogonal tests-only                                     |
| [#879](https://github.com/fuzzywigg/math-pentathlon/pull/879) | `q-mp-090l` backlog 10c (spec owner for `q-mp-390`) | lists this ticket; no residual files                      |

No open draft into `cursor/mp-tip-post865` already owns a post865 non-ceilinged residual refresh.

## Live tip ceilings (context)

```text
$ git rev-parse HEAD
  3908809d672ed70eede7b9c0ad63a6fa475e28e5

$ npm run lint:ratchet
  ok   curly: 538 / ceiling 538
  ok   @typescript-eslint/no-non-null-assertion: 246 / ceiling 246
  ok   @typescript-eslint/no-confusing-void-expression: 58 / ceiling 58
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

| Rule                              | Probe options                                                  | Status on tip post865           |
| --------------------------------- | -------------------------------------------------------------- | ------------------------------- |
| `no-console`                      | `'error'` (live unset / not in ratchet)                        | **still non-ceilinged**         |
| `no-param-reassign`               | `'error'` (live unset)                                         | **still non-ceilinged**         |
| `eqeqeq`                          | `['error', 'always']` — live is `always` with `null: 'ignore'` | **ceilinged at 1** (`q-mp-194`) |
| `@typescript-eslint/return-await` | `['error', 'always']`                                          | **ceilinged at 3** (`q-mp-316`) |

## Before → after (inventory totals)

| Rule                              | post755 (`dab1ac97`, `q-mp-315`) | post830 evidence (`bcf6f825`, backlog) | post865 (`3908809d`, this) |                                           Δ vs post755 |
| --------------------------------- | -------------------------------: | -------------------------------------: | -------------------------: | -----------------------------------------------------: |
| `no-console`                      |                               24 |                                     24 |                     **24** |                                                      0 |
| `no-param-reassign`               |                               23 |                                     23 |                     **23** |                                                      0 |
| `eqeqeq` (stricter)               |                               12 |                                      1 |                  **1** / 1 | **−11** (clears folded; residual HOLD `fiar/rules.ts`) |
| `@typescript-eslint/return-await` |                                3 |                                      3 |                  **3** / 3 |                                                      0 |

### Visual — still non-ceilinged + now-ceilinged residuals

![q-mp-390 non-ceilinged residuals chart](./eslint-non-ceilinged-residuals-post865-2026-10-10.svg)

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

**Not AI / rules / scoring.** Intentional soft-fail `console.error` / `console.warn` keep-sites dominate. Line drift vs post755: kings-quadraphages controller **109 → 108**. Ceiling intro remains `q-mp-317` (sole `no-console` key).

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

Live config still uses `eqeqeq: ['error', 'always', { null: 'ignore' }]`. Overlay drops the null ignore. Tip ratchet ceiling is **1**.

| File                      | Hits | Lines | Disposition           |
| ------------------------- | ---: | ----- | --------------------- |
| `src/games/fiar/rules.ts` |    1 | 213   | **HOLD** — rules path |

**Δ vs post755:** **12 → 1** (−11 clearable sites folded via `q-mp-194` / tip lineage). Residual HOLD in `rules.ts` — not fixable under hard rules. Do not re-clear or raise the ceiling here.

---

## `@typescript-eslint/return-await` — 3 / ceiling 3 (now ceilinged)

| File                                   | Hits | Lines | Disposition                                                           |
| -------------------------------------- | ---: | ----- | --------------------------------------------------------------------- |
| `src/games/fab-a-diffy/ai-client.ts`   |    1 | 46    | AI-client style only — undrafted `q-mp-247`; ceiling intro `q-mp-316` |
| `src/games/fiar/ai-client.ts`          |    1 | 45    | AI-client style only                                                  |
| `src/games/queens-guards/ai-client.ts` |    1 | 46    | AI-client style only                                                  |

Totals unchanged vs post755 / post830 evidence. Remaining **3** are all under `*/ai-client.ts`. Ceiling intro already landed (`q-mp-316` at **3**).

---

## Acceptance

- [x] Overlay re-run on tip `post865` @ `3908809d` (not stale `bcf6f825`)
- [x] Dated residual table + visual (md + json + svg)
- [x] Tip SHA recorded; tip ceilings void **58** / return-await **3** / eqeqeq **1** restated
- [x] Still-non-ceilinged vs now-ceilinged split documented
- [x] AI / `rules.ts` / scoring-path HOLD rows flagged
- [x] Docs / data / chart only; no product / ceiling edits
- [x] Hex Hard assert stays **450ms**

**Next action: fold into tip by the tip owner.**
