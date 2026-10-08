# Friday AI + copy hunk audit — tip #477 vs `origin/alpha`

**Task id:** `burn-1008-mp-friday-ai-copy-audit`  
**Audience:** Andrew + tip owner (Fri Oct 9 land window, **before 1:31 PM ET**).  
**Report only.** Docs deliverable; no product code changes in this PR.

| Field | Value |
| --- | --- |
| Tip audited | `7466528b7ffe8bda170df0011f2049b084c82c8b` (`7466528b`) — PR [#477](https://github.com/fuzzywigg/math-pentathlon/pull/477) head at preflight time |
| Tip branch | `cursor/integration-fold-wave5-tip-4af0` |
| Alpha | `eec2b327c1e65586537cbe03b1c29b93065dee03` (`eec2b327`) |
| Divergence | `0` behind / **444** ahead of `alpha` (fast-forward stack) |
| Prior file audit | [#552](https://github.com/fuzzywigg/math-pentathlon/pull/552) `docs/dev/tip-vs-alpha-audit-2026-10-08.md` @ tip `36a1340d` (16 AI + 32 copy primary; 48 flagged paths) |
| Isolation option | [#559](https://github.com/fuzzywigg/math-pentathlon/pull/559) (held; after Oct 14) — independent restore commits for the same 48 paths |
| Preflight | [#569](https://github.com/fuzzywigg/math-pentathlon/pull/569) / `docs/dev/friday-landing-preflight-v2.md` — CONDITIONAL GO; §3 still flags AI + You/Computer/tutorial deltas |

**Tip drift check:** product AI/copy paths under `src/games/**/{ai,ai-client,tutorial,board-ui,game-controller}.ts` + `calla/rules.ts` are **byte-identical** at `7466528b` and later tip `9370a30f` (only docs folds after preflight SHA).

---

## Owner hard rule (this audit)

No **AI behavior** changes (search, scoring, difficulty, timing / think deadlines) and no **player-facing copy**, tutorial, or rules-text changes may reach `alpha` without Andrew’s **explicit** approval.

| Bucket | Disposition for Fri land |
| --- | --- |
| Approved baseline | Six Phase 3 playability fixes **already merged to `alpha`** via [#413](https://github.com/fuzzywigg/math-pentathlon/pull/413) (+ related polish) — they are **not** tip-vs-alpha deltas |
| Held drafts (must stay out / not land their surfaces) | [#468](https://github.com/fuzzywigg/math-pentathlon/pull/468), [#488](https://github.com/fuzzywigg/math-pentathlon/pull/488) (AI retunes); [#487](https://github.com/fuzzywigg/math-pentathlon/pull/487) (kid-readable You/Computer / “Computer is thinking…”); [#492](https://github.com/fuzzywigg/math-pentathlon/pull/492) (rules-text audit); [#557](https://github.com/fuzzywigg/math-pentathlon/pull/557) BoardCell + shuffle hunks; [#559](https://github.com/fuzzywigg/math-pentathlon/pull/559); [#560](https://github.com/fuzzywigg/math-pentathlon/pull/560) (after #477) |

### Classification used here

| Class | Meaning |
| --- | --- |
| **APPROVED** | Traceable to work already merged/approved for `alpha` (Phase 3 playability baseline). Tip-vs-alpha AI/copy deltas do **not** qualify. |
| **HELD** | Same surface as held drafts (#468/#488/#487/#492/#559 groups), even when tip’s introducing commit is a deep-playtest / #446 / #472 fold rather than the held PR head. |
| **UNKNOWN** | Not clearly approved for `alpha` land and not an exact held-PR fold; still blocked by the owner hard rule until Andrew decides. |

---

## Method

```text
git fetch origin alpha cursor/integration-fold-wave5-tip-4af0
TIP=7466528b7ffe8bda170df0011f2049b084c82c8b
git diff origin/alpha...$TIP -- src/games/*/ai.ts src/games/*/ai-client.ts \
  src/games/*/tutorial.ts src/games/*/game-controller.ts src/games/*/board-ui.ts \
  src/games/*/rules.ts
# Attribution: git log -S / tip merge(#N) / #552 findings / #559 provenance table
# Held-PR containment: git merge-base --is-ancestor <held-head> $TIP
```

- [#468](https://github.com/fuzzywigg/math-pentathlon/pull/468) / [#488](https://github.com/fuzzywigg/math-pentathlon/pull/488) heads are **not** ancestors of tip (`#485` fold explicitly: “no #468 AI retunes”).
- [#487](https://github.com/fuzzywigg/math-pentathlon/pull/487) head is **not** on tip; tip You/Computer strings come from deep-playtest folds + shared seat helpers (`#518`).
- [#492](https://github.com/fuzzywigg/math-pentathlon/pull/492) product tutorial/help edits are **not** on tip; tip tutorials are from [#446](https://github.com/fuzzywigg/math-pentathlon/pull/446) (`d5bccd06` / `9ed6903c`). Characterization salvage only.
- [#557](https://github.com/fuzzywigg/math-pentathlon/pull/557) held BoardCell rebuild / stars-bars shuffle swap are **not** on tip (tip `BoardCell` usage matches alpha style; no #557 fold commit).

---

## A. AI-behavior hunks (tip vs `alpha`)

Line ranges are **tip** (`7466528b`) unless noted. One logical hunk per row.

### A1. Search / scoring / difficulty (heuristics)

| File | Tip lines | One-line description | Commit → source PR | Class |
| --- | ---: | --- | --- | --- |
| `src/games/contig-60/ai.ts` | 34–36 | Hard `lookahead: true` in difficulty config | `9f1ffdff` → [#425](https://github.com/fuzzywigg/math-pentathlon/pull/425) (fold `42397e1f` / stack [#438](https://github.com/fuzzywigg/math-pentathlon/pull/438)) | **HELD** (#468/#488 class; #559 `ai-contig`) |
| `src/games/contig-60/ai.ts` | 157–187 | New `countOpenWinThreatsFor` open-win threat scan | `9f1ffdff` → #425 | **HELD** |
| `src/games/contig-60/ai.ts` | 198, 257–270 | Hard scoring subtracts open threats (`×4000`) | `9f1ffdff` → #425 | **HELD** |
| `src/games/kings-quadraphages/ai.ts` | 274–282 | Medium placement pool prefers forced wins (`score≥10000`) over random top-5 | `6d5a384f` → [#426](https://github.com/fuzzywigg/math-pentathlon/pull/426) (fold `1281e015`) | **HELD** (#468/#488 class; #559 `ai-kings`) |
| `src/games/kings-quadraphages/ai.ts` | 296–318 | Hard early-exit when placement score ≥10000 | `6d5a384f` → #426 | **HELD** |
| `src/games/kwatro-sinko/ai.ts` | 37 | `AI_THINK_BUDGET_MS = 50` soft decision budget | `08a9bdcf` → [#416](https://github.com/fuzzywigg/math-pentathlon/pull/416) (fold `a34eea2a` / [#444](https://github.com/fuzzywigg/math-pentathlon/pull/444)) | **HELD** (#468/#488 class; #559 `ai-kwatro`) |
| `src/games/kwatro-sinko/ai.ts` | 41–43 | Difficulty randomness retune (0.5/0.15/0.03 → 0.35/0.12/0.02) | `08a9bdcf` → #416 | **HELD** |
| `src/games/kwatro-sinko/ai.ts` | 153–168+ | `countOnNumbered` + home-row evacuate / win-progress heuristics | `08a9bdcf` → #416 | **HELD** |
| `src/games/kwatro-sinko/ai.ts` | 286–340, 377–445 | Evaluate/teaching/getAIMove use new heuristics + budget guard | `08a9bdcf` → #416 | **HELD** |

### A2. Play deadlines (search wall-time)

| File | Tip lines | One-line description | Commit → source PR | Class |
| --- | ---: | --- | --- | --- |
| `src/games/hex/ai.ts` | 15–22 | Hard play deadline **2500→450** (+ comment) | `be668f62` → [#472](https://github.com/fuzzywigg/math-pentathlon/pull/472) (fold `b6758ee9`) | **UNKNOWN** (tip process KEEP 450; **not** owner-approved for `alpha` under land hard rule; #559 keeps tip Hex 450 as option) |
| `src/games/queens-guards/ai.ts` | 30–37 | Hard play deadline **2500→450** (+ comment) | `be668f62` → #472 | **UNKNOWN** (#559 recommends restore alpha 2500) |
| `src/games/hex/ai-client.ts` | 36–90 | Client watchdog races worker at `deadlineMs+1500` | tip worker-safety fold trail (#472 / Hex worker path; not in #552 primary 16) | **UNKNOWN** (timing infra tied to tip deadlines) |

Alpha still has Hex/Queens Hard **2500** from merged [#389](https://github.com/fuzzywigg/math-pentathlon/pull/389). Tip’s further cut to **450** is **not** that approved merge.

### A3. Think / place paint delays (controllers)

| File | Tip lines | One-line description | Commit → source PR | Class |
| --- | ---: | --- | --- | --- |
| `src/games/calla/game-controller.ts` | 42, 44 | `AI_THINKING_DELAY` 800→**600**; `AI_FREE_TURN_DELAY=250` | `ce2dd300` → [#430](https://github.com/fuzzywigg/math-pentathlon/pull/430) (fold `7a228d4c`) | **HELD** (#559 `ai-think-delays`) |
| `src/games/contig-60/game-controller.ts` | 50–53 | `AI_PLACE_DELAY_MS=450` (+ roll pause chrome) | `9f1ffdff` → #425 | **HELD** |
| `src/games/fraction-pinball/game-controller.ts` | 28 | `AI_THINK_MS=650` | `5721ac4a` → [#424](https://github.com/fuzzywigg/math-pentathlon/pull/424) (fold `677c0643`) | **HELD** |
| `src/games/hex-a-gone/game-controller.ts` | 59 | `AI_THINKING_DELAY` 800→**350** | `145b6cb2` → [#415](https://github.com/fuzzywigg/math-pentathlon/pull/415) (fold `d5ec4c17`) | **HELD** |
| `src/games/hex/game-controller.ts` | 40 | `AI_THINKING_DELAY` 500→**250** | `cbe8bf85` / `be668f62` → [#434](https://github.com/fuzzywigg/math-pentathlon/pull/434) / #472 | **HELD** |
| `src/games/kings-quadraphages/game-controller.ts` | 46–64 | Coarse **350** vs desktop **500** think delay | `6d5a384f` → #426 | **HELD** |
| `src/games/par-55/game-controller.ts` | 38 | `AI_THINK_DELAY_MS=450` | `71077ddf` → [#433](https://github.com/fuzzywigg/math-pentathlon/pull/433) (fold `970ac936`) | **HELD** |
| `src/games/queens-guards/game-controller.ts` | 262 | `AI_THINK_PAINT_MS=250` | `34e82847` / `be668f62` → [#427](https://github.com/fuzzywigg/math-pentathlon/pull/427) / #472 | **HELD** |
| `src/games/ramrod/game-controller.ts` | 70 | `AI_THINKING_DELAY=550` | `145b6cb2` → #415 / [#431](https://github.com/fuzzywigg/math-pentathlon/pull/431) trail | **HELD** |
| `src/games/star-track/game-controller.ts` | 47–48, 294–295 | Replace `AI_THINKING_DELAY=600` with `AI_DRAW_DELAY_MS=400` + `AI_SELECT_DELAY_MS=350` | `84679199` → [#436](https://github.com/fuzzywigg/math-pentathlon/pull/436) (fold `c2a13d22`) | **HELD** |
| `src/games/stars-bars/game-controller.ts` | 35 | `AI_THINK_MS=450` | `30b8c59c` → [#432](https://github.com/fuzzywigg/math-pentathlon/pull/432) (fold `f399129c`) | **HELD** |

### A4. `ai.ts` files that differ but are **not** AI-behavior (for completeness)

Import-type / curly-brace / dead-import only vs alpha (classified OK in #552):  
`calla`, `fab-a-diffy`, `fiar`, `frac-fact`, `fraction-pinball`, `hex-a-gone`, `juggle`, `par-55`, `pent-em-in`, `prime-gold`, `ramrod`, `remainder-islands`, `star-track`, `stars-bars`, `sum-dominoes` — **no APPROVED/HELD/UNKNOWN AI hunk** (not player-facing; no search/scoring/difficulty/timing delta).

---

## B. Player-facing copy / tutorial / rules-text hunks

### B1. Tutorials (#446 K–5 / clarity — all 20 games)

Introducing commits: `d5bccd06` (`docs(tutorials): audit tutorial vs engine mismatches; K-5 clarity polish`) + fold `9ed6903c` **merge(#446)**. Open held [#487](https://github.com/fuzzywigg/math-pentathlon/pull/487) / [#492](https://github.com/fuzzywigg/math-pentathlon/pull/492) are **not** the tip source but cover the same land surface. #559 groups `tutorial-div1`…`div4`.

| File | Tip line span (changed region) | One-line description | Class |
| --- | --- | --- | --- |
| `src/games/calla/tutorial.ts` | 4–102 | Kid-friendly / engine-aligned step HTML | **HELD** |
| `src/games/contig-60/tutorial.ts` | 4–76 | Same (#446) | **HELD** |
| `src/games/fab-a-diffy/tutorial.ts` | 4–82 | Same (#446) | **HELD** |
| `src/games/fiar/tutorial.ts` | 3–60 | Same (#446) | **HELD** |
| `src/games/frac-fact/tutorial.ts` | 4–35 | Same (#446) | **HELD** |
| `src/games/fraction-pinball/tutorial.ts` | 4–66 | Same (#446) | **HELD** |
| `src/games/hex-a-gone/tutorial.ts` | 4–104 | Same (#446) | **HELD** |
| `src/games/hex/tutorial.ts` | 4–78 | Same (#446); e.g. click→tap | **HELD** |
| `src/games/juggle/tutorial.ts` | 4–62 | Same (#446) | **HELD** |
| `src/games/kings-quadraphages/tutorial.ts` | 3–160 | Same (#446) | **HELD** |
| `src/games/kwatro-sinko/tutorial.ts` | 4–71 | Same (#446) | **HELD** |
| `src/games/par-55/tutorial.ts` | 4–62 | Same (#446) | **HELD** |
| `src/games/pent-em-in/tutorial.ts` | 4–69 | Same (#446) | **HELD** |
| `src/games/prime-gold/tutorial.ts` | 4–86 | Same (#446) | **HELD** |
| `src/games/queens-guards/tutorial.ts` | 4–70 | Same (#446) | **HELD** |
| `src/games/ramrod/tutorial.ts` | 4–85 | Same (#446) | **HELD** |
| `src/games/remainder-islands/tutorial.ts` | 4–65 | Same (#446) | **HELD** |
| `src/games/star-track/tutorial.ts` | 4–84 | Same (#446) | **HELD** |
| `src/games/stars-bars/tutorial.ts` | 4–73 | Same (#446) | **HELD** |
| `src/games/sum-dominoes/tutorial.ts` | 4–87 | Same (#446) | **HELD** |

### B2. You / Computer / status / seat chrome (#487 surface)

| File | Tip lines | One-line description | Commit → source PR | Class |
| --- | ---: | --- | --- | --- |
| `src/games/calla/board-ui.ts` | 406–419 | You/AI win grammar + “AI is thinking...” | `ce2dd300` → #430 | **HELD** (#487; #559 `status-copy`) |
| `src/games/calla/rules.ts` | 258–297 | `getPhaseMessage` / seat display You/AI / “You win!” | `ce2dd300` → #430 | **HELD** (#487/#492) |
| `src/games/contig-60/game-controller.ts` | 192–202 | “Computer is thinking…” / “Tap a green number…” | `9f1ffdff` → #425 | **HELD** |
| `src/games/fab-a-diffy/game-controller.ts` | 140–142 | “Computer is thinking…” status | fab deep-playtest trail ([#422](https://github.com/fuzzywigg/math-pentathlon/pull/422) contained) | **HELD** |
| `src/games/fraction-pinball/board-ui.ts` | 332–395 | You/Computer seat + win strings | `5721ac4a` → #424 | **HELD** |
| `src/games/fraction-pinball/game-controller.ts` | (status/result pacing strings w/ AI delay) | Result / turn chrome copy alongside `AI_THINK_MS` | `5721ac4a` → #424 | **HELD** |
| `src/games/hex/board-ui.ts` | 425, 437 | “You win!” / “Computer is thinking…” | `cbe8bf85` → #434 | **HELD** |
| `src/games/juggle/board-ui.ts` | 433, 471, 610–624 | Computer thinking/placing + “Choose another shape” | `145b6cb2` → #415 | **HELD** |
| `src/games/kings-quadraphages/board-ui.ts` | 36–45, 417–434, 471–472 | You/AI phase messages + “AI is thinking...” | `6d5a384f` → #426 | **HELD** |
| `src/games/par-55/game-controller.ts` | 152–158+ | Turn/winner status chrome (You/Computer) | `71077ddf` → #433 | **HELD** |
| `src/games/pent-em-in/board-ui.ts` | 513–529 | Place-phase hints (“Tap a green cell…”, choose-another) | `9c799573` → [#417](https://github.com/fuzzywigg/math-pentathlon/pull/417) (fold `dc241b1d`) | **HELD** |
| `src/games/pent-em-in/game-controller.ts` | 190 | “won't fit — choose another” status | `9c799573` → #417 | **HELD** |
| `src/games/queens-guards/game-controller.ts` | 218–233 | “Computer is thinking…” / computer-seat instructions | `34e82847` → #427 | **HELD** |
| `src/games/ramrod/game-controller.ts` | 146–179 | “Computer is thinking…” / “Your hand (Blue) — tap a rod…” | `145b6cb2` → #415/#431 | **HELD** |
| `src/games/star-track/board-ui.ts` | 21–34, 265–274, 447 | Blue/Red→Your/Computer replaces + thinking hints | `84679199` → #436 | **HELD** |
| `src/games/stars-bars/board-ui.ts` | 383–384, 477, 639–722, 756 | You/Computer hand/score/history labels (`getPlayerName`) | `30b8c59c` → #432 | **HELD** (history loop uncapped stays compliant — do not reintroduce `slice(-15)`) |
| `src/games/stars-bars/game-controller.ts` | 149–158 | “Computer is thinking…” / “Your turn — Select a card…” | `30b8c59c` → #432 | **HELD** |
| `src/games/sum-dominoes/game-controller.ts` | 142–189 | Computer thinking + “Green cells are legal…” | `331fe01a` → [#421](https://github.com/fuzzywigg/math-pentathlon/pull/421) (fold `536a5e33`) | **HELD** |

### B3. Held drafts **absent** from tip (no tip hunk to revert)

| Held item | On tip `7466528b`? | Note |
| --- | --- | --- |
| #468 / #488 AI calibration retunes | **No** | Tip log: `merge(#485)… no #468 AI retunes` |
| #487 kid-readable copy PR head | **No** | Equivalent You/Computer strings arrived via deep-playtest / #446 (listed above as HELD surfaces) |
| #492 tutorial/help product edits | **No** | Characterization tests only on tip |
| #557 `pent-em-in` BoardCell rebuild + `stars-bars` shuffle swap | **No** | Confirmed not folded; leave #557 out |
| #559 isolation branch | **No** | Option only; deferred after Oct 14 |
| #560 AI type-only emit-identical | **No** | After #477 only |

### B4. APPROVED count (tip-vs-alpha AI/copy)

**Zero.** The six Phase 3 playability fixes already on `alpha` (#413 cluster) do not appear as tip-vs-alpha AI/copy deltas. Nothing in sections A–B is **APPROVED** for Friday land under the owner hard rule without a new explicit OK.

---

## Counts

| Bucket | Hunks (logical rows above) |
| --- | ---: |
| AI heuristics | 9 |
| AI play deadlines (+ hex ai-client) | 3 |
| AI think/place delays | 11 |
| Tutorials | 20 |
| Status / You–Computer / rules-text chrome | 18 |
| **APPROVED** | **0** |
| **HELD** | **all tutorial + status + heuristic + delay rows** |
| **UNKNOWN** | **Hex Hard 450, Queens Hard 450, hex `ai-client` watchdog** |

---

## Verdict

**HOLD** — tip `7466528b` is **not** clean for Friday 1:31 PM ET under the owner hard rule. Do **not** land #477 → `alpha` until the following AI/copy surfaces are restored to `origin/alpha` (or Andrew explicitly approves keeping them).

### Exact restore targets (prefer #559 group commits, or alpha checkout)

Use [#559](https://github.com/fuzzywigg/math-pentathlon/pull/559) restore SHAs when folding that option, **or** surgical alpha restores on tip:

| Restore group | Tip introducing commits (revert content / checkout alpha) | Paths |
| --- | --- | --- |
| `ai-contig` | `9f1ffdff` | `src/games/contig-60/ai.ts` |
| `ai-kings` | `6d5a384f` (win-pool hunks only) | `src/games/kings-quadraphages/ai.ts` |
| `ai-kwatro` | `08a9bdcf` / fold `a34eea2a` | `src/games/kwatro-sinko/ai.ts` |
| `ai-hex` / `ai-queens` + client | `be668f62` / fold `b6758ee9` | `src/games/hex/ai.ts`, `src/games/queens-guards/ai.ts`, `src/games/hex/ai-client.ts` (+ unit asserts that pin Hard `450` if deadline restored) |
| `ai-think-delays` | `ce2dd300`, `9f1ffdff`, `5721ac4a`, `145b6cb2`, `cbe8bf85`, `6d5a384f`, `71077ddf`, `34e82847`, `84679199`, `30b8c59c` | 11 `game-controller.ts` files in §A3 |
| `tutorial-div1`…`div4` | `d5bccd06` / `9ed6903c` | all 20 `src/games/*/tutorial.ts` |
| `status-copy` | deep-playtest commits in §B2 | board-ui / game-controller / `calla/rules.ts` listed in §B2 |

**Keep while restoring copy:** Stars & Bars **uncapped** history loop (`src/games/stars-bars/board-ui.ts` ~747–751 — do not reintroduce `slice(-15)`).

**Do not fold:** #468, #488, #487, #492 product edits, #557 BoardCell/shuffle, #559 (unless chosen as the restore vehicle), #560.

### One-line verdict

**HOLD** — revert §A + §B tip deltas (commits/`#559` groups above) on #477 before Friday 1:31 PM ET, unless Andrew gives explicit keep approvals per group.
