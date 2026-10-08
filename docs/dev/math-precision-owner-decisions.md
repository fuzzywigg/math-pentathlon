# Math precision — owner decisions (Andrew)

**Task:** `burn-1008-mp-math-precision-safe-recut`  
**Supersedes:** draft [#535](https://github.com/fuzzywigg/math-pentathlon/pull/535) (compliance [#538](https://github.com/fuzzywigg/math-pentathlon/pull/538) flagged `#535` as a **violation** for changing `isPrime` / `negate` / `isWholeNumber`).  
**This recut:** characterization tests + this decision list only. **No** helper / scoring / rules source edits.

Fill replies as `MP-PRIME-01: Yes` (or choose A/B/C). Do not fold code fixes until answered.

---

## Scoring-path / outcome-adjacent (deferred fixes)

### MP-PRIME-01 — Prime Gold `isPrime` accepts non-integers

| | |
| --- | --- |
| **Module** | `src/games/prime-gold/types.ts` → `isPrime` |
| **Used by** | `rules.ts` sets `cell.isPrime`; vein scoring + AI prefer primes (`rules.ts`, `ai.ts`) |
| **Current** | Only `n < 2` gate. Non-integers with no odd factor ≤ √n return **true** (e.g. `isPrime(2.5) === true`, `isPrime(NaN) === true`). |
| **Proposed** | `if (!Number.isInteger(n) \|\| n < 2) return false;` (as in #535) |
| **Outcomes changed** | Any board/expression value that is non-integer but currently marked prime would lose prime styling, vein points, and AI prime bonuses. Normal dice expressions stay integers ≤ 49, so **live games are likely unaffected**; still a scoring-predicate change. |
| **Examples** | `isPrime(2.5)`: now `true` → proposed `false`. `isPrime(4.0)`: now `true` (integer-valued) → stays `true`. `isPrime(NaN)`: now `true` → proposed `false`. |
| **Decision** | ☐ Yes change · ☐ No keep · ☐ Other: ___ |

### MP-PRIME-02 — Attributes `isPrime` non-integers + `Math.sqrt` loop bound

| | |
| --- | --- |
| **Module** | `src/core/attributes/logic.ts` → `isPrime` |
| **Used by** | Attribute piece metadata (`isPrime` flag on number pieces); **not** imported by `src/games/**` today. Kept in sync with Prime Gold conceptually. |
| **Current** | Same non-integer acceptance as MP-PRIME-01; loop uses `i <= Math.sqrt(n)` (float bound). |
| **Proposed** | Integer gate + `i * i <= n` (as in #535). |
| **Outcomes changed** | Attribute demo / set logic only unless a future game imports this helper for scoring. Changing it while Prime Gold’s copy differs would diverge the two `isPrime` implementations. |
| **Examples** | `isPrime(2.5)` → `true` now / `false` proposed. Large-int float √ edge is theoretical for board ranges; still prefer integer multiply for exactness. |
| **Decision** | ☐ Yes change · ☐ No keep · ☐ Keep attr + Prime Gold in lockstep only: ___ |

### MP-NEGATE-01 — `negate` ignores `isNegative` flag encoding

| | |
| --- | --- |
| **Module** | `src/core/fractions/arithmetic.ts` → `negate` |
| **Used by** | No `src/games/**` call sites today. Characterization / wave tests pin current bug. Other ops (`add`, `areEqual`, …) already use `signedNumerator` / `toStandardForm`. |
| **Current** | `return { numerator: -fraction.numerator, denominator: fraction.denominator }` — flag-negative `{3,5,isNegative:true}` (value −3/5) becomes `{−3,5}` (still −3/5). Double-negate does **not** restore the flag encoding / `areEqual` round-trip. |
| **Proposed** | Negate via `signedNumerator` so flag-neg −3/5 → `{3,5}` (+3/5), matching #535. |
| **Outcomes changed** | None for live games **today** (unused). Would change any future caller and all tests that document the leftover. Still treated as outcome-adjacent helper by compliance (#538). |
| **Examples** | `negate({numerator:3,denominator:5,isNegative:true})` → now `{−3,5}` / proposed `{3,5}`. `-0` numerator: JS `-(-0) === 0` (positive zero) already. |
| **Decision** | ☐ Yes fix · ☐ No keep leftover · ☐ Other: ___ |

### MP-WHOLE-01 — `isWholeNumber` float `%` coincidence

| | |
| --- | --- |
| **Module** | `src/core/fractions/arithmetic.ts` → `isWholeNumber` |
| **Used by** | Not called from `src/games/**` today; available to fraction helpers / UI. |
| **Current** | `numerator % denominator === 0` with no integer check. JS float coincidence: `6.1 % 3.05 === 0` → **true**. |
| **Proposed** | Require `Number.isInteger` num/den (and reject `denominator === 0`) before `%` (as in #535). |
| **Outcomes changed** | None for current game call sites. Would flip any float-num/den inputs (including accidental coercions). |
| **Examples** | `isWholeNumber({numerator:6.1,denominator:3.05})` → now `true` / proposed `false`. `isWholeNumber({numerator:6,denominator:3})` → `true` both. |
| **Decision** | ☐ Yes tighten · ☐ No keep · ☐ Other: ___ |

### MP-SQUARE-01 — `isPerfectSquare` float equality

| | |
| --- | --- |
| **Module** | `src/core/attributes/logic.ts` → `isPerfectSquare` |
| **Used by** | Attribute piece `isSquare` metadata; not imported by games. |
| **Current** | `Math.sqrt(n) === Math.floor(Math.sqrt(n))`. Non-integers rarely pass; large ints can drift. |
| **Proposed** | Integer gate + `root = Math.round(Math.sqrt(n)); return root * root === n` (as in #535). |
| **Outcomes changed** | Attribute demo only today. |
| **Examples** | `isPerfectSquare(2.25)` → `false` both (√=1.5 ≠ floor). Integer squares 0,1,4,9,… stay `true`. |
| **Decision** | ☐ Yes · ☐ No · ☐ Other: ___ |

### MP-LCM-01 — `lcm` multiply-before-divide overflow order

| | |
| --- | --- |
| **Module** | `src/core/fractions/arithmetic.ts` → `lcm` |
| **Used by** | `add` / `subtract` / `findLCD` / common-denominator helpers → **Fab-a-Diffy** and other fraction games via `add`/`subtract`. |
| **Current** | `(a * b) / gcd(a, b)`. |
| **Proposed** | `(a / gcd(a, b)) * b` to reduce intermediate overflow (as in #535). Algebraically identical when `a*b` stays exact in IEEE/safe integers. |
| **Outcomes changed** | Same results for all game-sized denominators. Diverges only when `a*b` loses integer precision. Still a scoring-path helper edit → deferred. |
| **Examples** | `lcm(12,18)` → `36` both. Pairs near `MAX_SAFE_INTEGER` can differ if product overflows. |
| **Decision** | ☐ Yes reorder · ☐ No keep · ☐ Other: ___ |

---

## Reported in #535 (not silently fixed) — still owner-visible

These were already “reported for owner” in #535; listed here so the recut keeps the full audit trail.

| ID | Module | Issue | Why not auto-fixed | Example |
| --- | --- | --- | --- | --- |
| MP-FRAC-RAW | `subtract`/`multiply`/`divide` | Return unsimplified shapes | Games call `simplify` / `areEquivalent`; changing shapes could affect teaching/display | `subtract(1/2,1/3)` → `{1,6}` raw vs simplified |
| MP-AREEQUAL | `areEqual` | Cross-multiply can exceed `MAX_SAFE_INTEGER` | Game fractions stay small | Huge num/den products |
| MP-CREATE | `createFraction` | No runtime number coercion | TS-typed call sites | `"3"/"4"` string passthrough |
| MP-FROMDEC | `fromDecimal` / `roundToDenominator` | Intentional float approx | Not used for legal-move equality | `0.1` → nearest fraction |
| MP-EXPR | `core/expressions` | IEEE + `1e-4` epsilon | Changing to rationals alters demo equality | `0.1+0.2=0.3` true via epsilon |
| MP-REMAIN | `remainder-islands` `%` | JS negative modulo | Game uses positive dice/islands only | `(-7)%3 === -1` |
| MP-PINBALL | `fraction-pinball` `formatDecimal` | 4 dp float round | Answer check is string equality — **display/scoring adjacent** | `0.1+0.2` → `'0.3'` |
| MP-POLYCOM | `polyomino` `getCenterOfMass` | Float averages | UI geometry only | `sum/n` |

---

## Explicitly out of scope / no change

| Area | Note |
| --- | --- |
| Contig-60 dice `evaluate` | Exact for dice 1–6 (characterization tests) |
| Prime Gold `generateExpressions` | Integer + divisibility gates in board range |
| Hex coordinates | Integer lattice |
| Timer `formatTime` / `parseTime` | Exact for documented MM:SS(+cs) |

---

## Characterization / skipped tests

- **Pin current:** `tests/unit/math-precision-audit-burn-1008.test.ts`
- **Document proposed (not enforced):** `it.skip` cases titled `TODO(math-precision owner): …` referencing IDs above.

---

## Reply template

```
MP-PRIME-01:
MP-PRIME-02:
MP-NEGATE-01:
MP-WHOLE-01:
MP-SQUARE-01:
MP-LCM-01:
(optional notes on MP-FRAC-RAW … MP-POLYCOM)
```
