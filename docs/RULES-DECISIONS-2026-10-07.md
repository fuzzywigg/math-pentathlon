# Rules decisions for owner — 2026-10-07

One checklist. Answer each ID (example: `KW2: Yes`). Docs only — no engine changes in this PR.

**Sources:** #441 (17 deep-playtest Qs), #446 (tutorial vs engine), #473 (`docs/undo-audit-2026-10-07.md`), #482 (`docs/engine-edge-cases-2026-10-07.md` on `cursor/engine-edge-case-tests-8111`), engine-coverage Kwatro/FIAR termination skip, in-repo Div II Highlights quotes (`docs/mp3d/kwatro-sinko-3d-spec.md`, FIAR layout).

**Base tip:** #476 / `cursor/integration-fold-wave4-tip-36e4`.

---

## Top 5 (answer these first)

### H1 — Kwatro: Can a winning path have empty gaps?
- **Engine now:** Win scan needs three chips in a **contiguous** straight line (empty cell breaks it). #393 would allow gaps; #394 locks contiguous.
- **Recommend: Yes** — Div II Highlights say the path “does not need to be contiguous.”
- **Answer:** Yes / No

### H2 — Kwatro & FIAR: How should endless chip-cycling end?
- **Engine now:** No move cap, no repetition draw. Random/AI play can loop forever (coverage tests skip termination).
- **Recommend: B** — draw on repeated position (chess-style); keep AI heuristics as soft help only.
- **Answer:** **A)** Hard move-cap → draw · **B)** Repetition/position draw · **C)** Neither (AI-only / leave open)

### H3 — Remainder Islands: Last skip with 0 turns left — must the game end?
- **Engine now:** Empty-roll skip burns `turnsRemaining` but can hit `0` **without** `gameOver` (only `selectIsland` settles) → soft-lock.
- **Recommend: Yes** — tutorial: “After all turns, most points wins.”
- **Answer:** Yes / No

### H4 — Kings: Both kings trapped — draw or award player1?
- **Engine now:** `checkWinCondition` runs before `isDrawCondition`; mutual trap awards **player1**.
- **Recommend: Yes** (treat as draw) — both stuck = neither trapped the other alone.
- **Answer:** Yes (= draw) / No (= keep player1)

### H5 — Hex-a-Gone: Does “can move” mean a shape actually fits?
- **Engine now:** `canPlayerMove` is true if bank non-empty and any empty cell exists — **ignores** whether remaining shapes fit. Pass / last-move-wins may never fire. (Shapes are 1 cell each today; still wrong if bank vs empties disagree.)
- **Recommend: Yes** — “stuck” should mean no legal place.
- **Answer:** Yes / No

---

## By game

### Kwatro-Sinko

#### KW1 — Diagonals only in center 3×3?
- **Engine now:** Diagonals only in center 3×3. Tutorial once said “numbered spaces” (#446).
- **Recommend: A** — keep until a true star-board rebuild; kit H/V/diagonal everywhere does not match this 5×5.
- **Answer:** **A)** Keep 3×3 only · **B)** Expand (say where)

#### KW2 — Gaps on winning path *(same as H1)*
- **Answer:** Yes / No · **Recommend: Yes**

#### KW3 — Ban wins that “cross the yellow middle”?
- **Engine now:** Full playable 5×5; no yellow cell; center-line wins count.
- **Recommend: A** — don’t invent a yellow zone without a kit map.
- **Answer:** **A)** Defer · **B)** Ban (specify cells/edges)

#### KW4 — Longer occupied line: still allow a 3-chip subset win?
- **Engine now:** Yes — any winning 3-chip subset counts.
- **Recommend: B** once gaps (KW2) ship — PDF: “Only 3 chips can be on the winning path.”
- **Answer:** **A)** Keep subsets · **B)** Invalidate if >3 chips on that line

#### KW5 — Force end on loops *(same as H2 for Kwatro)*
- **Answer:** A / B / C · **Recommend: B**

---

### FIAR

#### FI1 — Force end on movement loops *(same as H2 for FIAR)*
- **Answer:** A / B / C · **Recommend: B**

#### FI2 — No legal move in movement phase = draw (auto in rules)?
- **Engine now:** `isDraw` is observational; controller must apply `gameOver`. Tutorial only mentions 4-in-a-row.
- **Recommend: Yes** — rules should end the game; tutorial should mention draw.
- **Answer:** Yes / No

---

### Kings & Quadraphages

#### KQ1 — Mutual trap *(same as H4)*
- **Answer:** Yes / No · **Recommend: Yes** (draw)

#### KQ2 — Skip Quadraphage place when supply is 0?
- **Engine now:** After King move, if supply 0, placement is skipped. Tutorial says “both actions every turn.”
- **Recommend: Yes** (keep skip) — can’t place what you don’t have; fix tutorial.
- **Answer:** Yes / No

---

### Fab-a-Diffy

#### FA1 — Equal answer claims → draw or player2?
- **Engine now:** All answers claimed + equal counts → **player2** wins. Bars-used path can tie (`null`).
- **Recommend: Yes** (draw) — same as other equal-score settles.
- **Answer:** Yes (= draw) / No (= keep player2)

#### FA2 — Pass ends when opponent then has no pairs (not only “both passed”)?
- **Engine now:** One pass can settle if opponent has no valid pairs (comment says “both”).
- **Recommend: Yes** — keep “no more moves” settle; fix comment.
- **Answer:** Yes / No

---

### Hex-a-Gone

#### HG1 — Fit-aware `canPlayerMove` *(same as H5)*
- **Answer:** Yes / No · **Recommend: Yes**

#### HG2 — Tutorial “big shapes / fit” vs 1-cell footprints — teach engine truth?
- **Engine now:** Every shape is **one** hex cell; Confirm required before place.
- **Recommend: Yes** — fix tutorial to 1-cell + Confirm (unless you later grow multi-cell shapes).
- **Answer:** Yes / No

#### HG3 — Multi-block turn log: only last remaining shape(s) in `blocksPlaced` — OK?
- **Engine now:** One history entry per completed turn; `blocksPlaced` from final filtered selection (#473).
- **Recommend: B** later — log original committed selection for honest replay; not blocking.
- **Answer:** **A)** Keep · **B)** Log full committed selection

---

### Remainder Islands

#### RI1 — End on last skip *(same as H3)*
- **Answer:** Yes / No · **Recommend: Yes**

---

### Hex

#### HX1 — Full board, no connecting path = explicit draw?
- **Engine now:** `winner: null`, no moves, no `gameOver` phase.
- **Recommend: Yes** — kids need a finished game.
- **Answer:** Yes / No

---

### Queens & Guards

#### QG1 — Stalemate (no legal moves) → opponent wins; gate post-win moves in rules?
- **Engine now:** Controller awards opponent; no `gameOver` phase field; tutorial omits stalemate.
- **Recommend: Yes** — keep opponent-wins; reject further moves in rules; teach in tutorial.
- **Answer:** Yes / No

#### QG2 — Log forced `restoreCapturedPiece` in `moveHistory`?
- **Engine now:** Restore changes board but is not logged (#473); status uses `length / 2`.
- **Recommend: Yes** — history should match board; adjust turn chrome if needed.
- **Answer:** Yes / No

---

### Prime Gold

#### PG1 — Board full → most veins wins?
- **Engine now / #418 intent:** End when 7×7 full; compare veins like chip-exhaust.
- **Recommend: Yes** — avoid endless Roll/Pass.
- **Answer:** Yes / No

#### PG2 — Chip supply floor at 0 (no negative chips)?
- **Engine now / #418 intent:** Refuse place at ≤0; settle when both ≤0.
- **Recommend: Yes** — bugfix to intended budget.
- **Answer:** Yes / No

---

### Juggle

#### JG1 — Pass when roll cannot place?
- **Engine now / #428 intent:** Pass escape so jam isn’t permanent. Win still = first full board.
- **Recommend: Yes**
- **Answer:** Yes / No

#### JG2 — After N mutual passes, auto-settle?
- **Engine now:** Pass can flip forever.
- **Recommend: B** if playtests hit endless Pass.
- **Answer:** **A)** Leave · **B)** Settle after N mutual passes

---

### Ramrod

#### RM1 — Neither seat can place → auto-settle (score/tie)?
- **Engine now:** Ends on 24 cm or both hands empty; mutual no-fit → infinite Pass (hint only in #431).
- **Recommend: B**
- **Answer:** **A)** Hint only · **B)** Auto-settle

---

### Stars & Bars

#### SB1 — Full board under 30, both must pass → auto-settle?
- **Engine now:** Pass forever; no full-board end.
- **Recommend: B**
- **Answer:** **A)** Leave · **B)** Auto-settle

#### SB2 — Keep target 30?
- **Engine now:** Often ends in ~3–4 turns.
- **Recommend: A** until teachers ask for longer.
- **Answer:** **A)** Keep 30 · **B)** Raise · **C)** Nerf star/adjacency

#### SB3 — First card anywhere (adjacency only after)?
- **Engine now:** Empty board → all cells valid. Tutorial said always adjacent.
- **Recommend: Yes** (keep engine) — fix tutorial.
- **Answer:** Yes / No

---

### Star Track

#### ST1 — Overshoot clamps to star and wins?
- **Engine now:** `Math.min(..., TRACK_LENGTH)` → win. Tutorial doesn’t require exact count.
- **Recommend: Yes** — simpler for K–1.
- **Answer:** Yes / No

#### ST2 — Bucket &lt; 2 chains → end by position (or draw)?
- **Engine now:** Yes. Tutorial only mentions race-to-star.
- **Recommend: Yes** — finite game; teach in tutorial (don’t claim “reached the star” on exhaust).
- **Answer:** Yes / No

---

### Sum Dominoes

#### SD1 — Opening double-pass can end by pip settle?
- **Engine now:** Legal; matches tutorial consecutive-pass rule.
- **Recommend: Yes**
- **Answer:** Yes / No

#### SD2 — Equal remaining pips = draw?
- **Engine now:** `winner = null`. Tutorial always names a pip winner.
- **Recommend: Yes** (keep draw) — fix tutorial.
- **Answer:** Yes / No

---

### Par 55

#### P55-1 — Keep target 55 (short races OK)?
- **Engine now:** First to ≥55; games can be short.
- **Recommend: A**
- **Answer:** **A)** Keep 55 · **B)** Raise · **C)** Nerf scoring

#### P55-2 — “Who hit 55 first” tiebreak?
- **Engine now:** No stored first-to-55; tutorial claims it.
- **Recommend: No** — keep current settle; fix tutorial (or add storage later).
- **Answer:** Yes (= add first-to-55) / No (= fix tutorial)

#### P55-3 — Simplified “no reply turn” when p1 hits target — OK vs official?
- **Engine now:** Comments note no reply when player1 hits target (#482).
- **Recommend: Yes** until official Highlights say otherwise.
- **Answer:** Yes / No

---

### Calla

#### CA1 — Soft-lock settle when seat has no valid pits?
- **Engine now:** `settleNoValidMoves` → remaining cubes to Callas, compare.
- **Recommend: Yes**
- **Answer:** Yes / No

#### CA2 — End when one side’s pits empty (not “all cubes collected”)?
- **Engine now:** One side empty → scoop other side → highest Calla. Tutorial says “all cubes collected.”
- **Recommend: Yes** (keep engine) — How-to already matches; fix tutorial.
- **Answer:** Yes / No

#### CA3 — Capture = opposite pit + landing cube?
- **Engine now:** Yes (`+ 1`). Tutorial understates.
- **Recommend: Yes** (keep engine) — fix tutorial.
- **Answer:** Yes / No

---

### Contig 60

#### CT1 — Both somehow have 5-in-a-row → player1 wins?
- **Engine now:** Checks player1 first.
- **Recommend: A** — should be unreachable in legal play; p1 OK as forge tie-break.
- **Answer:** **A)** Keep p1 · **B)** Draw

#### CT2 — Roll always enters `calculating` even when no valid placements?
- **Engine now:** `doRollDice` always advances; pass is the recovery when `hasValidMoves` is false.
- **Recommend: Yes** — intentional; pass path already handles jam.
- **Answer:** Yes / No

---

### Pent'Em In

#### PE1 — You win if opponent can’t place, even if you couldn’t place next either?
- **Engine now:** Last successful place wins when opponent has no move.
- **Recommend: Yes** — classic last-player-who-placed.
- **Answer:** Yes / No

---

### Frac Fact

#### FF1 — 10 problems **total** (not each)?
- **Engine now:** `DEFAULT_MAX_PROBLEMS = 10` total (~5 each). Tutorial/How-to say “each.”
- **Recommend: A** — keep total 10; fix copy (or **B** raise to 10 each if classroom wants longer).
- **Answer:** **A)** Keep total 10 · **B)** 10 each

#### FF2 — Streak bonus scales with streak length?
- **Engine now:** +10, +15, +20… Tutorial reads as flat +5.
- **Recommend: Yes** (keep scaling) — fix tutorial.
- **Answer:** Yes / No

---

### Cross-game pass & undo

#### X1 — Ungated `passTurn` (Stars / Kwatro / Par / Ramrod / Fab) — voluntary OK?
- **Engine now:** Pass often flips seat without requiring “no legal moves.”
- **Recommend: B** for race games (Par/Ramrod/Stars); **A** for Kwatro until win rules settle.
- **Answer:** **A)** Voluntary OK · **B)** Only when no legal moves · **C)** Per-game (list)

#### X2 — Log passes/skips in `moveHistory`?
- **Engine now:** Many passes/skips omitted (#473) → undo-via-history incomplete.
- **Recommend: Yes** — history should reconstruct seats.
- **Answer:** Yes / No

#### X3 — Add player-facing Undo/Redo on games?
- **Engine now:** Only polyomino demo has Undo (#473).
- **Recommend: No** for now — feature, not a rules bug.
- **Answer:** Yes / No

---

## Reply template

Paste answers (one per line). Skip any you’re deferring with `ID: defer`.

```
H1: Yes|No
H2: A|B|C
H3: Yes|No
H4: Yes|No
H5: Yes|No

KW1: A|B
KW2: Yes|No
KW3: A|B
KW4: A|B
KW5: A|B|C
FI1: A|B|C
FI2: Yes|No
KQ1: Yes|No
KQ2: Yes|No
FA1: Yes|No
FA2: Yes|No
HG1: Yes|No
HG2: Yes|No
HG3: A|B
RI1: Yes|No
HX1: Yes|No
QG1: Yes|No
QG2: Yes|No
PG1: Yes|No
PG2: Yes|No
JG1: Yes|No
JG2: A|B
RM1: A|B
SB1: A|B
SB2: A|B|C
SB3: Yes|No
ST1: Yes|No
ST2: Yes|No
SD1: Yes|No
SD2: Yes|No
P55-1: A|B|C
P55-2: Yes|No
P55-3: Yes|No
CA1: Yes|No
CA2: Yes|No
CA3: Yes|No
CT1: A|B
CT2: Yes|No
PE1: Yes|No
FF1: A|B
FF2: Yes|No
X1: A|B|C
X2: Yes|No
X3: Yes|No
```

**Item count: 44** distinct decision IDs (`KW1`…`X3`, including `CT2`). Top 5 (`H1`–`H5`) are priority aliases of `KW2`, `KW5`/`FI1`, `RI1`, `KQ1`, `HG1`.

Do not merge until the owner answers (or explicitly defers).
