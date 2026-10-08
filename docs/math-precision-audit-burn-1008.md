# Math precision audit — `burn-1008-mp-math-precision`

Audit of every engine/UI arithmetic helper for floating-point equality, accumulated float error, integer division/rounding, negative modulo, `Number.MAX_SAFE_INTEGER` edges, fraction reduction/GCD, and string/number coercion.

**Overlap avoided:** open drafts #482 (engine edge cases), #465 (round-trip fuzz), #515 (mutation audit), #492 (rules text). This PR adds exactness tables only.

## Per-module findings

| Module | Operation | Issue | Fixed / reported-for-owner |
|--------|-----------|-------|----------------------------|
| `core/fractions/arithmetic` `negate` | Sign flip | Ignored `isNegative` flag → flag-neg stayed negative | **Fixed** (no game calls `negate`) |
| `core/fractions/arithmetic` `lcm` | LCM | `(a*b)/gcd` overflows sooner than `(a/gcd)*b` | **Fixed** (same game-sized results) |
| `core/fractions/arithmetic` `isWholeNumber` | Whole check | `6.1 % 3.05 === 0` float coincidence could pass | **Fixed** (require integer num/den) |
| `core/attributes/logic` `isPrime` | Primality | `i <= Math.sqrt(n)` float bound; non-integers accepted | **Fixed** (`i*i <= n` + integer gate) |
| `core/attributes/logic` `isPerfectSquare` | Square check | `Math.sqrt(n) === Math.floor(...)` float equality | **Fixed** (`round` + `root*root === n`) |
| `games/prime-gold/types` `isPrime` | Primality | Non-integers accepted | **Fixed** (integer gate; matches attr) |
| `core/fractions/arithmetic` `subtract`/`multiply`/`divide` | Ops | Return unsimplified raw shapes | **Reported** — teaching/raw shape; games call `simplify`/`areEquivalent` |
| `core/fractions/arithmetic` `areEqual` | Cross-multiply | Products can exceed `MAX_SAFE_INTEGER` for huge num/den | **Reported** — game fractions stay small |
| `core/fractions/arithmetic` `createFraction` | Construction | No runtime number coercion (`"3"/"4"` passes through) | **Reported** — TypeScript-typed call sites |
| `core/fractions/arithmetic` `fromDecimal`/`roundToDenominator` | Decimal↔frac | Intentional float approximation | **Reported** — not used for legal-move equality |
| `core/expressions/evaluator` | `+/*/` floats | IEEE results (`0.1+0.2`); equality via `1e-4` epsilon | **Reported** — changing to rationals would alter demo equality |
| `games/remainder-islands` `calculateDivision` | `%` / floor | JS negative modulo (`(-7)%3 === -1`) | **Reported** — game only uses positive dice/islands |
| `games/fraction-pinball` `formatDecimal` | Display | Rounds to 4 dp via float | **Reported** — challenge strings; answer check is string equality |
| `games/contig-60` `evaluate` | Dice ops | Exact via `a%b===0` gate; `Number.isInteger` filter | Exact for dice 1–6 (proven in tests) — no change |
| `games/prime-gold` `generateExpressions` | Expr values | Integer + divisibility gates | Exact in board range — no change |
| `core/hex/coordinates` | Distance/offset/rotate | Integer axial/cube math | Exact on lattice — no change |
| `core/polyomino` `getCenterOfMass` | Average | Returns floats (`sum/n`) | **Reported** — UI geometry only; not scoring |
| `core/timer-scoring` `formatTime`/`parseTime` | Time | MM:SS (+ optional cs); no HH path in format | Exact for documented formats — no change |
| Dual `isPrime` (attr vs prime-gold) | Primality | Two copies | Kept in sync; both integer-gated now |

## Safe fix rationale

Fixes only change results that were already mathematically wrong on encodings/inputs games do not use for legal moves, AI search, scoring, difficulty, or rules text:

- `negate` is unused by any `src/games/**` call site
- `lcm` form change is algebraically identical when products stay safe
- `isWholeNumber` / `isPrime` / `isPerfectSquare` tighten non-integer / float-bound edges outside board ranges

## Tests

`tests/unit/math-precision-audit-burn-1008.test.ts` — table-driven boundary coverage for the helpers above.
