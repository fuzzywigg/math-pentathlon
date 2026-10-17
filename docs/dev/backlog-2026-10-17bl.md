# Engineering backlog — 2026-10-17bl (tip refill after bk / round-64)

**Task id:** `q-mp-090bl`  
**Role:** worker (report-only)  
**Tip audited:** `cursor/mp-tip-post4c24321` @ `4c243214` (full `4c243214c7f90f67c661cc4b779a73060d169b29`; living tip cut from prior tip after #1548 fold of round-62–63 `#1546`–`#1552`)  
**Depends on:** tip `cursor/mp-tip-post4c24321` @ `4c243214`. Round-63 backlog (`q-mp-090bk`, ids `q-mp-1494`…`1497`) and round-62 (`q-mp-090bj`, ids `q-mp-1492`…`1493`) — leave with `contained` (folded on tip via #1548; open drafts vs prior tip names are stale). Tip HEAD continues to move as tip-owner folds green drafts — **rebase onto latest tip before opening worker PRs**.

## Purpose

The tip `cursor/mp-tip-post4c24321` @ `4c243214` measures unit files **3481**; knip unusedExports **3** (LEAVE: `isPlainProgressObject`, `sanitizeSettings`, `cancelFabAiRequests`) / unusedTypes **29** / unusedFiles **0**. This doc lists **0 new** concrete engineering tasks mined from the **live tip tree after the #1548 fold**, under a **tests-only** brief scoped to settings / storage / routing / PWA/offline / UI plumbing plus `tests/playtest` harness honesty residuals **not** already covered by `q-mp-1474`…`1493`. It is the **only** deliverable of `q-mp-090bl`.

**Honest count:** **0** tasks (not 25) — measured underfill, not padded theater. No new id range opened (next free id remains `q-mp-1498` if a later round finds measured work).

**Brief gate (CRITICAL):** Only queue if MEASURED wrong-results **or** a clearly untested public API with evidence (exported function with **0** unit-test files **and** a demonstrated edge-case bug). Prefer **0** padded tasks over theater.

**Fresh payoffs checked @ `4c243214` — none met the gate:**

| Surface | Measurement | Verdict |
| --- | --- | --- |
| settings (`settings-flags`) | every export ≥8 unit files; reducedMotion matrix already dense | no queue |
| storage (`storage` / sanitize / migrate / safe-web-storage) | every public `storage.*` method ≥6 unit call-sites; sanitize/migrate ≥2; safe-web APIs ≥4 | no queue |
| routing (`router` / `route-generation` / `game-route-mounts`) | `addRoute`/`handleRoute`/`navigate`/`mountGameById` multi-file; route-generation ≥6 | no queue |
| PWA / offline (`pwa/*`, `ui/offline`) | `registerPwa`/`bootstrapPwa`/`scheduleIdleGameWarm`/`isBrowserOffline`/`bindOfflineDocumentFlag` ≥10; zero-hit export scan **empty** | no queue |
| UI plumbing (inject-styles, prefetch, pointer-hygiene, timeout-handle, reduced-motion, board-a11y, seat-labels, url-flags, dom-security) | every export ≥1 dedicated unit file; no measured wrong-results probe | no queue |
| playtest honesty `1474`…`1493` | stars-bars Red→`ai-win` / thinking text, ramrod dead class, fab chrome + soft-`ok`, console-sweep settle + multi-class status, nav-away status token, star-track You Wins / confusing_turn — **folded on tip**; targeted unit **7 files / 54 passed** | leave `contained` |
| deep-playtest-end further false+ | synthetic `wins streak` / `draw pile` still match END_RE, but **live product status harvest non-banner false+ = 0** | do not pad synthetic theater |
| knip unusedExports | still exactly the LEAVE trio | no SAFE demote |

**Preference:** Honest **0**. Do **not** pad settings/storage/routing/PWA/UI thin-coverage theater, tip-stamp **count** remasure, knip unusedTypes baseline drop, exhausted script families from bk/bj/bi purpose sections, AI/scoring/rules/legal-moves/copy/tutorials/timing/Hex Hard 450ms/Stars&Bars history cap/board-3d src/fake-clock/`*/rules.ts`/CI permissions.

**Out of this brief (not queued):** Living tip pointer in `AGENTS.md` + `docs/wiki/development.md` still names `cursor/mp-tip-post3af3000` after the #1548 cut to `cursor/mp-tip-post4c24321` @ `4c243214` — docs drift, not tests-only; same family as folded `1496` (name moved again on tip cut). Leave for a docs-scoped refill if desired.

## Duplicate check (do not re-queue)

| Topic family | Why skipped |
| --- | --- |
| round-63 bk `1494`–`1497` (+ folded `#1548` / open drafts stale) | leave `contained` |
| round-62 bj `1492`–`1493` | leave `contained` |
| playtest honesty `1474`…`1493` (stars-bars / ramrod / fab / console-sweep / nav-away / star-track) | folded + unit green @ tip |
| settings/storage/routing/PWA/UI coverage theater | dense; **0** zero-hit exports; no measured wrong-results |
| deep-playtest-end synthetic false+ | live product false+ **0** |
| knip LEAVE trio | no new SAFE demote |
| AI-timing / Hex Hard 450ms / history-cap / rules.ts / copy / scoring / CI permissions | hard-rule HOLD |

## Stale queue re-check (live tip `4c243214`)

| Id | Verdict | Evidence |
| --- | --- | --- |
| `q-mp-1492`…`1497` | **folded on tip** via #1548 | leave open drafts `contained` / `superseded` |
| `q-mp-1474`…`1491` | **folded** | leave `contained` |
| knip unusedExports | **3 LEAVE** | no demote |
| Open drafts into `post4c24321` | stale implementers from prior tip names | leave alone |

## Shared-file conflict flags

None — **0** new tasks.

## Live tip measurements (evidence snapshot @ `4c243214`)

```text
$ git rev-parse HEAD
  4c243214c7f90f67c661cc4b779a73060d169b29

$ find tests/unit \( -name '*.test.ts' -o -name '*.spec.ts' \) ! -path '*/_tokenmaxx_archive/*' | wc -l
  3481

$ npm run report:knip -- --json
  unusedExports: 3  unusedTypes: 29  unusedFiles: 0

$ # scoped export → unit-file hit counts (sample):
$ # getUserReducedMotionFlag 8, addRoute 10, navigate 192, getWebStorage 6,
$ # safeParseJson 5, nextRouteGeneration 10, isBrowserOffline 12,
$ # bindOfflineDocumentFlag 12, mountGameById 16, registerPwa 10,
$ # bootstrapPwa 13, scheduleIdleGameWarm 14, sanitizeSettings 2,
$ # migrateProgressData 2 — zero-hit scoped exports: 0

$ # storage.* test call-sites: every public method ≥6 (recordGameResult 110, …)

$ npm run test:unit -- \
    tests/unit/q-mp-1484-1485-fab-deep-harness.test.ts \
    tests/unit/q-mp-1475-star-track-confusing-turn-copy.test.ts \
    tests/unit/q-mp-1486-1490-stars-bars-deep-harness.test.ts \
    tests/unit/q-mp-1491-console-sweep-settle.test.ts \
    tests/unit/q-mp-1492-console-sweep-status-token.test.ts \
    tests/unit/q-mp-1493-nav-away-status-token.test.ts \
    tests/unit/stars-bars-new-game-race.test.ts
  Test Files  7 passed (7)
  Tests       54 passed (54)

$ # deep-playtest-end: live product status harvest vs isDeepPlaytestEndStatus
$ #   non-banner false+ count: 0
```

Baselines also under `/opt/cursor/artifacts/r64-tests-only-audit.txt`.

## New tasks

_None._

## Summary

- Honest underfill: **0** tasks — settings/storage/routing/PWA/UI remain dense with **0** untested public exports and no measured wrong-results; playtest honesty residuals through `1493` are folded and unit-green on tip.
- Next free engineering id if a later round finds measured work: `q-mp-1498`.
- Next action: fold into tip by the tip owner (report-only; no implementer PRs).
