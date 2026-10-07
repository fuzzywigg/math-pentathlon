# Rules text vs engine audit

Docs-and-tests-only audit of in-game **How to Play** (`src/main.ts` `helpContentHtml`), per-game **tutorials** (`src/games/*/tutorial.ts`), wiki/registry blurbs, and light mp3d rule notes against what `src/games/*/rules.ts` (and related types) actually enforce.

Informed by Division I–IV explore passes ([Audit Div I rules text](bc-eb18bb0e-2b28-5e09-b3d4-b96d3070855d), [Audit Div II rules text](bc-34747cc6-ac60-5fb4-bf50-237035ef6eeb), [Audit Div III rules text](bc-85d21248-cc19-5290-ac59-47af05c3bcfb), [Audit Div IV rules text](bc-05ee283c-4d2c-5e23-8384-95428ad7869e)).

**Scope:** factual rule claims (board, pieces, movement, scoring, win/draw). No timer/clock claims. Engine and AI behavior were **not** changed.

**Legend**

| Status | Meaning |
|--------|---------|
| Fixed | Wording updated to match the engine (clear typo / outdated copy) |
| Open | Genuine rules question for the owner — engine left unchanged |
| Recorded | Documented mismatch; characterization / skipped test added |

## Mismatch table

| # | Text location | What it says | What the engine does | Suggested wording | Status |
|---|---------------|--------------|----------------------|-------------------|--------|
| 1 | Kwatro help · Winning | Bare `a+b-c`; bad examples; no all-off | Conjunctive: all 5 off numbered **and** like+like−opposite ∈ {4,5} | Match tutorial `winning` | Fixed (help) |
| 2 | Kwatro welcome/objective + HUD | Short `a + b - c = 4 or 5` | Same conjunctive rule | Expand everywhere or keep slogan? | Open |
| 3 | Kwatro help+tutorial movement | “Diagonal connections exist on numbered spaces” | Diagonals only for interior `row/col ∈ 1..3` (open #355) | Describe center diagonals, or change graph | Open |
| 4 | Frac Fact help+tutorial winning | “10 problems **each**” | `maxProblems=10` **total**, seats alternate | “10 problems total (players alternate)” | Fixed |
| 5 | Frac Fact scoring | “+5 per consecutive correct” | Bonus = `streak_before × 5` (0,5,10,…) | Clarify formula vs flat +5 | Open |
| 6 | Wiki + `game-registry` Frac Fact | “Fraction bars matched to answer bars” | Multiple-choice arithmetic (bars are Fab-a-Diffy) | Multiple-choice / streak scoring | Fixed |
| 7 | Prime Gold strategy tip | `5!=120` | Results capped `≤49` | `4!=24` (5! off board) | Fixed |
| 8 | Prime Gold win copy | First to 4 veins only | Also chip-exhaustion → most veins (`STARTING_CHIPS=20`) | Mention chips + exhaustion | Open |
| 9 | Prime Gold turn “Create Expression” | Implies free-form ops | Player picks from enumerated `generateExpressions` list | “Choose a listed valid number sentence” | Open |
| 10 | Stars & Bars turn sequence | Always “adjacent to existing” | Empty board: any cell | First card anywhere; then adjacent | Fixed |
| 11 | Calla help capture | No “opposite nonempty” | Requires opposite `> 0`; takes landing + opposite | Require nonempty opposite | Fixed |
| 12 | Calla tutorial board-intro | Blue top / Red bottom; Callas “on right” | Red top, Blue bottom; Blue Calla right, Red left | Match `board-ui.ts` seating | Fixed |
| 13 | Calla tutorial goal | “when all cubes are collected” | Ends when one side’s pits empty; sweep other side | Match help/engine end | Fixed |
| 14 | Calla tutorial capture | “ALL those cubes” (opposite only) | Landing cube + opposite | Include landing cube | Fixed |
| 15 | Calla help Game End | “Most cubes wins” (no tie) | Equal Callas → `winner: 'tie'` | “…equal Callas is a tie” | Fixed |
| 16 | Fab-a-Diffy turn | “your pool” | Shared `fractionBars` | “shared pool” | Fixed |
| 17 | Fab-a-Diffy winning | “when all bars are used” | Answers all claimed **or** `usedBars ≥ size−1`; pass stalemate; equal claims on all-answers → player2 | Confirm end/tie policy | Open |
| 18 | Contig tutorial scoring | Omitted feedback-only | Points don’t decide winner | Add feedback-only line | Fixed |
| 19 | Contig help+tutorial Passing | Tiebreak “decides the winner” | Tiebreak may return draw | “…winner (or a draw)” | Fixed |
| 20 | Kings help+tutorial | Always both actions; trap-only win | Skip place if supply 0; supply-empty start → tie | Place if you have chips; document tie | Fixed |
| 21 | Star Track help Gameplay | “two **different** lengths” | Same length allowed | “might match” | Fixed |
| 22 | Star Track win copy | Race to 12 only | Bucket `<2` → position compare / draw | Document bucket end | Open |
| 23 | Hex-a-Gone tutorial | Select then place (no Confirm) | Must `commitSelection` before place | Select → Confirm → place | Fixed |
| 24 | Hex-a-Gone help example SVG | Multi-cell footprints | Each shape fills one hex (`getShapeCells` stub) | One cell per block, or implement footprints | Open |
| 25 | Juggle placement | “rotated and flipped” always | Per-shape `canRotate` / `canFlip` | “when that shape allows it” | Fixed |
| 26 | Juggle stuck | Tip only; no end rule | Fill-only win; `canMakeAnyMove` unused for end | Pass / concede / opponent wins? | Open |
| 27 | Sum Dominoes Passing | Fewer pips wins (no draw) | Equal pips → `winner: null` | “…equal pips is a draw” | Fixed |
| 28 | Par 55 winning | First-to-55 on tie | Equal ≥55 can continue / null winner | Official tie-break? | Open |
| 29 | Par 55 “hand (5 blocks)” | Implies constant hand of 5 | Deal 5; no refill after place | “Start with 5” vs refill | Open |
| 30 | Fraction Pinball | After all rounds / wrong loses ball | Early end if both out of balls; play continues if one at 0 | Document both-out early end | Open |
| 31 | Queens capture | “must be relocated” (who?) | Capturer relocates then opponent plays | “The capturer relocates…” | Open |
| 32 | Remainder Islands | No turn budget in help | `TOTAL_TURNS=24` | Mention turns | Open |
| 33 | `docs/wiki/overview.md` | Not a substitute for official rules | Meta | Keep | Recorded |

**Mismatch count:** 33 rows (16 Fixed, 16 Open, 1 Recorded).

## Open decisions for the owner

1. Kwatro short `a+b-c` slogan vs full conjunctive copy (welcome/HUD).
2. Kwatro diagonal connectivity on numbered spaces vs center-only engine (#355).
3. Frac Fact streak bonus wording vs `streak_before × 5` formula.
4. Prime Gold: document 20 chips + exhaustion vein compare; free-form vs listed expressions.
5. Fab-a-Diffy end conditions and equal-claims winner.
6. Star Track bucket-exhaustion end in help/tutorial.
7. Hex-a-Gone: keep one-cell placement or restore multi-cell pattern footprints.
8. Juggle: stuck / cannot-place resolution.
9. Par 55: tie-break when both ≥55; hand refill or “start with 5” only.
10. Fraction Pinball: both-out-of-balls early end + continue-with-one-at-0.
11. Queens: name capturer as relocator in help.
12. Remainder Islands: document 24-turn budget.

## Fixed in this PR (wording only)

- Kwatro How to Play winning + examples.
- Frac Fact problem count; wiki/registry Frac Fact blurb.
- Prime Gold `5!=120` tip.
- Stars & Bars first-card adjacency.
- Calla capture/help tie/tutorial seating/goal/capture landing cube.
- Fab shared pool.
- Contig feedback-only + pass tiebreak draw.
- Kings place-if-supply + supply-exhaustion tie.
- Star Track “different lengths” overclaim.
- Hex-a-Gone tutorial Confirm step.
- Juggle rotate/flip “when allowed”.
- Sum Dominoes equal-pips draw.

## Tests

- `tests/unit/rules-text-audit.test.ts` — fixed-copy assertions + `it.skip` open decisions.
- Golden tutorial copy tests updated where wording changed.

## Method notes

- Primary sources: `helpContentHtml`, tutorials, `rules.ts`/`types.ts`, wiki/registry.
- No engine, scoring, or AI logic modified.
