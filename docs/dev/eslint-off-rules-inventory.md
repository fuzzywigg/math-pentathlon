# ESLint off / unset rules inventory (q-mp-045 → q-mp-1269)

Measured on tip `cursor/mp-tip-post99ba` @ `13924078` (`npm run lint:ratchet` live counts = ceilings in [`lint-ratchet-ceilings.json`](./lint-ratchet-ceilings.json)). Goal: keep disabled/ceilinged rule debt visible so workers ratchet **one** rule without fixing unrelated debt.

Re-measure stamp: **q-mp-1269** (2026-10-11) — tables below match live `lint:ratchet` (12 rules). Docs only; **do not** edit ceiling JSON from this inventory task. Open `#740` (`q-mp-230` on tip `post728`) is **superseded** by this refresh (leave open; tip owner reconciles).

For a live path-bucket dump of the same ceilinged rules (no ceiling writes), see [`lint-bucket-report.md`](./lint-bucket-report.md) (`npm run report:lint-buckets`, q-mp-280).

## Already hard-on (examples)

| Rule                    | Live status                             | Notes                                                                                          |
| ----------------------- | --------------------------------------- | ---------------------------------------------------------------------------------------------- |
| `eqeqeq`                | `error` (`always`, `null: 'ignore'`)    | Stricter overlay (`null` not ignored) is **ceilinged at 1** via `npm run lint:ratchet`         |
| `no-fallthrough`        | `error` (from `@eslint/js` recommended) | **0** additional hits under default options                                                    |
| `no-implicit-coercion`  | `error` globally; `off` in AI modules   | Forcing on everywhere: **0** hits on tip                                                       |
| `prefer-object-has-own` | `error` (q-mp-159)                      | Cleared; **0** hits — no longer a ratchet candidate                                            |
| `curly`                 | hard `multi-line`; ratchet `all`        | Ceiling / live count **538** via `npm run lint:ratchet`                                        |

## Off / unset candidates that catch real bugs

Counts from `npm run lint:ratchet` (ceilinged rules) plus historical overlay notes for still-non-ceilinged residuals. Prefer the ratchet table below for ceilinged rules.

| Count | Rule                                                | Why it matters                                                                                       |
| ----: | --------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
|   237 | `@typescript-eslint/no-non-null-assertion`          | `!` hides null/undefined; common crash source (ceiling **237**)                                      |
|    65 | `@typescript-eslint/prefer-nullish-coalescing`      | `\|\|` vs `??` falsy bugs (`0`, `''`); densest residual `owl-messages.ts` (ceiling **65**)            |
|    47 | `@typescript-eslint/no-confusing-void-expression`   | Accidental void returns / side-effect expressions (ceiling **47**)                                   |
|    42 | `no-duplicate-imports`                              | Split imports drift; merge hygiene (ceiling **42**)                                                  |
|    23 | `no-param-reassign`                                 | Surprising mutation of caller state (**still non-ceilinged** — see post977 residuals addendum)       |
|    21 | `@typescript-eslint/prefer-optional-chain`          | Deep `&&` chains miss null gaps; HOLD residual **21** in `rules.ts`/`ai.ts` only (ceiling **21**)    |
|     8 | `@typescript-eslint/switch-exhaustiveness-check`    | Missing union/enum cases (ceiling **8**)                                                             |
|     6 | `radix`                                             | `parseInt` without radix; **6** HOLD on kwatro `ai.ts`/`rules.ts` (ceiling **6**)                    |
|     5 | `default-case`                                      | Switches without `default`; residual HOLD (ceiling **5**)                                            |
|     3 | `@typescript-eslint/no-shadow`                      | Shadowed bindings (ceiling **3**)                                                                    |
|     3 | `@typescript-eslint/return-await` (`always`)        | Inconsistent async error paths — **ceilinged at 3** (q-mp-316); not a non-ceilinged residual         |
|     1 | `eqeqeq` (stricter, null not ignored)               | Residual `== null` style debt — **ceilinged at 1** (q-mp-194); HOLD `fiar/rules.ts`                  |
|     0 | `no-promise-executor-return`                        | Clean                                                                                                |
|     0 | `array-callback-return`                             | Clean                                                                                                |
|     0 | `@typescript-eslint/only-throw-error`               | Clean                                                                                                |
|     0 | `@typescript-eslint/no-base-to-string`              | Clean                                                                                                |
|     0 | `@typescript-eslint/prefer-includes`                | Clean                                                                                                |
|     0 | `@typescript-eslint/prefer-string-starts-ends-with` | Clean                                                                                                |

## Ratchets already on `npm run lint:ratchet`

Live tip re-measure (`npm run lint:ratchet` @ `13924078`): every counted rule equals its ceiling (no headroom). Source of truth: [`lint-ratchet-ceilings.json`](./lint-ratchet-ceilings.json) (**12** rules).

| Rule                                              | Ceiling (= live) | Task / notes                                                                                        |
| ------------------------------------------------- | ---------------: | --------------------------------------------------------------------------------------------------- |
| `curly` (`all`)                                   |          **538** | burn-1008 + curly batches; live still `multi-line` only                                             |
| `@typescript-eslint/no-non-null-assertion`        |          **237** | q-mp-045 + later clears; live unset; count-down only                                                |
| `@typescript-eslint/prefer-nullish-coalescing`    |           **65** | q-mp-140 / q-mp-185; densest `owl-messages.ts`                                                      |
| `@typescript-eslint/no-confusing-void-expression` |           **47** | q-mp-128 / q-mp-180 + later clears                                                                  |
| `no-duplicate-imports`                            |           **42** | q-mp-127 / q-mp-226 + later clears                                                                  |
| `@typescript-eslint/prefer-optional-chain`        |           **21** | q-mp-148; HOLD only in `*/rules.ts` and `*/ai.ts`                                                   |
| `@typescript-eslint/switch-exhaustiveness-check`  |            **8** | q-mp-141                                                                                            |
| `radix`                                           |            **6** | q-mp-130; HOLD: kwatro `ai.ts` (4) + `rules.ts` (2)                                                 |
| `default-case`                                    |            **5** | q-mp-129; HOLD: fab/frac-fact `rules.ts` + fractions `arithmetic.ts`                                |
| `@typescript-eslint/no-shadow`                    |            **3** | q-mp-157 + later clears                                                                             |
| `@typescript-eslint/return-await` (`always`)      |            **3** | q-mp-316 ceiling intro; overlay probe — **not** “not yet ceilinged”                                 |
| `eqeqeq` (stricter, null not ignored)             |            **1** | q-mp-194; live config ignores `== null`; ratchet overlays stricter form                             |

## q-mp-130 · `radix` HOLD residuals

Ceiling **6** (= live tip count). All remaining hits are HOLD (hard rules: no AI behavior / no `*/rules.ts` logic):

| File                              |            Lines | Why HOLD                               |
| --------------------------------- | ---------------: | -------------------------------------- |
| `src/games/kwatro-sinko/ai.ts`    | 106–107, 331–332 | AI path — no behavior-adjacent edits   |
| `src/games/kwatro-sinko/rules.ts` |          349–350 | Rules/legal-move path — no logic edits |

Live `eslint.config.js` does **not** hard-enable `radix`; count-down only via `npm run lint:ratchet`.

## q-mp-148 — `@typescript-eslint/prefer-optional-chain`

Residual ceiling **21** — HOLD only in `*/rules.ts` and `*/ai.ts` (contig-60, fab-a-diffy, fiar, kings-quadraphages, kwatro-sinko, prime-gold, queens-guards, ramrod). Live `eslint.config.js` does **not** hard-enable the rule (count-down via `npm run lint:ratchet`).

## Historical open-PR overlap (stale tip `post728` stamp; leave open)

| Draft                                | Topic                               | Inventory impact                                                       |
| ------------------------------------ | ----------------------------------- | ---------------------------------------------------------------------- |
| #740 (`q-mp-230`, tip `post728`)     | full inventory refresh              | **superseded** by q-mp-1269 on tip `post99ba` (leave open)             |
| #733 (`q-mp-180`)                    | void clears in `game-controller.ts` | **folded** earlier                                                     |
| #738 (`q-mp-225`)                    | graph/algorithms nnnull             | **folded** earlier                                                     |
| #742 (`q-mp-226`)                    | board-ui dup-imports                | **folded** earlier                                                     |
| #727 (`q-mp-186`, on hold / post709) | nullish clears in `owl-messages.ts` | may still apply if rebased — tip owner reconciles                      |
| #730 (`q-mp-206`, post709)           | `no-console` ratchet + inventory    | may add `no-console` row; tip owner reconciles                         |

Tip owner folds: inventory re-run against folded tree; **min ceiling wins**. Never raise ceilings.

## Non-ceilinged residuals addendum

Detailed live overlay for rules **still not** in `lint-ratchet-ceilings.json` (`no-console` **24**, `no-param-reassign` **23**) lives in sibling [`eslint-non-ceilinged-residuals-post977-2026-10-10.md`](./eslint-non-ceilinged-residuals-post977-2026-10-10.md) (q-mp-558). That addendum also records that stricter `eqeqeq` (**1**/1) and `@typescript-eslint/return-await` (**3**/3) are **already ceilinged** — do **not** treat them as non-ceilinged. Older dated addenda (`eslint-non-ceilinged-residuals-2026-10-09.md` and post755/post865/post914) are historical; prefer post977 + this inventory + `lint-ratchet-ceilings.json`.
