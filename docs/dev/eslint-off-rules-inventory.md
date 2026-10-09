# ESLint off / unset rules inventory (q-mp-045)

Measured on tip `cursor/mp-tip-post477` against `src/` (probe overlay; live `eslint.config.js` unchanged for these counts). Goal: find rules that are **off or unset** but would catch real bugs, then ratchet **one** without fixing debt.

## Already hard-on (examples from the task)

| Rule | Live status | Notes |
| --- | --- | --- |
| `eqeqeq` | `error` (`always`, `null: 'ignore'`) | Stricter `always` (null not ignored) would add **15** hits |
| `no-fallthrough` | `error` (from `@eslint/js` recommended) | **0** additional hits under default options |
| `no-implicit-coercion` | `error` globally; `off` in AI modules | Forcing on everywhere: **0** hits on tip |
| `curly` | hard `multi-line`; ratchet `all` | Ceiling **1320** via `npm run lint:ratchet` |

## Off / unset candidates that catch real bugs

Counts from a one-shot probe enabling each rule as `error` over `src/` (2026-10-09 tip measure).

| Count | Rule | Why it matters |
| ---: | --- | --- |
| 387 | `@typescript-eslint/no-non-null-assertion` | `!` hides null/undefined; common crash source |
| 230 | `@typescript-eslint/no-confusing-void-expression` | Accidental void returns / side-effect expressions |
| 124 | `no-duplicate-imports` | Split imports drift; merge hygiene |
| 96 | `@typescript-eslint/prefer-nullish-coalescing` | `\|\|` vs `??` falsy bugs (`0`, `''`); densest `fraction-bar-ui.ts` 18 |
| 21 | `@typescript-eslint/prefer-optional-chain` | Deep `&&` chains miss null gaps (q-mp-148: was 35; non-HOLD cleared; HOLD residual 21 in `rules.ts`/`ai.ts`) |
| 23 | `no-param-reassign` | Surprising mutation of caller state |
| 15 | `eqeqeq` (stricter, null not ignored) | Residual `== null` style debt |
| 14 | `default-case` | Switches without `default` |
| 13 | `@typescript-eslint/no-shadow` | Shadowed bindings |
| 8 | `@typescript-eslint/switch-exhaustiveness-check` | Missing union/enum cases (q-mp-141 ratchet; tip re-measure 8 on post598) |
| 6 | `radix` | `parseInt` without radix (q-mp-130: demo fixed; 6 HOLD) |
| 7 | `@typescript-eslint/return-await` (`always`) | Inconsistent async error paths |
| 2 | `no-promise-executor-return` | Misleading promise constructor returns |
| 1 | `array-callback-return` | `map`/`filter` without return |
| 1 | `prefer-object-has-own` | Prototype pollution footgun |
| 0 | `@typescript-eslint/only-throw-error` | Clean |
| 0 | `@typescript-eslint/no-base-to-string` | Clean |
| 0 | `@typescript-eslint/prefer-includes` | Clean |
| 0 | `@typescript-eslint/prefer-string-starts-ends-with` | Clean |

## Ratchets already on `npm run lint:ratchet`

| Rule | Ceiling | Task | Notes |
| --- | ---: | --- | --- |
| `curly` (`all`) | **595** | burn-1008 + curly batches | Live still `multi-line` only |
| `@typescript-eslint/no-non-null-assertion` | **387** | q-mp-045 (#605) | Live unset; count-down only |
| `default-case` | **6** | q-mp-129 | Live unset; tip measure was **14**; cleared non-HOLD sites; residual HOLD = `fab-a-diffy`/`frac-fact` `rules.ts` (4) + `fractions/arithmetic` scoring path (1) + `hex/coordinates` conflict-avoid vs q-mp-133 (1) |

Open-PR overlap: #520 landed the curly ratchet; #590/#592/#596 lower curly debt. No open draft already ratchets `no-non-null-assertion`.

## Ratchet chosen for q-mp-128

**`@typescript-eslint/no-confusing-void-expression`** — ceiling **228** (= tip re-measure after fold 2026-10-09 on `cursor/mp-tip-post477`; densest: `src/ui/game-route-mounts.ts` 40, `src/main.ts` 12). No source fixes; live `eslint.config.js` does **not** hard-enable the rule (count-down only via `npm run lint:ratchet`).

Open-PR overlap for q-mp-128: #605 (nnnull), #665 (`no-duplicate-imports`), #659/#664 (curly ceilings). Expected additive conflict on `docs/dev/lint-ratchet-ceilings.json` / probe script with those drafts — tip owner folds both keys. No open draft already ratchets `no-confusing-void-expression`.

## q-mp-130 · `radix` HOLD residuals

Tip probe (pre-fix): **7** `radix` hits. Fixable demo site cleared in `src/demos/dice-demo.ts` (`parseInt(..., 10)`). Ceiling ratcheted to **6**.

**HOLD** (do not edit — hard rules: no AI behavior / no `*/rules.ts` logic):

| File | Lines | Why HOLD |
| --- | ---: | --- |
| `src/games/kwatro-sinko/ai.ts` | 106–107, 331–332 | AI path — no behavior-adjacent edits |
| `src/games/kwatro-sinko/rules.ts` | 349–350 | Rules/legal-move path — no logic edits |

Live `eslint.config.js` does **not** hard-enable `radix`; count-down only via `npm run lint:ratchet`.

Open-PR overlap for q-mp-129: no open draft already fixes or ratchets `default-case`. Never touch `rules.ts`/`ai.ts`; tip owner folds.

## Ratchet chosen for q-mp-140

**`@typescript-eslint/prefer-nullish-coalescing`** — ceiling **96** (= tip re-measure 2026-10-09 on `cursor/mp-tip-post477` @ `2083a96d`; densest: `src/core/fractions/fraction-bar-ui.ts` 18). No `||`→`??` mass rewrite (falsy `0`/`''` behavior risk); live `eslint.config.js` does **not** hard-enable the rule (count-down only via `npm run lint:ratchet`).

Open-PR overlap for q-mp-140: #665 (`no-duplicate-imports`), #672 (`no-confusing-void-expression`), #677 (`default-case`), #676 (curly `main.ts`) also edit `lint-ratchet-ceilings.json` — tip owner folds additive keys. No open draft already ratchets `prefer-nullish-coalescing`.

## q-mp-148 — `@typescript-eslint/prefer-optional-chain`

Live tip probe: **35** hits. Cleared **14** non-HOLD sites (board-ui / game-state / types / main / board-a11y / `src/ui/three/**` only; identical boolean/`?.` semantics). Residual ceiling **21** — HOLD only in `*/rules.ts` and `*/ai.ts` (contig-60, fab-a-diffy, fiar, kings-quadraphages, kwatro-sinko, prime-gold, queens-guards, ramrod). Live `eslint.config.js` does **not** hard-enable the rule (count-down via `npm run lint:ratchet`).

## Ratchet chosen for q-mp-141

**`@typescript-eslint/switch-exhaustiveness-check`** — ceiling **8** (= live tip re-measure on `cursor/mp-tip-post598` @ `7922f9af`; inventory/ticket said **9** — never raise). Hits (1 each): `attribute-ui`, `dice-ui`, `expressions/evaluator`, `owl-messages`, `owl-system`, `graph-demo`, `polyomino-demo`, `star-track/rules`. No switch rewrites in this PR; live `eslint.config.js` does **not** hard-enable the rule (count-down only via `npm run lint:ratchet`). Complements q-mp-129 `default-case`.

Open-PR overlap for q-mp-141: no open draft already ratchets `switch-exhaustiveness-check`. Other drafts may edit `lint-ratchet-ceilings.json` additively — tip owner folds keys (min wins).
