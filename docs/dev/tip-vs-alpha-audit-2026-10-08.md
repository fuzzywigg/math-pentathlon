# Tip vs `alpha` hard-rule audit (2026-10-08)

**Task id:** `burn-1008-mp-tip-vs-alpha-hard-rule-audit`

Report-only audit of `git diff origin/alpha...<tip>` against burn-1008 hard rules. No product code changes.

## Scope

| Item | Value |
| --- | --- |
| Tip | `cursor/integration-fold-wave5-tip-4af0` (`36a1340dc9a7b7699daa60d457492e2f5b06093e`) — PR #477 |
| Alpha | `alpha` (`eec2b327c1e65586537cbe03b1c29b93065dee03`) |
| Commits ahead | **363** (`left-right` 0	363) |
| Files changed | **1058** (657 A / 394 M / 7 D) |

## Overlap check (open drafts)

No open PR already delivers a tip-vs-alpha file-by-file hard-rule audit. Adjacent reports:

- **#538:** Compliance review of open tip drafts — not tip-vs-alpha file audit
- **#543:** Compliance review 2 of #539–#542 — not tip-vs-alpha
- **#545:** Open draft triage inventory — flags unfolder (e) drafts; does not classify tip tree vs alpha
- **#547:** Preflight gates + eyeball lists — overlaps on AI/copy lists; this audit is the file-by-file hard-rule classification that was missing
- **#549:** Merge-window decision sheet — references eyeball/holds; not a file-by-file hard-rule audit

## Hard rules audited

- No AI behavior changes (search, scoring, difficulty, timing)
- No player-facing copy or rules-text changes
- No Stars & Bars history cap
- Hex Hard assert stays 450ms
- Workflows keep permissions contents:read and persist-credentials:false (do not loosen)

## Classification taxonomy

Each changed file gets a primary class:

- `OK`
- `AI_BEHAVIOR_CHANGE`
- `PLAYER_FACING_COPY`
- `STARS_BARS_HISTORY_CAP`
- `HEX_HARD_ASSERT_NOT_450`
- `WORKFLOW_LOOSENS_PERMISSIONS`

A file may also carry a secondary class when both AI timing and copy change (listed in JSON `classifications`).

## Counts

| Primary classification | Files |
| --- | ---: |
| `OK` | 1010 |
| `PLAYER_FACING_COPY` | 32 |
| `AI_BEHAVIOR_CHANGE` | 16 |
| **Total** | **1058** |

Non-OK findings (detailed): **54**.

| Violation class | Count on tip |
| --- | ---: |
| `STARS_BARS_HISTORY_CAP` | 0 |
| `HEX_HARD_ASSERT_NOT_450` | 0 |
| `WORKFLOW_LOOSENS_PERMISSIONS` | 0 |

## Spot-checks (acceptance)

### Hex Hard assert stays 450ms

**Result:** PASS — tip hard: 450; unit expect(...).toBe(450)

- `src/games/hex/ai.ts:21` — `hard: 450,`
- `tests/unit/hex-deep-playability.test.ts:58` — `expect(ai.AI_PLAY_DEADLINE_MS.hard).toBe(450);`
- Alpha contrast: `src/games/hex/ai.ts` had `hard: 2500,` (line 17 on alpha blob)
- Assert itself is compliant; the 2500→450 delta is classified AI_BEHAVIOR_CHANGE on src/games/hex/ai.ts

### Stars & Bars history uncapped

**Result:** PASS — tip loops full moveHistory; comment holds #501 slice(-15)

- `src/games/stars-bars/board-ui.ts:747` — `// Full history display (do not cap — #501 fold held player-visible trim for Andrew).`
- `src/games/stars-bars/board-ui.ts:748` — `for (let i = state.moveHistory.length - 1; i >= 0; i--) {`
- Hold commit: `cc802d19` — fix: keep full Stars & Bars move history after #501

### Workflows not loosened

**Result:** PASS — not loosened

- `.github/workflows/ci.yml:16` — `contents: read`
- `.github/workflows/deploy.yml:12` — `contents: read`
- `.github/workflows/deploy.yml:26` — `persist-credentials: false`

## String-literal audit (hidden copy in refactors)

**Method:** Extract HTML text nodes via regex >(text)< from tutorial.ts on alpha vs tip; also high-signal git diff of textContent/status strings in board-ui/game-controller/rules.

Tutorial files with HTML text delta vs alpha: **20** / 20.

Seat/chrome helper dedupe (#518 / 83c5ab52) moved Blue/Red→You/Computer labeling into shared helpers and per-game board-ui; wording deltas remain player-facing and are classified as copy even when accompanying refactors.

Sample deltas (full set in JSON `string_literal_audit.tutorial_files`):

### `src/games/calla/tutorial.ts` (+6/−6 raw extracts)
- + ` in each pit as you go around (counter-clockwise)`
- + `(You skip over your opponent's Calla.)`
- + `,
        and the pit across from it has cubes,`
- − ` in each pit going counter-clockwise`
- − `(You skip over your opponent's Calla)`
- − `,
        AND the pit across from it has cubes...`

### `src/games/contig-60/tutorial.ts` (+6/−6 raw extracts)
- + ` (they can be the same)`
- + `Division must make a whole number (no leftover)`
- + `If both players pass in a row, the game ends and the line-up tiebreak picks the winner`
- − ` (can repeat)`
- − `Division must result in a whole number`
- − `If both players pass in a row, the game ends and the alignment tiebreak decides the winner`

### `src/games/fab-a-diffy/tutorial.ts` (+3/−3 raw extracts)
- + ` If your answer matches a free answer bar, claim it!`
- + `Block your opponent's matches`
- + `Save useful fractions for later`
- − ` If the result matches an available answer bar, claim it!`
- − `Block opponent's potential matches`
- − `Save versatile fractions for later`

### `src/games/fiar/tutorial.ts` (+4/−3 raw extracts)
- + ` Take turns placing 7 chips each on any empty space (2 of your 7 chips are marked Fire Extinguishers)`
- + `Find four (or more) chips of the same color on a straight line of connected spaces.`
- + `No chip of the other color can sit between them.`
- − ` Take turns placing 7 chips each on any empty node (2 of yours are marked Fire Extinguishers)`
- − `Cannot jump over other chips`

### `src/games/frac-fact/tutorial.ts` (+3/−3 raw extracts)
- + `Choose the right answer from 4 choices`
- + `Get answers right in a row for bonus points!`
- + `Players take turns solving fraction problems`
- − `Build streaks for bonus points!`
- − `Choose the correct answer from 4 options`
- − `Players take turns solving fraction arithmetic problems`

### `src/games/fraction-pinball/tutorial.ts` (+5/−5 raw extracts)
- + `A right answer hits a pinball target and adds points`
- + `A wrong answer costs you one ball`
- + `Get points by matching fractions and decimals!`
- − `Correct answers hit pinball targets for points`
- − `Each turn, convert a fraction to decimal or decimal to fraction`
- − `Player with the most points after all rounds wins!`

### `src/games/hex-a-gone/tutorial.ts` (+4/−4 raw extracts)
- + ` and try to be the last one who can place a shape!`
- + `Choosing more shapes can fill the board faster, but it is riskier!`
- + `It's a shape puzzle. Try to be the last player who can still place a shape!`
- − ` and try to be the last player standing!`
- − `It's a shape-fitting puzzle game where you fill up the board!`
- − `More shapes = Riskier but fills the board faster!`

### `src/games/hex/tutorial.ts` (+4/−3 raw extracts)
- + `Leave two ways to connect your pieces later`
- + `Make an unbroken path of your pieces from one of your sides to the other.`
- + `On your turn, tap any empty hex to place your piece`
- − `Create "bridges" - two pieces that can connect via two paths`
- − `On your turn, click any empty hex to place your piece`

## Non-OK findings

Every finding below was opened on the tip tree (and alpha contrast where cited).

### `AI_BEHAVIOR_CHANGE` (16)

#### `src/games/calla/game-controller.ts`

- **Summary:** AI_THINKING_DELAY 800→600 (+ free-turn 250).
- **Evidence:**
  - `src/games/calla/game-controller.ts` — AI_THINKING_DELAY 800→600 (+ free-turn 250).
- **Introducing commit(s):** `ce2dd300`
- **Originating PR(s):** calla deep playtest fold
- **Already flagged?**
  - #547: timing eyeball
  - #549: D07
- **Surgical remediation (tip owner):** Restore alpha AI delay constants from `origin/alpha:src/games/calla/game-controller.ts` (or cherry-pick only timer-cancel / generation-token hunks from tip). Exact: `git show origin/alpha:src/games/calla/game-controller.ts` and re-apply tip non-timing fixes.

#### `src/games/contig-60/ai.ts`

- **Summary:** Hard lookahead open-win-threat scoring added; difficulty now drives lookahead.
- **Evidence:**
  - `src/games/contig-60/ai.ts:36` — `hard: { ..., lookahead: true }`
  - `src/games/contig-60/ai.ts:159` — `function countOpenWinThreatsFor(...)`
  - `src/games/contig-60/ai.ts:260` — `if (useLookahead) { ... threats ... }`
- **Introducing commit(s):** `9f1ffdff` (fix(contig-60): deep playtest — AI timer race, touch, Hard lookahead, UX)
- **Originating PR(s):** deep-playtest contig fold (related open draft #433 contained per #545)
- **Already flagged?**
  - #547: yes — ai.ts eyeball list
  - #549: D07
  - #545: #433 contained on tip
  - #538: no
  - #543: no
- **Surgical remediation (tip owner):** `git checkout origin/alpha -- src/games/contig-60/ai.ts` then re-apply import-type-only tip edits. Keep timer-race fixes in game-controller separately if still desired.

#### `src/games/contig-60/game-controller.ts`

- **Summary:** AI_PLACE_DELAY_MS=450 introduced.
- **Evidence:**
  - `src/games/contig-60/game-controller.ts` — AI_PLACE_DELAY_MS=450 introduced.
- **Introducing commit(s):** `9f1ffdff`
- **Originating PR(s):** #433 contained
- **Already flagged?**
  - #545: #433 contained
  - #547: yes
- **Surgical remediation (tip owner):** Restore alpha AI delay constants from `origin/alpha:src/games/contig-60/game-controller.ts` (or cherry-pick only timer-cancel / generation-token hunks from tip). Exact: `git show origin/alpha:src/games/contig-60/game-controller.ts` and re-apply tip non-timing fixes.

#### `src/games/fraction-pinball/game-controller.ts`

- **Summary:** AI_THINK_MS=650 (+ result pacing).
- **Evidence:**
  - `src/games/fraction-pinball/game-controller.ts` — AI_THINK_MS=650 (+ result pacing).
- **Introducing commit(s):** `5721ac4a`
- **Originating PR(s):** fraction-pinball deep playtest
- **Already flagged?**
  - #547: yes
- **Surgical remediation (tip owner):** Restore alpha AI delay constants from `origin/alpha:src/games/fraction-pinball/game-controller.ts` (or cherry-pick only timer-cancel / generation-token hunks from tip). Exact: `git show origin/alpha:src/games/fraction-pinball/game-controller.ts` and re-apply tip non-timing fixes.

#### `src/games/hex-a-gone/game-controller.ts`

- **Summary:** AI_THINKING_DELAY 800→350.
- **Evidence:**
  - `src/games/hex-a-gone/game-controller.ts` — AI_THINKING_DELAY 800→350.
- **Introducing commit(s):** `145b6cb2`
- **Originating PR(s):** playtest soft-lock/AI budget fold
- **Already flagged?**
  - #545: open #429 hex-a-gone AI caps violation not folded; tip still has controller delay change
  - #547: yes
- **Surgical remediation (tip owner):** Restore alpha AI delay constants from `origin/alpha:src/games/hex-a-gone/game-controller.ts` (or cherry-pick only timer-cancel / generation-token hunks from tip). Exact: `git show origin/alpha:src/games/hex-a-gone/game-controller.ts` and re-apply tip non-timing fixes.

#### `src/games/hex/ai.ts`

- **Summary:** Hard play deadline 2500→450 (search timing).
- **Evidence:**
  - `src/games/hex/ai.ts:21` — `hard: 450,`
    - alpha: `hard: 2500,`
- **Introducing commit(s):** `be668f62` (fix: time-box Hard hex/queens AI and bench think times)
- **Originating PR(s):** #472 (folded via merge b6758ee9)
- **Already flagged?**
  - #538: no (draft-PR audit)
  - #543: no
  - #545: related open draft #472 still open; tip already contains time-box
  - #547: yes — eyeball list hex Hard 2500→450
  - #549: yes — D07 eyeball; hard hold Hex assert stays 450
- **Surgical remediation (tip owner):** To restore alpha timing while keeping assert: restore `AI_PLAY_DEADLINE_MS.hard` to 2500 from `origin/alpha:src/games/hex/ai.ts`, and update `tests/unit/hex-deep-playability.test.ts` / `tests/unit/queens-hex-ai-play-deadline.test.ts` expectations — OR keep tip 450 (current hard-hold) with owner exemption for the timing delta. Do not change the tip assert away from 450 without Andrew. Surgical: revert be668f62 hunks for hex/ai.ts only, then re-apply import-type split from e1692696 if needed.

#### `src/games/hex/game-controller.ts`

- **Summary:** AI_THINKING_DELAY 500→250 (paint).
- **Evidence:**
  - `src/games/hex/game-controller.ts` — AI_THINKING_DELAY 500→250 (paint).
- **Introducing commit(s):** `cbe8bf85`, `be668f62`
- **Originating PR(s):** hex deep playtest / #472
- **Already flagged?**
  - #547: yes
- **Surgical remediation (tip owner):** Restore alpha AI delay constants from `origin/alpha:src/games/hex/game-controller.ts` (or cherry-pick only timer-cancel / generation-token hunks from tip). Exact: `git show origin/alpha:src/games/hex/game-controller.ts` and re-apply tip non-timing fixes.

#### `src/games/kings-quadraphages/ai.ts`

- **Summary:** Medium/Hard placement pool prefers forced wins (score≥10000) instead of random top-5 — difficulty/move selection change.
- **Evidence:**
  - `src/games/kings-quadraphages/ai.ts:275` — `const bestPlacementScore = scoredPlacements[0]?.score ?? -Infinity;`
  - `src/games/kings-quadraphages/ai.ts:276` — `const winningPlacements = scoredPlacements.filter((p) => p.score >= 10000);`
- **Introducing commit(s):** `6d5a384f` (fix(kings): deep playtest polish — touch targets, You/AI copy, Medium win pool)
- **Originating PR(s):** #426 (open; tip contains equivalent fold per #545 contained)
- **Already flagged?**
  - #545: #426 classified contained on tip
  - #547: ai eyeball
  - #549: D07
  - #538: no
  - #543: no
- **Surgical remediation (tip owner):** Restore alpha placement-pool block from `origin/alpha:src/games/kings-quadraphages/ai.ts` (`topPlacements = scoredPlacements.slice(0, Math.min(5,...))`). Keep import-type-only tip edits.

#### `src/games/kings-quadraphages/game-controller.ts`

- **Summary:** Coarse AI think delay 350 vs desktop 500.
- **Evidence:**
  - `src/games/kings-quadraphages/game-controller.ts` — Coarse AI think delay 350 vs desktop 500.
- **Introducing commit(s):** `6d5a384f`
- **Originating PR(s):** #426
- **Already flagged?**
  - #545: contained
  - #547: yes
- **Surgical remediation (tip owner):** Restore alpha AI delay constants from `origin/alpha:src/games/kings-quadraphages/game-controller.ts` (or cherry-pick only timer-cancel / generation-token hunks from tip). Exact: `git show origin/alpha:src/games/kings-quadraphages/game-controller.ts` and re-apply tip non-timing fixes.

#### `src/games/kwatro-sinko/ai.ts`

- **Summary:** Difficulty randomness retune + new numbered-home heuristics + AI_THINK_BUDGET_MS=50 (search/scoring/difficulty/timing).
- **Evidence:**
  - `src/games/kwatro-sinko/ai.ts:37` — `export const AI_THINK_BUDGET_MS = 50;`
  - `src/games/kwatro-sinko/ai.ts:41` — `easy: { randomness: 0.35, ... } // alpha was 0.5`
  - `src/games/kwatro-sinko/ai.ts:155` — `function countOnNumbered(...)`
- **Introducing commit(s):** `08a9bdcf` (fix(kwatro-sinko): stop AI thrashing so long games reach end screens)
- **Originating PR(s):** #416 (merged into tip via a34eea2a)
- **Already flagged?**
  - #547: yes — largest AI edit kwatro
  - #549: yes — D07/D12 soft-lock context
  - #545: related open violation drafts #468/#488 not folded; tip already has #416
  - #538: no
  - #543: no
- **Surgical remediation (tip owner):** `git checkout origin/alpha -- src/games/kwatro-sinko/ai.ts` then re-apply tip import-type-only / curly-lint hunks from e1692696. Owner exemption required to keep tip heuristics.

#### `src/games/par-55/game-controller.ts`

- **Summary:** AI_THINK_DELAY_MS=450.
- **Evidence:**
  - `src/games/par-55/game-controller.ts` — AI_THINK_DELAY_MS=450.
- **Introducing commit(s):** `71077ddf`
- **Originating PR(s):** par-55 deep playtest
- **Already flagged?**
  - #547: yes
- **Surgical remediation (tip owner):** Restore alpha AI delay constants from `origin/alpha:src/games/par-55/game-controller.ts` (or cherry-pick only timer-cancel / generation-token hunks from tip). Exact: `git show origin/alpha:src/games/par-55/game-controller.ts` and re-apply tip non-timing fixes.

#### `src/games/queens-guards/ai.ts`

- **Summary:** Hard play deadline 2500→450 (search timing).
- **Evidence:**
  - `src/games/queens-guards/ai.ts:36` — `hard: 450,`
    - alpha: `hard: 2500,`
- **Introducing commit(s):** `be668f62` (fix: time-box Hard hex/queens AI and bench think times)
- **Originating PR(s):** #472
- **Already flagged?**
  - #547: yes — eyeball queens Hard 2500→450
  - #549: yes — D07
  - #538: no
  - #543: no
  - #545: open #472
- **Surgical remediation (tip owner):** `git checkout origin/alpha -- src/games/queens-guards/ai.ts` then re-apply import-type-only edits from tip, or keep 450 with owner exemption.

#### `src/games/queens-guards/game-controller.ts`

- **Summary:** AI_THINK_PAINT_MS=250.
- **Evidence:**
  - `src/games/queens-guards/game-controller.ts` — AI_THINK_PAINT_MS=250.
- **Introducing commit(s):** `34e82847`, `be668f62`
- **Originating PR(s):** queens deep playtest / #472
- **Already flagged?**
  - #547: yes
- **Surgical remediation (tip owner):** Restore alpha AI delay constants from `origin/alpha:src/games/queens-guards/game-controller.ts` (or cherry-pick only timer-cancel / generation-token hunks from tip). Exact: `git show origin/alpha:src/games/queens-guards/game-controller.ts` and re-apply tip non-timing fixes.

#### `src/games/ramrod/game-controller.ts`

- **Summary:** AI_THINKING_DELAY=550 introduced.
- **Evidence:**
  - `src/games/ramrod/game-controller.ts` — AI_THINKING_DELAY=550 introduced.
- **Introducing commit(s):** `145b6cb2`
- **Originating PR(s):** playtest AI budget fold
- **Already flagged?**
  - #547: yes
- **Surgical remediation (tip owner):** Restore alpha AI delay constants from `origin/alpha:src/games/ramrod/game-controller.ts` (or cherry-pick only timer-cancel / generation-token hunks from tip). Exact: `git show origin/alpha:src/games/ramrod/game-controller.ts` and re-apply tip non-timing fixes.

#### `src/games/star-track/game-controller.ts`

- **Summary:** AI_THINKING_DELAY 600 removed/replaced (faster AI pace).
- **Evidence:**
  - `src/games/star-track/game-controller.ts` — AI_THINKING_DELAY 600 removed/replaced (faster AI pace).
- **Introducing commit(s):** `84679199`
- **Originating PR(s):** #436 contained
- **Already flagged?**
  - #545: #436 contained
  - #547: yes
- **Surgical remediation (tip owner):** Restore alpha AI delay constants from `origin/alpha:src/games/star-track/game-controller.ts` (or cherry-pick only timer-cancel / generation-token hunks from tip). Exact: `git show origin/alpha:src/games/star-track/game-controller.ts` and re-apply tip non-timing fixes.

#### `src/games/stars-bars/game-controller.ts`

- **Summary:** AI_THINK_MS=450.
- **Evidence:**
  - `src/games/stars-bars/game-controller.ts` — AI_THINK_MS=450.
- **Introducing commit(s):** `30b8c59c`
- **Originating PR(s):** stars-bars deep playtest
- **Already flagged?**
  - #547: yes
  - #549: S&B uncapped separate
- **Surgical remediation (tip owner):** Restore alpha AI delay constants from `origin/alpha:src/games/stars-bars/game-controller.ts` (or cherry-pick only timer-cancel / generation-token hunks from tip). Exact: `git show origin/alpha:src/games/stars-bars/game-controller.ts` and re-apply tip non-timing fixes.

### `PLAYER_FACING_COPY` (38)

#### `src/games/calla/board-ui.ts`

- **Summary:** You/AI win-verb grammar and teaching-hint chrome.
- **Evidence:**
  - `src/games/calla/board-ui.ts` — You Win! vs Blue Wins! / AI Wins!
- **Introducing commit(s):** `ce2dd300` (fix(calla): playability polish from deep vs-AI playtest)
- **Originating PR(s):** calla deep playtest
- **Already flagged?**
  - #547: yes
- **Surgical remediation (tip owner):** Restore alpha winner labeling; keep a11y/hit-target fixes.

#### `src/games/calla/rules.ts`

- **Summary:** getPhaseMessage gains You/AI seat display (player-facing rules-text).
- **Evidence:**
  - `src/games/calla/rules.ts:254` — `function seatDisplayName(...)`
  - `src/games/calla/rules.ts:293` — `if (winnerName === 'You') return 'You win!';`
- **Introducing commit(s):** `ce2dd300` (fix(calla): playability polish from deep vs-AI playtest)
- **Originating PR(s):** calla deep playtest fold
- **Already flagged?**
  - #547: yes — rules getPhaseMessage
  - #549: D07
  - #545: open #487/#492 copy violations not folded; tip already has kid-friendly tutorials via #446
  - #538: no
  - #543: no
- **Surgical remediation (tip owner):** `git checkout origin/alpha -- src/games/calla/rules.ts` then re-apply import-type-only tip edits.

#### `src/games/calla/tutorial.ts`

- **Summary:** Kid-friendly / clarity tutorial wording changes vs alpha (player-facing rules-text).
- **Evidence:**
  - `src/games/calla/tutorial.ts` — HTML tutorial step text deltas
    - + ` in each pit as you go around (counter-clockwise)`
    - + `(You skip over your opponent's Calla.)`
    - + `,
        and the pit across from it has cubes,`
    - − ` in each pit going counter-clockwise`
    - − `(You skip over your opponent's Calla)`
    - − `,
        AND the pit across from it has cubes...`
- **Introducing commit(s):** `d5bccd06` (docs(tutorials): audit tutorial vs engine mismatches; K-5 clarity polish), `9ed6903c` (merge(#446): tutorial clarity copy onto test-infra stack)
- **Originating PR(s):** #446 (folded), open #492/#487 classified violation in #545 — not the tip source
- **Already flagged?**
  - #545: open #487/#492 are (e) violations to close; tip already contains #446 tutorial polish
  - #547: yes — all tutorial.ts eyeball
  - #549: D07 eyeball
  - #538: no
  - #543: no
- **Surgical remediation (tip owner):** `git checkout origin/alpha -- src/games/calla/tutorial.ts` then re-apply `import type` only if tip needs it.

#### `src/games/contig-60/game-controller.ts`

- **Summary:** Instruction copy Tap/green-number wording changes (+ AI delay).
- **Evidence:**
  - `src/games/contig-60/game-controller.ts` — Tap a green number on the board...
- **Introducing commit(s):** `9f1ffdff` (fix(contig-60): deep playtest — AI timer race, touch, Hard lookahead, UX)
- **Originating PR(s):** #433
- **Already flagged?**
  - #545: contained
  - #547: yes
- **Surgical remediation (tip owner):** Restore alpha instruction strings; AI_PLACE_DELAY_MS is separate AI timing finding.

#### `src/games/contig-60/tutorial.ts`

- **Summary:** Kid-friendly / clarity tutorial wording changes vs alpha (player-facing rules-text).
- **Evidence:**
  - `src/games/contig-60/tutorial.ts` — HTML tutorial step text deltas
    - + ` (they can be the same)`
    - + `Division must make a whole number (no leftover)`
    - + `If both players pass in a row, the game ends and the line-up tiebreak picks the winner`
    - − ` (can repeat)`
    - − `Division must result in a whole number`
    - − `If both players pass in a row, the game ends and the alignment tiebreak decides the winner`
- **Introducing commit(s):** `d5bccd06` (docs(tutorials): audit tutorial vs engine mismatches; K-5 clarity polish), `9ed6903c` (merge(#446): tutorial clarity copy onto test-infra stack)
- **Originating PR(s):** #446 (folded), open #492/#487 classified violation in #545 — not the tip source
- **Already flagged?**
  - #545: open #487/#492 are (e) violations to close; tip already contains #446 tutorial polish
  - #547: yes — all tutorial.ts eyeball
  - #549: D07 eyeball
  - #538: no
  - #543: no
- **Surgical remediation (tip owner):** `git checkout origin/alpha -- src/games/contig-60/tutorial.ts` then re-apply `import type` only if tip needs it.

#### `src/games/fab-a-diffy/game-controller.ts`

- **Summary:** Computer is thinking… / turn phase status string changes.
- **Evidence:**
  - `src/games/fab-a-diffy/game-controller.ts` — Computer is thinking…
- **Introducing commit(s):** `145b6cb2` (fix(playtest): soft-lock escapes, copy, touch, AI think budget)
- **Originating PR(s):** playtest polish
- **Already flagged?**
  - #547: yes
- **Surgical remediation (tip owner):** Restore alpha status strings.

#### `src/games/fab-a-diffy/tutorial.ts`

- **Summary:** Kid-friendly / clarity tutorial wording changes vs alpha (player-facing rules-text).
- **Evidence:**
  - `src/games/fab-a-diffy/tutorial.ts` — HTML tutorial step text deltas
    - + ` If your answer matches a free answer bar, claim it!`
    - + `Block your opponent's matches`
    - + `Save useful fractions for later`
    - − ` If the result matches an available answer bar, claim it!`
    - − `Block opponent's potential matches`
    - − `Save versatile fractions for later`
- **Introducing commit(s):** `d5bccd06` (docs(tutorials): audit tutorial vs engine mismatches; K-5 clarity polish), `9ed6903c` (merge(#446): tutorial clarity copy onto test-infra stack)
- **Originating PR(s):** #446 (folded), open #492/#487 classified violation in #545 — not the tip source
- **Already flagged?**
  - #545: open #487/#492 are (e) violations to close; tip already contains #446 tutorial polish
  - #547: yes — all tutorial.ts eyeball
  - #549: D07 eyeball
  - #538: no
  - #543: no
- **Surgical remediation (tip owner):** `git checkout origin/alpha -- src/games/fab-a-diffy/tutorial.ts` then re-apply `import type` only if tip needs it.

#### `src/games/fiar/tutorial.ts`

- **Summary:** Kid-friendly / clarity tutorial wording changes vs alpha (player-facing rules-text).
- **Evidence:**
  - `src/games/fiar/tutorial.ts` — HTML tutorial step text deltas
    - + ` Take turns placing 7 chips each on any empty space (2 of your 7 chips are marked Fire Extinguishers`
    - + `Find four (or more) chips of the same color on a straight line of connected spaces.`
    - + `No chip of the other color can sit between them.`
    - − ` Take turns placing 7 chips each on any empty node (2 of yours are marked Fire Extinguishers)`
    - − `Cannot jump over other chips`
    - − `Identify four (or more) chips of the same color along a straight line of connected spaces, with no o`
- **Introducing commit(s):** `d5bccd06` (docs(tutorials): audit tutorial vs engine mismatches; K-5 clarity polish), `9ed6903c` (merge(#446): tutorial clarity copy onto test-infra stack)
- **Originating PR(s):** #446 (folded), open #492/#487 classified violation in #545 — not the tip source
- **Already flagged?**
  - #545: open #487/#492 are (e) violations to close; tip already contains #446 tutorial polish
  - #547: yes — all tutorial.ts eyeball
  - #549: D07 eyeball
  - #538: no
  - #543: no
- **Surgical remediation (tip owner):** `git checkout origin/alpha -- src/games/fiar/tutorial.ts` then re-apply `import type` only if tip needs it.

#### `src/games/frac-fact/tutorial.ts`

- **Summary:** Kid-friendly / clarity tutorial wording changes vs alpha (player-facing rules-text).
- **Evidence:**
  - `src/games/frac-fact/tutorial.ts` — HTML tutorial step text deltas
    - + `Choose the right answer from 4 choices`
    - + `Get answers right in a row for bonus points!`
    - + `Players take turns solving fraction problems`
    - − `Build streaks for bonus points!`
    - − `Choose the correct answer from 4 options`
    - − `Players take turns solving fraction arithmetic problems`
- **Introducing commit(s):** `d5bccd06` (docs(tutorials): audit tutorial vs engine mismatches; K-5 clarity polish), `9ed6903c` (merge(#446): tutorial clarity copy onto test-infra stack)
- **Originating PR(s):** #446 (folded), open #492/#487 classified violation in #545 — not the tip source
- **Already flagged?**
  - #545: open #487/#492 are (e) violations to close; tip already contains #446 tutorial polish
  - #547: yes — all tutorial.ts eyeball
  - #549: D07 eyeball
  - #538: no
  - #543: no
- **Surgical remediation (tip owner):** `git checkout origin/alpha -- src/games/frac-fact/tutorial.ts` then re-apply `import type` only if tip needs it.

#### `src/games/fraction-pinball/board-ui.ts`

- **Summary:** You/Computer seat labels in score chrome.
- **Evidence:**
  - `src/games/fraction-pinball/board-ui.ts` — You/Computer seat labels
- **Introducing commit(s):** `5721ac4a` (fix(fraction-pinball): deep playtest UX, AI pace, touch, balls floor)
- **Originating PR(s):** fraction-pinball deep playtest
- **Already flagged?**
  - #547: yes
- **Surgical remediation (tip owner):** Restore alpha Blue/Red labels or keep with owner copy exemption.

#### `src/games/fraction-pinball/game-controller.ts`

- **Summary:** Computer thinking/hit/miss status strings + Your turn chrome.
- **Evidence:**
  - `src/games/fraction-pinball/game-controller.ts` — Computer is thinking… / Your turn
- **Introducing commit(s):** `5721ac4a` (fix(fraction-pinball): deep playtest UX, AI pace, touch, balls floor)
- **Originating PR(s):** fraction-pinball deep playtest
- **Already flagged?**
  - #547: yes
- **Surgical remediation (tip owner):** Restore alpha status textContent strings; separately decide AI_THINK_MS timing (AI class).

#### `src/games/fraction-pinball/tutorial.ts`

- **Summary:** Kid-friendly / clarity tutorial wording changes vs alpha (player-facing rules-text).
- **Evidence:**
  - `src/games/fraction-pinball/tutorial.ts` — HTML tutorial step text deltas
    - + `A right answer hits a pinball target and adds points`
    - + `A wrong answer costs you one ball`
    - + `Get points by matching fractions and decimals!`
    - − `Correct answers hit pinball targets for points`
    - − `Each turn, convert a fraction to decimal or decimal to fraction`
    - − `Player with the most points after all rounds wins!`
- **Introducing commit(s):** `d5bccd06` (docs(tutorials): audit tutorial vs engine mismatches; K-5 clarity polish), `9ed6903c` (merge(#446): tutorial clarity copy onto test-infra stack)
- **Originating PR(s):** #446 (folded), open #492/#487 classified violation in #545 — not the tip source
- **Already flagged?**
  - #545: open #487/#492 are (e) violations to close; tip already contains #446 tutorial polish
  - #547: yes — all tutorial.ts eyeball
  - #549: D07 eyeball
  - #538: no
  - #543: no
- **Surgical remediation (tip owner):** `git checkout origin/alpha -- src/games/fraction-pinball/tutorial.ts` then re-apply `import type` only if tip needs it.

#### `src/games/hex-a-gone/tutorial.ts`

- **Summary:** Kid-friendly / clarity tutorial wording changes vs alpha (player-facing rules-text).
- **Evidence:**
  - `src/games/hex-a-gone/tutorial.ts` — HTML tutorial step text deltas
    - + ` and try to be the last one who can place a shape!`
    - + `Choosing more shapes can fill the board faster, but it is riskier!`
    - + `It's a shape puzzle. Try to be the last player who can still place a shape!`
    - − ` and try to be the last player standing!`
    - − `It's a shape-fitting puzzle game where you fill up the board!`
    - − `More shapes = Riskier but fills the board faster!`
- **Introducing commit(s):** `d5bccd06` (docs(tutorials): audit tutorial vs engine mismatches; K-5 clarity polish), `9ed6903c` (merge(#446): tutorial clarity copy onto test-infra stack)
- **Originating PR(s):** #446 (folded), open #492/#487 classified violation in #545 — not the tip source
- **Already flagged?**
  - #545: open #487/#492 are (e) violations to close; tip already contains #446 tutorial polish
  - #547: yes — all tutorial.ts eyeball
  - #549: D07 eyeball
  - #538: no
  - #543: no
- **Surgical remediation (tip owner):** `git checkout origin/alpha -- src/games/hex-a-gone/tutorial.ts` then re-apply `import type` only if tip needs it.

#### `src/games/hex/board-ui.ts`

- **Summary:** Winner/AI-thinking status string path changes (emoji thinking removed / seat labels).
- **Evidence:**
  - `src/games/hex/board-ui.ts` — status string path changes vs alpha
- **Introducing commit(s):** `cbe8bf85` (fix(hex): deep playtest polish — 44px cells, AI soft-lock, HvA UX), `83c5ab52` (refactor(ui): dedupe shared seat/chrome/timer/hex helpers (burn-1008))
- **Originating PR(s):** hex deep playtest, #518 UI helper dedupe
- **Already flagged?**
  - #547: yes
- **Surgical remediation (tip owner):** Diff extracted status strings vs alpha; restore wording while keeping touch/keyboard helpers.

#### `src/games/hex/tutorial.ts`

- **Summary:** Kid-friendly / clarity tutorial wording changes vs alpha (player-facing rules-text).
- **Evidence:**
  - `src/games/hex/tutorial.ts` — HTML tutorial step text deltas
    - + `Leave two ways to connect your pieces later`
    - + `Make an unbroken path of your pieces from one of your sides to the other.`
    - + `On your turn, tap any empty hex to place your piece`
    - − `Create "bridges" - two pieces that can connect via two paths`
    - − `Create an unbroken path of your pieces connecting your two edges.
        Hex is a solved game - the`
    - − `On your turn, click any empty hex to place your piece`
- **Introducing commit(s):** `d5bccd06` (docs(tutorials): audit tutorial vs engine mismatches; K-5 clarity polish), `9ed6903c` (merge(#446): tutorial clarity copy onto test-infra stack)
- **Originating PR(s):** #446 (folded), open #492/#487 classified violation in #545 — not the tip source
- **Already flagged?**
  - #545: open #487/#492 are (e) violations to close; tip already contains #446 tutorial polish
  - #547: yes — all tutorial.ts eyeball
  - #549: D07 eyeball
  - #538: no
  - #543: no
- **Surgical remediation (tip owner):** `git checkout origin/alpha -- src/games/hex/tutorial.ts` then re-apply `import type` only if tip needs it.

#### `src/games/juggle/board-ui.ts`

- **Summary:** Place/computer status instruction wording changes.
- **Evidence:**
  - `src/games/juggle/board-ui.ts` — Click a highlighted cell...
- **Introducing commit(s):** `145b6cb2` (fix(playtest): soft-lock escapes, copy, touch, AI think budget)
- **Originating PR(s):** playtest polish
- **Already flagged?**
  - #547: yes
  - #545: open #428 juggle AI/rules violation not on tip
- **Surgical remediation (tip owner):** Restore alpha place/computer strings.

#### `src/games/juggle/tutorial.ts`

- **Summary:** Kid-friendly / clarity tutorial wording changes vs alpha (player-facing rules-text).
- **Evidence:**
  - `src/games/juggle/tutorial.ts` — HTML tutorial step text deltas
    - + ` = five squares`
    - + ` = four squares`
    - + ` = one square`
    - − ` = Domino (2 cells)`
    - − ` = Monomino (1 cell)`
    - − ` = Pentomino (5 cells)`
- **Introducing commit(s):** `d5bccd06` (docs(tutorials): audit tutorial vs engine mismatches; K-5 clarity polish), `9ed6903c` (merge(#446): tutorial clarity copy onto test-infra stack)
- **Originating PR(s):** #446 (folded), open #492/#487 classified violation in #545 — not the tip source
- **Already flagged?**
  - #545: open #487/#492 are (e) violations to close; tip already contains #446 tutorial polish
  - #547: yes — all tutorial.ts eyeball
  - #549: D07 eyeball
  - #538: no
  - #543: no
- **Surgical remediation (tip owner):** `git checkout origin/alpha -- src/games/juggle/tutorial.ts` then re-apply `import type` only if tip needs it.

#### `src/games/kings-quadraphages/board-ui.ts`

- **Summary:** vs-AI phase messages rewritten to You/AI actor strings.
- **Evidence:**
  - `src/games/kings-quadraphages/board-ui.ts` — vsAiActorName + getVsAiPhaseMessage added in tip
- **Introducing commit(s):** `6d5a384f` (fix(kings): ... You/AI copy ...)
- **Originating PR(s):** #426
- **Already flagged?**
  - #545: contained
  - #547: tutorial/copy eyeball
  - #549: D07
- **Surgical remediation (tip owner):** Restore alpha status-copy helpers from `origin/alpha:src/games/kings-quadraphages/board-ui.ts` for You/AI message functions; keep ≥44px touch CSS.

#### `src/games/kings-quadraphages/tutorial.ts`

- **Summary:** Kid-friendly / clarity tutorial wording changes vs alpha (player-facing rules-text).
- **Evidence:**
  - `src/games/kings-quadraphages/tutorial.ts` — HTML tutorial step text deltas
    - + ` so it cannot move
        to any square next to it (including corners).`
    - + `Hint: Place blockers so the other King has fewer ways to move!`
    - + `Kings move one square in any direction
        (across, up and down, or diagonally).`
    - − ` so it cannot move
        to any adjacent cell.`
    - − `Kings move like in chess - one square in any direction
        (horizontally, vertically, or diagona`
    - − `Let's learn the basics together!`
- **Introducing commit(s):** `d5bccd06` (docs(tutorials): audit tutorial vs engine mismatches; K-5 clarity polish), `9ed6903c` (merge(#446): tutorial clarity copy onto test-infra stack)
- **Originating PR(s):** #446 (folded), open #492/#487 classified violation in #545 — not the tip source
- **Already flagged?**
  - #545: open #487/#492 are (e) violations to close; tip already contains #446 tutorial polish
  - #547: yes — all tutorial.ts eyeball
  - #549: D07 eyeball
  - #538: no
  - #543: no
- **Surgical remediation (tip owner):** `git checkout origin/alpha -- src/games/kings-quadraphages/tutorial.ts` then re-apply `import type` only if tip needs it.

#### `src/games/kwatro-sinko/tutorial.ts`

- **Summary:** Kid-friendly / clarity tutorial wording changes vs alpha (player-facing rules-text).
- **Evidence:**
  - `src/games/kwatro-sinko/tutorial.ts` — HTML tutorial step text deltas
    - + `Add your two same-color chips, then subtract the other color: the answer must be `
    - + `Chips move along the lines that connect spaces`
    - + `Make a straight line of three chips where `
    - − `Chips move along the pathway connections`
    - − `Create an alignment of three chips where `
    - − `The alignment must satisfy: `
- **Introducing commit(s):** `d5bccd06` (docs(tutorials): audit tutorial vs engine mismatches; K-5 clarity polish), `9ed6903c` (merge(#446): tutorial clarity copy onto test-infra stack)
- **Originating PR(s):** #446 (folded), open #492/#487 classified violation in #545 — not the tip source
- **Already flagged?**
  - #545: open #487/#492 are (e) violations to close; tip already contains #446 tutorial polish
  - #547: yes — all tutorial.ts eyeball
  - #549: D07 eyeball
  - #538: no
  - #543: no
- **Surgical remediation (tip owner):** `git checkout origin/alpha -- src/games/kwatro-sinko/tutorial.ts` then re-apply `import type` only if tip needs it.

#### `src/games/par-55/game-controller.ts`

- **Summary:** Turn status chrome copy changes (+ AI delay).
- **Evidence:**
  - `src/games/par-55/game-controller.ts` — status textContent turn chrome
- **Introducing commit(s):** `71077ddf` (fix(par-55): deep playtest — AI timer race, touch floors, turn copy)
- **Originating PR(s):** par-55 deep playtest
- **Already flagged?**
  - #547: yes
- **Surgical remediation (tip owner):** Restore alpha status strings; AI_THINK_DELAY_MS separate.

#### `src/games/par-55/tutorial.ts`

- **Summary:** Kid-friendly / clarity tutorial wording changes vs alpha (player-facing rules-text).
- **Evidence:**
  - `src/games/par-55/tutorial.ts` — HTML tutorial step text deltas
    - + ` Earn 1 point for each matching feature with neighboring blocks`
    - + ` Put it on an empty pentagon next to one that already has a block`
    - + `Be the first player to score 55 points by matching features (shape, color, size, or thickness)!`
    - − ` Earn 1 point for each matching attribute with adjacent blocks`
    - − ` Put it on an empty base adjacent to occupied bases`
    - − `Be the first player to score 55 points by matching attributes on the board!`
- **Introducing commit(s):** `d5bccd06` (docs(tutorials): audit tutorial vs engine mismatches; K-5 clarity polish), `9ed6903c` (merge(#446): tutorial clarity copy onto test-infra stack)
- **Originating PR(s):** #446 (folded), open #492/#487 classified violation in #545 — not the tip source
- **Already flagged?**
  - #545: open #487/#492 are (e) violations to close; tip already contains #446 tutorial polish
  - #547: yes — all tutorial.ts eyeball
  - #549: D07 eyeball
  - #538: no
  - #543: no
- **Surgical remediation (tip owner):** `git checkout origin/alpha -- src/games/par-55/tutorial.ts` then re-apply `import type` only if tip needs it.

#### `src/games/pent-em-in/board-ui.ts`

- **Summary:** New place-phase hint copy ('Tap a green cell...').
- **Evidence:**
  - `src/games/pent-em-in/board-ui.ts` — Tap a green cell to place...
- **Introducing commit(s):** `9c799573` (fix(pent-em-in): place-piece legal highlights and choose-another escape)
- **Originating PR(s):** pent-em-in place-piece fold
- **Already flagged?**
  - #547: yes
- **Surgical remediation (tip owner):** Drop new hint string; restore alpha hint text.

#### `src/games/pent-em-in/game-controller.ts`

- **Summary:** Status copy for won't-fit / choose-another escape.
- **Evidence:**
  - `src/games/pent-em-in/game-controller.ts` — won't fit — choose another
- **Introducing commit(s):** `9c799573` (fix(pent-em-in): place-piece legal highlights and choose-another escape)
- **Originating PR(s):** pent-em-in
- **Already flagged?**
  - #547: yes
- **Surgical remediation (tip owner):** Restore alpha status strings; keep legal-highlight logic only if owner allows rules-adjacent UX.

#### `src/games/pent-em-in/tutorial.ts`

- **Summary:** Kid-friendly / clarity tutorial wording changes vs alpha (player-facing rules-text).
- **Evidence:**
  - `src/games/pent-em-in/tutorial.ts` — HTML tutorial step text deltas
    - + ` Choose a piece from your leftover pieces`
    - + ` Put the piece on empty board squares`
    - + ` Turn or flip it if you need to`
    - − ` Adjust orientation if needed`
    - − ` Choose a piece from your bank`
    - − ` Put piece on empty board cells`
- **Introducing commit(s):** `d5bccd06` (docs(tutorials): audit tutorial vs engine mismatches; K-5 clarity polish), `9ed6903c` (merge(#446): tutorial clarity copy onto test-infra stack)
- **Originating PR(s):** #446 (folded), open #492/#487 classified violation in #545 — not the tip source
- **Already flagged?**
  - #545: open #487/#492 are (e) violations to close; tip already contains #446 tutorial polish
  - #547: yes — all tutorial.ts eyeball
  - #549: D07 eyeball
  - #538: no
  - #543: no
- **Surgical remediation (tip owner):** `git checkout origin/alpha -- src/games/pent-em-in/tutorial.ts` then re-apply `import type` only if tip needs it.

#### `src/games/prime-gold/tutorial.ts`

- **Summary:** Kid-friendly / clarity tutorial wording changes vs alpha (player-facing rules-text).
- **Evidence:**
  - `src/games/prime-gold/tutorial.ts` — HTML tutorial step text deltas
    - + ` Combine dice using +, −, ×, ÷, ^, !`
    - + `A vein is at least 4 of your chips in a diagonal row`
    - + `Factorials give big numbers: 5! = 120`
    - − ` Combine dice using +, -, *, /, ^, !`
    - − `A vein = 4+ chips in a diagonal line`
    - − `Factorials give big numbers: 5!=120`
- **Introducing commit(s):** `d5bccd06` (docs(tutorials): audit tutorial vs engine mismatches; K-5 clarity polish), `9ed6903c` (merge(#446): tutorial clarity copy onto test-infra stack)
- **Originating PR(s):** #446 (folded), open #492/#487 classified violation in #545 — not the tip source
- **Already flagged?**
  - #545: open #487/#492 are (e) violations to close; tip already contains #446 tutorial polish
  - #547: yes — all tutorial.ts eyeball
  - #549: D07 eyeball
  - #538: no
  - #543: no
- **Surgical remediation (tip owner):** `git checkout origin/alpha -- src/games/prime-gold/tutorial.ts` then re-apply `import type` only if tip needs it.

#### `src/games/queens-guards/game-controller.ts`

- **Summary:** Computer-seat status / move instruction copy changes.
- **Evidence:**
  - `src/games/queens-guards/game-controller.ts` — Computer seat status / move instruction
- **Introducing commit(s):** `34e82847` (fix(queens-guards): 44px board taps, AI-seat aria, snappier think paint), `31bf0f6d` (fix(queens-guards): keep opening aria stable; outer ring copy)
- **Originating PR(s):** queens deep playtest
- **Already flagged?**
  - #547: yes
- **Surgical remediation (tip owner):** Restore alpha instruction strings; keep AI timer cancel.

#### `src/games/queens-guards/tutorial.ts`

- **Summary:** Kid-friendly / clarity tutorial wording changes vs alpha (player-facing rules-text).
- **Evidence:**
  - `src/games/queens-guards/tutorial.ts` — HTML tutorial step text deltas
    - + `Captured pieces must be moved back to an empty space on the outside ring`
    - + `Place your Queen on the center throne and surround it with all 6 of your Guards on the six spaces ri`
    - + `Tap a piece to select it, then tap a highlighted cell to move`
    - − `Captured pieces must be relocated to the outer ring`
    - − `Click a piece to select it, then click a highlighted cell to move`
    - − `Place your Queen on the center throne and surround it with all 6 of your Guards in the inner ring!`
- **Introducing commit(s):** `d5bccd06` (docs(tutorials): audit tutorial vs engine mismatches; K-5 clarity polish), `9ed6903c` (merge(#446): tutorial clarity copy onto test-infra stack)
- **Originating PR(s):** #446 (folded), open #492/#487 classified violation in #545 — not the tip source
- **Already flagged?**
  - #545: open #487/#492 are (e) violations to close; tip already contains #446 tutorial polish
  - #547: yes — all tutorial.ts eyeball
  - #549: D07 eyeball
  - #538: no
  - #543: no
- **Surgical remediation (tip owner):** `git checkout origin/alpha -- src/games/queens-guards/tutorial.ts` then re-apply `import type` only if tip needs it.

#### `src/games/ramrod/game-controller.ts`

- **Summary:** Your hand / tap-rod instruction copy changes.
- **Evidence:**
  - `src/games/ramrod/game-controller.ts` — Your hand (Blue) — tap a rod...
- **Introducing commit(s):** `145b6cb2` (fix(playtest): soft-lock escapes, copy, touch, AI think budget)
- **Originating PR(s):** playtest polish
- **Already flagged?**
  - #547: yes
- **Surgical remediation (tip owner):** Restore alpha status strings; keep AI delay decision separate.

#### `src/games/ramrod/tutorial.ts`

- **Summary:** Kid-friendly / clarity tutorial wording changes vs alpha (player-facing rules-text).
- **Evidence:**
  - `src/games/ramrod/tutorial.ts` — HTML tutorial step text deltas
    - + ` = 1 cm, `
    - + ` = 10 cm`
    - + ` = 3 cm, `
    - − ` = 1cm, `
    - − ` = 3cm, `
    - − ` = 5cm, `
- **Introducing commit(s):** `d5bccd06` (docs(tutorials): audit tutorial vs engine mismatches; K-5 clarity polish), `9ed6903c` (merge(#446): tutorial clarity copy onto test-infra stack)
- **Originating PR(s):** #446 (folded), open #492/#487 classified violation in #545 — not the tip source
- **Already flagged?**
  - #545: open #487/#492 are (e) violations to close; tip already contains #446 tutorial polish
  - #547: yes — all tutorial.ts eyeball
  - #549: D07 eyeball
  - #538: no
  - #543: no
- **Surgical remediation (tip owner):** `git checkout origin/alpha -- src/games/ramrod/tutorial.ts` then re-apply `import type` only if tip needs it.

#### `src/games/remainder-islands/tutorial.ts`

- **Summary:** Kid-friendly / clarity tutorial wording changes vs alpha (player-facing rules-text).
- **Evidence:**
  - `src/games/remainder-islands/tutorial.ts` — HTML tutorial step text deltas
    - + `Remember: a bigger island number can leave a bigger leftover!`
    - + `Roll 7, choose an island with value 3: 7 ÷ 3 = 2 remainder 1 → Score 1 point`
    - + `Score the most points by placing chips on islands and using the leftover when you divide!`
    - − `After all turns, the player with the most points wins!`
    - − `Claim islands to block your opponent`
    - − `Remember: higher divisors can give higher remainders!`
- **Introducing commit(s):** `d5bccd06` (docs(tutorials): audit tutorial vs engine mismatches; K-5 clarity polish), `9ed6903c` (merge(#446): tutorial clarity copy onto test-infra stack)
- **Originating PR(s):** #446 (folded), open #492/#487 classified violation in #545 — not the tip source
- **Already flagged?**
  - #545: open #487/#492 are (e) violations to close; tip already contains #446 tutorial polish
  - #547: yes — all tutorial.ts eyeball
  - #549: D07 eyeball
  - #538: no
  - #543: no
- **Surgical remediation (tip owner):** `git checkout origin/alpha -- src/games/remainder-islands/tutorial.ts` then re-apply `import type` only if tip needs it.

#### `src/games/star-track/board-ui.ts`

- **Summary:** Blue/Red→Your/Computer turn string rewrites.
- **Evidence:**
  - `src/games/star-track/board-ui.ts` — .replace(/^Blue's turn/, 'Your turn') etc.
- **Introducing commit(s):** `84679199` (fix(star-track): playability — AI timer cancel, turn copy, faster AI, 44px)
- **Originating PR(s):** #436
- **Already flagged?**
  - #545: #436 contained
  - #547: copy eyeball
- **Surgical remediation (tip owner):** Restore alpha turn-label formatting; keep timer-cancel / 44px separately.

#### `src/games/star-track/tutorial.ts`

- **Summary:** Kid-friendly / clarity tutorial wording changes vs alpha (player-facing rules-text).
- **Evidence:**
  - `src/games/star-track/tutorial.ts` — HTML tutorial step text deltas
    - + ` A bigger number moves you more spaces toward the star!`
    - + `Each chain is 1, 2, 3, 4, 5, or 6 spaces long.`
    - + `Race to the star. You move by picking chain links.`
    - − ` Bigger numbers move you farther toward the star!`
    - − `Chains come in different sizes: 1, 2, 3, 4, 5, or 6 links long.`
    - − `It's a fun racing game where you use chains to move along the track.`
- **Introducing commit(s):** `d5bccd06` (docs(tutorials): audit tutorial vs engine mismatches; K-5 clarity polish), `9ed6903c` (merge(#446): tutorial clarity copy onto test-infra stack)
- **Originating PR(s):** #446 (folded), open #492/#487 classified violation in #545 — not the tip source
- **Already flagged?**
  - #545: open #487/#492 are (e) violations to close; tip already contains #446 tutorial polish
  - #547: yes — all tutorial.ts eyeball
  - #549: D07 eyeball
  - #538: no
  - #543: no
- **Surgical remediation (tip owner):** `git checkout origin/alpha -- src/games/star-track/tutorial.ts` then re-apply `import type` only if tip needs it.

#### `src/games/stars-bars/board-ui.ts`

- **Summary:** You/Computer hand/score chrome (copy). History remains uncapped (compliant).
- **Evidence:**
  - `src/games/stars-bars/board-ui.ts:747` — `// Full history display (do not cap — #501 fold held...)`
  - `src/games/stars-bars/board-ui.ts` — Your Hand / Computer seat labels
- **Introducing commit(s):** `30b8c59c` (fix(stars-bars): ... You/Computer copy), `cc802d19` (fix: keep full Stars & Bars move history after #501)
- **Originating PR(s):** stars-bars deep playtest, #501 then cc802d19 hold
- **Already flagged?**
  - #547: history uncapped confirmed; copy eyeball
  - #549: S&B uncapped hold
  - #545: n/a
- **Surgical remediation (tip owner):** For copy only: restore alpha getPlayerName/hand label strings from alpha board-ui while keeping tip lines 747–749 full-history loop (do not reintroduce slice(-15)).

#### `src/games/stars-bars/game-controller.ts`

- **Summary:** Your turn — Select a card… status copy (+ AI_THINK_MS).
- **Evidence:**
  - `src/games/stars-bars/game-controller.ts` — Your turn — Select a card from your hand
- **Introducing commit(s):** `30b8c59c` (fix(stars-bars): AI timer race, touch floors, You/Computer copy)
- **Originating PR(s):** stars-bars deep playtest
- **Already flagged?**
  - #547: yes
  - #549: S&B history hold separate
- **Surgical remediation (tip owner):** Restore alpha status strings; keep AI timer cancel + full history in board-ui.

#### `src/games/stars-bars/tutorial.ts`

- **Summary:** Kid-friendly / clarity tutorial wording changes vs alpha (player-facing rules-text).
- **Evidence:**
  - `src/games/stars-bars/tutorial.ts` — HTML tutorial step text deltas
    - + `Compare your card to every neighboring card (up, down, left, right, and diagonals)`
    - + `Place it on a highlighted green cell`
    - + `Score 1 point for each feature that is different`
    - − `Compare your card to ALL adjacent cards (8 directions)`
    - − `Maximum 4 points per adjacent card (all different)`
    - − `Place it on a green (valid) cell`
- **Introducing commit(s):** `d5bccd06` (docs(tutorials): audit tutorial vs engine mismatches; K-5 clarity polish), `9ed6903c` (merge(#446): tutorial clarity copy onto test-infra stack)
- **Originating PR(s):** #446 (folded), open #492/#487 classified violation in #545 — not the tip source
- **Already flagged?**
  - #545: open #487/#492 are (e) violations to close; tip already contains #446 tutorial polish
  - #547: yes — all tutorial.ts eyeball
  - #549: D07 eyeball
  - #538: no
  - #543: no
- **Surgical remediation (tip owner):** `git checkout origin/alpha -- src/games/stars-bars/tutorial.ts` then re-apply `import type` only if tip needs it.

#### `src/games/sum-dominoes/game-controller.ts`

- **Summary:** New legal-cell / highlighted-domino instruction copy.
- **Evidence:**
  - `src/games/sum-dominoes/game-controller.ts` — Green cells are legal...
- **Introducing commit(s):** `331fe01a` (fix(sum-dominoes): AI timer race, stall escape, touch floors, turn hints)
- **Originating PR(s):** sum-dominoes deep playtest
- **Already flagged?**
  - #547: yes
- **Surgical remediation (tip owner):** Restore alpha status textContent; keep timer-race cancels.

#### `src/games/sum-dominoes/tutorial.ts`

- **Summary:** Kid-friendly / clarity tutorial wording changes vs alpha (player-facing rules-text).
- **Evidence:**
  - `src/games/sum-dominoes/tutorial.ts` — HTML tutorial step text deltas
    - + `A number on your tile plus a touching number on the board must equal the dice total`
    - + `Example: You rolled 8. Your tile has a 3. Put that 3 next to a 5 on the board, because 3 + 5 = 8`
    - + `The player with fewer dots left on the tiles still in hand wins`
    - − `Example: You rolled 8. Place [3\|5] next to a [5\|2] so 3+5=8`
    - − `Player with fewer total pips on remaining dominoes wins`
    - − `The face touching must create the rolled sum`
- **Introducing commit(s):** `d5bccd06` (docs(tutorials): audit tutorial vs engine mismatches; K-5 clarity polish), `9ed6903c` (merge(#446): tutorial clarity copy onto test-infra stack)
- **Originating PR(s):** #446 (folded), open #492/#487 classified violation in #545 — not the tip source
- **Already flagged?**
  - #545: open #487/#492 are (e) violations to close; tip already contains #446 tutorial polish
  - #547: yes — all tutorial.ts eyeball
  - #549: D07 eyeball
  - #538: no
  - #543: no
- **Surgical remediation (tip owner):** `git checkout origin/alpha -- src/games/sum-dominoes/tutorial.ts` then re-apply `import type` only if tip needs it.

### `STARS_BARS_HISTORY_CAP` (0)

_None._

### `HEX_HARD_ASSERT_NOT_450` (0)

_None._

### `WORKFLOW_LOOSENS_PERMISSIONS` (0)

_None._

## Verification commands and results

```text
$ git fetch origin alpha cursor/integration-fold-wave5-tip-4af0
→ ok

$ git rev-parse HEAD / origin/alpha / tip
→ HEAD=36a1340dc9a7b7699daa60d457492e2f5b06093e alpha=eec2b327c1e65586537cbe03b1c29b93065dee03

$ git rev-list --left-right --count origin/alpha...tip
→ 0	363

$ git rev-list --count origin/alpha..tip
→ 363

$ git diff --name-status origin/alpha...tip | wc -l
→ 1058

$ status letter counts
→ 657 A / 394 M / 7 D

$ rg -n 'hard: 450' src/games/hex/ai.ts
→ 21:  hard: 450,

$ rg -n 'toBe\(450\)' tests/unit/hex-deep-playability.test.ts
→ 58: expect(...).toBe(450)

$ rg -n 'do not cap|slice\(-15\)' src/games/stars-bars/board-ui.ts
→ 747: do not cap (no slice(-15) on tip)

$ rg permissions/persist-credentials workflows
→ contents: read; persist-credentials: false

$ gh pr list open topic check
→ No tip-vs-alpha hard-rule audit PR; #538/#543/#547/#549 adjacent only

```

## Full file inventory

Every path in the tip-vs-alpha diff is classified. Non-OK rows are expanded above; OK rows are listed here by path prefix for reviewability (machine-readable complete list: `tip-vs-alpha-audit-2026-10-08.json`).

### Non-OK files (primary class)

| Path | Status | Primary | Notes / finding ids |
| --- | --- | --- | --- |
| `src/games/calla/board-ui.ts` | M | `PLAYER_FACING_COPY` | COPY-src/games/calla/board-ui.ts |
| `src/games/calla/game-controller.ts` | M | `AI_BEHAVIOR_CHANGE` | AI-TIMING-src/games/calla/game-controller.ts |
| `src/games/calla/rules.ts` | M | `PLAYER_FACING_COPY` | COPY-src/games/calla/rules.ts |
| `src/games/calla/tutorial.ts` | M | `PLAYER_FACING_COPY` | COPY-src/games/calla/tutorial.ts |
| `src/games/contig-60/ai.ts` | M | `AI_BEHAVIOR_CHANGE` | AI-src/games/contig-60/ai.ts |
| `src/games/contig-60/game-controller.ts` | M | `AI_BEHAVIOR_CHANGE` | AI-TIMING-src/games/contig-60/game-controller.ts, COPY-src/games/contig-60/game-controller.ts |
| `src/games/contig-60/tutorial.ts` | M | `PLAYER_FACING_COPY` | COPY-src/games/contig-60/tutorial.ts |
| `src/games/fab-a-diffy/game-controller.ts` | M | `PLAYER_FACING_COPY` | COPY-src/games/fab-a-diffy/game-controller.ts |
| `src/games/fab-a-diffy/tutorial.ts` | M | `PLAYER_FACING_COPY` | COPY-src/games/fab-a-diffy/tutorial.ts |
| `src/games/fiar/tutorial.ts` | M | `PLAYER_FACING_COPY` | COPY-src/games/fiar/tutorial.ts |
| `src/games/frac-fact/tutorial.ts` | M | `PLAYER_FACING_COPY` | COPY-src/games/frac-fact/tutorial.ts |
| `src/games/fraction-pinball/board-ui.ts` | M | `PLAYER_FACING_COPY` | COPY-src/games/fraction-pinball/board-ui.ts |
| `src/games/fraction-pinball/game-controller.ts` | M | `AI_BEHAVIOR_CHANGE` | AI-TIMING-src/games/fraction-pinball/game-controller.ts, COPY-src/games/fraction-pinball/game-controller.ts |
| `src/games/fraction-pinball/tutorial.ts` | M | `PLAYER_FACING_COPY` | COPY-src/games/fraction-pinball/tutorial.ts |
| `src/games/hex-a-gone/game-controller.ts` | M | `AI_BEHAVIOR_CHANGE` | AI-TIMING-src/games/hex-a-gone/game-controller.ts |
| `src/games/hex-a-gone/tutorial.ts` | M | `PLAYER_FACING_COPY` | COPY-src/games/hex-a-gone/tutorial.ts |
| `src/games/hex/ai.ts` | M | `AI_BEHAVIOR_CHANGE` | AI-src/games/hex/ai.ts |
| `src/games/hex/board-ui.ts` | M | `PLAYER_FACING_COPY` | COPY-src/games/hex/board-ui.ts |
| `src/games/hex/game-controller.ts` | M | `AI_BEHAVIOR_CHANGE` | AI-TIMING-src/games/hex/game-controller.ts |
| `src/games/hex/tutorial.ts` | M | `PLAYER_FACING_COPY` | COPY-src/games/hex/tutorial.ts |
| `src/games/juggle/board-ui.ts` | M | `PLAYER_FACING_COPY` | COPY-src/games/juggle/board-ui.ts |
| `src/games/juggle/tutorial.ts` | M | `PLAYER_FACING_COPY` | COPY-src/games/juggle/tutorial.ts |
| `src/games/kings-quadraphages/ai.ts` | M | `AI_BEHAVIOR_CHANGE` | AI-src/games/kings-quadraphages/ai.ts |
| `src/games/kings-quadraphages/board-ui.ts` | M | `PLAYER_FACING_COPY` | COPY-src/games/kings-quadraphages/board-ui.ts |
| `src/games/kings-quadraphages/game-controller.ts` | M | `AI_BEHAVIOR_CHANGE` | AI-TIMING-src/games/kings-quadraphages/game-controller.ts |
| `src/games/kings-quadraphages/tutorial.ts` | M | `PLAYER_FACING_COPY` | COPY-src/games/kings-quadraphages/tutorial.ts |
| `src/games/kwatro-sinko/ai.ts` | M | `AI_BEHAVIOR_CHANGE` | AI-src/games/kwatro-sinko/ai.ts |
| `src/games/kwatro-sinko/tutorial.ts` | M | `PLAYER_FACING_COPY` | COPY-src/games/kwatro-sinko/tutorial.ts |
| `src/games/par-55/game-controller.ts` | M | `AI_BEHAVIOR_CHANGE` | AI-TIMING-src/games/par-55/game-controller.ts, COPY-src/games/par-55/game-controller.ts |
| `src/games/par-55/tutorial.ts` | M | `PLAYER_FACING_COPY` | COPY-src/games/par-55/tutorial.ts |
| `src/games/pent-em-in/board-ui.ts` | M | `PLAYER_FACING_COPY` | COPY-src/games/pent-em-in/board-ui.ts |
| `src/games/pent-em-in/game-controller.ts` | M | `PLAYER_FACING_COPY` | COPY-src/games/pent-em-in/game-controller.ts |
| `src/games/pent-em-in/tutorial.ts` | M | `PLAYER_FACING_COPY` | COPY-src/games/pent-em-in/tutorial.ts |
| `src/games/prime-gold/tutorial.ts` | M | `PLAYER_FACING_COPY` | COPY-src/games/prime-gold/tutorial.ts |
| `src/games/queens-guards/ai.ts` | M | `AI_BEHAVIOR_CHANGE` | AI-src/games/queens-guards/ai.ts |
| `src/games/queens-guards/game-controller.ts` | M | `AI_BEHAVIOR_CHANGE` | AI-TIMING-src/games/queens-guards/game-controller.ts, COPY-src/games/queens-guards/game-controller.ts |
| `src/games/queens-guards/tutorial.ts` | M | `PLAYER_FACING_COPY` | COPY-src/games/queens-guards/tutorial.ts |
| `src/games/ramrod/game-controller.ts` | M | `AI_BEHAVIOR_CHANGE` | AI-TIMING-src/games/ramrod/game-controller.ts, COPY-src/games/ramrod/game-controller.ts |
| `src/games/ramrod/tutorial.ts` | M | `PLAYER_FACING_COPY` | COPY-src/games/ramrod/tutorial.ts |
| `src/games/remainder-islands/tutorial.ts` | M | `PLAYER_FACING_COPY` | COPY-src/games/remainder-islands/tutorial.ts |
| `src/games/star-track/board-ui.ts` | M | `PLAYER_FACING_COPY` | COPY-src/games/star-track/board-ui.ts |
| `src/games/star-track/game-controller.ts` | M | `AI_BEHAVIOR_CHANGE` | AI-TIMING-src/games/star-track/game-controller.ts |
| `src/games/star-track/tutorial.ts` | M | `PLAYER_FACING_COPY` | COPY-src/games/star-track/tutorial.ts |
| `src/games/stars-bars/board-ui.ts` | M | `PLAYER_FACING_COPY` | COPY-src/games/stars-bars/board-ui.ts |
| `src/games/stars-bars/game-controller.ts` | M | `AI_BEHAVIOR_CHANGE` | AI-TIMING-src/games/stars-bars/game-controller.ts, COPY-src/games/stars-bars/game-controller.ts |
| `src/games/stars-bars/tutorial.ts` | M | `PLAYER_FACING_COPY` | COPY-src/games/stars-bars/tutorial.ts |
| `src/games/sum-dominoes/game-controller.ts` | M | `PLAYER_FACING_COPY` | COPY-src/games/sum-dominoes/game-controller.ts |
| `src/games/sum-dominoes/tutorial.ts` | M | `PLAYER_FACING_COPY` | COPY-src/games/sum-dominoes/tutorial.ts |

### OK files (1010)

Grouped; each path was classified `OK` after rule checks (docs/tests/type-only/a11y/touch/CI hardening, etc.).

#### `.github` (3)

- `.github/copilot-instructions.md` (M)
- `.github/workflows/ci.yml` (M) — Workflow changes harden least-privilege (contents:read, persist-credentials:false); no permission loosening; no apt/pip allowlist widen
- `.github/workflows/deploy.yml` (M) — Workflow changes harden least-privilege (contents:read, persist-credentials:false); no permission loosening; no apt/pip allowlist widen

#### `.gitignore` (1)

- `.gitignore` (M)

#### `CONTRIBUTING.md` (1)

- `CONTRIBUTING.md` (A)

#### `README.md` (1)

- `README.md` (M)

#### `bundle-budgets.json` (1)

- `bundle-budgets.json` (A)

#### `docs/MERGE-REHEARSAL-2026-10-07.md` (1)

- `docs/MERGE-REHEARSAL-2026-10-07.md` (A)

#### `docs/RULES-DECISIONS-2026-10-07.md` (1)

- `docs/RULES-DECISIONS-2026-10-07.md` (A)

#### `docs/STANDALONE-TRIAGE-2026-10-07.md` (1)

- `docs/STANDALONE-TRIAGE-2026-10-07.md` (A)

#### `docs/a11y-axe-audit-2026-10-07.md` (1)

- `docs/a11y-axe-audit-2026-10-07.md` (A)

#### `docs/a11y-sweep-2026-10-07.md` (1)

- `docs/a11y-sweep-2026-10-07.md` (A)

#### `docs/ai-determinism-2026-10-07.md` (1)

- `docs/ai-determinism-2026-10-07.md` (A)

#### `docs/ai-move-time-2026-10-07.md` (1)

- `docs/ai-move-time-2026-10-07.md` (A)

#### `docs/bundle-budget.md` (1)

- `docs/bundle-budget.md` (A)

#### `docs/console-sweep-2026-10-07.md` (1)

- `docs/console-sweep-2026-10-07.md` (A)

#### `docs/cross-browser-2026-10-07.md` (1)

- `docs/cross-browser-2026-10-07.md` (A)

#### `docs/dev` (31)

- `docs/dev/DEPENDENCIES.md` (A)
- `docs/dev/engines/README.md` (A)
- `docs/dev/engines/calla.md` (A)
- `docs/dev/engines/contig-60.md` (A)
- `docs/dev/engines/fab-a-diffy.md` (A)
- `docs/dev/engines/fiar.md` (A)
- `docs/dev/engines/frac-fact.md` (A)
- `docs/dev/engines/fraction-pinball.md` (A)
- `docs/dev/engines/hex-a-gone.md` (A)
- `docs/dev/engines/hex.md` (A)
- `docs/dev/engines/juggle.md` (A)
- `docs/dev/engines/kings-quadraphages.md` (A)
- `docs/dev/engines/kwatro-sinko.md` (A)
- `docs/dev/engines/par-55.md` (A)
- `docs/dev/engines/pent-em-in.md` (A)
- `docs/dev/engines/prime-gold.md` (A)
- `docs/dev/engines/queens-guards.md` (A)
- `docs/dev/engines/ramrod.md` (A)
- `docs/dev/engines/remainder-islands.md` (A)
- `docs/dev/engines/star-track.md` (A)
- `docs/dev/engines/stars-bars.md` (A)
- `docs/dev/engines/sum-dominoes.md` (A)
- `docs/dev/lint-ratchet-ceilings.json` (A)
- `docs/dev/module-boundaries-ceilings.json` (A)
- `docs/dev/render-perf-2026-10-after.json` (A)
- `docs/dev/render-perf-2026-10-before.json` (A)
- `docs/dev/render-perf-2026-10.json` (A)
- `docs/dev/render-perf-2026-10.md` (A)
- `docs/dev/type-ratchet-phase2-baseline.json` (A)
- `docs/dev/type-ratchet-phase2-export.mjs` (A)
- `docs/dev/type-ratchet-phase2-plan.md` (A)

#### `docs/e2e-3d-timeouts-2026-10-07.md` (1)

- `docs/e2e-3d-timeouts-2026-10-07.md` (A)

#### `docs/e2e-flake-hunt-2026-10-07.md` (1)

- `docs/e2e-flake-hunt-2026-10-07.md` (A)

#### `docs/engine-bench-2026-10-08.json` (1)

- `docs/engine-bench-2026-10-08.json` (A)

#### `docs/engine-bench-2026-10-08.md` (1)

- `docs/engine-bench-2026-10-08.md` (A)

#### `docs/engine-coverage-2026-10-07.md` (1)

- `docs/engine-coverage-2026-10-07.md` (A)

#### `docs/engine-coverage-next5-2026-10-07.md` (1)

- `docs/engine-coverage-next5-2026-10-07.md` (A)

#### `docs/engine-coverage-remaining-2026-10-07.md` (1)

- `docs/engine-coverage-remaining-2026-10-07.md` (A)

#### `docs/engine-coverage-targeted-2026-10-07.md` (1)

- `docs/engine-coverage-targeted-2026-10-07.md` (A)

#### `docs/engine-edge-cases-2026-10-07.md` (1)

- `docs/engine-edge-cases-2026-10-07.md` (A)

#### `docs/flake-hunt-2026-10-07.md` (1)

- `docs/flake-hunt-2026-10-07.md` (A)

#### `docs/gallery` (41)

- `docs/gallery/README.md` (A)
- `docs/gallery/calla-mid.png` (A)
- `docs/gallery/calla-start.png` (A)
- `docs/gallery/contig-60-mid.png` (A)
- `docs/gallery/contig-60-start.png` (A)
- `docs/gallery/fab-a-diffy-mid.png` (A)
- `docs/gallery/fab-a-diffy-start.png` (A)
- `docs/gallery/fiar-mid.png` (A)
- `docs/gallery/fiar-start.png` (A)
- `docs/gallery/frac-fact-mid.png` (A)
- `docs/gallery/frac-fact-start.png` (A)
- `docs/gallery/fraction-pinball-mid.png` (A)
- `docs/gallery/fraction-pinball-start.png` (A)
- `docs/gallery/hex-a-gone-mid.png` (A)
- `docs/gallery/hex-a-gone-start.png` (A)
- `docs/gallery/hex-mid.png` (A)
- `docs/gallery/hex-start.png` (A)
- `docs/gallery/juggle-mid.png` (A)
- `docs/gallery/juggle-start.png` (A)
- `docs/gallery/kings-quadraphages-mid.png` (A)
- `docs/gallery/kings-quadraphages-start.png` (A)
- `docs/gallery/kwatro-sinko-mid.png` (A)
- `docs/gallery/kwatro-sinko-start.png` (A)
- `docs/gallery/par-55-mid.png` (A)
- `docs/gallery/par-55-start.png` (A)
- `docs/gallery/pent-em-in-mid.png` (A)
- `docs/gallery/pent-em-in-start.png` (A)
- `docs/gallery/prime-gold-mid.png` (A)
- `docs/gallery/prime-gold-start.png` (A)
- `docs/gallery/queens-guards-mid.png` (A)
- `docs/gallery/queens-guards-start.png` (A)
- `docs/gallery/ramrod-mid.png` (A)
- `docs/gallery/ramrod-start.png` (A)
- `docs/gallery/remainder-islands-mid.png` (A)
- `docs/gallery/remainder-islands-start.png` (A)
- `docs/gallery/star-track-mid.png` (A)
- `docs/gallery/star-track-start.png` (A)
- `docs/gallery/stars-bars-mid.png` (A)
- `docs/gallery/stars-bars-start.png` (A)
- `docs/gallery/sum-dominoes-mid.png` (A)
- `docs/gallery/sum-dominoes-start.png` (A)

#### `docs/keyboard-sr-audit-2026-10-07.md` (1)

- `docs/keyboard-sr-audit-2026-10-07.md` (A)

#### `docs/memory-leaks-2026-10-07.md` (1)

- `docs/memory-leaks-2026-10-07.md` (A)

#### `docs/memory-leaks-after-2026-10-07.json` (1)

- `docs/memory-leaks-after-2026-10-07.json` (A)

#### `docs/memory-leaks-before-2026-10-07.json` (1)

- `docs/memory-leaks-before-2026-10-07.json` (A)

#### `docs/merge-order-2026-10-07.md` (1)

- `docs/merge-order-2026-10-07.md` (A)

#### `docs/mobile-2026-10-07.md` (1)

- `docs/mobile-2026-10-07.md` (A)

#### `docs/mobile-audit-2026-10-07.md` (1)

- `docs/mobile-audit-2026-10-07.md` (A)

#### `docs/mp3d` (6)

- `docs/mp3d/spec-contig-60.gemini.md` (A)
- `docs/mp3d/spec-contig-60.md` (A)
- `docs/mp3d/spec-fiar.gemini.md` (A)
- `docs/mp3d/spec-fiar.md` (A)
- `docs/mp3d/spec-hex.gemini.md` (A)
- `docs/mp3d/spec-hex.md` (A)

#### `docs/mp3d-e2e-flake-2026-10-07.md` (1)

- `docs/mp3d-e2e-flake-2026-10-07.md` (A)

#### `docs/mutation-audit-burn-1008.md` (1)

- `docs/mutation-audit-burn-1008.md` (A)

#### `docs/mutation-report-rules-after.json` (1)

- `docs/mutation-report-rules-after.json` (A)

#### `docs/mutation-report-rules-baseline.json` (1)

- `docs/mutation-report-rules-baseline.json` (A)

#### `docs/mutation-report-rules.json` (1)

- `docs/mutation-report-rules.json` (A)

#### `docs/offline-resilience-2026-10-07.md` (1)

- `docs/offline-resilience-2026-10-07.md` (A)

#### `docs/perf-2026-10-07.md` (1)

- `docs/perf-2026-10-07.md` (A)

#### `docs/playtest` (245)

- `docs/playtest/2026-10-07-pent-place-ux.md` (A)
- `docs/playtest/2026-10-07-pent-place-ux/after-legal-highlights.png` (A)
- `docs/playtest/2026-10-07-pent-place-ux/after-rotate-or-choose.png` (A)
- `docs/playtest/2026-10-07-pent-place-ux/before-stuck.png` (A)
- `docs/playtest/2026-10-07-recheck.md` (A)
- `docs/playtest/2026-10-07-recheck/fab-a-diffy.png` (A)
- `docs/playtest/2026-10-07-recheck/fiar-easy.png` (A)
- `docs/playtest/2026-10-07-recheck/hex-a-gone.png` (A)
- `docs/playtest/2026-10-07-recheck/hex-board.png` (A)
- `docs/playtest/2026-10-07-recheck/juggle-placing.png` (A)
- `docs/playtest/2026-10-07-recheck/juggle-softlock-before.png` (A)
- `docs/playtest/2026-10-07-recheck/kings-board.png` (A)
- `docs/playtest/2026-10-07-recheck/kwatro-sinko-easy.png` (A)
- `docs/playtest/2026-10-07-recheck/pent-em-in-easy.png` (A)
- `docs/playtest/2026-10-07-recheck/prime-gold-hard.png` (A)
- `docs/playtest/2026-10-07-recheck/shell-ollie.png` (A)
- `docs/playtest/2026-10-07-recheck/star-track-you-win.png` (A)
- `docs/playtest/calla-deep-2026-10-07.md` (A)
- `docs/playtest/calla-deep-2026-10-07/desktop-ai-thinking.png` (A)
- `docs/playtest/calla-deep-2026-10-07/desktop-easy-g0-end.png` (A)
- `docs/playtest/calla-deep-2026-10-07/desktop-easy-start.png` (A)
- `docs/playtest/calla-deep-2026-10-07/desktop-hard-g0-end.png` (A)
- `docs/playtest/calla-deep-2026-10-07/desktop-hard-start.png` (A)
- `docs/playtest/calla-deep-2026-10-07/desktop-medium-g0-end.png` (A)
- `docs/playtest/calla-deep-2026-10-07/desktop-medium-start.png` (A)
- `docs/playtest/calla-deep-2026-10-07/desktop-you-win.png` (A)
- `docs/playtest/calla-deep-2026-10-07/desktop-your-turn.png` (A)
- `docs/playtest/calla-deep-2026-10-07/results.json` (A)
- `docs/playtest/calla-deep-2026-10-07/tablet-board.png` (A)
- `docs/playtest/calla-deep-2026-10-07/tablet-easy-g0-end.png` (A)
- `docs/playtest/calla-deep-2026-10-07/tablet-easy-start.png` (A)
- `docs/playtest/calla-deep-2026-10-07/tablet-hard-g0-end.png` (A)
- `docs/playtest/calla-deep-2026-10-07/tablet-hard-start.png` (A)
- `docs/playtest/calla-deep-2026-10-07/tablet-medium-g0-end.png` (A)
- `docs/playtest/calla-deep-2026-10-07/tablet-medium-start.png` (A)
- `docs/playtest/contig-60-deep-2026-10-07.md` (A)
- `docs/playtest/contig-60-deep-2026-10-07/desktop-easy-after-roll.png` (A)
- `docs/playtest/contig-60-deep-2026-10-07/desktop-hard-g0-end.png` (A)
- `docs/playtest/contig-60-deep-2026-10-07/desktop-medium-opening.png` (A)
- `docs/playtest/contig-60-deep-2026-10-07/narrow-390-cells.png` (A)
- `docs/playtest/contig-60-deep-2026-10-07/tablet-easy-after-roll.png` (A)
- `docs/playtest/contig-60-deep-2026-10-07/tablet-easy-opening.png` (A)
- `docs/playtest/contig-60-deep-2026-10-07/tablet-hard-g0-end.png` (A)
- `docs/playtest/contig-60-deep-2026-10-07/tablet-medium-new-game-race.png` (A)
- `docs/playtest/fab-a-diffy-deep-2026-10-07.md` (A)
- `docs/playtest/fab-a-diffy-deep-2026-10-07/fab-desktop-ai-thinking.png` (A)
- `docs/playtest/fab-a-diffy-deep-2026-10-07/fab-desktop-confirming-match.png` (A)
- `docs/playtest/fab-a-diffy-deep-2026-10-07/fab-desktop-easy-g1.png` (A)
- `docs/playtest/fab-a-diffy-deep-2026-10-07/fab-desktop-hard-g1.png` (A)
- `docs/playtest/fab-a-diffy-deep-2026-10-07/fab-desktop-human-turn.png` (A)
- `docs/playtest/fab-a-diffy-deep-2026-10-07/fab-desktop-medium-g1.png` (A)
- `docs/playtest/fab-a-diffy-deep-2026-10-07/fab-tablet-confirming-match.png` (A)
- `docs/playtest/fab-a-diffy-deep-2026-10-07/fab-tablet-easy-g1.png` (A)
- `docs/playtest/fab-a-diffy-deep-2026-10-07/fab-tablet-easy-g2.png` (A)
- `docs/playtest/fab-a-diffy-deep-2026-10-07/fab-tablet-hard-g1.png` (A)
- `docs/playtest/fab-a-diffy-deep-2026-10-07/fab-tablet-human-turn.png` (A)
- `docs/playtest/fab-a-diffy-deep-2026-10-07/fab-tablet-medium-g1.png` (A)
- `docs/playtest/fab-a-diffy-deep-2026-10-07/summary-tablet-easy.json` (A)
- `docs/playtest/fab-a-diffy-deep-2026-10-07/summary.json` (A)
- `docs/playtest/fraction-pinball-deep-2026-10-07.md` (A)
- `docs/playtest/fraction-pinball-deep-2026-10-07/desktop-easy-gameover.png` (A)
- `docs/playtest/fraction-pinball-deep-2026-10-07/desktop-easy-start.png` (A)
- `docs/playtest/fraction-pinball-deep-2026-10-07/desktop-hard-gameover.png` (A)
- `docs/playtest/fraction-pinball-deep-2026-10-07/desktop-hard-start.png` (A)
- `docs/playtest/fraction-pinball-deep-2026-10-07/desktop-medium-after-fix-ai-think.png` (A)
- `docs/playtest/fraction-pinball-deep-2026-10-07/desktop-medium-after-fix-result.png` (A)
- `docs/playtest/fraction-pinball-deep-2026-10-07/desktop-medium-after-fix-start.png` (A)
- `docs/playtest/fraction-pinball-deep-2026-10-07/desktop-medium-gameover.png` (A)
- `docs/playtest/fraction-pinball-deep-2026-10-07/desktop-medium-start.png` (A)
- `docs/playtest/fraction-pinball-deep-2026-10-07/summary.json` (A)
- `docs/playtest/fraction-pinball-deep-2026-10-07/tablet-easy-gameover.png` (A)
- `docs/playtest/fraction-pinball-deep-2026-10-07/tablet-easy-start.png` (A)
- `docs/playtest/fraction-pinball-deep-2026-10-07/tablet-hard-gameover.png` (A)
- `docs/playtest/fraction-pinball-deep-2026-10-07/tablet-hard-start.png` (A)
- `docs/playtest/fraction-pinball-deep-2026-10-07/tablet-medium-after-fix-ai-think.png` (A)
- `docs/playtest/fraction-pinball-deep-2026-10-07/tablet-medium-after-fix-result.png` (A)
- `docs/playtest/fraction-pinball-deep-2026-10-07/tablet-medium-after-fix-start.png` (A)
- `docs/playtest/fraction-pinball-deep-2026-10-07/tablet-medium-gameover.png` (A)
- `docs/playtest/fraction-pinball-deep-2026-10-07/tablet-medium-start.png` (A)
- `docs/playtest/fraction-pinball-deep-playtest.mjs` (A)
- `docs/playtest/hex-deep-2026-10-07.md` (A)
- `docs/playtest/hex-deep-2026-10-07/desktop-before-17px-cells.png` (A)
- `docs/playtest/hex-deep-2026-10-07/desktop-easy-g0-end.png` (A)
- `docs/playtest/hex-deep-2026-10-07/desktop-easy-start.png` (A)
- `docs/playtest/hex-deep-2026-10-07/desktop-hard-g0-end.png` (A)
- `docs/playtest/hex-deep-2026-10-07/desktop-hard-g7-timeout.png` (A)
- `docs/playtest/hex-deep-2026-10-07/desktop-hard-recheck-g0-end.png` (A)
- `docs/playtest/hex-deep-2026-10-07/desktop-hard-start.png` (A)
- `docs/playtest/hex-deep-2026-10-07/desktop-medium-ai-thinking.png` (A)
- `docs/playtest/hex-deep-2026-10-07/desktop-medium-g0-end.png` (A)
- `docs/playtest/hex-deep-2026-10-07/desktop-medium-start-after-fix.png` (A)
- `docs/playtest/hex-deep-2026-10-07/desktop-medium-start.png` (A)
- `docs/playtest/hex-deep-2026-10-07/results-baseline-probe.json` (A)
- `docs/playtest/hex-deep-2026-10-07/results.json` (A)
- `docs/playtest/hex-deep-2026-10-07/summary-baseline-probe.json` (A)
- `docs/playtest/hex-deep-2026-10-07/summary.json` (A)
- `docs/playtest/hex-deep-2026-10-07/tablet-before-38px-width.png` (A)
- `docs/playtest/hex-deep-2026-10-07/tablet-easy-g0-end.png` (A)
- `docs/playtest/hex-deep-2026-10-07/tablet-easy-start.png` (A)
- `docs/playtest/hex-deep-2026-10-07/tablet-hard-g0-end.png` (A)
- `docs/playtest/hex-deep-2026-10-07/tablet-hard-start.png` (A)
- `docs/playtest/hex-deep-2026-10-07/tablet-medium-ai-thinking-after-fix.png` (A)
- `docs/playtest/hex-deep-2026-10-07/tablet-medium-ai-thinking.png` (A)
- `docs/playtest/hex-deep-2026-10-07/tablet-medium-g0-end.png` (A)
- `docs/playtest/hex-deep-2026-10-07/tablet-medium-start-after-fix.png` (A)
- `docs/playtest/hex-deep-2026-10-07/tablet-medium-start.png` (A)
- `docs/playtest/hex-deep-probe.mjs` (A)
- `docs/playtest/kings-deep-2026-10-07.md` (A)
- `docs/playtest/kings-deep-2026-10-07/desktop-ai-thinking.png` (A)
- `docs/playtest/kings-deep-2026-10-07/desktop-before-29px-cells.png` (A)
- `docs/playtest/kings-deep-2026-10-07/desktop-hard-end.png` (A)
- `docs/playtest/kings-deep-2026-10-07/desktop-start.png` (A)
- `docs/playtest/kings-deep-2026-10-07/tablet-ai-thinking.png` (A)
- `docs/playtest/kings-deep-2026-10-07/tablet-before-36px-cells.png` (A)
- `docs/playtest/kings-deep-2026-10-07/tablet-medium-end.png` (A)
- `docs/playtest/kings-deep-2026-10-07/tablet-start.png` (A)
- `docs/playtest/par-55-deep-2026-10-07.md` (A)
- `docs/playtest/par-55-deep-2026-10-07/desktop-easy-end.png` (A)
- `docs/playtest/par-55-deep-2026-10-07/desktop-easy-mid.png` (A)
- `docs/playtest/par-55-deep-2026-10-07/desktop-easy-start.png` (A)
- `docs/playtest/par-55-deep-2026-10-07/desktop-hard-end.png` (A)
- `docs/playtest/par-55-deep-2026-10-07/desktop-hard-mid.png` (A)
- `docs/playtest/par-55-deep-2026-10-07/desktop-hard-start.png` (A)
- `docs/playtest/par-55-deep-2026-10-07/desktop-medium-end.png` (A)
- `docs/playtest/par-55-deep-2026-10-07/desktop-medium-mid.png` (A)
- `docs/playtest/par-55-deep-2026-10-07/desktop-medium-start.png` (A)
- `docs/playtest/par-55-deep-2026-10-07/new-game-race.json` (A)
- `docs/playtest/par-55-deep-2026-10-07/results.json` (A)
- `docs/playtest/par-55-deep-2026-10-07/tablet-ai-thinking.png` (A)
- `docs/playtest/par-55-deep-2026-10-07/tablet-easy-end.png` (A)
- `docs/playtest/par-55-deep-2026-10-07/tablet-easy-g0-error.png` (A)
- `docs/playtest/par-55-deep-2026-10-07/tablet-easy-mid.png` (A)
- `docs/playtest/par-55-deep-2026-10-07/tablet-easy-start.png` (A)
- `docs/playtest/par-55-deep-2026-10-07/tablet-hard-end.png` (A)
- `docs/playtest/par-55-deep-2026-10-07/tablet-hard-mid.png` (A)
- `docs/playtest/par-55-deep-2026-10-07/tablet-hard-start.png` (A)
- `docs/playtest/par-55-deep-2026-10-07/tablet-medium-end.png` (A)
- `docs/playtest/par-55-deep-2026-10-07/tablet-medium-mid.png` (A)
- `docs/playtest/par-55-deep-2026-10-07/tablet-medium-new-game-race.png` (A)
- `docs/playtest/par-55-deep-2026-10-07/tablet-medium-start.png` (A)
- `docs/playtest/par-55-deep-2026-10-07/tablet-placing.png` (A)
- `docs/playtest/queens-guards-deep-2026-10-07.md` (A)
- `docs/playtest/queens-guards-deep-2026-10-07/desktop-easy-g0-ai-stall.png` (A)
- `docs/playtest/queens-guards-deep-2026-10-07/desktop-easy-g0-red-win.png` (A)
- `docs/playtest/queens-guards-deep-2026-10-07/desktop-easy-g1-error.png` (A)
- `docs/playtest/queens-guards-deep-2026-10-07/desktop-easy-g2-ai-stall.png` (A)
- `docs/playtest/queens-guards-deep-2026-10-07/desktop-easy-start.png` (A)
- `docs/playtest/queens-guards-deep-2026-10-07/desktop-hard-g0-red-win.png` (A)
- `docs/playtest/queens-guards-deep-2026-10-07/desktop-hard-start.png` (A)
- `docs/playtest/queens-guards-deep-2026-10-07/desktop-medium-g0-red-win.png` (A)
- `docs/playtest/queens-guards-deep-2026-10-07/desktop-medium-start.png` (A)
- `docs/playtest/queens-guards-deep-2026-10-07/results.json` (A)
- `docs/playtest/queens-guards-deep-2026-10-07/tablet-easy-g0-red-win.png` (A)
- `docs/playtest/queens-guards-deep-2026-10-07/tablet-easy-start.png` (A)
- `docs/playtest/queens-guards-deep-2026-10-07/tablet-hard-g0-red-win.png` (A)
- `docs/playtest/queens-guards-deep-2026-10-07/tablet-hard-g8-ai-stall.png` (A)
- `docs/playtest/queens-guards-deep-2026-10-07/tablet-hard-g9-ai-stall.png` (A)
- `docs/playtest/queens-guards-deep-2026-10-07/tablet-hard-start.png` (A)
- `docs/playtest/queens-guards-deep-2026-10-07/tablet-medium-ai-thinking.png` (A)
- `docs/playtest/queens-guards-deep-2026-10-07/tablet-medium-g0-red-win.png` (A)
- `docs/playtest/queens-guards-deep-2026-10-07/tablet-medium-midgame.png` (A)
- `docs/playtest/queens-guards-deep-2026-10-07/tablet-medium-piece-selected.png` (A)
- `docs/playtest/queens-guards-deep-2026-10-07/tablet-medium-start-after-fix.png` (A)
- `docs/playtest/queens-guards-deep-2026-10-07/tablet-medium-start.png` (A)
- `docs/playtest/queens-guards-deep-2026-10-07/tablet-restore-prompt.png` (A)
- `docs/playtest/ramrod-deep-2026-10-07.md` (A)
- `docs/playtest/ramrod-deep-2026-10-07/desktop-easy-end.png` (A)
- `docs/playtest/ramrod-deep-2026-10-07/desktop-easy-mid.png` (A)
- `docs/playtest/ramrod-deep-2026-10-07/desktop-hard-end.png` (A)
- `docs/playtest/ramrod-deep-2026-10-07/desktop-hard-mid.png` (A)
- `docs/playtest/ramrod-deep-2026-10-07/desktop-medium-end.png` (A)
- `docs/playtest/ramrod-deep-2026-10-07/desktop-medium-mid.png` (A)
- `docs/playtest/ramrod-deep-2026-10-07/desktop-placing-hint.png` (A)
- `docs/playtest/ramrod-deep-2026-10-07/desktop-start.png` (A)
- `docs/playtest/ramrod-deep-2026-10-07/results.json` (A)
- `docs/playtest/ramrod-deep-2026-10-07/tablet-ai-thinking.png` (A)
- `docs/playtest/ramrod-deep-2026-10-07/tablet-easy-end.png` (A)
- `docs/playtest/ramrod-deep-2026-10-07/tablet-easy-mid.png` (A)
- `docs/playtest/ramrod-deep-2026-10-07/tablet-hard-end.png` (A)
- `docs/playtest/ramrod-deep-2026-10-07/tablet-hard-mid.png` (A)
- `docs/playtest/ramrod-deep-2026-10-07/tablet-medium-end.png` (A)
- `docs/playtest/ramrod-deep-2026-10-07/tablet-medium-mid.png` (A)
- `docs/playtest/ramrod-deep-2026-10-07/tablet-placing-hint.png` (A)
- `docs/playtest/ramrod-deep-2026-10-07/tablet-start.png` (A)
- `docs/playtest/screenshots/end-desktop-easy-g1.png` (A)
- `docs/playtest/screenshots/end-desktop-easy-g2.png` (A)
- `docs/playtest/screenshots/end-desktop-hard-g1.png` (A)
- `docs/playtest/screenshots/end-desktop-hard-g2.png` (A)
- `docs/playtest/screenshots/end-desktop-medium-g1.png` (A)
- `docs/playtest/screenshots/end-desktop-medium-g2.png` (A)
- `docs/playtest/screenshots/end-tablet-easy-g1.png` (A)
- `docs/playtest/screenshots/end-tablet-easy-g2.png` (A)
- `docs/playtest/screenshots/end-tablet-hard-g1.png` (A)
- `docs/playtest/screenshots/end-tablet-hard-g2.png` (A)
- `docs/playtest/screenshots/end-tablet-medium-g1.png` (A)
- `docs/playtest/screenshots/end-tablet-medium-g2.png` (A)
- `docs/playtest/screenshots/mid-desktop-easy.png` (A)
- `docs/playtest/screenshots/mid-tablet-easy.png` (A)
- `docs/playtest/screenshots/open-desktop-easy.png` (A)
- `docs/playtest/screenshots/open-desktop-hard.png` (A)
- `docs/playtest/screenshots/open-desktop-medium.png` (A)
- `docs/playtest/screenshots/open-tablet-easy.png` (A)
- `docs/playtest/screenshots/open-tablet-hard.png` (A)
- `docs/playtest/screenshots/open-tablet-medium.png` (A)
- `docs/playtest/screenshots/thinking-desktop-medium.png` (A)
- `docs/playtest/screenshots/thinking-tablet-medium.png` (A)
- `docs/playtest/star-track-deep-2026-10-07.md` (A)
- `docs/playtest/star-track-deep-results.json` (A)
- `docs/playtest/stars-bars-deep-2026-10-07.md` (A)
- `docs/playtest/stars-bars-deep-2026-10-07/desktop-ai-thinking.png` (A)
- `docs/playtest/stars-bars-deep-2026-10-07/desktop-easy-end.png` (A)
- `docs/playtest/stars-bars-deep-2026-10-07/desktop-easy-mid.png` (A)
- `docs/playtest/stars-bars-deep-2026-10-07/desktop-hard-end.png` (A)
- `docs/playtest/stars-bars-deep-2026-10-07/desktop-hard-mid.png` (A)
- `docs/playtest/stars-bars-deep-2026-10-07/desktop-medium-end.png` (A)
- `docs/playtest/stars-bars-deep-2026-10-07/desktop-medium-mid.png` (A)
- `docs/playtest/stars-bars-deep-2026-10-07/desktop-start.png` (A)
- `docs/playtest/stars-bars-deep-2026-10-07/new-game-race.json` (A)
- `docs/playtest/stars-bars-deep-2026-10-07/results.json` (A)
- `docs/playtest/stars-bars-deep-2026-10-07/tablet-ai-thinking.png` (A)
- `docs/playtest/stars-bars-deep-2026-10-07/tablet-easy-end.png` (A)
- `docs/playtest/stars-bars-deep-2026-10-07/tablet-easy-mid.png` (A)
- `docs/playtest/stars-bars-deep-2026-10-07/tablet-hard-end.png` (A)
- `docs/playtest/stars-bars-deep-2026-10-07/tablet-hard-mid.png` (A)
- `docs/playtest/stars-bars-deep-2026-10-07/tablet-medium-end.png` (A)
- `docs/playtest/stars-bars-deep-2026-10-07/tablet-medium-mid.png` (A)
- `docs/playtest/stars-bars-deep-2026-10-07/tablet-medium-new-game-race.png` (A)
- `docs/playtest/stars-bars-deep-2026-10-07/tablet-placing-hint.png` (A)
- `docs/playtest/stars-bars-deep-2026-10-07/tablet-start.png` (A)
- `docs/playtest/sum-dominoes-deep-2026-10-07.md` (A)
- `docs/playtest/sum-dominoes-deep-2026-10-07/desktop-easy-end.png` (A)
- `docs/playtest/sum-dominoes-deep-2026-10-07/desktop-easy-mid.png` (A)
- `docs/playtest/sum-dominoes-deep-2026-10-07/desktop-hard-end.png` (A)
- `docs/playtest/sum-dominoes-deep-2026-10-07/desktop-hard-mid.png` (A)
- `docs/playtest/sum-dominoes-deep-2026-10-07/desktop-medium-end.png` (A)
- `docs/playtest/sum-dominoes-deep-2026-10-07/desktop-medium-mid.png` (A)
- `docs/playtest/sum-dominoes-deep-2026-10-07/desktop-start.png` (A)
- `docs/playtest/sum-dominoes-deep-2026-10-07/results.json` (A)
- `docs/playtest/sum-dominoes-deep-2026-10-07/tablet-ai-thinking.png` (A)
- `docs/playtest/sum-dominoes-deep-2026-10-07/tablet-easy-end.png` (A)
- `docs/playtest/sum-dominoes-deep-2026-10-07/tablet-hard-end.png` (A)
- `docs/playtest/sum-dominoes-deep-2026-10-07/tablet-medium-end.png` (A)
- `docs/playtest/sum-dominoes-deep-2026-10-07/tablet-medium-mid.png` (A)
- `docs/playtest/sum-dominoes-deep-2026-10-07/tablet-placing-hint.png` (A)
- `docs/playtest/sum-dominoes-deep-2026-10-07/tablet-start.png` (A)

#### `docs/runtime-perf-2026-10-07.json` (1)

- `docs/runtime-perf-2026-10-07.json` (A)

#### `docs/runtime-perf-2026-10-07.md` (1)

- `docs/runtime-perf-2026-10-07.md` (A)

#### `docs/screenshots` (58)

- `docs/screenshots/cross-browser-2026-10-07/firefox-kings.png` (A)
- `docs/screenshots/cross-browser-2026-10-07/firefox-landing.png` (A)
- `docs/screenshots/cross-browser-2026-10-07/ipad-webkit-kings.png` (A)
- `docs/screenshots/cross-browser-2026-10-07/ipad-webkit-landing.png` (A)
- `docs/screenshots/cross-browser-2026-10-07/webkit-kings.png` (A)
- `docs/screenshots/cross-browser-2026-10-07/webkit-landing.png` (A)
- `docs/screenshots/mp3d/fiar-3d-mid.png` (M)
- `docs/screenshots/mp3d/fiar-3d-start.png` (M)
- `docs/screenshots/mp3d/hex-a-gone-3d-gameover-phone.png` (M)
- `docs/screenshots/mp3d/hex-a-gone-3d-gameover-tablet-landscape.png` (M)
- `docs/screenshots/mp3d/hex-a-gone-3d-gameover-tablet-portrait.png` (M)
- `docs/screenshots/mp3d/hex-a-gone-3d-mid-phone.png` (M)
- `docs/screenshots/mp3d/hex-a-gone-3d-mid-tablet-landscape.png` (M)
- `docs/screenshots/mp3d/hex-a-gone-3d-mid-tablet-portrait.png` (M)
- `docs/screenshots/mp3d/hex-a-gone-3d-start-phone.png` (M)
- `docs/screenshots/mp3d/hex-a-gone-3d-start-tablet-landscape.png` (M)
- `docs/screenshots/mp3d/hex-a-gone-3d-start-tablet-portrait.png` (M)
- `docs/screenshots/mp3d/kings-quadraphages-3d-midgame.png` (M)
- `docs/screenshots/mp3d/kings-quadraphages-3d-start.png` (M)
- `docs/screenshots/mp3d/kwatro-sinko-2d-before-desktop.png` (M)
- `docs/screenshots/mp3d/kwatro-sinko-2d-before-tablet.png` (M)
- `docs/screenshots/mp3d/kwatro-sinko-3d-mid-desktop.png` (M)
- `docs/screenshots/mp3d/kwatro-sinko-3d-mid-tablet.png` (M)
- `docs/screenshots/mp3d/pent-em-in-3d-gameover-phone.png` (M)
- `docs/screenshots/mp3d/pent-em-in-3d-mid-phone.png` (M)
- `docs/screenshots/mp3d/pent-em-in-3d-mid-tablet-landscape.png` (M)
- `docs/screenshots/mp3d/pent-em-in-3d-mid-tablet-portrait.png` (M)
- `docs/screenshots/mp3d/pent-em-in-3d-midgame.png` (M)
- `docs/screenshots/mp3d/pent-em-in-3d-start-phone.png` (M)
- `docs/screenshots/mp3d/pent-em-in-3d-start-tablet-landscape.png` (M)
- `docs/screenshots/mp3d/pent-em-in-3d-start-tablet-portrait.png` (M)
- `docs/screenshots/mp3d/pent-em-in-3d-start.png` (M)
- `docs/screenshots/mp3d/queens-guards-2d-restore-done-phone.png` (M)
- `docs/screenshots/mp3d/queens-guards-3d-gameover-phone.png` (M)
- `docs/screenshots/mp3d/queens-guards-3d-gameover-tablet-landscape.png` (M)
- `docs/screenshots/mp3d/queens-guards-3d-gameover-tablet-portrait.png` (M)
- `docs/screenshots/mp3d/queens-guards-3d-gameover.png` (M)
- `docs/screenshots/mp3d/queens-guards-3d-midgame-phone.png` (M)
- `docs/screenshots/mp3d/queens-guards-3d-midgame-tablet-landscape.png` (M)
- `docs/screenshots/mp3d/queens-guards-3d-midgame-tablet-portrait.png` (M)
- `docs/screenshots/mp3d/queens-guards-3d-midgame.png` (M)
- `docs/screenshots/mp3d/queens-guards-3d-restore-done-phone.png` (M)
- `docs/screenshots/mp3d/queens-guards-3d-restore-done-tablet-portrait.png` (M)
- `docs/screenshots/mp3d/queens-guards-3d-restore-pending-phone.png` (M)
- `docs/screenshots/mp3d/queens-guards-3d-restore-pending-tablet-portrait.png` (M)
- `docs/screenshots/mp3d/queens-guards-3d-start-phone.png` (M)
- `docs/screenshots/mp3d/queens-guards-3d-start-tablet-landscape.png` (M)
- `docs/screenshots/mp3d/queens-guards-3d-start-tablet-portrait.png` (M)
- `docs/screenshots/mp3d/queens-guards-3d-start.png` (M)
- `docs/screenshots/mp3d/star-track-3d-gameover-phone.png` (M)
- `docs/screenshots/mp3d/star-track-3d-gameover-tablet-landscape.png` (M)
- `docs/screenshots/mp3d/star-track-3d-gameover-tablet-portrait.png` (M)
- `docs/screenshots/mp3d/star-track-3d-mid-phone.png` (M)
- `docs/screenshots/mp3d/star-track-3d-mid-tablet-landscape.png` (M)
- `docs/screenshots/mp3d/star-track-3d-mid-tablet-portrait.png` (M)
- `docs/screenshots/mp3d/star-track-3d-start-phone.png` (M)
- `docs/screenshots/mp3d/star-track-3d-start-tablet-landscape.png` (M)
- `docs/screenshots/mp3d/star-track-3d-start-tablet-portrait.png` (M)

#### `docs/sr-semantics-audit-2026-10-08.md` (1)

- `docs/sr-semantics-audit-2026-10-08.md` (A)

#### `docs/state-roundtrip-2026-10-07.md` (1)

- `docs/state-roundtrip-2026-10-07.md` (A)

#### `docs/tutorial-engine-mismatches-2026-10-07.md` (1)

- `docs/tutorial-engine-mismatches-2026-10-07.md` (A)

#### `docs/undo-audit-2026-10-07.md` (1)

- `docs/undo-audit-2026-10-07.md` (A)

#### `docs/unit-flakes-2026-10-07.md` (1)

- `docs/unit-flakes-2026-10-07.md` (A)

#### `docs/visual-regression.md` (1)

- `docs/visual-regression.md` (A)

#### `docs/web-security-burn-1008-sinks.md` (1)

- `docs/web-security-burn-1008-sinks.md` (A)

#### `docs/webkit-offline-pwa-2026-10-07.md` (1)

- `docs/webkit-offline-pwa-2026-10-07.md` (A)

#### `docs/wiki` (15)

- `docs/wiki/README.md` (M)
- `docs/wiki/accessibility.md` (M)
- `docs/wiki/adding-a-game.md` (A)
- `docs/wiki/architecture.md` (A)
- `docs/wiki/development.md` (M)
- `docs/wiki/game-registry.md` (A)
- `docs/wiki/games.md` (M)
- `docs/wiki/images/hex-board.png` (A)
- `docs/wiki/images/hex-new-game-modal.png` (A)
- `docs/wiki/images/hex-shell.png` (A)
- `docs/wiki/images/kings-board.png` (A)
- `docs/wiki/images/landing-full.png` (A)
- `docs/wiki/images/landing.png` (A)
- `docs/wiki/images/stats-progress.png` (A)
- `docs/wiki/overview.md` (M)

#### `docs/zoom-reflow-2026-10-08.md` (1)

- `docs/zoom-reflow-2026-10-08.md` (A)

#### `eslint.config.js` (1)

- `eslint.config.js` (M)

#### `index.html` (1)

- `index.html` (M)

#### `package-lock.json` (1)

- `package-lock.json` (M)

#### `package.json` (1)

- `package.json` (M)

#### `playwright.config.ts` (1)

- `playwright.config.ts` (M)

#### `playwright.gallery.config.ts` (1)

- `playwright.gallery.config.ts` (A)

#### `playwright.visual.config.ts` (1)

- `playwright.visual.config.ts` (A)

#### `public` (2)

- `public/_headers` (M)
- `public/king.svg` (D)

#### `scripts` (24)

- `scripts/calla-deep-playtest.mjs` (A)
- `scripts/capture-gallery.spec.ts` (A)
- `scripts/check-boundaries.mjs` (A)
- `scripts/check-bundle-budgets.mjs` (A)
- `scripts/check-dev-doc-links.mjs` (A)
- `scripts/check-lint-ratchet.mjs` (A)
- `scripts/check-perf.mjs` (A)
- `scripts/check-type-ratchet.mjs` (A)
- `scripts/console-sweep.mjs` (A)
- `scripts/memory-leak-audit.mjs` (A)
- `scripts/mobile-audit.mjs` (A)
- `scripts/mutation-report.mjs` (A)
- `scripts/nav-away-sweep.mjs` (A)
- `scripts/par-55-deep-playtest.mjs` (A)
- `scripts/probe-offline-resilience-dev.mjs` (A)
- `scripts/probe-offline-resilience.mjs` (A)
- `scripts/ramrod-deep-playtest.mjs` (A)
- `scripts/render-perf-mode.mjs` (A)
- `scripts/render-perf.mjs` (A)
- `scripts/run-ai-calibration.ts` (A)
- `scripts/runtime-perf.mjs` (A)
- `scripts/stars-bars-deep-playtest.mjs` (A)
- `scripts/sum-dominoes-deep-playtest.mjs` (A)
- `scripts/webkit-offline-probe.mjs` (A)

#### `src/core` (41)

- `src/core/.gitkeep` (D)
- `src/core/alignment/compat.ts` (M)
- `src/core/alignment/contiguous.ts` (M)
- `src/core/alignment/grid-alignment.ts` (M)
- `src/core/alignment/highlight-ui.ts` (M)
- `src/core/attributes/attribute-ui.ts` (M)
- `src/core/attributes/logic.ts` (M)
- `src/core/attributes/types.ts` (M)
- `src/core/dice/dice-selector.ts` (M)
- `src/core/dice/dice-ui.ts` (M)
- `src/core/dice/roller.ts` (M)
- `src/core/dom-security.ts` (A)
- `src/core/expressions/evaluator.ts` (M)
- `src/core/expressions/expression-ui.ts` (M)
- `src/core/expressions/types.ts` (M)
- `src/core/feature-flags.ts` (M)
- `src/core/fractions/arithmetic.ts` (M)
- `src/core/fractions/fraction-bar-ui.ts` (M)
- `src/core/graph/algorithms.ts` (M)
- `src/core/graph/graph-ui.ts` (M)
- `src/core/graph/types.ts` (M)
- `src/core/hex/coordinates.ts` (M)
- `src/core/hex/hex-ui.ts` (M)
- `src/core/hex/types.ts` (M)
- `src/core/owl/ollie-inspect-map.ts` (M)
- `src/core/owl/owl-messages.ts` (M)
- `src/core/owl/owl-system.ts` (M)
- `src/core/polyomino/placement.ts` (M)
- `src/core/polyomino/polyomino-ui.ts` (M)
- `src/core/polyomino/transform.ts` (M)
- `src/core/router.ts` (M)
- `src/core/seats.ts` (A)
- `src/core/security-headers.ts` (A)
- `src/core/settings-flags.ts` (A)
- `src/core/storage/index.ts` (M)
- `src/core/storage/migrate.ts` (A)
- `src/core/storage/sanitize.ts` (A)
- `src/core/storage/storage.ts` (M)
- `src/core/timer-scoring.ts` (M)
- `src/core/tutorial.ts` (M)
- `src/core/url-flags.ts` (A)

#### `src/demos` (7)

- `src/demos/alignment-demo.ts` (M)
- `src/demos/attribute-demo.ts` (M)
- `src/demos/dice-demo.ts` (M)
- `src/demos/expression-demo.ts` (M)
- `src/demos/fraction-demo.ts` (M)
- `src/demos/graph-demo.ts` (M)
- `src/demos/polyomino-demo.ts` (M)

#### `src/games/* (non-finding)` (76)

- `src/games/calla/ai.ts` (M) — ai.ts import-type / curly-only vs alpha — no search/scoring/difficulty/timing delta detected
- `src/games/calla/types.ts` (M)
- `src/games/contig-60/board-ui.ts` (M)
- `src/games/contig-60/rules.ts` (M)
- `src/games/contig-60/types.ts` (M)
- `src/games/fab-a-diffy/ai.ts` (M) — ai.ts import-type / curly-only vs alpha — no search/scoring/difficulty/timing delta detected
- `src/games/fab-a-diffy/board-ui.ts` (M)
- `src/games/fab-a-diffy/rules.ts` (M)
- `src/games/fab-a-diffy/types.ts` (M)
- `src/games/fiar/ai.ts` (M) — ai.ts import-type / curly-only vs alpha — no search/scoring/difficulty/timing delta detected
- `src/games/fiar/board-ui.ts` (M)
- `src/games/fiar/game-controller.ts` (M)
- `src/games/fiar/layout.ts` (M)
- `src/games/fiar/rules.ts` (M)
- `src/games/fiar/types.ts` (M)
- `src/games/frac-fact/ai.ts` (M) — ai.ts import-type / curly-only vs alpha — no search/scoring/difficulty/timing delta detected
- `src/games/frac-fact/board-ui.ts` (M)
- `src/games/frac-fact/game-controller.ts` (M)
- `src/games/frac-fact/rules.ts` (M)
- `src/games/frac-fact/types.ts` (M)
- `src/games/fraction-pinball/ai.ts` (M) — ai.ts import-type / curly-only vs alpha — no search/scoring/difficulty/timing delta detected
- `src/games/fraction-pinball/rules.ts` (M)
- `src/games/fraction-pinball/types.ts` (M)
- `src/games/hex-a-gone/ai.ts` (M) — ai.ts import-type / curly-only vs alpha — no search/scoring/difficulty/timing delta detected
- `src/games/hex-a-gone/board-ui.ts` (M)
- `src/games/hex-a-gone/index.ts` (D)
- `src/games/hex-a-gone/rules.ts` (M)
- `src/games/hex-a-gone/types.ts` (M)
- `src/games/hex/ai-client.ts` (M)
- `src/games/hex/rules.ts` (M)
- `src/games/hex/types.ts` (M)
- `src/games/juggle/ai.ts` (M) — ai.ts import-type / curly-only vs alpha — no search/scoring/difficulty/timing delta detected
- `src/games/juggle/game-controller.ts` (M)
- `src/games/juggle/rules.ts` (M)
- `src/games/juggle/types.ts` (M)
- `src/games/kings-quadraphages/board-renderer.ts` (M)
- `src/games/kings-quadraphages/board.ts` (M)
- `src/games/kings-quadraphages/game-state.ts` (M)
- `src/games/kings-quadraphages/rules.ts` (M)
- `src/games/kings-quadraphages/serialization.ts` (M)
- `src/games/kwatro-sinko/board-ui.ts` (M)
- `src/games/kwatro-sinko/game-controller.ts` (M)
- `src/games/kwatro-sinko/rules.ts` (M)
- `src/games/kwatro-sinko/types.ts` (M)
- `src/games/par-55/ai.ts` (M) — ai.ts import-type / curly-only vs alpha — no search/scoring/difficulty/timing delta detected
- `src/games/par-55/board-ui.ts` (M)
- `src/games/par-55/rules.ts` (M)
- `src/games/par-55/types.ts` (M)
- `src/games/pent-em-in/ai.ts` (M) — ai.ts import-type / curly-only vs alpha — no search/scoring/difficulty/timing delta detected
- `src/games/pent-em-in/rules.ts` (M)
- `src/games/pent-em-in/types.ts` (M)
- `src/games/prime-gold/ai.ts` (M) — ai.ts import-type / curly-only vs alpha — no search/scoring/difficulty/timing delta detected
- `src/games/prime-gold/board-ui.ts` (M)
- `src/games/prime-gold/game-controller.ts` (M)
- `src/games/prime-gold/rules.ts` (M)
- `src/games/queens-guards/board-ui.ts` (M)
- `src/games/queens-guards/rules.ts` (M)
- `src/games/queens-guards/types.ts` (M)
- `src/games/ramrod/ai.ts` (M) — ai.ts import-type / curly-only vs alpha — no search/scoring/difficulty/timing delta detected
- `src/games/ramrod/board-ui.ts` (M)
- `src/games/ramrod/rules.ts` (M)
- `src/games/ramrod/types.ts` (M)
- `src/games/remainder-islands/ai.ts` (M) — ai.ts import-type / curly-only vs alpha — no search/scoring/difficulty/timing delta detected
- `src/games/remainder-islands/board-ui.ts` (M)
- `src/games/remainder-islands/game-controller.ts` (M)
- `src/games/remainder-islands/rules.ts` (M)
- `src/games/remainder-islands/types.ts` (M)
- `src/games/star-track/ai.ts` (M) — ai.ts import-type / curly-only vs alpha — no search/scoring/difficulty/timing delta detected
- `src/games/star-track/rules.ts` (M)
- `src/games/star-track/types.ts` (M)
- `src/games/stars-bars/ai.ts` (M) — ai.ts import-type / curly-only vs alpha — no search/scoring/difficulty/timing delta detected
- `src/games/stars-bars/rules.ts` (M)
- `src/games/sum-dominoes/ai.ts` (M) — ai.ts import-type / curly-only vs alpha — no search/scoring/difficulty/timing delta detected
- `src/games/sum-dominoes/board-ui.ts` (M)
- `src/games/sum-dominoes/rules.ts` (M)
- `src/games/sum-dominoes/types.ts` (M)

#### `src/main.ts` (1)

- `src/main.ts` (M)

#### `src/pwa` (3)

- `src/pwa/bootstrap.ts` (M)
- `src/pwa/idle-warm.ts` (M)
- `src/pwa/register.ts` (M)

#### `src/style.css` (1)

- `src/style.css` (M)

#### `src/ui` (31)

- `src/ui/board-a11y.ts` (M)
- `src/ui/components/.gitkeep` (D)
- `src/ui/components/game-shell.ts` (M)
- `src/ui/die-faces.ts` (A)
- `src/ui/game-error-boundary.ts` (A)
- `src/ui/game-loading.ts` (M)
- `src/ui/game-prefetch.ts` (M)
- `src/ui/game-route-mounts.ts` (A)
- `src/ui/game-selector.ts` (M)
- `src/ui/hex-svg.ts` (A)
- `src/ui/inject-styles.ts` (A)
- `src/ui/owl/owl-component.ts` (M)
- `src/ui/player-colors.ts` (M)
- `src/ui/reduced-motion.ts` (M)
- `src/ui/seat-labels.ts` (A)
- `src/ui/stats-dashboard.ts` (M)
- `src/ui/styles/.gitkeep` (D)
- `src/ui/styles/game-play.css` (A)
- `src/ui/styles/mobile-play-shell.css` (M)
- `src/ui/styles/stats-dashboard.css` (M)
- `src/ui/styles/zoom-reflow.css` (A)
- `src/ui/three/fiar-board-3d.ts` (M)
- `src/ui/three/hex-a-gone-board-3d.ts` (M)
- `src/ui/three/kings-quadraphages-board-3d.ts` (M)
- `src/ui/three/kwatro-sinko-board-3d.ts` (M)
- `src/ui/three/pent-em-in-board-3d.ts` (M)
- `src/ui/three/prime-gold-board-3d.ts` (M)
- `src/ui/three/queens-guards-board-3d.ts` (M)
- `src/ui/three/star-track-board-3d.ts` (M)
- `src/ui/three/tablet-gl.ts` (M)
- `src/ui/timeout-handle.ts` (A)

#### `tests/bench` (1)

- `tests/bench/engines-rules.bench.ts` (A)

#### `tests/e2e` (103)

- `tests/e2e/.gitkeep` (D)
- `tests/e2e/a11y-axe.spec.ts` (A)
- `tests/e2e/a11y-reduced-motion.spec.ts` (A)
- `tests/e2e/a11y-sweep.spec.ts` (A)
- `tests/e2e/bug-guards.spec.ts` (M)
- `tests/e2e/calla-deep.spec.ts` (A)
- `tests/e2e/chunk-load-retry.spec.ts` (A)
- `tests/e2e/console-clean-on-load.spec.ts` (A)
- `tests/e2e/contig-60-playability.spec.ts` (A)
- `tests/e2e/fab-a-diffy-playability.spec.ts` (A)
- `tests/e2e/fixtures.ts` (A)
- `tests/e2e/fraction-pinball-deep.spec.ts` (A)
- `tests/e2e/fullgame/_drivers.ts` (A)
- `tests/e2e/fullgame/_harness.ts` (A)
- `tests/e2e/fullgame/_helpers.ts` (A)
- `tests/e2e/fullgame/calla.spec.ts` (A)
- `tests/e2e/fullgame/contig-60.spec.ts` (A)
- `tests/e2e/fullgame/fab-a-diffy.spec.ts` (A)
- `tests/e2e/fullgame/fiar.spec.ts` (A)
- `tests/e2e/fullgame/frac-fact.spec.ts` (A)
- `tests/e2e/fullgame/fraction-pinball.spec.ts` (A)
- `tests/e2e/fullgame/hex-a-gone.spec.ts` (A)
- `tests/e2e/fullgame/hex.spec.ts` (A)
- `tests/e2e/fullgame/juggle.spec.ts` (A)
- `tests/e2e/fullgame/kings-quadraphages.spec.ts` (A)
- `tests/e2e/fullgame/kwatro-sinko.spec.ts` (A)
- `tests/e2e/fullgame/par-55.spec.ts` (A)
- `tests/e2e/fullgame/pent-em-in.spec.ts` (A)
- `tests/e2e/fullgame/prime-gold.spec.ts` (A)
- `tests/e2e/fullgame/queens-guards.spec.ts` (A)
- `tests/e2e/fullgame/ramrod.spec.ts` (A)
- `tests/e2e/fullgame/remainder-islands.spec.ts` (A)
- `tests/e2e/fullgame/star-track.spec.ts` (A)
- `tests/e2e/fullgame/stars-bars.spec.ts` (A)
- `tests/e2e/fullgame/sum-dominoes.spec.ts` (A)
- `tests/e2e/helpers/mp3d.ts` (A)
- `tests/e2e/helpers/stability.ts` (A)
- `tests/e2e/helpers/visual-stability.ts` (A)
- `tests/e2e/hex-deep-playability.spec.ts` (A)
- `tests/e2e/keyboard-a11y.spec.ts` (A)
- `tests/e2e/keyboard-only.spec.ts` (A)
- `tests/e2e/kings-deep-playability.spec.ts` (A)
- `tests/e2e/mobile-touch-smoke.spec.ts` (A)
- `tests/e2e/mp3d-fiar-board3d.spec.ts` (M)
- `tests/e2e/mp3d-hex-a-gone-board3d.spec.ts` (M)
- `tests/e2e/mp3d-kings-board3d.spec.ts` (M)
- `tests/e2e/mp3d-kwatro-sinko-board3d.spec.ts` (M)
- `tests/e2e/mp3d-pent-em-in-board3d.spec.ts` (M)
- `tests/e2e/mp3d-prime-gold-board3d.spec.ts` (M)
- `tests/e2e/mp3d-queens-guards-board3d.spec.ts` (M)
- `tests/e2e/mp3d-star-track-board3d.spec.ts` (M)
- `tests/e2e/offline-pwa.spec.ts` (M)
- `tests/e2e/par-55-playability.spec.ts` (A)
- `tests/e2e/pent-em-in-place-ux.spec.ts` (A)
- `tests/e2e/queens-guards-playability.spec.ts` (A)
- `tests/e2e/ramrod-deep.spec.ts` (A)
- `tests/e2e/smoke.spec.ts` (M)
- `tests/e2e/stars-bars-deep.spec.ts` (A)
- `tests/e2e/sum-dominoes-deep.spec.ts` (A)
- `tests/e2e/visual-baseline.spec.ts` (A)
- `tests/e2e/visual-baselines/visual-desktop/visual-baseline.spec.ts/calla-opening.png` (A)
- `tests/e2e/visual-baselines/visual-desktop/visual-baseline.spec.ts/contig-60-opening.png` (A)
- `tests/e2e/visual-baselines/visual-desktop/visual-baseline.spec.ts/fab-a-diffy-opening.png` (A)
- `tests/e2e/visual-baselines/visual-desktop/visual-baseline.spec.ts/fiar-opening.png` (A)
- `tests/e2e/visual-baselines/visual-desktop/visual-baseline.spec.ts/frac-fact-opening.png` (A)
- `tests/e2e/visual-baselines/visual-desktop/visual-baseline.spec.ts/fraction-pinball-opening.png` (A)
- `tests/e2e/visual-baselines/visual-desktop/visual-baseline.spec.ts/hex-a-gone-opening.png` (A)
- `tests/e2e/visual-baselines/visual-desktop/visual-baseline.spec.ts/hex-opening.png` (A)
- `tests/e2e/visual-baselines/visual-desktop/visual-baseline.spec.ts/juggle-opening.png` (A)
- `tests/e2e/visual-baselines/visual-desktop/visual-baseline.spec.ts/kings-quadraphages-opening.png` (A)
- `tests/e2e/visual-baselines/visual-desktop/visual-baseline.spec.ts/kwatro-sinko-opening.png` (A)
- `tests/e2e/visual-baselines/visual-desktop/visual-baseline.spec.ts/par-55-opening.png` (A)
- `tests/e2e/visual-baselines/visual-desktop/visual-baseline.spec.ts/pent-em-in-opening.png` (A)
- `tests/e2e/visual-baselines/visual-desktop/visual-baseline.spec.ts/prime-gold-opening.png` (A)
- `tests/e2e/visual-baselines/visual-desktop/visual-baseline.spec.ts/queens-guards-opening.png` (A)
- `tests/e2e/visual-baselines/visual-desktop/visual-baseline.spec.ts/ramrod-opening.png` (A)
- `tests/e2e/visual-baselines/visual-desktop/visual-baseline.spec.ts/remainder-islands-opening.png` (A)
- `tests/e2e/visual-baselines/visual-desktop/visual-baseline.spec.ts/star-track-opening.png` (A)
- `tests/e2e/visual-baselines/visual-desktop/visual-baseline.spec.ts/stars-bars-opening.png` (A)
- `tests/e2e/visual-baselines/visual-desktop/visual-baseline.spec.ts/start-screen.png` (A)
- `tests/e2e/visual-baselines/visual-desktop/visual-baseline.spec.ts/sum-dominoes-opening.png` (A)
- `tests/e2e/visual-baselines/visual-phone/visual-baseline.spec.ts/calla-opening.png` (A)
- `tests/e2e/visual-baselines/visual-phone/visual-baseline.spec.ts/contig-60-opening.png` (A)
- `tests/e2e/visual-baselines/visual-phone/visual-baseline.spec.ts/fab-a-diffy-opening.png` (A)
- `tests/e2e/visual-baselines/visual-phone/visual-baseline.spec.ts/fiar-opening.png` (A)
- `tests/e2e/visual-baselines/visual-phone/visual-baseline.spec.ts/frac-fact-opening.png` (A)
- `tests/e2e/visual-baselines/visual-phone/visual-baseline.spec.ts/fraction-pinball-opening.png` (A)
- `tests/e2e/visual-baselines/visual-phone/visual-baseline.spec.ts/hex-a-gone-opening.png` (A)
- `tests/e2e/visual-baselines/visual-phone/visual-baseline.spec.ts/hex-opening.png` (A)
- `tests/e2e/visual-baselines/visual-phone/visual-baseline.spec.ts/juggle-opening.png` (A)
- `tests/e2e/visual-baselines/visual-phone/visual-baseline.spec.ts/kings-quadraphages-opening.png` (A)
- `tests/e2e/visual-baselines/visual-phone/visual-baseline.spec.ts/kwatro-sinko-opening.png` (A)
- `tests/e2e/visual-baselines/visual-phone/visual-baseline.spec.ts/par-55-opening.png` (A)
- `tests/e2e/visual-baselines/visual-phone/visual-baseline.spec.ts/pent-em-in-opening.png` (A)
- `tests/e2e/visual-baselines/visual-phone/visual-baseline.spec.ts/prime-gold-opening.png` (A)
- `tests/e2e/visual-baselines/visual-phone/visual-baseline.spec.ts/queens-guards-opening.png` (A)
- `tests/e2e/visual-baselines/visual-phone/visual-baseline.spec.ts/ramrod-opening.png` (A)
- `tests/e2e/visual-baselines/visual-phone/visual-baseline.spec.ts/remainder-islands-opening.png` (A)
- `tests/e2e/visual-baselines/visual-phone/visual-baseline.spec.ts/star-track-opening.png` (A)
- `tests/e2e/visual-baselines/visual-phone/visual-baseline.spec.ts/stars-bars-opening.png` (A)
- `tests/e2e/visual-baselines/visual-phone/visual-baseline.spec.ts/start-screen.png` (A)
- `tests/e2e/visual-baselines/visual-phone/visual-baseline.spec.ts/sum-dominoes-opening.png` (A)
- `tests/e2e/zoom-reflow-a11y.spec.ts` (A)

#### `tests/fixtures` (11)

- `tests/fixtures/storage/README.md` (A)
- `tests/fixtures/storage/kings/v0-unsupported.json` (A)
- `tests/fixtures/storage/kings/v1-midgame.json` (A)
- `tests/fixtures/storage/progress/hostile-profile-control-chars.json` (A)
- `tests/fixtures/storage/progress/missing-version-partial-settings.json` (A)
- `tests/fixtures/storage/progress/non-object-root.json` (A)
- `tests/fixtures/storage/progress/truncated-object.txt` (A)
- `tests/fixtures/storage/progress/v0-full-fields.json` (A)
- `tests/fixtures/storage/progress/v0-sparse-pre-settings.json` (A)
- `tests/fixtures/storage/progress/v1-canonical-full.json` (A)
- `tests/fixtures/storage/progress/wrong-typed-fields.json` (A)

#### `tests/helpers` (4)

- `tests/helpers/ai-calibration/games.ts` (A)
- `tests/helpers/ai-calibration/matrix.ts` (A)
- `tests/helpers/ai-calibration/rng.ts` (A)
- `tests/helpers/ai-calibration/types.ts` (A)

#### `tests/playtest` (2)

- `tests/playtest/fab-a-diffy-deep.mjs` (A)
- `tests/playtest/star-track-deep-playtest.mjs` (A)

#### `tests/unit` (218)

- `tests/unit/.gitkeep` (D)
- `tests/unit/_app-css.ts` (A)
- `tests/unit/a11y-reduced-motion-contrast.test.ts` (A)
- `tests/unit/a11y-shell-menu-keepers.test.ts` (M)
- `tests/unit/a11y-shell.test.ts` (M)
- `tests/unit/ai-calibration-difficulty-order.test.ts` (A)
- `tests/unit/ai-determinism-harness.ts` (A)
- `tests/unit/ai-determinism-helpers.ts` (A)
- `tests/unit/ai-determinism-shard-a.test.ts` (A)
- `tests/unit/ai-determinism-shard-b.test.ts` (A)
- `tests/unit/ai-determinism-shard-c.test.ts` (A)
- `tests/unit/ai-determinism-shard-d.test.ts` (A)
- `tests/unit/ai-determinism-shard-e.test.ts` (A)
- `tests/unit/ai-hard-midgame-identity.test.ts` (A)
- `tests/unit/ai-move-time-midgame.bench.test.ts` (A)
- `tests/unit/ai-worker-parity-fab.test.ts` (M)
- `tests/unit/ai-worker-parity-queens-hex.test.ts` (M)
- `tests/unit/bundle-budget-check.test.ts` (A)
- `tests/unit/burn-1007-game-route-mounts.test.ts` (A)
- `tests/unit/burn-1007-main-shell-routes.test.ts` (A)
- `tests/unit/burn-1007-pwa-shell-ui.test.ts` (A)
- `tests/unit/burn-1008-registry-module-contract.test.ts` (A)
- `tests/unit/burn-wave10-secondary-ui.test.ts` (M)
- `tests/unit/burn-wave16-ai-pipeline.test.ts` (M)
- `tests/unit/burn-wave19-controller-persist.test.ts` (M)
- `tests/unit/burn-wave2-dom-ai.test.ts` (M)
- `tests/unit/burn-wave24-stats-selector-ui.test.ts` (M)
- `tests/unit/burn-wave25-a11y-game-wiring.test.ts` (M)
- `tests/unit/burn-wave25-a11y-labels.test.ts` (M)
- `tests/unit/burn-wave33-graph-ui-animate-raf.test.ts` (M)
- `tests/unit/burn-wave34-graph-ui-animate-compose.test.ts` (M)
- `tests/unit/burn-wave40-graph-ui-animate-legend.test.ts` (M)
- `tests/unit/burn-wave40-graph-ui-legend-valids-animate.test.ts` (M)
- `tests/unit/burn-wave41-fab-ai-execute-steps.test.ts` (M)
- `tests/unit/burn-wave43-fab-ai-execute-difficulties.test.ts` (M)
- `tests/unit/burn-wave44-fab-ai-apply-selectbar2-fail.test.ts` (M)
- `tests/unit/burn-wave44-fab-ai-apply-selectop-fail.test.ts` (M)
- `tests/unit/burn-wave44-fab-ai-apply-wrong-phase.test.ts` (M)
- `tests/unit/burn-wave44-fab-ai-easy-teaching-branch.test.ts` (M)
- `tests/unit/burn-wave44-fab-ai-medium-random-top3.test.ts` (M)
- `tests/unit/burn-wave49-kings-render-board-supply.test.ts` (M)
- `tests/unit/calla-deep-playability-2026-10-07.test.ts` (A)
- `tests/unit/contig-60-ai-seat-input-lock.test.ts` (M)
- `tests/unit/contig-60-ai-timer-generation.test.ts` (A)
- `tests/unit/contig-60-deep-playtest-ux.test.ts` (A)
- `tests/unit/destroy-game-cleanup.test.ts` (A)
- `tests/unit/dom-security.test.ts` (A)
- `tests/unit/durable-progress-persistence.test.ts` (A)
- `tests/unit/e2e-3d-timeout-config.test.ts` (A)
- `tests/unit/engine-coverage-calla-targeted.test.ts` (A)
- `tests/unit/engine-coverage-fiar-targeted.test.ts` (A)
- `tests/unit/engine-coverage-fraction-pinball-targeted.test.ts` (A)
- `tests/unit/engine-coverage-hex-a-gone-targeted.test.ts` (A)
- `tests/unit/engine-coverage-invariants-2026-10-07.test.ts` (A)
- `tests/unit/engine-coverage-kings-quadraphages-targeted.test.ts` (A)
- `tests/unit/engine-coverage-kwatro-sinko-targeted.test.ts` (A)
- `tests/unit/engine-coverage-par-55-targeted.test.ts` (A)
- `tests/unit/engine-coverage-queens-guards-targeted.test.ts` (A)
- `tests/unit/engine-coverage-ramrod-targeted.test.ts` (A)
- `tests/unit/engine-edge-cases-2026-10-07.test.ts` (A)
- `tests/unit/engine-invariants-helpers.ts` (A)
- `tests/unit/engine-property-invariants.test.ts` (A)
- `tests/unit/engines-plain-node-load.test.ts` (A)
- `tests/unit/fab-a-diffy-ai-play-deadline.test.ts` (M)
- `tests/unit/fab-a-diffy-ai.test.ts` (M)
- `tests/unit/fab-a-diffy-playability-polish.test.ts` (A)
- `tests/unit/fiar-ai-null-draw-recovery.test.ts` (M)
- `tests/unit/frac-calla-playability-polish.test.ts` (M)
- `tests/unit/fraction-pinball-deep-playability.test.ts` (A)
- `tests/unit/fraction-pinball-neg-balls-repro.test.ts` (A)
- `tests/unit/fullgame-ci-report-only.test.ts` (A)
- `tests/unit/game-error-boundary.test.ts` (A)
- `tests/unit/helpers/ai-search-fast.ts` (A)
- `tests/unit/helpers/engine-property-invariants.ts` (A)
- `tests/unit/helpers/node-storage-polyfill.ts` (A)
- `tests/unit/helpers/state-roundtrip-games.ts` (A)
- `tests/unit/helpers/state-roundtrip.ts` (A)
- `tests/unit/hex-deep-playability.test.ts` (A) — Locks Hex Hard assert at 450 (compliant with hard hold); related to AI timing change in src
- `tests/unit/hex-queens-kings-touch-reduced-motion.test.ts` (M)
- `tests/unit/hex-touch-reduced-motion.test.ts` (M)
- `tests/unit/idle-warm-bootstrap-owl.test.ts` (M)
- `tests/unit/input-race-fiar-opening-ai-timer.test.ts` (A)
- `tests/unit/input-race-prime-gold-newgame-timer.test.ts` (A)
- `tests/unit/input-race-remainder-roll-double-click.test.ts` (A)
- `tests/unit/input-race-star-track-click-through.test.ts` (A)
- `tests/unit/juggle-placement-escape.test.ts` (A)
- `tests/unit/keyboard-a11y-game-selector.test.ts` (A)
- `tests/unit/keyboard-a11y-shell-modals.test.ts` (A)
- `tests/unit/keyboard-sr-modal-focus-trap.test.ts` (A)
- `tests/unit/kings-deep-playability.test.ts` (A)
- `tests/unit/kwatro-sinko-ai-long-game-completion.test.ts` (A)
- `tests/unit/kwatro-sinko-end-rules-375.test.ts` (M)
- `tests/unit/memory-leak-hygiene.test.ts` (A)
- `tests/unit/mobile-touch-ci-report-only.test.ts` (A)
- `tests/unit/mocks/virtual-pwa-register.ts` (A)
- `tests/unit/mp3d-kings-board-3d-lifecycle.test.ts` (M)
- `tests/unit/mp3d-queens-guards-board-3d-lifecycle.test.ts` (M)
- `tests/unit/mutation-frac-fact-rules.test.ts` (A)
- `tests/unit/mutation-fraction-pinball-rules.test.ts` (A)
- `tests/unit/mutation-par-55-rules.test.ts` (A)
- `tests/unit/mutation-ramrod-rules.test.ts` (A)
- `tests/unit/mutation-sum-dominoes-rules.test.ts` (A)
- `tests/unit/overnight-demo-alignment-win-reset.test.ts` (M)
- `tests/unit/overnight-demo-attribute-filter-set.test.ts` (M)
- `tests/unit/overnight-demo-dice-roll-exhaust.test.ts` (M)
- `tests/unit/overnight-demo-empty-remount.test.ts` (M)
- `tests/unit/overnight-demo-expression-solver-edges.test.ts` (M)
- `tests/unit/overnight-demo-fraction-op-compare.test.ts` (M)
- `tests/unit/overnight-demo-graph-path-clear.test.ts` (M)
- `tests/unit/overnight-demos46-expr-challenge-correct-alert.test.ts` (M)
- `tests/unit/overnight-fab-ai-difficulties-gates.test.ts` (M)
- `tests/unit/overnight-fab-ai-randomness-medium.test.ts` (M)
- `tests/unit/overnight-on20260926-unit-timeout-ci-honesty.test.ts` (M)
- `tests/unit/overnight-wave50-calla-board-pit-aria-click.test.ts` (M)
- `tests/unit/overnight-wave50-calla-controller-ai-timer.test.ts` (M)
- `tests/unit/overnight-wave50-calla-status-winners.test.ts` (M)
- `tests/unit/overnight-wave51-demos-expr-challenge-correct-alert-226.test.ts` (M)
- `tests/unit/overnight-wave52-star-status-you-ai-wins.test.ts` (M)
- `tests/unit/overnight-wave54-fab-ai-hard-randomness.test.ts` (M)
- `tests/unit/overnight-wave54-fiar-tutorial-blocking-complete.test.ts` (M)
- `tests/unit/overnight-wave54-frac-tutorial-copy-catalog.test.ts` (M)
- `tests/unit/overnight-wave55-core-owl-end-without-start.test.ts` (M)
- `tests/unit/overnight-wave55-fab-ai-short-pool-null.test.ts` (M)
- `tests/unit/overnight-wave55-hex-tutorial-copy-catalog.test.ts` (M)
- `tests/unit/overnight-wave55-hexagone-tutorial-catalog.test.ts` (M)
- `tests/unit/overnight-wave55-kings-tutorial-supplies-winning-complete.test.ts` (M)
- `tests/unit/overnight-wave55-kwatro-tutorial-catalog.test.ts` (M)
- `tests/unit/overnight-wave55-stars-tutorial-catalog.test.ts` (M)
- `tests/unit/overnight-wave56-fiar-controller-vsai-timer-500.test.ts` (M)
- `tests/unit/overnight-wave56-handshake-ci-workflow-scripts.test.ts` (M)
- `tests/unit/overnight-wave56-kwatro-tutorial-setup-objective.test.ts` (M)
- `tests/unit/overnight-wave56-workflow-ci-unit-job.test.ts` (M)
- `tests/unit/overnight-wave57-contig-status-calculating-copy.test.ts` (M)
- `tests/unit/overnight-wave57-core-graph-animate-two-hop.test.ts` (M)
- `tests/unit/overnight-wave57-fiar-controller-movement-ai-timer-500.test.ts` (M)
- `tests/unit/overnight-wave57-handshake-ci-workflow-scripts.test.ts` (M)
- `tests/unit/overnight-wave57-handshake-kings-hex-par.test.ts` (M)
- `tests/unit/overnight-wave57-par55-controller-placing-status-exact.test.ts` (M)
- `tests/unit/overnight-wave57-par55-controller-status-select-exact.test.ts` (M)
- `tests/unit/overnight-wave58-ci-workflow-unit-e2e.test.ts` (M)
- `tests/unit/overnight-wave58-handshake-kings-hex-par-inject-chrome.test.ts` (M)
- `tests/unit/overnight-wave58-juggle-place-hint-exact.test.ts` (M)
- `tests/unit/overnight-wave59-ci-workflow-unit-e2e.test.ts` (M)
- `tests/unit/overnight-wave59-handshake-calla-juggle-ramrod.test.ts` (M)
- `tests/unit/overnight-wave59-handshake-fab-fiar-inject-chrome.test.ts` (M)
- `tests/unit/overnight-wave59-handshake-frac-pinball-blue-turn-exact.test.ts` (M)
- `tests/unit/overnight-wave59-kings-tutorial-place-quad-step-copy.test.ts` (M)
- `tests/unit/overnight-wave60-handshake-calla-juggle-ramrod.test.ts` (M)
- `tests/unit/overnight-wave60-kwatro-inject-chip-info-seat-vars.test.ts` (M)
- `tests/unit/overnight-wave60-kwatro-inject-status-type-seat-vars.test.ts` (M)
- `tests/unit/overnight-wave60-kwatro-tutorial-movement-highlight-bullets.test.ts` (M)
- `tests/unit/overnight-wave61-contig-status-must-pass-copy.test.ts` (M)
- `tests/unit/overnight-wave61-contig-status-placing-copy.test.ts` (M)
- `tests/unit/overnight-wave62-calla-hva-winner-banner-exact.test.ts` (M)
- `tests/unit/overnight-wave62-handshake-calla-juggle.test.ts` (M)
- `tests/unit/overnight-wave63-handshake-calla-juggle.test.ts` (M)
- `tests/unit/overnight-wave63-handshake-kings-hex-residual.test.ts` (M)
- `tests/unit/overnight-wave63-kings-tutorial-welcome-title-exact.test.ts` (M)
- `tests/unit/overnight-wave63-kwatro-tutorial-welcome-message-exact.test.ts` (M)
- `tests/unit/overnight-wave64-handshake-calla-juggle.test.ts` (M)
- `tests/unit/overnight-wave64-handshake-contig-sum-residual.test.ts` (M)
- `tests/unit/overnight-wave64-handshake-kings-hex-residual.test.ts` (M)
- `tests/unit/overnight-wave64-kings-tutorial-valid-green-cells.test.ts` (M)
- `tests/unit/overnight-wave64-kings-tutorial-winning-quadraphage-occupy.test.ts` (M)
- `tests/unit/overnight-wave65-fiar-tutorial-objective-pathways-exact.test.ts` (M)
- `tests/unit/overnight-wave65-fiar-tutorial-phases-placement-body-exact.test.ts` (M)
- `tests/unit/overnight-wave65-handshake-fab-fiar-residual.test.ts` (M)
- `tests/unit/overnight-wave66-handshake-calla-juggle-residual.test.ts` (M)
- `tests/unit/overnight-wave66-handshake-contig-sum-residual.test.ts` (M)
- `tests/unit/overnight-wave67-handshake-calla-juggle-residual.test.ts` (M)
- `tests/unit/overnight-wave67-handshake-contig-sum-residual.test.ts` (M)
- `tests/unit/overnight-wave67-handshake-kings-hex-residual.test.ts` (M)
- `tests/unit/overnight-wave67-handshake-kwatro-residual-chrome.test.ts` (M)
- `tests/unit/overnight-wave67-kings-tutorial-objective-trap-strong.test.ts` (M)
- `tests/unit/overnight-wave67-kings-tutorial-place-limit-opponent.test.ts` (M)
- `tests/unit/overnight-wave67-kings-tutorial-winning-no-moves-strong.test.ts` (M)
- `tests/unit/overnight-wave67-kwatro-tutorial-objective-create-alignment-exact.test.ts` (M)
- `tests/unit/overnight-wave67-kwatro-tutorial-welcome-create-alignment-exact.test.ts` (M)
- `tests/unit/overnight-wave67-kwatro-tutorial-winning-alignment-satisfy-exact.test.ts` (M)
- `tests/unit/overnight-wave69-star-track-ai-turn-timer.test.ts` (M)
- `tests/unit/par-55-ai-input-guard.test.ts` (M)
- `tests/unit/par-55-ai-timer-race.test.ts` (A)
- `tests/unit/par-55-deep-playtest-ux.test.ts` (A)
- `tests/unit/pent-em-in-placement-escape.test.ts` (A)
- `tests/unit/player-colors.test.ts` (M)
- `tests/unit/queens-guards-touch-aria-playability.test.ts` (A)
- `tests/unit/queens-hex-ai-play-deadline.test.ts` (M)
- `tests/unit/ramrod-ai-input-guard.test.ts` (M)
- `tests/unit/ramrod-ai-timer-race.test.ts` (A)
- `tests/unit/ramrod-deep-playability.test.ts` (A)
- `tests/unit/readme-npm-scripts.test.ts` (A)
- `tests/unit/security-headers.test.ts` (A)
- `tests/unit/setup-node.ts` (A)
- `tests/unit/setup.ts` (M)
- `tests/unit/shell-preload-policy.test.ts` (M)
- `tests/unit/sr-semantics-structure.test.ts` (A)
- `tests/unit/star-track-ai-input-guard.test.ts` (M)
- `tests/unit/star-track-playability-copy.test.ts` (A)
- `tests/unit/stars-bars-ai-input-guard.test.ts` (M)
- `tests/unit/stars-bars-ai-timer-race.test.ts` (A)
- `tests/unit/stars-bars-deep-playability.test.ts` (A)
- `tests/unit/state-roundtrip-fuzz.test.ts` (A)
- `tests/unit/storage-sanitize-security.test.ts` (A)
- `tests/unit/storage-save-migration-fixtures.test.ts` (A)
- `tests/unit/sum-dominoes-ai-timer-race.test.ts` (A)
- `tests/unit/sum-dominoes-deep-playability.test.ts` (A)
- `tests/unit/tablet-ai-hard-latency.bench.test.ts` (M)
- `tests/unit/tablet-gl.test.ts` (M)
- `tests/unit/tablet-playability-css.test.ts` (M)
- `tests/unit/ui-helper-dedupe-characterization.test.ts` (A)
- `tests/unit/undo-audit-core-games-props.test.ts` (A)
- `tests/unit/undo-audit-helpers.ts` (A)
- `tests/unit/undo-audit-log-games-props.test.ts` (A)
- `tests/unit/undo-audit-polyomino-props.test.ts` (A)
- `tests/unit/url-flags-security.test.ts` (A)
- `tests/unit/visual-baseline-ci-report-only.test.ts` (A)
- `tests/unit/zoom-reflow-ci-report-only.test.ts` (A)
- `tests/unit/zoom-reflow-css.test.ts` (A)

#### `tests/visual` (23)

- `tests/visual/__screenshots__/calla-board.png` (A)
- `tests/visual/__screenshots__/contig-60-board.png` (A)
- `tests/visual/__screenshots__/fab-a-diffy-board.png` (A)
- `tests/visual/__screenshots__/fiar-board.png` (A)
- `tests/visual/__screenshots__/frac-fact-board.png` (A)
- `tests/visual/__screenshots__/fraction-pinball-board.png` (A)
- `tests/visual/__screenshots__/hex-a-gone-board.png` (A)
- `tests/visual/__screenshots__/hex-board.png` (A)
- `tests/visual/__screenshots__/juggle-board.png` (A)
- `tests/visual/__screenshots__/kings-quadraphages-board.png` (A)
- `tests/visual/__screenshots__/kwatro-sinko-board.png` (A)
- `tests/visual/__screenshots__/landing.png` (A)
- `tests/visual/__screenshots__/par-55-board.png` (A)
- `tests/visual/__screenshots__/pent-em-in-board.png` (A)
- `tests/visual/__screenshots__/prime-gold-board.png` (A)
- `tests/visual/__screenshots__/queens-guards-board.png` (A)
- `tests/visual/__screenshots__/ramrod-board.png` (A)
- `tests/visual/__screenshots__/remainder-islands-board.png` (A)
- `tests/visual/__screenshots__/star-track-board.png` (A)
- `tests/visual/__screenshots__/stars-bars-board.png` (A)
- `tests/visual/__screenshots__/sum-dominoes-board.png` (A)
- `tests/visual/helpers.ts` (A)
- `tests/visual/screens.spec.ts` (A)

#### `tsconfig.json` (1)

- `tsconfig.json` (M)

#### `tsconfig.ratchet.json` (1)

- `tsconfig.ratchet.json` (A)

#### `vite.config.ts` (1)

- `vite.config.ts` (M)

#### `vite.security-headers.ts` (1)

- `vite.security-headers.ts` (A)

#### `vite.shell-chunks.ts` (1)

- `vite.shell-chunks.ts` (M)

#### `vitest.config.ts` (1)

- `vitest.config.ts` (M)

#### `vitest.engines-bench.config.ts` (1)

- `vitest.engines-bench.config.ts` (A)

## Acceptance checklist

- [x] Every file in tip-vs-alpha diff classified (1058)
- [x] Non-OK findings include file:line evidence (opened on tip), introducing commit(s), originating PR if identifiable, prior-flag cross-check (#538/#543/#545/#549), surgical remediation
- [x] String-literal audit of UI/tutorial files for hidden copy in refactors
- [x] Spot-check Hex Hard `450` and Stars & Bars no-cap line
- [x] Exact git commands and counts recorded
- [x] Deliverable is report-only (`docs/dev/tip-vs-alpha-audit-2026-10-08.md` + `.json`)

## Next action

**Next action: fold into tip by the tip owner**
