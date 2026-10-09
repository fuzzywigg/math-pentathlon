# Friday landing preflight v2 — tip #477 → `alpha` (2026-10-08)

**Task id:** `burn-1008-mp-friday-landing-preflight-v2`  
**Audience:** Andrew + tip owner (merge window Fri Oct 9 afternoon).  
**Report only.** No push to `alpha`/`main`. Scratch merge was local-only and deleted. No source/product changes in this deliverable.

| Field | Value |
|-------|-------|
| **Tip tested (exact SHA)** | `7466528b7ffe8bda170df0011f2049b084c82c8b` (`7466528b`) — `style: prettier-format settings-flags and hex-a-gone board-ui` |
| Tip branch / vehicle | `cursor/integration-fold-wave5-tip-4af0` (PR [#477](https://github.com/fuzzywigg/math-pentathlon/pull/477)) |
| Landing branch | `alpha` @ `eec2b327c1e65586537cbe03b1c29b93065dee03` (`eec2b327`) |
| Prior preflight (superseded for SHA) | [#547](https://github.com/fuzzywigg/math-pentathlon/pull/547) @ tip `e1692696` → `docs/dev/alpha-landing-preflight-2026-10-08.md` |
| Decision sheet (still authoritative for D0x) | [#549](https://github.com/fuzzywigg/math-pentathlon/pull/549) → `docs/dev/merge-window-decision-sheet-2026-10-09.md` (both already on tip) |
| Tip drift since #547 | **+86 commits** on tip (`e1692696` → `7466528b`); this v2 re-runs gates on the live tip |

### Owner decisions respected (locked for this land)

| Decision | Action for Fri land |
| --- | --- |
| [#557](https://github.com/fuzzywigg/math-pentathlon/pull/557) two held rules hunks — `pent-em-in` `BoardCell` rebuild + `stars-bars` shuffle swap | **Stay as tip is today; do NOT fold those hunks** (leave #557 out of Fri land, or fold later minus those two) |
| [#559](https://github.com/fuzzywigg/math-pentathlon/pull/559) alpha AI/copy delta isolation | **Deferred until after Oct 14**; needs rework — leave out |
| [#560](https://github.com/fuzzywigg/math-pentathlon/pull/560) AI type-only emit-identical ratchet | **Lands only after #477** — leave out of Fri tip→`alpha` |
| [#541](https://github.com/fuzzywigg/math-pentathlon/pull/541) safe dead-code removal | **Folds last** — already on tip at `cc4120d2` (`merge(#541)`) |

---

## Verdict

**CONDITIONAL GO** for tip SHA `7466528b` → `alpha` on Fri Oct 9 afternoon, **minus held items above**.

- Tip is a **fast-forward stack** on current `alpha` (0 behind / **444** ahead; merge-base == `alpha`).
- Scratch merge tip → `alpha` is **clean**; merged tree **byte-identical** to tip.
- Local gates: `lint` / `tsc` / `test:unit` / `build` all **exit 0** on tip SHA.
- GitHub Actions on [#477](https://github.com/fuzzywigg/math-pentathlon/pull/477) (tip tip): **lint / unit / build / e2e / e2e-fullgame** green at check time.
- Local Chromium e2e (`CI=true npm run test:e2e:chromium`): **281 passed / 1 failed** (`hex-deep-playability` status race — flaky under agent SwiftShader; isolated 2 fail / 1 pass). Treat as soft hold; prefer Actions green + merger re-run.
- Hard-rule scan: Hex Hard **450** held; Stars & Bars history **uncapped**; CI least-privilege intact. Tip still carries intentional AI deadline/heuristic + kid-friendly tutorial / You–Computer copy deltas vs `alpha` (see §3 / #552 audit) — process eyeball remains.

---

## 1. Merge path: #477 down the base chain to `alpha`

Land path for Friday is **Path A**: merge tip #477 **alone** into `alpha` (do **not** merge each intermediate PR). Intermediates are listed so the merger can see the historical stack and confirm each tip head is already contained.

```text
#477 tip (wave5)  HEAD = cursor/integration-fold-wave5-tip-4af0 @ 7466528b
  base → #476 wave4 tip          cursor/integration-fold-wave4-tip-36e4
    base → #466 fold-coverage    cursor/overnight-fold-coverage-tip-460a
      base → #454 flake-engine   cursor/overnight-flake-engine-stack-737e
        base → #449 a11y-tutorial cursor/a11y-tutorial-stack-446-448-05a3
          base → #447 test-infra  cursor/test-infra-stack-439-443-445-6174
            base → #444 playability cursor/playability-stack-415-417-b354
              base → #440 stack-2 cursor/deep-playtest-stack-2-460b
                base → #438 deep integ cursor/deep-playtest-integration-48a7
                  base → #413 overnight polish cursor/overnight-polish-integration-0494
                    base → alpha   ( #413 MERGED into alpha; tip also synced #413+#414 )
```

| PR | Head branch | Base | Contained in tip `7466528b`? | Head SHA (12) | Notes |
| ---: | --- | --- | --- | --- | --- |
| [#477](https://github.com/fuzzywigg/math-pentathlon/pull/477) | `cursor/integration-fold-wave5-tip-4af0` | `cursor/integration-fold-wave4-tip-36e4` | **YES** (is tip) | `7466528b7ffe` | Land vehicle → `alpha` |
| [#476](https://github.com/fuzzywigg/math-pentathlon/pull/476) | `cursor/integration-fold-wave4-tip-36e4` | `cursor/overnight-fold-coverage-tip-460a` | **YES** | `367d291e8190` | wave4 tip |
| [#466](https://github.com/fuzzywigg/math-pentathlon/pull/466) | `cursor/overnight-fold-coverage-tip-460a` | `cursor/overnight-flake-engine-stack-737e` | **YES** | `bc4410a7654e` | fold-coverage |
| [#454](https://github.com/fuzzywigg/math-pentathlon/pull/454) | `cursor/overnight-flake-engine-stack-737e` | `cursor/a11y-tutorial-stack-446-448-05a3` | **YES** | `4604c09bf939` | flake-engine stack |
| [#449](https://github.com/fuzzywigg/math-pentathlon/pull/449) | `cursor/a11y-tutorial-stack-446-448-05a3` | `cursor/test-infra-stack-439-443-445-6174` | **YES** | `fdb423aa07c0` | a11y-tutorial |
| [#447](https://github.com/fuzzywigg/math-pentathlon/pull/447) | `cursor/test-infra-stack-439-443-445-6174` | `cursor/playability-stack-415-417-b354` | **YES** | `f34e7fe2bca5` | test-infra |
| [#444](https://github.com/fuzzywigg/math-pentathlon/pull/444) | `cursor/playability-stack-415-417-b354` | `cursor/deep-playtest-stack-2-460b` | **YES** | `dc241b1d6a4b` | playability |
| [#440](https://github.com/fuzzywigg/math-pentathlon/pull/440) | `cursor/deep-playtest-stack-2-460b` | `cursor/deep-playtest-integration-48a7` | **YES** | `ce8725438a7d` | deep stack-2 |
| [#438](https://github.com/fuzzywigg/math-pentathlon/pull/438) | `cursor/deep-playtest-integration-48a7` | `cursor/overnight-polish-integration-0494` | **YES** | `42372d230d03` | deep integration |
| [#413](https://github.com/fuzzywigg/math-pentathlon/pull/413) | `cursor/overnight-polish-integration-0494` | `alpha` | **YES** | `89b843577661` | **MERGED** into `alpha`; tip synced via `a3303c86` |

Containment check: `git merge-base --is-ancestor <headSHA> 7466528b` → true for every row.

### Divergence tip vs `alpha` (live)

```text
TIP    = 7466528b7ffe8bda170df0011f2049b084c82c8b
ALPHA  = eec2b327c1e65586537cbe03b1c29b93065dee03
MERGE_BASE = eec2b327c1e65586537cbe03b1c29b93065dee03   # == alpha
git rev-list --left-right --count origin/alpha...TIP  →  0	444
Files: 1403 changed, +186294 / −12002
```

---

## 2. Trial merge tip → `alpha` (scratch only — never pushed)

```text
branch: scratch/friday-landing-preflight-v2-e939   # from origin/alpha; deleted after
command: git merge --no-ff --no-edit 7466528b7ffe8bda170df0011f2049b084c82c8b
MERGE_EXIT=0
MERGE_CLEAN=yes
TREE_IDENTICAL_TO_TIP=yes   # git rev-parse TIP^{tree} == MERGE^{tree} == 694d46b46b949d7ed91b939b8dfc3e6517517c72
Conflicts: none
```

Gates below were run on tip tree (= merged tree).

### Gate matrix (verbatim)

| Step | Command | Exit | Result |
|------|---------|-----:|--------|
| Install | `npm ci` | **0** | Restored `rollup-plugin-visualizer` (first `npm run build` failed with `ERR_MODULE_NOT_FOUND` on incomplete `node_modules`; after `npm ci`, build OK) |
| Lint | `npm run lint` | **0** | (also re-run after `npm ci` → 0) |
| Types | `npx tsc --noEmit` | **0** | (also re-run after `npm ci` → 0) |
| Unit | `npm run test:unit` | **0** | **3104** files passed; **11722** tests passed / **13** skipped (11735); Duration **387.57s** — **no** load-flake this run |
| Build | `npm run build` | **0** | after `npm ci`; PWA precache **67** entries / **1773.92 KiB** |
| Size (report-only) | `npm run size:check` | **0** | **9** games OVER gzip headroom (same class as #547) |
| E2E (CI path) | `CI=true npm run test:e2e:chromium` | **1** | **281 passed / 1 failed / 1 did not run** (serial skip after fail); see §2.1 |
| Tip PR Actions | `gh pr checks 477` | — | **lint / unit / build / e2e / e2e-fullgame** = **pass** (e2e-cross-browser pending/report-only at snapshot) |

#### Unit summary

```text
Test Files  3104 passed (3104)
     Tests  11722 passed | 13 skipped (11735)
Duration  387.57s
unit_exit=0
```

Contrast #547 @ `e1692696`: first unit run flaked (2 timeouts in `ui-helper-dedupe-characterization`); tip later gained fake-timer isolation (`edcff8bf`) + prefetch isolation (#548). **This v2 full run was clean.**

#### Build / dist (tip)

```text
tip dist/: 74 files, ~1872.94 KiB raw, ~601.44 KiB gzip-9
PWA generateSW: precache 67 entries (1773.92 KiB)
build_exit=0
```

Report-only `size:check` OVERs: `game-contig-60`, `game-fraction-pinball`, `game-hex`, `game-juggle`, `game-kings-quadraphages`, `game-par-55`, `game-pent-em-in`, `game-ramrod`, `game-sum-dominoes`.

### 2.1 E2E smoke + SwiftShader caveats

**Environment:** agent VM has **no `/dev/dri`**. Playwright Chromium projects opt into SwiftShader ANGLE:

```text
--use-angle=swiftshader-webgl
--enable-unsafe-swiftshader
```

(see `playwright.config.ts`; tip fold [#490](https://github.com/fuzzywigg/math-pentathlon/pull/490) mp3d canvas-ready). Suite: `playwright test --project=chromium --grep-invert @fullgame` (**40** non-fullgame e2e files).

| Run | Result |
| --- | --- |
| Full CI-shaped suite | **281 passed**, **1 failed** (`hex-deep-playability` … 44px tap targets), **1 did not run** (serial sibling); `e2e_exit=1`; ~4.1m |
| Isolated `hex-deep-playability` ×3 (`--retries=0`) | fail, fail, **pass** |
| GitHub Actions `e2e` on #477 | **pass** (5m29s) |

**Failure mode (local):** status text expected `/Your turn — Tap an empty hex/`, received `"Computer is thinking…"`. Tip Hex paint delay is `AI_THINKING_DELAY = 250` (alpha was 500). Looks like a **start-status race / flake**, not a rules/scoring regression. Merger should trust Actions + re-run:

```bash
CI=true npx playwright test tests/e2e/hex-deep-playability.spec.ts --project=chromium
```

**SwiftShader caveats for merger:** mp3d / WebGL specs are slower and flakier under software GL; tip already has ready waits + SwiftShader launch args. Do not treat a single local mp3d timeout as a land blocker if Actions e2e is green. Fullgame / firefox-webkit / mobile remain report-only in tip CI.

Artifacts: `/opt/cursor/artifacts/friday-preflight-v2-{gates,unit,build2,e2e,e2e-hex-rerun,size,meta,merge}.log|txt`.

---

## 3. Hard-rule diff scan — tip `7466528b` vs `alpha` `eec2b327`

### 3.1 AI paths (`src/games/*/ai.ts` + `hex/ai-client.ts`)

21 files differ (`+296 / −131`). Notable:

| Signal | Evidence |
| --- | --- |
| Hex Hard deadline | alpha `hard: 2500` → tip **`hard: 450`** (`src/games/hex/ai.ts:21`) |
| Queens Hard deadline | alpha `hard: 2500` → tip **`hard: 450`** |
| Hex unit assert | `tests/unit/hex-deep-playability.test.ts:58` `expect(...hard).toBe(450)` — **PASS** in unit suite |
| Kwatro | largest AI edit (`+165/−…`) — heuristics / `AI_THINK_BUDGET_MS = 50` on tip |
| Contig / Kings | scoring / win-pool related edits (see #552 audit groups) |
| Fab-a-diffy Hard | deadline **unchanged** at 2500 |

Controller think/paint delays also moved (player-feel pacing), e.g.:

| File | Alpha | Tip |
| --- | --- | --- |
| `hex/game-controller.ts` | `AI_THINKING_DELAY = 500` | **250** |
| `calla/game-controller.ts` | 800 | **600** |
| `hex-a-gone/game-controller.ts` | 800 | **350** |
| `stars-bars/game-controller.ts` | (none) | `AI_THINK_MS = 450` |
| `par-55/game-controller.ts` | (none) | `AI_THINK_DELAY_MS = 450` |
| … | … | see live `git diff origin/alpha...TIP -- 'src/games/*/game-controller.ts'` |

Canonical classification: tip `docs/dev/tip-vs-alpha-audit-2026-10-08.md` (#552) — **16** `AI_BEHAVIOR_CHANGE` + **32** `PLAYER_FACING_COPY`. Tonight’s type-ratchet / salvage folds did not add new AI/copy content to those 48.

### 3.2 Hex Hard **450ms** (must stay)

```text
src/games/hex/ai.ts:21:  hard: 450,
tests/unit/hex-deep-playability.test.ts:58: expect(ai.AI_PLAY_DEADLINE_MS.hard).toBe(450);
```

**GO for hard rule:** tip retains 450; unit suite green. Do not raise toward 2500 on land.

### 3.3 Stars & Bars history (must stay uncapped)

```text
src/games/stars-bars/board-ui.ts:749:
  // Full history display (do not cap — #501 fold held player-visible trim for Andrew).
src/games/stars-bars/board-ui.ts:750–751:
  for (let i = state.moveHistory.length - 1; i >= 0; i--) {
    const move = state.moveHistory[i]!;
```

No `slice(-N)` cap on tip. **GO for hard rule.**

### 3.4 Player-facing strings

| Bucket | Scope | Notes |
| --- | --- | --- |
| Tutorials | all 20 `src/games/*/tutorial.ts` + `src/core/tutorial.ts` | Kid-friendly rewrites (e.g. Contig “operations”→“math signs”; Hex “click”→“tap”; Stars & Bars “attributes”→“features”) — #446 fold; #552 recommends **KEEP** |
| You / Computer / status | board-ui / game-controller across games | Seat chrome; #552 recommends **HOLD** for owner eyeball |
| Owl | `src/core/owl/*` | Small deltas |

Sample (Hex tutorial): “click any empty hex” → “tap any empty hex”; “no draws” → “cannot end in a tie”.

### 3.5 `rules.ts`

All 20 games’ `rules.ts` differ (`+349 / −152`). Larger: `pent-em-in` (+104), `juggle` (+85), `calla` (+80), `sum-dominoes` (+51). Includes playability escapes already on tip (#417 etc.). **#557’s held BoardCell / shuffle hunks are not on tip** (PR still open).

### 3.6 CI / forbidden surfaces

| Check | Tip status |
| --- | --- |
| `permissions: contents: read` | Present (`.github/workflows/ci.yml:15–16`) |
| `persist-credentials: false` | Present on checkouts |
| apt installs in CI | **None** |
| pip allowlist widen | **None** (no pip in workflows) |
| openclaw / Merom / infra | **Not touched** |

---

## 4. Open drafts — already folded vs still pending

Open drafts at scan: **122** (all draft). Tip-based (`base = wave5 tip`): **29**.

### 4.1 Already folded into tip (safe to leave out of Fri land; close after land)

Evidence: tip merge-log `merge(#N)` / `port(#N)` / fold commits, or twin superseded.

| PR | Evidence (tip log / commit) |
| ---: | --- |
| #503 | superseded by `merge(#502)` |
| #505 | `7b99c2bb` fold over #507 layout; superseded note with #511 |
| #506 | superseded by `merge(#504)` |
| #510 | `merge(#509)+port(#510)` |
| #511 | `merge(#513)+port(#511)` |
| #520 | `merge(#520)` |
| #522 | `merge(#522)` |
| #524 | `merge(#524)` |
| #527 | `merge(#527)` |
| #528 | `merge(#528)` |
| #530 | `merge(#530)` |
| #541 | `cc4120d2 merge(#541)` — **fold last done**; PR state MERGED into tip |
| #553 | `f6c7018f` fold Batch-5 over #544 |
| #554 | `0e07c39c` licenses owner acceptances on tip |
| #555 | `b63afd24` `import type` storage ProgressData |
| Also on tip (not tip-base open, or closed): | #536, #532, #548, #552, #549, #547, #545, #543, #542, #538, #550, #551, #544, #546, #540, #539, #534, #533, #529, #531, … (full stack in tip log) |

### 4.2 Still pending — **safe to leave out** of Friday tip→`alpha`

Land tip as-is (decision sheet D03-A). Fold onto `alpha` later if desired.

| PR | Title / note |
| ---: | --- |
| #556 | flake-rate after-fix docs |
| #558 | compliance review 3 |
| #561 | compliance review 4 |
| #562 | engine coverage characterization |
| #563 | runtime error-path audit |
| #564 | compliance review 5 (#559/#560) |
| #565 | dependency advisory audit |
| #566 | UI coverage round 2 |
| #567 | Prime Gold WebGL context-lost fallback |
| #568 | shell try/finally + soft-fail owl/SW bootstrap |

### 4.3 Owner holds / violations — **must leave out** of Friday land

| PR | Disposition |
| ---: | --- |
| **#557** | Pending product fold OK later, but **two held hunks stay out**: `pent-em-in/rules.ts` BoardCell EOPT rebuild; `stars-bars/rules.ts` shuffle temp-swap. Do not fold those hunks onto tip/`alpha` Fri. |
| **#559** | **Defer after Oct 14**; needs rework |
| **#560** | **Only after #477** lands |
| **#535** | Hard-rule violation — use #540 (already on tip); close without fold |
| **#537** | Hard-rule violation — use #546 (already on tip); close without fold |

Older stack drafts based on overnight/wave4 (not tip-base) that are already contained should be closed after land (triage #545 category (a)/(b)/(e)) — out of scope for this agent to close.

---

## 5. GO / NO-GO checklist (merger commands)

Run on the **exact tip SHA** you merge (re-fetch tip first if it moved past `7466528b`).

### Pre-merge checks

| # | Check | Command / evidence | Status @ `7466528b` | Blocker? |
|---|-------|--------------------|---------------------|----------|
| 1 | Tip SHA recorded | `git rev-parse cursor/integration-fold-wave5-tip-4af0` | `7466528b…` | — |
| 2 | Fast-forward of `alpha` | `git rev-list --left-right --count origin/alpha...TIP` → `0 <n>` | `0 444` | No |
| 3 | Clean trial merge | `git checkout -B scratch/land origin/alpha && git merge --no-ff TIP` | **clean**, tree==tip | No |
| 4 | Install | `npm ci` | **0** | No |
| 5 | Lint | `npm run lint` | **0** | No |
| 6 | Types | `npx tsc --noEmit` | **0** | No |
| 7 | Unit | `npm run test:unit` | **0** (3104 / 11722) | No |
| 8 | Build | `npm run build` | **0** | No |
| 9 | Chromium e2e | `CI=true npm run test:e2e:chromium` | local **1** flake; **Actions pass** | Soft |
| 10 | Hex Hard 450 | `rg -n 'hard:\s*450' src/games/hex/ai.ts` + unit assert | Confirmed | No |
| 11 | S&B history uncapped | `rg -n 'do not cap' src/games/stars-bars/board-ui.ts` | Confirmed | No |
| 12 | CI least privilege | `rg -n 'contents: read|persist-credentials' .github/workflows/ci.yml` | Present | No |
| 13 | Held drafts out | #557 BoardCell/shuffle, #559, #560 not folded | Confirmed | Process |
| 14 | #541 fold-last | already on tip | Confirmed | No |
| 15 | Andrew eyeball AI / You–Computer copy | #552 groups + §3 | **Required** | Process |
| 16 | Tip PR green | `gh pr checks 477` | lint/unit/build/e2e pass | Soft if tip moves |

### Exact merger runbook (copy/paste)

```bash
# 0) Identity
git fetch origin alpha cursor/integration-fold-wave5-tip-4af0
TIP=$(git rev-parse origin/cursor/integration-fold-wave5-tip-4af0)
ALPHA=$(git rev-parse origin/alpha)
echo "TIP=$TIP ALPHA=$ALPHA"
git rev-list --left-right --count $ALPHA...$TIP   # expect: 0 <n>

# 1) Scratch merge (delete after)
git checkout -B scratch/friday-land-verify $ALPHA
git merge --no-ff --no-edit $TIP                  # expect: clean
git diff --quiet $TIP HEAD && echo TREE_OK=yes    # expect: yes

# 2) Gates on merged tree (== tip if TREE_OK)
npm ci
npm run lint
npx tsc --noEmit
npm run test:unit
npm run build
CI=true npm run test:e2e:chromium

# 3) Hard-rule spot checks
rg -n 'hard:\s*450' src/games/hex/ai.ts
rg -n 'toBe\(450\)' tests/unit/hex-deep-playability.test.ts
rg -n 'do not cap' src/games/stars-bars/board-ui.ts
rg -n 'permissions:|persist-credentials|contents:' .github/workflows/ci.yml

# 4) Confirm holds still out of tip tip
git log --oneline $ALPHA..$TIP | rg '#557|#559|#560' || echo 'no fold commits for held options'
# #541 should appear as already folded:
git log --oneline $ALPHA..$TIP | rg 'merge\(#541\)'

# 5) Land (HUMAN ONLY — never from tip agent)
#    Merge PR #477 into alpha via GitHub UI / gh as Andrew,
#    OR: checkout alpha && merge --ff-only $TIP && push origin alpha
#    Do NOT mark random drafts ready; do NOT fold #557 held hunks / #559 / #560.

git checkout alpha
git branch -D scratch/friday-land-verify
```

### Concrete blockers

**Hard (merge/gates):** none at tip `7466528b` for lint/tsc/unit/build; merge clean.

**Process / soft:**

1. **Owner eyeball** of #552 AI heuristic / think-delay / You–Computer groups before or during Fri PM (decision sheet D07).
2. **Local e2e flake** on `hex-deep-playability` start status under SwiftShader — Actions green; re-run before push if tip moved.
3. **Tip drift after this report** — if tip advances past `7466528b`, re-run §5 commands on the new SHA.
4. **Do not fold** #557 BoardCell/shuffle, #559, #560 into the land vehicle before Fri PM.
5. Non-blocking: 9 report-only gzip OVERs; e2e-cross-browser / fullgame remain report-only.

---

## 6. Delta vs #547 preflight

| | #547 @ `e1692696` | This v2 @ `7466528b` |
| --- | --- | --- |
| Commits ahead of `alpha` | 358 | **444** |
| Files changed | 1053 | **1403** |
| Unit | 3084 files / flake then confirm | **3104** / **clean first run** |
| E2E local | 204 passed | 281 passed + 1 flake |
| #541 | not yet fold-last | **folded** |
| #547/#549 docs | authored then | **on tip** |
| Held #557/#559/#560 | n/a in #547 | **explicit owner holds** |

---

## 7. What this agent did / did not do

**Did:** read live tip + #547/#549 docs; mapped #477→`alpha` base chain with containment; scratch merge; full gate matrix; hard-rule scan; open-draft fold triage; this report; draft PR with **only** this file against the tip.

**Did not:** push scratch; push/edit `alpha` or `main`; edit/comment/close any other PR; change AI/rules/scoring/copy; fold #557/#559/#560; touch openclaw / Merom / infrastructure.

---

## 8. Next action

**Next action: fold into tip by the tip owner**

Human merge of tip #477 → `alpha` stays on Andrew’s Fri Oct 9 afternoon window after checklist §5 + eyeball (never push `alpha` from this agent).
