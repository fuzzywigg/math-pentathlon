# Rules / scoring / end-condition questions — 2026-10-07

One list for humans to answer **yes/no or multiple choice**. Sources: deep-playtest reports `docs/playtest/*-deep-2026-10-07.md` on open draft PRs, plus Kwatro #393/#394 (and #355 leftovers). Playability-only PRs that raised **no** rules call are noted at the end.

**How to read each item:** current live/base behavior → what that PR does or leaves alone → short rules quote → pick an answer.

---

## Kwatro-Sinko — #393, #394 (also #355)

Official Div II Highlights GOAL (quoted in both PRs / `docs/mp3d/kwatro-sinko-3d-spec.md`):

> To win, all of a player’s chips must be on NON-NUMBERED circular spaces and the player must correctly identify a winning straight-lined path of exactly 3 chips, two of the same color and the third of the opposite color. The path of 3 chips does not need to be contiguous but cannot cross the middle (yellow) area of the board. Also, the result of adding the numbers on chips of like color and subtracting the number of the chip of opposite color must total 4 or 5. Only 3 chips can be on the winning path.

### Q1 — Diagonal moves

| | |
| --- | --- |
| **Current** | Engine links diagonals only in the center 3×3 (`createBoard`). Tutorial on #394: “Diagonal connections exist in the center 3×3…”. |
| **PR** | #393 / #394 leave the graph alone; #394 locks the 3×3 behavior in tests. |
| **Rules text** | Highlights do **not** say which spaces get diagonals. Kit/product copy imply H/V/diagonal on an 8-point star (not this 5×5). |
| **Answer** | **A)** Keep center 3×3 only · **B)** Expand diagonals (say how: everywhere? rim↔interior both ways?) |

**Recommend: A** until a star-board rebuild. Expanding here is a board-model change, not a Highlights polish.

### Q2 — Gaps on a winning path (contiguous vs not)

| | |
| --- | --- |
| **Current (alpha / #394 lock)** | Win scan is **contiguous** — an empty cell breaks the line. |
| **PR** | **#393 changes** detection to allow empty gaps on a straight line. **#394 documents** contiguous as current and leaves the PDF gap open. |
| **Rules text** | PDF: path “does not need to be contiguous”. Tutorial on #393 adds: “Empty spaces between the 3 chips are allowed…”. |
| **Answer** | **Yes** = ship #393 (gaps win) · **No** = keep contiguous (#394) and treat PDF as future star-board work |

**Recommend: Yes** (#393) — matches the quoted GOAL; contiguous wins still count.

### Q3 — “Cannot cross the middle (yellow) area”

| | |
| --- | --- |
| **Current** | Digital board is a full playable 5×5 — no non-playable yellow cell. Wins through geometric center still count. |
| **PR** | Both PRs leave this open; #393 asks for a mapping or defer. |
| **Rules text** | Same GOAL quote (yellow middle). Spec §Rules judgment calls #4. |
| **Answer** | **A)** Gaps-only for now (no yellow ban) until star rebuild · **B)** Add a yellow-crossing ban on 5×5 (**specify which cells/edges**) |

**Recommend: A** — inventing a yellow zone on a lattice without a kit map is guesswork.

### Q4 — “Only 3 chips can be on the winning path”

| | |
| --- | --- |
| **Current** | A longer occupied straight run can still yield a winning **3-chip subset**. |
| **PR** | #394 locks that behavior; asks if longer runs should invalidate. |
| **Rules text** | “Only 3 chips can be on the winning path.” |
| **Answer** | **A)** Keep subset wins · **B)** Invalidate if more than 3 chips sit on that straight line |

**Recommend: B** if we want literal PDF; **A** if we want easier kid wins on a dense board. Default lean **B** once gaps (#Q2) ship.

---

## Prime Gold — #418

Tutorial (`src/games/prime-gold/tutorial.ts`): “Form 4 diagonal veins of prime numbers to win!” / “First to 4 veins wins!”

### Q5 — Board-full settle

| | |
| --- | --- |
| **Current (before #418)** | Win at 4 veins, or when **both** chip counts hit 0 (most veins). Board could fill while chips remained → endless Roll/Pass (negative chips bug). |
| **PR** | Refuses place at ≤0 chips; **also ends** when the 7×7 is full, winner = most veins (same compare as chip-exhaust). |
| **Rules text** | Tutorial only states the 4-vein race; chip-exhaust settle already existed in code. Board-full is new end condition. |
| **Answer** | **Yes** = keep board-full → most veins · **No** = only 4-veins + both-out (find another soft-lock escape) |

**Recommend: Yes** — kids need an ending when the board is stuffed; scoring compare is unchanged.

### Q6 — Chip supply floor at 0

| | |
| --- | --- |
| **Current (before)** | `placeChip` could drive chips **negative**, so `=== 0` settle never fired. |
| **PR** | No place at ≤0; settle when both ≤0. |
| **Rules text** | `CONFIG.STARTING_CHIPS = 20`; exhaust settle already intended “All chips placed - most veins wins”. |
| **Answer** | **Yes** = keep the floor + ≤0 settle · **No** = allow overshoot (not recommended) |

**Recommend: Yes** — bugfix to the intended chip budget, not a new scoring formula.

---

## Remainder Islands — #419

Tutorial winning: “After all turns, the player with the most points wins!” (`TOTAL_TURNS = 24`).

### Q7 — Last-turn skip ends the match

| | |
| --- | --- |
| **Current (base)** | No-valid roll burned `turnsRemaining` but could hit 0 **without** `gameOver` → endless rolling. |
| **PR** | That skip, if it exhausts turns, ends the match and crowns the score leader. Scoring formula / island validity unchanged. |
| **Rules text** | “After all turns, the player with the most points wins!” |
| **Answer** | **Yes** = keep end-on-last-skip · **No** = some other end path |

**Recommend: Yes** — matches the tutorial “after all turns” idea; without it the game never finishes.

---

## Juggle — #428

Tutorial: “Be the first player to completely fill your 9x9 grid…” — no Pass mentioned; tips say “Plan ahead to avoid getting stuck.”

### Q8 — Pass when the roll cannot place

| | |
| --- | --- |
| **Current (before)** | Jam: status stuck on “Place the shape…” with no escape; AI could stall. |
| **PR** | Adds `shouldOfferPass` / `passTurn` (human button + AI auto-pass). Win still = first full board. |
| **Rules text** | Fill-first objective only; stuck case was undefined in tutorial. |
| **Answer** | **Yes** = keep Pass-on-jam · **No** = other escape (forced re-roll, etc.) |

**Recommend: Yes** — needed so kids/AI are not soft-locked; does not change who wins when someone fills.

### Q9 — Mutual-pass settle (not applied)

| | |
| --- | --- |
| **Current / PR** | Pass flips the turn forever if both keep jamming. Report lists “Mutual-pass settle” as **out of scope**. |
| **Rules text** | No draw / mutual-pass rule in tutorial. |
| **Answer** | **A)** Leave infinite Pass · **B)** After N mutual passes, end (higher fill % / tie) |

**Recommend: B** later if playtests hit endless Pass; not blocking #428.

---

## Ramrod — #431

Tutorial winning: “First player to capture 24 cm worth of boxes wins!” Engine also ends when **both hands empty** (higher score).

### Q10 — Mutual-place deadlock

| | |
| --- | --- |
| **Current** | Auto-end only on target 24 or both hands empty. Both can hold rods that fit **no** open slot → infinite Pass. |
| **PR** | UX deadlock hint + New Game prompt only (**no** score settle). 2/60 deep games hit this. |
| **Rules text** | Tutorial: first to 24 cm. No deadlock rule written. |
| **Answer** | **A)** Hint only (ship as-is) · **B)** Auto-settle when neither seat has a legal place (higher score / tie) |

**Recommend: B** — same spirit as “no more moves”; hint alone leaves a zombie game.

---

## Stars & Bars — #432

Tutorial / `CONFIG.TARGET_SCORE = 30`: “Score 30 points…”. Ends at ≥30 or both hands empty (higher score). `passTurn` only flips seat.

### Q11 — Mutual pass on a full board under 30

| | |
| --- | --- |
| **Current / PR** | If the board fills and nobody hit 30, both can only Pass → never settles. Not hit in the 60-game matrix. |
| **PR** | Documented only; **not** changed. |
| **Rules text** | Race to 30 + empty-hands fallback; no full-board rule. |
| **Answer** | **A)** Leave it · **B)** Auto-settle (higher score / tie) when both must pass |

**Recommend: B** — rare, but a stuck full board should end like empty hands.

### Q12 — Target 30 feels very fast

| | |
| --- | --- |
| **Current / PR** | Games often end in ~3–4 human turns (stars + adjacency). No scoring change in PR. |
| **Rules text** | Objective is explicitly 30. |
| **Answer** | **A)** Keep 30 · **B)** Raise target (e.g. 40 / 50) · **C)** Soften star/adjacency scoring |

**Recommend: A** for now (matches in-repo rules); treat **B/C** as a separate balance pass if teachers complain.

---

## Star Track — #436

Tutorial: “reach the star in the center first!” `TRACK_LENGTH = 12`. Code clamps overshoot with `Math.min(..., TRACK_LENGTH)`. Bucket `< 2` chains → end by position (or draw).

### Q13 — Overshoot clamp

| | |
| --- | --- |
| **Current / PR** | Landing past the star clamps to the star and wins. Playtest: intended; **not** changed. |
| **Rules text** | Tutorial says reach the star; does not require exact count. |
| **Answer** | **Yes** = keep clamp-to-win · **No** = exact landing only (bounce / forfeit move) |

**Recommend: Yes** — simpler for K–1; matches current engine + units.

### Q14 — Bucket exhaust end

| | |
| --- | --- |
| **Current / PR** | Fewer than 2 chains left → game over by position (or draw). No soft-lock in 60 games. |
| **Rules text** | Tutorial focuses on race-to-star; exhaust path is engine-only. |
| **Answer** | **Yes** = keep position settle · **No** = reshuffle / other |

**Recommend: Yes** — clean finite game.

---

## Sum Dominoes — #421

Tutorial Passing: “If both players pass consecutively, the game ends” / “fewer total pips… wins”.

### Q15 — Opening double-pass pip settle

| | |
| --- | --- |
| **Current / PR** | Short 1-turn games from opening rolls with no placement are **legal** double-pass settles. PR does not change this. |
| **Rules text** | Matches tutorial pass rule. |
| **Answer** | **Yes** = keep · **No** = force at least one successful placement before pip settle |

**Recommend: Yes** — already written in tutorial; not a stall.

---

## Par 55 — #433

Tutorial: “Be the first player to score 55 points…” (`TARGET_SCORE: 55`).

### Q16 — Very short races to 55

| | |
| --- | --- |
| **Current / PR** | Greedy human vs AI often ends in a few plies. **No** scoring change. |
| **Rules text** | First to 55 is the stated objective. |
| **Answer** | **A)** Keep 55 · **B)** Raise target · **C)** Nerf match/bump scoring |

**Recommend: A** unless classroom feedback wants longer games (**B/C**).

---

## Calla — #430

### Q17 — Empty-valids soft-lock settle

| | |
| --- | --- |
| **Current / PR** | If the human seat has no valid pits mid-game, controller runs existing `settleNoValidMoves` (remaining cubes → Callas, compare). Same collection as normal end. |
| **Rules text** | Normal end already empties a side’s pits into Callas. |
| **Answer** | **Yes** = keep defensive settle · **No** = only end when a side’s pits are naturally empty |

**Recommend: Yes** — same scoring math; avoids a frozen board.

---

## No rules call raised (playability only)

These deep-playtest drafts state **no** rules/scoring/end-condition changes and did not open a human rules decision:

| PR | Game |
| --- | --- |
| #422 | Fab-a-Diffy |
| #424 | Fraction Pinball (balls floor is defensive display/state clamp; win checks already `<= 0`) |
| #425 | Contig 60 (Hard AI lookahead only) |
| #426 | Kings (Medium AI win-pool only) |
| #427 | Queens & Guards |
| #429 | Hex-a-Gone (AI pace / Easy selection cap) |
| #434 | Hex |
| #418 FIAR half | Move-phase UX + touch only |

Also: #414 playtest report, #415/#418 recheck, #416 Kwatro AI thrash (explicitly **no** win-rule edits pending #393/#394), #438 integration (excludes #419/#428/#429 as rules-adjacent for merge order).

---

## Suggested answer checklist

| # | Game | PR(s) | Pick |
| --- | --- | --- | --- |
| Q1 | Kwatro | #393/#394/#355 | A / B |
| Q2 | Kwatro | #393 vs #394 | Yes / No |
| Q3 | Kwatro | #393/#394 | A / B |
| Q4 | Kwatro | #394 | A / B |
| Q5 | Prime Gold | #418 | Yes / No |
| Q6 | Prime Gold | #418 | Yes / No |
| Q7 | Remainder Islands | #419 | Yes / No |
| Q8 | Juggle | #428 | Yes / No |
| Q9 | Juggle | #428 (deferred) | A / B |
| Q10 | Ramrod | #431 | A / B |
| Q11 | Stars & Bars | #432 | A / B |
| Q12 | Stars & Bars | #432 | A / B / C |
| Q13 | Star Track | #436 | Yes / No |
| Q14 | Star Track | #436 | Yes / No |
| Q15 | Sum Dominoes | #421 | Yes / No |
| Q16 | Par 55 | #433 | A / B / C |
| Q17 | Calla | #430 | Yes / No |

Docs only — no engine changes in this file’s PR.
