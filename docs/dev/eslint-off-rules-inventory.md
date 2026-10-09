# ESLint off / unset rules inventory (q-mp-045 → q-mp-230)

Measured on tip `cursor/mp-tip-post728` @ `b5884207` against `src/` (probe overlay; live `eslint.config.js` unchanged for these counts). Goal: keep disabled/ceilinged rule debt visible so workers ratchet **one** rule without fixing unrelated debt.

Re-measure stamp: **q-mp-230** (2026-10-09) — tables below match `npm run lint:ratchet` live counts + one-shot overlay probes. Docs only; ceilings live in `docs/dev/lint-ratchet-ceilings.json`.

## Already hard-on (examples from the task)

| Rule                    | Live status                             | Notes                                                      |
| ----------------------- | --------------------------------------- | ---------------------------------------------------------- |
| `eqeqeq`                | `error` (`always`, `null: 'ignore'`)    | Stricter `always` (null not ignored) would add **12** hits |
| `no-fallthrough`        | `error` (from `@eslint/js` recommended) | **0** additional hits under default options                |
| `no-implicit-coercion`  | `error` globally; `off` in AI modules   | Forcing on everywhere: **0** hits on tip                   |
| `prefer-object-has-own` | `error` (q-mp-159)                      | Cleared; **0** hits — no longer a ratchet candidate        |
| `curly`                 | hard `multi-line`; ratchet `all`        | Ceiling / live count **538** via `npm run lint:ratchet`    |

## Off / unset candidates that catch real bugs

Counts from a one-shot probe enabling each rule as `error` over `src/` (tip `b5884207`).

| Count | Rule                                                | Why it matters                                                                                       |
| ----: | --------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
|   268 | `@typescript-eslint/no-non-null-assertion`          | `!` hides null/undefined; common crash source (ceiling **268**)                                      |
|   183 | `@typescript-eslint/no-confusing-void-expression`   | Accidental void returns / side-effect expressions (ceiling **183**; densest `src/main.ts` 12)        |
|   122 | `no-duplicate-imports`                              | Split imports drift; merge hygiene (ceiling **122**)                                                 |
|    65 | `@typescript-eslint/prefer-nullish-coalescing`      | `\|\|` vs `??` falsy bugs (`0`, `''`); densest residual `owl-messages.ts` 9 (open #727 on hold → −9) |
|    23 | `no-param-reassign`                                 | Surprising mutation of caller state (densest `fractions/arithmetic.ts` 11; not yet ceilinged)        |
|    21 | `@typescript-eslint/prefer-optional-chain`          | Deep `&&` chains miss null gaps; HOLD residual **21** in `rules.ts`/`ai.ts` only (ceiling **21**)    |
|    13 | `@typescript-eslint/no-shadow`                      | Shadowed bindings (ceiling **13**)                                                                   |
|    12 | `eqeqeq` (stricter, null not ignored)               | Residual `== null` style debt (was 15)                                                               |
|     8 | `@typescript-eslint/switch-exhaustiveness-check`    | Missing union/enum cases (ceiling **8**)                                                             |
|     7 | `@typescript-eslint/return-await` (`always`)        | Inconsistent async error paths (not yet ceilinged)                                                   |
|     6 | `radix`                                             | `parseInt` without radix; **6** HOLD on kwatro `ai.ts`/`rules.ts` (ceiling **6**)                    |
|     5 | `default-case`                                      | Switches without `default`; residual HOLD (ceiling **5**)                                            |
|     0 | `no-promise-executor-return`                        | Clean                                                                                                |
|     0 | `array-callback-return`                             | Clean                                                                                                |
|     0 | `@typescript-eslint/only-throw-error`               | Clean                                                                                                |
|     0 | `@typescript-eslint/no-base-to-string`              | Clean                                                                                                |
|     0 | `@typescript-eslint/prefer-includes`                | Clean                                                                                                |
|     0 | `@typescript-eslint/prefer-string-starts-ends-with` | Clean                                                                                                |

## Ratchets already on `npm run lint:ratchet`

Live tip re-measure (`npm run lint:ratchet` on `b5884207`): every counted rule equals its ceiling (no headroom).

| Rule                                              | Ceiling (= live) | Task                      | Notes                                                                                                                                               |
| ------------------------------------------------- | ---------------: | ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `curly` (`all`)                                   |          **538** | burn-1008 + curly batches | Live still `multi-line` only                                                                                                                        |
| `@typescript-eslint/no-non-null-assertion`        |          **268** | q-mp-045                  | Live unset; count-down only                                                                                                                         |
| `@typescript-eslint/no-confusing-void-expression` |          **183** | q-mp-128                  | Live unset; densest `src/main.ts` 12; open #733 clears `game-controller.ts` (−51 → ceiling 132 when folded)                                         |
| `no-duplicate-imports`                            |          **122** | q-mp-127                  | Live unset; count-down only                                                                                                                         |
| `@typescript-eslint/prefer-nullish-coalescing`    |           **65** | q-mp-140 / q-mp-185       | Live unset; densest `owl-messages.ts` 9                                                                                                             |
| `@typescript-eslint/prefer-optional-chain`        |           **21** | q-mp-148                  | HOLD only in `*/rules.ts` and `*/ai.ts`                                                                                                             |
| `@typescript-eslint/no-shadow`                    |           **13** | q-mp-157                  | Live unset; count-down only                                                                                                                         |
| `@typescript-eslint/switch-exhaustiveness-check`  |            **8** | q-mp-141                  | Hits (1 each): `attribute-ui`, `dice-ui`, `expressions/evaluator`, `owl-messages`, `owl-system`, `graph-demo`, `polyomino-demo`, `star-track/rules` |
| `radix`                                           |            **6** | q-mp-130                  | HOLD: kwatro `ai.ts` (4) + `rules.ts` (2)                                                                                                           |
| `default-case`                                    |            **5** | q-mp-129                  | HOLD: `fab-a-diffy/rules.ts` (1) + `frac-fact/rules.ts` (3) + `fractions/arithmetic.ts` (1)                                                         |

## q-mp-130 · `radix` HOLD residuals

Ceiling **6** (= live tip count). All remaining hits are HOLD (hard rules: no AI behavior / no `*/rules.ts` logic):

| File                              |            Lines | Why HOLD                               |
| --------------------------------- | ---------------: | -------------------------------------- |
| `src/games/kwatro-sinko/ai.ts`    | 106–107, 331–332 | AI path — no behavior-adjacent edits   |
| `src/games/kwatro-sinko/rules.ts` |          349–350 | Rules/legal-move path — no logic edits |

Live `eslint.config.js` does **not** hard-enable `radix`; count-down only via `npm run lint:ratchet`.

## q-mp-148 — `@typescript-eslint/prefer-optional-chain`

Residual ceiling **21** — HOLD only in `*/rules.ts` and `*/ai.ts` (contig-60, fab-a-diffy, fiar, kings-quadraphages, kwatro-sinko, prime-gold, queens-guards, ramrod). Live `eslint.config.js` does **not** hard-enable the rule (count-down via `npm run lint:ratchet`).

## Open-PR overlap (tip `cursor/mp-tip-post728`, q-mp-230 measure)

| Draft                                | Topic                               | Inventory impact when folded                       |
| ------------------------------------ | ----------------------------------- | -------------------------------------------------- |
| #733 (`q-mp-180`)                    | void clears in `game-controller.ts` | void **183 → 132** (−51); may touch this inventory |
| #727 (`q-mp-186`, on hold / post709) | nullish clears in `owl-messages.ts` | nullish **65 → 56** (−9) if rebased                |
| #730 (`q-mp-206`, post709)           | `no-console` ratchet + inventory    | may add `no-console` row; tip owner reconciles     |

No open draft into `cursor/mp-tip-post728` already owns a full inventory re-measure. Tip owner folds; **min ceiling wins** after re-measure. Never raise ceilings.
)
