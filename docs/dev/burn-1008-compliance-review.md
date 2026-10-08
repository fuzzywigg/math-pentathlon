# burn-1008 compliance review (independent pass)

**Task id:** `burn-1008-mp-compliance-review`  
**Reviewer branch tip (base):** `cursor/integration-fold-wave5-tip-4af0` @ `ac327bb5`  
**Scope:** every **open draft** PR whose base is that tip (enumerated live via `gh pr list`; range originally cited as #503–#536, plus #537 which opened during review).  
**Method:** `gh pr diff <n>` for each PR; hard-rule greps across saved diffs; live tip tree cross-check for already-folded supersessions.  
**This deliverable:** report only — no edits to other PR branches.

## Hard rules checked

| Rule | Signal |
| --- | --- |
| AI search / scoring / difficulty / think-time | `ai.ts` logic, deadlines, evaluate/search |
| Legal-move generation / outcome / scoring | `rules.ts` apply/validate/score paths |
| Player-facing copy / tutorial / rules-text | status strings, tutorials, How-to |
| Stars & Bars history cap | `moveHistory` trim / cap |
| Hex Hard 450ms assert | `AI_PLAY_DEADLINE_MS.hard` / `toBe(450)` |
| Workflow permission widening | `contents: write`, missing `persist-credentials: false` |
| Tests deleted / weakened | removed expects, new skips on existing required coverage, raised thresholds |
| New **runtime** dependencies | `package.json` `dependencies` (not scripts/dev) |
| Forbidden topics | openclaw / Merom / Sullivan / meromhouse / pappas-infrastructure |
| Real bugs visible in diff | wrong control flow, missing cleanup, layering that breaks tip ratchets |

**Global scan result:** no open draft changes Stars & Bars history cap, Hex Hard `450` assert, live openclaw/Merom paths, `apt`/`pip` CI installs, or `persist-credentials: true` / `contents: write` in workflow *production* YAML (only negative-test fixtures inside #527’s contract suite).

## Summary table

| PR | Title (short) | Verdict |
| ---: | --- | --- |
| [#503](https://github.com/fuzzywigg/math-pentathlon/pull/503) | Phase 2 type-ratchet plan + baseline | **needs-owner-decision** |
| [#505](https://github.com/fuzzywigg/math-pentathlon/pull/505) | HvH fullgame e2e (report-only) | **needs-owner-decision** |
| [#506](https://github.com/fuzzywigg/math-pentathlon/pull/506) | Engine contributor docs (20 games) | **needs-owner-decision** |
| [#510](https://github.com/fuzzywigg/math-pentathlon/pull/510) | Non-engine UI unit coverage | **clean** |
| [#511](https://github.com/fuzzywigg/math-pentathlon/pull/511) | Board hover/rebuild latency | **clean** |
| [#518](https://github.com/fuzzywigg/math-pentathlon/pull/518) | UI helper dedupe | **violation** |
| [#520](https://github.com/fuzzywigg/math-pentathlon/pull/520) | Lint-rule ratchet | **clean** |
| [#522](https://github.com/fuzzywigg/math-pentathlon/pull/522) | Zoom + reflow a11y (report-only) | **clean** |
| [#524](https://github.com/fuzzywigg/math-pentathlon/pull/524) | Reproducible Vite/PWA builds | **clean** |
| [#526](https://github.com/fuzzywigg/math-pentathlon/pull/526) | Shared fixture helpers | **clean** |
| [#527](https://github.com/fuzzywigg/math-pentathlon/pull/527) | Workflow hardening + npm cache | **clean** |
| [#528](https://github.com/fuzzywigg/math-pentathlon/pull/528) | Safe Web Storage wrapper | **clean** |
| [#529](https://github.com/fuzzywigg/math-pentathlon/pull/529) | Canvas/SVG/WebGL DPR + resize | **clean** |
| [#530](https://github.com/fuzzywigg/math-pentathlon/pull/530) | Forced-colors + reduced-motion | **clean** |
| [#531](https://github.com/fuzzywigg/math-pentathlon/pull/531) | History-routing audit | **clean** |
| [#532](https://github.com/fuzzywigg/math-pentathlon/pull/532) | CycloneDX SBOM + licenses | **clean** |
| [#533](https://github.com/fuzzywigg/math-pentathlon/pull/533) | Pointer edge-case hygiene | **clean** |
| [#534](https://github.com/fuzzywigg/math-pentathlon/pull/534) | PWA installability manifest | **clean** |
| [#535](https://github.com/fuzzywigg/math-pentathlon/pull/535) | Arithmetic exactness audit | **violation** |
| [#536](https://github.com/fuzzywigg/math-pentathlon/pull/536) | Dead-code inventory (fold last) | **clean** |
| [#537](https://github.com/fuzzywigg/math-pentathlon/pull/537) | Type-ratchet Phase-2 Batch 2 | **violation** |

**Counts:** clean **15** · needs-owner-decision **3** · violation **3**

---

## Per-PR findings

### #503 — docs(dev): Phase 2 type-ratchet plan + baseline

**Verdict:** needs-owner-decision

**Evidence:** Diff adds `docs/dev/type-ratchet-phase2-baseline.json` / `type-ratchet-phase2-plan.md` as new files with `outOfScopeErrors: 564`. Live tip already contains evolved copies from the #516 fold (plan documents Batch 0+1 and ceiling **518**; export script present). Folding #503 as-is would fight tip history / regress the plan narrative.

**Smallest fix:** Close #503 without fold (work superseded). If any unique prose remains, cherry-pick only the missing sentences onto tip’s current plan — do not restore the 564 baseline over 518.

---

### #505 — test: burn-1007 HvH fullgame e2e suite

**Verdict:** needs-owner-decision

**Evidence:** Diff introduces `tests/e2e/fullgame/_harness.ts` + per-game specs importing `runFullgameMatch` from `./_harness`, plus `test.skip(({ browserName }) => browserName !== 'chromium', …)` on each new file. Tip already has the merged #507 suite under `tests/e2e/fullgame/_runner.ts` / `_shared.ts` / `_play.ts` with the same `@fullgame` report-only CI job. Hard-rule skips are on **new** report-only specs (not weakening previously required tests), but a fold would collide with tip’s harness.

**Smallest fix:** Close as duplicate of #507, or rebase and keep only deltas that tip still lacks (if any) without replacing `_runner`.

---

### #506 — docs: contributor engine reference for 20 games

**Verdict:** needs-owner-decision

**Evidence:** Diff adds `docs/dev/engines/*.md` + `scripts/check-dev-doc-links.mjs`. Tip already has the full `docs/dev/engines/` tree from merged #504; README content differs (tip 3987 B vs PR 4321 B) but topic is covered. Contributor-only (not player-facing).

**Smallest fix:** Close or rebase to a tiny unique-delta PR (link-checker / wording tip still missing) — do not re-add the whole tree.

---

### #510 — test: raise non-engine UI unit coverage

**Verdict:** clean

**Evidence:** Adds test seams (`allowGamePrefetchImportsForTests`, `resetGameMountDepsForTests`, optional `registerSW` inject / `sw-register` re-export) and unit specs. Tip already received part of this via #509; remaining shim/tests do not touch AI, rules, copy, workflows permissions, or runtime deps. No assertion deletions observed.

**Smallest fix:** n/a (rebase onto tip before fold to drop already-landed hunks).

---

### #511 — perf(render): board hover/rebuild latency

**Verdict:** clean

**Evidence:** Adds `patchHoverPreview` / `patchBoardPreview` and uses them from juggle / pent-em-in controllers so hover no longer full-`updateUI`s. Docs explicitly leave AI / Stars history / Hex 450 alone. Keyboard a11y selector tightened from `.pg-status, [role="status"]` → `.pg-status` (avoids empty `#status` live region) — not a weaken. Tip has #513 profile docs but **not** these hover patches (`patchHoverPreview` absent on tip).

**Smallest fix:** n/a.

---

### #518 — refactor(ui): dedupe game UI/glue helpers

**Verdict:** violation

**Evidence (quoted):**

```diff
# src/games/kings-quadraphages/rules.ts (engine layer)
-export function getOpponent(player: PlayerOwner): PlayerOwner {
-  return player === 'player1' ? 'player2' : 'player1';
-}
+export { getOpponentSeat as getOpponent } from '../../ui/seat-labels';
```

Same re-export pattern lands in **17** `*/types.ts` files via `export { getOpponentSeat as getOpponent } from '../../ui/seat-labels'`. Tip module-boundary ceiling (`docs/dev/module-boundaries-ceilings.json`) requires `engine_imports_ui: 0`. `scripts/check-boundaries.mjs` counts `rules.ts` → `src/ui/*` as `engine→ui`. Seat display strings themselves stay Blue/Red/You/Computer/AI (no copy rewrite), but the engine→ui edge is a fold-blocking bug.

**Smallest fix:** Move `getOpponentSeat` to `src/core/` (or keep one-line locals in `types.ts` / `rules.ts`). Never import `src/ui/seat-labels` from `rules.ts`. Re-run `npm run check:boundaries` before fold.

---

### #520 — chore(lint): TypeScript lint-rule ratchet

**Verdict:** clean

**Evidence:** Enables eslint hard rules + `lint:ratchet` curly:all ceiling; mechanical `import type` / curly braces in many `ai.ts` / `rules.ts` / tutorials. Sample brace wrap in `calla/ai.ts` preserves bodies (`return 10000 + …` stays inside the new `{ }`). No AI deadline / search changes; Hex `450` untouched; CI only adds `npm run lint:ratchet`. Owl message **strings** unchanged (type-only import split).

**Smallest fix:** n/a (still rebase — large surface).

---

### #522 — test(a11y): zoom + reflow audit (report-only)

**Verdict:** clean

**Evidence:** Report-only Playwright project + `zoom-reflow.css` layout clamps; wiki `development.md` documents the new command. Checkout keeps `persist-credentials: false`. No AI/rules/copy/history/450 changes.

**Smallest fix:** n/a.

---

### #524 — chore(build): reproducible Vite/PWA builds

**Verdict:** clean

**Evidence:** Dedupes Workbox `includeAssets` → `['CNAME']`, `includeManifestIcons: false`, sorted precache transform; unit test **retargeted** (not deleted) to assert the new contract (`includeManifestIcons: false`, CNAME-only `includeAssets`, glob still covers PNG). Dev script only — no runtime dependency.

**Smallest fix:** n/a. Coordinate with #534 if both fold (both touch PWA vite bits).

---

### #526 — test: consolidate shared unit/e2e fixture helpers

**Verdict:** clean

**Evidence:** Diff is import-path / helper moves across tests. Grep of removed vs added `expect(` / `it(`/`test(` showed **0/0** — no assertion deletes or skips introduced.

**Smallest fix:** n/a.

---

### #527 — ci: workflow hardening contract + lockfile-keyed npm cache

**Verdict:** clean

**Evidence:** Adds `cache-dependency-path: package-lock.json` and `scripts/check-workflows.mjs` that **rejects** widened permissions / `persist-credentials: true` / apt. New `js-yaml` is a **devDependency** for the checker (not a runtime app dependency). Deploy.yml still tip’s `contents: read` + allowlisted `deployments: write` — not widened by this PR.

**Smallest fix:** n/a.

---

### #528 — fix(storage): safe Web Storage wrapper

**Verdict:** clean

**Evidence:** Fail-soft `getWebStorage` / `safeGetItem` around SecurityError; feature/settings/url flags and game storage call through it. No scoring/AI/copy. Adds e2e for blocked storage.

**Smallest fix:** n/a.

---

### #529 — fix(ui): canvas/SVG/WebGL DPR + resize hit-test

**Verdict:** clean

**Evidence:** Shared `bindBoard3dLayout` (window + visualViewport + ResizeObserver) with matching `unbindLayout()` on dispose; NDC mapping via `clientToNdc`. Unit test covers cleanup. No AI/rules/history/450.

**Smallest fix:** n/a.

---

### #530 — fix(a11y): forced-colors + reduced-motion

**Verdict:** clean

**Evidence:** CSS system colors / `forced-color-adjust`; decorative animation gated (graph-ui duration → 0 under reduced motion — not AI think-time). Report-only CI job with `persist-credentials: false`.

**Smallest fix:** n/a.

---

### #531 — fix(nav): history-routing audit

**Verdict:** clean

**Evidence:** `setNotFoundHandler(() => navigate('/'))` so unknown hashes don’t leave a stale view; `_redirects` SPA fallback; route-generation helpers + tests. No game rules/AI/copy.

**Smallest fix:** n/a (owner may still want a dedicated 404 view later — out of scope).

---

### #532 — chore(licenses): CycloneDX SBOM + report:licenses

**Verdict:** clean

**Evidence:** Script + `THIRD_PARTY_NOTICES` / `docs/dev/LICENSES.md`; `report:licenses` script only; no new runtime dependency; no workflow permission edits.

**Smallest fix:** n/a.

---

### #533 — fix(ui): pointer edge-case hygiene

**Verdict:** clean

**Evidence:** `bindPrimaryPointerActivate` / context-menu suppress with returned unbinders; game-shell calls `unbindBoardContextMenu()` on destroy; 3D boards dispose listeners. Touch CSS only. No rules/AI/copy.

**Smallest fix:** n/a.

---

### #534 — fix(pwa): installability manifest contract

**Verdict:** clean

**Evidence:** Manifest `id` / `orientation: 'any'`; theme-color light/dark meta; `cleanupOutdatedCaches: true`; report-only CI check. Name/short_name unchanged. `it.skipIf(!existsSync(manifestPath))` only skips when `dist` missing (hermetic) — not loosening a required built assert path when dist exists.

**Smallest fix:** n/a. Fold coordination with #524 advised.

---

### #535 — fix(math): arithmetic exactness audit

**Verdict:** violation

**Evidence (quoted):**

```diff
# src/games/prime-gold/types.ts:59–60 (used by rules.ts cell.isPrime / scoring veins + AI)
 export function isPrime(n: number): boolean {
-  if (n < 2) return false;
+  if (!Number.isInteger(n) || n < 2) return false;
```

```diff
# src/core/attributes/logic.ts:324–341
 export function isPrime(n: number): boolean {
-  if (n < 2) return false;
+  if (!Number.isInteger(n) || n < 2) return false;
-  for (let i = 3; i <= Math.sqrt(n); i += 2) {
+  for (let i = 3; i * i <= n; i += 2) {
```

```diff
# src/core/fractions/arithmetic.ts negate / isWholeNumber
-  return { numerator: -fraction.numerator, denominator: fraction.denominator };
+  return { numerator: -signedNumerator(fraction), denominator: fraction.denominator };
```

Hard rule forbids **any** change to scoring-adjacent helpers. Tip `prime-gold/rules.ts` sets `isPrime: isPrime(val)` on board cells and scores prime veins from that flag; AI scores primes too. Even “edge-only” gates are still runtime scoring/predicate edits. Tests were rewritten to match the new `negate` semantics (flag-negative encoding).

**Smallest fix:** Revert all `src/**` edits. Keep `docs/math-precision-audit-burn-1008.md` + report-only tests that document findings **without** changing helpers (or gate fixes behind tip-owner written approval).

---

### #536 — chore: dead-code inventory (fold last)

**Verdict:** clean

**Evidence:** Report-only `docs/dev/dead-code-inventory.{md,json}`, `knip.json`, `scripts/report-dead-code.mjs`, `report:dead-code` script. No source deletions claimed (`safe-to-remove` file count 0). No runtime dependency added (knip invoked as pinned report tool). Explicitly defers topics covered by other open drafts.

**Smallest fix:** n/a — fold last as labeled.

---

### #537 — fix(types): Phase-2 type-ratchet Batch 2 (rules-heavy)

**Verdict:** violation

**Evidence (quoted from rules / apply-move paths):**

```diff
# src/games/sum-dominoes/rules.ts — placement / legality
-  if (state.board[row][col]) return false;
+  const boardRow = state.board[row];
+  if (boardRow === undefined || boardRow[col]) return false;
…
-  newBoard[position.row][position.col] = placedDomino;
+  const placeRow = newBoard[position.row];
+  if (placeRow === undefined) return state;   // was throw-on-undefined → silent no-op
```

```diff
# src/games/calla/rules.ts — sow / capture
-  return pits[pitIndex] > 0;
+  return (pits[pitIndex] ?? 0) > 0;
-  let cubesInHand = playerPits[pitIndex];
+  let cubesInHand = playerPits[pitIndex] ?? 0;
```

Also edits `frac-fact/rules.ts`, `fraction-pinball/rules.ts`, `ramrod/rules.ts`, `queens-guards/rules.ts` with `??` fallbacks and early continues. Hard rule: no legal-move / outcome path changes without owner exemption — type-ratchet nullish guards still rewrite those paths.

**Smallest fix:** Split PR: (1) docs/baseline/export + `check-type-ratchet` IN_SCOPE list + board-ui-only fixes = foldable; (2) defer all `*/rules.ts` (and game-controller apply paths) until tip owner explicitly accepts behavior-preserving proofs or an exemption. Do not fold rules hunks into tip under burn-1008 hard rules.

---

## Fold guidance for tip owner

1. **Do not fold** #518 / #535 / #537 until smallest fixes land (or written exemption).  
2. **Close or rebase-narrow** #503 / #505 / #506 (superseded by tip folds #516 / #507 / #504).  
3. **Safe-looking queue** (still rebase + conflict-check): #510, #511, #520, #522, #524, #526, #527, #528, #529, #530, #531, #532, #533, #534, #536 (last).  
4. Watch collisions: #524 ↔ #534 (PWA vite); #510 ↔ tip #509 leftovers; #511 ↔ any later board-ui edits; #520 large lint surface vs #518/#537.

## Verification commands (this review)

```bash
# Enumerate open tip drafts
gh pr list --base cursor/integration-fold-wave5-tip-4af0 --state open --draft --limit 100 \
  --json number,title --jq '.[] | "#\(.number) \(.title)"'
# → #537,#536,#535,#534,#533,#532,#531,#530,#529,#528,#527,#526,#524,#522,#520,#518,#511,#510,#506,#505,#503

git rev-parse --short HEAD
# → ac327bb5

# Fetch every diff
for n in 503 505 506 510 511 518 520 522 524 526 527 528 529 530 531 532 533 534 535 536 537; do
  gh pr diff "$n" > "/tmp/pr-diffs/${n}.diff"
done

# Hard-rule greps (history cap / Hex 450 / secret widen / forbidden topics)
rg -n 'toBeLessThan\(450\)|AI_PLAY_DEADLINE_MS|historyCap|MAX_HISTORY|moveHistory\.slice|persist-credentials:\s*true|contents:\s*write|apt-get|pip install|openclaw|meromhouse|pappas-infrastructure' /tmp/pr-diffs/*.diff
# → only intentional mentions / negative-test fixtures (see Global scan)

# Tip supersession checks
test -f docs/dev/type-ratchet-phase2-plan.md && rg -n '518|Batch' docs/dev/type-ratchet-phase2-plan.md | head
ls tests/e2e/fullgame/_runner.ts docs/dev/engines/README.md
test ! -f src/games/juggle/board-ui.ts || rg -n 'patchHoverPreview' src/games/juggle/board-ui.ts || echo 'hover patch not on tip'
rg -n 'engine_imports_ui' docs/dev/module-boundaries-ceilings.json
```

Artifacts: `/opt/cursor/artifacts/burn-1008-compliance-verification.log`
