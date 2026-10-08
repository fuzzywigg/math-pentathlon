# Merge-window decision sheet — Fri Oct 9 PM (2026-10-09)

**Task id:** `burn-1008-mp-merge-window-decision-sheet`  
**Audience:** Andrew (owner) — one list for the merge window; every item is Yes/No or multiple-choice.  
**Tip at sheet authoring:** `cursor/integration-fold-wave5-tip-4af0` @ `6b5a2270` (PR [#477](https://github.com/fuzzywigg/math-pentathlon/pull/477))  
**`alpha` at sheet authoring:** `eec2b327`  
**Report only.** This sheet does **not** decide for you; recommendations are copied from the mined sources. Fill answers as `D01: Yes` (or A/B/C).

### Sources mined (opened on their branches)

| Source | PR | File opened |
| --- | ---: | --- |
| Open-draft triage (d)/(e) | [#545](https://github.com/fuzzywigg/math-pentathlon/pull/545) | `docs/dev/open-draft-triage-2026-10-08.md` |
| Alpha landing preflight | [#547](https://github.com/fuzzywigg/math-pentathlon/pull/547) | `docs/dev/alpha-landing-preflight-2026-10-08.md` |
| Compliance review 1 | [#538](https://github.com/fuzzywigg/math-pentathlon/pull/538) | `docs/dev/burn-1008-compliance-review.md` |
| Compliance review 2 | [#543](https://github.com/fuzzywigg/math-pentathlon/pull/543) | `docs/dev/burn-1008-compliance-review-2.md` |
| Math-precision owner list | [#540](https://github.com/fuzzywigg/math-pentathlon/pull/540) | `docs/dev/math-precision-owner-decisions.md` |
| Type-ratchet Batch-2 owner list | [#546](https://github.com/fuzzywigg/math-pentathlon/pull/546) | `docs/dev/type-ratchet-batch2-owner-decisions.md` |
| Type-ratchet Batch-3 deferred | [#544](https://github.com/fuzzywigg/math-pentathlon/pull/544) | `docs/dev/type-ratchet-batch3-deferred.md` |
| Wave5 fold rehearsal | [#542](https://github.com/fuzzywigg/math-pentathlon/pull/542) | `docs/dev/wave5-fold-rehearsal-2026-10-08.md` |
| Tip land vehicle | [#477](https://github.com/fuzzywigg/math-pentathlon/pull/477) | PR body + tip tree |
| Owner questions | [#393](https://github.com/fuzzywigg/math-pentathlon/pull/393), [#394](https://github.com/fuzzywigg/math-pentathlon/pull/394), [#418](https://github.com/fuzzywigg/math-pentathlon/pull/418) | PR bodies + tip tree |
| Rules checklist (already on tip) | on tip via [#483](https://github.com/fuzzywigg/math-pentathlon/pull/483) | `docs/RULES-DECISIONS-2026-10-07.md` |

### How to use this sheet (2 minutes)

1. Answer **§1 process** items first (D01–D12) — they gate whether tip lands Fri PM.
2. Answer **§2 rules** Top-5 (D13–D17) if you want rules-adjacent PRs considered; otherwise leave blank and they stay **out** of this land.
3. Math / type-ratchet (D30+) can wait until after tip→`alpha` unless you want those folds in the same window.
4. Tip owner folds remaining category-(c) drafts **before** land only if you say so in D03; otherwise land tip as-is then fold later onto `alpha`.

### Hard holds already locked on tip (do not re-open in this window unless you choose to)

| Hold | Evidence on tip `6b5a2270` |
| --- | --- |
| Hex Hard assert stays **450ms** | `src/games/hex/ai.ts:21` `hard: 450`; `tests/unit/hex-deep-playability.test.ts:58` `toBe(450)` |
| Stars & Bars history **uncapped** | `src/games/stars-bars/board-ui.ts:747` comment: “do not cap — #501 fold held…” |
| CI least-privilege | `.github/workflows/ci.yml:15–16` `permissions: contents: read`; checkouts `persist-credentials: false` |

---

## 1. Numbered decision list (de-duplicated)

### §1 — Process / land / closes (answer Fri PM)

#### D01 — When should tip #477 land alone into `alpha`?

| | |
| --- | --- |
| **Question** | Land the wave5 tip into `alpha` during the Fri Oct 9 PM window? |
| **Options** | **A)** Fri Oct 9 PM as planned · **B)** After more category-(c) folds · **C)** Slip past Oct 9 (say when) |
| **Recommended** | **A** — preflight [#547](https://github.com/fuzzywigg/math-pentathlon/pull/547) verdict **CONDITIONAL GO** at tip `e1692696`; tip is fast-forward of `alpha` (0 behind / 362 ahead @ sheet SHA); dry-run merge clean (see §5). |
| **Evidence** | [#547](https://github.com/fuzzywigg/math-pentathlon/pull/547) `docs/dev/alpha-landing-preflight-2026-10-08.md` §Verdict; [#545](https://github.com/fuzzywigg/math-pentathlon/pull/545) category (d) row #477; [#477](https://github.com/fuzzywigg/math-pentathlon/pull/477) title “land #477 alone into alpha” |
| **If deferred** | Window closes without tip on `alpha`; students keep older `alpha`; more tip drift before next chance. |
| **Your answer** | ☐ A · ☐ B · ☐ C: ___ |

#### D02 — Re-run gates on the **exact** tip tip before merge?

| | |
| --- | --- |
| **Question** | Preflight gates were on `e1692696`; tip has since advanced (`7b99c2bb` #505 fold, later #522 @ `6b5a2270`). Re-run unit + Chromium e2e on the SHA you actually merge? |
| **Options** | **Yes** re-run · **No** trust CONDITIONAL GO + CI on tip PR |
| **Recommended** | **Yes** — soft hold from [#547](https://github.com/fuzzywigg/math-pentathlon/pull/547) §6 item 15 / soft hold #3. |
| **Evidence** | [#547](https://github.com/fuzzywigg/math-pentathlon/pull/547) `docs/dev/alpha-landing-preflight-2026-10-08.md` lines noting tip drift after tested SHA |
| **If deferred** | Risk of landing an untested tip tip; CI on #477 base is wave4, not tip→`alpha`. |
| **Your answer** | ☐ Yes · ☐ No |

#### D03 — Fold remaining category-(c) drafts into tip **before** tip→`alpha`?

| | |
| --- | --- |
| **Question** | Tip owner still has ~24 fold-worthy drafts ([#545](https://github.com/fuzzywigg/math-pentathlon/pull/545) §(c)). Fold them before Friday land, or land tip now and fold onto `alpha` later? |
| **Options** | **A)** Land tip as-is Fri · **B)** Fold high-priority subset first (name PRs) · **C)** Fold full #545 order first |
| **Recommended** | **A** for the land itself (MERGE-REHEARSAL Path A / #477 “land alone”); use **B** only for docs/safe items you already reviewed. Updated fold order lives in [#545](https://github.com/fuzzywigg/math-pentathlon/pull/545) (prefer over stale [#542](https://github.com/fuzzywigg/math-pentathlon/pull/542) cheat-sheet that still listed #535). |
| **Evidence** | [#545](https://github.com/fuzzywigg/math-pentathlon/pull/545) Suggested fold order; [#543](https://github.com/fuzzywigg/math-pentathlon/pull/543) flags #542 order as outdated (#535 violation); `docs/MERGE-REHEARSAL-2026-10-07.md` Path A |
| **If deferred (pick A)** | Category-(c) stays open as tip-based drafts; tip owner folds after land. |
| **Your answer** | ☐ A · ☐ B: ___ · ☐ C |

#### D04 — Close category-(e) hard-rule violation drafts without folding?

| | |
| --- | --- |
| **Question** | Close (do not fold) the nine violation PRs listed by triage? |
| **Options** | **Yes** close all nine · **No** keep open for later exemption · **Partial** (list keepers) |
| **Recommended** | **Yes** — triage [#545](https://github.com/fuzzywigg/math-pentathlon/pull/545) §(e); compliance [#538](https://github.com/fuzzywigg/math-pentathlon/pull/538) for #535/#537. |
| **Evidence** | [#545](https://github.com/fuzzywigg/math-pentathlon/pull/545) §(e): #419, #428, #429, #468, #487, #488, #492, #535, #537 |
| **If deferred** | Noise stays in open-draft list; risk someone folds a violation by mistake. |
| **Your answer** | ☐ Yes · ☐ No · ☐ Partial: ___ |

#### D05 — Prefer safe recuts over violation originals for math / Batch-2?

| | |
| --- | --- |
| **Question** | For math precision and type-ratchet Batch 2: fold **#540** (not #535) and **#546** (not #537)? |
| **Options** | **Yes** (safe recuts only) · **No** (I want the original source edits — exemption) |
| **Recommended** | **Yes** — [#538](https://github.com/fuzzywigg/math-pentathlon/pull/538) violation on #535/#537; [#543](https://github.com/fuzzywigg/math-pentathlon/pull/543) compliant on #540; [#545](https://github.com/fuzzywigg/math-pentathlon/pull/545) folds #540/#546 and closes #535/#537. |
| **Evidence** | [#538](https://github.com/fuzzywigg/math-pentathlon/pull/538) summary table; [#543](https://github.com/fuzzywigg/math-pentathlon/pull/543) #540 section; [#540](https://github.com/fuzzywigg/math-pentathlon/pull/540) / [#546](https://github.com/fuzzywigg/math-pentathlon/pull/546) PR titles |
| **If deferred** | Leave all four open; tip owner must not fold #535/#537. |
| **Your answer** | ☐ Yes · ☐ No |

#### D06 — Accept unit-suite load flake as soft hold (not a land blocker)?

| | |
| --- | --- |
| **Question** | First full `test:unit` on preflight hit 2 timeouts in `ui-helper-dedupe-characterization.test.ts`; isolated + full confirmation passed. Treat as soft hold and proceed? |
| **Options** | **Yes** proceed (watch Actions) · **No** block until flake fixed on tip |
| **Recommended** | **Yes** — [#547](https://github.com/fuzzywigg/math-pentathlon/pull/547) soft hold #2; confirmation rerun exit 0. Related isolation work is in draft [#548](https://github.com/fuzzywigg/math-pentathlon/pull/548) (prefetch), not required for CONDITIONAL GO. |
| **Evidence** | [#547](https://github.com/fuzzywigg/math-pentathlon/pull/547) §3 unit first-run fail / confirmation pass; file `tests/unit/ui-helper-dedupe-characterization.test.ts` |
| **If deferred (No)** | Tip→`alpha` waits on a flake fix PR. |
| **Your answer** | ☐ Yes · ☐ No |

#### D07 — Owner eyeball of tip AI / rules / tutorial deltas before land?

| | |
| --- | --- |
| **Question** | Tip vs `alpha` includes many `ai.ts` / `rules.ts` / all `tutorial.ts` kid-friendly rewrites. Do you require a personal eyeball pass before merge? |
| **Options** | **Yes** (process gate) · **No** (accept tip stack as already reviewed in prior folds) |
| **Recommended** | **Yes** — [#547](https://github.com/fuzzywigg/math-pentathlon/pull/547) §6 item 14 / soft hold #1 (process blocker). |
| **Evidence** | [#547](https://github.com/fuzzywigg/math-pentathlon/pull/547) §5 eyeball tables (`src/games/*/ai.ts`, non-trivial `rules.ts`, all `tutorial.ts`) |
| **If deferred (No)** | You accept prior fold reviews; still keep hard holds (Hex 450, S&B uncapped). |
| **Your answer** | ☐ Yes · ☐ No |

#### D08 — Accept report-only gzip budget OVERs / menu axe moderate?

| | |
| --- | --- |
| **Question** | Nine games OVER committed gzip headroom (`size:check` report-only) and menu-home axe `landmark-unique` moderate — block land? |
| **Options** | **A)** Do not block · **B)** Block until budgets green |
| **Recommended** | **A** — [#547](https://github.com/fuzzywigg/math-pentathlon/pull/547) soft hold #4 / non-blocking. |
| **Evidence** | [#547](https://github.com/fuzzywigg/math-pentathlon/pull/547) §4 size:check list; §3 axe note |
| **If deferred (B)** | Land waits on bundle trim PR. |
| **Your answer** | ☐ A · ☐ B |

#### D09 — Leave engine-bench hotspots alone this window?

| | |
| --- | --- |
| **Question** | fab-a-diffy / pent-em-in opening `legalMoves` are slow in engine bench — authorize speed work now? |
| **Options** | **A)** Leave alone (no speedups) · **B)** Authorize a timed follow-up (AI-timing risk) |
| **Recommended** | **A** — [#477](https://github.com/fuzzywigg/math-pentathlon/pull/477) PR body: “left for Andrew (timing-sensitive)”; do not speed up in this fold. |
| **Evidence** | [#477](https://github.com/fuzzywigg/math-pentathlon/pull/477) body; tip `docs/engine-bench-2026-10-08.md` |
| **If deferred** | Same as A — hotspots remain until a dedicated timed task. |
| **Your answer** | ☐ A · ☐ B |

#### D10 — Re-land Kwatro non-contiguous wins (#393) or keep the tip revert?

| | |
| --- | --- |
| **Question** | Tip merged then **reverted** #393 (`55b4212d`). Re-land non-contiguous winning paths, or keep contiguous-only tip? |
| **Options** | **A)** Keep revert (contiguous) · **B)** Re-land #393 (gaps allowed per PDF) |
| **Recommended** | Align with **D14/KW2**: sources recommend **Yes gaps** → **B** once you also answer yellow-middle / diagonals; if you are not ready for that rules package Fri PM, pick **A** for this land. |
| **Evidence** | [#545](https://github.com/fuzzywigg/math-pentathlon/pull/545) §(d) #393; tip commit `55b4212d`; [#393](https://github.com/fuzzywigg/math-pentathlon/pull/393) body PDF quote; `docs/RULES-DECISIONS-2026-10-07.md` H1/KW2 Recommend Yes; tip `src/games/kwatro-sinko/rules.ts:370` `break; // Stop at empty node` |
| **If deferred** | Contiguous wins stay; #393 remains open. |
| **Your answer** | ☐ A · ☐ B |

#### D11 — Fold #394 contiguous-lock tests now?

| | |
| --- | --- |
| **Question** | #394 locks **contiguous** Div II scan in tests. Fold now, or wait until D10/D14 is answered? |
| **Options** | **A)** Wait until D10 answered · **B)** Fold #394 now (documents current tip) · **C)** Close #394 if D10=B |
| **Recommended** | **A** if D10 still open; **B** if D10=A (keep contiguous); **C** if D10=B (re-land gaps). Matches [#545](https://github.com/fuzzywigg/math-pentathlon/pull/545) §(d) #394 question. |
| **Evidence** | [#545](https://github.com/fuzzywigg/math-pentathlon/pull/545) §(d) #394; [#394](https://github.com/fuzzywigg/math-pentathlon/pull/394) body |
| **If deferred** | Tip stays without `kwatro-sinko-rules-lock-div2.test.ts`. |
| **Your answer** | ☐ A · ☐ B · ☐ C |

#### D12 — Allow #418 Prime Gold settle + FIAR touch, or require playability-only recut?

| | |
| --- | --- |
| **Question** | #418 adds Prime Gold chip-floor / settle helpers (rules) + AI pass-on-empty-chips, plus FIAR move-phase touch. Soft-lock escapes OK, or recut without AI/rules? |
| **Options** | **A)** Hold — require playability-only recut (UI/touch only) · **B)** Fold after PG1/PG2 Yes (D27/D28) with explicit exemption · **C)** Close without fold |
| **Recommended** | **A** for Fri land (hard rule: no AI/rules without exemption); **B** only if you answer PG1/PG2 Yes and carve an exemption. Triage [#545](https://github.com/fuzzywigg/math-pentathlon/pull/545) framed this as owner decide. |
| **Evidence** | [#545](https://github.com/fuzzywigg/math-pentathlon/pull/545) §(d) #418; [#418](https://github.com/fuzzywigg/math-pentathlon/pull/418) body; `docs/RULES-DECISIONS-2026-10-07.md` PG1/PG2 |
| **If deferred** | Mid-game Roll stall may remain on tip until a compliant fix. |
| **Your answer** | ☐ A · ☐ B · ☐ C |

---

### §2 — Rules / scoring Top-5 + unique game calls

Canonical detail: tip `docs/RULES-DECISIONS-2026-10-07.md` (folded via [#483](https://github.com/fuzzywigg/math-pentathlon/pull/483)). Aliases noted so you answer once.

#### D13 — H2 / KW5 / FI1 — How should endless chip-cycling end? *(alias: KW5, FI1)*

| | |
| --- | --- |
| **Options** | **A)** Hard move-cap → draw · **B)** Repetition/position draw · **C)** Neither (leave open) |
| **Recommended** | **B** — `docs/RULES-DECISIONS-2026-10-07.md` H2 |
| **Evidence** | `docs/RULES-DECISIONS-2026-10-07.md` H2; engine coverage skips termination today |
| **If deferred** | Random/AI play can loop forever on Kwatro/FIAR. |
| **Your answer** | ☐ A · ☐ B · ☐ C |

#### D14 — H1 / KW2 — Kwatro winning path may have empty gaps? *(alias: KW2; pairs with D10)*

| | |
| --- | --- |
| **Options** | **Yes** (gaps OK, PDF) · **No** (keep contiguous tip) |
| **Recommended** | **Yes** — Div II Highlights; same recommend as D10→B when ready |
| **Evidence** | `docs/RULES-DECISIONS-2026-10-07.md` H1; [#393](https://github.com/fuzzywigg/math-pentathlon/pull/393) PDF quote; tip `rules.ts:370` stops at empty |
| **If deferred** | Contiguous tip stays; PDF mismatch remains. |
| **Your answer** | ☐ Yes · ☐ No |

#### D15 — H3 / RI1 — Remainder Islands: last skip at 0 turns must end game?

| | |
| --- | --- |
| **Options** | **Yes** · **No** |
| **Recommended** | **Yes** — `docs/RULES-DECISIONS-2026-10-07.md` H3 |
| **Evidence** | Same file H3/RI1; soft-lock risk without settle |
| **If deferred** | Soft-lock possible when turns hit 0 without `gameOver`. |
| **Your answer** | ☐ Yes · ☐ No |

#### D16 — H4 / KQ1 — Kings mutual trap → draw (not player1)?

| | |
| --- | --- |
| **Options** | **Yes** (= draw) · **No** (= keep player1) |
| **Recommended** | **Yes** — H4 |
| **Evidence** | `docs/RULES-DECISIONS-2026-10-07.md` H4/KQ1 |
| **If deferred** | Mutual trap still awards player1. |
| **Your answer** | ☐ Yes · ☐ No |

#### D17 — H5 / HG1 — Hex-a-Gone `canPlayerMove` must be fit-aware?

| | |
| --- | --- |
| **Options** | **Yes** · **No** |
| **Recommended** | **Yes** — H5 |
| **Evidence** | `docs/RULES-DECISIONS-2026-10-07.md` H5/HG1 |
| **If deferred** | Pass / last-move-wins may never fire when shapes don’t fit. |
| **Your answer** | ☐ Yes · ☐ No |

#### D18 — KW1 — Kwatro diagonals only center 3×3?

| | |
| --- | --- |
| **Options** | **A)** Keep 3×3 · **B)** Expand (specify) |
| **Recommended** | **A** — until star-board rebuild |
| **Evidence** | `docs/RULES-DECISIONS-2026-10-07.md` KW1; [#393](https://github.com/fuzzywigg/math-pentathlon/pull/393)/[#394](https://github.com/fuzzywigg/math-pentathlon/pull/394) open Q |
| **If deferred** | 3×3 stays. |
| **Your answer** | ☐ A · ☐ B: ___ |

#### D19 — KW3 — Ban wins that “cross yellow middle” on 5×5?

| | |
| --- | --- |
| **Options** | **A)** Defer · **B)** Ban (specify cells) |
| **Recommended** | **A** — don’t invent yellow without kit map |
| **Evidence** | `docs/RULES-DECISIONS-2026-10-07.md` KW3; [#393](https://github.com/fuzzywigg/math-pentathlon/pull/393) Yes/no #2 |
| **If deferred** | Same as A. |
| **Your answer** | ☐ A · ☐ B: ___ |

#### D20 — KW4 — Longer occupied line: allow 3-chip subset win?

| | |
| --- | --- |
| **Options** | **A)** Keep subsets · **B)** Invalidate if >3 chips on that line |
| **Recommended** | **B** once gaps (D14) ship |
| **Evidence** | `docs/RULES-DECISIONS-2026-10-07.md` KW4 |
| **If deferred** | Subset wins stay. |
| **Your answer** | ☐ A · ☐ B |

#### D21–D29 — Remaining unique rules IDs (answer or leave blank)

Each recommend copied from `docs/RULES-DECISIONS-2026-10-07.md`. Skip any you are not changing this window.

| ID | Question (short) | Options | Rec | Evidence | If deferred |
| --- | --- | --- | --- | --- | --- |
| **D21 FI2** | No legal move in FIAR move phase = auto draw in rules? | Yes / No | Yes | RULES FI2 | Observational draw only |
| **D22 KQ2** | Skip Quadraphage place when supply 0? | Yes / No | Yes | RULES KQ2 | Keep skip; tutorial mismatch |
| **D23 FA1** | Fab equal claims → draw (not p2)? | Yes / No | Yes | RULES FA1 | p2 still wins ties |
| **D24 FA2** | Pass ends when opponent has no pairs? | Yes / No | Yes | RULES FA2 | Comment/tutorial drift |
| **D25 HG2** | Teach Hex-a-Gone 1-cell + Confirm (not “big shapes”)? | Yes / No | Yes | RULES HG2 | Tutorial stays wrong |
| **D26 HG3** | Log full committed selection in `blocksPlaced`? | A keep / B full | B later | RULES HG3 | Replay honesty wait |
| **D27 PG1** | Prime Gold board full → most veins wins? | Yes / No | Yes | RULES PG1; pairs D12 | Endless Roll/Pass |
| **D28 PG2** | Chip supply floor at 0? | Yes / No | Yes | RULES PG2; pairs D12 | Negative chips / soft-lock |
| **D29 bundle** | Remaining RULES IDs (JG1–2, RM1, SB1–3, ST1–2, SD1–2, P55-1–3, CA1–3, CT1–2, PE1, FF1–2, X1–3) | See tip file | See tip file | `docs/RULES-DECISIONS-2026-10-07.md` from JG1 onward | Unanswered stay as tip engine |

**D29 your notes:** _________________________________

---

### §3 — Math precision deferred fixes (#540) — optional this window

Source: [#540](https://github.com/fuzzywigg/math-pentathlon/pull/540) `docs/dev/math-precision-owner-decisions.md`. Proposed code is `it.skip` only until you answer. **Do not fold #535.**

| ID | Question | Options | Rec from #540 | Evidence | If deferred |
| --- | --- | --- | --- | --- | --- |
| **D30 MP-PRIME-01** | Tighten Prime Gold `isPrime` to reject non-integers/NaN? | Yes change / No keep / Other | *(owner)* — live dice likely unaffected but scoring-predicate | #540 MP-PRIME-01; tip `src/games/prime-gold/types.ts` `isPrime` | Non-int “primes” stay true |
| **D31 MP-PRIME-02** | Same for attributes `isPrime` (+ `i*i<=n`)? | Yes / No / Lockstep only | *(owner)* keep lockstep with D30 | #540 MP-PRIME-02; `src/core/attributes/logic.ts` | Two `isPrime`s may diverge |
| **D32 MP-NEGATE-01** | Fix `negate` via `signedNumerator`? | Yes fix / No keep | *(owner)* unused by games today | #540 MP-NEGATE-01; `src/core/fractions/arithmetic.ts` | Flag-neg round-trip stays wrong |
| **D33 MP-WHOLE-01** | Tighten `isWholeNumber` integer gate? | Yes / No | *(owner)* | #540 MP-WHOLE-01 | Float `%` coincidence stays |
| **D34 MP-SQUARE-01** | Tighten `isPerfectSquare`? | Yes / No | *(owner)* | #540 MP-SQUARE-01 | Attr metadata only |
| **D35 MP-LCM-01** | Reorder `lcm` to `(a/gcd)*b`? | Yes / No | *(owner)* — Fab-a-Diffy path | #540 MP-LCM-01 | Overflow-order risk near huge ints |

---

### §4 — Type-ratchet deferred runtime fixes (#546) — optional

Source: [#546](https://github.com/fuzzywigg/math-pentathlon/pull/546) `docs/dev/type-ratchet-batch2-owner-decisions.md`. Compliant recut uses `!` only. Answer **Yes** only if you want the #537-style runtime soften.

| ID | Topic | Options | Rec | Evidence | If deferred |
| --- | --- | --- | --- | --- | --- |
| **D36 TR-B2-01** | frac-fact empty-table → `{1,2}` fallback? | Yes fallback / No assert | **No assert** (don’t invent problems) | #546 TR-B2-01; `frac-fact/rules.ts` ~67 | Keep tip throw-on-empty |
| **D37 TR-B2-02** | frac-fact undefined strategy → `null`? | Yes soft-miss / No assert | **No assert** | #546 TR-B2-02 | Keep hard fail |
| **D38 TR-B2-03** | shuffleArray skip holes? | Yes skip / No swap | **No swap** | #546 TR-B2-03 (4 games) | Dense arrays unchanged |
| **D39 TR-B2-04** | frac-fact op default `'add'`? | Yes / No | **No** | #546 TR-B2-04 | Keep assert |
| **D40 TR-B2-05** | pinball undefined strategy → continue? | Yes / No | **No** | #546 TR-B2-05 | Keep throw |
| **D41 TR-B2-06** | pinball fraction fallback `1/2`? | Yes / No | **No** | #546 TR-B2-06 | Keep assert |
| **D42 TR-B2-07** | pinball `hitRandomTarget` harden? | Yes / No | **No** (scoring-adjacent) | #546 TR-B2-07 | Keep assert |
| **D43 TR-B2-08** | queens-guards skip undefined adjacent? | Yes / No | **No** (move-set risk) | #546 TR-B2-08 | Keep throw |
| **D44 TR-B2-09** | queens-guards `parseKey` default 0? | Yes / No | **No** | #546 TR-B2-09 | Malformed → undefined |
| **D45 TR-B2-10** | ramrod skip missing sums? | Yes / No | **No** (geometry) | #546 TR-B2-10 | Keep throw |
| **D46 TR-B2-11** | ramrod skip missing rods in deal? | Yes / No | **No** | #546 TR-B2-11 | Keep throw |
| **D47 TR-B2-12** | ramrod color `#888888` fallback? | Yes / No | **No** | #546 TR-B2-12 | Keep undefined color |
| **D48 TR-B2-13** | ramrod counts `?? 0`? | Yes / No | **No** (equivalent today) | #546 TR-B2-13 | Keep `!` |
| **D49 TR-B2-14** | sum-dominoes soft board guards? | Yes / No | **No** (legality/win path) | #546 TR-B2-14 | Keep throw |
| **D50 TR-B2-15** | calla pits `?? 0` coalesce? | Yes / No | **No** (sow/capture) | #546 TR-B2-15 | Keep `!` |
| **D51 TR-B2-16** | calla `getLastMoveInfo` null on hole? | Yes / No | **No** (display only; still soft) | #546 TR-B2-16 | Keep `!` |

#### D52 — Authorize a future Batch-3 **rules/AI** type-ratchet gate?

| | |
| --- | --- |
| **Question** | [#544](https://github.com/fuzzywigg/math-pentathlon/pull/544) cleared 77 UI/shell errors; **167** rules/AI/engine errors deferred. Allow a later Batch A (AI) / rules batch with explicit gate? |
| **Options** | **A)** Defer indefinitely (UI-only for now) · **B)** Authorize Batch A AI-only later · **C)** Authorize rules+AI later after D36–D51 style checklist |
| **Recommended** | **A** for this window; **B** only with a separate burn after land — [#544](https://github.com/fuzzywigg/math-pentathlon/pull/544) / [#538](https://github.com/fuzzywigg/math-pentathlon/pull/538) policy. |
| **Evidence** | [#544](https://github.com/fuzzywigg/math-pentathlon/pull/544) `docs/dev/type-ratchet-batch3-deferred.md` (167 deferred; contig-60/stars-bars/juggle/kwatro/hex/pent/kings) |
| **If deferred** | Ceiling stays; AI/rules files remain out-of-scope. |
| **Your answer** | ☐ A · ☐ B · ☐ C |

---

### §5 — Violation close checklist (batch confirm)

Confirm close (no fold) for each. **Recommended: Close** for all — [#545](https://github.com/fuzzywigg/math-pentathlon/pull/545) §(e).

| ID | PR | Why violation | Rec | Your answer |
| --- | ---: | --- | --- | --- |
| **D53** | [#419](https://github.com/fuzzywigg/math-pentathlon/pull/419) | remainder-islands `ai.ts` scoring | Close | ☐ Close · ☐ Keep |
| **D54** | [#428](https://github.com/fuzzywigg/math-pentathlon/pull/428) | juggle `ai.ts`/`rules.ts` passTurn | Close | ☐ Close · ☐ Keep |
| **D55** | [#429](https://github.com/fuzzywigg/math-pentathlon/pull/429) | hex-a-gone AI lookahead caps | Close | ☐ Close · ☐ Keep |
| **D56** | [#468](https://github.com/fuzzywigg/math-pentathlon/pull/468) | AI calibration retunes | Close | ☐ Close · ☐ Keep |
| **D57** | [#487](https://github.com/fuzzywigg/math-pentathlon/pull/487) | player-facing copy polish | Close | ☐ Close · ☐ Keep |
| **D58** | [#488](https://github.com/fuzzywigg/math-pentathlon/pull/488) | FIAR/Pent AI difficulty retune | Close | ☐ Close · ☐ Keep |
| **D59** | [#492](https://github.com/fuzzywigg/math-pentathlon/pull/492) | tutorial/help rules-text | Close | ☐ Close · ☐ Keep |
| **D60** | [#535](https://github.com/fuzzywigg/math-pentathlon/pull/535) | scoring helpers (`isPrime`/…) — use #540 | Close | ☐ Close · ☐ Keep |
| **D61** | [#537](https://github.com/fuzzywigg/math-pentathlon/pull/537) | rules `??` / soft no-ops — use #546 | Close | ☐ Close · ☐ Keep |

---

### Quick reply template

```
D01:
D02:
D03:
D04:
D05:
D06:
D07:
D08:
D09:
D10:
D11:
D12:
D13:
D14:
D15:
D16:
D17:
D18:
D19:
D20:
D21–D29: (see notes)
D30–D35:
D36–D51: (default No unless noted)
D52:
D53–D61: Close all? 
```

---

## 2. Landing runbook — tip → `alpha` (non-expert)

**Goal:** Land **only** the tip branch into `alpha`. Do **not** push to `main`. Do **not** merge other drafts in the same click.

### Before you start

- [ ] You answered **D01=A** (or your chosen timing) and **D07** eyeball as needed.
- [ ] Tip SHA you intend to land is written here: `________________` (example at sheet time: `6b5a2270`).
- [ ] You are **not** landing #393/#418/#535/#537/etc. unless D10–D12 say so.

### Step 0 — Tools

```bash
# macOS/Linux; needs git + gh authenticated as you
git --version
gh auth status
```

### Step 1 — Fetch and record SHAs

```bash
cd /path/to/math-pentathlon
git fetch origin alpha cursor/integration-fold-wave5-tip-4af0

TIP=$(git rev-parse origin/cursor/integration-fold-wave5-tip-4af0)
ALPHA=$(git rev-parse origin/alpha)
echo "TIP=$TIP"
echo "ALPHA=$ALPHA"

# Must print: 0 <large>   meaning alpha has 0 commits tip lacks; tip is ahead
git rev-list --left-right --count origin/alpha...origin/cursor/integration-fold-wave5-tip-4af0

# Must succeed (alpha is ancestor of tip = fast-forward stack)
git merge-base --is-ancestor origin/alpha origin/cursor/integration-fold-wave5-tip-4af0 && echo "FF-OK"
```

**Green looks like:** `FF-OK`; left count `0`; right count hundreds (362 at sheet time).

### Step 2 — Dry-run merge locally (never push)

```bash
git checkout -B scratch/tip-to-alpha-dryrun origin/alpha
git merge --no-commit --no-ff origin/cursor/integration-fold-wave5-tip-4af0
echo "MERGE_EXIT=$?"
# Expect Automatic merge went well; MERGE_EXIT=0
git merge --abort
git checkout -
git branch -D scratch/tip-to-alpha-dryrun
```

**Verified at sheet authoring (recorded):**

```text
MERGE_EXIT=0
Automatic merge went well; stopped before committing as requested
status_lines=1058
aborted_ok=0
TIP tip = 6b5a2270
ALPHA   = eec2b327
rev-list left-right = 0  362
```

### Step 3 — Re-run gates on tip tip (if D02=Yes)

```bash
git checkout cursor/integration-fold-wave5-tip-4af0
git pull origin cursor/integration-fold-wave5-tip-4af0
npm ci
npm run lint                 # exit 0
npx tsc --noEmit             # exit 0
npm run test:unit            # exit 0 (if flake: rerun once; see D06)
npm run build                # exit 0
CI=true npm run test:e2e:chromium   # exit 0; @fullgame excluded as in CI
```

**Green looks like:** all exit **0**. Preflight [#547](https://github.com/fuzzywigg/math-pentathlon/pull/547) reference: lint/tsc/build/e2e 0; unit confirmation 3084 files / 11424 tests.

Optional hard-rule spot checks:

```bash
rg -n "hard: 450" src/games/hex/ai.ts
rg -n "do not cap" src/games/stars-bars/board-ui.ts
rg -n "permissions:|persist-credentials" .github/workflows/ci.yml | head
```

### Step 4 — Open (or reuse) a **tip → alpha** PR

Note: existing [#477](https://github.com/fuzzywigg/math-pentathlon/pull/477) is currently based on **wave4 tip**, not `alpha`. Prefer a dedicated land PR:

```bash
# Creates a PR tip → alpha (draft first if you want; mark ready yourself)
gh pr create \
  --repo fuzzywigg/math-pentathlon \
  --base alpha \
  --head cursor/integration-fold-wave5-tip-4af0 \
  --title "Land wave5 tip into alpha (Oct 9 merge window)" \
  --body "$(cat <<'EOF'
Lands cursor/integration-fold-wave5-tip-4af0 alone into alpha.
Tip SHA: <paste TIP>
Preflight: #547 CONDITIONAL GO (re-verified locally).
Decision sheet: docs/dev/merge-window-decision-sheet-2026-10-09.md
Does not include held violation PRs (#419/#428/#429/#468/#487/#488/#492/#535/#537).
EOF
)"
```

Or retarget #477 to `alpha` in the GitHub UI (**Base:** `alpha`) — only if you understand that changes the PR’s compare base.

### Step 5 — Wait for required CI on that PR

On GitHub Actions for the tip→`alpha` PR, required jobs (names may vary slightly) should be green:

| Gate | What “green” means |
| --- | --- |
| lint / typecheck | exit 0 |
| unit | exit 0 |
| build | exit 0 |
| e2e chromium | exit 0 (`test:e2e:chromium`; fullgame report-only) |
| permissions | still `contents: read`, `persist-credentials: false` |

Report-only jobs (fullgame, cross-browser, mobile, size) may be yellow/`continue-on-error` — **not** blockers unless you chose D08=B.

### Step 6 — Merge (human only)

Prefer **merge commit** or **squash** of the **one** tip→`alpha` PR. Do **not** merge the 24 category-(c) drafts in the same action.

```bash
# After you click Merge in the UI (or):
gh pr merge <TIP_TO_ALPHA_PR_NUMBER> --merge
# Verify alpha tip:
git fetch origin alpha
git log -1 --oneline origin/alpha
```

### Step 7 — Deploy check

`alpha` pushes trigger `.github/workflows/deploy.yml` → Cloudflare Pages project `math-pentathlon`, branch `alpha`. Live site: **https://math.pappas.work**

```bash
gh run list --repo fuzzywigg/math-pentathlon --branch alpha --workflow deploy.yml --limit 3
```

**Green:** newest Deploy run success; site loads menu.

### Step 8 — Housekeeping (after land; human)

- Close contained drafts listed in [#545](https://github.com/fuzzywigg/math-pentathlon/pull/545) §(a)/(b) when ready.
- Close violations D53–D61 if you answered Close.
- Leave category-(c) for tip owner to retarget onto `alpha` / new tip.

---

## 3. Post-landing smoke checklist

Run against **https://math.pappas.work** (or local `npm run dev` → http://localhost:5173). Hash routes: `#/game/<id>`.

### Shell

| # | Open | Click / do | Expect |
| --- | --- | --- | --- |
| S1 | `/#/` (home) | Wait for menu | Division cards visible; no blank screen; console free of uncaught errors |
| S2 | Home | Open Division I | Game tiles for Div I appear |
| S3 | Any game tile | Back / menu control | Returns to menu without stuck overlay |
| S4 | DevTools → Application → Service Worker (optional) | Note SW present after first visit | Precache updates; offline soft-nav still optional |

### Spot games (2D) — one short play each

| # | URL | Click / do | Expect |
| --- | --- | --- | --- |
| G1 | `#/game/hex` | Human vs Human; place 2–3 stones each | Board accepts clicks; turn indicator updates; **no** multi-second Hard freeze if you switch to vs AI Hard later |
| G2 | `#/game/kwatro-sinko` | Place chips; try a straight line | Moves legal; win scan still **contiguous** unless you landed D10=B |
| G3 | `#/game/fiar` | Place through placement → move phase | Phase banner/status changes; nodes tappable on tablet if #418 not folded |
| G4 | `#/game/prime-gold` | Vs AI Easy; Roll a few times | Eventually progresses (watch for Roll/Pass loop — known if D12 held) |
| G5 | `#/game/stars-bars` | Play until several moves in history | Move History lists **all** moves (not trimmed) |
| G6 | `#/game/queens-guards` | One capture sequence | Pieces move; no console throw |
| G7 | `#/game/remainder-islands` | Skip / select until turns drop | No soft-lock at 0 turns **if** D15 fixed; else note bug |
| G8 | `#/game/kings-quadraphages` | Trap attempt | Game ends or continues per engine; mutual trap behavior per D16 |
| G9 | `#/game/calla` | Sow from a pit | Cubes distribute; UI counts update |
| G10 | `#/game/pent-em-in` | Select piece → place / choose another | Escape from bad selection still works (tip polish) |

### Optional 3D / a11y

| # | Do | Expect |
| --- | --- | --- |
| A1 | `#/game/hex?board3d=1` (if offered) | Canvas appears without endless “loading” |
| A2 | Tab through menu | Focus ring visible; Enter opens a game |
| A3 | OS reduced-motion on | No large glowing thrash on boards |

### Fail → rollback

If S1 fails (blank menu) or ≥2 games throw on open, **stop playtesting** and use §4 rollback.

---

## 4. Rollback recipe

### Option A — Revert the merge commit on `alpha` (preferred)

```bash
git fetch origin alpha
git log -5 --oneline origin/alpha
# Identify the tip-land merge commit, e.g. MMMMMMM

# Local verify only first:
git checkout -B scratch/alpha-rollback origin/alpha
git revert -m 1 MMMMMMM --no-edit
# build/test quickly:
npm ci && npm run lint && npx tsc --noEmit && npm run build

# If good, YOU (Andrew) push alpha — agents must not:
# git push origin scratch/alpha-rollback:alpha
# Or open a PR scratch → alpha titled "Rollback tip land MMMMMMM"
git checkout -
git branch -D scratch/alpha-rollback
```

**Verify rollback:**

```bash
git fetch origin alpha
git merge-base --is-ancestor MMMMMMM origin/alpha && echo "still contains land" || echo "land gone"
# Site: hard-refresh https://math.pappas.work — menu matches pre-land behavior
```

### Option B — `git revert` range if squash-landed

```bash
# If tip was squashed as single commit SSSS on alpha:
git revert SSSS --no-edit
# same verify + human push/PR as above
```

### Option C — Cloudflare / DNS emergency

If `alpha` git is fine but Pages is wrong: re-run Deploy workflow on `alpha` (`gh workflow run deploy.yml --ref alpha`) or wait for the rollback push’s deploy. Do **not** change DNS unless deploy docs require it.

### What rollback does **not** undo

- Closed GitHub PRs stay closed (re-open manually if needed).
- Cloudflare preview aliases for other branches unchanged.
- Local `node_modules` — re-`npm ci` after checkout.

---

## 5. Verification appendix (this sheet’s authoring)

| Check | Result |
| --- | --- |
| Tip SHA | `6b5a22701e37b0e8000761189d457b3ce90ae8cf` |
| Alpha SHA | `eec2b327c1e65586537cbe03b1c29b93065dee03` |
| `rev-list --left-right` | `0	362` |
| Dry-run `git merge --no-commit --no-ff` tip→alpha scratch | **MERGE_EXIT=0**, then `git merge --abort` OK |
| Hex Hard 450 | Confirmed `src/games/hex/ai.ts:21` |
| Stars & Bars uncapped | Confirmed `src/games/stars-bars/board-ui.ts:747` |
| #393 revert on tip ancestry | `55b4212d` present |
| Overlap with other drafts | No existing “merge-window-decision” PR; distinct from #545 triage / #547 preflight / #542 rehearsal |

### What this agent did / did not do

**Did:** Read listed source PRs/files; dry-run merge; write this sheet only.  
**Did not:** Decide for Andrew; change product code; edit/comment/close other PRs; push `alpha`/`main`.

---

## Next action

**Next action: fold into tip by the tip owner** (docs-only). Andrew uses §1 answers during the Fri Oct 9 PM window; tip owner lands tip→`alpha` per §2 after those answers.
