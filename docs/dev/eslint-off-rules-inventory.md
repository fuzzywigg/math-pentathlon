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
| 229 | `@typescript-eslint/no-confusing-void-expression` | Accidental void returns / side-effect expressions |
| 124 | `no-duplicate-imports` | Split imports drift; merge hygiene |
| 96 | `@typescript-eslint/prefer-nullish-coalescing` | `\|\|` vs `??` falsy bugs (`0`, `''`); densest `fraction-bar-ui.ts` 18 |
| 35 | `@typescript-eslint/prefer-optional-chain` | Deep `&&` chains miss null gaps |
| 23 | `no-param-reassign` | Surprising mutation of caller state |
| 15 | `eqeqeq` (stricter, null not ignored) | Residual `== null` style debt |
| 14 | `default-case` | Switches without `default` |
| 13 | `@typescript-eslint/no-shadow` | Shadowed bindings |
| 9 | `@typescript-eslint/switch-exhaustiveness-check` | Missing union/enum cases |
| 7 | `radix` | `parseInt` without radix |
| 7 | `@typescript-eslint/return-await` (`always`) | Inconsistent async error paths |
| 2 | `no-promise-executor-return` | Misleading promise constructor returns |
| 1 | `array-callback-return` | `map`/`filter` without return |
| 1 | `prefer-object-has-own` | Prototype pollution footgun |
| 0 | `@typescript-eslint/only-throw-error` | Clean |
| 0 | `@typescript-eslint/no-base-to-string` | Clean |
| 0 | `@typescript-eslint/prefer-includes` | Clean |
| 0 | `@typescript-eslint/prefer-string-starts-ends-with` | Clean |

## Ratchet chosen this PR

**`@typescript-eslint/no-non-null-assertion`** — highest-signal off rule with real crash risk; ceiling **387** (= today's count). No source fixes in this PR; live `eslint.config.js` does **not** hard-enable the rule (count-down only via `npm run lint:ratchet`).

Open-PR overlap: #520 landed the curly ratchet; #590/#592/#596 lower curly debt. No open draft already ratchets `no-non-null-assertion`.

## Ratchet chosen for q-mp-140

**`@typescript-eslint/prefer-nullish-coalescing`** — ceiling **96** (= tip re-measure 2026-10-09 on `cursor/mp-tip-post477` @ `2083a96d`; densest: `src/core/fractions/fraction-bar-ui.ts` 18). No `||`→`??` mass rewrite (falsy `0`/`''` behavior risk); live `eslint.config.js` does **not** hard-enable the rule (count-down only via `npm run lint:ratchet`).

Open-PR overlap for q-mp-140: #665 (`no-duplicate-imports`), #672 (`no-confusing-void-expression`), #677 (`default-case`), #676 (curly `main.ts`) also edit `lint-ratchet-ceilings.json` — tip owner folds additive keys. No open draft already ratchets `prefer-nullish-coalescing`.
