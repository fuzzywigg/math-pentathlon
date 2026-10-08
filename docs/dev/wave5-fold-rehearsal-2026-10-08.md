# Wave5 fold rehearsal — 2026-10-08

**Task id:** `burn-1008-mp-wave5-fold-rehearsal`  
**Tip branch:** `cursor/integration-fold-wave5-tip-4af0`  
**Tip SHA started from:** `ac327bb576c1a48594e86e94ef34d3220732c406`  
(`ac327bb5` — *docs: refresh #496 tip test counts after wave5 folds*, 2026-10-08 04:42:30 UTC)  
**Scratch merges:** local only (`/tmp/fold-scratch`); **not pushed**.  
**Scope:** every open draft whose base was `cursor/integration-fold-wave5-tip-4af0` at rehearsal start.

## Twin / superseded decisions (do not land both)

| Open draft | Twin / superseder | Tip status at `ac327bb5` | Action |
|---|---|---|---|
| **#511** render-perf | **#513** (merged) + tip commit `11db84d0 merge(#513)+port(#511)` | Already on tip | **SKIP** |
| **#510** UI coverage | **#509** (merged) | Coverage work already on tip; #510 conflicts on `bootstrap.ts` / route-mount tests / `vitest.config.ts` | **SKIP** |
| **#506** engine devdocs | **#504** (merged) | `docs/dev/engines/*` already on tip | **SKIP** |
| **#505** fullgame e2e | **#507** (merged) | `tests/e2e/fullgame/*` already on tip | **SKIP** |
| **#503** type-ratchet plan | Superseded by tip `293ca1d5 docs: fold #502 … supersede #503` (Batch 0+1 already advanced baseline 564→518) | Plan/baseline already on tip; #503 is stale report-only snapshot | **SKIP** |

During this rehearsal, tip also advanced and **#518 was merged** into the tip branch after `ac327bb5`. Treat #518 as already folded for the live tip; the rows below still document the `ac327bb5` rehearsal result so the owner can see how it interacted with peers.

---

## Inventory (open drafts based on wave5 tip at start)

| PR | Head | Title (short) | Files vs tip | Tip textual merge |
|---:|---|---|---:|---|
| 503 | `cursor/type-ratchet-phase2-plan-0a98` | Phase-2 type-ratchet plan | 2 | **conflict** |
| 505 | `cursor/burn-1007-mp-e2e-fullgame-5931` | HvH fullgame e2e | 27 | **conflict** |
| 506 | `cursor/burn-1007-mp-engine-devdocs-d79f` | Engine contributor docs | 23 | **conflict** |
| 510 | `cursor/burn-1007-mp-ui-coverage-1d5f` | Non-engine UI coverage | 8 | **conflict** |
| 511 | `cursor/burn-1007-mp-render-perf-b5ec` | Render/input latency | 10 | **conflict** |
| 518 | `cursor/ui-helper-dedupe-burn-1008-a03e` | UI helper dedupe | 63 | **conflict** |
| 520 | `cursor/lint-ratchet-burn-1008-574c` | Lint-rule ratchet | 159 | **conflict** |
| 522 | `cursor/zoom-reflow-a11y-85ee` | Zoom/reflow a11y | 10 | **conflict** |
| 524 | `cursor/build-repro-audit-2221` | Reproducible Vite/PWA build | 6 | **conflict** |
| 526 | `cursor/test-fixtures-helpers-84a0` | Shared test fixtures | 327 | **clean** |
| 527 | `cursor/ci-workflow-hardening-58b6` | Workflow hardening | 6 | **clean** |
| 528 | `cursor/storage-failure-burn-1008-a7f2` | Safe Web Storage | 10 | **clean** |
| 529 | `cursor/canvas-dpr-resize-audit-172c` | Canvas DPR/resize | 17 | **clean** |
| 530 | `cursor/forced-colors-a11y-171e` | Forced-colors a11y | 14 | **clean** |
| 531 | `cursor/history-routing-audit-b1e1` | History routing | 11 | **clean** |
| 532 | `cursor/license-sbom-burn-1008-8f80` | License SBOM | 5 | **clean** |
| 533 | `cursor/pointer-edge-cases-d578` | Pointer edge cases | 19 | **clean** |
| 534 | `cursor/pwa-manifest-installability-810e` | PWA installability | 9 | **clean** |
| 535 | `cursor/math-precision-audit-c9b2` | Math precision audit | 9 | **clean** |
| 536 | `cursor/dead-code-inventory-5378` | Dead-code inventory (**fold last**) | 5 | **clean** |

---

## Individual merge onto tip (`ac327bb5`)

Legend: **clean** = `git merge` succeeded; **textual** = conflicted paths; **semantic** = after a clean (or resolved) merge, `npx tsc --noEmit` / `npm run test:unit` fail.

| PR | Textual | Conflict files (tip alone) | Semantic (tsc / notes) | Conflicts with (see matrix) |
|---:|---|---|---|---|
| 503 | textual | `docs/dev/type-ratchet-phase2-{baseline.json,plan.md}` | n/a (skip) | tip already has newer Batch 0+1 plan |
| 505 | textual | `ci.yml`, `package.json`, `playwright.config.ts`, all `tests/e2e/fullgame/*.spec.ts`, `fullgame-ci-report-only.test.ts` | n/a (skip) | twin of merged #507 |
| 506 | textual | all `docs/dev/engines/*`, `package.json`, `scripts/check-dev-doc-links.mjs` | n/a (skip) | twin of merged #504 |
| 510 | textual | `src/pwa/bootstrap.ts`, `burn-1007-game-route-mounts.test.ts`, `vitest.config.ts` | n/a (skip) | twin of merged #509; hard-overlap #531 routes |
| 511 | textual | `render-perf-2026-10.md`, `scripts/render-perf.mjs`, juggle/pent controllers+UI, `keyboard-a11y.spec.ts` | n/a (skip) | already ported via #513 |
| 518 | textual | hex/kwatro/par-55/pent/ramrod/stars-bars/sum-dominoes board/controllers | tsc clean after take-theirs resolve | hard: #520, #529, #530, #533 |
| 520 | textual | `src/games/contig-60/game-controller.ts` | tsc clean after take-theirs; **must preserve tip star-track seat-settle** (see resolutions) | hard: #518, #528–#530, #533, #535, ci.yml peers |
| 522 | textual | `docs/wiki/development.md` (alone); cumulatively also `package.json`, `playwright.config.ts`, `src/main.ts` | tsc clean after resolve | #530/#531 (`main.ts`), ci/playwright peers |
| 524 | textual | `package.json` (alone); + `vite.config.ts` after #534 | tsc clean; needs `npm install` for `rollup-plugin-visualizer` | #534 `vite.config.ts` |
| 526 | clean | — | **tsc 0**; unit green when isolated (earlier full-suite flake on unrelated prefetch test under load — not reproducible alone) | soft package.json; hard remainder unit tests w/ #533 |
| 527 | clean | — | tsc 0 | **package.json** w/ #532/#536; **ci.yml** w/ #530/#522/#534/#520 |
| 528 | clean | — | tsc 0 | soft #529 `tablet-gl.ts`; #520 `storage.ts` |
| 529 | clean | — | tsc 0 | #533 3D boards; #518/#520 juggle/polyomino |
| 530 | clean | — | tsc 0 | #522 playwright/main; #518/#520 board-ui a11y; #527 ci cache contract |
| 531 | clean | — | tsc 0 | #522/#530 `main.ts`; #510 routes (skip) |
| 532 | clean | — | tsc 0 | **package.json** w/ #527/#536 |
| 533 | clean | — | tsc 0 | #529 3D boards; #526 remainder tests; #518/#520 remainder/shell |
| 534 | clean | — | tsc 0 | #524 `vite.config.ts`; ci.yml peers |
| 535 | clean | — | tsc 0 | #520 `logic.ts` / `arithmetic.ts` |
| 536 | clean | — | tsc 0 | **package.json** w/ #527/#532 (fold last) |

---

## Pairwise conflict matrix

### A. Clean-on-tip set — real sequential merges (`tip → A → B`)

Among PRs that merge cleanly onto tip alone (`526–536`), **only** these pairs produced textual conflicts (both orders):

| Pair | Files | Resolution |
|---|---|---|
| **#527 × #532** | `package.json` | Union `scripts` + `devDependencies` (add `check:workflows` and `report:licenses` / `js-yaml`) |
| **#527 × #536** | `package.json` | Union scripts (`check:workflows` + `report:dead-code`) |
| **#532 × #536** | `package.json` | Union scripts (`report:licenses` + `report:dead-code`) |

All other pairs among `{526,527,528,529,530,531,532,533,534,535,536}` were **clean** in `tip→A→B` order (52 clean pair results).

### B. Hard file-overlap matrix (non-`package.json`) for foldable + conflicted drafts

Cells list overlapping paths that are likely to need a 3-way resolve when both land. Soft `package.json`-only overlaps are omitted here (always resolve by **script/dep union**).

|  | 518 | 520 | 522 | 524 | 526 | 527 | 528 | 529 | 530 | 531 | 532 | 533 | 534 | 535 | 536 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| **518** | — | many game UI/controllers | | | | | | juggle board | contig/fab/frac board | | | remainder board | | | |
| **520** | (sym) | — | ci.yml | | | ci.yml | storage.ts | polyomino + 3D boards + juggle | ci.yml + graph-ui + boards | main.ts | | remainder + shell + owl + 3D | ci.yml | attributes/fractions | |
| **522** | | (sym) | — | | | ci.yml | | | ci.yml + playwright + main | main.ts | | | ci.yml | | |
| **524** | | | | — | | | | | | | | | **vite.config.ts** | | |
| **526** | | | | | — | | | | | | | remainder unit tests | | | |
| **527** | | (sym) | (sym) | | | — | | | **ci.yml** | | package.json | | ci.yml | | package.json |
| **528** | | (sym) | | | | | — | tablet-gl.ts | | | | | | | |
| **529** | (sym) | (sym) | | | | | (sym) | — | | | | **7× `*-board-3d.ts`** | | | |
| **530** | (sym) | (sym) | (sym) | | | (sym) | | | — | main.ts | | game-play.css | ci.yml | | |
| **531** | | (sym) | (sym) | | | | | | (sym) | — | | | | | |
| **533** | (sym) | (sym) | | | (sym) | | | (sym) | (sym) | | | — | | | |
| **534** | | (sym) | (sym) | (sym) | | (sym) | | | (sym) | | | | — | | |
| **535** | | (sym) | | | | | | | | | | | | — | |
| **536** | | | | | | (sym) | | | | | (sym) | | | | — |

Skipped twins **#503/#505/#506/#510/#511** also hard-overlap tip-owned paths (engines, fullgame, render-perf, type-ratchet, UI coverage) — do not fold.

### C. Semantic interactions found only after cumulative merge

These did **not** show as tip-alone textual conflicts but broke `test:unit` / `build` until resolved:

| Interaction | Symptom | Correct resolution |
|---|---|---|
| **#530 → #527** | `workflow-contract` fails: `forced-colors` job missing `cache: npm` + `cache-dependency-path: package-lock.json` | After both land, patch every `actions/setup-node` job (including `forced-colors` / `zoom-reflow`) to match #527’s contract |
| **#522 → playwright** | Taking #522’s `playwright.config.ts` drops #530’s `forced-colors` project | Merge **both** project blocks (`forced-colors` + `zoom-reflow`) |
| **#534 → #524** | Keeping only one `vite.config.ts` breaks the other: #524 wants `includeManifestIcons: false` + CNAME-only `includeAssets`; #534 owns installability manifest literals | Start from **#534** vite/manifest, then port #524 Workbox icon dedupe + visualizer/repro bits |
| **#518/#520 → #530** | Taking dedupe/lint versions of `contig-60` / `frac-fact` `board-ui.ts` strips reduced-motion keepers | On those two files, **keep tip/#530** (a11y), take #518/#520 elsewhere |
| **#520 → star-track** | #520 lint pass **deletes** tip `HUMAN_SEAT_SETTLE_MS` input-race guards → `input-race-star-track-click-through` fails | Restore tip seat-settle helpers + call sites; keep only #520 `import type` style |
| **#524 deps** | `rollup-plugin-visualizer` added to `package.json` but not installed | Run `npm install` (watch **js-yaml** override: align `devDependencies.js-yaml` with `overrides.js-yaml`, e.g. both `4.3.2`) |

---

## Recommended fold order (with reasons)

**Skip first (do not fold):** #503, #505, #506, #510, #511 (twins/superseded — table above).

Then fold in this order onto the tip:

| Step | PR | Why here |
|---:|---|---|
| 1 | **#535** math precision | Isolated core math + tests; touches files #520 will later lint — land truth first |
| 2 | **#531** history routing | Nav/`main.ts`/`game-route-mounts` before a11y PRs that also touch `main.ts` |
| 3 | **#528** storage failure | Core storage wrapper; before lint-ratchet touches `storage.ts` |
| 4 | **#526** test fixtures | Wide test-only churn; before #533 remainder tests that share fixtures |
| 5 | **#529** canvas DPR | 3D/`tablet-gl` before #533 pointer hygiene on the same boards |
| 6 | **#533** pointer edge cases | Builds on #529 board surfaces; before broad #518/#520 UI rewrites |
| 7 | **#530** forced-colors | CSS + board injectors + ci/playwright project; before zoom-reflow and before workflow contract |
| 8 | **#522** zoom-reflow | Combine `main.ts` (keep history+forced-colors imports, add zoom CSS), union package scripts, **merge playwright projects** |
| 9 | **#534** PWA manifest | Land installability contract **before** #524 so vite/manifest baseline is #534 |
| 10 | **#524** build repro | Union package.json; port Workbox icon dedupe + visualizer onto #534 vite; `npm install` |
| 11 | **#527** CI workflows | Lockfile cache contract; then **patch** forced-colors/zoom-reflow setup-node jobs |
| 12 | **#532** license SBOM | package.json script union only |
| 13 | **#518** UI helper dedupe | Large refactor; keep #530 contig/frac-fact board-ui; take dedupe elsewhere *(if not already merged into tip)* |
| 14 | **#520** lint ratchet | Broadest touch set last among code; keep tip star-track seat-settle; keep #530 a11y board-ui; take lint fixes elsewhere |
| 15 | **#536** dead-code inventory | **Last** — report-only knip inventory; package.json script union |

---

## Cumulative merge results (recommended order + resolutions)

Scratch branch: `scratch/wave5-fold-rehearsal-cumul-v2` (local only, not pushed).  
Base: `ac327bb5`. Skipped twins. Applied resolutions from the tables above.

### Per-step merge outcome

| PR | Result |
|---:|---|
| 535, 531, 528, 526, 529, 533, 530, 534, 527 | clean |
| 522 | resolved (`development.md` keep tip + zoom pointer; `main.ts` keep tip + zoom CSS import; playwright merge both projects; package.json union) |
| 524 | resolved (package.json union; vite keep #534 then port #524 icon dedupe + visualizer) |
| 532, 536 | resolved (package.json union) |
| 518 | resolved (keep #530 contig/frac-fact board-ui; theirs elsewhere) |
| 520 | resolved (take lint; **restore tip star-track seat-settle**; keep a11y board-ui) |

### Naive cumulative (take-theirs everywhere) — for contrast

Without the semantic resolutions above, cumulative `test:unit` failed **8** tests and `build` failed (missing visualizer install + workflow/pwa/a11y/star-track interactions). Those failures are exactly the interaction table in §C.

### Verification commands (after recommended resolutions)

Run in the cumulative scratch tree (with deps installed for new `package.json` entries):

```bash
npm run lint
npx tsc --noEmit
npm run test:unit
npm run build
```

| Command | Exit | Notes |
|---|---:|---|
| `npm run lint` | **0** | eslint src clean |
| `npx tsc --noEmit` | **0** | no diagnostics |
| `npm run test:unit` | **0** | **3100** files passed; **11666** tests passed; 5 skipped |
| `npm run build` | **0** | `tsc && vite build` + PWA generateSW (68 precache entries) |

---

## Owner cheat-sheet (fast fold)

1. Close/skip: **#503, #505, #506, #510, #511**.
2. Fold 535 → 531 → 528 → 526 → 529 → 533 → 530.
3. Fold **#522** with combined `main.ts` + dual playwright projects.
4. Fold **#534** then **#524** (vite = 534∪524 Workbox); `npm install`; fix js-yaml override alignment if npm errors.
5. Fold **#527**; patch setup-node cache fields on a11y jobs; run `npm run check:workflows`.
6. Fold **#532**.
7. Fold **#518** / **#520** if still open: protect #530 board-ui + tip star-track seat-settle.
8. Fold **#536** last.
9. Gate: `npm run lint && npx tsc --noEmit && npm run test:unit && npm run build`.

---

## Method notes

- Individual textual: real `git merge --no-ff` onto `ac327bb5` in `/tmp/fold-scratch`.
- Pairwise among clean set: real `tip → A → B` (and reverse on conflict).
- Semantic tip-alone: `npx tsc --noEmit` for each clean PR (all 0). Full unit suite reserved for cumulative (cost).
- File-overlap matrix from `git diff --name-only tip...head`.
- No player-facing copy, scoring, AI, Stars & Bars history, or Hex Hard 450ms assert changes in this deliverable (report only).
