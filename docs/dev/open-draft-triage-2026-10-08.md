# Open draft PR triage — 2026-10-08

**Task id:** `burn-1008-mp-open-draft-triage`  
**Tip branch:** `cursor/integration-fold-wave5-tip-4af0`  
**Tip SHA checked:** `7b99c2bbd63b4634a5fef9703c9aa76b6d61c343` (`7b99c2bbd63b`)  
**Open drafts enumerated:** 119 (all `isDraft: true`)  
**Machine-readable twin:** [`open-draft-triage-2026-10-08.json`](./open-draft-triage-2026-10-08.json)  
**Scope:** report only — no PR closes, comments, edits, merges, or ready-for-review flips.

## Summary counts

| Category | Count | Recommended default action |
| --- | ---: | --- |
| (a) Already fully contained in wave5 tip | 80 | close |
| (b) Superseded by a named newer PR | 5 | close |
| (c) Still unique and fold-worthy | 21 | fold (see order) |
| (d) Needs owner decision | 4 | decide |
| (e) Hard-rule violation | 9 | close (do not fold) |
| **Total (each open PR once)** | **119** | |

## Method

1. `gh pr list --repo fuzzywigg/math-pentathlon --state open --limit 200` → 119 drafts.
2. `git fetch origin cursor/integration-fold-wave5-tip-4af0` @ `7b99c2bbd63b` (includes tip fold of #505 over #507 layout).
3. Containment evidence (not titles): `git cherry <tip> <head>`, tip merge-log `#N` / `supersede #N` / `port(#N)`, and per-path blob identity for each PR’s three-dot file list.
4. Hard-rule review via diff signals + cross-check with compliance drafts #538 / #543.
5. Fold order for (c) follows rehearsal #542 where it overlaps; #540 replaces #535; #518/#520/#505 treated as already on tip; #511 kept foldable because hover patches are still absent on tip.

## Spot-check: 10 “already contained” claims

| PR | Check | Result |
| ---: | --- | --- |
| #415 | git merge-base --is-ancestor head tip → true; git cherry → 0 unique; tip log merge(#415) | PASS |
| #421 | head ancestor of tip; tip log merge(#421) | PASS |
| #435 | head ancestor of tip; tip log merge(#435) | PASS |
| #442 | head ancestor of tip; Fold wave 2 includes #442 | PASS |
| #459 | tip:path blob ID == head:path for both PR files (content_ratio=1.0) despite cherry +1 | PASS |
| #467 | head ancestor of tip; tip log merge(#467) | PASS |
| #469 | head ancestor of tip; tip log merge(#469) | PASS |
| #476 | head ancestor of tip (wave4 tip head in tip ancestry) | PASS |
| #481 | head ancestor of tip; tip log merge(#481) | PASS |
| #505 | tip commit 7b99c2bb folds #505 suite; 22/27 PR paths blob-identical on tip | PASS |

## Suggested fold order (category c only)

Consistent with rehearsal #542; updated for tip advances and later drafts (#538–#543, leftover #451/#355/#511).

| Order | PR | Title |
| ---: | ---: | --- |
| 1 | #540 | test(math): safe precision recut — characterize tip, defer scoring fixes (burn-1008) |
| 2 | #355 | docs(mp3d): Step-0 rules-first 3D board specs (docs only, draft) |
| 3 | #451 | fix(e2e): stabilize prime-gold 3D keyboard a11y flake |
| 4 | #531 | fix(nav): history-routing audit (burn-1008-mp-history-routing) |
| 5 | #528 | fix(storage): safe Web Storage wrapper for failure modes (burn-1008) |
| 6 | #511 | perf(render): board hover/rebuild latency (burn-1007) |
| 7 | #526 | test: consolidate shared unit/e2e fixture helpers (burn-1008) |
| 8 | #529 | fix(ui): canvas/SVG/WebGL DPR + resize hit-test (burn-1008) |
| 9 | #533 | fix(ui): pointer edge-case hygiene for boards (burn-1008) |
| 10 | #530 | fix(a11y): forced-colors + reduced-motion audit (burn-1008) |
| 11 | #522 | test(a11y): WCAG 1.4.4/1.4.10 zoom + reflow audit (report-only) |
| 12 | #534 | fix(pwa): installability manifest contract + metadata (burn-1008) |
| 13 | #524 | chore(build): reproducible Vite/PWA builds + check:build (burn-1008) |
| 14 | #527 | ci: workflow hardening contract + lockfile-keyed npm cache (burn-1008) |
| 15 | #532 | chore(licenses): CycloneDX SBOM + report:licenses (burn-1008-mp-license-sbom) |
| 16 | #539 | test: restore/enforce engine→UI boundary (burn-1008-mp-engine-ui-boundary-repair) |
| 17 | #538 | docs(dev): burn-1008 compliance review of open tip drafts |
| 18 | #543 | docs(dev): burn-1008 compliance review 2 of tip drafts #539–#542 |
| 19 | #542 | docs(dev): wave5 fold rehearsal report (burn-1008-mp-wave5-fold-rehearsal) |
| 20 | #536 | chore: dead-code inventory report (burn-1008) — fold last |
| 21 | #541 | chore: execute safe dead-code removals (burn-1008) — FOLD LAST |

After folds: tip owner should re-run `npm run lint && npx tsc --noEmit && npm run test:unit && npm run build` (as in #542 cumulative rehearsal).

## (a) Already fully contained in the wave5 tip

*80 PRs*

| PR | Title | Base | Head SHA | Evidence | Action |
| ---: | --- | --- | --- | --- | --- |
| #392 | Polish offline / tablet playability (lazy load, reduced motion, touch) | `alpha` | `af13d05a9072` | git merge-base --is-ancestor af13d05a9072 tip → true; tip merge-log mentions #392; git cherry tip head → 0 unique commits. | **close** |
| #395 | perf: offline/lazy shell polish for cheap tablets | `alpha` | `68dcd4da6ff7` | git merge-base --is-ancestor 68dcd4da6ff7 tip → true; tip merge-log mentions #395; git cherry tip head → 0 unique commits. | **close** |
| #397 | fix(hex-a-gone,queens-guards,kings): AI soft-lock, touch, reduced-motion | `alpha` | `a4a63b9b6e24` | git merge-base --is-ancestor a4a63b9b6e24 tip → true; tip merge-log mentions #397; git cherry tip head → 0 unique commits. | **close** |
| #398 | fix: polish Remainder Islands & Sum Dominoes playability | `alpha` | `60adb331d01e` | git merge-base --is-ancestor 60adb331d01e tip → true; tip merge-log mentions #398; git cherry tip head → 0 unique commits. | **close** |
| #399 | feat(pwa): tablet PNG install icons for Add to Home Screen | `alpha` | `308612e6d7f3` | git merge-base --is-ancestor 308612e6d7f3 tip → true; tip merge-log mentions #399; git cherry tip head → 0 unique commits. | **close** |
| #406 | fix(calla,fraction-pinball): AI-seat lock, touch, reduced-motion | `alpha` | `41f9c55858fc` | git merge-base --is-ancestor 41f9c55858fc tip → true; tip merge-log mentions #406; git cherry tip head → 0 unique commits. | **close** |
| #407 | fix(juggle): AI-seat input lock, aria honesty, touch, reduced-motion | `alpha` | `be2e74c00dac` | git merge-base --is-ancestor be2e74c00dac tip → true; tip merge-log mentions #407; git cherry tip head → 0 unique commits. | **close** |
| #408 | fix(a11y): shell/menu focus-visible + reduced-motion keepers | `alpha` | `170b9c585a9b` | git merge-base --is-ancestor 170b9c585a9b tip → true; tip merge-log mentions #408; git cherry tip head → 0 unique commits. | **close** |
| #409 | fix(kings): AI-seat aria honesty + input-lock regression guard | `alpha` | `8cf96b1d1c39` | git merge-base --is-ancestor 8cf96b1d1c39 tip → true; tip merge-log mentions #409; git cherry tip head → 0 unique commits. | **close** |
| #410 | fix(fiar): AI-seat aria honesty, 44px touch, reduced-motion | `alpha` | `0f26bd13659a` | git merge-base --is-ancestor 0f26bd13659a tip → true; tip merge-log mentions #410; git cherry tip head → 0 unique commits. | **close** |
| #411 | fix(hex): coarse 44px cell targets + reduced-motion board glow | `alpha` | `83c8c477f71c` | git merge-base --is-ancestor 83c8c477f71c tip → true; tip merge-log mentions #411; git cherry tip head → 0 unique commits. | **close** |
| #412 | fix(star-track): AI-seat input lock, aria honesty, touch, reduced-motion | `alpha` | `4e9e3185e763` | git merge-base --is-ancestor 4e9e3185e763 tip → true; tip merge-log mentions #412; git cherry tip head → 0 unique commits. | **close** |
| #415 | fix(playtest): recheck #413 vs top-10 + safe polish escapes | `alpha` | `8b1de5d5f265` | git merge-base --is-ancestor 8b1de5d5f265 tip → true; tip merge-log mentions #415; git cherry tip head → 0 unique commits. | **close** |
| #416 | fix(kwatro-sinko): AI long-game thrash — finish under 90 turns | `cursor/playtest-recheck-fixes-a6fd` | `08a9bdcf38cc` | git merge-base --is-ancestor 08a9bdcf38cc tip → true; tip merge-log mentions #416; git cherry tip head → 0 unique commits. | **close** |
| #417 | fix(pent-em-in): place-piece legal highlights + choose-another escape | `cursor/playtest-recheck-fixes-a6fd` | `a54b60c61385` | git merge-base --is-ancestor a54b60c61385 tip → true; tip merge-log mentions #417; git cherry tip head → 0 unique commits. | **close** |
| #420 | docs(gallery): tablet start + mid-game screenshots for every game | `cursor/overnight-polish-integration-0494` | `5e2c8e17c711` | 43/43 non-README gallery paths identical on tip vs head; only README.md differs and tip README is newer — folding would regress README. | **close** |
| #421 | fix(sum-dominoes): deep playtest — AI timer race, touch floors, UX hints | `cursor/overnight-polish-integration-0494` | `31040c1cecfd` | git merge-base --is-ancestor 31040c1cecfd tip → true; tip merge-log mentions #421; git cherry tip head → 0 unique commits. | **close** |
| #422 | fix(fab-a-diffy): deep playtest polish — AI-seat lock, touch, claim UX | `cursor/overnight-polish-integration-0494` | `8a2841958a96` | git merge-base --is-ancestor 8a2841958a96 tip → true; tip merge-log mentions #422; git cherry tip head → 0 unique commits. | **close** |
| #423 | perf: shrink menu bundle for cheap tablets (lazy mounts + play CSS) | `cursor/overnight-polish-integration-0494` | `e0c63e976f90` | git merge-base --is-ancestor e0c63e976f90 tip → true; tip merge-log mentions #423; git cherry tip head → 0 unique commits. | **close** |
| #424 | fix(fraction-pinball): deep playtest UX, AI pace, touch, balls floor | `cursor/overnight-polish-integration-0494` | `bf794cde97f3` | git merge-base --is-ancestor bf794cde97f3 tip → true; tip merge-log mentions #424; git cherry tip head → 0 unique commits. | **close** |
| #425 | fix(contig-60): deep playtest — AI timer race, touch, Hard lookahead, UX | `cursor/overnight-polish-integration-0494` | `14c9b2077729` | git merge-base --is-ancestor 14c9b2077729 tip → true; tip merge-log mentions #425; git cherry tip head → 0 unique commits. | **close** |
| #426 | fix(kings): deep playtest polish — 44px cells, You/AI copy, Medium win pool | `cursor/overnight-polish-integration-0494` | `573a68bcb00e` | git merge-base --is-ancestor 573a68bcb00e tip → true; tip merge-log mentions #426; git cherry tip head → 0 unique commits. | **close** |
| #427 | fix(queens-guards): deep playtest — 44px taps, AI-seat aria, think paint | `cursor/overnight-polish-integration-0494` | `31bf0f6dd8fe` | git merge-base --is-ancestor 31bf0f6dd8fe tip → true; tip merge-log mentions #427; git cherry tip head → 0 unique commits. | **close** |
| #430 | fix(calla): deep vs-AI playtest polish + regressions (2026-10-07) | `cursor/overnight-polish-integration-0494` | `fe1253c3bd7e` | git merge-base --is-ancestor fe1253c3bd7e tip → true; tip merge-log mentions #430; git cherry tip head → 0 unique commits. | **close** |
| #431 | fix(ramrod): deep playtest — AI timer race, desktop hit box, touch floors | `cursor/overnight-polish-integration-0494` | `86b6c3167ff3` | git merge-base --is-ancestor 86b6c3167ff3 tip → true; tip merge-log mentions #431; git cherry tip head → 0 unique commits. | **close** |
| #432 | fix(stars-bars): deep playtest — AI timer race, touch, You/Computer UX | `cursor/overnight-polish-integration-0494` | `71fb588d0285` | git merge-base --is-ancestor 71fb588d0285 tip → true; tip merge-log mentions #432; git cherry tip head → 0 unique commits. | **close** |
| #433 | fix(par-55): deep playtest — AI timer race, touch floors, turn copy | `cursor/overnight-polish-integration-0494` | `f91dcfe37946` | git merge-base --is-ancestor f91dcfe37946 tip → true; tip merge-log mentions #433; git cherry tip head → 0 unique commits. | **close** |
| #434 | fix(hex): deep playtest polish — 44px cells, AI soft-lock, HvA UX | `cursor/overnight-polish-integration-0494` | `6b72e4850629` | git merge-base --is-ancestor 6b72e4850629 tip → true; tip merge-log mentions #434; git cherry tip head → 0 unique commits. | **close** |
| #435 | ci: run lint/tsc/unit/e2e for PRs targeting cursor/** | `alpha` | `23668691d48c` | git merge-base --is-ancestor 23668691d48c tip → true; tip merge-log mentions #435; git cherry tip head → 0 unique commits. | **close** |
| #436 | fix(star-track): deep playtest playability fixes (timers, copy, touch, AI pace) | `cursor/overnight-polish-integration-0494` | `bfdf26d9b387` | git merge-base --is-ancestor bfdf26d9b387 tip → true; tip merge-log mentions #436; git cherry tip head → 0 unique commits. | **close** |
| #437 | test(a11y): axe-core e2e sweep for shell/menu + contrast fixes | `cursor/overnight-polish-integration-0494` | `295f5e5a9ed3` | git merge-base --is-ancestor 295f5e5a9ed3 tip → true; tip merge-log mentions #437; git cherry tip head → 0 unique commits. | **close** |
| #438 | chore(integration): deep-playtest playability stack (#421–427, #430, #432–433) | `cursor/overnight-polish-integration-0494` | `42372d230d03` | git merge-base --is-ancestor 42372d230d03 tip → true; git cherry tip head → 0 unique commits. | **close** |
| #439 | chore(e2e): cross-browser smoke (WebKit, Firefox, iPad) + shell CSS fixes | `cursor/overnight-polish-integration-0494` | `3d1f352f0a38` | git merge-base --is-ancestor 3d1f352f0a38 tip → true; tip merge-log mentions #439; git cherry tip head → 0 unique commits. | **close** |
| #440 | chore(integration): deep-playtest stack-2 (#431, #434, #436, #437) | `cursor/deep-playtest-integration-48a7` | `ce8725438a7d` | git merge-base --is-ancestor ce8725438a7d tip → true; git cherry tip head → 0 unique commits. | **close** |
| #442 | fix(test): flake hunt — RAF/timer isolation under shuffle | `cursor/overnight-polish-integration-0494` | `5f1bce1b96bf` | git merge-base --is-ancestor 5f1bce1b96bf tip → true; tip merge-log mentions #442; git cherry tip head → 0 unique commits. | **close** |
| #443 | fix(e2e): harden Chromium 3D board timeouts (board3dLQ + ready waits) | `cursor/overnight-polish-integration-0494` | `2d11712f97b3` | git merge-base --is-ancestor 2d11712f97b3 tip → true; tip merge-log mentions #443; git cherry tip head → 0 unique commits. | **close** |
| #444 | merge: playability stack — #415 recheck + #416 Kwatro AI + #417 Pent place UX | `cursor/deep-playtest-stack-2-460b` | `dc241b1d6a4b` | git merge-base --is-ancestor dc241b1d6a4b tip → true; git cherry tip head → 0 unique commits. | **close** |
| #445 | feat(test): opt-in Playwright 2D visual regression suite | `cursor/overnight-polish-integration-0494` | `dd670b7f2bf9` | git merge-base --is-ancestor dd670b7f2bf9 tip → true; tip merge-log mentions #445; git cherry tip head → 0 unique commits. | **close** |
| #446 | docs(tutorials): tutorial–engine mismatch audit + K-5 clarity polish | `cursor/overnight-polish-integration-0494` | `68eef77c3284` | git merge-base --is-ancestor 68eef77c3284 tip → true; tip merge-log mentions #446; git cherry tip head → 0 unique commits. | **close** |
| #447 | merge(test-infra): stack #439 cross-browser + #443 3D e2e + #445 visual onto playability | `cursor/playability-stack-415-417-b354` | `f34e7fe2bca5` | git merge-base --is-ancestor f34e7fe2bca5 tip → true; git cherry tip head → 0 unique commits. | **close** |
| #448 | fix(a11y): keyboard-only + screen-reader audit (2D) | `cursor/overnight-polish-integration-0494` | `4748ca890f46` | git merge-base --is-ancestor 4748ca890f46 tip → true; tip merge-log mentions #448; git cherry tip head → 0 unique commits. | **close** |
| #449 | stack(#446+#448): tutorial clarity + keyboard/SR a11y onto test-infra | `cursor/test-infra-stack-439-443-445-6174` | `fdb423aa07c0` | git merge-base --is-ancestor fdb423aa07c0 tip → true; git cherry tip head → 0 unique commits. | **close** |
| #450 | fix(e2e): stabilize ramrod-deep mutual-place deadlock flake | `cursor/test-infra-stack-439-443-445-6174` | `34be2a21267f` | git merge-base --is-ancestor 34be2a21267f tip → true; tip merge-log mentions #450; git cherry tip head → 0 unique commits. | **close** |
| #452 | test(engines): invariant coverage for six lowest-covered rules engines | `cursor/overnight-polish-integration-0494` | `dd0944c79faf` | git merge-base --is-ancestor dd0944c79faf tip → true; tip merge-log mentions #452; git cherry tip head → 0 unique commits. | **close** |
| #454 | stack(#450+#451+#452): flake fixes + engine invariants onto a11y-tutorial | `cursor/a11y-tutorial-stack-446-448-05a3` | `4604c09bf939` | git merge-base --is-ancestor 4604c09bf939 tip → true; git cherry tip head → 0 unique commits. | **close** |
| #455 | feat(ci): report-only gzip bundle size budget check | `cursor/overnight-polish-integration-0494` | `d86e87a52771` | git merge-base --is-ancestor d86e87a52771 tip → true; tip merge-log mentions #455; git cherry tip head → 0 unique commits. | **close** |
| #456 | test(engines): targeted branch coverage for kwatro / kings / fiar | `cursor/overnight-polish-integration-0494` | `3dfe1720cb00` | git merge-base --is-ancestor 3dfe1720cb00 tip → true; tip merge-log mentions #456; git cherry tip head → 0 unique commits. | **close** |
| #457 | fix(mobile): phone audit, chrome tap targets, viewport smoke e2e | `cursor/overnight-polish-integration-0494` | `f1e724c341e1` | git merge-base --is-ancestor f1e724c341e1 tip → true; tip merge-log mentions #457; git cherry tip head → 0 unique commits. | **close** |
| #458 | docs+fix: offline/Slow-3G resilience notes and chunk-load retry recovery | `cursor/overnight-polish-integration-0494` | `709e10261d27` | git merge-base --is-ancestor 709e10261d27 tip → true; tip merge-log mentions #458; git cherry tip head → 0 unique commits. | **close** |
| #459 | test(engines): targeted branch coverage for remaining hex-a-gone rules | `cursor/overnight-polish-integration-0494` | `b9c9b0577920` | git cherry shows +1 commit but tip:path blob IDs match head for both PR files; content_ratio=1.0. | **close** |
| #460 | Engine coverage: next 5 modules (tests only) | `cursor/overnight-polish-integration-0494` | `ad758f01c157` | git merge-base --is-ancestor ad758f01c157 tip → true; git cherry tip head → 0 unique commits. | **close** |
| #461 | Fold wave 2: #442 #455 #456 #457 #458 | `cursor/overnight-polish-integration-0494` | `5512723be190` | git merge-base --is-ancestor 5512723be190 tip → true; git cherry tip head → 0 unique commits. | **close** |
| #462 | Console sweep + per-game error boundaries | `cursor/overnight-polish-integration-0494` | `e03f8e9d4dbc` | git merge-base --is-ancestor e03f8e9d4dbc tip → true; git cherry tip head → 0 unique commits. | **close** |
| #463 | Runtime perf harness + unmount timer-leak fixes | `cursor/overnight-polish-integration-0494` | `684698289351` | git merge-base --is-ancestor 684698289351 tip → true; git cherry tip head → 0 unique commits. | **close** |
| #464 | integration: merge console-sweep + runtime-perf cleanup | `cursor/overnight-polish-integration-0494` | `5c7991f4d5aa` | git merge-base --is-ancestor 5c7991f4d5aa tip → true; tip merge-log mentions #464; git cherry tip head → 0 unique commits. | **close** |
| #465 | test(state): round-trip fuzz for every game | `cursor/overnight-polish-integration-0494` | `3451655bc2fe` | git merge-base --is-ancestor 3451655bc2fe tip → true; tip merge-log mentions #465; git cherry tip head → 0 unique commits. | **close** |
| #466 | merge: fold-wave2 + engine-coverage-next5 onto flake-engine tip | `cursor/overnight-flake-engine-stack-737e` | `bc4410a7654e` | git merge-base --is-ancestor bc4410a7654e tip → true; tip merge-log mentions #466; git cherry tip head → 0 unique commits. | **close** |
| #467 | test(e2e): visual regression baselines (start + openings, report-only CI) | `alpha` | `d19df405d081` | git merge-base --is-ancestor d19df405d081 tip → true; tip merge-log mentions #467; git cherry tip head → 0 unique commits. | **close** |
| #469 | test(a11y): axe-core game screen audits + clear contrast/ARIA fixes | `cursor/overnight-polish-integration-0494` | `ee7794d06d72` | git merge-base --is-ancestor ee7794d06d72 tip → true; tip merge-log mentions #469; git cherry tip head → 0 unique commits. | **close** |
| #470 | Fold wave 4: #464 #465 #467 onto overnight flake stack (#454) | `cursor/overnight-flake-engine-stack-737e` | `75b77d7c6446` | git merge-base --is-ancestor 75b77d7c6446 tip → true; git cherry tip head → 0 unique commits. | **close** |
| #471 | test(e2e): cross-browser firefox/webkit pass (report-only CI) | `cursor/overnight-fold-coverage-tip-460a` | `60a8c027da5f` | git merge-base --is-ancestor 60a8c027da5f tip → true; tip merge-log mentions #471; git cherry tip head → 0 unique commits. | **close** |
| #472 | fix: Hard AI think-time bench + hex/queens Hard time-box (≤500ms p95) | `cursor/overnight-polish-integration-0494` | `a9a6a5e97ee5` | git merge-base --is-ancestor a9a6a5e97ee5 tip → true; tip merge-log mentions #472; git cherry tip head → 0 unique commits. | **close** |
| #473 | test: undo/redo and move-log consistency audit | `alpha` | `a5b9d48f3df0` | git merge-base --is-ancestor a5b9d48f3df0 tip → true; tip merge-log mentions #473; git cherry tip head → 0 unique commits. | **close** |
| #474 | fix(e2e): Chromium flake hunt — waits, seeds, reduced-motion | `cursor/overnight-polish-integration-0494` | `f99f16cf66ab` | git merge-base --is-ancestor f99f16cf66ab tip → true; tip merge-log mentions #474; git cherry tip head → 0 unique commits. | **close** |
| #475 | docs(wiki): architecture, registry, testing layers with screenshots | `cursor/overnight-fold-coverage-tip-460a` | `2748ed0e9cb8` | git merge-base --is-ancestor 2748ed0e9cb8 tip → true; tip merge-log mentions #475; git cherry tip head → 0 unique commits. | **close** |
| #476 | Tip: fold #464/#465/#467/#469/#472/#473 onto fold-coverage (#466) | `cursor/overnight-fold-coverage-tip-460a` | `367d291e8190` | git merge-base --is-ancestor 367d291e8190 tip → true; tip merge-log mentions #476; git cherry tip head → 0 unique commits. | **close** |
| #478 | test(ai): seed determinism + difficulty quality audit | `cursor/overnight-fold-coverage-tip-460a` | `51419c75a34b` | git merge-base --is-ancestor 51419c75a34b tip → true; tip merge-log mentions #478; git cherry tip head → 0 unique commits. | **close** |
| #479 | fix(pwa): WebKit offline soft-nav via idle-warm route mounts | `cursor/cross-browser-pass-6818` | `6989a6503b9b` | git merge-base --is-ancestor 6989a6503b9b tip → true; tip merge-log mentions #479; git cherry tip head → 0 unique commits. | **close** |
| #480 | fix: memory-leak audit + destroyGame cleanup for menu remounts | `cursor/integration-fold-wave4-tip-36e4` | `ea4f6e2070a1` | git merge-base --is-ancestor ea4f6e2070a1 tip → true; tip merge-log mentions #480; git cherry tip head → 0 unique commits. | **close** |
| #481 | fix(test): unit suite flake hunt — selector + owl shared-state | `cursor/overnight-fold-coverage-tip-460a` | `b14fa5253aa6` | git merge-base --is-ancestor b14fa5253aa6 tip → true; tip merge-log mentions #481; git cherry tip head → 0 unique commits. | **close** |
| #482 | test(engines): edge-case suite for all 20 game engines | `cursor/integration-fold-wave4-tip-36e4` | `4adbfc0e1a1d` | git merge-base --is-ancestor 4adbfc0e1a1d tip → true; tip merge-log mentions #482; git cherry tip head → 0 unique commits. | **close** |
| #483 | docs: owner rules-decision checklist (2026-10-07) | `cursor/integration-fold-wave4-tip-36e4` | `5977d3130e28` | git merge-base --is-ancestor 5977d3130e28 tip → true; tip merge-log mentions #483; git cherry tip head → 0 unique commits. | **close** |
| #484 | docs: merge rehearsal for Oct 9 tip stack (#476) | `cursor/integration-fold-wave4-tip-36e4` | `bcaeb2da3fc8` | git merge-base --is-ancestor bcaeb2da3fc8 tip → true; tip merge-log mentions #484; git cherry tip head → 0 unique commits. | **close** |
| #485 | docs(test): standalone triage fold onto wave4 tip (#355/#414/#420/#459/#468/#481) | `cursor/integration-fold-wave4-tip-36e4` | `e85ab977a037` | git merge-base --is-ancestor e85ab977a037 tip → true; tip merge-log mentions #485; git cherry tip head → 0 unique commits. | **close** |
| #486 | Touch/mobile pass: phone + tablet smoke (report-only) | `cursor/integration-fold-wave4-tip-36e4` | `705f3b420cbf` | git merge-base --is-ancestor 705f3b420cbf tip → true; tip merge-log mentions #486; git cherry tip head → 0 unique commits. | **close** |
| #489 | perf: menu first-load trim + report-only check:perf | `cursor/integration-fold-wave4-tip-36e4` | `ac10cae61041` | git merge-base --is-ancestor ac10cae61041 tip → true; tip merge-log mentions #489; git cherry tip head → 0 unique commits. | **close** |
| #490 | fix(e2e): mp3d canvas-ready under SwiftShader (0 timeouts) | `cursor/integration-fold-wave4-tip-36e4` | `38e3acff3300` | git merge-base --is-ancestor 38e3acff3300 tip → true; tip merge-log mentions #490; git cherry tip head → 0 unique commits. | **close** |
| #491 | fix(a11y): keyboard reachability for menu, modals, and boards | `alpha` | `fa9a6f13fdb3` | git merge-base --is-ancestor fa9a6f13fdb3 tip → true; tip merge-log mentions #491; git cherry tip head → 0 unique commits. | **close** |
| #505 | test: burn-1007 HvH fullgame e2e suite (report-only) | `cursor/integration-fold-wave5-tip-4af0` | `cc9cbe7a687a` | tip 7b99c2bb test(e2e): fold #505 fullgame suite over tip #507 layout; 22/27 PR paths blob-identical; remaining diffs are tip CI/contract unions. | **close** |
| #520 | chore(lint): TypeScript lint-rule ratchet (burn-1008-mp-lint-ratchet) | `cursor/integration-fold-wave5-tip-4af0` | `b5d750b64e19` | tip e1692696 merge(#520) re-applied lint ratchet + curly ceiling; intent fully landed on tip. | **close** |

## (b) Superseded by a named newer PR

*5 PRs*

| PR | Title | Base | Head SHA | Evidence | Action |
| ---: | --- | --- | --- | --- | --- |
| #441 | docs: consolidate 2026-10-07 deep-playtest rules/scoring questions | `cursor/overnight-polish-integration-0494` | `47743359d193` | tip docs/RULES-DECISIONS-2026-10-07.md (fold #483) explicitly sources #441's 17 deep-playtest questions. superseded by #483 (on tip) | **close** |
| #453 | docs: 2026-10-07 open draft PR merge-order inventory | `alpha` | `d08f157dc839` | stale alpha-based merge-order inventory; tip already has docs/merge-order-2026-10-07.md + MERGE-REHEARSAL/#484/#485 fold docs. superseded by tip docs from #484/#485 folds | **close** |
| #503 | docs(dev): Phase 2 type-ratchet plan + report-only baseline (burn-1007) | `cursor/integration-fold-wave5-tip-4af0` | `cdc52b439cca` | tip commit 293ca1d5 supersede #503; tip plan/baseline already Batch 0+1 (ceiling 518) vs PR snapshot 564. superseded by #502/#516 (on tip) | **close** |
| #506 | docs: contributor engine reference for 20 games (burn-1007-mp-engine-devdocs) | `cursor/integration-fold-wave5-tip-4af0` | `dd6872af583c` | tip merge(#504) + 1938923f supersede #506/#510 twins; docs/dev/engines/* already on tip. superseded by #504 (on tip) | **close** |
| #510 | test: raise non-engine UI unit coverage (burn-1007-mp-ui-coverage) | `cursor/integration-fold-wave5-tip-4af0` | `fb6d9cbbac86` | tip ed22676f merge(#509)+port(#510); 1938923f supersede note. superseded by #509 (on tip) | **close** |

## (c) Still unique and fold-worthy

*21 PRs*

| PR | Title | Base | Head SHA | Evidence | Action |
| ---: | --- | --- | --- | --- | --- |
| #355 | docs(mp3d): Step-0 rules-first 3D board specs (docs only, draft) | `alpha` | `7183bdec684d` | docs-only mp3d Step-0 specs; kings/kwatro spec files still absent on tip; cherry +1 unique. | **fold** (fold #2) |
| #451 | fix(e2e): stabilize prime-gold 3D keyboard a11y flake | `cursor/a11y-tutorial-stack-446-448-05a3` | `16272aa02a79` | tip log merge(#451) landed e2e helpers only; collectGridCells mirror filter in src/ui/board-a11y.ts still absent on tip (present on head); unit test still unique. | **fold** (fold #3) |
| #511 | perf(render): board hover/rebuild latency (burn-1007) | `cursor/integration-fold-wave5-tip-4af0` | `f42c22c26a42` | tip 11db84d0 claims port(#511) but git grep patchHoverPreview on tip → none; head still has patchHoverPreview/patchBoardPreview. | **fold** (fold #6) |
| #522 | test(a11y): WCAG 1.4.4/1.4.10 zoom + reflow audit (report-only) | `cursor/integration-fold-wave5-tip-4af0` | `182fd668ece6` | wave5 tip draft; zoom/reflow report-only suite absent on tip. | **fold** (fold #11) |
| #524 | chore(build): reproducible Vite/PWA builds + check:build (burn-1008) | `cursor/integration-fold-wave5-tip-4af0` | `5c7caa6dcd1e` | wave5 tip draft; build repro/check:build absent on tip; after #534 per rehearsal. | **fold** (fold #13) |
| #526 | test: consolidate shared unit/e2e fixture helpers (burn-1008) | `cursor/integration-fold-wave5-tip-4af0` | `b36ab51b766c` | wave5 tip draft; large test-fixture consolidation; rehearsal clean. | **fold** (fold #7) |
| #527 | ci: workflow hardening contract + lockfile-keyed npm cache (burn-1008) | `cursor/integration-fold-wave5-tip-4af0` | `f75c3530004b` | wave5 tip draft; workflow hardening + lockfile cache; permission greps are negative-test fixtures only. | **fold** (fold #14) |
| #528 | fix(storage): safe Web Storage wrapper for failure modes (burn-1008) | `cursor/integration-fold-wave5-tip-4af0` | `5846d229571b` | wave5 tip draft; safe Web Storage wrapper absent on tip; rehearsal clean. | **fold** (fold #5) |
| #529 | fix(ui): canvas/SVG/WebGL DPR + resize hit-test (burn-1008) | `cursor/integration-fold-wave5-tip-4af0` | `b0211463ffca` | wave5 tip draft; canvas DPR/resize helpers absent on tip; rehearsal clean. | **fold** (fold #8) |
| #530 | fix(a11y): forced-colors + reduced-motion audit (burn-1008) | `cursor/integration-fold-wave5-tip-4af0` | `9489e7c3850a` | wave5 tip draft; forced-colors/reduced-motion audit absent on tip; rehearsal clean. | **fold** (fold #10) |
| #531 | fix(nav): history-routing audit (burn-1008-mp-history-routing) | `cursor/integration-fold-wave5-tip-4af0` | `f741b9483514` | wave5 tip draft; history routing + tests unique vs tip; rehearsal clean merge. | **fold** (fold #4) |
| #532 | chore(licenses): CycloneDX SBOM + report:licenses (burn-1008-mp-license-sbom) | `cursor/integration-fold-wave5-tip-4af0` | `3a676d36ea00` | wave5 tip draft; CycloneDX SBOM scripts/docs absent on tip. | **fold** (fold #15) |
| #533 | fix(ui): pointer edge-case hygiene for boards (burn-1008) | `cursor/integration-fold-wave5-tip-4af0` | `5e4e6ebabb6d` | wave5 tip draft; pointer hygiene helpers absent on tip; rehearsal clean. | **fold** (fold #9) |
| #534 | fix(pwa): installability manifest contract + metadata (burn-1008) | `cursor/integration-fold-wave5-tip-4af0` | `d9c09df69b55` | wave5 tip draft; PWA installability contract absent on tip; before #524 per rehearsal. | **fold** (fold #12) |
| #536 | chore: dead-code inventory report (burn-1008) — fold last | `cursor/integration-fold-wave5-tip-4af0` | `fdcd40dd876d` | report-only dead-code inventory; fold before #541. | **fold** (fold #20) |
| #538 | docs(dev): burn-1008 compliance review of open tip drafts | `cursor/integration-fold-wave5-tip-4af0` | `bd69e8ca81f3` | report-only docs/dev/burn-1008-compliance-review.md absent on tip. | **fold** (fold #17) |
| #539 | test: restore/enforce engine→UI boundary (burn-1008-mp-engine-ui-boundary-repair) | `cursor/integration-fold-wave5-tip-4af0` | `c86896f66574` | characterization + CI check:boundaries for engine→UI=0; unique vs tip. | **fold** (fold #16) |
| #540 | test(math): safe precision recut — characterize tip, defer scoring fixes (burn-1008) | `cursor/integration-fold-wave5-tip-4af0` | `fffc4b7b4875` | safe recut: docs + characterization tests only (no src/); supersedes #535 for folding. | **fold** (fold #1) |
| #541 | chore: execute safe dead-code removals (burn-1008) — FOLD LAST | `cursor/integration-fold-wave5-tip-4af0` | `089c05b54489` | executes #536 safe removals; FOLD LAST after #536. | **fold** (fold #21) |
| #542 | docs(dev): wave5 fold rehearsal report (burn-1008-mp-wave5-fold-rehearsal) | `cursor/integration-fold-wave5-tip-4af0` | `724a4e6618c6` | report-only docs/dev/wave5-fold-rehearsal-2026-10-08.md absent on tip. | **fold** (fold #19) |
| #543 | docs(dev): burn-1008 compliance review 2 of tip drafts #539–#542 | `cursor/integration-fold-wave5-tip-4af0` | `db2d96670b3d` | report-only docs/dev/burn-1008-compliance-review-2.md absent on tip (reviews #539–#542). | **fold** (fold #18) |

## (d) Needs an owner decision

*4 PRs*

| PR | Title | Base | Head SHA | Evidence | Action |
| ---: | --- | --- | --- | --- | --- |
| #393 | fix(kwatro-sinko): allow non-contiguous winning paths (Div II / #355 polish) | `alpha` | `1b685ca3c1da` | tip contains merge then Revert of #393 (55b4212d); head still ancestor but tree effect undone; non-contiguous win paths absent on tip. Question: Re-land #393 (Div II non-contiguous winning paths) or keep the revert? | **decide** |
| #394 | test(kwatro-sinko): lock Div II diagonals and path-scan after #391 | `alpha` | `6387bb035668` | adds rules-lock tests + docs comments locking contiguous Div II scan; pairs with reverted #393; tip lacks kwatro-sinko-rules-lock-div2.test.ts. Question: Fold the contiguous-lock tests now, or wait until Q2 (gaps on winning path) is answered with #393? | **decide** |
| #418 | fix(playtest): Prime Gold Roll settle + FIAR move-phase touch | `cursor/playtest-recheck-fixes-a6fd` | `79ac0ca092b3` | unique vs tip: prime-gold rules settle helpers + ai pass-on-empty-chips; fiar move-phase touch; not in tip merge list. Question: Allow soft-lock settle/AI pass escapes (rules/AI-adjacent) or require a playability-only recut? | **decide** |
| #477 | Tip: wave5 fold on #476 — land #477 alone into alpha | `cursor/integration-fold-wave4-tip-36e4` | `7b99c2bbd63b` | head SHA equals prior tip tip; PR remains the wave5 tip land-into-alpha vehicle (live tip now 7b99c2bbd63b after #505 fold). Question: When should tip #477 land alone into alpha for the Fri Oct 9 merge window? | **decide** |

## (e) Hard-rule violation

*9 PRs*

| PR | Title | Base | Head SHA | Evidence | Action |
| ---: | --- | --- | --- | --- | --- |
| #419 | fix(remainder-islands): deep playtest stalls, touch UX, AI pacing | `cursor/overnight-polish-integration-0494` | `9e65a66dbed9` | remainder-islands ai.ts scoring (+remainder preference) and rules.ts paths; not folded into tip. Rule: Hard rule: No AI behavior changes; also rules/scoring paths | **close** |
| #428 | fix(juggle): deep playtest — jam Pass, fit-aware UX, AI seat polish | `cursor/overnight-polish-integration-0494` | `3746ed3fa903` | juggle ai.ts + rules.ts add passTurn/shouldOfferPass; legal-move/outcome path changes. Rule: Hard rule: No AI behavior changes; game mechanic / rules changes require owner (escalate) | **close** |
| #429 | fix(hex-a-gone): deep playtest polish — AI budget, touch, HvA UX | `cursor/overnight-polish-integration-0494` | `c4ee893342cc` | hex-a-gone ai.ts caps selection by difficulty lookahead (Easy=1…Hard=3). Rule: Hard rule: No AI behavior changes (search, scoring, difficulty, timing) | **close** |
| #468 | test(ai): headless AI calibration matrices + Hard≥Easy guards | `cursor/overnight-polish-integration-0494` | `c821b6c3bd4a` | AI calibration retunes fiar/kwatro/pent ai.ts; tip #485 fold note skipped #468 AI retunes. Rule: Hard rule: No AI behavior changes (search, scoring, difficulty, timing) | **close** |
| #487 | docs(copy): kid-friendly player text polish (grades 3–5) | `alpha` | `49e7ca07de43` | player-facing copy polish across registry/owl/status strings (broad UI copy diff). Rule: Hard rule: No player-facing copy or rules-text changes | **close** |
| #488 | fix(ai): tip AI difficulty recheck — FIAR/Pent Hard≥Easy (draft) | `cursor/integration-fold-wave4-tip-36e4` | `889f02694d58` | changes fiar/ai.ts and pent-em-in/ai.ts for Hard≥Easy difficulty retune. Rule: Hard rule: No AI behavior changes (search, scoring, difficulty, timing) | **close** |
| #492 | docs(rules): audit help/tutorial text vs engine (docs/tests only) | `alpha` | `2d5976e582df` | edits many games' tutorial.ts + game-registry help/rules text. Rule: Hard rule: No player-facing copy or rules-text changes | **close** |
| #535 | fix(math): arithmetic exactness audit (burn-1008-mp-math-precision) | `cursor/integration-fold-wave5-tip-4af0` | `d21d2ed05001` | changes isPrime/negate/isWholeNumber scoring-adjacent helpers; compliance #538 violation; use #540 instead. Rule: Hard rule: No AI/scoring / legal-move outcome changes | **close** |
| #537 | fix(types): Phase-2 type-ratchet Batch 2 — rules-heavy non-AI (burn-1008) | `cursor/integration-fold-wave5-tip-4af0` | `300ba2d600c2` | edits rules.ts apply/legality paths with ?? fallbacks/silent no-ops; compliance #538 violation. Rule: Hard rule: No legal-move generation / outcome / scoring path changes without owner exemption | **close** |

## Completeness check

- Open PRs from API: **119**
- Classification rows in sections (a)–(e): **119**
- Unique PR numbers: **119**
- Category sum: **119**

## Verification commands (this triage)

```bash
gh pr list --repo fuzzywigg/math-pentathlon --state open --limit 200 --json number | jq length
# → 119

git rev-parse origin/cursor/integration-fold-wave5-tip-4af0
# → 7b99c2bbd63b4634a5fef9703c9aa76b6d61c343

# Spot-check (#459 content identity)
git rev-parse 7b99c2bbd63b4634a5fef9703c9aa76b6d61c343:tests/unit/engine-coverage-hex-a-gone-targeted.test.ts
git rev-parse b9c9b0577920d17c96df029a224f673d2f3c385b:tests/unit/engine-coverage-hex-a-gone-targeted.test.ts
# → identical blob IDs

# Spot-check (#511 still unique)
git grep -n patchHoverPreview 7b99c2bbd63b4634a5fef9703c9aa76b6d61c343 -- "*.ts" || echo "not on tip"
git grep -n patchHoverPreview f42c22c26a42 -- "*.ts" | head
# → absent on tip; present on #511 head

# Spot-check (#505 folded)
git log -1 --oneline 7b99c2bbd63b4634a5fef9703c9aa76b6d61c343
# → 7b99c2bb test(e2e): fold #505 fullgame suite over tip #507 layout
```

## Next action

**Next action: fold into tip by the tip owner**
