# Alpha landing preflight — 2026-10-08

Task: `burn-1008-mp-tip-to-alpha-preflight`  
Report-only. No push to `alpha`/`main`. Scratch merge branch was local-only and deleted after gates.

| Field | Value |
|-------|-------|
| **Tip tested (exact SHA)** | `e169269651cc5133a37bbc909b29aafdab5b48ba` (`e1692696`) — `merge(#520): TS lint ratchet + curly ceiling (post-#518 autofix)` |
| Tip branch | `cursor/integration-fold-wave5-tip-4af0` (PR #477) |
| `alpha` at test | `eec2b327c1e65586537cbe03b1c29b93065dee03` (`eec2b327`) |
| Tip at report open (later) | `7b99c2bbd63b4634a5fef9703c9aa76b6d61c343` — **+1 commit** after tested SHA (`test(e2e): fold #505 fullgame suite over tip #507 layout`) |
| Earlier rehearsal | #484 covered older #476 stack — superseded by this tip-vs-`alpha` preflight |
| Related but distinct | #542 wave5 *fold* rehearsal (drafts → tip) — not tip → `alpha` |

---

## Verdict

**CONDITIONAL GO** for tip SHA `e1692696` → `alpha`.

Clean merge into `alpha` is possible. Required CI-shaped gates pass on the merged tree (unit suite had one load-flake on first full run; isolated + full confirmation reruns passed). Andrew must eyeball **AI / rules / player-facing tutorial copy / timing** files listed below before the Fri Oct 9 PM–Oct 14 window. Re-spot-check the **+1 tip commit** (`7b99c2bb`) before merge — gates below were **not** re-run on that SHA.

---

## 1. Merge-base and divergence

```text
TIP    = e169269651cc5133a37bbc909b29aafdab5b48ba
ALPHA  = eec2b327c1e65586537cbe03b1c29b93065dee03
MERGE_BASE = eec2b327c1e65586537cbe03b1c29b93065dee03   # == alpha
```

| Metric | Count |
|--------|------:|
| Commits on tip not in `alpha` | **358** |
| Commits on `alpha` not in tip | **0** |
| `git rev-list --left-right --count origin/alpha...TIP` | `0	358` |
| Files changed (`git diff --name-only origin/alpha...TIP`) | **1053** |
| Diffstat | `1053 files changed, 151716 insertions(+), 9468 deletions(-)` |

Tip is a **fast-forward stack** on top of current `alpha` (merge-base is `alpha` itself).

---

## 2. Scratch merge into `alpha` (local only — never pushed)

```text
branch: scratch/alpha-landing-preflight-d7c6   # created from origin/alpha, deleted after
command: git merge --no-ff --no-edit e169269651cc5133a37bbc909b29aafdab5b48ba
MERGE_EXIT=0
MERGE_CLEAN=yes
RESULT_SHA=ff491fa75199ca1ed0f19e4dcadf11e7bcf8af2b
TREE_IDENTICAL_TO_TIP=yes
```

No conflicts. Merged tree byte-identical to tip tree (`git diff --quiet TIP HEAD`).

---

## 3. Full gate results (on merged tip tree = tip SHA `e1692696`)

Commands and exit codes **verbatim**:

| Step | Command | Exit |
|------|---------|-----:|
| Install | `npm ci` | **0** |
| Lint | `npm run lint` | **0** |
| Types | `npx tsc --noEmit` | **0** |
| Unit (first full) | `npm run test:unit` | **1** |
| Unit flake file rerun #2 | `npx vitest run tests/unit/ui-helper-dedupe-characterization.test.ts` | **0** |
| Unit flake file rerun #3 | `npx vitest run tests/unit/ui-helper-dedupe-characterization.test.ts` | **0** |
| Unit full confirmation | `npm run test:unit` | **0** |
| Build | `npm run build` | **0** |
| Playwright install | `npx playwright install --with-deps chromium` | **0** |
| E2E (CI path) | `CI=true npm run test:e2e:chromium` | **0** |
| Bundle budgets (report-only) | `npm run size:check` | **0** |

### Unit — first full run (failed)

```text
Test Files  1 failed | 3083 passed (3084)
     Tests  2 failed | 11421 passed | 6 skipped (11429)
Duration  399.50s
test_unit_exit=1
```

Failures (both **timeouts**, same file):

- `tests/unit/ui-helper-dedupe-characterization.test.ts` → `generation gate drops stale callbacks` (30000ms)
- `tests/unit/ui-helper-dedupe-characterization.test.ts` → `scheduleGenerationGated matches separate timer/generation bindings` (30000ms)

These tests use real `setTimeout(..., 10/30)` waits. Under the full parallel suite they starved once; **isolated reruns passed in ~1.5s** (48/48).

### Unit — flake reruns (noted separately)

```text
flake_rerun2_exit=0   # 48 passed, 1.65s
flake_rerun3_exit=0   # 48 passed, 1.50s
```

### Unit — full confirmation rerun

```text
Test Files  3084 passed (3084)
     Tests  11424 passed | 5 skipped (11429)
Duration  388.36s
test_unit_rerun_exit=0
```

### Build

```text
tip_build_exit=0
# vite + PWA generateSW (see §4)
```

### Playwright e2e (as CI runs it)

CI job uses `npm run test:e2e:chromium` → `playwright test --project=chromium --grep-invert @fullgame`, with `retries: 2` when `CI` is set (`playwright.config.ts`).

```text
e2e suite: 34 files (smoke + bug-guards + mp3d; @fullgame excluded)
Running 204 tests using 2 workers
  204 passed (3.7m)
e2e_chromium_exit=0
```

No flaky retries observed in this run (all green first pass). Report-only note: axe logged **1 moderate** `landmark-unique` on `menu-home` (does not fail the suite); all game screens reported `0` axe violations.

Fullgame / cross-browser / mobile jobs remain **report-only** in tip CI (`continue-on-error` / non-blocking) and were **not** required for this preflight.

---

## 4. Bundle size and PWA precache vs `alpha`

Built tip tree and `origin/alpha` in parallel (`alpha` via local worktree `/tmp/alpha-preflight-build`).

### Dist totals (all files under `dist/`, gzip -9 for comparison)

| | Raw | Gzip-9 | File count |
|--|----:|-------:|----------:|
| `alpha` (`eec2b327`) | 1 786.10 KiB | 573.96 KiB | 71 |
| tip (`e1692696`) | 1 857.35 KiB | 597.13 KiB | 74 |
| **Δ tip − alpha** | **+71.25 KiB** | **+23.17 KiB** | **+3** |

### PWA Workbox precache (from `vite-plugin-pwa` build output)

| | Precache entries | Precache size |
|--|-----------------:|--------------:|
| `alpha` | 80 | 1765.23 KiB |
| tip | 76 | 1758.41 KiB |
| **Δ** | **−4** | **−6.82 KiB** |

Tip splits CSS (`index` + `game-play`) and adds `game-routes` / `game-shell` / `core-storage` chunks; three.js vendor ~same (~746.77 kB / 191.66 kB gzip). Precache entry count dropped despite slightly larger on-disk `dist/` because of chunking / SW inventory differences.

### `npm run size:check` (report-only; exit 0)

9 games over committed headroom (not failing CI):

- `game-contig-60`, `game-fraction-pinball`, `game-hex`, `game-juggle`, `game-kings-quadraphages`, `game-par-55`, `game-pent-em-in`, `game-ramrod`, `game-sum-dominoes`

Not a merge blocker (script is report-only).

---

## 5. Categorized change summary (tip `e1692696` vs `alpha`)

Approximate buckets from path heuristics over **1053** files (some overlap unavoidable; “other” includes engines/core/scripts):

| Category | ~Files | What’s in the tip stack |
|----------|-------:|-------------------------|
| **Tests** | ~365 | Massive unit/e2e expansion; fullgame suite (report-only CI); axe/a11y/reduced-motion; AI calibration/determinism benches; mutation harness; engine contracts/microbench; visual baselines |
| **Docs** | ~442 | Playtests, wiki, engine refs, merge/rehearsal notes, a11y/AI/perf audits, screenshots |
| **UI fixes** | ~52 | Board UIs, game-shell/prefetch/routes, CSS split, die faces, owl UI, timeout-handle helper, reduced-motion |
| **Build** | ~10 | `package.json`/`lock`, Vite PWA/security-headers/shell-chunks, eslint, tsconfig ratchet, bundle-budgets |
| **CI** | 3 | `.github/workflows/ci.yml` (+265/−20), `deploy.yml`, `copilot-instructions.md` — `permissions: contents: read`, `persist-credentials: false` retained |
| **A11y (narrow path match)** | 1+ | `src/ui/board-a11y.ts` plus many a11y e2e/docs under tests/docs |
| **Other / product code** | ~180 | Core modules, game engines, AI, rules, tutorials, scripts |

### Explicit eyeball list — `ai/` (player AI behavior / search / difficulty / timing)

| File | Δ (ins/del) | Notes for Andrew |
|------|------------:|------------------|
| `src/games/hex/ai.ts` | +6/−2 | **Hard deadline 2500 → 450** (assert stays ≤450ms) |
| `src/games/queens-guards/ai.ts` | +5/−5 | **Hard deadline 2500 → 450** |
| `src/games/fab-a-diffy/ai.ts` | +3/−12 | Deadline **unchanged** (hard 2500); stale-plan → pass, less console spam |
| `src/games/kwatro-sinko/ai.ts` | +133/−32 | Largest AI edit — heuristic weights / difficulty knobs |
| `src/games/contig-60/ai.ts` | +41/−3 | Scoring/threat weighting |
| `src/games/kings-quadraphages/ai.ts` | +16/−9 | Forced-win pool not diluted by randomness |
| `src/games/juggle/ai.ts` | +8/−9 | |
| `src/games/pent-em-in/ai.ts` | +5/−9 | |
| `src/games/calla/ai.ts` | +5/−4 | |
| `src/games/hex-a-gone/ai.ts` | +2/−6 | |
| `src/games/star-track/ai.ts` | +2/−6 | |
| `src/games/stars-bars/ai.ts` | +2/−7 | |
| `src/games/sum-dominoes/ai.ts` | +2/−7 | |
| `src/games/fiar/ai.ts` | +1/−3 | |
| `src/games/frac-fact/ai.ts` | +2/−2 | |
| `src/games/fraction-pinball/ai.ts` | +1/−1 | |
| `src/games/par-55/ai.ts` | +2/−1 | |
| `src/games/prime-gold/ai.ts` | +2/−1 | |
| `src/games/ramrod/ai.ts` | +2/−1 | |
| `src/games/remainder-islands/ai.ts` | +1/−1 | |

Related timing tests/helpers: `tests/unit/ai-hard-midgame-identity.test.ts`, `tests/unit/queens-hex-ai-play-deadline.test.ts`, `tests/unit/fab-a-diffy-ai-play-deadline.test.ts`, `tests/unit/ai-move-time-midgame.bench.test.ts`, `src/ui/timeout-handle.ts` (new helper).

**Hex Hard assert:** tip retains `hard: 450` and unit guard `expect(HEX_MS.hard).toBeLessThanOrEqual(450)`.

**Stars & Bars history cap:** tip comment explicitly holds player-visible trim for Andrew — *not* applied:

```text
// Full history display (do not cap — #501 fold held player-visible trim for Andrew).
```

### Explicit eyeball list — `rules.ts`

All 20 games’ `src/games/*/rules.ts` differ from `alpha`. Larger deltas:

| File | Δ | Notes |
|------|--:|-------|
| `src/games/pent-em-in/rules.ts` | +90/−14 | Placement escape / selection cancel |
| `src/games/juggle/rules.ts` | +76/−9 | Valid placements helpers |
| `src/games/calla/rules.ts` | +46/−11 | `getPhaseMessage` seat/display wording |
| `src/games/sum-dominoes/rules.ts` | +13/−2 | Tap-selected-tile clear |
| `src/games/fab-a-diffy/rules.ts` | +8/−3 | |
| `src/games/par-55/rules.ts` | +7/−2 | |
| Others | smaller | Mostly imports / small helpers |

### Explicit eyeball list — player-facing tutorial / owl copy

| File | Δ | Notes |
|------|--:|-------|
| `src/core/tutorial.ts` | +98/−28 | Focus restore, trusted markup for tooltip HTML |
| `src/core/owl/owl-messages.ts` | +3/−3 | Type-only / minor |
| `src/games/*/tutorial.ts` (all 20) | small each | **Kid-friendly rewrites** across every game (grades 3–5 polish style). Examples: Contig “operations”→“math signs”; Hex “click”→“tap”; Kings trap wording; Stars & Bars “attributes”→“features”; etc. |

Also related docs: `docs/tutorial-engine-mismatches-2026-10-07.md`, `docs/RULES-DECISIONS-2026-10-07.md`.

---

## 6. Go / no-go checklist

| # | Check | Status | Blocker? |
|---|-------|--------|----------|
| 1 | Tip SHA recorded | `e1692696` | — |
| 2 | Merge-base / divergence documented | 358 ahead / 0 behind; MB=`alpha` | — |
| 3 | Clean merge tip → `alpha` on scratch | **YES** (`MERGE_EXIT=0`) | No |
| 4 | `npm ci` | exit **0** | No |
| 5 | `npm run lint` | exit **0** | No |
| 6 | `npx tsc --noEmit` | exit **0** | No |
| 7 | `npm run test:unit` | first **1** (2 timeouts); confirmation **0** | Soft — see flake |
| 8 | `npm run build` | exit **0** | No |
| 9 | CI Chromium e2e (`test:e2e:chromium`, `CI=true`) | **204 passed**, exit **0** | No |
| 10 | Bundle / PWA deltas recorded | +71 KiB raw dist; precache −4 entries / −6.8 KiB | Soft — budgets report-only OVER |
| 11 | Hex Hard still **450ms** | Confirmed | No |
| 12 | Stars & Bars history cap | **Not** landed (held) | No |
| 13 | CI `contents: read` + `persist-credentials: false` | Present | No |
| 14 | Andrew eyeball AI / rules / tutorial copy | **Required** | **Process yes** |
| 15 | Tip moved after test (+1 → `7b99c2bb`) | Gates not re-run on new tip | Soft — re-spot before land |

### Concrete blockers

**Hard (merge/gates):** none at tested SHA `e1692696`.

**Process / soft (resolve before or during window):**

1. **Owner eyeball** of every `src/games/*/ai.ts`, non-trivial `rules.ts`, and all `tutorial.ts` / player copy listed in §5 — tip includes intentional AI timing (Hex/Queens Hard 450), AI heuristic edits (esp. Kwatro), and widespread kid-friendly tutorial rewrites.
2. **Unit suite flake risk** under full parallel load (`ui-helper-dedupe-characterization` generation-timeout tests — **2 timeouts** on first run only). Tracked in [`docs/flake-rate-wave5-2026-10-08.md`](../flake-rate-wave5-2026-10-08.md) §3 (#505/#547 track). Mitigated on tip with fake timers + `unit-isolated` (`edcff8bf`); **do not raise timeouts globally**. Confirmation run passed; still watch Actions.
3. **Tip drift:** `7b99c2bb` landed after this preflight (fullgame e2e fold). Re-run at least `npm run test:unit` + `CI=true npm run test:e2e:chromium` on the tip tip actually merged, or re-run this preflight if more folds land before Oct 9.
4. **Non-blocking:** menu-home axe `landmark-unique` (moderate); 9 report-only gzip budget OVERs.

---

## 7. What this agent did / did not do

**Did:** local scratch merge; full gate matrix; bundle/PWA compare vs `alpha`; this report; draft PR with **only** this file against the tip.

**Did not:** push scratch branch; push/edit `alpha` or `main`; edit, comment on, or close any other PR; change AI/rules/scoring/copy; touch openclaw / Merom / infrastructure repos.

---

## 8. Next action

**Next action: fold into tip by the tip owner** (docs-only). Human merge of tip → `alpha` stays on Andrew’s window schedule after eyeball + optional tip-SHA re-verify.
