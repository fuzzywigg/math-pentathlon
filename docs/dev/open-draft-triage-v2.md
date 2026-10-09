# Open draft PR triage v2 — 2026-10-08 (refresh for Oct 14)

**Task id:** `burn-1008-mp-open-draft-triage-v2`  
**Tip branch:** `cursor/integration-fold-wave5-tip-4af0`  
**Tip SHA checked:** `69a53b16f59cec2c53b98b410cd5a3e474a33d55` (`69a53b16f59c`)  
**Prior triage:** #545 / docs/dev/open-draft-triage-2026-10-08.md (tip was `5f5712366d20` / earlier `7b99c2bb`)  
**Open PRs enumerated:** 129 (via `gh pr list --state open`, includes this #575 + concurrent #574)  
**Andrew bulk-close window:** after **2026-10-14** (approved)  
**Scope:** report only — no PR closes, comments, labels, edits, merges, or ready-for-review flips.

## Summary counts

| Category | Count | Recommended default action |
| --- | ---: | --- |
| FOLDED | 92 | close (Oct 14) |
| SUPERSEDED | 7 | close (Oct 14) |
| VIOLATION | 11 | close (Oct 14); do not fold |
| RESIDUAL | 13 | salvage/fold (see list) |
| OWNER-OPTION | 6 | hold for owner |
| **Total (each open PR once)** | **129** | |

## Method (diff vs tip, not titles)

1. `gh pr list --repo fuzzywigg/math-pentathlon --state open --limit 500 --json number,title,headRefName,baseRefName,isDraft,headRefOid,url` → **129** open PRs (re-checked after opening this triage).
2. Live tip `69a53b16f59c` on `cursor/integration-fold-wave5-tip-4af0` (ff-only from `origin`).
3. For every open PR: `git fetch origin pull/$N/head:refs/triage-v2/pr-$N`, then:
   - `git merge-base --is-ancestor refs/triage-v2/pr-$N $TIP`
   - `git cherry $TIP refs/triage-v2/pr-$N`
   - `git diff --name-only $(git merge-base $TIP refs/triage-v2/pr-$N) refs/triage-v2/pr-$N` + per-path `git rev-parse $TIP:$path` vs `head:$path` blob identity
   - `git log --oneline --grep=#$N $TIP` for merge/fold/port/supersede cites
   - Hard-rule scan on residual/different paths (`ai.ts`, `rules.ts`, `tutorial.ts`, copy/registry, Stars & Bars history cap, Hex Hard 450ms assert)
4. Tip owner is restoring alpha AI/copy surfaces on #477 — **not evaluated here**; #559/#560/#570 held as OWNER-OPTION.
5. PR #541 dead-code cleanup already merged into tip as FOLD LAST (cc4120d2); not in open set. No successor dead-code PR remains open.
6. Concurrent open drafts #574 (engine coverage round 2) and #575 (this triage) classified after initial 127-PR pass.

## Exact compare commands (per PR)

```bash
TIP=69a53b16f59cec2c53b98b410cd5a3e474a33d55  # or: git rev-parse origin/cursor/integration-fold-wave5-tip-4af0
N=<pr-number>
git fetch origin pull/$N/head:refs/triage-v2/pr-$N
git merge-base --is-ancestor refs/triage-v2/pr-$N $TIP; echo ancestor_exit=$?
git cherry $TIP refs/triage-v2/pr-$N | tee /tmp/cherry-$N.txt | grep -c "^+ " || true
MB=$(git merge-base $TIP refs/triage-v2/pr-$N)
git diff --name-only $MB refs/triage-v2/pr-$N | while read p; do
  tb=$(git rev-parse "$TIP:$p" 2>/dev/null || echo MISSING)
  hb=$(git rev-parse "refs/triage-v2/pr-$N:$p")
  [ "$tb" = "$hb" ] && echo IDENT "$p" || echo DIFF "$p" tip=${tb:0:12} head=${hb:0:12}
done
git diff --stat $TIP...refs/triage-v2/pr-$N
git log --oneline --grep="#$N" $TIP | head
```

## Spot-check: ≥10 FOLDED verdicts (hunk / blob evidence)

| PR | Commands / checks | Result |
| ---: | --- | --- |
| #415 | `git merge-base --is-ancestor refs/triage-v2/pr-415 69a53b16f59c` → true; `git cherry` → 0 unique; tip log `d5ec4c17 merge(#415)` | **PASS FOLDED** |
| #421 | ancestor true; cherry 0; tip log `536a5e33 merge(#421)` | **PASS FOLDED** |
| #435 | ancestor true; cherry 0; tip log `ad51c815 merge(#435)` | **PASS FOLDED** |
| #442 | ancestor true; cherry 0; tip log `9e2d28d1 merge: fold wave2 (#442,…)` | **PASS FOLDED** |
| #459 | cherry +1 but both PR paths blob-identical on tip: `docs/engine-coverage-remaining-2026-10-07.md`=`91030ddc5a3b`, `tests/unit/engine-coverage-hex-a-gone-targeted.test.ts`=`8514813fbac4` | **PASS FOLDED** |
| #467 | ancestor true; cherry 0; tip log `fbb3411b merge: wave4 (…+#467)` | **PASS FOLDED** |
| #355 | tip `942927a4 docs(mp3d): fold #355…`; 10/10 PR paths blob-identical (e.g. `docs/mp3d/spec-contig-60.md`=`2c640e57b074`) | **PASS FOLDED** |
| #451 | tip `7890fac2 fix(a11y): fold #451 collectGridCells MP-3D mirror filter`; unit test blob-identical `e90b3862df1f`; tip `board-a11y.ts` is superset containing the mirror-filter hunk (`collectGridCells` filter `closest('[class*="-a11y-grid"]')`) | **PASS FOLDED** |
| #505 | tip `7b99c2bb test(e2e): fold #505 fullgame suite…`; 22/27 PR paths blob-identical (e.g. `tests/e2e/fullgame/_harness.ts`=`339ef191571a`); remaining diffs are tip CI/contract unions | **PASS FOLDED** |
| #528 | tip `c9c54a94 merge(#528): safe Web Storage…`; `src/core/safe-web-storage.ts` present on tip (185 lines); several PR paths still IDENT (`feature-flags`, `url-flags`, `storage-blocked.spec.ts`) | **PASS FOLDED** |
| #553 | tip `f6c7018f fix(types): fold #553 Batch-5…`; IDENT e.g. `src/games/contig-60/board-ui.ts`=`c489b1877ba9` | **PASS FOLDED** |
| #554 | cherry 0; `docs/dev/LICENSES.md` tip blob `f91d7dfd4c09` == head blob (landed via `0e07c39c`) | **PASS FOLDED** |

## Oct 14 ready-to-run close list

One-line close comment per PR. **Do not run these until Oct 14** (this triage is report-only).

### FOLDED + SUPERSEDED + VIOLATION (close)

| PR | Category | One-line close comment |
| ---: | --- | --- |
| #355 | FOLDED | Superseded/folded into tip 69a53b16f59c: 942927a4 docs(mp3d): fold #355 Step-0 kings/kwatro 3D specs. Closing as FOLDED per burn-1008 open-draft-triage-v2 (Oct 14 bulk-close). |
| #392 | FOLDED | Superseded/folded into tip 69a53b16f59c: cd11d6af integration: merge PR #392 — Polish offline / tablet playability. Closing as FOLDED per burn-1008 open-draft-triage-v2 (Oct 14 bulk-close). |
| #394 | VIOLATION | Hard-rule violation (player-facing tutorial rules-text + rules.ts comment/lock coupled to Div II path policy…). Do not fold. Closing per burn-1008 open-draft-triage-v2 (Oct 14 bulk-close). |
| #395 | FOLDED | Superseded/folded into tip 69a53b16f59c: c9ac456b integration: merge PR #395 — perf offline/lazy shell (resolve main.ts). Closing as FOLDED per burn-1008 open-draft-triage-v2 (Oct 14 bulk-close). |
| #397 | FOLDED | Superseded/folded into tip 69a53b16f59c: 0acfb05d integration: merge PR #397 — hex/queens/kings polish (resolve style.css). Closing as FOLDED per burn-1008 open-draft-triage-v2 (Oct 14 bulk-close). |
| #398 | FOLDED | Superseded/folded into tip 69a53b16f59c: 61bddb46 integration: merge PR #398 — fix: polish Remainder Islands & Sum Dominoes playability. Closing as FOLDED per burn-1008 open-draft-triage-v2 (Oct 14 bulk-close). |
| #399 | FOLDED | Superseded/folded into tip 69a53b16f59c: e2e02bf8 integration: merge PR #399 — PWA tablet icons (resolve index.html). Closing as FOLDED per burn-1008 open-draft-triage-v2 (Oct 14 bulk-close). |
| #406 | FOLDED | Superseded/folded into tip 69a53b16f59c: 97d1068b integration: merge PR #406 — calla/frac-pinball polish (resolve style.css). Closing as FOLDED per burn-1008 open-draft-triage-v2 (Oct 14 bulk-close). |
| #407 | FOLDED | Superseded/folded into tip 69a53b16f59c: f6e73071 integration: merge PR #407 — fix(juggle): AI-seat input lock, aria honesty, touch, reduced-motion. Closing as FOLDED per burn-1008 open-draft-triage-v2 (Oct 14 bulk-close). |
| #408 | FOLDED | Superseded/folded into tip 69a53b16f59c: b38aebae integration: merge PR #408 — fix(a11y): shell/menu focus-visible + reduced-motion keepers. Closing as FOLDED per burn-1008 open-draft-triage-v2 (Oct 14 bulk-close). |
| #409 | FOLDED | Superseded/folded into tip 69a53b16f59c: a1669b07 integration: merge PR #409 — fix(kings): AI-seat aria honesty + input-lock regression guard. Closing as FOLDED per burn-1008 open-draft-triage-v2 (Oct 14 bulk-close). |
| #410 | FOLDED | Superseded/folded into tip 69a53b16f59c: f9ae60b5 integration: merge PR #410 — fix(fiar): AI-seat aria honesty, 44px touch, reduced-motion. Closing as FOLDED per burn-1008 open-draft-triage-v2 (Oct 14 bulk-close). |
| #411 | FOLDED | Superseded/folded into tip 69a53b16f59c: 5a3b5c14 integration: merge PR #411 — fix(hex): coarse 44px cell targets + reduced-motion board glow. Closing as FOLDED per burn-1008 open-draft-triage-v2 (Oct 14 bulk-close). |
| #412 | FOLDED | Superseded/folded into tip 69a53b16f59c: ffc43563 integration: merge PR #412 — fix(star-track): AI-seat input lock, aria honesty, touch, reduced-motion. Closing as FOLDED per burn-1008 open-draft-triage-v2 (Oct 14 bulk-close). |
| #415 | FOLDED | Superseded/folded into tip 69a53b16f59c: d5ec4c17 merge(#415): playtest recheck polish into playability stack-2. Closing as FOLDED per burn-1008 open-draft-triage-v2 (Oct 14 bulk-close). |
| #416 | FOLDED | Superseded/folded into tip 69a53b16f59c: a34eea2a merge(#416): Kwatro AI long-game thrash fix (playability only). Closing as FOLDED per burn-1008 open-draft-triage-v2 (Oct 14 bulk-close). |
| #417 | FOLDED | Superseded/folded into tip 69a53b16f59c: dc241b1d merge(#417): Pent'Em In place-piece legal highlights + escape. Closing as FOLDED per burn-1008 open-draft-triage-v2 (Oct 14 bulk-close). |
| #418 | VIOLATION | Hard-rule violation (prime-gold rules settle helpers + ai.ts pass-on-empty-chips; FIAR touch adjacent to move-p…). Do not fold. Closing per burn-1008 open-draft-triage-v2 (Oct 14 bulk-close). |
| #419 | VIOLATION | Hard-rule violation (remainder-islands ai.ts scoring/pacing + rules.ts paths…). Do not fold. Closing per burn-1008 open-draft-triage-v2 (Oct 14 bulk-close). |
| #420 | FOLDED | Superseded/folded into tip 69a53b16f59c: d7108a59 docs(test): fold safe standalone drafts onto wave4 tip. Closing as FOLDED per burn-1008 open-draft-triage-v2 (Oct 14 bulk-close). |
| #421 | FOLDED | Superseded/folded into tip 69a53b16f59c: 536a5e33 merge(#421): Sum Dominoes deep-playtest into integration. Closing as FOLDED per burn-1008 open-draft-triage-v2 (Oct 14 bulk-close). |
| #422 | FOLDED | Superseded/folded into tip 69a53b16f59c: 0b032fea merge(#422): Fab-a-Diffy deep-playtest into integration. Closing as FOLDED per burn-1008 open-draft-triage-v2 (Oct 14 bulk-close). |
| #423 | FOLDED | Superseded/folded into tip 69a53b16f59c: fdb423aa merge(#448): keyboard/SR a11y + e2e onto test-infra stack. Closing as FOLDED per burn-1008 open-draft-triage-v2 (Oct 14 bulk-close). |
| #424 | FOLDED | Superseded/folded into tip 69a53b16f59c: 677c0643 merge(#424): Fraction Pinball deep-playtest into integration. Closing as FOLDED per burn-1008 open-draft-triage-v2 (Oct 14 bulk-close). |
| #425 | FOLDED | Superseded/folded into tip 69a53b16f59c: 42397e1f merge(#425): Contig 60 deep-playtest into integration. Closing as FOLDED per burn-1008 open-draft-triage-v2 (Oct 14 bulk-close). |
| #426 | FOLDED | Superseded/folded into tip 69a53b16f59c: 1281e015 merge(#426): Kings deep-playtest into integration. Closing as FOLDED per burn-1008 open-draft-triage-v2 (Oct 14 bulk-close). |
| #427 | FOLDED | Superseded/folded into tip 69a53b16f59c: 1b570c66 merge(#427): Queens & Guards deep-playtest into integration. Closing as FOLDED per burn-1008 open-draft-triage-v2 (Oct 14 bulk-close). |
| #428 | VIOLATION | Hard-rule violation (juggle ai.ts + rules.ts passTurn/shouldOfferPass legal-move/outcome changes…). Do not fold. Closing per burn-1008 open-draft-triage-v2 (Oct 14 bulk-close). |
| #429 | VIOLATION | Hard-rule violation (hex-a-gone ai.ts difficulty lookahead budget caps…). Do not fold. Closing per burn-1008 open-draft-triage-v2 (Oct 14 bulk-close). |
| #430 | FOLDED | Superseded/folded into tip 69a53b16f59c: 7a228d4c merge(#430): Calla deep-playtest into integration. Closing as FOLDED per burn-1008 open-draft-triage-v2 (Oct 14 bulk-close). |
| #431 | FOLDED | Superseded/folded into tip 69a53b16f59c: 0d72f286 merge(#431): Ramrod deep-playtest into playability stack-2. Closing as FOLDED per burn-1008 open-draft-triage-v2 (Oct 14 bulk-close). |
| #432 | FOLDED | Superseded/folded into tip 69a53b16f59c: f399129c merge(#432): Stars & Bars deep-playtest into integration. Closing as FOLDED per burn-1008 open-draft-triage-v2 (Oct 14 bulk-close). |
| #433 | FOLDED | Superseded/folded into tip 69a53b16f59c: 970ac936 merge(#433): Par 55 deep-playtest into integration. Closing as FOLDED per burn-1008 open-draft-triage-v2 (Oct 14 bulk-close). |
| #434 | FOLDED | Superseded/folded into tip 69a53b16f59c: 32384566 merge(#434): Hex deep-playtest into playability stack-2. Closing as FOLDED per burn-1008 open-draft-triage-v2 (Oct 14 bulk-close). |
| #435 | FOLDED | Superseded/folded into tip 69a53b16f59c: aec5a21a docs: wave5 tip-alone merge path (#435/#482–#484). Closing as FOLDED per burn-1008 open-draft-triage-v2 (Oct 14 bulk-close). |
| #436 | FOLDED | Superseded/folded into tip 69a53b16f59c: c2a13d22 merge(#436): Star Track deep-playtest into playability stack-2. Closing as FOLDED per burn-1008 open-draft-triage-v2 (Oct 14 bulk-close). |
| #437 | FOLDED | Superseded/folded into tip 69a53b16f59c: ce872543 merge(#437): axe a11y sweep into playability stack-2. Closing as FOLDED per burn-1008 open-draft-triage-v2 (Oct 14 bulk-close). |
| #438 | FOLDED | Superseded/folded into tip 69a53b16f59c: tip 69a53b16f59c contains PR content (ancestor/blob identity). Closing as FOLDED per burn-1008 open-draft-triage-v2 (Oct 14 bulk-close). |
| #439 | FOLDED | Superseded/folded into tip 69a53b16f59c: 6e1d1c33 merge(#439): cross-browser smoke + shell CSS (onto playability stack). Closing as FOLDED per burn-1008 open-draft-triage-v2 (Oct 14 bulk-close). |
| #440 | FOLDED | Superseded/folded into tip 69a53b16f59c: tip 69a53b16f59c contains PR content (ancestor/blob identity). Closing as FOLDED per burn-1008 open-draft-triage-v2 (Oct 14 bulk-close). |
| #441 | SUPERSEDED | Superseded by 483; no unique content vs tip 69a53b16f59c. Closing per burn-1008 open-draft-triage-v2 (Oct 14 bulk-close). |
| #442 | FOLDED | Superseded/folded into tip 69a53b16f59c: 9e2d28d1 merge: fold wave2 (#442,#455,#456,#457,#458) onto flake-engine tip. Closing as FOLDED per burn-1008 open-draft-triage-v2 (Oct 14 bulk-close). |
| #443 | FOLDED | Superseded/folded into tip 69a53b16f59c: 76b1af78 merge(#443): e2e 3D timeouts / mp3d ready helpers. Closing as FOLDED per burn-1008 open-draft-triage-v2 (Oct 14 bulk-close). |
| #444 | FOLDED | Superseded/folded into tip 69a53b16f59c: tip 69a53b16f59c contains PR content (ancestor/blob identity). Closing as FOLDED per burn-1008 open-draft-triage-v2 (Oct 14 bulk-close). |
| #445 | FOLDED | Superseded/folded into tip 69a53b16f59c: b046b5ae merge(#445): opt-in Playwright 2D visual regression suite. Closing as FOLDED per burn-1008 open-draft-triage-v2 (Oct 14 bulk-close). |
| #446 | FOLDED | Superseded/folded into tip 69a53b16f59c: 9ed6903c merge(#446): tutorial clarity copy onto test-infra stack. Closing as FOLDED per burn-1008 open-draft-triage-v2 (Oct 14 bulk-close). |
| #447 | FOLDED | Superseded/folded into tip 69a53b16f59c: tip 69a53b16f59c contains PR content (ancestor/blob identity). Closing as FOLDED per burn-1008 open-draft-triage-v2 (Oct 14 bulk-close). |
| #448 | FOLDED | Superseded/folded into tip 69a53b16f59c: fdb423aa merge(#448): keyboard/SR a11y + e2e onto test-infra stack. Closing as FOLDED per burn-1008 open-draft-triage-v2 (Oct 14 bulk-close). |
| #449 | FOLDED | Superseded/folded into tip 69a53b16f59c: tip 69a53b16f59c contains PR content (ancestor/blob identity). Closing as FOLDED per burn-1008 open-draft-triage-v2 (Oct 14 bulk-close). |
| #450 | FOLDED | Superseded/folded into tip 69a53b16f59c: f2675036 merge(#450): ramrod-deep mutual-place deadlock flake fix. Closing as FOLDED per burn-1008 open-draft-triage-v2 (Oct 14 bulk-close). |
| #451 | FOLDED | Superseded/folded into tip 69a53b16f59c: 7890fac2 fix(a11y): fold #451 collectGridCells MP-3D mirror filter. Closing as FOLDED per burn-1008 open-draft-triage-v2 (Oct 14 bulk-close). |
| #452 | FOLDED | Superseded/folded into tip 69a53b16f59c: 52b42071 merge(#452): engine invariant tests for six lowest-covered rules. Closing as FOLDED per burn-1008 open-draft-triage-v2 (Oct 14 bulk-close). |
| #453 | SUPERSEDED | Superseded by tip docs (#484/#485 merge-order/rehearsal); no unique content vs tip 69a53b16f59c. Closing per burn-1008 open-draft-triage-v2 (Oct 14 bulk-close). |
| #454 | FOLDED | Superseded/folded into tip 69a53b16f59c: 75b77d7c merge(#467): visual regression baselines (report-only CI). Closing as FOLDED per burn-1008 open-draft-triage-v2 (Oct 14 bulk-close). |
| #455 | FOLDED | Superseded/folded into tip 69a53b16f59c: 9e2d28d1 merge: fold wave2 (#442,#455,#456,#457,#458) onto flake-engine tip. Closing as FOLDED per burn-1008 open-draft-triage-v2 (Oct 14 bulk-close). |
| #456 | FOLDED | Superseded/folded into tip 69a53b16f59c: 9e2d28d1 merge: fold wave2 (#442,#455,#456,#457,#458) onto flake-engine tip. Closing as FOLDED per burn-1008 open-draft-triage-v2 (Oct 14 bulk-close). |
| #457 | FOLDED | Superseded/folded into tip 69a53b16f59c: 9e2d28d1 merge: fold wave2 (#442,#455,#456,#457,#458) onto flake-engine tip. Closing as FOLDED per burn-1008 open-draft-triage-v2 (Oct 14 bulk-close). |
| #458 | FOLDED | Superseded/folded into tip 69a53b16f59c: 9e2d28d1 merge: fold wave2 (#442,#455,#456,#457,#458) onto flake-engine tip. Closing as FOLDED per burn-1008 open-draft-triage-v2 (Oct 14 bulk-close). |
| #459 | FOLDED | Superseded/folded into tip 69a53b16f59c: d7108a59 docs(test): fold safe standalone drafts onto wave4 tip. Closing as FOLDED per burn-1008 open-draft-triage-v2 (Oct 14 bulk-close). |
| #460 | FOLDED | Superseded/folded into tip 69a53b16f59c: tip 69a53b16f59c contains PR content (ancestor/blob identity). Closing as FOLDED per burn-1008 open-draft-triage-v2 (Oct 14 bulk-close). |
| #461 | FOLDED | Superseded/folded into tip 69a53b16f59c: tip 69a53b16f59c contains PR content (ancestor/blob identity). Closing as FOLDED per burn-1008 open-draft-triage-v2 (Oct 14 bulk-close). |
| #462 | FOLDED | Superseded/folded into tip 69a53b16f59c: tip 69a53b16f59c contains PR content (ancestor/blob identity). Closing as FOLDED per burn-1008 open-draft-triage-v2 (Oct 14 bulk-close). |
| #463 | FOLDED | Superseded/folded into tip 69a53b16f59c: tip 69a53b16f59c contains PR content (ancestor/blob identity). Closing as FOLDED per burn-1008 open-draft-triage-v2 (Oct 14 bulk-close). |
| #464 | FOLDED | Superseded/folded into tip 69a53b16f59c: fbb3411b merge: wave4 (#464+#465+#467) onto fold-coverage tip (#466). Closing as FOLDED per burn-1008 open-draft-triage-v2 (Oct 14 bulk-close). |
| #465 | FOLDED | Superseded/folded into tip 69a53b16f59c: fbb3411b merge: wave4 (#464+#465+#467) onto fold-coverage tip (#466). Closing as FOLDED per burn-1008 open-draft-triage-v2 (Oct 14 bulk-close). |
| #466 | FOLDED | Superseded/folded into tip 69a53b16f59c: fbb3411b merge: wave4 (#464+#465+#467) onto fold-coverage tip (#466). Closing as FOLDED per burn-1008 open-draft-triage-v2 (Oct 14 bulk-close). |
| #467 | FOLDED | Superseded/folded into tip 69a53b16f59c: fbb3411b merge: wave4 (#464+#465+#467) onto fold-coverage tip (#466). Closing as FOLDED per burn-1008 open-draft-triage-v2 (Oct 14 bulk-close). |
| #468 | VIOLATION | Hard-rule violation (AI calibration retunes fiar/kwatro/pent ai.ts (Hard≥Easy)…). Do not fold. Closing per burn-1008 open-draft-triage-v2 (Oct 14 bulk-close). |
| #469 | FOLDED | Superseded/folded into tip 69a53b16f59c: 367d291e docs: refresh merge-order tip for #469/#472/#473 folds. Closing as FOLDED per burn-1008 open-draft-triage-v2 (Oct 14 bulk-close). |
| #470 | FOLDED | Superseded/folded into tip 69a53b16f59c: tip 69a53b16f59c contains PR content (ancestor/blob identity). Closing as FOLDED per burn-1008 open-draft-triage-v2 (Oct 14 bulk-close). |
| #471 | FOLDED | Superseded/folded into tip 69a53b16f59c: dfea69ff docs: refresh merge-order tip for wave5 #471 fold. Closing as FOLDED per burn-1008 open-draft-triage-v2 (Oct 14 bulk-close). |
| #472 | FOLDED | Superseded/folded into tip 69a53b16f59c: 4adbfc0e test(hex): align deep-playability Hard deadline with tip #472. Closing as FOLDED per burn-1008 open-draft-triage-v2 (Oct 14 bulk-close). |
| #473 | FOLDED | Superseded/folded into tip 69a53b16f59c: 367d291e docs: refresh merge-order tip for #469/#472/#473 folds. Closing as FOLDED per burn-1008 open-draft-triage-v2 (Oct 14 bulk-close). |
| #474 | FOLDED | Superseded/folded into tip 69a53b16f59c: 6970db3e docs: refresh merge-order tip for wave5 #474/#475 folds. Closing as FOLDED per burn-1008 open-draft-triage-v2 (Oct 14 bulk-close). |
| #475 | FOLDED | Superseded/folded into tip 69a53b16f59c: 6970db3e docs: refresh merge-order tip for wave5 #474/#475 folds. Closing as FOLDED per burn-1008 open-draft-triage-v2 (Oct 14 bulk-close). |
| #476 | FOLDED | Superseded/folded into tip 69a53b16f59c: bcaeb2da docs: merge rehearsal for Oct 9 tip stack (#476). Closing as FOLDED per burn-1008 open-draft-triage-v2 (Oct 14 bulk-close). |
| #478 | FOLDED | Superseded/folded into tip 69a53b16f59c: 3b6999cc docs: refresh merge-order tip for wave5 #478 fold. Closing as FOLDED per burn-1008 open-draft-triage-v2 (Oct 14 bulk-close). |
| #479 | FOLDED | Superseded/folded into tip 69a53b16f59c: 4b07bad0 docs: refresh merge-order tip for wave5 #479/#480 folds. Closing as FOLDED per burn-1008 open-draft-triage-v2 (Oct 14 bulk-close). |
| #480 | FOLDED | Superseded/folded into tip 69a53b16f59c: 4b07bad0 docs: refresh merge-order tip for wave5 #479/#480 folds. Closing as FOLDED per burn-1008 open-draft-triage-v2 (Oct 14 bulk-close). |
| #481 | FOLDED | Superseded/folded into tip 69a53b16f59c: 3be53dea docs: note #481 final head on wave5 tip. Closing as FOLDED per burn-1008 open-draft-triage-v2 (Oct 14 bulk-close). |
| #482 | FOLDED | Superseded/folded into tip 69a53b16f59c: aec5a21a docs: wave5 tip-alone merge path (#435/#482–#484). Closing as FOLDED per burn-1008 open-draft-triage-v2 (Oct 14 bulk-close). |
| #483 | FOLDED | Superseded/folded into tip 69a53b16f59c: 2c072acd merge(#483): consolidate owner rules-decision checklist. Closing as FOLDED per burn-1008 open-draft-triage-v2 (Oct 14 bulk-close). |
| #484 | FOLDED | Superseded/folded into tip 69a53b16f59c: aec5a21a docs: wave5 tip-alone merge path (#435/#482–#484). Closing as FOLDED per burn-1008 open-draft-triage-v2 (Oct 14 bulk-close). |
| #485 | FOLDED | Superseded/folded into tip 69a53b16f59c: c0b6f9aa docs: list #485 standalone triage among wave5 tip folds. Closing as FOLDED per burn-1008 open-draft-triage-v2 (Oct 14 bulk-close). |
| #486 | FOLDED | Superseded/folded into tip 69a53b16f59c: 45958856 docs: refresh wave5 rehearsal verification after #486 fold. Closing as FOLDED per burn-1008 open-draft-triage-v2 (Oct 14 bulk-close). |
| #487 | VIOLATION | Hard-rule violation (player-facing copy polish across registry/owl/status strings…). Do not fold. Closing per burn-1008 open-draft-triage-v2 (Oct 14 bulk-close). |
| #488 | VIOLATION | Hard-rule violation (fiar/ai.ts + pent-em-in/ai.ts Hard≥Easy difficulty retune…). Do not fold. Closing per burn-1008 open-draft-triage-v2 (Oct 14 bulk-close). |
| #489 | FOLDED | Superseded/folded into tip 69a53b16f59c: ae04c63c docs: refresh wave5 rehearsal verification after #489 fold. Closing as FOLDED per burn-1008 open-draft-triage-v2 (Oct 14 bulk-close). |
| #490 | FOLDED | Superseded/folded into tip 69a53b16f59c: afd32396 docs: record #490 chromium e2e counts on wave5 tip. Closing as FOLDED per burn-1008 open-draft-triage-v2 (Oct 14 bulk-close). |
| #491 | FOLDED | Superseded/folded into tip 69a53b16f59c: 3ecbbe41 merge(#500): screen-reader semantics pass. Closing as FOLDED per burn-1008 open-draft-triage-v2 (Oct 14 bulk-close). |
| #492 | VIOLATION | Hard-rule violation (edits many games tutorial.ts + help/rules text…). Do not fold. Closing per burn-1008 open-draft-triage-v2 (Oct 14 bulk-close). |
| #503 | SUPERSEDED | Superseded by 502; no unique content vs tip 69a53b16f59c. Closing per burn-1008 open-draft-triage-v2 (Oct 14 bulk-close). |
| #505 | FOLDED | Superseded/folded into tip 69a53b16f59c: 9370a30f docs(test): fold #556 flake-rate after-fix table (keep #505 §3). Closing as FOLDED per burn-1008 open-draft-triage-v2 (Oct 14 bulk-close). |
| #506 | SUPERSEDED | Superseded by 504; no unique content vs tip 69a53b16f59c. Closing per burn-1008 open-draft-triage-v2 (Oct 14 bulk-close). |
| #510 | SUPERSEDED | Superseded by 509; no unique content vs tip 69a53b16f59c. Closing per burn-1008 open-draft-triage-v2 (Oct 14 bulk-close). |
| #511 | SUPERSEDED | Superseded by 513; no unique content vs tip 69a53b16f59c. Closing per burn-1008 open-draft-triage-v2 (Oct 14 bulk-close). |
| #520 | FOLDED | Superseded/folded into tip 69a53b16f59c: 5f571236 docs: refresh #525 engine-bench after #518/#520. Closing as FOLDED per burn-1008 open-draft-triage-v2 (Oct 14 bulk-close). |
| #522 | FOLDED | Superseded/folded into tip 69a53b16f59c: 36a1340d fix(#522): scope zoom-reflow CSS off default baselines. Closing as FOLDED per burn-1008 open-draft-triage-v2 (Oct 14 bulk-close). |
| #524 | FOLDED | Superseded/folded into tip 69a53b16f59c: 27209a12 merge(#524): reproducible Vite/PWA builds + check:build. Closing as FOLDED per burn-1008 open-draft-triage-v2 (Oct 14 bulk-close). |
| #527 | FOLDED | Superseded/folded into tip 69a53b16f59c: bb691480 merge(#527): workflow contract + lockfile-keyed npm cache. Closing as FOLDED per burn-1008 open-draft-triage-v2 (Oct 14 bulk-close). |
| #528 | FOLDED | Superseded/folded into tip 69a53b16f59c: c9c54a94 merge(#528): safe Web Storage wrapper + cross-tab progress sync. Closing as FOLDED per burn-1008 open-draft-triage-v2 (Oct 14 bulk-close). |
| #530 | FOLDED | Superseded/folded into tip 69a53b16f59c: f12f68a2 merge(#530): forced-colors + reduced-motion a11y (report-only). Closing as FOLDED per burn-1008 open-draft-triage-v2 (Oct 14 bulk-close). |
| #535 | VIOLATION | Hard-rule violation (scoring-adjacent math helpers (isPrime/negate/isWholeNumber); use folded #540 instead…). Do not fold. Closing per burn-1008 open-draft-triage-v2 (Oct 14 bulk-close). |
| #537 | VIOLATION | Hard-rule violation (rules.ts apply/legality ?? fallbacks/silent no-ops; superseded for fold by #546…). Do not fold. Closing per burn-1008 open-draft-triage-v2 (Oct 14 bulk-close). |
| #553 | FOLDED | Superseded/folded into tip 69a53b16f59c: 0dc1e953 chore(types): refresh Phase-2 baseline tipSha after #553 fold. Closing as FOLDED per burn-1008 open-draft-triage-v2 (Oct 14 bulk-close). |
| #554 | FOLDED | Superseded/folded into tip 69a53b16f59c: tip 69a53b16f59c contains PR content (ancestor/blob identity). Closing as FOLDED per burn-1008 open-draft-triage-v2 (Oct 14 bulk-close). |
| #555 | FOLDED | Superseded/folded into tip 69a53b16f59c: tip 69a53b16f59c contains PR content (ancestor/blob identity). Closing as FOLDED per burn-1008 open-draft-triage-v2 (Oct 14 bulk-close). |
| #556 | FOLDED | Superseded/folded into tip 69a53b16f59c: 9370a30f docs(test): fold #556 flake-rate after-fix table (keep #505 §3). Closing as FOLDED per burn-1008 open-draft-triage-v2 (Oct 14 bulk-close). |
| #558 | FOLDED | Superseded/folded into tip 69a53b16f59c: 512b0d22 docs(dev): fold #558 compliance-review-3 + #541 dead-code recheck. Closing as FOLDED per burn-1008 open-draft-triage-v2 (Oct 14 bulk-close). |
| #566 | SUPERSEDED | Superseded by 571; no unique content vs tip 69a53b16f59c. Closing per burn-1008 open-draft-triage-v2 (Oct 14 bulk-close). |

**Close count:** 110 PRs

## Residual salvage list

Unique compliant value not on tip. Fold order preferred (no dead-code successor; **#541 already FOLD LAST on tip**).

| Order | PR | Title | Exact residual hunks / paths |
| ---: | ---: | --- | --- |
| 1 | #567 | fix(prime-gold): WebGL context-lost 2D fallback (R-GL-08 P0) | `docs/dev/runtime-error-path-audit.md` (new): `@@ -0,0 +1,134 @@` · `src/games/prime-gold/game-controller.ts`: `@@ -81,6 +81,9 @@ function scheduleAI(controller: PrimeGoldController, delayMs: number): void {; @@ -91,6 +94,20 @@ func` · `src/ui/three/prime-gold-board-3d.ts`: `@@ -7,6 +7,7 @@; @@ -568,10 +569,9 @@ export async function createPrimeGoldBoard3D(` · `tests/unit/mp3d-prime-gold-board-3d-lifecycle.test.ts`: `@@ -323,4 +323,33 @@ describe('mp3d Prime Gold board 3D lifecycle', () => {` · `tests/unit/mp3d-prime-gold-board-select.test.ts`: `@@ -119,4 +119,70 @@ describe('mp3d Prime Gold board view selection', () => {` · `tests/unit/mp3d-queens-guards-board-3d-lifecycle.test.ts`: `@@ -444,6 +444,31 @@ describe('mp3d Queens & Guards board 3d lifecycle', () => {` · `tests/unit/runtime-error-path-audit.test.ts` (new): `@@ -0,0 +1,303 @@` |
| 2 | #568 | fix(shell): try/finally cleanup + soft-fail owl/SW bootstrap (burn-100 | `docs/dev/runtime-error-path-audit.md` (new): `@@ -0,0 +1,134 @@` · `src/pwa/bootstrap-owl.ts`: `@@ -5,6 +5,10 @@; @@ -32,15 +36,22 @@ export function bootstrapOwl(options: BootstrapOwlOptions = {}): void {` · `src/pwa/register.ts`: `@@ -54,29 +54,35 @@ export function registerPwa(` · `src/ui/game-route-mounts.ts`: `@@ -102,17 +102,47 @@ async function mountGameShellForRoute(; @@ -181,16 +211,16 @@ async function renderKingsQuadraphag` · `tests/unit/burn-1007-game-route-mounts.test.ts`: `@@ -166,11 +166,11 @@ describe('burn-1007 game-route-mounts', () => {; @@ -256,6 +256,29 @@ describe('burn-1007 game-rou` · `tests/unit/mp3d-prime-gold-board-3d-lifecycle.test.ts`: `@@ -323,4 +323,38 @@ describe('mp3d Prime Gold board 3D lifecycle', () => {` · `tests/unit/mp3d-queens-guards-board-3d-lifecycle.test.ts`: `@@ -444,6 +444,31 @@ describe('mp3d Queens & Guards board 3d lifecycle', () => {` · `tests/unit/runtime-error-path-audit.test.ts` (new): `@@ -0,0 +1,423 @@` |
| 3 | #573 | fix(types): Phase-2 type-ratchet Batch 7 shell/helper floor (burn-1008 | `docs/dev/type-ratchet-batch-7.md` (new): `@@ -0,0 +1,102 @@` · `docs/dev/type-ratchet-phase2-baseline.json`: `@@ -2,9 +2,9 @@; @@ -19,14 +19,14 @@; @@ -34,45 +34,45 @@; @@ -100,8 +100,8 @@; @@ -126,7 +126,7 @@; @@ -135,9 +135,9 @@` · `docs/dev/type-ratchet-phase2-export.mjs`: `@@ -61,9 +61,35 @@ const IN_SCOPE = new RegExp(; @@ -244,7 +270,7 @@ const baseline = {` · `docs/dev/type-ratchet-phase2-plan.md`: `@@ -4,9 +4,9 @@` · `scripts/check-type-ratchet.mjs`: `@@ -62,9 +62,35 @@ const IN_SCOPE = new RegExp(; @@ -113,7 +139,7 @@ console.log(` · `src/core/ai-worker/client.ts`: `@@ -3,8 +3,10 @@ import type { AiWorkerGameId, AiWorkerResponse } from './protocol';` · `src/core/ai-worker/protocol.ts`: `@@ -7,9 +7,9 @@ export interface AiWorkerRequestBase {` · `tests/unit/burn-wave14-types-helpers.test.ts`: `@@ -203,7 +203,7 @@ describe('Wave 14 — Pent-em-in piece helpers', () => {; @@ -297,7 +297,7 @@ describe('Wave 14 — Par ` |
| 4 | #562 | test(engines): engine coverage round — characterization for lowest-cov | `docs/dev/engine-coverage-round.md` (new): `@@ -0,0 +1,159 @@` · `scripts/engine-coverage-rank.mjs` (new): `@@ -0,0 +1,92 @@` · `tests/unit/engine-coverage-round-burn-1008.test.ts` (new): `@@ -0,0 +1,825 @@` |
| 5 | #574 | test(engines): coverage round 2 — next lowest non-AI rules (burn-1008) | `docs/dev/engine-coverage-round-2.md` (new): `@@ -0,0 +1,146 @@` · `docs/dev/engine-coverage-round.md` (new): `@@ -0,0 +1,159 @@` · `scripts/engine-coverage-rank.mjs` (new): `@@ -0,0 +1,92 @@` · `tests/unit/engine-coverage-round-2-burn-1008.test.ts` (new): `@@ -0,0 +1,874 @@` · `tests/unit/engine-coverage-round-burn-1008.test.ts` (new): `@@ -0,0 +1,825 @@` |
| 6 | #571 | test(ui): non-engine UI coverage round 3 (burn-1008-mp-ui-coverage-rou | `docs/dev/ui-coverage-round-2.md` (new): `@@ -0,0 +1,89 @@` · `docs/dev/ui-coverage-round-3.md` (new): `@@ -0,0 +1,90 @@` · `tests/unit/burn-1007-main-shell-routes.test.ts`: `@@ -179,4 +179,96 @@ describe('burn-1007 main shell routes', () => {` · `tests/unit/burn-1008-ui-cov-r2-demos-highlight.test.ts` (new): `@@ -0,0 +1,139 @@` · `tests/unit/burn-1008-ui-cov-r2-owl-idle.test.ts` (new): `@@ -0,0 +1,212 @@` · `tests/unit/burn-1008-ui-cov-r2-prefetch.test.ts` (new): `@@ -0,0 +1,134 @@` · `tests/unit/burn-1008-ui-cov-r2-shell-helpers.test.ts` (new): `@@ -0,0 +1,435 @@` · `tests/unit/burn-1008-ui-cov-r3-a11y-render-helpers.test.ts` (new): `@@ -0,0 +1,407 @@` |
| 7 | #563 | test(docs): runtime error-path audit + behavior pins (burn-1008) | `docs/dev/runtime-error-path-audit.md` (new): `@@ -0,0 +1,134 @@` · `tests/unit/mp3d-prime-gold-board-3d-lifecycle.test.ts`: `@@ -323,4 +323,38 @@ describe('mp3d Prime Gold board 3D lifecycle', () => {` · `tests/unit/mp3d-queens-guards-board-3d-lifecycle.test.ts`: `@@ -444,6 +444,31 @@ describe('mp3d Queens & Guards board 3d lifecycle', () => {` · `tests/unit/runtime-error-path-audit.test.ts` (new): `@@ -0,0 +1,304 @@` |
| 8 | #565 | docs(dev): dependency security-advisory audit (burn-1008) | `docs/dev/dependency-advisory-audit.md` (new): `@@ -0,0 +1,166 @@` |
| 9 | #561 | docs(dev): burn-1008 compliance review 4 of tip drafts #553–#557 | `docs/dev/compliance-review-4-2026-10-08.md` (new): `@@ -0,0 +1,287 @@` |
| 10 | #564 | docs(dev): burn-1008 compliance review 5 of OWNER OPTION drafts #559/# | `docs/dev/compliance-review-5-2026-10-08.md` (new): `@@ -0,0 +1,274 @@` |
| 11 | #569 | docs(dev): Friday landing preflight v2 tip→alpha (burn-1008) | `docs/dev/friday-landing-preflight-v2.md (absent on tip)` (new): `@@ -0,0 +1,402 @@` |
| 12 | #572 | docs(dev): burn-1008 compliance review 6 of tip drafts #562–#568 | `docs/dev/burn-1008-compliance-review-6.md` (new): `@@ -0,0 +1,359 @@` |
| 13 | #575 | docs(dev): open draft PR triage v2 for Oct 14 bulk-close (burn-1008) | `docs/dev/open-draft-triage-v2.md` (new): `@@ -0,0 +1,395 @@` |

### Residual notes

- **#566** is SUPERSEDED by **#571** (all #566 paths blob-identical on #571 head) — close #566; salvage via #571.
- **#574** stacks on **#562** (round-1 paths blob-identical on #574); fold #562 then #574, or fold #574 alone to land both rounds.
- **#563** audit docs/tests overlap #567/#568 — when folding implementations, prefer #567/#568 file versions for overlapping paths; keep #563-only characterization if still unique after those folds.
- **#569** is tip→alpha preflight docs only (no AI/copy edits). **#570** (HOLD AI/copy audit) is OWNER-OPTION and stacks on #569 — do not fold AI/copy hunk guidance from #570 while tip owner restores alpha surfaces.
- **#573** AI-worker edits are type-only (`seed?: number` → `number | undefined`); not AI behavior.
- **#575** is this triage deliverable (docs-only).
- **#541** dead-code cleanup: already merged `cc4120d2 merge(#541): safe dead-code removals (fold last)` — marked LAST historically; nothing further to schedule last among open residuals.

## OWNER-OPTION (do not bulk-close)

| PR | Title | Decision |
| ---: | --- | --- |
| #393 | fix(kwatro-sinko): allow non-contiguous winning paths (Div II / #355 p | Tip merged then reverted #393 (55b4212d). Re-land Div II non-contiguous winning paths after Oct 14, or keep revert. |
| #477 | Tip: wave5 fold on #476 — land #477 alone into alpha | Wave5 tip land-into-alpha vehicle (PR head is tip ancestry). Tip owner decides when #477 lands alone into alpha; tip owner is restoring alpha AI/copy surfaces — do not evaluate that work here. |
| #557 | fix(types): Phase-2 type-ratchet Batch 6 non-AI rules/engine (burn-100 | Emit-identical Batch-6 portion folded (ffc8aff2); held stars-bars/pent rules hunks restored out (8d123172). Held rules hunks stay out. |
| #559 | OPTION: isolate alpha AI/copy deltas for merge-window D07 (burn-1008) | OPTION isolate alpha AI/copy deltas — restore only after Oct 14 rework. Tip already has isolation sheet (f3b668fa). Do not evaluate tip-owner AI/copy restore. |
| #560 | fix(types): OWNER OPTION AI type-only emit-identical ratchet (burn-100 | OWNER OPTION AI type-only emit-identical ratchet — consider only after #477. Tip already has option sheet + check-emit-identity tooling (271cf638/35df4680). |
| #570 | docs(dev): Friday AI/copy hunk audit tip #477 vs alpha (HOLD) | HOLD Friday AI/copy hunk audit tip #477 vs alpha. Stacked on #569. Tip owner restoring AI/copy — do not evaluate or fold AI/copy hunks from this audit. |

## SUPERSEDED detail

| PR | Title | Superseded by | Evidence |
| ---: | --- | --- | --- |
| #441 | docs: consolidate 2026-10-07 deep-playtest rules/scoring que | 483 | replaced by 483; tip log: 5977d313 docs: consolidate owner rules-decision checklist (2026-10-07) |
| #453 | docs: 2026-10-07 open draft PR merge-order inventory | tip docs (#484/#485 merge-order/rehearsal) | replaced by tip docs (#484/#485 merge-order/rehearsal); tip log: see successor PR |
| #503 | docs(dev): Phase 2 type-ratchet plan + report-only baseline  | 502 | replaced by 502; tip log: bd69e8ca docs(dev): burn-1008 compliance review of open tip drafts; 293ca1d5 docs: fold #502 Phase-2 type-ratchet plan; supersede #503 |
| #506 | docs: contributor engine reference for 20 games (burn-1007-m | 504 | replaced by 504; tip log: 1938923f docs: list #504/#509 folds; supersede #506/#510 twins; 2bea58c3 chore: add check:dev-docs npm script from #506 |
| #510 | test: raise non-engine UI unit coverage (burn-1007-mp-ui-cov | 509 | replaced by 509; tip log: 1938923f docs: list #504/#509 folds; supersede #506/#510 twins; ed22676f merge(#509)+port(#510): UI/PWA coverage; main.ts shell routes |
| #511 | perf(render): board hover/rebuild latency (burn-1007) | 513 | replaced by 513; tip log: c70c1a28 docs: record #513/#507/#512 folds; supersede #511/#505; 11db84d0 merge(#513)+port(#511): render/input latency hotspots + harn |
| #566 | test(ui): non-engine UI coverage round 2 (burn-1008-mp-ui-co | 571 | replaced by 571; tip log: see successor PR |

## VIOLATION detail

| PR | Title | Hard-rule signal |
| ---: | --- | --- |
| #394 | test(kwatro-sinko): lock Div II diagonals and path-scan afte | player-facing tutorial rules-text + rules.ts comment/lock coupled to Div II path policy |
| #418 | fix(playtest): Prime Gold Roll settle + FIAR move-phase touc | prime-gold rules settle helpers + ai.ts pass-on-empty-chips; FIAR touch adjacent to move-phase |
| #419 | fix(remainder-islands): deep playtest stalls, touch UX, AI p | remainder-islands ai.ts scoring/pacing + rules.ts paths |
| #428 | fix(juggle): deep playtest — jam Pass, fit-aware UX, AI seat | juggle ai.ts + rules.ts passTurn/shouldOfferPass legal-move/outcome changes |
| #429 | fix(hex-a-gone): deep playtest polish — AI budget, touch, Hv | hex-a-gone ai.ts difficulty lookahead budget caps |
| #468 | test(ai): headless AI calibration matrices + Hard≥Easy guard | AI calibration retunes fiar/kwatro/pent ai.ts (Hard≥Easy) |
| #487 | docs(copy): kid-friendly player text polish (grades 3–5) | player-facing copy polish across registry/owl/status strings |
| #488 | fix(ai): tip AI difficulty recheck — FIAR/Pent Hard≥Easy (dr | fiar/ai.ts + pent-em-in/ai.ts Hard≥Easy difficulty retune |
| #492 | docs(rules): audit help/tutorial text vs engine (docs/tests  | edits many games tutorial.ts + help/rules text |
| #535 | fix(math): arithmetic exactness audit (burn-1008-mp-math-pre | scoring-adjacent math helpers (isPrime/negate/isWholeNumber); use folded #540 instead compliant successor #540 |
| #537 | fix(types): Phase-2 type-ratchet Batch 2 — rules-heavy non-A | rules.ts apply/legality ?? fallbacks/silent no-ops; superseded for fold by #546 compliant successor #546 |

## FOLDED detail (all)

| PR | Title | Base | Head SHA | Evidence | Action |
| ---: | --- | --- | --- | --- | --- |
| #355 | docs(mp3d): Step-0 rules-first 3D board specs (docs onl | `alpha` | `7183bdec684d` | content folded; cherry +1; ratio=1.0; 942927a4 docs(mp3d): fold #355 Step-0 kings/kwatro 3D specs; 5326935b integration: overnight polish PRs (Oct 7) (#413) | **close** |
| #392 | Polish offline / tablet playability (lazy load, reduced | `alpha` | `af13d05a9072` | ancestor of tip; cherry +0; cd11d6af integration: merge PR #392 — Polish offline / tablet playability | **close** |
| #395 | perf: offline/lazy shell polish for cheap tablets | `alpha` | `68dcd4da6ff7` | ancestor of tip; cherry +0; c9ac456b integration: merge PR #395 — perf offline/lazy shell (resolve main.ts) | **close** |
| #397 | fix(hex-a-gone,queens-guards,kings): AI soft-lock, touc | `alpha` | `a4a63b9b6e24` | ancestor of tip; cherry +0; 0acfb05d integration: merge PR #397 — hex/queens/kings polish (resolve style.css) | **close** |
| #398 | fix: polish Remainder Islands & Sum Dominoes playabilit | `alpha` | `60adb331d01e` | ancestor of tip; cherry +0; 61bddb46 integration: merge PR #398 — fix: polish Remainder Islands & Sum Dominoes playability | **close** |
| #399 | feat(pwa): tablet PNG install icons for Add to Home Scr | `alpha` | `308612e6d7f3` | ancestor of tip; cherry +0; e2e02bf8 integration: merge PR #399 — PWA tablet icons (resolve index.html) | **close** |
| #406 | fix(calla,fraction-pinball): AI-seat lock, touch, reduc | `alpha` | `41f9c55858fc` | ancestor of tip; cherry +0; 97d1068b integration: merge PR #406 — calla/frac-pinball polish (resolve style.css) | **close** |
| #407 | fix(juggle): AI-seat input lock, aria honesty, touch, r | `alpha` | `be2e74c00dac` | ancestor of tip; cherry +0; f6e73071 integration: merge PR #407 — fix(juggle): AI-seat input lock, aria honesty, touch, reduced-motion | **close** |
| #408 | fix(a11y): shell/menu focus-visible + reduced-motion ke | `alpha` | `170b9c585a9b` | ancestor of tip; cherry +0; b38aebae integration: merge PR #408 — fix(a11y): shell/menu focus-visible + reduced-motion keepers | **close** |
| #409 | fix(kings): AI-seat aria honesty + input-lock regressio | `alpha` | `8cf96b1d1c39` | ancestor of tip; cherry +0; a1669b07 integration: merge PR #409 — fix(kings): AI-seat aria honesty + input-lock regression guard | **close** |
| #410 | fix(fiar): AI-seat aria honesty, 44px touch, reduced-mo | `alpha` | `0f26bd13659a` | ancestor of tip; cherry +0; f9ae60b5 integration: merge PR #410 — fix(fiar): AI-seat aria honesty, 44px touch, reduced-motion | **close** |
| #411 | fix(hex): coarse 44px cell targets + reduced-motion boa | `alpha` | `83c8c477f71c` | ancestor of tip; cherry +0; 5a3b5c14 integration: merge PR #411 — fix(hex): coarse 44px cell targets + reduced-motion board glow | **close** |
| #412 | fix(star-track): AI-seat input lock, aria honesty, touc | `alpha` | `4e9e3185e763` | ancestor of tip; cherry +0; ffc43563 integration: merge PR #412 — fix(star-track): AI-seat input lock, aria honesty, touch, reduced-motion | **close** |
| #415 | fix(playtest): recheck #413 vs top-10 + safe polish esc | `alpha` | `8b1de5d5f265` | ancestor of tip; cherry +0; d5ec4c17 merge(#415): playtest recheck polish into playability stack-2 | **close** |
| #416 | fix(kwatro-sinko): AI long-game thrash — finish under 9 | `cursor/playtest-recheck-fixes-a6fd` | `08a9bdcf38cc` | ancestor of tip; cherry +0; a34eea2a merge(#416): Kwatro AI long-game thrash fix (playability only) | **close** |
| #417 | fix(pent-em-in): place-piece legal highlights + choose- | `cursor/playtest-recheck-fixes-a6fd` | `a54b60c61385` | ancestor of tip; cherry +0; dc241b1d merge(#417): Pent'Em In place-piece legal highlights + escape | **close** |
| #420 | docs(gallery): tablet start + mid-game screenshots for  | `cursor/overnight-polish-integration-0494` | `5e2c8e17c711` | content folded; cherry +2; ratio=0.977; d7108a59 docs(test): fold safe standalone drafts onto wave4 tip | **close** |
| #421 | fix(sum-dominoes): deep playtest — AI timer race, touch | `cursor/overnight-polish-integration-0494` | `31040c1cecfd` | ancestor of tip; cherry +0; 536a5e33 merge(#421): Sum Dominoes deep-playtest into integration | **close** |
| #422 | fix(fab-a-diffy): deep playtest polish — AI-seat lock,  | `cursor/overnight-polish-integration-0494` | `8a2841958a96` | ancestor of tip; cherry +0; 0b032fea merge(#422): Fab-a-Diffy deep-playtest into integration | **close** |
| #423 | perf: shrink menu bundle for cheap tablets (lazy mounts | `cursor/overnight-polish-integration-0494` | `e0c63e976f90` | ancestor of tip; cherry +0; fdb423aa merge(#448): keyboard/SR a11y + e2e onto test-infra stack; d5ec4c17 merge(#415): playtest recheck polish into playability stack-2 | **close** |
| #424 | fix(fraction-pinball): deep playtest UX, AI pace, touch | `cursor/overnight-polish-integration-0494` | `bf794cde97f3` | ancestor of tip; cherry +0; 677c0643 merge(#424): Fraction Pinball deep-playtest into integration | **close** |
| #425 | fix(contig-60): deep playtest — AI timer race, touch, H | `cursor/overnight-polish-integration-0494` | `14c9b2077729` | ancestor of tip; cherry +0; 42397e1f merge(#425): Contig 60 deep-playtest into integration | **close** |
| #426 | fix(kings): deep playtest polish — 44px cells, You/AI c | `cursor/overnight-polish-integration-0494` | `573a68bcb00e` | ancestor of tip; cherry +0; 1281e015 merge(#426): Kings deep-playtest into integration | **close** |
| #427 | fix(queens-guards): deep playtest — 44px taps, AI-seat  | `cursor/overnight-polish-integration-0494` | `31bf0f6dd8fe` | ancestor of tip; cherry +0; 1b570c66 merge(#427): Queens & Guards deep-playtest into integration | **close** |
| #430 | fix(calla): deep vs-AI playtest polish + regressions (2 | `cursor/overnight-polish-integration-0494` | `fe1253c3bd7e` | ancestor of tip; cherry +0; 7a228d4c merge(#430): Calla deep-playtest into integration | **close** |
| #431 | fix(ramrod): deep playtest — AI timer race, desktop hit | `cursor/overnight-polish-integration-0494` | `86b6c3167ff3` | ancestor of tip; cherry +0; 0d72f286 merge(#431): Ramrod deep-playtest into playability stack-2 | **close** |
| #432 | fix(stars-bars): deep playtest — AI timer race, touch,  | `cursor/overnight-polish-integration-0494` | `71fb588d0285` | ancestor of tip; cherry +0; f399129c merge(#432): Stars & Bars deep-playtest into integration | **close** |
| #433 | fix(par-55): deep playtest — AI timer race, touch floor | `cursor/overnight-polish-integration-0494` | `f91dcfe37946` | ancestor of tip; cherry +0; 970ac936 merge(#433): Par 55 deep-playtest into integration | **close** |
| #434 | fix(hex): deep playtest polish — 44px cells, AI soft-lo | `cursor/overnight-polish-integration-0494` | `6b72e4850629` | ancestor of tip; cherry +0; 32384566 merge(#434): Hex deep-playtest into playability stack-2 | **close** |
| #435 | ci: run lint/tsc/unit/e2e for PRs targeting cursor/** | `alpha` | `23668691d48c` | ancestor of tip; cherry +0; aec5a21a docs: wave5 tip-alone merge path (#435/#482–#484); ad51c815 merge(#435): CI triggers for PRs targeting cursor/** | **close** |
| #436 | fix(star-track): deep playtest playability fixes (timer | `cursor/overnight-polish-integration-0494` | `bfdf26d9b387` | ancestor of tip; cherry +0; c2a13d22 merge(#436): Star Track deep-playtest into playability stack-2 | **close** |
| #437 | test(a11y): axe-core e2e sweep for shell/menu + contras | `cursor/overnight-polish-integration-0494` | `295f5e5a9ed3` | ancestor of tip; cherry +0; ce872543 merge(#437): axe a11y sweep into playability stack-2 | **close** |
| #438 | chore(integration): deep-playtest playability stack (#4 | `cursor/overnight-polish-integration-0494` | `42372d230d03` | ancestor of tip; cherry +0; tip 69a53b16f59c blob-identity for PR paths | **close** |
| #439 | chore(e2e): cross-browser smoke (WebKit, Firefox, iPad) | `cursor/overnight-polish-integration-0494` | `3d1f352f0a38` | ancestor of tip; cherry +0; 6e1d1c33 merge(#439): cross-browser smoke + shell CSS (onto playability stack) | **close** |
| #440 | chore(integration): deep-playtest stack-2 (#431, #434,  | `cursor/deep-playtest-integration-48a7` | `ce8725438a7d` | ancestor of tip; cherry +0; tip 69a53b16f59c blob-identity for PR paths | **close** |
| #442 | fix(test): flake hunt — RAF/timer isolation under shuff | `cursor/overnight-polish-integration-0494` | `5f1bce1b96bf` | ancestor of tip; cherry +0; 9e2d28d1 merge: fold wave2 (#442,#455,#456,#457,#458) onto flake-engine tip | **close** |
| #443 | fix(e2e): harden Chromium 3D board timeouts (board3dLQ  | `cursor/overnight-polish-integration-0494` | `2d11712f97b3` | ancestor of tip; cherry +0; 76b1af78 merge(#443): e2e 3D timeouts / mp3d ready helpers | **close** |
| #444 | merge: playability stack — #415 recheck + #416 Kwatro A | `cursor/deep-playtest-stack-2-460b` | `dc241b1d6a4b` | ancestor of tip; cherry +0; tip 69a53b16f59c blob-identity for PR paths | **close** |
| #445 | feat(test): opt-in Playwright 2D visual regression suit | `cursor/overnight-polish-integration-0494` | `dd670b7f2bf9` | ancestor of tip; cherry +0; b046b5ae merge(#445): opt-in Playwright 2D visual regression suite | **close** |
| #446 | docs(tutorials): tutorial–engine mismatch audit + K-5 c | `cursor/overnight-polish-integration-0494` | `68eef77c3284` | ancestor of tip; cherry +0; 9ed6903c merge(#446): tutorial clarity copy onto test-infra stack | **close** |
| #447 | merge(test-infra): stack #439 cross-browser + #443 3D e | `cursor/playability-stack-415-417-b354` | `f34e7fe2bca5` | ancestor of tip; cherry +0; tip 69a53b16f59c blob-identity for PR paths | **close** |
| #448 | fix(a11y): keyboard-only + screen-reader audit (2D) | `cursor/overnight-polish-integration-0494` | `4748ca890f46` | ancestor of tip; cherry +0; fdb423aa merge(#448): keyboard/SR a11y + e2e onto test-infra stack | **close** |
| #449 | stack(#446+#448): tutorial clarity + keyboard/SR a11y o | `cursor/test-infra-stack-439-443-445-6174` | `fdb423aa07c0` | ancestor of tip; cherry +0; tip 69a53b16f59c blob-identity for PR paths | **close** |
| #450 | fix(e2e): stabilize ramrod-deep mutual-place deadlock f | `cursor/test-infra-stack-439-443-445-6174` | `34be2a21267f` | ancestor of tip; cherry +0; f2675036 merge(#450): ramrod-deep mutual-place deadlock flake fix | **close** |
| #451 | fix(e2e): stabilize prime-gold 3D keyboard a11y flake | `cursor/a11y-tutorial-stack-446-448-05a3` | `16272aa02a79` | 7890fac2 fix(a11y): fold #451 collectGridCells MP-3D mirror filter | **close** |
| #452 | test(engines): invariant coverage for six lowest-covere | `cursor/overnight-polish-integration-0494` | `dd0944c79faf` | ancestor of tip; cherry +0; 52b42071 merge(#452): engine invariant tests for six lowest-covered rules | **close** |
| #454 | stack(#450+#451+#452): flake fixes + engine invariants  | `cursor/a11y-tutorial-stack-446-448-05a3` | `4604c09bf939` | ancestor of tip; cherry +0; 75b77d7c merge(#467): visual regression baselines (report-only CI); e5eca38b merge(#464): console-sweep + runtime-perf cleanup onto overnight flake stack | **close** |
| #455 | feat(ci): report-only gzip bundle size budget check | `cursor/overnight-polish-integration-0494` | `d86e87a52771` | ancestor of tip; cherry +0; 9e2d28d1 merge: fold wave2 (#442,#455,#456,#457,#458) onto flake-engine tip | **close** |
| #456 | test(engines): targeted branch coverage for kwatro / ki | `cursor/overnight-polish-integration-0494` | `3dfe1720cb00` | ancestor of tip; cherry +0; 9e2d28d1 merge: fold wave2 (#442,#455,#456,#457,#458) onto flake-engine tip; 92c54c6d integration: merge PR #456 — targeted engine branch coverage | **close** |
| #457 | fix(mobile): phone audit, chrome tap targets, viewport  | `cursor/overnight-polish-integration-0494` | `f1e724c341e1` | ancestor of tip; cherry +0; 9e2d28d1 merge: fold wave2 (#442,#455,#456,#457,#458) onto flake-engine tip; 034461ad integration: merge PR #457 — mobile audit viewport + tap targets | **close** |
| #458 | docs+fix: offline/Slow-3G resilience notes and chunk-lo | `cursor/overnight-polish-integration-0494` | `709e10261d27` | ancestor of tip; cherry +0; 9e2d28d1 merge: fold wave2 (#442,#455,#456,#457,#458) onto flake-engine tip | **close** |
| #459 | test(engines): targeted branch coverage for remaining h | `cursor/overnight-polish-integration-0494` | `b9c9b0577920` | content folded; cherry +1; ratio=1.0; d7108a59 docs(test): fold safe standalone drafts onto wave4 tip | **close** |
| #460 | Engine coverage: next 5 modules (tests only) | `cursor/overnight-polish-integration-0494` | `ad758f01c157` | ancestor of tip; cherry +0; tip 69a53b16f59c blob-identity for PR paths | **close** |
| #461 | Fold wave 2: #442 #455 #456 #457 #458 | `cursor/overnight-polish-integration-0494` | `5512723be190` | ancestor of tip; cherry +0; tip 69a53b16f59c blob-identity for PR paths | **close** |
| #462 | Console sweep + per-game error boundaries | `cursor/overnight-polish-integration-0494` | `e03f8e9d4dbc` | ancestor of tip; cherry +0; tip 69a53b16f59c blob-identity for PR paths | **close** |
| #463 | Runtime perf harness + unmount timer-leak fixes | `cursor/overnight-polish-integration-0494` | `684698289351` | ancestor of tip; cherry +0; tip 69a53b16f59c blob-identity for PR paths | **close** |
| #464 | integration: merge console-sweep + runtime-perf cleanup | `cursor/overnight-polish-integration-0494` | `5c7991f4d5aa` | ancestor of tip; cherry +0; fbb3411b merge: wave4 (#464+#465+#467) onto fold-coverage tip (#466) | **close** |
| #465 | test(state): round-trip fuzz for every game | `cursor/overnight-polish-integration-0494` | `3451655bc2fe` | ancestor of tip; cherry +0; fbb3411b merge: wave4 (#464+#465+#467) onto fold-coverage tip (#466) | **close** |
| #466 | merge: fold-wave2 + engine-coverage-next5 onto flake-en | `cursor/overnight-flake-engine-stack-737e` | `bc4410a7654e` | ancestor of tip; cherry +0; fbb3411b merge: wave4 (#464+#465+#467) onto fold-coverage tip (#466) | **close** |
| #467 | test(e2e): visual regression baselines (start + opening | `alpha` | `d19df405d081` | ancestor of tip; cherry +0; fbb3411b merge: wave4 (#464+#465+#467) onto fold-coverage tip (#466) | **close** |
| #469 | test(a11y): axe-core game screen audits + clear contras | `cursor/overnight-polish-integration-0494` | `ee7794d06d72` | ancestor of tip; cherry +0; 367d291e docs: refresh merge-order tip for #469/#472/#473 folds | **close** |
| #470 | Fold wave 4: #464 #465 #467 onto overnight flake stack  | `cursor/overnight-flake-engine-stack-737e` | `75b77d7c6446` | ancestor of tip; cherry +0; tip 69a53b16f59c blob-identity for PR paths | **close** |
| #471 | test(e2e): cross-browser firefox/webkit pass (report-on | `cursor/overnight-fold-coverage-tip-460a` | `60a8c027da5f` | ancestor of tip; cherry +0; dfea69ff docs: refresh merge-order tip for wave5 #471 fold | **close** |
| #472 | fix: Hard AI think-time bench + hex/queens Hard time-bo | `cursor/overnight-polish-integration-0494` | `a9a6a5e97ee5` | ancestor of tip; cherry +0; 4adbfc0e test(hex): align deep-playability Hard deadline with tip #472 | **close** |
| #473 | test: undo/redo and move-log consistency audit | `alpha` | `a5b9d48f3df0` | ancestor of tip; cherry +0; 367d291e docs: refresh merge-order tip for #469/#472/#473 folds | **close** |
| #474 | fix(e2e): Chromium flake hunt — waits, seeds, reduced-m | `cursor/overnight-polish-integration-0494` | `f99f16cf66ab` | ancestor of tip; cherry +0; 6970db3e docs: refresh merge-order tip for wave5 #474/#475 folds; 6cdeca9a merge(#474): Chromium e2e flake hunt — waits, seeds, reduced-motion | **close** |
| #475 | docs(wiki): architecture, registry, testing layers with | `cursor/overnight-fold-coverage-tip-460a` | `2748ed0e9cb8` | ancestor of tip; cherry +0; 6970db3e docs: refresh merge-order tip for wave5 #474/#475 folds | **close** |
| #476 | Tip: fold #464/#465/#467/#469/#472/#473 onto fold-cover | `cursor/overnight-fold-coverage-tip-460a` | `367d291e8190` | ancestor of tip; cherry +0; bcaeb2da docs: merge rehearsal for Oct 9 tip stack (#476) | **close** |
| #478 | test(ai): seed determinism + difficulty quality audit | `cursor/overnight-fold-coverage-tip-460a` | `51419c75a34b` | ancestor of tip; cherry +0; 3b6999cc docs: refresh merge-order tip for wave5 #478 fold; e2aa7d08 merge(#478): AI seed determinism + difficulty quality audit | **close** |
| #479 | fix(pwa): WebKit offline soft-nav via idle-warm route m | `cursor/cross-browser-pass-6818` | `6989a6503b9b` | ancestor of tip; cherry +0; 4b07bad0 docs: refresh merge-order tip for wave5 #479/#480 folds | **close** |
| #480 | fix: memory-leak audit + destroyGame cleanup for menu r | `cursor/integration-fold-wave4-tip-36e4` | `ea4f6e2070a1` | ancestor of tip; cherry +0; 4b07bad0 docs: refresh merge-order tip for wave5 #479/#480 folds | **close** |
| #481 | fix(test): unit suite flake hunt — selector + owl share | `cursor/overnight-fold-coverage-tip-460a` | `b14fa5253aa6` | ancestor of tip; cherry +0; 3be53dea docs: note #481 final head on wave5 tip; fbd94f54 merge(#481): unit suite flake hunt final head | **close** |
| #482 | test(engines): edge-case suite for all 20 game engines | `cursor/integration-fold-wave4-tip-36e4` | `4adbfc0e1a1d` | ancestor of tip; cherry +0; aec5a21a docs: wave5 tip-alone merge path (#435/#482–#484); f3d57051 merge(#482): engine edge-case suite for all 20 games | **close** |
| #483 | docs: owner rules-decision checklist (2026-10-07) | `cursor/integration-fold-wave4-tip-36e4` | `5977d3130e28` | ancestor of tip; cherry +0; 2c072acd merge(#483): consolidate owner rules-decision checklist | **close** |
| #484 | docs: merge rehearsal for Oct 9 tip stack (#476) | `cursor/integration-fold-wave4-tip-36e4` | `bcaeb2da3fc8` | ancestor of tip; cherry +0; aec5a21a docs: wave5 tip-alone merge path (#435/#482–#484); 4b645d9b merge(#484): merge rehearsal for tip stack | **close** |
| #485 | docs(test): standalone triage fold onto wave4 tip (#355 | `cursor/integration-fold-wave4-tip-36e4` | `e85ab977a037` | ancestor of tip; cherry +0; c0b6f9aa docs: list #485 standalone triage among wave5 tip folds | **close** |
| #486 | Touch/mobile pass: phone + tablet smoke (report-only) | `cursor/integration-fold-wave4-tip-36e4` | `705f3b420cbf` | ancestor of tip; cherry +0; 45958856 docs: refresh wave5 rehearsal verification after #486 fold | **close** |
| #489 | perf: menu first-load trim + report-only check:perf | `cursor/integration-fold-wave4-tip-36e4` | `ac10cae61041` | ancestor of tip; cherry +0; ae04c63c docs: refresh wave5 rehearsal verification after #489 fold; d8a5ce39 docs: list #489 load-perf among wave5 tip folds | **close** |
| #490 | fix(e2e): mp3d canvas-ready under SwiftShader (0 timeou | `cursor/integration-fold-wave4-tip-36e4` | `38e3acff3300` | ancestor of tip; cherry +0; afd32396 docs: record #490 chromium e2e counts on wave5 tip | **close** |
| #491 | fix(a11y): keyboard reachability for menu, modals, and  | `alpha` | `fa9a6f13fdb3` | ancestor of tip; cherry +0; 3ecbbe41 merge(#500): screen-reader semantics pass; 013b2cdc docs: final wave5 tip verification counts after fold queue | **close** |
| #505 | test: burn-1007 HvH fullgame e2e suite (report-only) | `cursor/integration-fold-wave5-tip-4af0` | `cc9cbe7a687a` | content folded; cherry +10; ratio=0.815; 9370a30f docs(test): fold #556 flake-rate after-fix table (keep #505 §3); 362af758 docs: track #547 unit load timeouts on #505 flake inventory | **close** |
| #520 | chore(lint): TypeScript lint-rule ratchet (burn-1008-mp | `cursor/integration-fold-wave5-tip-4af0` | `b5d750b64e19` | 5f571236 docs: refresh #525 engine-bench after #518/#520 | **close** |
| #522 | test(a11y): WCAG 1.4.4/1.4.10 zoom + reflow audit (repo | `cursor/integration-fold-wave5-tip-4af0` | `182fd668ece6` | content folded; cherry +2; ratio=0.2; 36a1340d fix(#522): scope zoom-reflow CSS off default baselines; 6b5a2270 merge(#522): zoom/reflow a11y CSS + report-only Playwright | **close** |
| #524 | chore(build): reproducible Vite/PWA builds + check:buil | `cursor/integration-fold-wave5-tip-4af0` | `5c7caa6dcd1e` | 27209a12 merge(#524): reproducible Vite/PWA builds + check:build | **close** |
| #527 | ci: workflow hardening contract + lockfile-keyed npm ca | `cursor/integration-fold-wave5-tip-4af0` | `f75c3530004b` | content folded; cherry +2; ratio=0.5; bb691480 merge(#527): workflow contract + lockfile-keyed npm cache | **close** |
| #528 | fix(storage): safe Web Storage wrapper for failure mode | `cursor/integration-fold-wave5-tip-4af0` | `5846d229571b` | c9c54a94 merge(#528): safe Web Storage wrapper + cross-tab progress sync | **close** |
| #530 | fix(a11y): forced-colors + reduced-motion audit (burn-1 | `cursor/integration-fold-wave5-tip-4af0` | `9489e7c3850a` | content folded; cherry +3; ratio=0.357; f12f68a2 merge(#530): forced-colors + reduced-motion a11y (report-only) | **close** |
| #553 | fix(types): Phase-2 type-ratchet Batch 5 UI/shell compl | `cursor/integration-fold-wave5-tip-4af0` | `24242ca683da` | 0dc1e953 chore(types): refresh Phase-2 baseline tipSha after #553 fold | **close** |
| #554 | docs(licenses): record #532 owner acceptances on final  | `cursor/integration-fold-wave5-tip-4af0` | `d97966f9aa3d` | content folded; cherry +0; ratio=1.0; tip 69a53b16f59c blob-identity for PR paths | **close** |
| #555 | fix(lint): use import type for storage ProgressData typ | `cursor/integration-fold-wave5-tip-4af0` | `e555bbf1de93` | content folded; cherry +0; ratio=0.0; tip 69a53b16f59c blob-identity for PR paths | **close** |
| #556 | docs(test): flake-rate after-fix verification table (bu | `cursor/integration-fold-wave5-tip-4af0` | `5d6a68ba0047` | 9370a30f docs(test): fold #556 flake-rate after-fix table (keep #505 §3) | **close** |
| #558 | docs(dev): burn-1008 compliance review 3 of tip drafts  | `cursor/integration-fold-wave5-tip-4af0` | `74f24710c2ea` | content folded; cherry +1; ratio=0.0; 512b0d22 docs(dev): fold #558 compliance-review-3 + #541 dead-code recheck | **close** |

## Completeness check

- Open PRs from API: **129**
- Classification rows: **129**
- Unique PR numbers: **129**
- Category sum: **129**

## Verification commands run (this triage)

```bash
gh pr list --repo fuzzywigg/math-pentathlon --state open --limit 500 --json number | jq length
# → 129 (after #574/#575 opened)

git fetch origin cursor/integration-fold-wave5-tip-4af0
git rev-parse origin/cursor/integration-fold-wave5-tip-4af0
# → 69a53b16f59cec2c53b98b410cd5a3e474a33d55

# Fetch all open PR heads
# for N in $(gh pr list --state open --json number -q '.[].number'); do
#   git fetch origin pull/$N/head:refs/triage-v2/pr-$N
# done

# Spot-check examples (see Spot-check table)
git merge-base --is-ancestor refs/triage-v2/pr-415 69a53b16f59c; echo $?  # 0
git rev-parse 69a53b16f59c:tests/unit/engine-coverage-hex-a-gone-targeted.test.ts
git rev-parse refs/triage-v2/pr-459:tests/unit/engine-coverage-hex-a-gone-targeted.test.ts
# → identical 8514813fbac4…

git grep -n "collectGridCells" 69a53b16f59c -- src/ui/board-a11y.ts | head
# → mirror filter present on tip (fold #451)

git log --oneline --grep="merge(#528)" 69a53b16f59c | head -1
# → c9c54a94 merge(#528): safe Web Storage wrapper…
```

## Next action

**Next action: fold into tip by the tip owner**

- After Oct 14: tip owner (or designated closer) may bulk-close FOLDED/SUPERSEDED/VIOLATION using the one-line comments above.
- Residual salvage folds are tip-owner work; keep AI/copy/#559/#560/#570 out of the automated close/fold path.
- Do not merge this triage PR to alpha/main; draft only against the tip.

