# ESLint off / unset rules inventory (q-mp-045 → q-mp-230)

Measured on tip `cursor/mp-tip-post728` @ `7cb50d57` after q-mp-026g folds (#733/#738/#742 applied; inventory content commit) against `src/` (probe overlay; live `eslint.config.js` unchanged for these counts). Goal: keep disabled/ceilinged rule debt visible so workers ratchet **one** rule without fixing unrelated debt.

Re-measure stamp: **q-mp-230** (2026-10-09, tip-owner re-run after fold) — tables below match `npm run lint:ratchet` live counts + one-shot overlay probes. Docs only; ceilings live in `docs/dev/lint-ratchet-ceilings.json`.

For a live path-bucket dump of the same ceilinged rules (no ceiling writes), see [`lint-bucket-report.md`](./lint-bucket-report.md) (`npm run report:lint-buckets`, q-mp-280).

## Already hard-on (examples from the task)

| Rule                    | Live status                             | Notes                                                      |
| ----------------------- | --------------------------------------- | ---------------------------------------------------------- |
| `eqeqeq`                | `error` (`always`, `null: 'ignore'`)    | Stricter `always` (null not ignored) would add **12** hits |
| `no-fallthrough`        | `error` (from `@eslint/js` recommended) | **0** additional hits under default options                |
| `no-implicit-coercion`  | `error` globally; `off` in AI modules   | Forcing on everywhere: **0** hits on tip                   |
| `prefer-object-has-own` | `error` (q-mp-159)                      | Cleared; **0** hits — no longer a ratchet candidate        |
| `curly`                 | hard `multi-line`; ratchet `all`        | Ceiling / live count **538** via `npm run lint:ratchet`    |

## Off / unset candidates that catch real bugs

Counts from a one-shot probe enabling each rule as `error` over `src/` (folded tip after #733/#738/#742).

| Count | Rule                                                | Why it matters                                                                                       |
| ----: | --------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
|   254 | `@typescript-eslint/no-non-null-assertion`          | `!` hides null/undefined; common crash source (ceiling **254**; q-mp-225 −14)                        |
|   132 | `@typescript-eslint/no-confusing-void-expression`   | Accidental void returns / side-effect expressions (ceiling **132**; q-mp-180 −51)                    |
|   105 | `no-duplicate-imports`                              | Split imports drift; merge hygiene (ceiling **105**; q-mp-226 −17)                                   |
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

Live tip re-measure (`npm run lint:ratchet` after q-mp-026g folds): every counted rule equals its ceiling (no headroom).

| Rule                                              | Ceiling (= live) | Task                      | Notes                                                                                                                                               |
| ------------------------------------------------- | ---------------: | ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `curly` (`all`)                                   |          **538** | burn-1008 + curly batches | Live still `multi-line` only                                                                                                                        |
| `@typescript-eslint/no-non-null-assertion`        |          **254** | q-mp-045 / q-mp-225       | Live unset; count-down only (graph/algorithms −14)                                                                                                  |
| `@typescript-eslint/no-confusing-void-expression` |          **132** | q-mp-128 / q-mp-180       | Live unset; `game-controller.ts` brace clears −51                                                                                                   |
| `no-duplicate-imports`                            |          **105** | q-mp-127 / q-mp-226       | Live unset; `*/board-ui.ts` import merges −17                                                                                                       |
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

## Open-PR overlap (tip `cursor/mp-tip-post728`, q-mp-230 re-run after fold)

| Draft                                | Topic                               | Inventory impact                                                       |
| ------------------------------------ | ----------------------------------- | ---------------------------------------------------------------------- |
| #733 (`q-mp-180`)                    | void clears in `game-controller.ts` | **folded** — void **183 → 132** (−51)                                  |
| #738 (`q-mp-225`)                    | graph/algorithms nnnull             | **folded** — nnnull **268 → 254** (−14)                                |
| #742 (`q-mp-226`)                    | board-ui dup-imports                | **folded** — dup-imports **122 → 105** (−17)                           |
| #727 (`q-mp-186`, on hold / post709) | nullish clears in `owl-messages.ts` | nullish **65 → 56** (−9) if rebased — **HELD**, not folded             |
| #730 (`q-mp-206`, post709)           | `no-console` ratchet + inventory    | may add `no-console` row; tip owner reconciles                         |

Tip owner fold **q-mp-026g**: inventory re-run against folded tree; **min ceiling wins**. Never raise ceilings.

## Non-ceilinged residuals addendum (q-mp-240)

Detailed live overlay for rules **not** in `lint-ratchet-ceilings.json` (`no-console` **24**, `no-param-reassign` **23**, stricter `eqeqeq` **12**, `return-await` **7**, plus HOLD notes) lives in sibling [`eslint-non-ceilinged-residuals-2026-10-09.md`](./eslint-non-ceilinged-residuals-2026-10-09.md) (tip `cursor/mp-tip-post748` @ `ce673656`). Additive to open `#740`; tip owner reconciles on fold.
