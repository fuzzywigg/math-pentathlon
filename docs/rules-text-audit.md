# Rules text vs engine audit

Docs-and-tests-only audit of in-game **How to Play** (`src/main.ts` `helpContentHtml`), per-game **tutorials** (`src/games/*/tutorial.ts`), and light wiki/mp3d rule notes against what `src/games/*/rules.ts` (and related types) actually enforce.

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
| 1 | `src/main.ts` Kwatro help · Winning; examples | Any 3 chips with `a + b - c = 4 or 5`; examples `6 + 3 - 5 = 4`, `8 + 1 - 4 = 5`; omits “all chips off numbered rows” | Win is conjunctive: all 5 of the mover’s chips off numbered starts **and** a line of 3 with **two same-owner + one opposite** where like+like−opposite ∈ {4,5} (`allChipsOffNumbered`, `checkTrioForWin`). Help examples evaluate to 2 / 11 under that rule. | Match tutorial `winning` step: all 5 off numbered rows; like+like−opposite; examples `6 + 2 - 3 = 5`, `9 + 1 - 6 = 4`. | Fixed (help) |
| 2 | `kwatro-sinko/tutorial.ts` welcome + objective; controller `kwa-target-info` | Simplified “`a + b - c = 4 or 5`” with no ownership / all-off | Same conjunctive engine rule as row 1 | Keep short HUD or expand to full conjunctive rule? | Open |
| 3 | `frac-fact` help + tutorial `winning` | “After **10 problems each**…” | `DEFAULT_MAX_PROBLEMS = 10` is **total** problems; seats alternate (`nextProblem`) | “After **10 problems total** (players alternate)…” | Fixed |
| 4 | `prime-gold` help + tutorial strategy tip | “Factorials give big numbers: **5!=120**” | Expressions only place when `1 ≤ value ≤ 49`; AI comment notes 5! is too big | “Factorials help: **4!=24** (5! is off the 1–49 board)” | Fixed |
| 5 | `stars-bars` help + tutorial turn sequence | “Must place adjacent to existing cards” (no exception) | Empty board: any cell valid; afterward adjacency required (`getValidPlacements`) | “First card anywhere; later cards must be adjacent to an existing card” | Fixed |
| 6 | `calla` help · Capture | Lands in empty own shield → capture that cube **and** opposite (no “opposite nonempty”) | Capture only if opposite pit `> 0`; takes opposite cubes + landing cube (`makeMove`) | “If last cube lands in an empty own shield **and the opposite shield has cubes**, capture your landing cube and those opposite cubes into your Calla” | Fixed |
| 7 | `fab-a-diffy` help + tutorial turn sequence | “Choose two fraction bars from **your** pool” | Single shared `fractionBars` map for both players | “Choose two unused bars from the **shared** pool” | Fixed |
| 8 | `contig-60` tutorial `scoring` | Lists adjacency points; omits that points do not decide the winner | Points update `scores` but win is 5-in-a-row or alignment tiebreak (`checkWinner` / `alignmentTiebreak`); help already says feedback-only | Add the help line: points are placement feedback only | Fixed |
| 9 | `kings-quadraphages` help / tutorial | Win when opponent’s King has no moves; no mention of empty supply | `endTurn`: trap win via `checkWinCondition`; incoming seat with supply ≤ 0 → **tie** (official Div I note in code) | Document supply-exhaustion tie in How to Play? | Open |
| 10 | `star-track` help / tutorial | First to reach/pass space 12 wins only | Also ends when bucket has `< 2` chains: farther position wins or draw (`drawChains` / `determineWinnerByPosition`) | Mention bucket-exhaustion end | Open |
| 11 | `juggle` help / tutorial | First to fill 9×9 wins; tip “avoid getting stuck” | `checkWinner` only when a board is filled; `canMakeAnyMove` unused for end — stuck can soft-lock | Pass / concede / opponent wins when you cannot place? | Open |
| 12 | `par-55` help + tutorial winning | “In a tie, the player who reaches 55 **first** wins” | Equal scores both ≥ 55 can leave `winner: null` / continue (`placeBlock` tie branches) | Clarify official tie-break vs current engine | Open |
| 13 | `fab-a-diffy` help winning | “When **all bars are used**” | Ends when all answers claimed **or** `usedBars >= fractionBars.size - 1`; equal answer claims when all claimed currently pick player2 (`checkWinner`) | Confirm end conditions and intentional tie handling | Open |
| 14 | `prime-gold` help | Omits chip stock and chip-exhaustion | `STARTING_CHIPS: 20`; when both at 0 chips, most veins wins (`placeChip`) | Mention 20 chips and exhaustion vein compare | Open |
| 15 | `fraction-pinball` help + tutorial | “Most points after all rounds” | Also ends when **both** `ballsRemaining ≤ 0` (`nextChallenge`) | Mention early end when both are out of balls | Open |
| 16 | `queens-guards` help + tutorial capture | “Captured pieces must be relocated to the outer ring” (who?) | **Capturer** relocates to vacant outer ring, then opponent plays (`restoreCapturedPiece` / comments) | “The capturer relocates…” | Open (wording OK if intentional vagueness) |
| 17 | `remainder-islands` help + tutorial | Scoring via remainders; no turn budget | `TOTAL_TURNS = 24` (12 each); also ends when both chip stocks empty | Mention turns remaining | Open |
| 18 | `docs/wiki/overview.md` | Practice edition is not a substitute for official tournament rules | N/A (meta) | Keep; this audit is engine-vs-in-app-text only | Recorded |

## Open decisions for the owner

1. **Kwatro-Sinko short copy** — Tutorial welcome/objective and in-game target chrome still say bare `a + b - c = 4 or 5` while the engine (and tutorial `winning` / fixed help) require all chips off numbered rows plus like+like−opposite. Expand everywhere or keep a short slogan?
2. **Kings & Quadraphages** — Should How to Play document the official supply-exhaustion **tie** already enforced in `endTurn`?
3. **Star Track** — Document bucket-exhaustion race/draw?
4. **Juggle** — What happens when a player cannot place any rolled shape?
5. **Par 55** — Official tie-break when both reach/exceed 55 vs current nullable winner?
6. **Fab-a-Diffy** — End when one fraction bar remains? Equal claims → who wins / draw?
7. **Prime Gold** — Surface 20-chip stock and post-exhaustion vein compare in help?
8. **Fraction Pinball** — Document both-out-of-balls early end?
9. **Queens & Guards** — Explicitly name the capturer as the relocator?
10. **Remainder Islands** — Document the 24-turn budget in help/tutorial?

## Fixed in this change (wording only)

- Kwatro How to Play winning section + examples (aligned with engine / tutorial `winning`).
- Frac Fact “10 problems each” → total alternating problems.
- Prime Gold strategy tip `5!=120` → `4!=24` with off-board note.
- Stars & Bars first-card adjacency exception.
- Calla help capture (requires nonempty opposite; landing cube included).
- Fab-a-Diffy “your pool” → “shared pool”.
- Contig 60 tutorial scoring feedback-only line.

## Tests

- `tests/unit/rules-text-audit.test.ts` — asserts fixed copy stays aligned with engine constants / helpers; `it.skip` characterization cases for open decisions.

## Method notes

- Primary sources: `helpContentHtml` in `src/main.ts`, `src/games/*/tutorial.ts`, `src/games/*/rules.ts` + `types.ts`.
- Wiki game list has no detailed rule prose; mp3d Kwatro/Queens specs already note official conjunctive / capture-restore judgments.
- No engine, scoring, or AI logic was modified.
