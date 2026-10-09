# Alpha AI/copy delta isolation (2026-10-08)

**Task id:** `burn-1008-mp-ai-copy-delta-isolation`

> **This branch is an OPTION for the owner at the merge window — not a fold-by-default.**
> Each logical group is an independent revertible commit that restores `origin/alpha` content for flagged AI/copy deltas only (with documented exceptions). The tip owner decides keep vs restore per group.

## Refs

| Ref | SHA |
| --- | --- |
| Tip base (`cursor/integration-fold-wave5-tip-4af0`) | `c9c54a94742e5bdef4c4657a35617873edb963fa` |
| Alpha (`origin/alpha`) | `eec2b327c1e65586537cbe03b1c29b93065dee03` |
| This branch HEAD | `b14bd5f4` (docs commit; product restores green at `cca6f6ad`) |
| Audit source | #552 / `cursor/tip-vs-alpha-hard-rule-audit-551d` (tip `36a1340d` vs alpha `eec2b327…`) |
| Decision sheet | #549 item **D07** |

## Exceptions (must NOT fully restore)

1. **Hex Hard assert stays 450ms** on tip (`src/games/hex/ai.ts` `AI_PLAY_DEADLINE_MS.hard = 450`).
2. **Stars & Bars history stays uncapped** (alpha already uncapped; restore does not reintroduce `slice(-15)`).
3. **Tip-compat holds** required for suite green against tip mounts: `destroyGame` stubs on alpha controllers lacking tip #501 hooks; `import type` lint fixes; Star Track `StarTrackGameMode` tip-compat for tip 3D mounts.

## How to use at the merge window

- To **drop** a restore group (keep tip behavior): `git revert <restore-sha>` (and its companion test/lint commits if needed).
- To **keep** a restore group: leave it on the tip fold.
- Groups are independent; dual-classified controllers restored under **ai-think-delays** also revert their status-copy hunks in that group.

## Group summary

| Group | Restore commit | Green at | Recommended | One-line reason |
| --- | --- | --- | --- | --- |
| `ai-hex` — Hex AI (keep Hard 450) | `0aec5dfc` | `3f586478` | **KEEP tip (Hard 450)** | Standing tip rule: Hex Hard assert stays 450; restore was no-op for the only AI deadline delta. |
| `ai-queens` — Queens AI | `b94d6068` | `cd9d4f08` | **RESTORE alpha** | Hard 2500 returns with alpha; tip ≤500ms bench was agent #472 remediation without explicit Andrew ask. |
| `ai-kings` — Kings AI | `a1b2495e` | `a1b2495e` | **RESTORE alpha** | Medium win-pool change is agent deep-playtest; scoring/selection risk for merge without owner eyeball. |
| `ai-kwatro` — Kwatro AI | `75518dac` | `e5c7de39` | **KEEP tip** | Alpha heuristics thrash long games (#416); tip fix is playability-critical even without explicit Andrew ask. |
| `ai-contig` — Contig AI | `63baef8d` | `63baef8d` | **RESTORE alpha** | Hard lookahead scoring is agent deep-playtest; defer unless owner wants tip Hard strength. |
| `ai-think-delays` — AI think delays (11 controllers) | `7dbf46fe` | `baff32c9` | **RESTORE alpha** | Think-delay retunes are agent pace polish; restoring alpha returns live timing without new AI logic. |
| `tutorial-div1` — Tutorials Division I | `6b36f336` | `fc9a1076` | **RESTORE alpha** | #446 K-5 polish not explicitly Andrew-requested; D07 eyeball — cheapest default is live alpha copy. |
| `tutorial-div2` — Tutorials Division II | `3af2a597` | `538f7f05` | **RESTORE alpha** | Same #446 cluster; restore keeps live Division II tutorial text. |
| `tutorial-div3` — Tutorials Division III | `e7ea8186` | `82219eba` | **RESTORE alpha** | Same #446 cluster; restore keeps live Division III tutorial text. |
| `tutorial-div4` — Tutorials Division IV | `3c06c8ad` | `61421423` | **RESTORE alpha** | Same #446 cluster; restore keeps live Division IV tutorial text. |
| `status-copy` — You/Computer status copy | `b464f8df` | `cca6f6ad` | **RESTORE alpha** | You/Computer status rewrites are deep-playtest polish; restore returns live chrome unless owner prefers tip seat labels. |

## Per-file provenance (all 48 flagged files)

Restore-group labels in the **Group id** column are plain text (not backtick symbols).
They name independent revertible commit groups from the isolation branch; they are not
exported identifiers in the listed files. Putting the path first avoids the
`| Symbol | File |` checker shape used by `npm run check:dev-docs`.

| File | Group id | Origin PR / commit | Andrew-requested | Evidence | Restore SHA |
| --- | --- | --- | --- | --- | --- |
| `src/games/calla/board-ui.ts` | status-copy | calla deep playtest / `ce2dd300` | **unknown** | #430 calla deep playtest You/AI copy. | `b464f8df` |
| `src/games/calla/game-controller.ts` | ai-think-delays | calla deep playtest fold / `ce2dd300` | **unknown** | Deep-playtest / playability folds (#415/#430/#425/#424/#429/#434/#426/#433/#427/#431/#436/#432); agent-driven pace tweaks, not an explicit Andrew ask in PR/issue text. | `7dbf46fe` |
| `src/games/calla/rules.ts` | status-copy | calla deep playtest fold / `ce2dd300` | **unknown** | #430 getPhaseMessage You/AI seat display. | `b464f8df` |
| `src/games/calla/tutorial.ts` | tutorial-div1 | #446 (folded), open #492/#487 classified violation in #545 — not the tip source / `d5bccd06`, `9ed6903c` | **no** | #446 K-5 clarity polish (folded via 9ed6903c). Open #487/#492 are separate violation drafts; tip source is #446 agent polish without explicit Andrew request text. | `6b36f336` |
| `src/games/contig-60/ai.ts` | ai-contig | deep-playtest contig fold (related open draft #433 contained per #545) / `9f1ffdff` | **unknown** | #425 deep-playtest Hard lookahead; no explicit Andrew ask in PR text. | `63baef8d` |
| `src/games/contig-60/game-controller.ts` | ai-think-delays | #433 contained / `9f1ffdff` | **unknown** | Deep-playtest / playability folds (#415/#430/#425/#424/#429/#434/#426/#433/#427/#431/#436/#432); agent-driven pace tweaks, not an explicit Andrew ask in PR/issue text. | `7dbf46fe` |
| `src/games/contig-60/tutorial.ts` | tutorial-div3 | #446 (folded), open #492/#487 classified violation in #545 — not the tip source / `d5bccd06`, `9ed6903c` | **no** | #446 K-5 clarity polish (folded via 9ed6903c). Open #487/#492 are separate violation drafts; tip source is #446 agent polish without explicit Andrew request text. | `e7ea8186` |
| `src/games/fab-a-diffy/game-controller.ts` | status-copy | playtest polish / `145b6cb2` | **unknown** | #415 playtest polish Computer-is-thinking copy. | `b464f8df` |
| `src/games/fab-a-diffy/tutorial.ts` | tutorial-div3 | #446 (folded), open #492/#487 classified violation in #545 — not the tip source / `d5bccd06`, `9ed6903c` | **no** | #446 K-5 clarity polish (folded via 9ed6903c). Open #487/#492 are separate violation drafts; tip source is #446 agent polish without explicit Andrew request text. | `e7ea8186` |
| `src/games/fiar/tutorial.ts` | tutorial-div2 | #446 (folded), open #492/#487 classified violation in #545 — not the tip source / `d5bccd06`, `9ed6903c` | **no** | #446 K-5 clarity polish (folded via 9ed6903c). Open #487/#492 are separate violation drafts; tip source is #446 agent polish without explicit Andrew request text. | `3af2a597` |
| `src/games/frac-fact/tutorial.ts` | tutorial-div4 | #446 (folded), open #492/#487 classified violation in #545 — not the tip source / `d5bccd06`, `9ed6903c` | **no** | #446 K-5 clarity polish (folded via 9ed6903c). Open #487/#492 are separate violation drafts; tip source is #446 agent polish without explicit Andrew request text. | `3c06c8ad` |
| `src/games/fraction-pinball/board-ui.ts` | status-copy | fraction-pinball deep playtest / `5721ac4a` | **unknown** | #424 deep playtest You/Computer score chrome. | `b464f8df` |
| `src/games/fraction-pinball/game-controller.ts` | ai-think-delays | fraction-pinball deep playtest / `5721ac4a` | **unknown** | Deep-playtest / playability folds (#415/#430/#425/#424/#429/#434/#426/#433/#427/#431/#436/#432); agent-driven pace tweaks, not an explicit Andrew ask in PR/issue text. | `7dbf46fe` |
| `src/games/fraction-pinball/tutorial.ts` | tutorial-div4 | #446 (folded), open #492/#487 classified violation in #545 — not the tip source / `d5bccd06`, `9ed6903c` | **no** | #446 K-5 clarity polish (folded via 9ed6903c). Open #487/#492 are separate violation drafts; tip source is #446 agent polish without explicit Andrew request text. | `3c06c8ad` |
| `src/games/hex-a-gone/game-controller.ts` | ai-think-delays | playtest soft-lock/AI budget fold / `145b6cb2` | **unknown** | Deep-playtest / playability folds (#415/#430/#425/#424/#429/#434/#426/#433/#427/#431/#436/#432); agent-driven pace tweaks, not an explicit Andrew ask in PR/issue text. | `7dbf46fe` |
| `src/games/hex-a-gone/tutorial.ts` | tutorial-div1 | #446 (folded), open #492/#487 classified violation in #545 — not the tip source / `d5bccd06`, `9ed6903c` | **no** | #446 K-5 clarity polish (folded via 9ed6903c). Open #487/#492 are separate violation drafts; tip source is #446 agent polish without explicit Andrew request text. | `6b36f336` |
| `src/games/hex/ai.ts` | ai-hex | #472 (folded via merge b6758ee9) / `be668f62` | **unknown** | Delta from #472/be668f62 Hard time-box; no PR/issue text shows Andrew asked for 2500→450. Standing tip rule keeps 450 (not restored). | `0aec5dfc` |
| `src/games/hex/board-ui.ts` | status-copy | hex deep playtest, #518 UI helper dedupe / `cbe8bf85`, `83c5ab52` | **unknown** | #434 hex deep playtest winner/AI-thinking status path. | `b464f8df` |
| `src/games/hex/game-controller.ts` | ai-think-delays | hex deep playtest / #472 / `cbe8bf85`, `be668f62` | **unknown** | Deep-playtest / playability folds (#415/#430/#425/#424/#429/#434/#426/#433/#427/#431/#436/#432); agent-driven pace tweaks, not an explicit Andrew ask in PR/issue text. | `7dbf46fe` |
| `src/games/hex/tutorial.ts` | tutorial-div1 | #446 (folded), open #492/#487 classified violation in #545 — not the tip source / `d5bccd06`, `9ed6903c` | **no** | #446 K-5 clarity polish (folded via 9ed6903c). Open #487/#492 are separate violation drafts; tip source is #446 agent polish without explicit Andrew request text. | `6b36f336` |
| `src/games/juggle/board-ui.ts` | status-copy | playtest polish / `145b6cb2` | **unknown** | #415 playtest place/computer instruction wording. | `b464f8df` |
| `src/games/juggle/tutorial.ts` | tutorial-div3 | #446 (folded), open #492/#487 classified violation in #545 — not the tip source / `d5bccd06`, `9ed6903c` | **no** | #446 K-5 clarity polish (folded via 9ed6903c). Open #487/#492 are separate violation drafts; tip source is #446 agent polish without explicit Andrew request text. | `e7ea8186` |
| `src/games/kings-quadraphages/ai.ts` | ai-kings | #426 (open; tip contains equivalent fold per #545 contained) / `6d5a384f` | **unknown** | #426 deep-playtest agent polish; PR does not quote Andrew requesting win-pool change. | `a1b2495e` |
| `src/games/kings-quadraphages/board-ui.ts` | status-copy | #426 / `6d5a384f` | **unknown** | #426 You/AI phase messages. | `b464f8df` |
| `src/games/kings-quadraphages/game-controller.ts` | ai-think-delays | #426 / `6d5a384f` | **unknown** | Deep-playtest / playability folds (#415/#430/#425/#424/#429/#434/#426/#433/#427/#431/#436/#432); agent-driven pace tweaks, not an explicit Andrew ask in PR/issue text. | `7dbf46fe` |
| `src/games/kings-quadraphages/tutorial.ts` | tutorial-div1 | #446 (folded), open #492/#487 classified violation in #545 — not the tip source / `d5bccd06`, `9ed6903c` | **no** | #446 K-5 clarity polish (folded via 9ed6903c). Open #487/#492 are separate violation drafts; tip source is #446 agent polish without explicit Andrew request text. | `6b36f336` |
| `src/games/kwatro-sinko/ai.ts` | ai-kwatro | #416 (merged into tip via a34eea2a) / `08a9bdcf` | **no** | #416 addresses playtest thrash; PR says rules await Andrew and frames AI retune as agent fix, not an Andrew-requested heuristic. | `75518dac` |
| `src/games/kwatro-sinko/tutorial.ts` | tutorial-div2 | #446 (folded), open #492/#487 classified violation in #545 — not the tip source / `d5bccd06`, `9ed6903c` | **no** | #446 K-5 clarity polish (folded via 9ed6903c). Open #487/#492 are separate violation drafts; tip source is #446 agent polish without explicit Andrew request text. | `3af2a597` |
| `src/games/par-55/game-controller.ts` | ai-think-delays | par-55 deep playtest / `71077ddf` | **unknown** | Deep-playtest / playability folds (#415/#430/#425/#424/#429/#434/#426/#433/#427/#431/#436/#432); agent-driven pace tweaks, not an explicit Andrew ask in PR/issue text. | `7dbf46fe` |
| `src/games/par-55/tutorial.ts` | tutorial-div2 | #446 (folded), open #492/#487 classified violation in #545 — not the tip source / `d5bccd06`, `9ed6903c` | **no** | #446 K-5 clarity polish (folded via 9ed6903c). Open #487/#492 are separate violation drafts; tip source is #446 agent polish without explicit Andrew request text. | `3af2a597` |
| `src/games/pent-em-in/board-ui.ts` | status-copy | pent-em-in place-piece fold / `9c799573` | **unknown** | #417 place-phase hint copy (playtest recheck). | `b464f8df` |
| `src/games/pent-em-in/game-controller.ts` | status-copy | pent-em-in / `9c799573` | **unknown** | #417 won't-fit / choose-another status copy. | `b464f8df` |
| `src/games/pent-em-in/tutorial.ts` | tutorial-div4 | #446 (folded), open #492/#487 classified violation in #545 — not the tip source / `d5bccd06`, `9ed6903c` | **no** | #446 K-5 clarity polish (folded via 9ed6903c). Open #487/#492 are separate violation drafts; tip source is #446 agent polish without explicit Andrew request text. | `3c06c8ad` |
| `src/games/prime-gold/tutorial.ts` | tutorial-div4 | #446 (folded), open #492/#487 classified violation in #545 — not the tip source / `d5bccd06`, `9ed6903c` | **no** | #446 K-5 clarity polish (folded via 9ed6903c). Open #487/#492 are separate violation drafts; tip source is #446 agent polish without explicit Andrew request text. | `3c06c8ad` |
| `src/games/queens-guards/ai.ts` | ai-queens | #472 / `be668f62` | **unknown** | Same #472 Hard time-box as Hex; no explicit Andrew ask found in PR body. | `b94d6068` |
| `src/games/queens-guards/game-controller.ts` | ai-think-delays | queens deep playtest / #472 / `34e82847`, `be668f62` | **unknown** | Deep-playtest / playability folds (#415/#430/#425/#424/#429/#434/#426/#433/#427/#431/#436/#432); agent-driven pace tweaks, not an explicit Andrew ask in PR/issue text. | `7dbf46fe` |
| `src/games/queens-guards/tutorial.ts` | tutorial-div3 | #446 (folded), open #492/#487 classified violation in #545 — not the tip source / `d5bccd06`, `9ed6903c` | **no** | #446 K-5 clarity polish (folded via 9ed6903c). Open #487/#492 are separate violation drafts; tip source is #446 agent polish without explicit Andrew request text. | `e7ea8186` |
| `src/games/ramrod/game-controller.ts` | ai-think-delays | playtest AI budget fold / `145b6cb2` | **unknown** | Deep-playtest / playability folds (#415/#430/#425/#424/#429/#434/#426/#433/#427/#431/#436/#432); agent-driven pace tweaks, not an explicit Andrew ask in PR/issue text. | `7dbf46fe` |
| `src/games/ramrod/tutorial.ts` | tutorial-div2 | #446 (folded), open #492/#487 classified violation in #545 — not the tip source / `d5bccd06`, `9ed6903c` | **no** | #446 K-5 clarity polish (folded via 9ed6903c). Open #487/#492 are separate violation drafts; tip source is #446 agent polish without explicit Andrew request text. | `3af2a597` |
| `src/games/remainder-islands/tutorial.ts` | tutorial-div4 | #446 (folded), open #492/#487 classified violation in #545 — not the tip source / `d5bccd06`, `9ed6903c` | **no** | #446 K-5 clarity polish (folded via 9ed6903c). Open #487/#492 are separate violation drafts; tip source is #446 agent polish without explicit Andrew request text. | `3c06c8ad` |
| `src/games/star-track/board-ui.ts` | status-copy | #436 / `84679199` | **unknown** | #436 Blue/Red→Your/Computer turn strings. | `b464f8df` |
| `src/games/star-track/game-controller.ts` | ai-think-delays | #436 contained / `84679199` | **unknown** | Deep-playtest / playability folds (#415/#430/#425/#424/#429/#434/#426/#433/#427/#431/#436/#432); agent-driven pace tweaks, not an explicit Andrew ask in PR/issue text. | `7dbf46fe` |
| `src/games/star-track/tutorial.ts` | tutorial-div1 | #446 (folded), open #492/#487 classified violation in #545 — not the tip source / `d5bccd06`, `9ed6903c` | **no** | #446 K-5 clarity polish (folded via 9ed6903c). Open #487/#492 are separate violation drafts; tip source is #446 agent polish without explicit Andrew request text. | `6b36f336` |
| `src/games/stars-bars/board-ui.ts` | status-copy | stars-bars deep playtest, #501 then cc802d19 hold / `30b8c59c`, `cc802d19` | **unknown** | #432 You/Computer chrome; history uncapped held for Andrew (exception kept). | `b464f8df` |
| `src/games/stars-bars/game-controller.ts` | ai-think-delays | stars-bars deep playtest / `30b8c59c` | **unknown** | Deep-playtest / playability folds (#415/#430/#425/#424/#429/#434/#426/#433/#427/#431/#436/#432); agent-driven pace tweaks, not an explicit Andrew ask in PR/issue text. | `7dbf46fe` |
| `src/games/stars-bars/tutorial.ts` | tutorial-div3 | #446 (folded), open #492/#487 classified violation in #545 — not the tip source / `d5bccd06`, `9ed6903c` | **no** | #446 K-5 clarity polish (folded via 9ed6903c). Open #487/#492 are separate violation drafts; tip source is #446 agent polish without explicit Andrew request text. | `e7ea8186` |
| `src/games/sum-dominoes/game-controller.ts` | status-copy | sum-dominoes deep playtest / `331fe01a` | **unknown** | #421 legal-cell / highlighted-domino instruction copy. | `b464f8df` |
| `src/games/sum-dominoes/tutorial.ts` | tutorial-div2 | #446 (folded), open #492/#487 classified violation in #545 — not the tip source / `d5bccd06`, `9ed6903c` | **no** | #446 K-5 clarity polish (folded via 9ed6903c). Open #487/#492 are separate violation drafts; tip source is #446 agent polish without explicit Andrew request text. | `3af2a597` |

## Verification (exit codes per green group commit)

Commands after each group (and companion fixes): `npm run lint`, `npx tsc --noEmit`, `npm run test:unit`, `npm run build`.

| Group | SHA (green) | lint | tsc | test:unit | build |
| --- | --- | ---: | ---: | ---: | ---: |
| `ai-hex` | `3f586478` | 0 | 0 | 0 | 0 |
| `ai-queens` | `cd9d4f08` | 0 | 0 | 0 | 0 |
| `ai-kings` | `a1b2495e` | 0 | 0 | 0 | 0 |
| `ai-kwatro` | `e5c7de39` | 0 | 0 | 0 | 0 |
| `ai-contig` | `63baef8d` | 0 | 0 | 0 | 0 |
| `ai-think-delays` | `baff32c9` | 0 | 0 | 0 | 0 |
| `tutorial-div1` | `fc9a1076` | 0 | 0 | 0 | 0 |
| `tutorial-div2` | `538f7f05` | 0 | 0 | 0 | 0 |
| `tutorial-div3` | `82219eba` | 0 | 0 | 0 | 0 |
| `tutorial-div4` | `61421423` | 0 | 0 | 0 | 0 |
| `status-copy` | `cca6f6ad` | 0 | 0 | 0 | 0 |

Full log: `/opt/cursor/artifacts/alpha-delta-isolation-verify.log`.

## Flagged-file diff vs alpha (acceptance)

Before isolation (tip vs alpha, 48 flagged files): **2785 insertions / 936 deletions**.

After isolation (`git diff origin/alpha...HEAD -- <48 flagged files>`): **165 insertions / 87 deletions**, consisting of:

- Hex Hard **450** hold (+ type-only import lint)
- `destroyGame` tip-compat stubs on alpha controllers
- `import type` lint fixes under tip eslint ratchet
- Star Track tip-compat `StarTrackGameMode` / `gameMode?` for tip 3D mounts
- No remaining AI heuristic/delay or player-facing copy deltas vs alpha in the flagged set

## Overlap check

No open draft already performed alpha AI/copy isolation. Related: #552 (audit), #549 D07 (owner eyeball decision), #547 (preflight). This PR makes D07 cheap via independent restore commits.

## Next action

**Next action: fold into tip by the tip owner** (select keep/restore per group; do not fold by default).
